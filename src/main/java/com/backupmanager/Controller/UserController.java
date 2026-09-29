package com.backupmanager.Controller;

import com.backupmanager.BackupDTO.CreateBackupRequestDTO;
import com.backupmanager.BackupDTO.CreateBackupResponseDTO;
import com.backupmanager.PostgresBackupService.PostgresBackupService;
import com.backupmanager.Service.BackupService;
import jakarta.validation.Valid;
import java.io.IOException;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/test")
public class UserController {

    private final BackupService backupService;
    private final PostgresBackupService postgresBackupService;

    public UserController(
        BackupService backupService,
        PostgresBackupService postgresBackupService
    ) {
        this.backupService = backupService;
        this.postgresBackupService = postgresBackupService;
    }

    @GetMapping
    public String test() {
        return "jwt works !!!";
    }

    @GetMapping("/user-only")
    @PreAuthorize("hasRole('USER')")
    public String userOnly() {
        return "Hello USER!";
    }

    @GetMapping("/user")
    @PreAuthorize("hasRole('USER')")
    public String userEndpoint() {
        return "USER access granted";
    }

    @GetMapping("/admin")
    @PreAuthorize("hasRole('ADMIN')")
    public String adminEndpoint() {
        return "ADMIN access granted";
    }

    @PostMapping("/backup")
    public CreateBackupResponseDTO createBackup(
            @Valid @RequestBody CreateBackupRequestDTO requestDTO,
            Authentication authentication
    ) throws IOException, InterruptedException {
    
        String username = authentication.getName();
    
        return backupService.createBackup(requestDTO, username);
    }
}
