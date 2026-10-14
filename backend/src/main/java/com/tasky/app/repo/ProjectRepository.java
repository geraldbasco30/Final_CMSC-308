package com.tasky.app.repo;
import com.tasky.app.model.Project;
import org.springframework.data.jpa.repository.JpaRepository;
public interface ProjectRepository extends JpaRepository<Project,String> {
 boolean existsByProjectKeyIgnoreCase(String projectKey);
}
