package com.tasky.app.api;
import com.tasky.app.service.TaskyService;
import java.security.Principal;
import java.util.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.HttpStatus;
@RestController @RequestMapping("/api")
public class TaskyController {
 private final TaskyService svc;
 public TaskyController(TaskyService svc){this.svc=svc;}
 @GetMapping("/reports/activity") public List<Map<String,Object>> activityReport(Principal p){return svc.activityReport(svc.current(p.getName()));}
 @GetMapping("/bootstrap") public Map<String,Object> bootstrap(Principal p){return svc.snapshot(svc.current(p.getName()));}
 @PostMapping("/account/password") public Map<String,String> changeOwnPassword(@RequestBody Map<String,Object> in,Principal p){svc.changePassword(in,svc.current(p.getName()));return Map.of("message","Password changed successfully");}
 @ResponseStatus(HttpStatus.NO_CONTENT) @DeleteMapping("/projects/{id}") public void deleteProject(@PathVariable String id,Principal p){svc.deleteProject(id,svc.current(p.getName()));}
 @PostMapping("/projects") public Map<String,Object> createProject(@RequestBody Map<String,Object> in,Principal p){return svc.newProject(in,svc.current(p.getName()));}
 @PatchMapping("/projects/{id}") public Map<String,Object> updateProject(@PathVariable String id,@RequestBody Map<String,Object> in,Principal p){return svc.editProject(id,in,svc.current(p.getName()));}
 @PutMapping("/projects/{id}/members") public List<Map<String,Object>> projectMembers(@PathVariable String id,@RequestBody Map<String,Object> in,Principal p){return svc.setProjectMembers(id,in,svc.current(p.getName()));}
 @PostMapping("/projects/{id}/members/invite") public List<Map<String,Object>> inviteProjectMember(@PathVariable String id,@RequestBody Map<String,Object> in,Principal p){return svc.inviteProjectMember(id,in,svc.current(p.getName()));}
 @PostMapping("/members") public Map<String,Object> member(@RequestBody Map<String,Object> in,Principal p){return svc.newMember(in,svc.current(p.getName()));}
 @PatchMapping("/members/{id}") public Map<String,Object> editMember(@PathVariable String id,@RequestBody Map<String,Object> in,Principal p){return svc.editMember(id,in,svc.current(p.getName()));}
 @PostMapping("/tasks") public Map<String,Object> task(@RequestBody Map<String,Object> in,Principal p){return svc.newTask(in,svc.current(p.getName()));}
 @PatchMapping("/tasks/{id}") public Map<String,Object> taskEdit(@PathVariable String id,@RequestBody Map<String,Object> in,Principal p){return svc.editTask(id,in,svc.current(p.getName()));}
 @PatchMapping("/tasks/{id}/status") public Map<String,Object> changeStatus(@PathVariable String id,@RequestBody Map<String,Object> in,Principal p){return svc.changeStatus(id,in,svc.current(p.getName()));}
 @ResponseStatus(HttpStatus.NO_CONTENT) @DeleteMapping("/tasks/{id}") public void deleteTask(@PathVariable String id,Principal p){svc.deleteTask(id,svc.current(p.getName()));}
 @PostMapping("/tasks/{id}/comments") public Map<String,Object> comment(@PathVariable String id,@RequestBody Map<String,Object> in,Principal p){return svc.addComment(id,in,svc.current(p.getName()));}
}
