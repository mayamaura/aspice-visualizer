import { useToasts } from '../../store/toastStore'

export function Toast() {
  const toasts = useToasts()
  if (toasts.length === 0) return null
  return (
    <div
      className="fixed bottom-4 right-4 z-[200] flex flex-col gap-2"
      role="region"
      aria-live="polite"
      aria-label="Notifications"
    >
      {toasts.map((t) => (
        <div
          key={t.id}
          className="px-4 py-2 rounded-lg bg-surface border border-line text-content text-xs shadow-2xl animate-fade-in"
        >
          {t.message}
        </div>
      ))}
    </div>
  )
}
