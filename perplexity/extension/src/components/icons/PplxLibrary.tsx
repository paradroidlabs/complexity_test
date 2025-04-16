import type { SVGProps } from "react";

export default function PplxLibrary({ ...props }: SVGProps<SVGSVGElement>) {
  return (
    <svg
      width="0.8em"
      height="0.8em"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 512 512"
      {...props}
    >
      <path
        fill="currentColor"
        d="M512 281.6H460.8V256C460.8 143 369 51.2 256 51.2S51.2 143 51.2 256v25.6H0V256C0 114.9 114.9 0 256 0S512 114.9 512 256v25.6zm-102.4 0H358.4V256c0-56.3-46.1-102.4-102.4-102.4s-102.4 46.1-102.4 102.4v25.6H102.4V256c0-84.8 68.8-153.6 153.6-153.6s153.6 68.8 153.6 153.6v25.6zm-51.2 51.2c-41.9 0-79 20.5-102.4 51.8c-23.4-31.4-60.5-51.8-102.4-51.8H0V384H153.6c42.2 0 76.8 34.6 76.8 76.8v25.6h51.2V460.8c0-42.2 34.6-76.8 76.8-76.8H512V332.8H358.4zM256 307.2a51.2 51.2 0 1 0 0-102.4 51.2 51.2 0 1 0 0 102.4z"
      />
    </svg>
  );
}
