package com.tasky.app.repo;
import com.tasky.app.model.Activity;
import org.springframework.data.jpa.repository.JpaRepository;
public interface ActivityRepository extends JpaRepository<Activity,String> {}
