import { useEffect, useRef, useState } from "react";

export function useUpdateAvailable(handler: () => void) {
  useEffect(() => {
    if (
      typeof window === "undefined" ||
      "serviceWorker" in navigator ||
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      //@ts-ignore
      window.workbox === undefined
    )
      return;
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //@ts-ignore
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
    window.workbox.addEventListener("waiting", handler);
  });
}

export function useInstallPromptState() {
  const [installPromptVisible, setInstallPromptVisible] = useState(false);
  const deferredPromptRef = useRef<BeforeInstallPromptEvent | null>(null);
  useEffect(() => {
    window.addEventListener("beforeinstallprompt", (evt) => {
      // Prevent the mini-infobar from appearing on mobile
      evt.preventDefault();
      // Stash the event so it can be triggered later.
      deferredPromptRef.current = evt;
      setInstallPromptVisible(true);
    });
  });

  async function install() {
    if (!deferredPromptRef.current) {
      return;
    }

    // Show the install prompt
    await deferredPromptRef.current.prompt();

    // Wait for the user to respond to the prompt
    await deferredPromptRef.current.userChoice;
    deferredPromptRef.current = null;
    setInstallPromptVisible(false);
  }

  return { installPromptVisible, setInstallPromptVisible, install };
}
