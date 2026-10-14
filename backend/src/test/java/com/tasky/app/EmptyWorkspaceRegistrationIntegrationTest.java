package com.tasky.app;

import com.tasky.app.api.RegistrationRequest;
import com.tasky.app.repo.AccountRepository;
import com.tasky.app.service.RegistrationService;
import com.tasky.app.service.TaskyService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.transaction.annotation.Transactional;
import static org.assertj.core.api.Assertions.*;

/** Proves a completely empty workspace can start and register an owner without CLI variables. */
@SpringBootTest(properties={
    "spring.datasource.url=jdbc:h2:mem:taskyempty;DB_CLOSE_DELAY=-1",
    "spring.jpa.hibernate.ddl-auto=create-drop",
    "TASKY_OWNER_SETUP_TOKEN="})
@Transactional
class EmptyWorkspaceRegistrationIntegrationTest {
 @Autowired RegistrationService registrations;
 @Autowired AccountRepository accounts;
 @Autowired TaskyService service;
 @Autowired PasswordEncoder encoder;

 @Test void firstAccountIsAdminAndNextAccountsAreMembers() {
  assertThat(accounts.count()).isZero();
  assertThat(registrations.needsOwner()).isTrue();
  var owner=registrations.register(new RegistrationRequest("First Workspace Owner", "OWNER@example.com", "OwnerPasswordSecure2026!", "OwnerPasswordSecure2026!"));
  assertThat(owner.role).isEqualTo("ADMIN");
  assertThat(owner.bootstrapOwnerClaim).isEqualTo("INITIAL_WORKSPACE_OWNER");
  assertThat(owner.email).isEqualTo("owner@example.com");
  assertThat(encoder.matches("OwnerPasswordSecure2026!",owner.passwordHash)).isTrue();
  assertThat(registrations.needsOwner()).isFalse();
  assertThat(service.snapshot(owner).get("projects")).isEqualTo(java.util.List.of());
  var member=registrations.register(new RegistrationRequest("Another Team Member", "member@example.com", "MemberPasswordSecure2026!", "MemberPasswordSecure2026!"));
  assertThat(member.role).isEqualTo("MEMBER");
  assertThat(member.bootstrapOwnerClaim).isNull();
  assertThat(accounts.count()).isEqualTo(2);
  assertThat(service.snapshot(member).get("projects")).isEqualTo(java.util.List.of());
 }
}
