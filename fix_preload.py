import re

with open("src/components/SafeImage.jsx", "r", encoding="utf-8") as f:
    content = f.read()

preload_effect = """  useEffect(() => {
    if (priority && currentSrc && typeof document !== "undefined") {
      const link = document.createElement("link");
      link.rel = "preload";
      link.as = "image";
      link.href = currentSrc;
      document.head.appendChild(link);
      return () => {
        // Optional: remove link on unmount, but usually preloads are kept.
        // document.head.removeChild(link);
      };
    }
  }, [priority, currentSrc]);"""

if "import React, { useState, useRef, forwardRef" in content:
    content = content.replace("import React, { useState, useRef, forwardRef } from \"react\";", "import React, { useState, useRef, forwardRef, useEffect } from \"react\";")

if "const handleError = () => {" in content:
    content = content.replace("const handleError = () => {", preload_effect + "\n\n  const handleError = () => {")

with open("src/components/SafeImage.jsx", "w", encoding="utf-8") as f:
    f.write(content)
print("Done")
