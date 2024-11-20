type PlayheadProps = {
  currentTime: number;
  visible: boolean;
};

export const Playhead = ({ currentTime, visible }: PlayheadProps) => {
  return (
    <div
      className={`absolute left-[316px] h-full border-l-2 border-solid border-yellow-600 z-10 ${
        visible ? "" : "hidden"
      }`}
      data-testid="playhead"
      style={{ transform: `translateX(${currentTime}px)` }}
    >
      <div className="absolute border-solid border-[5px] border-transparent border-t-yellow-600 -translate-x-1.5" />
    </div>
  );
};
