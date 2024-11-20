import { useRef, useEffect } from "react";
import { Segment } from "./Segment";

type KeyframeListProps = {
  onScrollSync: (scrollLeft: number, scrollTop: number) => void;
  syncScrollLeft: number;
  syncScrollTop: number;
  duration: number;
};

export const KeyframeList = ({
  onScrollSync,
  syncScrollLeft,
  syncScrollTop,
  duration,
}: KeyframeListProps) => {
  const keyframeListRef = useRef<HTMLDivElement>(null);

  const handleScroll = () => {
    if (!keyframeListRef.current) return;
    const { scrollLeft, scrollTop } = keyframeListRef.current;
    onScrollSync(scrollLeft, scrollTop);
  };

  useEffect(() => {
    if (keyframeListRef.current) {
      if (keyframeListRef.current.scrollLeft !== syncScrollLeft) {
        keyframeListRef.current.scrollLeft = syncScrollLeft;
      }

      if (keyframeListRef.current.scrollTop !== syncScrollTop) {
        keyframeListRef.current.scrollTop = syncScrollTop;
      }
    }
  }, [syncScrollLeft, syncScrollTop]);

  return (
    <div
      className="px-4 min-w-0 overflow-auto"
      data-testid="keyframe-list"
      ref={keyframeListRef}
      onScroll={handleScroll}
    >
      {Array.from({ length: 20 }).map((_, index) => (
        <Segment key={index} duration={duration} />
      ))}
    </div>
  );
};
