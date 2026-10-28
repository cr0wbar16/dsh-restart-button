window.__ModuleLoader__.load({
  id: 'dsh-restart-button',
  factory: (require) => {
    var module = { exports: {} }
    var exports = module.exports
    let react = require('react')
    let jsx = require('react/jsx-runtime')

    const CSS = `
.dsh-restart-trigger {
  display: inline-flex; align-items: center; gap: 6px;
  border: 1px solid var(--dsw-alias-border-l2, rgba(15,23,42,.12));
  background: var(--dsw-alias-bg-module-platform, #fff);
  color: var(--dsw-alias-label-primary, #1f2937);
  border-radius: 8px; padding: 4px 10px; font-size: 12px;
  line-height: 18px; cursor: pointer; font-weight: 500;
  font-family: var(--dsw-font-family, inherit);
}
.dsh-restart-trigger:hover { background: var(--dsw-alias-interactive-bg-hover, rgba(15,23,42,.06)); }
.dsh-restart-trigger:disabled { opacity: .55; cursor: default; }
.dsh-restart-trigger svg { width: 13px; height: 13px; }
`

    function Trigger() {
      const [busy, setBusy] = react.useState(false)
      const onClick = async () => {
        if (busy) return
        if (!window.confirm('重启 DeepSeek Harness？当前会话会中断，聊天记录会保留。')) return
        setBusy(true)
        try {
          await fetch('/api/dsh-restart-button', {
            method: 'POST',
            headers: { 'x-dsh-restart': '1' },
          })
        } catch { setBusy(false) }
      }
      return jsx.jsx('button', {
        className: 'dsh-restart-trigger',
        title: '重启 DeepSeek Harness（会话会中断，记录保留）',
        onClick,
        disabled: busy,
        children: [
          jsx.jsx('svg', {
            viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 2,
            strokeLinecap: 'round', strokeLinejoin: 'round',
            children: jsx.jsx('path', { d: 'M3 12a9 9 0 1 0 3-6.7L3 8m0-5v5h5' }),
          }, 'icon'),
          jsx.jsx('span', { children: busy ? '重启中…' : '重启' }, 'label'),
        ],
      })
    }

    function apply(ctx) {
      ctx.effect(() => {
        const style = document.createElement('style')
        style.textContent = CSS
        document.head.appendChild(style)
        return () => style.remove()
      }, 'dsh-restart-button: styles')
      ctx.slots.inject('sidebar.footer.action', () => ctx.slots.register({
        name: 'sidebar.footer.action',
        id: 'dsh-restart',
        order: 51,
      }, Trigger))
    }

    exports.apply = apply
    exports.inject = ['slots']
    return module.exports
  },
})
