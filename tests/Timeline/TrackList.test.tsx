import { render, screen, fireEvent } from "@testing-library/react";
import { TrackList } from "../../src/Timeline/TrackList";

describe("TrackList Component", () => {
  it("should synchronize vertical scrolling with Keyframe List", () => {
    const handleScrollSyncMock = jest.fn();

    render(<TrackList onScrollSync={handleScrollSyncMock} syncScrollTop={0} />);

    const trackList = screen.getByTestId("track-list");

    fireEvent.scroll(trackList, { target: { scrollTop: 50 } });
    expect(handleScrollSyncMock).toHaveBeenCalledWith(50);
  });
});
