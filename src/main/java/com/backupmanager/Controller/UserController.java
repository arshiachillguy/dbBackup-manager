package com.backupmanager.Controller;

import com.backupmanager.Service.BackupService;
import java.io.IOException;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final BackupService backupService;

    public UserController(BackupService backupService) {
        this.backupService = backupService;
    }

    @DeleteMapping("/me")
    public void deleteUser(Authentication authentication)
        throws IOException, InterruptedException {
        String username = authentication.getName();

        backupService.deleteUser(username);
    }
}
