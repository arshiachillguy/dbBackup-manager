package com.backupmanager.BackupDTO;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter 
public class CreateBackupRequestDTO{

    @NotBlank 
    private String dbname;
}