import { createHashRouter } from "react-router-dom";

import { canvasPrePromptInstallationDialogRouterRoute } from "@/plugins/canvas/components/PrePromptInstallationDialog";

export const createRouter = () =>
  createHashRouter([
    {
      path: "/",
      element: null,
      children: [canvasPrePromptInstallationDialogRouterRoute],
      errorElement: null,
    },
    {
      path: "*",
      element: null,
      errorElement: null,
    },
  ]);
