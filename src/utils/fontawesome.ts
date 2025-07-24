// lib/fontawesome.ts

import { config } from "@fortawesome/fontawesome-svg-core";
import "@fortawesome/fontawesome-svg-core/styles.css"; // Prevents layout shift
config.autoAddCss = false; // Manually load CSS for Next.js
