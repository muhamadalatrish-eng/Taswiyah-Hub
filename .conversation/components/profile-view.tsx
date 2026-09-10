"use client"

import { useState } from "react"
import { User, Check } from "lucide-react"

export function ProfileView({
  username,
  onUsernameChange,
}: {
  username: string
  onUsernameChange: (name: string) => void
}) {
  const [displayName, setDisplayName] = useState(username)
  const [password, setPassword] = useState("")
  const [saved, setSaved] = useState(false)

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    const name = displayName.trim()
    if (!name) return

    const stored = (() => {
      try {
        const raw = localStorage.getItem("recon_credentials")
        return raw ? (JSON.parse(raw) as { username: string; password: string }) : null
      } catch {
        return null
      }
    })()
    const current = stored ?? { username: "admin", password: "admin123" }
    const next = { username: name, password: password || current.password }

    localStorage.setItem("recon_credentials", JSON.stringify(next))
    localStorage.setItem("recon_auth", JSON.stringify({ username: name, at: Date.now() }))
    onUsernameChange(name)
    setPassword("")
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div className="mx-auto max-w-2xl p-6">
      <header className="mb-6">
        <h1 className="text-2xl font-bold">الملف الشخصي</h1>
        <p className="mt-1 text-sm text-muted-foreground">إدارة معلومات حسابك وبيانات الدخول</p>
      </header>

      <div className="mb-6 flex items-center gap-4 rounded-2xl border border-border bg-card p-5">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary text-primary-foreground">
          <User className="h-8 w-8" />
        </div>
        <div>
          <div className="text-lg font-semibold">{username}</div>
          <div className="text-sm text-muted-foreground">مستخدم مسجّل في النظام</div>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-4 rounded-2xl border border-border bg-card p-5">
        <div className="space-y-1.5">
          <label htmlFor="displayName" className="text-xs font-medium text-muted-foreground">
            اسم المستخدم
          </label>
          <input
            id="displayName"
            type="text"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary"
          />
        </div>

        <div className="space-y-1.5">
          <label htmlFor="newPassword" className="text-xs font-medium text-muted-foreground">
            كلمة مرور جديدة (اتركها فارغة للإبقاء على الحالية)
          </label>
          <input
            id="newPassword"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary"
          />
        </div>

        <button
          type="submit"
          className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
        >
          {saved ? <Check className="h-4 w-4" /> : null}
          {saved ? "تم الحفظ" : "حفظ التغييرات"}
        </button>
      </form>
    </div>
  )
}
