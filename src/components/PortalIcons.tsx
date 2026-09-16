import type { SVGProps } from 'react';

type IconProps = SVGProps<SVGSVGElement>;

/** 统一 24 视口，由 CSS 缩放到同尺寸，保证光学对齐 */
const base = {
  width: 16,
  height: 16,
  viewBox: '0 0 24 24',
  fill: 'none',
  'aria-hidden': true as const,
  focusable: false as const,
};

/** GitHub Mark（官方路径，currentColor） */
export function IconGithub(props: IconProps) {
  return (
    <svg {...base} {...props} fill="currentColor">
      <path d="M12 0C5.37 0 0 5.42 0 12.12c0 5.36 3.44 9.9 8.21 11.5.6.11.82-.26.82-.58 0-.29-.01-1.04-.02-2.05-3.34.73-4.04-1.64-4.04-1.64-.55-1.4-1.34-1.78-1.34-1.78-1.09-.76.08-.74.08-.74 1.21.09 1.85 1.26 1.85 1.26 1.07 1.86 2.81 1.32 3.5 1.01.11-.79.42-1.32.76-1.62-2.67-.31-5.47-1.36-5.47-6.05 0-1.34.47-2.43 1.24-3.29-.12-.31-.54-1.58.12-3.29 0 0 1.01-.33 3.3 1.26a11.3 11.3 0 0 1 3-.41c1.02 0 2.05.14 3 .41 2.29-1.59 3.3-1.26 3.3-1.26.66 1.71.24 2.98.12 3.29.77.86 1.24 1.95 1.24 3.29 0 4.7-2.81 5.74-5.49 6.04.43.38.81 1.12.81 2.26 0 1.63-.02 2.95-.02 3.35 0 .32.21.7.82.58A12.13 12.13 0 0 0 24 12.12C24 5.42 18.63 0 12 0z" />
    </svg>
  );
}

export function IconMail(props: IconProps) {
  return (
    <svg
      {...base}
      {...props}
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m3 7 9 6 9-6" />
    </svg>
  );
}

export function IconLink(props: IconProps) {
  return (
    <svg
      {...base}
      {...props}
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
      <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
    </svg>
  );
}
