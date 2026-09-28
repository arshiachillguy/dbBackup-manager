package com.backupmanager.BackupDTO;

import java.time.LocalDateTime;

import com.backupmanager.Model.BackupStatus;

import lombok.Getter;
import lombok.Setter;

@Getter 
@Setter 
public class CreateBackupResponseDTO {
    private Long id;
    private String backupName;
    private String dbname;
    private String path;
    private Long size;
    private BackupStatus status;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
	
}