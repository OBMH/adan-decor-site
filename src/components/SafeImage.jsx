import React, { useState, useRef, forwardRef, useEffect } from "react";

// 100% resilient luxury fallback images from highly stable Unsplash CDN (pre-optimized with resolution/format params for ultra-fast loading!)
const FALLBACKS = {
  logo: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=400&auto=format&fit=crop",
  hero: "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?q=85&w=1600&auto=format&fit=crop",
  about: "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?q=80&w=800&auto=format&fit=crop",
  philosophy: "https://images.unsplash.com/photo-1613977257363-707ba9348227?q=80&w=1000&auto=format&fit=crop",
  portfolio: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?q=80&w=800&auto=format&fit=crop",
  general: "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?q=80&w=800&auto=format&fit=crop",
};

// List of critical images to preload instantly on application launch
export const CRITICAL_IMAGES = [
  FALLBACKS.logo,
  FALLBACKS.hero,
  FALLBACKS.about,
  FALLBACKS.philosophy,
];

// Helper to programmatically pre-warm browser cache for critical assets
export function preloadCriticalImages(customImages = []) {
  if (typeof window === "undefined") return;
  const allToPreload = [...CRITICAL_IMAGES, ...customImages];
  allToPreload.forEach((src) => {
    if (!src) return;
    const img = new Image();
    img.src = src;
  });
}

// Pure vector SVG Luxury Monogram Logo (100% immune to asset deletions, loads instantly, looks magnificent)
export function LuxuryLogoSvg({ className }) {
  return (
    <svg
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      data-testid="luxury-logo-svg"
    >
      <circle cx="50" cy="50" r="45" stroke="#D4AF37" strokeWidth="1.5" />
      <circle cx="50" cy="50" r="42" stroke="#D4AF37" strokeWidth="0.5" strokeDasharray="3 3" />
      
      <path
        d="M50 22 L28 72 H37 L43 56 H57 L63 56 H63 L63 72 H72 L50 22 Z"
        fill="url(#goldGradient)"
      />
      <path
        d="M50 30 L40 50 H60 L50 30 Z"
        fill="#000"
      />
      <path
        d="M50 36 L54 44 L50 52 L46 44 Z"
        fill="#D4AF37"
      />
      <rect x="32" y="76" width="36" height="1.5" fill="#D4AF37" />
      
      <defs>
        <linearGradient id="goldGradient" x1="28" y1="22" x2="72" y2="72" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#D4AF37" />
          <stop offset="50%" stopColor="#F3E5AB" />
          <stop offset="100%" stopColor="#AA7C11" />
        </linearGradient>
      </defs>
    </svg>
  );
}

const SafeImage = forwardRef(({ src, alt, className, fallbackType = "general", loading = "lazy", fetchPriority = "auto", priority, ...props }, ref) => {
  const [errorCount, setErrorCount] = useState(0);
  const localRef = useRef(null);

  const finalLoading = priority ? "eager" : loading;
  const finalFetchPriority = priority ? "high" : fetchPriority;


  const generateSrcSet = (url, format) => {
    if (!url || !url.includes('images.unsplash.com')) return undefined;
    try {
      const urlObj = new URL(url);
      urlObj.searchParams.delete('w');
      urlObj.searchParams.delete('q');
      urlObj.searchParams.delete('fm');
      urlObj.searchParams.delete('auto');
      
      const widths = [400, 800, 1200, 1600];
      return widths.map(w => {
        const u = new URL(urlObj.toString());
        u.searchParams.set('w', w);
        u.searchParams.set('q', 80);
        u.searchParams.set('fm', format);
        u.searchParams.set('fit', 'crop');
        return `${u.toString()} ${w}w`;
      }).join(', ');
    } catch (e) {
      return undefined;
    }
  };
  
  const generateSizes = (url) => {
    if (!url || !url.includes('images.unsplash.com')) return undefined;
    return "(max-width: 600px) 400px, (max-width: 1024px) 800px, (max-width: 1440px) 1200px, 1600px";
  };


  // Combine forwarded ref and local ref for cache detection
  const setRefs = (node) => {
    localRef.current = node;
    if (typeof ref === "function") {
      ref(node);
    } else if (ref) {
      ref.current = node;
    }
  };

  

  const handleError = () => {
    setErrorCount((prev) => prev + 1);
  };

  // Determine current image source
  let currentSrc = src;
  if (!src || errorCount > 0) {
    currentSrc = FALLBACKS[fallbackType] || FALLBACKS.general;
  }

  // If this is a logo and we've hit an error or have no source, render the vector logo
  if (fallbackType === "logo" && (!src || errorCount >= 1)) {
    return <LuxuryLogoSvg className={className} />;
  }

  // Add auto-formatting for WebP/AVIF if not already present on unsplash URLs
  if (currentSrc && currentSrc.includes('images.unsplash.com') && !currentSrc.includes('auto=format')) {
      if (currentSrc.includes('?')) {
          currentSrc += '&auto=format';
      } else {
          currentSrc += '?auto=format';
      }
  }

  useEffect(() => {
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
  }, [priority, currentSrc]);

  return (
    <div className="relative w-full h-full overflow-hidden bg-transparent flex items-center justify-center">
              <picture className="w-full h-full flex items-center justify-center">
      {currentSrc && currentSrc.includes('images.unsplash.com') && (
        <source srcSet={generateSrcSet(currentSrc, 'avif')} sizes={generateSizes(currentSrc)} type="image/avif" />
      )}
      {currentSrc && currentSrc.includes('images.unsplash.com') && (
        <source srcSet={generateSrcSet(currentSrc, 'webp')} sizes={generateSizes(currentSrc)} type="image/webp" />
      )}
      <img
        ref={setRefs}
        src={currentSrc}
        srcSet={currentSrc && currentSrc.includes('images.unsplash.com') ? generateSrcSet(currentSrc, 'jpg') : undefined}
        sizes={currentSrc && currentSrc.includes('images.unsplash.com') ? generateSizes(currentSrc) : undefined}
        alt={alt || "Adan Decor luxury design element"}
        loading={finalLoading}
        fetchPriority={finalFetchPriority}
        width={props.width || "1920"}
        height={props.height || "1080"}
        className={`${className} transition-transform duration-700`}
        onError={handleError}
        {...props}
      />
    </picture>
    </div>
  );
});

SafeImage.displayName = "SafeImage";

export default SafeImage;
