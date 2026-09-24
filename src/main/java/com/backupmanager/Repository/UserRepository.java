package com.backupmanager.Repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.backupmanager.Model.User;

public interface UserRepository extends JpaRepository<User, Long> {
    boolean existsByUsername(String username);
    boolean existsByEmail(String email);
    
    User findByUsername(String username);
    User findBypassword(String password);

}
