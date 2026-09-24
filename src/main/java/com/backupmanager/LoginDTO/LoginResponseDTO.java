package com.backupmanager.LoginDTO;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter 
public class LoginResponseDTO{

    private Long id;
    
    private String username;
    
    private String email;

    private String token;
    
}
