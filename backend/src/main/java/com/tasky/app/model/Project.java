package com.tasky.app.model;
import jakarta.persistence.*;
import java.time.*;
@Entity @Table(name="projects")
public class Project {
 @Id public String id;
 @Column(nullable=false,length=100) public String name;
 @Column(length=12,nullable=false,unique=true) public String projectKey;
 @Column(length=2500) public String description="";
 @Column(length=20) public String status="ACTIVE";
 @Column(length=20) public String color="indigo";
 public LocalDate startDate;
 public LocalDate targetDate;
 @ManyToOne(fetch=FetchType.LAZY) public Account lead;
 public Instant createdAt=Instant.now();
 public Project() {}
}
