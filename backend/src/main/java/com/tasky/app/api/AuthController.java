package com.tasky.app.api;
import org.springframework.security.web.csrf.CsrfToken;
import org.springframework.web.bind.annotation.*;
import java.util.Map;
@RestController @RequestMapping("/api/auth")
public class AuthController {
 @GetMapping("/csrf") public Map<String,String> csrf(CsrfToken token) {
  return Map.of("token",token.getToken(),"headerName",token.getHeaderName());
 }
}
