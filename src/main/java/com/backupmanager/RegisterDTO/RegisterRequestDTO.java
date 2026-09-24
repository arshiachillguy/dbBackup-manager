package com.backupmanager.RegisterDTO;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter 
public class RegisterRequestDTO {
    
    @NotBlank 
    private String username;
    
    @NotBlank 
    @Email 
    private String email;
    
    @NotBlank
    @Size(min = 15) 
    private String password;
}
