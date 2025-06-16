/*
 * Copyright (c) 2025 Paul Le Gall. All Rights Reserved.
 * Licensed See LICENSE file in the project root for details.
 */

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./tailwind.css";
import RoutesModule from "./routes/RoutesModule.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RoutesModule />
  </StrictMode>
);
