import { render, screen, fireEvent } from "@testing-library/react";
import { KeyframeList } from "../../src/Timeline/KeyframeList";

describe("KeyframeList Component", () => {
  it("should synchronize horizontal scrolling with the Ruler", () => {
    const handleScrollSyncMock = jest.fn();

    render(
      <KeyframeList
        onScrollSync={handleScrollSyncMock}
        syncScrollLeft={0}
        syncScrollTop={0}
        duration={2000}
      />
    );

    const keyframeList = screen.getByTestId("keyframe-list");

    fireEvent.scroll(keyframeList, { target: { scrollLeft: 50 } });
    expect(handleScrollSyncMock).toHaveBeenCalledWith(50, 0);
  });

  it("should synchronize vertical scrolling with the Track List", () => {
    const handleScrollSyncMock = jest.fn();

    render(
      <KeyframeList
        onScrollSync={handleScrollSyncMock}
        syncScrollLeft={0}
        syncScrollTop={0}
        duration={2000}
      />
    );

    const keyframeList = screen.getByTestId("keyframe-list");

    fireEvent.scroll(keyframeList, { target: { scrollTop: 50 } });
    expect(handleScrollSyncMock).toHaveBeenCalledWith(0, 50);
  });
});
