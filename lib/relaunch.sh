#!/bin/sh
# 等 DSH 主进程真正退出，再把它打开（由 launchd 负责运行，DSH 退出不会影响它）。
LOG=/tmp/dsh-restart.log
echo "$(date '+%F %T') relaunch: waiting for DSH to exit" >> "$LOG"
for i in $(seq 1 80); do
  if ! ps -ax -o command= | awk '$0 == "/Applications/DeepSeek Harness.app/Contents/MacOS/DeepSeek Harness"' | grep -q .; then
    break
  fi
  sleep 0.25
done
sleep 2
echo "$(date '+%F %T') relaunch: opening DSH" >> "$LOG"
/usr/bin/open "/Applications/DeepSeek Harness.app"
echo "$(date '+%F %T') relaunch: open exit=$?" >> "$LOG"
