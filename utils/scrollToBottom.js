export default function scrollToBottom() {
    const isBrowser = () => typeof window !== "undefined";
    if (!isBrowser()) return;
    window.scrollTo(0, document.body.scrollHeight);
  }