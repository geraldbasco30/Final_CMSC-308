package com.tasky.app.api;

import com.tasky.app.service.RegistrationService;
import jakarta.validation.Valid;
import java.util.Map;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

/** Unauthenticated account sign-up, protected by CSRF and server-side validation. */
@RestController
@RequestMapping("/api/auth")
public class RegistrationController {
 private final RegistrationService registrations;
 public RegistrationController(RegistrationService registrations) { this.registrations = registrations; }

 @GetMapping("/setup-state")
 public Map<String, Boolean> setupState() {
  return Map.of("ownerRegistration", registrations.needsOwner(),
      "setupTokenRequired", registrations.ownerTokenRequired(),
      "registrationEnabled", registrations.registrationEnabled());
 }

 @PostMapping("/register")
 @ResponseStatus(HttpStatus.CREATED)
 public Map<String, String> register(@Valid @RequestBody RegistrationRequest request) {
  var account = registrations.register(request);
  return Map.of("message", "Account created. You can now sign in.", "email", account.email,
      "role", account.role);
 }
}
