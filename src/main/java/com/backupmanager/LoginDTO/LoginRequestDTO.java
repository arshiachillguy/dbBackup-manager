package com.backupmanager.LoginDTO;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter 
public class LoginRequestDTO {
    
    @NotBlank 
    private String username;
    
    @NotBlank
    @Size(min = 15) 
    private String password;
}
