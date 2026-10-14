package com.tasky.app.model;
import jakarta.persistence.*;
import java.time.Instant;
@Entity @Table(name="accounts", indexes={@Index(columnList="email",unique=true)})
public class Account {
 @Id public String id;
 @Column(nullable=false,length=90) public String name;
 @Column(nullable=false,unique=true,length=160) public String email;
 @Column(nullable=false) public String passwordHash;
 @Column(nullable=false,length=20) public String role="MEMBER";
 @Column(length=80) public String title="Team member";
 @Column(length=20) public String color="violet";
 /** Database-unique claim: prevents two concurrent first registrations becoming workspace owners. */
 @Column(name="bootstrap_owner_claim",unique=true,length=32)
 public String bootstrapOwnerClaim;
 public boolean enabled=true;
 public Instant createdAt=Instant.now();
 public Account() {}
}
