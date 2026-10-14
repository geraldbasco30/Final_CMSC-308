package com.tasky.app;

import com.tasky.app.model.Account;
import com.tasky.app.api.RegistrationRequest;
import com.tasky.app.service.RegistrationService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.core.userdetails.UserDetailsService;
import jakarta.persistence.EntityManager;
import com.tasky.app.repo.*;
import com.tasky.app.service.TaskyService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.BeforeEach;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;
import java.util.List;
import java.util.Map;
import static org.assertj.core.api.Assertions.*;

@SpringBootTest(properties={
 "spring.datasource.url=jdbc:h2:mem:taskytest;DB_CLOSE_DELAY=-1",
 "spring.jpa.hibernate.ddl-auto=create-drop",
 "tasky.setup.owner-token="})
@Transactional
class TaskyServiceIntegrationTest {
 @Autowired TaskyService service;
 @Autowired AccountRepository accounts;
 @Autowired ProjectRepository projects;
 @Autowired TaskRepository tasks;
 @Autowired MembershipRepository memberships;
 @Autowired EntityManager entityManager;
 @Autowired RegistrationService registrations;
 @Autowired PasswordEncoder passwordEncoder;
 @Autowired UserDetailsService userDetailsService;

 @BeforeEach void registerInitialOwner() {
  // The real application starts with no accounts; the first web registration claims the owner role.
  var first=registrations.register(new RegistrationRequest("Tasky Test Administrator", "test.admin@tasky.local", "TestOnlyStrongPassword123!", "TestOnlyStrongPassword123!"));
  assertThat(first.role).isEqualTo("ADMIN");
 }
 private Account admin(){return accounts.findByEmailIgnoreCase("test.admin@tasky.local").orElseThrow();}
 private Map<String,Object> project(){return service.newProject(Map.of("name","Test project","key","TEST","description","Integration tests"),admin());}

