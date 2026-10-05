package com.backupmanager.Exception;

public class UserHasBackupsException extends RuntimeException{
    public UserHasBackupsException(String message){
        super(message);
    }
	
}