export function LogoMark({ className = 'h-9 w-9' }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      {/* Background rounded square */}
      <rect width="48" height="48" rx="12" fill="#1F2179" />

      {/* Left person silhouette */}
      <circle cx="16" cy="15" r="4.5" fill="#C5F5CB" />
      <path d="M9 28.5C9 24.9 11.9 22 15.5 22h1c3.6 0 6.5 2.9 6.5 6.5V32H9v-3.5Z" fill="#C5F5CB" />

      {/* Right person silhouette */}
      <circle cx="32" cy="15" r="4.5" fill="#28A745" />
      <path
        d="M25 28.5C25 24.9 27.9 22 31.5 22h1c3.6 0 6.5 2.9 6.5 6.5V32H25v-3.5Z"
        fill="#28A745"
      />

      {/* Connection arc — intelligence link */}
      <path
        d="M18 33C18 33 21 37 24 37S30 33 30 33"
        stroke="#3291C9"
        strokeWidth="2.5"
        strokeLinecap="round"
      />

      {/* Spark — AI dot */}
      <circle cx="24" cy="40" r="1.8" fill="#3291C9" />
    </svg>
  );
}

export function LogoFull({
  className = '',
  size = 'default',
}: {
  className?: string;
  size?: 'sm' | 'default' | 'lg';
}) {
  const textSizes = {
    sm: 'text-base',
    default: 'text-lg',
    lg: 'text-2xl',
  };
  const markSizes = {
    sm: 'h-7 w-7',
    default: 'h-9 w-9',
    lg: 'h-12 w-12',
  };

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <LogoMark className={markSizes[size]} />
      <div className="flex flex-col leading-none">
        <span className={`${textSizes[size]} font-bold tracking-tight text-foreground`}>HRI</span>
        {size === 'lg' && (
          <span className="text-xs text-muted-foreground mt-0.5">Human Resources Intelligence</span>
        )}
      </div>
    </div>
  );
}
