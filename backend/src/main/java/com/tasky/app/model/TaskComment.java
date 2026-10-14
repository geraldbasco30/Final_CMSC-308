package com.tasky.app.model;
import jakarta.persistence.*;
import java.time.Instant;
@Entity @Table(name="task_comments")
public class TaskComment {
 @Id public String id;
 @ManyToOne(fetch=FetchType.LAZY,optional=false) public TaskItem task;
 @ManyToOne(fetch=FetchType.LAZY,optional=false) public Account author;
 @Column(nullable=false,length=3000) public String body;
 public Instant createdAt=Instant.now();
 public TaskComment() {}
}
