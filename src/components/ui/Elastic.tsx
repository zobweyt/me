import { useRef } from "react";
import { useElementSize } from "@/lib/dom/react/useElementSize";
import { useMounted } from "@/lib/dom/react/useMounted";

export interface ElasticProps
  extends React.ComponentProps<"div">,
    Pick<useElementSize.Props, "dimension"> {
  duration?: number;
  overflow?: boolean;
}

export const Elastic = ({
  children,
  overflow = false,
  duration = 400,
  className,
  dimension = "height",
  ...props
}: ElasticProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const { width, height } = useElementSize({ ref, dimension });
  const transitionProperty = dimension === "both" ? "height, width" : dimension;
  const mounted = useMounted();

  return (
    <div
      style={{
        height,
        width,
        overflow: overflow ? "visible" : "hidden",
        transitionDuration: mounted ? `${duration}ms` : "0ms",
        transitionTimingFunction: "cubic-bezier(0.19, 1, 0.22, 1)",
        transitionProperty,
      }}
      className={[className, "motion-reduce:duration-0!"]
        .filter(Boolean)
        .join(" ")}
      {...props}
    >
      <div ref={ref}>{children}</div>
    </div>
  );
};

export declare namespace Elastic {
  type Props = ElasticProps;
}
