package com.backupmanager.BackupDTO;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter 
public class CreateBackupRequestDTO{

    @NotBlank 
    private String dbname;

    @NotBlank 
    private String host = "localhost";

    @NotNull 
    @Min(1)
    @Max(65535)
    private Integer port = 5432;

    @NotBlank 
    private String username;

    @NotBlank 
    private String password;
}