import React from "react";
import { createRoot } from "react-dom/client";
import "../tokens.css";
import "./showcase.css";
import { NavigationGuideline } from "./NavigationGuideline";

const root = document.getElementById("root");
if (!root) throw new Error("Navigation guideline mount point #root is missing");
createRoot(root).render(<NavigationGuideline />);
