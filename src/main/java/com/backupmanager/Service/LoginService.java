package com.backupmanager.Service;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.backupmanager.Exception.InvalidCredentialsException;
import com.backupmanager.Exception.UserNotFoundException;
import com.backupmanager.LoginDTO.LoginRequestDTO;
import com.backupmanager.LoginDTO.LoginResponseDTO;
import com.backupmanager.Model.User;
import com.backupmanager.Repository.UserRepository;

@Service
public class LoginService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public LoginService(UserRepository userRepository , PasswordEncoder passwordEncoder , JwtService jwtService){
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }

    public LoginResponseDTO login(LoginRequestDTO requestDTO){

        User user = userRepository.findByUsername(requestDTO.getUsername());
        if (user == null)
        {
            throw new UserNotFoundException("Invalid username or password");
        }

        if (!passwordEncoder.matches(requestDTO.getPassword(), user.getPassword()))
        {
            throw new InvalidCredentialsException("Invalid username or password");
        }

        String token = jwtService.generateToken(user.getUsername());
        LoginResponseDTO response = new LoginResponseDTO();
        response.setId(user.getId());
        response.setUsername(user.getUsername());
        response.setEmail(user.getEmail());
        response.setToken(token);
        return response;
    }

        

        
}