 @Test void startsWithAdministratorAndNoFakeProjectsOrTasks(){
  var snapshot=service.snapshot(admin());
  assertThat((List<?>)snapshot.get("projects")).isEmpty();
  assertThat((List<?>)snapshot.get("tasks")).isEmpty();
  assertThat((List<?>)snapshot.get("members")).hasSize(1);
 }
 @Test void createsAndMovesTaskWithPersistentCompletionTimestamp(){
  var project=project();
  var created=service.newTask(Map.of("projectId",project.get("id"),"title","Write proposal","priority","HIGH","status","TODO"),admin());
  assertThat(created.get("key")).isEqualTo("TEST-101");
  var done=service.changeStatus((String)created.get("id"),Map.of("status","DONE"),admin());
  assertThat(done.get("completedAt")).isNotNull();
  var reopened=service.changeStatus((String)created.get("id"),Map.of("status","REVIEW"),admin());
  assertThat(reopened.get("completedAt")).isNull();
 }
 @Test void completedTasksCanReopenToTodoAndNewTodoTasksRemainCreatable(){
  var p=project();
  String projectId=(String)p.get("id");
  var task=service.newTask(Map.of("projectId",projectId,"title","Finish and reopen"),admin());
  String taskId=(String)task.get("id");
  var finished=service.changeStatus(taskId,Map.of("status","DONE","version",task.get("version")),admin());
  assertThat(finished.get("completedAt")).isNotNull();
  var reopened=service.changeStatus(taskId,Map.of("status","TODO","version",finished.get("version")),admin());
  assertThat(reopened.get("status")).isEqualTo("TODO");
  assertThat(reopened.get("completedAt")).isNull();
  var another=service.newTask(Map.of("projectId",projectId,"title","Another To Do","status","TODO"),admin());
  assertThat(another.get("status")).isEqualTo("TODO");
  assertThat(another.get("key")).isNotEqualTo(task.get("key"));
  entityManager.flush();
  entityManager.clear();
  var snapshot=service.snapshot(admin());
  @SuppressWarnings("unchecked") var all=(List<Map<String,Object>>)snapshot.get("tasks");
  assertThat(all).filteredOn(t -> projectId.equals(t.get("projectId"))).hasSize(2);
  assertThat(all).filteredOn(t -> taskId.equals(t.get("id")))
   .singleElement().satisfies(t -> {
    assertThat(t.get("status")).isEqualTo("TODO");
    assertThat(t.get("completedAt")).isNull();
   });
 }
 @Test void projectMemberPermissionsEnforced(){
  var p=project();
  var newUser=service.newMember(Map.of("name","Contributor","email","contributor@tasky.local","password","StrongMemberPassword123!","role","MEMBER"),admin());
  var user=accounts.findById((String)newUser.get("id")).orElseThrow();
  assertThatThrownBy(()->service.newTask(Map.of("projectId",p.get("id"),"title","Forbidden"),user))
   .isInstanceOf(ResponseStatusException.class).hasMessageContaining("403");
  service.setProjectMembers((String)p.get("id"),Map.of("memberIds",List.of(user.id)),admin());
  assertThat(service.newTask(Map.of("projectId",p.get("id"),"title","Allowed","assigneeId",user.id),user).get("title")).isEqualTo("Allowed");
  var memberProject=service.newProject(Map.of("name","Contributor project","key","CNT"),user);
  assertThat(memberProject.get("leadId")).isEqualTo(user.id);
  assertThat(service.newTask(Map.of("projectId",memberProject.get("id"),"title","Own work"),user).get("title")).isEqualTo("Own work");
 }
 @Test void disablingMemberBlocksRequestsAndUnassignsWork(){
  var p=project();
  var created=service.newMember(Map.of("name","Staff","email","staff@tasky.local","password","StrongMemberPassword123!"),admin());
  String id=(String)created.get("id");
  service.setProjectMembers((String)p.get("id"),Map.of("memberIds",List.of(id)),admin());
  var task=service.newTask(Map.of("title","Assigned work","projectId",p.get("id"),"assigneeId",id),admin());
  service.editMember(id,Map.of("enabled",false),admin());
  assertThat(service.task(tasks.findById((String)task.get("id")).orElseThrow()).get("assigneeId")).isNull();
  assertThatThrownBy(()->service.current("staff@tasky.local"))
   .isInstanceOf(ResponseStatusException.class).hasMessageContaining("403");
 }
 @Test void projectDeletionRemovesDependents(){
  var p=project();
  var t=service.newTask(Map.of("projectId",p.get("id"),"title","To delete"),admin());
  service.addComment((String)t.get("id"),Map.of("body","Remove me"),admin());
  service.deleteProject((String)p.get("id"),admin());
  assertThat(projects.existsById((String)p.get("id"))).isFalse();
  assertThat(tasks.existsById((String)t.get("id"))).isFalse();
  assertThat(memberships.findByProjectId((String)p.get("id"))).isEmpty();
 }
 @Test void requiresCurrentPasswordToChangeOwnPassword(){
  assertThatThrownBy(()->service.changePassword(Map.of("currentPassword","incorrect","newPassword","AnotherStrongPassword123!"),admin()))
   .isInstanceOf(ResponseStatusException.class).hasMessageContaining("400");
  service.changePassword(Map.of("currentPassword","TestOnlyStrongPassword123!","newPassword","AnotherStrongPassword123!"),admin());
  assertThat(admin().passwordHash).isNotEqualTo("TestOnlyStrongPassword123!");
 }
 @Test void dragDropStatusTransitionIncrementsVersionAndRejectsStaleMoves(){
  var p=project();
  var t=service.newTask(Map.of("projectId",p.get("id"),"title","Drag-and-drop card"),admin());
  String id=(String)t.get("id");
  long initial=((Number)t.get("version")).longValue();
  var moved=service.changeStatus(id,Map.of("status","IN_PROGRESS","version",initial),admin());
  assertThat(moved.get("status")).isEqualTo("IN_PROGRESS");
  assertThat(((Number)moved.get("version")).longValue()).isGreaterThan(initial);
  assertThatThrownBy(()->service.changeStatus(id,Map.of("status","REVIEW","version",initial),admin()))
   .isInstanceOf(ResponseStatusException.class).hasMessageContaining("409");
  var done=service.changeStatus(id,Map.of("status","DONE","version",moved.get("version")),admin());
  assertThat(done.get("completedAt")).isNotNull();
 }
 @Test void taskOperationsWorkAfterLoadingFreshLazyRelations(){
  // Production HTTP requests do not share the persistence context used to create a task.
  // Loading again exposes LAZY project/creator/assignee proxy identifiers.
  var p=project();
  var original=service.newTask(Map.of("projectId",p.get("id"),"title","Fresh request task"),admin());
  String taskId=(String)original.get("id");
  String currentAdminId=admin().id;
  entityManager.flush();
  entityManager.clear();

  var moved=service.changeStatus(taskId,Map.of("status","IN_PROGRESS","version",original.get("version")),admin());
  assertThat(moved.get("status")).isEqualTo("IN_PROGRESS");
  assertThat(moved.get("projectId")).isEqualTo(p.get("id"));
  entityManager.flush();
  entityManager.clear();

  var edited=service.editTask(taskId,Map.of("title","Updated in a new request","assigneeId",currentAdminId),admin());
  assertThat(edited.get("title")).isEqualTo("Updated in a new request");
  assertThat(edited.get("assigneeId")).isEqualTo(currentAdminId);
  entityManager.flush();
  entityManager.clear();

  var fetched=service.snapshot(admin());
  @SuppressWarnings("unchecked")
  var all=(List<Map<String,Object>>)fetched.get("tasks");
  var task=all.stream().filter(x->taskId.equals(x.get("id"))).findFirst().orElseThrow();
  assertThat(task.get("creatorId")).isEqualTo(currentAdminId);
  assertThat(task.get("assigneeId")).isEqualTo(currentAdminId);
  assertThat(task.get("projectId")).isEqualTo(p.get("id"));
  assertThat(task.get("status")).isEqualTo("IN_PROGRESS");
 }

