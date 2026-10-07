package com.backupmanager;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import com.backupmanager.BackupDTO.BackupResultDTO;
import com.backupmanager.BackupDTO.CreateBackupRequestDTO;
import com.backupmanager.BackupDTO.CreateBackupResponseDTO;
import com.backupmanager.Exception.BackupNotFoundException;
import com.backupmanager.Exception.UserHasBackupsException;
import com.backupmanager.Exception.UserNotFoundException;
import com.backupmanager.Model.Backup;
import com.backupmanager.Model.BackupStatus;
import com.backupmanager.Model.User;
import com.backupmanager.PostgresBackupService.PostgresBackupService;
import com.backupmanager.PostgresBackupService.PostgresRestoreService;
import com.backupmanager.Repository.BackupRepository;
import com.backupmanager.Repository.UserRepository;
import com.backupmanager.Service.BackupService;
import java.io.IOException;
import java.util.Optional;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.core.userdetails.UsernameNotFoundException;

@ExtendWith(MockitoExtension.class)
public class BackupServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private BackupRepository backupRepository;

    @Mock
    private PostgresBackupService postgresBackupService;

    @Mock
    private PostgresRestoreService postgresRestoreService;

    @Mock
    private CreateBackupRequestDTO createBackupRequestDTO;

    @InjectMocks
    private BackupService backupService;

    @Test
    void deleteUser() {
        User user = new User();

        when(userRepository.findByUsername("ali")).thenReturn(user);

        when(backupRepository.existsByOwnerUsername("ali")).thenReturn(false);

        backupService.deleteUser("ali");

        verify(userRepository).delete(user);
    }

    @Test
    void deleteUser_WhenUserDoesNotExist_ShouldThrowException() {
        when(userRepository.findByUsername("ali")).thenReturn(null);

        assertThrows(UsernameNotFoundException.class, () ->
            backupService.deleteUser("ali")
        );
    }

    @Test
    void cannotdeleteUser() {
        User user = new User();

        when(userRepository.findByUsername("ali")).thenReturn(user);

        when(backupRepository.existsByOwnerUsername("ali")).thenReturn(true);

        assertThrows(UserHasBackupsException.class, () ->
            backupService.deleteUser("ali")
        );
    }

    // -----------------------------------------------

    @Test
    void getMyBackup() {
        Backup backup = new Backup();

        backup.setId(1L);
        backup.setBackupName("test-backup");
        backup.setDbname("mydb");
        backup.setPath("/backup/test");

        when(backupRepository.findByIdAndOwnerUsername(1L, "ali")).thenReturn(
            Optional.of(backup)
        );

        CreateBackupResponseDTO result = backupService.getMyBackup(1l, "ali");

        assertEquals(1L, result.getId());
        assertEquals("test-backup", result.getBackupName());
        assertEquals("mydb", result.getDbname());
        assertEquals("/backup/test", result.getPath());
    }

    @Test
    void faildgetmybackup() {
        when(backupRepository.findByIdAndOwnerUsername(1L, "ali")).thenReturn(
            Optional.empty()
        );

        assertThrows(RuntimeException.class, () ->
            backupService.getMyBackup(1L, "ali")
        );
    }

    // -----------------------------------------------
    @Test
    void faildDeleteBackup() {
        when(backupRepository.findByIdAndOwnerUsername(1L, "ali")).thenReturn(
            Optional.empty()
        );

        assertThrows(BackupNotFoundException.class, () ->
            backupService.deleteMyBackup(1L, "ali")
        );
    }

    @Test
    void deleteBackup() throws IOException {
        Backup backup = new Backup();

        backup.setId(1L);
        backup.setBackupName("test-backup");
        backup.setDbname("mydb");
        backup.setPath("/backup/test");

        when(backupRepository.findByIdAndOwnerUsername(1L, "ali")).thenReturn(
            Optional.of(backup)
        );

        backupService.deleteMyBackup(1L, "ali");

        verify(backupRepository).delete(backup);
    }

    // -----------------------------------------------
    @Test
    void createBackup() throws IOException, InterruptedException {
        // Arrange
        CreateBackupRequestDTO requestDTO = new CreateBackupRequestDTO();

        requestDTO.setDbname("dbname");

        User user = new User();

        when(userRepository.findByUsername("ali")).thenReturn(user);

        BackupResultDTO resultDTO = new BackupResultDTO(
            "/backup/test",
            100L,
            true
        );

        when(
            postgresBackupService.CreateBackup(anyString(), eq("dbname"))
        ).thenReturn(resultDTO);

        Backup savedBackup = new Backup();
        savedBackup.setId(1L);
        savedBackup.setBackupName("dbname_20261006_123456");
        savedBackup.setDbname("dbname");
        savedBackup.setPath("/backup/test");
        savedBackup.setSize(100L);
        savedBackup.setStatus(BackupStatus.COMPLETED);

        when(backupRepository.save(any(Backup.class))).thenReturn(savedBackup);

        backupService.createBackup(requestDTO, "ali");

        // Act
        CreateBackupResponseDTO result = backupService.createBackup(requestDTO, "ali");

        assertEquals(1L, result.getId());
        assertEquals("dbname", result.getDbname());
        assertEquals("/backup/test", result.getPath());
        assertEquals(100L, result.getSize());
        assertEquals(BackupStatus.COMPLETED, result.getStatus());
    }
    
    @Test 
    void failedcreatebackup()throws IOException , InterruptedException{
        CreateBackupRequestDTO requestDTO = new CreateBackupRequestDTO();

        requestDTO.setDbname("dbname");
        
        when(userRepository.findByUsername("ali")).thenReturn(null);

        assertThrows(UserNotFoundException.class , () -> backupService.createBackup(requestDTO, "ali"));
        
    }
}
