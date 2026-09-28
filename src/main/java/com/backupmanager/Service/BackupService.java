package com.backupmanager.Service;

import com.backupmanager.BackupDTO.CreateBackupRequestDTO;
import com.backupmanager.BackupDTO.CreateBackupResponseDTO;
import com.backupmanager.Model.Backup;
import com.backupmanager.Model.BackupStatus;
import com.backupmanager.Model.User;
import com.backupmanager.Repository.BackupRepository;
import com.backupmanager.Repository.UserRepository;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import org.springframework.stereotype.Service;

@Service
public class BackupService {

    private final BackupRepository backupRepository;
    private final UserRepository userRepository;
    
    public BackupService(
        BackupRepository backupRepository,
        UserRepository userRepository
    ) {
        this.backupRepository = backupRepository;
        this.userRepository = userRepository;
    }

    // get all backups of specifice user
    public List<Backup> getMyBackups(String username) {
        return backupRepository.findAllByOwnerUsername(username);
    }

    //
    public Backup getMyBackup(Long id, String username) {
        return backupRepository
            .findByIdAndOwnerUsername(id, username)
            .orElseThrow(() -> new RuntimeException("Backup not found !"));
    }

    // delete one backup
    public void deleteMyBackup(Long id, String username) {
        Backup backup = backupRepository
            .findByIdAndOwnerUsername(id, username)
            .orElseThrow(() -> new RuntimeException("Backup not found"));

        backupRepository.delete(backup);
    }

    // create new backup
    public CreateBackupResponseDTO createBackup( CreateBackupRequestDTO requestDTO,String username){

        User user = userRepository.findByUsername(username);
        
        if (user == null)
        {

            throw new RuntimeException("username not found.");
        }

        //create a name for every single backup created
        String backupName = "backup_manager_" +
                LocalDateTime.now().format(
                        DateTimeFormatter.ofPattern("yyyyMMdd_HHmmss")
                );

        Backup backup = new Backup();
        backup.setOwner(user);
        backup.setBackupName(backupName);
        backup.setDbname(requestDTO.getDbname());
        backup.setStatus(BackupStatus.CREATING);
        Backup savedbBackup = backupRepository.save(backup);
        
        CreateBackupResponseDTO responseDTO = new CreateBackupResponseDTO();
        responseDTO.setBackupName(savedbBackup.getBackupName());
        responseDTO.setId(savedbBackup.getId());
        responseDTO.setDbname(savedbBackup.getDbname());
        responseDTO.setPath(savedbBackup.getPath());
        responseDTO.setSize(savedbBackup.getSize());
        responseDTO.setStatus(savedbBackup.getStatus());
        responseDTO.setCreatedAt(savedbBackup.getCreatedAt());
        responseDTO.setUpdatedAt(savedbBackup.getUpdatedAt());

        return responseDTO;
        
    }

}
