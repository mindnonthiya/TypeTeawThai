export default function ProgressBar({
  step,
  total,
}: {
  step: number
  total: number
}) {
  if (!total || total <= 0) return null

  const percent = Math.min(((step + 1) / total) * 100, 100)

  return (
    <div className="w-full">
      <div
        style={{
          width: "100%",
          height: "8px",
          background: "var(--border)",
          borderRadius: "999px",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            width: `${percent}%`,
            height: "100%",
            background: "var(--primary)",
            transition: "width 0.3s ease",
          }}
        />
      </div>

      
    </div>
  )
}
