export function AppBackground({ variant = "dashboard" }: { variant?: "landing" | "dashboard" }) {
  if (variant === "landing") {
    return (
      <>
        <div
          className="pointer-events-none fixed inset-0 star-bg opacity-0 dark:opacity-70"
          aria-hidden
        />
        <div
          className="pointer-events-none fixed inset-0 grid-bg opacity-[0.08] dark:opacity-15"
          aria-hidden
        />
        <div
          className="pointer-events-none fixed left-[-20%] top-[-10%] h-[700px] w-[700px] rounded-full bg-cyan-500/[0.04] blur-[180px] dark:bg-cyan-500/[0.06]"
          aria-hidden
        />
        <div
          className="pointer-events-none fixed right-[-10%] top-[10%] h-[500px] w-[500px] rounded-full bg-blue-600/[0.03] blur-[160px] dark:bg-blue-600/[0.05]"
          aria-hidden
        />
        <div
          className="pointer-events-none fixed bottom-[-10%] left-[30%] h-[400px] w-[400px] rounded-full bg-cyan-400/[0.03] blur-[140px] dark:bg-cyan-400/[0.04]"
          aria-hidden
        />
      </>
    );
  }

  return (
    <div
      className="pointer-events-none fixed inset-0 star-bg opacity-0 dark:opacity-60"
      aria-hidden
    />
  );
}
