package com.tasky.app.repo;
import com.tasky.app.model.Account;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;
public interface AccountRepository extends JpaRepository<Account,String> {
 Optional<Account> findByEmailIgnoreCase(String email);
 boolean existsByEmailIgnoreCase(String email);
}
