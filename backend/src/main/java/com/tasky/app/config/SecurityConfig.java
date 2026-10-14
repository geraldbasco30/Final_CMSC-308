package com.tasky.app.config;
import com.tasky.app.repo.AccountRepository;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.core.userdetails.*;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.csrf.CookieCsrfTokenRepository;
import org.springframework.http.HttpStatus;
import org.springframework.security.web.authentication.HttpStatusEntryPoint;
import org.springframework.security.web.servlet.util.matcher.PathPatternRequestMatcher;

@Configuration
public class SecurityConfig {
 @Bean PasswordEncoder passwordEncoder(){ return new BCryptPasswordEncoder(12); }
 @Bean UserDetailsService userDetails(AccountRepository accounts){
  return email -> {
   var u=accounts.findByEmailIgnoreCase(email).orElseThrow(()->new UsernameNotFoundException("Invalid credentials"));
   return User.withUsername(u.email).password(u.passwordHash).roles(u.role).disabled(!u.enabled).build();
  };
 }
 @Bean SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
  return http
   .authorizeHttpRequests(a->a.requestMatchers("/login.html","/register.html","/api/auth/register","/api/auth/setup-state","/css/**","/js/**","/favicon.svg","/api/auth/csrf","/error").permitAll()
     .anyRequest().authenticated())
   .csrf(csrf->csrf.csrfTokenRepository(CookieCsrfTokenRepository.withHttpOnlyFalse()))
   .exceptionHandling(errors -> errors.defaultAuthenticationEntryPointFor(new HttpStatusEntryPoint(HttpStatus.UNAUTHORIZED), PathPatternRequestMatcher.pathPattern("/api/**")))
   .formLogin(f->f.loginPage("/login.html").loginProcessingUrl("/login").defaultSuccessUrl("/",true).failureUrl("/login.html?error").permitAll())
   .logout(l->l.logoutUrl("/logout").logoutSuccessUrl("/login.html?logout"))
   .build();
 }
}
