import { useEffect, useState } from "react";

interface Heading {
  slug: string;
  text: string;
}

export function useToc(headings: Heading[]) {
  const [text, setText] = useState("");
  const [slug, setSlug] = useState("");

  useEffect(() => {
    const targets = document.querySelectorAll(
      "h1, h2[id], h3[id], h4[id], h5[id], h6[id]",
    );

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.find((entry) => entry.isIntersecting);
        if (!visible) return;

        if (visible.target.tagName === "H1") {
          setSlug("");
          setText("");
          return;
        }

        const id = visible.target.id;
        setSlug(id);
        const match = headings.find((h) => h.slug === id);
        if (!match) return;
        setText(match.text);
      },
      { rootMargin: "0px 0px -70% 0px" },
    );

    targets.forEach((el) => {
      observer.observe(el);
    });

    return () => {
      observer.disconnect();
    };
  }, [headings]);

  return { text, slug };
}
