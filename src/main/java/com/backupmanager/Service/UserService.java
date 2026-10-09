package com.backupmanager.Service;

import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.backupmanager.Exception.UserHasBackupsException;
import com.backupmanager.Model.User;
import com.backupmanager.Repository.BackupRepository;
import com.backupmanager.Repository.UserRepository;

@Service 
public class UserService {

    private final UserRepository userRepository;
    private final BackupRepository backupRepository;

    public UserService(UserRepository userRepository, BackupRepository backupRepository){
        this.userRepository = userRepository;
        this.backupRepository = backupRepository;
    }

    public void deleteUser(String username){
        User user = userRepository.findByUsername(username);
        if (user == null){
            throw new UsernameNotFoundException("User not found");
        }

        if (backupRepository.existsByOwnerUsername(username)){
            throw new UserHasBackupsException("Can not delete user because the user has backups");
        };

        userRepository.delete(user);
    }

	
}