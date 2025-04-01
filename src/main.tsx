import { createRoot } from "react-dom/client";

import { MantineProvider } from "@mantine/core";

import { Application } from "./application";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <MantineProvider>
    <Application />
  </MantineProvider>,
);
