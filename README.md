# dsh-restart-button

给 [DeepSeek Harness](https://github.com/deepseek-ai) Web 侧栏底部加一个「重启 DSH」按钮：点一下就会退出当前 DSH 进程，等它真正退出后再自动把它重新打开。

## 为什么需要它

DSH 桌面版没有内置重启入口；手工退出再打开容易点到旧进程。这个插件把「退出 + 等待 + 重新打开」做成了一个按钮。

重新打开由 **launchd** 负责（`com.bigbluefish.dsh-relaunch`），所以即使 DSH 进程被强制结束，拉起动作也不会被一起带走。

## 安装

```sh
# 放到当前 profile 的 node_modules
cp -R dsh-restart-button ~/.dsh/profiles/<profile>/node_modules/

# 首次安装 launchd 任务（会把 relaunch.sh 的绝对路径写进 plist）
sh ~/.dsh/profiles/<profile>/node_modules/dsh-restart-button/lib/setup.sh
```

然后在 profile 的 `package.json` 里把它加进 `dsh.profile.bundles`，重启 DSH 即可。

## 工作方式

1. `lib/client.js` 在 `sidebar.footer.action` 插槽渲染按钮
2. 点击后 POST `/api/dsh-restart-button`（需要 `x-dsh-restart: 1`）
3. `lib/restart.sh`：`launchctl kickstart` 启动 relaunch 任务，然后退出 DSH
4. `lib/relaunch.sh`：轮询等待 DSH 主进程消失，再 `open` 应用

日志在 `/tmp/dsh-restart.log`。

## 可配置

- 应用路径：`relaunch.sh` 里的 `/Applications/DeepSeek Harness.app`
- launchd 标签：`com.bigbluefish.dsh-relaunch`

## License

MIT
