package com.tasky.app.model;
import jakarta.persistence.*;
import java.time.*;
@Entity @Table(name="task_items",indexes={@Index(columnList="project_id,status"),@Index(columnList="due_date")})
public class TaskItem {
 @Id public String id;
 @Column(nullable=false,unique=true,length=32) public String taskKey;
 @ManyToOne(fetch=FetchType.LAZY,optional=false) public Project project;
 @Column(nullable=false,length=220) public String title;
 @Column(length=6000) public String description="";
 @Column(nullable=false,length=24) public String status="TODO";
 @Column(nullable=false,length=24) public String priority="MEDIUM";
 @Column(length=35) public String category="Feature";
 public LocalDate dueDate;
 @ManyToOne(fetch=FetchType.LAZY) public Account assignee;
 @ManyToOne(fetch=FetchType.LAZY) public Account creator;
 public int position=0;
 @Version public long version;
 public Instant createdAt=Instant.now();
 public Instant updatedAt=Instant.now();
 public Instant completedAt;
 public TaskItem() {}
}