 @Test void aNewUnassignedTaskStillHasCreatorForMyWork(){
  var p=project();
  var t=service.newTask(Map.of("projectId",p.get("id"),"title","Track my new idea"),admin());
  assertThat(t.get("creatorId")).isEqualTo(admin().id);
  assertThat(t.get("assigneeId")).isNull();
  assertThat(((List<Map<String,Object>>)service.snapshot(admin()).get("tasks")))
   .anySatisfy(item->{assertThat(item.get("id")).isEqualTo(t.get("id"));assertThat(item.get("creatorId")).isEqualTo(admin().id);});
 }

 @Test void multiplePeopleCanRegisterAndAuthenticateIndependently(){
  var one = registrations.register(new RegistrationRequest("First Colleague", "  FIRST@EXAMPLE.COM ", "FirstStrongPassword2026!", "FirstStrongPassword2026!"));
  var two = registrations.register(new RegistrationRequest("Second Colleague", "second@example.com", "SecondStrongPassword2026!", "SecondStrongPassword2026!"));
  assertThat(one.id).isNotEqualTo(two.id);
  assertThat(one.email).isEqualTo("first@example.com");
  assertThat(two.email).isEqualTo("second@example.com");
  assertThat(one.role).isEqualTo("MEMBER");
  assertThat(two.role).isEqualTo("MEMBER");
  assertThat(one.passwordHash).isNotEqualTo("FirstStrongPassword2026!");
  assertThat(passwordEncoder.matches("FirstStrongPassword2026!", one.passwordHash)).isTrue();
  assertThat(passwordEncoder.matches("SecondStrongPassword2026!", two.passwordHash)).isTrue();
  assertThat(passwordEncoder.matches("WrongPassword2026!", one.passwordHash)).isFalse();
  assertThat(userDetailsService.loadUserByUsername("first@example.com").getAuthorities())
   .anySatisfy(authority -> assertThat(authority.getAuthority()).isEqualTo("ROLE_MEMBER"));
  assertThat(service.snapshot(one).get("projects")).isEqualTo(List.of());
  assertThat(service.snapshot(two).get("projects")).isEqualTo(List.of());
  // Existing administrators and their data must remain intact.
  assertThat(admin().role).isEqualTo("ADMIN");
  assertThat(((List<?>)service.snapshot(admin()).get("members"))).hasSize(3);
 }

 @Test void rejectsDuplicateEmailEvenWithDifferentLetterCase(){
  registrations.register(new RegistrationRequest("Third User", "third@example.com", "StrongPasswordNumber123!", "StrongPasswordNumber123!"));
  assertThatThrownBy(() -> registrations.register(new RegistrationRequest("Other User", "THIRD@EXAMPLE.COM", "OtherStrongPassword123!", "OtherStrongPassword123!")))
   .isInstanceOf(ResponseStatusException.class).hasMessageContaining("409");
 }

 @Test void rejectsNonMatchingAndUnsafePasswords(){
  assertThatThrownBy(() -> registrations.register(new RegistrationRequest("Mismatch User", "mismatch@example.com", "StrongPasswordNumber123!", "DifferentPassword123!")))
   .isInstanceOf(ResponseStatusException.class).hasMessageContaining("400");
  assertThatThrownBy(() -> registrations.register(new RegistrationRequest("Short User", "short@example.com", "short", "short")))
   .isInstanceOf(ResponseStatusException.class).hasMessageContaining("400");
  assertThatThrownBy(() -> registrations.register(new RegistrationRequest("Long User", "long@example.com", "a".repeat(73), "a".repeat(73))))
   .isInstanceOf(ResponseStatusException.class).hasMessageContaining("400");
  assertThatThrownBy(() -> registrations.register(new RegistrationRequest("Bad Email", "no-at-sign", "ValidSecurePassword123!", "ValidSecurePassword123!")))
   .isInstanceOf(ResponseStatusException.class).hasMessageContaining("400");
 }

