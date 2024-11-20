import { render, screen, fireEvent } from "@testing-library/react";
import { Ruler } from "../../src/Timeline/Ruler";

describe("Ruler Component", () => {
  const setCurrentTimeMock = jest.fn();
  const onScrollSyncMock = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should render the ruler component", () => {
    render(
      <Ruler
        setCurrentTime={setCurrentTimeMock}
        duration={2000}
        onScrollSync={onScrollSyncMock}
        syncScrollLeft={0}
      />
    );

    const ruler = screen.getByTestId("ruler");
    expect(ruler).toBeInTheDocument();
  });

  it("should update currentTime on mouse click", () => {
    render(
      <Ruler
        setCurrentTime={setCurrentTimeMock}
        duration={2000}
        onScrollSync={onScrollSyncMock}
        syncScrollLeft={0}
      />
    );

    const ruler = screen.getByTestId("ruler");
    fireEvent.mouseDown(ruler, { clientX: 200 });

    expect(setCurrentTimeMock).toHaveBeenCalledTimes(1);
    const calledTime = setCurrentTimeMock.mock.calls[0][0];
    expect(calledTime).toBeGreaterThanOrEqual(0);
    expect(calledTime).toBeLessThanOrEqual(2000);
  });

  it("should update currentTime on mouse drag", () => {
    render(
      <Ruler
        setCurrentTime={setCurrentTimeMock}
        duration={2000}
        onScrollSync={onScrollSyncMock}
        syncScrollLeft={0}
      />
    );

    const ruler = screen.getByTestId("ruler");

    // Simulate mouse down to start dragging
    fireEvent.mouseDown(ruler, { clientX: 100 });

    // Simulate multiple mouse moves
    fireEvent.mouseMove(document, { clientX: 150, buttons: 1 });
    fireEvent.mouseMove(document, { clientX: 200, buttons: 1 });
    fireEvent.mouseMove(document, { clientX: 250, buttons: 1 });

    // Verify that setCurrentTimeMock is called for each move
    expect(setCurrentTimeMock).toHaveBeenCalledTimes(4); // mouseDown + 3 moves
    expect(setCurrentTimeMock).toHaveBeenLastCalledWith(expect.any(Number));
  });

  it("should stop updating currentTime when mouse is released", () => {
    render(
      <Ruler
        setCurrentTime={setCurrentTimeMock}
        duration={2000}
        onScrollSync={onScrollSyncMock}
        syncScrollLeft={0}
      />
    );

    const ruler = screen.getByTestId("ruler");

    // Simulate mouse drag
    fireEvent.mouseDown(ruler, { clientX: 100 });
    fireEvent.mouseMove(document, { clientX: 200, buttons: 1 });

    // Simulate mouse release
    fireEvent.mouseUp(document);

    // Subsequent mouse move should not trigger setCurrentTime
    fireEvent.mouseMove(document, { clientX: 300, buttons: 1 });

    // Verify calls stop after mouseUp
    expect(setCurrentTimeMock).toHaveBeenCalledTimes(2); // mouseDown + first move
  });

  it("should synchronize scroll position with syncScrollLeft", () => {
    const { rerender } = render(
      <Ruler
        setCurrentTime={setCurrentTimeMock}
        duration={2000}
        onScrollSync={onScrollSyncMock}
        syncScrollLeft={0}
      />
    );

    const ruler = screen.getByTestId("ruler");
    expect(ruler.scrollLeft).toBe(0);

    rerender(
      <Ruler
        setCurrentTime={setCurrentTimeMock}
        duration={2000}
        onScrollSync={onScrollSyncMock}
        syncScrollLeft={100}
      />
    );

    expect(ruler.scrollLeft).toBe(100); // Syncs with syncScrollLeft
  });

  it("should call onScrollSync when scrolled", () => {
    render(
      <Ruler
        setCurrentTime={setCurrentTimeMock}
        duration={2000}
        onScrollSync={onScrollSyncMock}
        syncScrollLeft={0}
      />
    );

    const ruler = screen.getByTestId("ruler");

    fireEvent.scroll(ruler, { target: { scrollLeft: 150 } });

    expect(onScrollSyncMock).toHaveBeenCalledTimes(1);
    expect(onScrollSyncMock).toHaveBeenCalledWith(150);
  });

  it("should not call onScrollSync if syncScrollLeft matches scrollLeft", () => {
    render(
      <Ruler
        setCurrentTime={setCurrentTimeMock}
        duration={2000}
        onScrollSync={onScrollSyncMock}
        syncScrollLeft={150}
      />
    );

    const ruler = screen.getByTestId("ruler");
    fireEvent.scroll(ruler, { target: { scrollLeft: 150 } }); // No change

    expect(onScrollSyncMock).not.toHaveBeenCalled();
  });
});
