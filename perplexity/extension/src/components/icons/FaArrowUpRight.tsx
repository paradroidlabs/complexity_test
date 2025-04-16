import type { SVGProps } from "react";

export default function FaArrowUpRight({ ...props }: SVGProps<SVGSVGElement>) {
  return (
    <svg
      width="0.8em"
      height="0.8em"
      aria-hidden="true"
      focusable="false"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 384 512"
      {...props}
    >
      <path
        fill="currentColor"
        d="M328 96c13.3 0 24 10.7 24 24l0 240c0 13.3-10.7 24-24 24s-24-10.7-24-24l0-182.1L73 409c-9.4 9.4-24.6 9.4-33.9 0s-9.4-24.6 0-33.9l231-231L88 144c-13.3 0-24-10.7-24-24s10.7-24 24-24l240 0z"
      />
    </svg>
  );
}
