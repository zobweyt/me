import { useEffect, useState } from "react";

interface Heading {
  slug: string;
  text: string;
}

export function useToc(headings: Heading[]) {
  const [open, setOpen] = useState(false);
  const [text, setCurrentText] = useState("");
  const [slug, setActiveSlug] = useState("");
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const checkScroll = () => {
      if (window.innerWidth >= 1536 && open) {
        setOpen(false);
        document.body.style.overflow = "";
        return;
      }

      if (open) {
        document.body.style.overflow = "hidden";
      } else {
        document.body.style.overflow = "";
      }
    };

    checkScroll();
    window.addEventListener("resize", checkScroll);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("resize", checkScroll);
    };
  }, [open]);

  useEffect(() => {
    let frameId: number;
    const handleScroll = () => {
      cancelAnimationFrame(frameId);
      frameId = requestAnimationFrame(() => {
        const total =
          document.documentElement.scrollHeight - window.innerHeight;
        if (total > 0)
          setProgress(Math.min(Math.max(window.scrollY / total, 0), 1));
      });
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => {
      window.removeEventListener("scroll", handleScroll);
      cancelAnimationFrame(frameId);
    };
  }, []);

  useEffect(() => {
    const targets = document.querySelectorAll(
      "h1, h2[id], h3[id], h4[id], h5[id], h6[id]",
    );
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.find((e) => e.isIntersecting);
        if (!visible) return;

        if (visible.target.tagName === "H1") {
          setActiveSlug("");
          setCurrentText("");
        } else {
          const id = visible.target.id;
          setActiveSlug(id);
          const match = headings.find((h) => h.slug === id);
          if (match) setCurrentText(match.text);
        }
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

  return { open, setOpen, text, slug, progress };
}
