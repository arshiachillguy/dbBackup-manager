#!/usr/bin/env bash
set -euo pipefail

APP_DIR="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"
PID_FILE="$APP_DIR/backup-manager.pid"

if [[ ! -f "$PID_FILE" ]]; then
    echo "Application is not running (PID file not found)."
    exit 0
fi

PID="$(cat "$PID_FILE")"

if ! [[ "$PID" =~ ^[0-9]+$ ]]; then
    echo "Invalid PID file. Removing it."
    rm -f "$PID_FILE"
    exit 1
fi

if ! kill -0 "$PID" 2>/dev/null; then
    echo "Application is not running. Removing stale PID file."
    rm -f "$PID_FILE"
    exit 0
fi

echo "Stopping application (PID $PID)..."
kill -TERM "$PID"

for i in {1..30}; do
    if ! kill -0 "$PID" 2>/dev/null; then
        rm -f "$PID_FILE"
        echo "Application stopped."
        exit 0
    fi
    sleep 1
done

echo "Application did not stop within 30 seconds."
echo "PID file kept at: $PID_FILE"
exit 1
