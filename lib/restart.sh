#!/bin/sh
# 重启 DSH：先让 launchd 拉起 relaunch 任务，再退出 DSH。
# 不用 launchctl submit / 后台 perl：那些方式在 DSH 退出时可能被连带清理，
# 这也是之前「点了重启只关不开」的原因。
LOG=/tmp/dsh-restart.log
echo "$(date '+%F %T') restart: requested" >> "$LOG"

if /bin/launchctl kickstart -k "gui/$(id -u)/com.bigbluefish.dsh-relaunch" >> "$LOG" 2>&1; then
  echo "$(date '+%F %T') restart: relaunch agent kicked" >> "$LOG"
else
  echo "$(date '+%F %T') restart: kickstart failed, falling back to detached perl" >> "$LOG"
  DIR=$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)
  /usr/bin/perl -MPOSIX -e 'POSIX::setsid(); exec "/bin/sh", $ARGV[0];' "$DIR/relaunch.sh" >/dev/null 2>&1 &
fi

sleep 1
/usr/bin/osascript -e 'tell application "DeepSeek Harness" to quit' >> "$LOG" 2>&1
sleep 2
/usr/bin/pkill -TERM -f "/Applications/DeepSeek Harness.app/Contents/MacOS/DeepSeek Harness" >> "$LOG" 2>&1
echo "$(date '+%F %T') restart: quit sent" >> "$LOG"
