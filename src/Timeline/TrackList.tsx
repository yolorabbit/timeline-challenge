import { useRef, useEffect } from "react";

type TrackListProps = {
  onScrollSync: (scrollTop: number) => void;
  syncScrollTop: number;
};

export const TrackList = ({ onScrollSync, syncScrollTop }: TrackListProps) => {
  const trackListRef = useRef<HTMLDivElement>(null);
  const isSyncing = useRef(false);

  const handleScroll = () => {
    if (isSyncing.current) {
      isSyncing.current = false;
      return;
    }
    if (trackListRef.current) {
      onScrollSync(trackListRef.current.scrollTop);
    }
  };

  useEffect(() => {
    if (
      trackListRef.current &&
      trackListRef.current.scrollTop !== syncScrollTop
    ) {
      isSyncing.current = true;
      trackListRef.current.scrollTop = syncScrollTop;
    }
  }, [syncScrollTop]);

  return (
    <div
      className="sticky left-0 top-0 z-20 bg-gray-800 grid grid-flow-row auto-rows-[40px] border-r border-solid border-r-gray-700 overflow-auto"
      data-testid="track-list"
      ref={trackListRef}
      onScroll={handleScroll}
    >
      {Array.from({ length: 20 }).map((_, index) => (
        <div key={index} className="p-2">
          <div>{`Track ${String.fromCharCode(65 + (index % 26))}`}</div>
        </div>
      ))}
    </div>
  );
};
