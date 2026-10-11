package com.backupmanager.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.backupmanager.Model.User;
@Repository 
public interface UserRepository extends JpaRepository<User, Long> {
    boolean existsByUsername(String username);
    boolean existsByEmail(String email);
    
    User findByUsername(String username);
    User findBypassword(String password);

}
