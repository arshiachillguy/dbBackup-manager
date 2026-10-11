#!/usr/bin/env bash
set -euo pipefail

APP_DIR="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"
JAR_NAME="backup-manager-0.0.1-SNAPSHOT.jar"
TARGET_JAR="$APP_DIR/$JAR_NAME"
BACKUP_JAR="$APP_DIR/$JAR_NAME.previous"

NEW_JAR="${1:-}"

if [[ -z "$NEW_JAR" ]]; then
    echo "Usage: ./update.sh /path/to/new/$JAR_NAME"
    exit 1
fi

if [[ ! -f "$NEW_JAR" ]]; then
    echo "Error: New JAR not found: $NEW_JAR"
    exit 1
fi

NEW_JAR="$(realpath "$NEW_JAR")"

if [[ "$NEW_JAR" == "$TARGET_JAR" ]]; then
    echo "Error: The new JAR must be a separate file."
    exit 1
fi

WAS_RUNNING=false

if [[ -f "$APP_DIR/backup-manager.pid" ]]; then
    PID="$(cat "$APP_DIR/backup-manager.pid")"
    if [[ "$PID" =~ ^[0-9]+$ ]] && kill -0 "$PID" 2>/dev/null; then
        WAS_RUNNING=true
    fi
fi

if [[ "$WAS_RUNNING" == true ]]; then
    "$APP_DIR/stop.sh"
fi

if [[ -f "$TARGET_JAR" ]]; then
    cp -f "$TARGET_JAR" "$BACKUP_JAR"
fi

cp -f "$NEW_JAR" "$TARGET_JAR"

echo "Application JAR updated successfully."

if [[ "$WAS_RUNNING" == true ]]; then
    "$APP_DIR/start.sh"
else
    echo "The application was not running before the update."
    echo "Start it with: $APP_DIR/start.sh"
fi
