#!/bin/sh
# 安装/更新重启用的 launchd 任务，把 relaunch.sh 的绝对路径写进 plist。
set -e
DIR=$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)
PLIST="$HOME/Library/LaunchAgents/com.bigbluefish.dsh-relaunch.plist"
mkdir -p "$HOME/Library/LaunchAgents"
cat > "$PLIST" <<EOF
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
  <key>Label</key><string>com.bigbluefish.dsh-relaunch</string>
  <key>ProgramArguments</key>
  <array>
    <string>/bin/sh</string>
    <string>$DIR/relaunch.sh</string>
  </array>
  <key>RunAtLoad</key><false/>
  <key>KeepAlive</key><false/>
</dict>
</plist>
EOF
launchctl bootout "gui/$(id -u)/com.bigbluefish.dsh-relaunch" 2>/dev/null || true
launchctl bootstrap "gui/$(id -u)" "$PLIST"
echo "installed: $PLIST"
