
#!/usr/bin/env bash
set -euo pipefail

APP_DIR="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"
JAR="$APP_DIR/backup-manager-0.0.1-SNAPSHOT.jar"
PID_FILE="$APP_DIR/backup-manager.pid"
LOG_FILE="$APP_DIR/backup-manager.log"

PORT=8080
URL="http://localhost:$PORT"

if ! command -v java >/dev/null 2>&1; then
    echo "Error: Java is not installed or not in PATH."
    exit 1
fi

if [[ ! -f "$JAR" ]]; then
    echo "Error: Application JAR not found: $JAR"
    exit 1
fi

if [[ -f "$PID_FILE" ]] && kill -0 "$(cat "$PID_FILE")" 2>/dev/null; then
    PID="$(cat "$PID_FILE")"
    echo "Application is already running."
    echo "PID: $PID"
    echo "Port: $PORT"
    echo "URL: $URL"

    if command -v xdg-open >/dev/null 2>&1; then
        xdg-open "$URL" >/dev/null 2>&1 &
    fi
    exit 0
fi

cd "$APP_DIR"
nohup java -jar "$JAR" >> "$LOG_FILE" 2>&1 &
PID=$!
echo "$PID" > "$PID_FILE"

echo "Starting Backup Manager..."

for i in {1..30}; do
    if ! kill -0 "$PID" 2>/dev/null; then
        echo "Error: Application failed to start. Check the log:"
        echo "$LOG_FILE"
        rm -f "$PID_FILE"
        exit 1
    fi

    if grep -q "Tomcat started on port $PORT" "$LOG_FILE"; then
        echo "Backup Manager started successfully."
        echo "PID: $PID"
        echo "Port: $PORT"
        echo "Open: $URL"

        if command -v xdg-open >/dev/null 2>&1; then
            xdg-open "$URL" >/dev/null 2>&1 &
        else
            echo "Open the URL above in your browser."
        fi
        exit 0
    fi

    sleep 1
done

echo "Application is still starting. Check the log:"
echo "$LOG_FILE"
echo "URL: $URL"
