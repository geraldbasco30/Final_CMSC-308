package com.tasky.app.repo;
import com.tasky.app.model.TaskItem;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.*;
public interface TaskRepository extends JpaRepository<TaskItem,String> {
 List<TaskItem> findByProjectIdOrderByPositionAsc(String projectId);
 long countByProjectId(String projectId);
 long countByProjectIdAndStatus(String projectId,String status);
}
