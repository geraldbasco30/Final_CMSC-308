package com.tasky.app.model;
import jakarta.persistence.*;
@Entity @Table(name="project_members",uniqueConstraints=@UniqueConstraint(columnNames={"project_id","account_id"}))
public class ProjectMembership {
 @Id public String id;
 @ManyToOne(fetch=FetchType.LAZY,optional=false) public Project project;
 @ManyToOne(fetch=FetchType.LAZY,optional=false) public Account account;
 @Column(length=24) public String projectRole="CONTRIBUTOR";
 public ProjectMembership() {}
}
