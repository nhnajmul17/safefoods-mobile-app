import { useLocalSearchParams, useRouter } from "expo-router";
import { View, StyleSheet } from "react-native";
import { WebView } from "react-native-webview";

export default function WebViewScreen() {
  const { url } = useLocalSearchParams();
  const router = useRouter();

  // Ensure url is always a string
  const webUrl = Array.isArray(url) ? url[0] : url;

  // CSS to inject that hides elements immediately before they render
  const injectedCSS = `
    header, nav, .header, .navbar, .nav, .navigation, .top-bar, .menu-bar,
    footer, .footer, .bottom-bar,
    .hamburger, .menu-toggle, .mobile-menu, .burger-menu,
    .breadcrumb, .breadcrumbs, .woocommerce-breadcrumb, .rank-math-breadcrumb,
    .whatsapp-button, .whatsapp-float, .whatsapp-widget, .wa-chat-box, .wa-button,
    [class*="hamburger"], [class*="menu-btn"], [class*="breadcrumb"],
    [class*="whatsapp"], [class*="wa-"], [id*="whatsapp"], [id*="wa-chat"],
    a[href*="wa.me"], a[href*="whatsapp.com"],
    button[aria-label*="WhatsApp"], button[aria-label*="whatsapp"],
    button[title*="WhatsApp"], button[title*="whatsapp"],
    .wa-messenger-svg-whatsapp, svg.wa-messenger-svg-whatsapp {
      display: none !important;
      visibility: hidden !important;
      opacity: 0 !important;
      height: 0 !important;
      width: 0 !important;
      overflow: hidden !important;
      pointer-events: none !important;
    }
    button:has(.wa-messenger-svg-whatsapp),
    button:has(svg[class*="wa-"]),
    button.bg-green-500.rounded-full,
    button.bg-green-600.rounded-full {
      display: none !important;
      visibility: hidden !important;
      opacity: 0 !important;
    }
    body {
      padding-top: 0 !important;
      margin-top: 0 !important;
    }
    main, .main, .content, .page-content, article, [role="main"] {
      margin-top: 0 !important;
      padding-top: 20px !important;
    }
  `;

  // JavaScript to hide navbar, footer, and other navigation elements
  const injectedJavaScript = `
    (function() {
      // Inject CSS immediately
      const style = document.createElement('style');
      style.textContent = \`${injectedCSS}\`;
      if (document.head) {
        document.head.appendChild(style);
      } else {
        document.addEventListener('DOMContentLoaded', function() {
          document.head.appendChild(style);
        });
      }
      
      // Function to aggressively hide elements
      function hideElements() {
        // Hide common header/navbar elements
        const headers = document.querySelectorAll('header, nav, .header, .navbar, .nav, .navigation, .top-bar, .menu-bar');
        headers.forEach(el => {
          el.style.display = 'none';
          el.style.visibility = 'hidden';
          el.style.opacity = '0';
          el.style.height = '0';
          el.style.overflow = 'hidden';
        });
        
        // Hide footer elements
        const footers = document.querySelectorAll('footer, .footer, .bottom-bar');
        footers.forEach(el => {
          el.style.display = 'none';
          el.style.visibility = 'hidden';
          el.style.opacity = '0';
          el.style.height = '0';
        });
        
        // Hide hamburger/mobile menu buttons
        const menuButtons = document.querySelectorAll('.hamburger, .menu-toggle, .mobile-menu, .burger-menu, [class*="hamburger"], [class*="menu-btn"]');
        menuButtons.forEach(el => {
          el.style.display = 'none';
          el.style.visibility = 'hidden';
        });
        
        // Hide breadcrumbs - more specific selectors
        const breadcrumbs = document.querySelectorAll('.breadcrumb, .breadcrumbs, .woocommerce-breadcrumb, .rank-math-breadcrumb, [class*="breadcrumb"], nav[aria-label="breadcrumb"], nav[aria-label="Breadcrumb"]');
        breadcrumbs.forEach(el => {
          el.style.display = 'none';
          el.style.visibility = 'hidden';
          el.style.opacity = '0';
          el.style.height = '0';
        });
        
        // Hide WhatsApp popover/chat widgets
        const whatsappElements = document.querySelectorAll('.whatsapp-button, .whatsapp-float, .whatsapp-widget, .wa-chat-box, .wa-button, [class*="whatsapp"], [class*="wa-"], [id*="whatsapp"], [id*="wa-chat"], a[href*="wa.me"], a[href*="whatsapp.com"], button[aria-label*="WhatsApp"], button[aria-label*="whatsapp"], button[title*="WhatsApp"], button[title*="whatsapp"], .wa-messenger-svg-whatsapp');
        whatsappElements.forEach(el => {
          el.style.display = 'none';
          el.style.visibility = 'hidden';
          el.style.opacity = '0';
          el.style.pointerEvents = 'none';
          el.style.width = '0';
          el.style.height = '0';
        });
        
        // Hide buttons containing WhatsApp SVG
        const allButtons = document.querySelectorAll('button');
        allButtons.forEach(button => {
          const hasWhatsAppSvg = button.querySelector('.wa-messenger-svg-whatsapp, svg[class*="wa-"], [class*="whatsapp"]');
          const hasWhatsAppAria = button.getAttribute('aria-label')?.toLowerCase().includes('whatsapp') || 
                                  button.getAttribute('title')?.toLowerCase().includes('whatsapp');
          if (hasWhatsAppSvg || hasWhatsAppAria) {
            button.style.display = 'none';
            button.style.visibility = 'hidden';
            button.style.opacity = '0';
            button.style.pointerEvents = 'none';
          }
        });
        
        // Remove fixed positioning that might block content
        document.body.style.paddingTop = '0';
        document.body.style.marginTop = '0';
        
        // Try to find and isolate main content
        const mainContent = document.querySelector('main, .main, .content, .page-content, article, [role="main"]');
        if (mainContent) {
          mainContent.style.marginTop = '0';
          mainContent.style.paddingTop = '20px';
        }
      }
      
      // Run immediately
      hideElements();
      
      // Use MutationObserver to catch dynamically added elements
      const observer = new MutationObserver(function(mutations) {
        hideElements();
      });
      
      // Start observing
      if (document.body) {
        observer.observe(document.body, {
          childList: true,
          subtree: true
        });
      }
      
      // Run after delays to catch late-loading elements
      setTimeout(hideElements, 100);
      setTimeout(hideElements, 300);
      setTimeout(hideElements, 500);
      setTimeout(hideElements, 1000);
      
      // Run when DOM is fully loaded
      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', hideElements);
      }
      
      // Run when window loads
      window.addEventListener('load', hideElements);
    })();
    true;
  `;

  return (
    <View style={styles.container}>
      <WebView
        source={{ uri: webUrl as string }}
        style={styles.webView}
        onError={() => router.back()} // Handle load errors by going back
        injectedJavaScript={injectedJavaScript}
        injectedJavaScriptBeforeContentLoaded={injectedJavaScript}
        onMessage={() => {}} // Required for injectedJavaScript to work
        javaScriptEnabled={true}
        startInLoadingState={true}
        renderLoading={() => <View style={styles.loadingContainer} />}
        onLoadStart={() => {}}
        onLoadEnd={() => {}}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  webView: {
    flex: 1,
    backgroundColor: "#fff",
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: "#fff",
  },
});
