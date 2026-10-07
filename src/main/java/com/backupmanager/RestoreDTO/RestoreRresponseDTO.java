package com.backupmanager.RestoreDTO;

import java.time.LocalDateTime;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter

public class RestoreRresponseDTO {

    private boolean success;

    private String message;

    private Long backupId;

    private String backupName;

    private String dbname;

    private LocalDateTime restoredAt;
}
