package com.backupmanager.Controller;

import com.backupmanager.BackupDTO.CreateBackupRequestDTO;
import com.backupmanager.BackupDTO.CreateBackupResponseDTO;
import com.backupmanager.RestoreDTO.RestoreRresponseDTO;
import com.backupmanager.Service.BackupService;

import jakarta.validation.Valid;

import java.io.IOException;
import java.util.List;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/backups")
public class BackupController {

    private final BackupService backupService;

    public BackupController(BackupService backupService){
        this.backupService = backupService;
    }

    @PostMapping
    public CreateBackupResponseDTO createBackup(
            @Valid @RequestBody CreateBackupRequestDTO requestDTO,
            Authentication authentication
    ) throws IOException, InterruptedException {
    
        String username = authentication.getName();
    
        return backupService.createBackup(requestDTO, username);
    }

    @GetMapping("/{id}")
    public CreateBackupResponseDTO getOneBackup(
        @PathVariable Long id,
        Authentication authentication
    ) {
        String username = authentication.getName();

        return backupService.getMyBackup(id , username);
    }

    @GetMapping
    public List<CreateBackupResponseDTO> getAllBackups(
        Authentication authentication
    ) {
        String username = authentication.getName();

        return backupService.getMyBackups(username);
    }

    @DeleteMapping("/{id}")
    public void deleteBackup(
        @PathVariable Long id,
        Authentication authentication
    ) throws IOException{
        String username = authentication.getName();

        backupService.deleteMyBackup(id , username);
    }

    @PostMapping("/{id}/restore")
    public RestoreRresponseDTO restoreBackup(
            @PathVariable Long id,
            Authentication authentication
    ) throws IOException, InterruptedException {
    
        String username = authentication.getName();
    
        return backupService.restoreBackup(id, username);
    }
    
}
