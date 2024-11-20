import React, { useRef, useEffect, useCallback } from "react";

type RulerProps = {
  setCurrentTime: (time: number) => void;
  duration: number;
  onScrollSync: (scrollLeft: number) => void;
  syncScrollLeft: number;
};

export const Ruler = ({
  setCurrentTime,
  duration,
  onScrollSync,
  syncScrollLeft,
}: RulerProps) => {
  const rulerRef = useRef<HTMLDivElement>(null);
  const isSyncingHorizontal = useRef(false);

  const handleScroll = () => {
    if (!rulerRef.current) return;

    const { scrollLeft } = rulerRef.current;

    if (!isSyncingHorizontal.current) {
      onScrollSync(scrollLeft);
    }

    isSyncingHorizontal.current = false;
  };

  useEffect(() => {
    if (rulerRef.current && rulerRef.current.scrollLeft !== syncScrollLeft) {
      isSyncingHorizontal.current = true;
      rulerRef.current.scrollLeft = syncScrollLeft;
    }
  }, [syncScrollLeft]);

  const adjustToStep = (value: number, step: number) =>
    Math.round(value / step) * step;

  const updateCurrentTime = (clientX: number) => {
    const ruler = rulerRef.current;
    if (!ruler) return;

    const rect = ruler.getBoundingClientRect();
    const scrollOffset = ruler.scrollLeft;
    const position = clientX - rect.left + scrollOffset;
    const newTime = adjustToStep((position / rect.width) * duration, 10);

    setCurrentTime(Math.max(0, Math.min(duration, newTime)));
  };

  const handleMouseMove = useCallback(
    (event: MouseEvent) => {
      if (event.buttons !== 1) return;
      updateCurrentTime(event.clientX);
    },
    [duration]
  );

  const handleMouseUp = useCallback(() => {
    document.removeEventListener("mousemove", handleMouseMove);
    document.removeEventListener("mouseup", handleMouseUp);
  }, [handleMouseMove]);

  const handleMouseDown = (event: React.MouseEvent<HTMLDivElement>) => {
    updateCurrentTime(event.clientX);

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  useEffect(() => {
    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [handleMouseMove, handleMouseUp]);

  return (
    <div
      className="px-4 py-2 min-w-0 border-b border-solid border-gray-700 overflow-x-auto overflow-y-hidden"
      data-testid="ruler"
      ref={rulerRef}
      style={{ width: `${duration + 15}px` }}
      onMouseDown={handleMouseDown}
      onScroll={handleScroll}
    >
      <div
        className="w-[2000px] h-6 rounded-md bg-white/25"
        style={{ width: `${duration}px` }}
        data-testid="ruler-bar"
      ></div>
    </div>
  );
};
