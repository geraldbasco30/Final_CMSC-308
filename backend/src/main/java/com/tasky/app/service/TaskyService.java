package com.tasky.app.service;
import com.tasky.app.model.*;
import com.tasky.app.repo.*;
import jakarta.transaction.Transactional;
import jakarta.persistence.EntityManagerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import java.time.*;
import java.util.*;
import java.util.stream.Collectors;

@Service @Transactional
public class TaskyService {
 private final AccountRepository accounts;
 private final ProjectRepository projects;
 private final MembershipRepository memberships;
 private final TaskRepository tasks;
 private final ActivityRepository activities;
 private final CommentRepository comments;
 private final PasswordEncoder encoder;
 private final EntityManagerFactory entityManagerFactory;
 public TaskyService(AccountRepository a,ProjectRepository p,MembershipRepository m,TaskRepository t,ActivityRepository h,CommentRepository c,PasswordEncoder e,EntityManagerFactory emf){accounts=a;projects=p;memberships=m;tasks=t;activities=h;comments=c;encoder=e;entityManagerFactory=emf;}
 private String id(){return UUID.randomUUID().toString();}
 /**
  * Foreign-key identifiers must be obtained through JPA. A lazy Hibernate proxy
  * can hold the real primary key while its inherited public `id` field is null.
  * Direct relation.id reads can give a null creator/assignee ID in /bootstrap
  * or pass a null project ID into permission checks for task edits and moves.
  */
 private String entityId(Object relation){
  if(relation==null)return null;
  Object key=entityManagerFactory.getPersistenceUnitUtil().getIdentifier(relation);
  return key==null?null:key.toString();
 }
 private String required(String s,String field,int max){
  if(s==null || s.isBlank()) throw bad(field+" is required");
  if(s.trim().length()>max) throw bad(field+" exceeds "+max+" characters");
  return s.trim();
 }
 private ResponseStatusException bad(String s){return new ResponseStatusException(HttpStatus.BAD_REQUEST,s);}
 private ResponseStatusException forbidden(){return new ResponseStatusException(HttpStatus.FORBIDDEN,"You don't have permission to perform this action");}
 private <T> T find(Optional<T> o,String type){return o.orElseThrow(()->new ResponseStatusException(HttpStatus.NOT_FOUND,type+" not found"));}
 public Account current(String email){
  Account account=find(accounts.findByEmailIgnoreCase(email),"Account");
  if (!account.enabled) throw forbidden();
  return account;
 }
 private boolean elevated(Account a){return "ADMIN".equals(a.role)||"MANAGER".equals(a.role);}
 private void manager(Account a){if(!elevated(a)) throw forbidden();}
 private Project allowedProject(String id,Account a){
  Project p=find(projects.findById(id),"Project");
  if(!elevated(a) && !memberships.existsByProjectIdAndAccountId(id,a.id))throw forbidden();
  return p;
 }
 private void manageProject(Project p,Account a){
  if(elevated(a))return;
  // A task's project may be an uninitialized proxy: resolve the real entity
  // before inspecting fields such as lead, otherwise project leads lose access.
  Project managed=allowedProject(entityId(p),a);
  if(managed.lead!=null && a.id.equals(entityId(managed.lead)))return;
  throw forbidden();
 }
 private TaskItem allowedTask(String id,Account a){ TaskItem t=find(tasks.findById(id),"Task"); allowedProject(entityId(t.project),a); return t; }
 private String option(String value,String d,String... allowed){
  String v=value==null||value.isBlank()?d:value.trim().toUpperCase(Locale.ROOT);
  if(!Arrays.asList(allowed).contains(v))throw bad("Invalid value: "+v);
  return v;
 }
 public Map<String,Object> snapshot(Account me){
  List<Project> visible=projects.findAll().stream().filter(p->elevated(me)||memberships.existsByProjectIdAndAccountId(p.id,me.id)).sorted(Comparator.comparing((Project p)->p.createdAt).reversed()).toList();
  Set<String> allowedIds=visible.stream().map(p->p.id).collect(Collectors.toSet());
  List<TaskItem> allTasks=tasks.findAll().stream().filter(t->allowedIds.contains(entityId(t.project))).sorted(Comparator.comparing((TaskItem t)->t.createdAt).reversed()).toList();
  Set<String> taskIds=allTasks.stream().map(t->t.id).collect(Collectors.toSet());
  List<Activity> recent=activities.findAll().stream().filter(a->a.project!=null&&allowedIds.contains(entityId(a.project)) || elevated(me)&&a.project==null).sorted(Comparator.comparing((Activity a)->a.createdAt).reversed()).limit(250).toList();
  List<TaskComment> allComments=comments.findAll().stream().filter(c->taskIds.contains(entityId(c.task))).sorted(Comparator.comparing((TaskComment c)->c.createdAt)).toList();
  var accessMembers=memberships.findAll().stream().filter(m->allowedIds.contains(entityId(m.project))).toList();
  Set<String> memberIds=accessMembers.stream().map(m->entityId(m.account)).collect(Collectors.toSet()); memberIds.add(me.id);
  return Map.of("me",user(me),"projects",visible.stream().map(this::project).toList(),
    "members",accounts.findAll().stream().filter(a->elevated(me)||memberIds.contains(a.id)).map(this::user).toList(),
    "memberships",accessMembers.stream().map(this::membership).toList(),
    "tasks",allTasks.stream().map(this::task).toList(),"activities",recent.stream().map(this::activity).toList(),
    "comments",allComments.stream().map(this::comment).toList());
 }
 public Map<String,Object> user(Account a){return map("id",a.id,"name",a.name,"email",a.email,"role",a.role,"title",a.title,"color",a.color,"enabled",a.enabled);}
 public Map<String,Object> project(Project p){return map("id",p.id,"name",p.name,"key",p.projectKey,"description",p.description,"status",p.status,"color",p.color,"startDate",p.startDate,"targetDate",p.targetDate,"leadId",p.lead==null?null:entityId(p.lead),"createdAt",p.createdAt);}
 public Map<String,Object> membership(ProjectMembership m){return map("id",m.id,"projectId",entityId(m.project),"memberId",entityId(m.account),"projectRole",m.projectRole);}
 public Map<String,Object> task(TaskItem t){return map("id",t.id,"key",t.taskKey,"projectId",entityId(t.project),"title",t.title,"description",t.description,"status",t.status,"priority",t.priority,"category",t.category,"dueDate",t.dueDate,"assigneeId",t.assignee==null?null:entityId(t.assignee),"creatorId",t.creator==null?null:entityId(t.creator),"position",t.position,"createdAt",t.createdAt,"updatedAt",t.updatedAt,"completedAt",t.completedAt,"version",t.version);}
 public Map<String,Object> activity(Activity a){return map("id",a.id,"projectId",a.project==null?null:entityId(a.project),"taskId",a.task==null?null:entityId(a.task),"actorId",a.actor==null?null:entityId(a.actor),"type",a.type,"message",a.message,"createdAt",a.createdAt);}
 public Map<String,Object> comment(TaskComment c){return map("id",c.id,"taskId",entityId(c.task),"authorId",entityId(c.author),"body",c.body,"createdAt",c.createdAt);}
 private Map<String,Object> map(Object... pairs){Map<String,Object> result=new LinkedHashMap<>();for(int i=0;i<pairs.length;i+=2)result.put((String)pairs[i],pairs[i+1]);return result;}
 private void log(Project p,TaskItem t,Account actor,String type,String message){Activity a=new Activity();a.id=id();a.project=p;a.task=t;a.actor=actor;a.type=type;a.message=message;activities.save(a);}
 public List<Map<String,Object>> activityReport(Account me){
  Set<String> visible=projects.findAll().stream()
    .filter(p->elevated(me)||memberships.existsByProjectIdAndAccountId(p.id,me.id))
    .map(p->p.id).collect(Collectors.toSet());
  return activities.findAll().stream().filter(a->a.project!=null && visible.contains(entityId(a.project)) || elevated(me)&&a.project==null)
    .sorted(Comparator.comparing((Activity a)->a.createdAt).reversed()).map(this::activity).toList();
 }
 public Map<String,Object> newMember(Map<String,Object> input,Account me){
  manager(me);
  Account a=new Account();a.id=id();a.name=required(str(input,"name"),"Name",90);
  a.email=required(str(input,"email"),"Email",160).toLowerCase(Locale.ROOT);
  if(!a.email.matches("^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$"))throw bad("Enter a valid email");
  if(accounts.existsByEmailIgnoreCase(a.email))throw new ResponseStatusException(HttpStatus.CONFLICT,"Email already exists");
  String password=required(str(input,"password"),"Password",120); if(password.length()<12)throw bad("Password must be at least 12 characters");
  a.passwordHash=encoder.encode(password);a.title=str(input,"title")==null||str(input,"title").isBlank()?"Team member":required(str(input,"title"),"Title",80);
  a.color=option(str(input,"color"),"VIOLET","INDIGO","VIOLET","TEAL","ORANGE","ROSE","SKY","GREEN").toLowerCase(Locale.ROOT);a.role=option(str(input,"role"),"MEMBER","ADMIN","MANAGER","MEMBER");
  if(!"ADMIN".equals(me.role)&&!"MEMBER".equals(a.role))throw forbidden();
  accounts.save(a);return user(a);
 }
 public Map<String,Object> editMember(String id,Map<String,Object> input,Account me){
  manager(me);Account a=find(accounts.findById(id),"Member");
  if (!"ADMIN".equals(me.role) && ("ADMIN".equals(a.role) || "MANAGER".equals(a.role))) throw forbidden();
  if(input.containsKey("name"))a.name=required(str(input,"name"),"Name",90);
  if(input.containsKey("title"))a.title=str(input,"title")==null||str(input,"title").isBlank()?"Team member":required(str(input,"title"),"Title",80);
  if(input.containsKey("role")){
   if(!"ADMIN".equals(me.role))throw forbidden();
   String role=option(str(input,"role"),"MEMBER","ADMIN","MANAGER","MEMBER");
   if(a.id.equals(me.id)&&!"ADMIN".equals(role))throw bad("You cannot remove your own admin role");
   a.role=role;
  }
  if(input.containsKey("enabled")){
   if(Boolean.FALSE.equals(input.get("enabled")) && projects.findAll().stream().anyMatch(p->p.lead!=null && entityId(p.lead).equals(a.id)))
    throw bad("Transfer this member’s project lead responsibilities before disabling the account");
   if(a.id.equals(me.id)&&Boolean.FALSE.equals(input.get("enabled")))throw bad("You cannot disable your own account");
   if (!(input.get("enabled") instanceof Boolean)) throw bad("Enabled must be true or false");
   a.enabled=Boolean.TRUE.equals(input.get("enabled"));
  }
  accounts.save(a);
  if (!a.enabled) {
   // Disabled users remain in history, but cannot own open work or receive assignments.
   for (TaskItem t:tasks.findAll()) if (t.assignee!=null && entityId(t.assignee).equals(a.id)) {t.assignee=null;t.updatedAt=Instant.now();tasks.save(t);}
  }
  return user(a);
 }
 public void changePassword(Map<String,Object> in,Account me){
  String old=str(in,"currentPassword"), next=str(in,"newPassword");
  if(old==null || !encoder.matches(old,me.passwordHash)) throw bad("Current password is incorrect");
  if(next==null || next.length()<12 || next.length()>120)throw bad("New password must be 12–120 characters");
  if(next.equals(old))throw bad("New password must differ from the current password");
  me.passwordHash=encoder.encode(next); accounts.save(me);
 }
 public void deleteProject(String projectId,Account me){
  Project p=allowedProject(projectId,me);manageProject(p,me);
  // Delete dependents in referentially safe order, atomically; never touch other projects.
  for (TaskItem t:tasks.findByProjectIdOrderByPositionAsc(projectId)) {
   for (TaskComment c:comments.findAll()) if(entityId(c.task).equals(t.id))comments.delete(c);
  }
  for(Activity a:activities.findAll())if(a.project!=null && entityId(a.project).equals(projectId))activities.delete(a);
  for(TaskItem t:tasks.findByProjectIdOrderByPositionAsc(projectId))tasks.delete(t);
  for(ProjectMembership m:memberships.findByProjectId(projectId))memberships.delete(m);
  projects.delete(p);
  // Keep a workspace-level audit trail of removal for elevated users.
  log(null,null,me,"PROJECT_DELETED","deleted project "+p.name+" ("+p.projectKey+")");
 }
 public Map<String,Object> newProject(Map<String,Object> in,Account me){
  // Every active registered member can create their own project without approval.
  // They become the project LEAD automatically and can manage only projects they lead.
  if(!me.enabled) throw forbidden();
  Project p=new Project();p.id=id();p.name=required(str(in,"name"),"Project name",100);
  p.projectKey=required(str(in,"key"),"Project key",12).toUpperCase(Locale.ROOT);
  if(!p.projectKey.matches("[A-Z][A-Z0-9]{1,9}"))throw bad("Project key must be 2–10 uppercase letters or numbers, beginning with a letter");
  if(projects.existsByProjectKeyIgnoreCase(p.projectKey))throw new ResponseStatusException(HttpStatus.CONFLICT,"Project key already exists");
  p.description=limit(str(in,"description"),2500);p.status=option(str(in,"status"),"ACTIVE","PLANNING","ACTIVE","ON_HOLD","COMPLETED");
  p.color=option(str(in,"color"),"INDIGO","INDIGO","VIOLET","TEAL","ORANGE","ROSE","SKY","GREEN").toLowerCase(Locale.ROOT);p.startDate=date(in,"startDate");p.targetDate=date(in,"targetDate");validateDates(p);
  p.lead=me;projects.save(p);addProjectMember(p,me,"LEAD");log(p,null,me,"PROJECT_CREATED","created project "+p.name);return project(p);
 }
 public Map<String,Object> editProject(String id,Map<String,Object> in,Account me){
  Project p=allowedProject(id,me);manageProject(p,me);
  if(in.containsKey("name"))p.name=required(str(in,"name"),"Name",100);
  if(in.containsKey("description"))p.description=limit(str(in,"description"),2500);
  if(in.containsKey("status"))p.status=option(str(in,"status"),"ACTIVE","PLANNING","ACTIVE","ON_HOLD","COMPLETED");
  if(in.containsKey("color"))p.color=option(str(in,"color"),"INDIGO","INDIGO","VIOLET","TEAL","ORANGE","ROSE","SKY","GREEN").toLowerCase(Locale.ROOT);
  if(in.containsKey("leadId")){
   String newLeadId=required(str(in,"leadId"),"Project lead",80);
   Account next=find(accounts.findById(newLeadId),"Project lead");
   if(!next.enabled)throw bad("Project lead must be an active member");
   if(p.lead==null || !entityId(p.lead).equals(next.id)){
    Account old=p.lead;
    addProjectMember(p,next,"LEAD");
    for(ProjectMembership m:memberships.findByProjectId(p.id)){
     if(entityId(m.account).equals(next.id)){m.projectRole="LEAD";memberships.save(m);}
     else if(old!=null&&entityId(m.account).equals(old.id)){m.projectRole="CONTRIBUTOR";memberships.save(m);}
    }
    p.lead=next;
    log(p,null,me,"LEAD_CHANGED","assigned "+next.name+" as project lead");
   }
  }
  if(in.containsKey("startDate"))p.startDate=date(in,"startDate");
  if(in.containsKey("targetDate"))p.targetDate=date(in,"targetDate");
  validateDates(p);projects.save(p);log(p,null,me,"PROJECT_UPDATED","updated project details");return project(p);
 }
 private void validateDates(Project p){if(p.startDate!=null&&p.targetDate!=null&&p.targetDate.isBefore(p.startDate))throw bad("Target date must not be before start date");}
 private void addProjectMember(Project p,Account a,String role){
  if(memberships.existsByProjectIdAndAccountId(p.id,a.id))return;
  ProjectMembership m=new ProjectMembership();m.id=id();m.project=p;m.account=a;m.projectRole=role;memberships.save(m);
 }
 public List<Map<String,Object>> setProjectMembers(String projectId,Map<String,Object> in,Account me){
  Project p=allowedProject(projectId,me);manageProject(p,me);
  Object values=in.get("memberIds");if(!(values instanceof List<?> ids))throw bad("memberIds must be a list");
  Set<String> selected=ids.stream().filter(x->x instanceof String).map(Object::toString).collect(Collectors.toSet());
  if (ids.size()>1000) throw bad("Maximum 1,000 members per request");
  if (ids.stream().anyMatch(x->!(x instanceof String))) throw bad("Member IDs must be strings");
  if(p.lead!=null)selected.add(entityId(p.lead));
  for(String mid:selected){Account a=find(accounts.findById(mid),"Member");if(!a.enabled)throw bad("Disabled members cannot join a project");addProjectMember(p,a,p.lead!=null&&a.id.equals(entityId(p.lead))?"LEAD":"CONTRIBUTOR");}
  for(ProjectMembership m:memberships.findByProjectId(projectId))if(!selected.contains(entityId(m.account))){
   for(TaskItem t:tasks.findByProjectIdOrderByPositionAsc(projectId))if(t.assignee!=null&&entityId(t.assignee).equals(entityId(m.account))){
    t.assignee=null;t.updatedAt=Instant.now();tasks.save(t);
   }
   memberships.delete(m);
  }
  log(p,null,me,"MEMBERS_UPDATED","updated project team");return memberships.findByProjectId(projectId).stream().map(this::membership).toList();
 }
 /** Allow a project lead to add another *already registered* user by email.
  * No administrator approval or global user directory disclosure is required.
  * The recipient only gains access to the specific project chosen by its lead.
  */
 public List<Map<String,Object>> inviteProjectMember(String projectId,Map<String,Object> in,Account me){
  Project p=allowedProject(projectId,me);
  manageProject(p,me);
  String email=required(str(in,"email"),"Member email",160).toLowerCase(Locale.ROOT);
  if(!email.matches("^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$"))throw bad("Enter a valid member email");
  Account invitee=find(accounts.findByEmailIgnoreCase(email),"Registered account");
  if(!invitee.enabled)throw bad("That account is disabled");
  if(!memberships.existsByProjectIdAndAccountId(projectId,invitee.id)){
   addProjectMember(p,invitee,"CONTRIBUTOR");
   log(p,null,me,"MEMBER_ADDED","added "+invitee.name+" to the project");
  }
  return memberships.findByProjectId(projectId).stream().map(this::membership).toList();
 }
 public synchronized Map<String,Object> newTask(Map<String,Object> in,Account me){
  Project p=allowedProject(required(str(in,"projectId"),"Project",80),me);
  TaskItem t=new TaskItem();t.id=id();t.project=p;t.title=required(str(in,"title"),"Task title",220);t.description=limit(str(in,"description"),6000);
  t.status=option(str(in,"status"),"TODO","TODO","IN_PROGRESS","REVIEW","DONE");
  t.priority=option(str(in,"priority"),"MEDIUM","LOW","MEDIUM","HIGH","URGENT");
  t.category=limit(opt(str(in,"category"),"Feature"),35);t.dueDate=date(in,"dueDate");t.assignee=assignee(in,p);t.creator=me;
  t.position=(int)tasks.countByProjectId(p.id);
  long n=tasks.findByProjectIdOrderByPositionAsc(p.id).stream().map(x->x.taskKey).map(k->k.substring(k.lastIndexOf('-')+1)).mapToLong(s->{try{return Long.parseLong(s);}catch(Exception e){return 0;}}).max().orElse(100)+1;
  t.taskKey=p.projectKey+"-"+n;
  if("DONE".equals(t.status))t.completedAt=Instant.now();
  TaskItem saved=tasks.saveAndFlush(t);log(p,saved,me,"TASK_CREATED","created "+saved.taskKey+" · "+saved.title);return task(saved);
 }
 public Map<String,Object> editTask(String id,Map<String,Object> in,Account me){
  TaskItem t=allowedTask(id,me);String previous=t.status;
  if(in.containsKey("title"))t.title=required(str(in,"title"),"Task title",220);
  if(in.containsKey("description"))t.description=limit(str(in,"description"),6000);
  if(in.containsKey("status"))t.status=option(str(in,"status"),"TODO","TODO","IN_PROGRESS","REVIEW","DONE");
  if(in.containsKey("priority"))t.priority=option(str(in,"priority"),"MEDIUM","LOW","MEDIUM","HIGH","URGENT");
  if(in.containsKey("category"))t.category=limit(opt(str(in,"category"),"Feature"),35);
  if(in.containsKey("dueDate"))t.dueDate=date(in,"dueDate");
  if(in.containsKey("assigneeId"))t.assignee=assignee(in,t.project);
  checkTaskVersion(t,in);
  if(in.containsKey("position")){Object x=in.get("position");if(x instanceof Number n)t.position=Math.max(0,n.intValue());}
  t.updatedAt=Instant.now();if(!previous.equals(t.status)){t.completedAt="DONE".equals(t.status)?Instant.now():null;log(t.project,t,me,"STATUS_CHANGED",t.taskKey+" moved from "+previous.replace('_',' ')+" to "+t.status.replace('_',' '));}
  else log(t.project,t,me,"TASK_UPDATED","updated "+t.taskKey);
  // Flush within the request so constraint/concurrency problems cannot be deferred silently.
  tasks.saveAndFlush(t);return task(t);
 }
 /** Board drag/drop uses a dedicated status transition, without rewriting unrelated fields. */
 public Map<String,Object> changeStatus(String id,Map<String,Object> in,Account me){
  TaskItem t=allowedTask(id,me);
  String next=option(str(in,"status"),"TODO","TODO","IN_PROGRESS","REVIEW","DONE");
  checkTaskVersion(t,in);
  if(next.equals(t.status))return task(t);
  String previous=t.status;
  t.status=next;
  t.updatedAt=Instant.now();
  t.completedAt="DONE".equals(next)?Instant.now():null;
  // Persist and verify the revision before writing the status-change activity event.
  tasks.saveAndFlush(t);
  log(t.project,t,me,"STATUS_CHANGED",t.taskKey+" moved from "+previous.replace('_',' ')+" to "+next.replace('_',' '));
  return task(t);
 }
 private void checkTaskVersion(TaskItem t,Map<String,Object> in){
  if(!in.containsKey("version"))return;
  try {
   long expected=Long.parseLong(str(in,"version"));
   if(t.version!=expected)throw new ResponseStatusException(HttpStatus.CONFLICT,"Task changed since you opened it. Refresh and try again.");
  }catch(NumberFormatException ex){throw bad("Invalid task revision");}
 }
 public void deleteTask(String id,Account me){
  TaskItem t=allowedTask(id,me);manageProject(t.project,me);
  String key=t.taskKey;comments.findAll().stream().filter(c->entityId(c.task).equals(id)).toList().forEach(comments::delete);
  activities.findAll().stream().filter(a->a.task!=null&&entityId(a.task).equals(id)).forEach(a->{a.task=null;activities.save(a);});
  tasks.delete(t);log(t.project,null,me,"TASK_DELETED","deleted "+key);
 }
 public Map<String,Object> addComment(String id,Map<String,Object> in,Account me){
  TaskItem t=allowedTask(id,me);TaskComment c=new TaskComment();c.id=id();c.task=t;c.author=me;c.body=required(str(in,"body"),"Comment",3000);
  comments.save(c);log(t.project,t,me,"COMMENTED","commented on "+t.taskKey);return comment(c);
 }
 private Account assignee(Map<String,Object> in,Project p){
  String mid=str(in,"assigneeId");if(mid==null||mid.isBlank())return null;
  if(!memberships.existsByProjectIdAndAccountId(entityId(p),mid))throw bad("Assignee must belong to the project");
  Account user=find(accounts.findById(mid),"Assignee"); if(!user.enabled)throw bad("Disabled members cannot be assigned tasks");return user;
 }
 private String str(Map<String,Object> map,String key){Object v=map.get(key);return v==null?null:v.toString();}
 private String opt(String str,String fallback){return str==null?fallback:str.strip();}
 private String limit(String s,int max){String v=opt(s,"");if(v.length()>max)throw bad("Text must be no longer than "+max+" characters");return v;}
 private LocalDate date(Map<String,Object> in,String key){String s=str(in,key);if(s==null||s.isBlank())return null;try{return LocalDate.parse(s);}catch(Exception e){throw bad("Invalid date: "+key);}}
}
