"use client";

import Script from "next/script";
import { createElement } from "react";

export function SplineBackground() {
  return (
    <div className="spline-background" aria-hidden="true">
      <Script
        src="https://cdn.spline.design/@splinetool/hana-viewer@1.2.52/hana-viewer.js"
        strategy="afterInteractive"
        type="module"
      />
      {createElement("hana-viewer", {
        url: "https://prod.spline.design/LQg0ySrVXEthIPsj-HJz/scene.hanacode",
      })}
    </div>
  );
}
