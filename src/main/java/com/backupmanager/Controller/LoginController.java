package com.backupmanager.Controller;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.backupmanager.LoginDTO.LoginRequestDTO;
import com.backupmanager.LoginDTO.LoginResponseDTO;
import com.backupmanager.Service.LoginService;

import jakarta.validation.Valid;


@RestController
@RequestMapping("/api/auth")
public class LoginController{
    
    private final LoginService loginService;
    
    public LoginController(LoginService loginservice){
        this.loginService = loginservice;
    }

    @PostMapping("/login")
    public LoginResponseDTO login(@Valid @RequestBody
        LoginRequestDTO requestDTO)
    {
        return loginService.login(requestDTO);
    }

}