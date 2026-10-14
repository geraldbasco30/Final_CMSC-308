package com.tasky.app.api;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

/** Public self-registration input. Privileged fields such as role are never accepted. */
public record RegistrationRequest(
    @NotBlank @Size(min = 2, max = 90) String name,
    @NotBlank @Email @Size(max = 160) String email,
    @NotBlank @Size(min = 12, max = 120) String password,
    @NotBlank @Size(max = 120) String confirmPassword,
    String setupToken
) {
 public RegistrationRequest(String name, String email, String password, String confirmPassword) {
  this(name, email, password, confirmPassword, null);
 }
}
