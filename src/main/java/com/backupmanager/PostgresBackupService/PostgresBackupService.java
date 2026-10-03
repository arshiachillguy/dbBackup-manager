package com.backupmanager.PostgresBackupService;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

import org.springframework.stereotype.Service;

import com.backupmanager.BackupDTO.BackupResultDTO;

@Service
public class PostgresBackupService {

    public BackupResultDTO CreateBackup(String backupName) throws IOException, InterruptedException {

        // create backup directory
        Path backupDirectory = Paths.get("backups");
        // if it's not exsist create one directory name's backup
        Files.createDirectories(backupDirectory);

        // create complete file path
        Path backupPath = backupDirectory.resolve(backupName + ".sql");
        System.out.println("Backup path = " + backupPath.toAbsolutePath());

        // run command
        ProcessBuilder processBuilder = new ProcessBuilder(
            "pg_dump",
            "-U",
            "postgres",
            "-d",
            "backup_manager",
            "-f",
            backupPath.toString()
        );

        // starting point
        Process process = processBuilder.start();

        int exitcode = process.waitFor();

        System.out.println("pg_dump exit code is " + exitcode);

        if (exitcode == 0) {
            System.out.println("Backup successful");

            if (Files.exists(backupPath)) {
                // getting the size of backup file created
                Long size = Files.size(backupPath);

                System.out.println("Backup path = " + backupPath);
                System.out.println("Backup size = " + size + " bytes");

                return new BackupResultDTO(
                        backupPath.toString(),
                        size,
                        true
                );

            } else {
                System.out.println("Backup failed : file was not created");
            }
        } else {
            System.out.println("Backup failed");
        }

        return new BackupResultDTO(
                null,
                0L,
                false
        );

        
    }

    public void delete(String filePath) throws IOException{
        Path path = Paths.get(filePath);
        Files.delete(path);
    }
}
