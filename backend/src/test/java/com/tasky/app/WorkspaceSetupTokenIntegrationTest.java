package com.tasky.app;

import com.tasky.app.api.RegistrationRequest;
import com.tasky.app.repo.AccountRepository;
import com.tasky.app.service.RegistrationService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;
import static org.assertj.core.api.Assertions.*;

/** A hosted empty workspace may protect the very first admin registration with a private code. */
@SpringBootTest(properties={
 "spring.datasource.url=jdbc:h2:mem:taskysetupcode;DB_CLOSE_DELAY=-1",
 "spring.jpa.hibernate.ddl-auto=create-drop",
 "tasky.setup.owner-token=ServerSidePrivateToken2026!"})
@Transactional
class WorkspaceSetupTokenIntegrationTest {
 @Autowired RegistrationService registrations;
 @Autowired AccountRepository accounts;

 @Test void ownerMustProvideSecretAndLaterMembersDoNotNeedIt() {
  assertThat(registrations.ownerTokenRequired()).isTrue();
  assertThat(accounts.count()).isZero();
  assertThatThrownBy(()->registrations.register(new RegistrationRequest(
     "Wrong Setup", "wrong@example.com", "StrongSetupPassword2026!", "StrongSetupPassword2026!", "incorrect")))
    .isInstanceOf(ResponseStatusException.class).hasMessageContaining("403");
  assertThat(accounts.count()).isZero();
  var owner=registrations.register(new RegistrationRequest(
     "Real Owner", "owner@example.com", "StrongSetupPassword2026!", "StrongSetupPassword2026!", "ServerSidePrivateToken2026!"));
  assertThat(owner.role).isEqualTo("ADMIN");
  var member=registrations.register(new RegistrationRequest(
     "Regular Member", "user@example.com", "AnotherLongPassword2026!", "AnotherLongPassword2026!"));
  assertThat(member.role).isEqualTo("MEMBER");
  assertThat(accounts.count()).isEqualTo(2);
 }
}
