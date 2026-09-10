"use client"

import { User, Settings, Scale, LogOut, ShieldCheck, ChevronLeft, Sparkles, Link2 } from "lucide-react"

export type ViewId = "recon" | "assistant" | "manual" | "profile" | "settings"

export function AppSidebar({
  active,
  onNavigate,
  username,
  onLogout,
  collapsed,
  onToggleCollapse,
}: {
  active: ViewId
  onNavigate: (view: ViewId) => void
  username: string
  onLogout: () => void
  collapsed: boolean
  onToggleCollapse: () => void
}) {
  const navItems: { id: ViewId; label: string; icon: typeof User }[] = [
    { id: "recon", label: "أدوات التسوية", icon: Scale },
    { id: "assistant", label: "مساعد المطابقة", icon: Sparkles },
    { id: "manual", label: "المطابقة اليدوية", icon: Link2 },
    { id: "profile", label: "الملف الشخصي", icon: User },
    { id: "settings", label: "الإعدادات", icon: Settings },
  ]

  return (
    <aside
      className={`flex h-screen w-60 shrink-0 flex-col border-l border-sidebar-border bg-sidebar text-sidebar-foreground ${
        collapsed ? "shadow-2xl" : ""
      }`}
    >
      <button
        type="button"
        onClick={onToggleCollapse}
        title="اضغط لإخفاء القائمة"
        className="flex items-center gap-2.5 border-b border-sidebar-border px-4 py-4 text-right transition-colors hover:bg-sidebar-accent"
      >
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-sidebar-primary text-sidebar-primary-foreground">
          <ShieldCheck className="h-5 w-5" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="truncate text-sm font-bold">نظام التسوية</div>
          <div className="truncate text-xs text-muted-foreground">لوحة التحكم</div>
        </div>
        <ChevronLeft className="h-4 w-4 shrink-0 text-muted-foreground" />
      </button>

      <nav className="flex-1 space-y-1 overflow-y-auto p-3">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = active === item.id
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                isActive
                  ? "bg-sidebar-primary text-sidebar-primary-foreground"
                  : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
              }`}
            >
              <Icon className="h-4 w-4 shrink-0" />
              <span>{item.label}</span>
            </button>
          )
        })}
      </nav>

      <div className="border-t border-sidebar-border p-3">
        <div className="mb-2 flex items-center gap-3 rounded-lg px-3 py-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-sidebar-accent text-sidebar-accent-foreground">
            <User className="h-4 w-4" />
          </div>
          <div className="min-w-0">
            <div className="truncate text-sm font-medium">{username}</div>
            <div className="text-xs text-muted-foreground">مستخدم مسجّل</div>
          </div>
        </div>
        <button
          onClick={onLogout}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-destructive transition-colors hover:bg-destructive/10"
        >
          <LogOut className="h-4 w-4 shrink-0" />
          <span>تسجيل الخروج</span>
        </button>
      </div>
    </aside>
  )
}
