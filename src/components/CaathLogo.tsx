interface CaathLogoProps {
  showSubtitle?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export function CaathLogo({ showSubtitle = false, size = 'md' }: CaathLogoProps) {
  const heightClass = size === 'sm' ? 'h-7' : size === 'lg' ? 'h-12' : 'h-8';

  return (
    <div className="inline-flex flex-col select-none">
      <svg
        viewBox="0 0 218 46"
        className={`${heightClass} w-auto`}
        role="img"
        aria-label="CAATH"
      >
        {/* C */}
        <path
          d="M27.6 14.3C25.7 11.4 22.8 9.9 19.3 9.9C13.3 9.9 9.2 14.7 9.2 22.5C9.2 30.3 13.3 35.1 19.3 35.1C23.1 35.1 25.9 33.4 27.9 30.2L35.2 34.4C31.9 39.8 26.5 42.8 19.2 42.8C8.1 42.8 0.5 34.6 0.5 22.5C0.5 10.4 8.1 2.2 19.2 2.2C26.3 2.2 31.8 5.1 35 10.3L27.6 14.3Z"
          fill="#FFFFFF"
        />
        {/* First A (White) */}
        <path
          d="M52.8 3.2H62.3L77.9 41.8H68.6L65.4 33.5H49.7L46.5 41.8H37.2L52.8 3.2ZM62.7 26.2L57.5 12.6L52.4 26.2H62.7Z"
          fill="#FFFFFF"
        />
        {/* Second overlapping A (Elegant Cool Gray) */}
        <path
          d="M84.4 3.2H93.9L109.5 41.8H100.2L97 33.5H81.3L78.1 41.8H68.8L84.4 3.2ZM94.3 26.2L89.1 12.6L84 26.2H94.3Z"
          fill="#94A3B8"
        />
        {/* T */}
        <path
          d="M111.5 3.2H145.2V10.9H132.7V41.8H124V10.9H111.5V3.2Z"
          fill="#FFFFFF"
        />
        {/* H */}
        <path
          d="M152.2 3.2H160.9V18.4H178.4V3.2H187.1V41.8H178.4V26H160.9V41.8H152.2V3.2Z"
          fill="#FFFFFF"
        />
      </svg>
      {showSubtitle && (
        <span className="mt-1.5 text-[11px] leading-tight tracking-wide text-slate-300 font-normal">
          Centro Avanzado Atención Tratamiento de Heridas
        </span>
      )}
    </div>
  );
}
