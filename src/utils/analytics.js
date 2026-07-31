export const trackAnalyticsEvent = async (eventName, payload = {}) => {
  try {
    // In a real app this would call an API
    // Here we'll simulate by updating localStorage counters
    const statsStr = localStorage.getItem("adan_analytics_stats");
    let stats = statsStr ? JSON.parse(statsStr) : {
      totalVisits: 0,
      consultationClicks: 0,
      whatsappRedirections: 0,
    };

    if (eventName === 'page_visit') {
      stats.totalVisits += 1;
    } else if (eventName === 'consultation_click') {
      stats.consultationClicks += 1;
    } else if (eventName === 'whatsapp_click') {
      stats.whatsappRedirections += 1;
    }

    localStorage.setItem("adan_analytics_stats", JSON.stringify(stats));

    // Keep a log of events for the dashboard
    const logStr = localStorage.getItem("adan_analytics_logs");
    let logs = logStr ? JSON.parse(logStr) : [];
    logs.unshift({
      id: `${Date.now()}_${Math.random().toString(36).substring(2, 8)}`,
      event: eventName,
      payload,
      timestamp: new Date().toISOString()
    });
    // Keep last 100 logs
    if (logs.length > 100) logs = logs.slice(0, 100);
    localStorage.setItem("adan_analytics_logs", JSON.stringify(logs));

    return true;
  } catch (error) {
    console.error("Analytics error", error);
    return false;
  }
};

export const getAnalyticsStats = () => {
  const statsStr = localStorage.getItem("adan_analytics_stats");
  return statsStr ? JSON.parse(statsStr) : {
    totalVisits: 0,
    consultationClicks: 0,
    whatsappRedirections: 0,
  };
};

export const getAnalyticsLogs = () => {
  const logStr = localStorage.getItem("adan_analytics_logs");
  if (!logStr) return [];
  try {
    const logs = JSON.parse(logStr);
    const seen = new Set();
    return logs.map((log, idx) => {
      let id = log.id;
      if (!id || seen.has(String(id))) {
        id = `${log.timestamp || Date.now()}_${idx}_${Math.random().toString(36).substring(2, 6)}`;
      }
      seen.add(String(id));
      return { ...log, id };
    });
  } catch (e) {
    return [];
  }
};
