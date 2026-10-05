package com.backupmanager.Repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.backupmanager.Model.Backup;

public interface BackupRepository extends JpaRepository<Backup , Long>{

    List<Backup> findAllByOwnerUsername(String username);

    Optional<Backup> findByIdAndOwnerUsername(Long id, String username);

    boolean existsByOwnerUsername(String username);
}
