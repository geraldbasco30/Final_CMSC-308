package com.tasky.app.repo;
import com.tasky.app.model.ProjectMembership;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.*;
public interface MembershipRepository extends JpaRepository<ProjectMembership,String> {
 List<ProjectMembership> findByProjectId(String projectId);
 List<ProjectMembership> findByAccountId(String accountId);
 boolean existsByProjectIdAndAccountId(String projectId,String accountId);
 void deleteByProjectIdAndAccountId(String projectId,String accountId);
}
