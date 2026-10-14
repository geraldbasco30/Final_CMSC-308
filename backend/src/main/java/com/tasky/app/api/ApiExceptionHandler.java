package com.tasky.app.api;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import java.util.Map;
@RestControllerAdvice
public class ApiExceptionHandler {
 @ExceptionHandler(ResponseStatusException.class)
 public ResponseEntity<Map<String,String>> onHttp(ResponseStatusException e){
  return ResponseEntity.status(e.getStatusCode()).body(Map.of("error",e.getReason()==null?"Request failed":e.getReason()));
 }
 @ExceptionHandler(MethodArgumentNotValidException.class)
 public ResponseEntity<Map<String,String>> onValidation(MethodArgumentNotValidException e){
  var error=e.getBindingResult().getFieldErrors().stream().findFirst().map(x->x.getField()+": "+x.getDefaultMessage()).orElse("Invalid request");
  return ResponseEntity.badRequest().body(Map.of("error",error));
 }
 // Race conditions are expected when two team members move the same Kanban card.
 // Report them as actionable conflicts rather than an unexplained HTTP 500.
 @ExceptionHandler({org.springframework.dao.OptimisticLockingFailureException.class, jakarta.persistence.OptimisticLockException.class})
 public ResponseEntity<Map<String,String>> onStaleTask(Exception e){
  return ResponseEntity.status(HttpStatus.CONFLICT).body(Map.of("error","Task was updated by another user. Refresh and try again."));
 }
 @ExceptionHandler(org.springframework.dao.DataIntegrityViolationException.class)
 public ResponseEntity<Map<String,String>> onConflict(){
  return ResponseEntity.status(HttpStatus.CONFLICT).body(Map.of("error","This item conflicts with an existing record"));
 }
}
