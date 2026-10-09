package com.backupmanager.Controller;

import com.backupmanager.Service.UserService;
import java.io.IOException;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @DeleteMapping("/me")
    public void deleteUser(Authentication authentication)
        throws IOException, InterruptedException {
        String username = authentication.getName();

        userService.deleteUser(username);
    }
}
