export default function scrollToTop() {
    const isBrowser = () => typeof window !== "undefined";
    if (!isBrowser()) return;
    window.scrollTo({ top: 0, behavior: "smooth" });
  }