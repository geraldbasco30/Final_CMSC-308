package com.tasky.app.model;
import jakarta.persistence.*;
import java.time.Instant;
@Entity @Table(name="activities",indexes={@Index(columnList="created_at")})
public class Activity {
 @Id public String id;
 @ManyToOne(fetch=FetchType.LAZY) public Project project;
 @ManyToOne(fetch=FetchType.LAZY) public TaskItem task;
 @ManyToOne(fetch=FetchType.LAZY) public Account actor;
 @Column(length=30) public String type="UPDATED";
 @Column(length=1000) public String message;
 public Instant createdAt=Instant.now();
 public Activity() {}
}
