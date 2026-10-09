package com.backupmanager.PostgresBackupService;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

import org.springframework.stereotype.Service;

import com.backupmanager.BackupDTO.BackupResultDTO;

import lombok.extern.slf4j.Slf4j;

@Slf4j 
@Service
public class PostgresBackupService {
    public BackupResultDTO CreateBackup(
            String backupName,
            String dbname
    ) throws IOException, InterruptedException {
    
        // 1. Create backup directory
        Path backupDirectory = Paths.get("backups");
        Files.createDirectories(backupDirectory);
    
        // 2. Create backup file path
        Path backupPath = backupDirectory.resolve(backupName + ".dump");
    
        log.info("Backup path: {}", backupPath.toAbsolutePath());
    
        // 3. Build PostgreSQL command
        ProcessBuilder processBuilder = new ProcessBuilder(
            "pg_dump",
            "-U", "postgres",
            "-d", dbname,
            "-Fc",
            "--clean",
            "--if-exists",
            "-f", backupPath.toString()
        );
    
        // Merge stdout and stderr
        processBuilder.redirectErrorStream(true);
    
        log.info("Executing PostgreSQL command: {}", processBuilder.command());
    
        // 4. Start process
        Process process = processBuilder.start();
    
        // 5. Read process output
        String output;
    
        try (var inputStream = process.getInputStream()) {
            output = new String(
                inputStream.readAllBytes(),
                java.nio.charset.StandardCharsets.UTF_8
            );
        }
    
        // 6. Wait for process completion
        int exitCode = process.waitFor();
    
        log.info("pg_dump exit code: {}", exitCode);
    
        // 7. Handle process failure
        if (exitCode != 0) {
            log.error(
                "pg_dump failed. Exit code: {}, Output: {}",
                exitCode,
                output
            );
    
            Files.deleteIfExists(backupPath);
    
            return new BackupResultDTO(null, 0L, false);
        }
    
        // 8. Verify backup file
        if (!Files.isRegularFile(backupPath)) {
            log.error("pg_dump completed, but backup file was not created");
    
            return new BackupResultDTO(null, 0L, false);
        }
    
        // 9. Get backup file size
        long size = Files.size(backupPath);
    
        log.info("Backup completed successfully");
        log.info("Backup path: {}", backupPath.toAbsolutePath());
        log.info("Backup size: {} bytes", size);
    
        // 10. Return success result
        return new BackupResultDTO(
            backupPath.toString(),
            size,
            true
        );
    }

    public void delete(String filePath) throws IOException{
        
        if (filePath == null) {
            return;
        }
        
        Path path = Paths.get(filePath);

        if (Files.exists(path)){
            Files.delete(path);
        }
    }
}
