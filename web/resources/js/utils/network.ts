export const getWanAddress = async (): Promise<string | null> => {
  const urls = ['https://4.ident.me', 'https://4.tnedi.me'];
  const fetchIpFromUrlWithTimeout = async (url: string, timeoutMs = 3000): Promise<string | null> => {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), timeoutMs);
    try {
      const response = await fetch(url, { signal: controller.signal });
      clearTimeout(timeout);
      const data = await response.text();
      const text = data.trim();
      if (/^\d{1,3}(\.\d{1,3}){3}$/.test(text)) {
        return text;
      } else {
        return null;
      }
    } catch (e) {
      console.warn('Error fetching IP from URL:', e);
      clearTimeout(timeout);
      return null;
    }
  };

  for (const url of urls) {
    const ip = await fetchIpFromUrlWithTimeout(url, 5000);
    if (ip) {
      return ip;
    }
  }
  return null;
};
