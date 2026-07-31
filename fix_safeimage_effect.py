import re

with open("src/components/SafeImage.jsx", "r", encoding="utf-8") as f:
    content = f.read()

effect = """  useEffect(() => {
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

content = content.replace(effect, "")

anchor = """  // Add auto-formatting for WebP/AVIF if not already present on unsplash URLs
  if (currentSrc && currentSrc.includes('images.unsplash.com') && !currentSrc.includes('auto=format')) {
      if (currentSrc.includes('?')) {
          currentSrc += '&auto=format';
      } else {
          currentSrc += '?auto=format';
      }
  }"""

content = content.replace(anchor, anchor + "\n\n" + effect)

with open("src/components/SafeImage.jsx", "w", encoding="utf-8") as f:
    f.write(content)
print("Done")
