import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "com.triwatch.app",
  appName: "triwatch",
  webDir: "out",
  server: {
    url: "https://triwatch.online",
    cleartext: true,
    allowNavigation: ["triwatch.online", "*.triwatch.online"], // ✅ Ensures navigation stays inside WebView
  },
  android: {
    webContentsDebuggingEnabled: true,
  },
};

export default config;
