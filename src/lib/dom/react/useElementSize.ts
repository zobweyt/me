import { useEffect, useState } from "react";

interface UseElementSizeProps {
  ref: React.RefObject<Element | null>;
  dimension?: "height" | "width" | "both";
}

interface UseElementSizeReturn {
  width: number | "auto";
  height: number | "auto";
}

export const useElementSize = ({
  ref,
  dimension = "height",
}: UseElementSizeProps): UseElementSizeReturn => {
  const [height, setHeight] = useState<number | "auto">("auto");
  const [width, setWidth] = useState<number | "auto">("auto");

  useEffect(() => {
    if (ref.current) {
      const resizeObserver = new ResizeObserver((entries) => {
        const observedHeight = entries[0].contentRect.height;
        const observedWidth = entries[0].contentRect.width;
        setHeight(observedHeight);
        setWidth(observedWidth);
      });

      resizeObserver.observe(ref.current);

      return () => {
        resizeObserver.disconnect();
      };
    }
  }, [ref]);

  const heightValue = dimension === "height" ? height : "auto";
  const widthValue = dimension === "width" ? width : "auto";

  return {
    height: heightValue,
    width: widthValue,
  };
};

export declare namespace useElementSize {
  type Props = UseElementSizeProps;
  type Return = UseElementSizeReturn;
}
