import React from "react";
import { createRoot } from "react-dom/client";
import "../tokens.css";
import "./showcase.css";
import { Showcase } from "./Showcase";

const root = document.getElementById("root");
if (!root) throw new Error("Showcase mount point #root is missing");
createRoot(root).render(<Showcase />);
