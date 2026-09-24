package com.backupmanager.Service;

import jakarta.transaction.Transactional;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.backupmanager.Model.User;
import com.backupmanager.RegisterDTO.RegisterRequestDTO;
import com.backupmanager.RegisterDTO.RegisterResponseDTO;
import com.backupmanager.Repository.UserRepository;

@Service
@Transactional
public class RegisterService {
    
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public RegisterService(PasswordEncoder passwordEncoder , UserRepository userRepository) {
        this.passwordEncoder = passwordEncoder;
        this.userRepository = userRepository;
    }

    public RegisterResponseDTO register(RegisterRequestDTO requestDTO) {

        if (userRepository.existsByUsername(requestDTO.getUsername()))
        {
            throw new RuntimeException("username already exists.");
        }

        if (userRepository.existsByEmail(requestDTO.getEmail()))
        {
            throw new RuntimeException("email already exists.");
        }
        // create new user 
        User user = new User();
        user.setUsername(requestDTO.getUsername());
        user.setEmail(requestDTO.getEmail());
        user.setPassword(passwordEncoder.encode(requestDTO.getPassword()));
        User savedUser =  userRepository.save(user);
        
        // return response to clinet 
        RegisterResponseDTO response = new RegisterResponseDTO();
        response.setId(savedUser.getId());
        response.setUsername(savedUser.getUsername());
        response.setEmail(savedUser.getEmail());
        return response;
    }


}
