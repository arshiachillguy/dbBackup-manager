package com.backupmanager.Exception;

import com.backupmanager.ErrorDTO.ErrorResponseDTO;
import java.time.LocalDateTime;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(InvalidCredentialsException.class)
    public ResponseEntity<ErrorResponseDTO> handleCredentialsException(
        InvalidCredentialsException Exception
    ) {
        ErrorResponseDTO errorResponseDTO = new ErrorResponseDTO();

        errorResponseDTO.setError("INVALID_CREDENTIALS");
        errorResponseDTO.setMessage(Exception.getMessage());
        errorResponseDTO.setStatus(HttpStatus.UNAUTHORIZED.value());
        errorResponseDTO.setTimestamp(LocalDateTime.now());

        return new ResponseEntity<>(errorResponseDTO, HttpStatus.UNAUTHORIZED);
    }

    @ExceptionHandler(UserNotFoundException.class)
    public ResponseEntity<ErrorResponseDTO> handleUserException(
        UserNotFoundException Exception
    ) {
        ErrorResponseDTO errorResponseDTO = new ErrorResponseDTO();

        errorResponseDTO.setError("USER_NOT_FOUND");
        errorResponseDTO.setMessage(Exception.getMessage());
        errorResponseDTO.setStatus(HttpStatus.NOT_FOUND.value());
        errorResponseDTO.setTimestamp(LocalDateTime.now());

        return new ResponseEntity<>(errorResponseDTO, HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<ErrorResponseDTO> handleRuntimeException(
        RuntimeException runtimeException
    ) {
        ErrorResponseDTO errorResponseDTO = new ErrorResponseDTO();

        errorResponseDTO.setError("INTERNAL_ERROR");
        errorResponseDTO.setMessage(runtimeException.getMessage());
        errorResponseDTO.setStatus(HttpStatus.INTERNAL_SERVER_ERROR.value());
        errorResponseDTO.setTimestamp(LocalDateTime.now());

        return new ResponseEntity<>(
            errorResponseDTO,
            HttpStatus.INTERNAL_SERVER_ERROR
        );
    }

    @ExceptionHandler(BackupNotFoundException.class)
    public ResponseEntity<ErrorResponseDTO> handleDeleteException(
        RuntimeException runtimeException
    ) {
        ErrorResponseDTO errorResponseDTO = new ErrorResponseDTO();

        errorResponseDTO.setError("BACKUP_NOT_FOUND");
        errorResponseDTO.setMessage(runtimeException.getMessage());
        errorResponseDTO.setStatus(HttpStatus.NOT_FOUND.value());
        errorResponseDTO.setTimestamp(LocalDateTime.now());

        return new ResponseEntity<>(errorResponseDTO, HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler(UserHasBackupsException.class)
    public ResponseEntity<ErrorResponseDTO> handleUserHasBackupsException(
        UserHasBackupsException exception
    ) {
        ErrorResponseDTO errorResponseDTO = new ErrorResponseDTO();

        errorResponseDTO.setError("USER_HAS_BACKUPS");
        errorResponseDTO.setMessage(exception.getMessage());
        errorResponseDTO.setStatus(HttpStatus.CONFLICT.value());
        errorResponseDTO.setTimestamp(LocalDateTime.now());

        return new ResponseEntity<>(errorResponseDTO, HttpStatus.CONFLICT);
    }
}
