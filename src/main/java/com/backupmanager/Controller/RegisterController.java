package com.backupmanager.Controller;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.backupmanager.RegisterDTO.RegisterRequestDTO;
import com.backupmanager.RegisterDTO.RegisterResponseDTO;
import com.backupmanager.Service.RegisterService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/auth")
public class RegisterController{
    
    private final RegisterService registerService;
    
    public RegisterController(RegisterService registerService){
        this.registerService = registerService;
    }

    @PostMapping("/register")
    public RegisterResponseDTO register(@Valid @RequestBody
        RegisterRequestDTO requestDTO)
    {
        return registerService.register(requestDTO);
    }

}