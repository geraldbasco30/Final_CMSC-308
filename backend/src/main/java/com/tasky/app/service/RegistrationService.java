package com.tasky.app.service;

import com.tasky.app.api.RegistrationRequest;
import com.tasky.app.model.Account;
import com.tasky.app.repo.AccountRepository;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.util.Locale;
import java.util.UUID;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

/** First registration claims workspace ownership; later registrations create limited Members. */
@Service
public class RegistrationService {
 private final AccountRepository accounts;
 private final PasswordEncoder encoder;
 private final boolean enabled;
 private final String ownerToken;

 public RegistrationService(AccountRepository accounts, PasswordEncoder encoder,
     @Value("${tasky.registration.enabled:true}") boolean enabled,
     @Value("${tasky.setup.owner-token:}") String ownerToken) {
  this.accounts = accounts;
  this.encoder = encoder;
  this.enabled = enabled;
  this.ownerToken = ownerToken == null ? "" : ownerToken;
 }

 public boolean registrationEnabled() { return enabled; }
 public boolean needsOwner() { return accounts.count() == 0; }
 public boolean ownerTokenRequired() { return !ownerToken.isBlank(); }

 @Transactional
 public Account register(RegistrationRequest input) {
  if (!enabled) throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Registration is disabled for this workspace");
  if (input == null) throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Registration details are required");
  String name = input.name() == null ? "" : input.name().strip();
  String email = input.email() == null ? "" : input.email().strip().toLowerCase(Locale.ROOT);
  String password = input.password();

  if (name.length() < 2 || name.length() > 90)
   throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Name must be 2–90 characters");
  if (email.length() > 160 || !email.matches("^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$"))
   throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Enter a valid email address");
  if (password == null || password.length() < 12 || password.length() > 120 ||
      password.getBytes(StandardCharsets.UTF_8).length > 72)
   throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Password must be at least 12 characters and at most 72 UTF-8 bytes");
  if (!password.equals(input.confirmPassword()))
   throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Passwords do not match");
  if (accounts.existsByEmailIgnoreCase(email))
   throw new ResponseStatusException(HttpStatus.CONFLICT, "An account with this email already exists");

  // First user becomes administrator automatically, with no startup script or demo account.
  // The unique bootstrapOwnerClaim column prevents two simultaneous first registrations
  // from both receiving administrator privileges, even on multiple application instances.
  boolean owner = accounts.count() == 0;
  if (owner && !ownerToken.isBlank()) {
   String supplied = input.setupToken() == null ? "" : input.setupToken();
   if (!MessageDigest.isEqual(ownerToken.getBytes(StandardCharsets.UTF_8), supplied.getBytes(StandardCharsets.UTF_8)))
    throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Invalid workspace setup code");
  }

  Account account = new Account();
  account.id = UUID.randomUUID().toString();
  account.name = name;
  account.email = email;
  account.role = owner ? "ADMIN" : "MEMBER"; // Never accept role from untrusted input.
  if (owner) account.bootstrapOwnerClaim = "INITIAL_WORKSPACE_OWNER";
  account.enabled = true;
  account.title = owner ? "Workspace administrator" : "Team member";
  account.color = owner ? "indigo" : "violet";
  account.passwordHash = encoder.encode(password);
  // Flush so uniqueness conflicts are detected in the registration request.
  return accounts.saveAndFlush(account);
 }
}
