package com.backupmanager.Service;

import com.backupmanager.BackupDTO.BackupResultDTO;
import com.backupmanager.BackupDTO.CreateBackupRequestDTO;
import com.backupmanager.BackupDTO.CreateBackupResponseDTO;
import com.backupmanager.Exception.BackupNotFoundException;
import com.backupmanager.Exception.UserNotFoundException;
import com.backupmanager.Model.Backup;
import com.backupmanager.Model.BackupStatus;
import com.backupmanager.Model.User;
import com.backupmanager.PostgresBackupService.PostgresBackupService;
import com.backupmanager.Repository.BackupRepository;
import com.backupmanager.Repository.UserRepository;
import java.io.IOException;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import org.springframework.stereotype.Service;

@Service
public class BackupService {

    private final BackupRepository backupRepository;
    private final UserRepository userRepository;
    private final PostgresBackupService postgresBackupService;

    public BackupService(
        BackupRepository backupRepository,
        UserRepository userRepository,
        PostgresBackupService postgresBackupService
    ) {
        this.backupRepository = backupRepository;
        this.userRepository = userRepository;
        this.postgresBackupService = postgresBackupService;
    }

    // get all backups of specifice user
    public List<CreateBackupResponseDTO> getMyBackups(String username) {
        List<Backup> backups = backupRepository.findAllByOwnerUsername(
            username
        );

        List<CreateBackupResponseDTO> responseDTO = new ArrayList<>();

        for (Backup backup : backups) {
            CreateBackupResponseDTO dto = new CreateBackupResponseDTO();
            dto.setBackupName(backup.getBackupName());
            dto.setId(backup.getId());
            dto.setDbname(backup.getDbname());
            dto.setPath(backup.getPath());
            dto.setSize(backup.getSize());
            dto.setStatus(backup.getStatus());
            dto.setCreatedAt(backup.getCreatedAt());
            dto.setUpdatedAt(backup.getUpdatedAt());

            responseDTO.add(dto);
        }
        return responseDTO;
    }

    // get one backup 
    public CreateBackupResponseDTO getMyBackup(Long id, String username) {
        
        Backup backup = backupRepository
            .findByIdAndOwnerUsername(id, username)
            .orElseThrow(() -> new RuntimeException("Backup not found !"));

        CreateBackupResponseDTO responseDTO = new CreateBackupResponseDTO();    

        responseDTO.setId(backup.getId());
        responseDTO.setBackupName(backup.getBackupName());
        responseDTO.setDbname(backup.getDbname());
        responseDTO.setPath(backup.getPath());
        responseDTO.setSize(backup.getSize());
        responseDTO.setStatus(backup.getStatus());
        responseDTO.setCreatedAt(backup.getCreatedAt());
        responseDTO.setUpdatedAt(backup.getUpdatedAt());

        return responseDTO;

    }

    // delete one backup
    public void deleteMyBackup(Long id, String username) throws IOException{
    
        Backup backup = backupRepository
            .findByIdAndOwnerUsername(id, username)
            .orElseThrow(() -> new BackupNotFoundException("Backup not found"));

        postgresBackupService.delete(backup.getPath());
        backupRepository.delete(backup);
    }

    // create new backup
    public CreateBackupResponseDTO createBackup(
        CreateBackupRequestDTO requestDTO,
        String username
    ) throws IOException, InterruptedException {
        User user = userRepository.findByUsername(username);

        if (user == null) {
            throw new UserNotFoundException("Invalid username or password");
        }

        //create a name for every single backup created
        String backupName =
            "backup_manager_" +
            LocalDateTime.now().format(
                DateTimeFormatter.ofPattern("yyyyMMdd_HHmmss")
            );

        Backup backup = new Backup();
        backup.setOwner(user);
        backup.setBackupName(backupName);
        backup.setDbname(requestDTO.getDbname());
        backup.setStatus(BackupStatus.CREATING);

        BackupResultDTO resultDTO = postgresBackupService.CreateBackup(
            backupName
        );

        if (resultDTO.isSuccess()) {
            backup.setPath(resultDTO.getPath());
            backup.setSize(resultDTO.getSize());
            backup.setStatus(BackupStatus.COMPLETED);
        } else {
            backup.setStatus(BackupStatus.FAILED);
        }
        // save to db
        Backup savedBackup = backupRepository.save(backup);

        CreateBackupResponseDTO responseDTO = new CreateBackupResponseDTO();
        responseDTO.setBackupName(savedBackup.getBackupName());
        responseDTO.setId(savedBackup.getId());
        responseDTO.setDbname(savedBackup.getDbname());
        responseDTO.setPath(savedBackup.getPath());
        responseDTO.setSize(savedBackup.getSize());
        responseDTO.setStatus(savedBackup.getStatus());
        responseDTO.setCreatedAt(savedBackup.getCreatedAt());
        responseDTO.setUpdatedAt(savedBackup.getUpdatedAt());

        return responseDTO;
    }
}
