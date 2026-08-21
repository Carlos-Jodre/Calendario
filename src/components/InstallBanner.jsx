import { useState, useEffect } from "react";

export default function InstallBanner() {
  const [installPrompt, setInstallPrompt] = useState(null);
  const [showBanner, setShowBanner] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    if (window.matchMedia("(display-mode: standalone)").matches || window.navigator.standalone) {
      setIsInstalled(true);
      return;
    }

    const ios = /iphone|ipad|ipod/i.test(navigator.userAgent) && !window.MSStream;
    setIsIOS(ios);

    const handler = (e) => {
      e.preventDefault();
      setInstallPrompt(e);
      setShowBanner(true);
    };

    window.addEventListener("beforeinstallprompt", handler);

    if (ios && !window.navigator.standalone) {
      const dismissed = sessionStorage.getItem("ios-banner-dismissed");
      if (!dismissed) setTimeout(() => setShowBanner(true), 2000);
    }

    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const handleInstall = async () => {
    if (installPrompt) {
      installPrompt.prompt();
      const result = await installPrompt.userChoice;
      if (result.outcome === "accepted") setShowBanner(false);
      setInstallPrompt(null);
    }
  };

  const handleDismiss = () => {
    setShowBanner(false);
    sessionStorage.setItem("ios-banner-dismissed", "1");
  };

  if (isInstalled || !showBanner) return null;

  if (isIOS) {
    return (
      <div className="install-banner">
        <div className="install-banner-icon">📅</div>
        <div className="install-banner-text">
          <strong>Instala esta app</strong>
          <span>Pulsa <strong>⎋ Compartir</strong> y luego <strong>"Añadir a inicio"</strong></span>
        </div>
        <button className="install-banner-close" onClick={handleDismiss}>✕</button>
      </div>
    );
  }

  return (
    <div className="install-banner">
      <div className="install-banner-icon">📅</div>
      <div className="install-banner-text">
        <strong>Instala la app</strong>
        <span>Accede más rápido desde tu pantalla de inicio</span>
      </div>
      <button className="install-banner-btn" onClick={handleInstall}>Instalar</button>
      <button className="install-banner-close" onClick={handleDismiss}>✕</button>
    </div>
  );
}
