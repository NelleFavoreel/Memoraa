import { useEffect } from "react";

function useAnimateOnVisible(selector, deps = []) {
  useEffect(() => {
    const elements = document.querySelectorAll(selector);
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const el = entry.target;
          if (entry.isIntersecting) {
            el.classList.add("animate");
            el.classList.remove("out-of-view");
          } else {
            el.classList.remove("animate");
            el.classList.add("out-of-view");
          }
        });
      },
      { threshold: 0.2 }
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, deps);
}

export default useAnimateOnVisible;
