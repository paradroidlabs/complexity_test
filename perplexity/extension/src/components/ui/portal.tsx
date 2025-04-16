import { Portal as ArkPortal } from "@ark-ui/react";
import React from "react";

type PortalProps = {
  children: React.ReactNode;
  container?: HTMLElement | null;
};

function Portal({ children, container }: PortalProps) {
  if (container !== undefined && !document.contains(container)) return null;

  return (
    <ArkPortal
      container={{
        current: container ?? $("#complexity-root")[0]!,
      }}
    >
      {children}
    </ArkPortal>
  );
}

export { Portal };
