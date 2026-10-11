# Backup Manager

Backup Manager is a web application for managing database backups and restoring databases from backup files.

**Currently, Backup Manager supports PostgreSQL only.** Support for additional database systems is planned for future releases.

## 1. Supported Database

The current version is designed specifically for PostgreSQL.

Supported operations include:

- Creating PostgreSQL database backups.
- Managing backup records and history.
- Restoring PostgreSQL databases from backup files.

Additional database systems may be supported in future versions. They are not supported by the current release.

## 2. Prerequisites

Before running the application, install the following software:

- **Java 21** or a compatible Java version.
- **PostgreSQL Client Tools**, including `pg_dump` and `pg_restore`.
- Network access to the PostgreSQL server and valid database connection credentials.

Verify the required tools:

```bash
java -version
pg_dump --version
pg_restore --version
```

Make sure both PostgreSQL utilities are available in your system's `PATH`.

## 3. Application Files

The `release` directory contains the application JAR and management scripts:

- `backup-manager-0.0.1-SNAPSHOT.jar` — the application.
- `start.sh` — starts the application in the background.
- `stop.sh` — stops the application.
- `update.sh` — updates the application using a newly built JAR.
- `README.md` — this guide.

## 4. Data Storage

By default, the application stores its data outside the release directory:

```text
~/.local/share/backup-manager/
```

This directory contains:

- `backup-manager.db` — the SQLite database containing backup metadata and history.
- `backups/` — the directory containing backup files.

The data directory is separate from the application JAR. Replacing or updating the JAR should not delete existing backup files or metadata.

To use a custom data directory, set the `BACKUP_MANAGER_DATA_DIR` environment variable before starting the application. Use the same value consistently for subsequent starts and updates.

## 5. Start and Stop the Application

### Start

Open a terminal in the `release` directory and run:

```bash
./start.sh
```

The application runs in the background. Its process ID is recorded in `backup-manager.pid`, and application output is appended to `backup-manager.log`.

Check the log if the application does not start successfully.

### Stop

From the `release` directory, run:

```bash
./stop.sh
```

The script requests a graceful shutdown and waits for the process to stop.

## 6. Update

1. Build the new application JAR from the project root:

   ```bash
   mvn clean package
   ```

2. Run the update script and provide the path to the newly built JAR:

   ```bash
   ./release/update.sh "$PWD/target/backup-manager-0.0.1-SNAPSHOT.jar"
   ```

The script stops the application if it is running, saves the current JAR as `backup-manager-0.0.1-SNAPSHOT.jar.previous`, and installs the new JAR. If the application was running before the update, the script attempts to start it again.

The script does not automatically roll back if the new version fails to start. Check `release/backup-manager.log` if a problem occurs.

**Important:** Back up the application data directory before updating. Do not delete the data directory when replacing the application JAR.
