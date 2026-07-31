import React, { createContext, useContext } from "react";
import { useSiteData } from "./SiteContext";

const PageConfigContext = createContext();

export function PageConfigProvider({ children }) {
  const site = useSiteData();

  const config = {
    homePage: {
      banner: {
        title: site.pageConfig?.homePage?.hero?.headlinePart1 || "نصمم الفخامة...",
        subtitle: site.pageConfig?.homePage?.hero?.subtitle || "وننفذها بإتقان",
        bgImage: site.pageConfig?.homePage?.hero?.bgImage || "",
      },
    },
    servicesPage: {
      banner: { title: site.pageConfig?.servicesPage?.title || "خدماتنا المتميزة", bgImage: "" },
      items: (site.pageConfig?.servicesPage?.sectors || []).map((s) => ({
        id: s.id,
        title: s.title,
        image: s.image,
      })),
    },
  };

  const updateConfig = (newConfig) => {
    if (newConfig.servicesPage?.items) {
      site.updatePageConfig("servicesPage", "sectors", newConfig.servicesPage.items);
    }
    if (newConfig.homePage?.banner) {
      site.updatePageConfig("homePage", "hero", {
        headlinePart1: newConfig.homePage.banner.title,
        subtitle: newConfig.homePage.banner.subtitle,
        bgImage: newConfig.homePage.banner.bgImage,
      });
    }
  };

  return (
    <PageConfigContext.Provider value={{ config, updateConfig }}>
      {children}
    </PageConfigContext.Provider>
  );
}

export function usePageConfig() {
  return useContext(PageConfigContext);
}

