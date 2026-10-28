import { spawn } from 'node:child_process'
import { fileURLToPath } from 'node:url'

export const name = 'dsh-restart-button'
export const inject = ['webServer']

const ROUTE = '/api/dsh-restart-button'
const SCRIPT = fileURLToPath(new URL('./restart.sh', import.meta.url))

export function apply(ctx) {
  ctx.effect(() => ctx.webServer.register({
    kind: 'exact',
    path: ROUTE,
    handler: (req, res) => {
      if (req.headers['x-dsh-restart'] !== '1') {
        res.writeHead(403, { 'content-type': 'text/plain' })
        res.end('forbidden')
        return
      }
      res.writeHead(200, { 'content-type': 'application/json', 'cache-control': 'no-store' })
      res.end(JSON.stringify({ ok: true }))
      // detached：脚本先让 launchd 接管「重新打开」，宿主随后退出也不会中断它
      const child = spawn('/bin/sh', [SCRIPT], { detached: true, stdio: 'ignore' })
      child.unref()
      ctx.logger?.info?.('dsh-restart-button: 重启请求已受理')
    },
  }), 'dsh-restart-button: route')
}
