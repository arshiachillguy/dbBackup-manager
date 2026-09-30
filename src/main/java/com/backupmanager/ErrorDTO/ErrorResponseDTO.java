package com.backupmanager.ErrorDTO;

import java.time.LocalDateTime;

import lombok.Getter;
import lombok.Setter;

@Getter 
@Setter
// @AllArgsConstructor 
public class ErrorResponseDTO {

    private int status;
    private LocalDateTime timestamp;
    private String error;
    private String message;

}