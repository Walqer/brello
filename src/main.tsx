import { createRoot } from "react-dom/client";

import { MantineProvider } from "@mantine/core";

import "@mantine/core/styles.css";
import "@mantine/dates/styles.css";
import "@mantine/dropzone/styles.css";
import "@mantine/notifications/styles.css";
import "@mantine/spotlight/styles.css";
import "@mantine/tiptap/styles.css";

import { Application } from "./application";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <MantineProvider>
    <Application />
  </MantineProvider>,
);
