import { useEffect } from "react";
import { Capacitor } from "@capacitor/core";
import { Browser } from "@capacitor/browser";

export default function App({ Component, pageProps }) {
  useEffect(() => {
    document.addEventListener("click", async function (event) {
      const link = event.target.closest("a");

      if (link) {
        const href = link.getAttribute("href");
        console.log("Clicked link:", href);

        if (href && href.startsWith("http")) {
          event.preventDefault();

          if (href.includes("triwatch.online")) {
            console.log("Navigating inside WebView:", href);
            window.location.href = href; // ✅ Keep internal links inside WebView
          } else {
            console.log("Opening in Capacitor Browser:", href);
            await Browser.open({ url: href }); // ✅ External links open in the Capacitor browser
          }
        }
      }
    });
  }, []);

  return <Component {...pageProps} />;
}
