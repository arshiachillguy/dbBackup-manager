package com.backupmanager.BackupDTO;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter 
@Setter 
@AllArgsConstructor 
public class BackupResultDTO {

    private String path;
    
    private Long size;
    
    private boolean success;	
}