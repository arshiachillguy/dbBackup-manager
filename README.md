# dbBackup_manager

A simple tool to back up and restore PostgreSQL databases locally.

## Features

- Create local PostgreSQL database backups
- Restore databases from existing backups
- Web-based user interface
- Persistent storage for application data and backups
- Start, stop, and update scripts

## Requirements

- Java 21
- PostgreSQL client tools: `pg_dump` and `pg_restore`
- Network access to the PostgreSQL server you want to back up

## Download

Download the latest release from the [GitHub Releases](../../releases) page.

Download `backup-manager-release.tar.gz` and extract it.

## Getting Started

1. Extract the downloaded archive.
2. Open a terminal in the extracted directory.
3. Start the application:

   ```bash
   ./start.sh
   ```

4. Open [http://localhost:8080](http://localhost:8080) in your browser.
5. Register an account or log in to use the application.

To stop the application, run:

```bash
./stop.sh
```

See the `README.md` included in the release archive for more detailed instructions.

## Data Storage

By default, application data and backups are stored in:

```text
~/.local/share/backup-manager/
```

You can change the data directory using the `BACKUP_MANAGER_DATA_DIR` environment variable.

**Important:** Back up your application data directory before updating or removing the application.

## Supported Databases

Currently, PostgreSQL is supported. Support for additional database systems may be added in future releases.
