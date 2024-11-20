type SegmentProps = {
  duration: number;
};

export const Segment = ({ duration }: SegmentProps) => {
  return (
    <div
      className="py-2"
      data-testid="segment"
      style={{ width: `${duration}px` }}
    >
      <div className="h-6 rounded-md bg-white/10"></div>
    </div>
  );
};
