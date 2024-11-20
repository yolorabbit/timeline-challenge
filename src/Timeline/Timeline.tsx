import { useState } from "react";
import { PlayControls } from "./PlayControls";
import { Ruler } from "./Ruler";
import { TrackList } from "./TrackList";
import { KeyframeList } from "./KeyframeList";
import { Playhead } from "./Playhead";

export const Timeline = () => {
  const [syncScrollTop, setSyncScrollTop] = useState(0);
  const [syncScrollLeft, setSyncScrollLeft] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(2000);

  const handleScroll = (scrollLeft: number, scrollTop: number) => {
    setSyncScrollLeft(scrollLeft);
    setSyncScrollTop(scrollTop);
  };

  return (
    <div
      className="relative h-[300px] w-full grid grid-cols-[300px_1fr] grid-rows-[40px_1fr] 
    bg-gray-800 border-t-2 border-solid border-gray-700 overflow-auto"
      data-testid="timeline"
    >
      <PlayControls
        currentTime={currentTime}
        setCurrentTime={setCurrentTime}
        duration={duration}
        setDuration={setDuration}
      />
      <Ruler
        setCurrentTime={setCurrentTime}
        duration={duration}
        onScrollSync={(scrollLeft) => handleScroll(scrollLeft, syncScrollTop)}
        syncScrollLeft={syncScrollLeft}
      />
      <TrackList
        onScrollSync={(scrollTop) => handleScroll(syncScrollLeft, scrollTop)}
        syncScrollTop={syncScrollTop}
      />
      <KeyframeList
        onScrollSync={handleScroll}
        syncScrollLeft={syncScrollLeft}
        syncScrollTop={syncScrollTop}
        duration={duration}
      />
      <Playhead currentTime={currentTime - syncScrollLeft} visible={true} />
    </div>
  );
};
