package com.tasky.app.config;

/**
 * Compatibility placeholder for v2.3 installations that update files in place.
 * The old startup CommandLineRunner was intentionally removed. No admin is
 * created during application startup; the first registration on the website
 * becomes the workspace owner through RegistrationService.
 */
@Deprecated
public final class BootstrapAdmin {
 private BootstrapAdmin() {}
}
