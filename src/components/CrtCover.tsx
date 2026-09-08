interface CrtCoverProps {
  src: string;
  alt: string;
  slug: string;
  loading?: 'eager' | 'lazy';
  className?: string;
}

/** 终端 framebuffer 式封面：chrome 条 + 扫描线/暗角视口 */
export default function CrtCover({
  src,
  alt,
  slug,
  loading = 'lazy',
  className = '',
}: CrtCoverProps) {
  return (
    <figure className={['crt-cover', className].filter(Boolean).join(' ')}>
      <div className="crt-cover-bar" aria-hidden="true">
        <span className="min-w-0 truncate">IMG://{slug}</span>
        <span className="shrink-0 opacity-70">FB</span>
      </div>
      <div className="crt-cover-viewport">
        <img
          src={src}
          alt={alt}
          width={136}
          height={88}
          className="crt-cover-img"
          loading={loading}
          decoding="async"
        />
      </div>
    </figure>
  );
}
