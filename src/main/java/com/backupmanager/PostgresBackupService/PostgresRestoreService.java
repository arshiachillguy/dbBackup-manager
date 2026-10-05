package com.backupmanager.PostgresBackupService;

import java.io.IOException;

import org.springframework.stereotype.Service;

import lombok.extern.slf4j.Slf4j;

@Slf4j 
@Service 
public class PostgresRestoreService {
    public void restoreBackupService(String dbname, String filePath) throws IOException , InterruptedException{

        ProcessBuilder processBuilder = new ProcessBuilder(
                   "pg_restore",
                   "-U", "postgres",
                   "-d", dbname,
                   "--clean",
                   "--if-exists",
                    filePath
           );

        log.info("Executing PostgreSQL command: {}", processBuilder.command());

        //starting point 
        Process process = processBuilder.start();
        
        String errorOutput = new String(
                process.getErrorStream().readAllBytes()
        );

        int exitcode = process.waitFor();

        
        System.out.println("pg_restore exit code: " + exitcode);
        System.out.println("pg_restore error: " + errorOutput);


        if (exitcode != 0) {
            throw new RuntimeException("Backup restore failed");
        }
    }
	
}