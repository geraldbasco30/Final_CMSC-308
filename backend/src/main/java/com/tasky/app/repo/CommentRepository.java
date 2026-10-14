package com.tasky.app.repo;
import com.tasky.app.model.TaskComment;
import org.springframework.data.jpa.repository.JpaRepository;
public interface CommentRepository extends JpaRepository<TaskComment,String> {}
