package com.backupmanager.Controller;

import com.backupmanager.BackupDTO.CreateBackupResponseDTO;
import com.backupmanager.Service.BackupService;

import java.io.IOException;
import java.util.List;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/test")
public class BackupController {

    private final BackupService backupService;

    public BackupController(BackupService backupService) {
        this.backupService = backupService;
    }

    @GetMapping("/backup/{id}")
    public CreateBackupResponseDTO getOneBackup(
        @PathVariable Long id,
        Authentication authentication
    ) {
        String username = authentication.getName();

        return backupService.getMyBackup(id , username);
    }

    @GetMapping("/backup")
    public List<CreateBackupResponseDTO> getAllBackups(
        Authentication authentication
    ) {
        String username = authentication.getName();

        return backupService.getMyBackups(username);
    }

    @DeleteMapping("/delete/{id}")
    public void deleteBackup(
        @PathVariable Long id,
        Authentication authentication
    ) throws IOException{
        String username = authentication.getName();

        backupService.deleteMyBackup(id , username);
    }
    
}