 @Test void registeredMemberSeesOnlyProjectsTheyAreAddedTo(){
  var privateProject = project();
  var member = registrations.register(new RegistrationRequest("New Teammate", "teammate@example.com", "TeammateStrongPassword123!", "TeammateStrongPassword123!"));
  assertThat((List<?>)service.snapshot(member).get("projects")).isEmpty();
  var independentProject = service.newProject(Map.of("name","Own project", "key","OWN"), member);
  assertThat(independentProject.get("leadId")).isEqualTo(member.id);
  assertThat(((List<?>)service.snapshot(member).get("projects"))).hasSize(1);
  service.setProjectMembers((String)privateProject.get("id"), Map.of("memberIds", List.of(member.id)), admin());
  assertThat((List<?>)service.snapshot(member).get("projects")).hasSize(2);
  assertThat(service.newTask(Map.of("projectId",privateProject.get("id"),"title","Teammate's first task"),member).get("creatorId"))
   .isEqualTo(member.id);
 }

 @Test void newlyRegisteredMembersStartAndManageTheirOwnProjectsWithoutAdminApproval(){
  var owner = registrations.register(new RegistrationRequest("Project Owner", "owner2@example.com", "OwnerPassword123456!", "OwnerPassword123456!"));
  var stranger = registrations.register(new RegistrationRequest("Private User", "stranger2@example.com", "StrangerPassword123456!", "StrangerPassword123456!"));
  assertThat(owner.role).isEqualTo("MEMBER");
  assertThat(stranger.role).isEqualTo("MEMBER");
  var created = service.newProject(Map.of("name", "Independent workspace", "key", "SELF"), owner);
  assertThat(created.get("leadId")).isEqualTo(owner.id);
  assertThat(memberships.existsByProjectIdAndAccountId((String)created.get("id"), owner.id)).isTrue();
  assertThat(owner.role).isEqualTo("MEMBER");
  assertThat((List<?>)service.snapshot(owner).get("projects")).hasSize(1);
  assertThat((List<?>)service.snapshot(stranger).get("projects")).isEmpty();
  var first = service.newTask(Map.of("projectId", created.get("id"), "title", "My first task", "status", "TODO", "assigneeId", owner.id), owner);
  assertThat(first.get("creatorId")).isEqualTo(owner.id);
  assertThat(first.get("assigneeId")).isEqualTo(owner.id);
  var completed = service.changeStatus((String)first.get("id"), Map.of("status", "DONE"), owner);
  var reopened = service.changeStatus((String)first.get("id"), Map.of("status", "TODO"), owner);
  assertThat(completed.get("completedAt")).isNotNull();
  assertThat(reopened.get("completedAt")).isNull();
  assertThatThrownBy(()->service.newTask(Map.of("projectId",created.get("id"),"title","Unauthorized"), stranger))
   .isInstanceOf(ResponseStatusException.class).hasMessageContaining("403");
  assertThatThrownBy(()->service.editProject((String)created.get("id"),Map.of("name","Hijacked"),stranger))
   .isInstanceOf(ResponseStatusException.class).hasMessageContaining("403");
 }

 @Test void selfServiceProjectLeadsCanInviteRegisteredTeammatesByEmailWithoutElevatedRole(){
  var owner = registrations.register(new RegistrationRequest("Lead One", "lead1@example.com", "LeadPassword123456!", "LeadPassword123456!"));
  var invited = registrations.register(new RegistrationRequest("Team Two", "team2@example.com", "TeamPassword123456!", "TeamPassword123456!"));
  var outsider = registrations.register(new RegistrationRequest("Lead Three", "lead3@example.com", "OtherPassword123456!", "OtherPassword123456!"));
  var owned = service.newProject(Map.of("name", "Private board", "key", "PRIV"), owner);
  String projectId = (String)owned.get("id");
  assertThat((List<?>)service.snapshot(invited).get("projects")).isEmpty();
  assertThatThrownBy(()->service.inviteProjectMember(projectId,Map.of("email", invited.email),outsider))
   .isInstanceOf(ResponseStatusException.class).hasMessageContaining("403");
  assertThatThrownBy(()->service.inviteProjectMember(projectId,Map.of("email","missing@example.com"),owner))
   .isInstanceOf(ResponseStatusException.class).hasMessageContaining("404");
  service.inviteProjectMember(projectId,Map.of("email","TEAM2@EXAMPLE.COM"),owner);
  assertThat(memberships.existsByProjectIdAndAccountId(projectId,invited.id)).isTrue();
  assertThat((List<?>)service.snapshot(invited).get("projects")).hasSize(1);
  assertThat((List<?>)service.snapshot(outsider).get("projects")).isEmpty();
  var task=service.newTask(Map.of("projectId",projectId,"title","Collaborate","assigneeId",invited.id),owner);
  assertThat(task.get("assigneeId")).isEqualTo(invited.id);
  service.inviteProjectMember(projectId,Map.of("email",invited.email),owner);
  assertThat(memberships.findByProjectId(projectId)).hasSize(2);
 }

}
