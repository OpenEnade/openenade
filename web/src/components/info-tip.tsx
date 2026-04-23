export function InfoTip({ text }: { text: string }) {
  return (
    <span className="relative group ml-0.5 inline-flex">
      <span className="text-text-muted hover:text-primary cursor-help text-[8px] align-super">
        i
      </span>
      <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 px-2 py-1.5 rounded-[var(--ds-radius-md)] bg-surface border border-border text-[10px] text-text-muted leading-snug w-48 opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-opacity duration-[var(--ds-transition-fast)] z-20 ds-mono">
        {text}
      </span>
    </span>
  );
}
