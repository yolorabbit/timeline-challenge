import { render, screen, fireEvent } from "@testing-library/react";
import { PlayControls } from "../../src/Timeline/PlayControls";

describe("PlayControls Component", () => {
  const setCurrentTimeMock = jest.fn();
  const setDurationMock = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should render Current Time and Duration input fields", () => {
    render(
      <PlayControls
        currentTime={500}
        setCurrentTime={setCurrentTimeMock}
        duration={2000}
        setDuration={setDurationMock}
      />
    );

    expect(screen.getByTestId("current-time-input")).toBeInTheDocument();
    expect(screen.getByTestId("duration-input")).toBeInTheDocument();
  });

  it("should update displayed value while typing in Current Time input without triggering onChange", () => {
    render(
      <PlayControls
        currentTime={500}
        setCurrentTime={setCurrentTimeMock}
        duration={2000}
        setDuration={setDurationMock}
      />
    );

    const currentTimeInput = screen.getByTestId("current-time-input");

    fireEvent.change(currentTimeInput, { target: { value: "600" } });
    expect(currentTimeInput).toHaveValue(600);
    expect(setCurrentTimeMock).not.toHaveBeenCalled();
  });

  it("should trigger setCurrentTime on blur for Current Time input", () => {
    render(
      <PlayControls
        currentTime={500}
        setCurrentTime={setCurrentTimeMock}
        duration={2000}
        setDuration={setDurationMock}
      />
    );

    const currentTimeInput = screen.getByTestId("current-time-input");

    fireEvent.change(currentTimeInput, { target: { value: "600" } });
    fireEvent.blur(currentTimeInput);

    expect(setCurrentTimeMock).toHaveBeenCalledWith(600);
  });

  it("should trigger setDuration on blur for Duration input", () => {
    render(
      <PlayControls
        currentTime={500}
        setCurrentTime={setCurrentTimeMock}
        duration={2000}
        setDuration={setDurationMock}
      />
    );

    const durationInput = screen.getByTestId("duration-input");

    fireEvent.change(durationInput, { target: { value: "2500" } });
    fireEvent.blur(durationInput);

    expect(setDurationMock).toHaveBeenCalledWith(2500);
  });

  it("should select all text when input gains focus", () => {
    render(
      <PlayControls
        currentTime={500}
        setCurrentTime={setCurrentTimeMock}
        duration={2000}
        setDuration={setDurationMock}
      />
    );

    const currentTimeInput = screen.getByTestId(
      "current-time-input"
    ) as HTMLInputElement;
    currentTimeInput.setAttribute("type", "text");

    fireEvent.focus(currentTimeInput);

    expect(currentTimeInput.selectionStart).toBe(0);
    expect(currentTimeInput.selectionEnd).toBe(
      String(currentTimeInput.value).length
    );
  });

  it("should handle step adjustments with arrow keys for Current Time input", () => {
    render(
      <PlayControls
        currentTime={500}
        setCurrentTime={setCurrentTimeMock}
        duration={2000}
        setDuration={setDurationMock}
      />
    );

    const currentTimeInput = screen.getByTestId("current-time-input");

    fireEvent.keyDown(currentTimeInput, { key: "ArrowUp" });
    expect(setCurrentTimeMock).toHaveBeenCalledWith(510);

    fireEvent.keyDown(currentTimeInput, { key: "ArrowDown" });
    expect(setCurrentTimeMock).toHaveBeenCalledWith(500);
  });

  it("should confirm value on Enter key and reset on Escape key", () => {
    render(
      <PlayControls
        currentTime={500}
        setCurrentTime={setCurrentTimeMock}
        duration={2000}
        setDuration={setDurationMock}
      />
    );

    const currentTimeInput = screen.getByTestId("current-time-input");

    fireEvent.change(currentTimeInput, { target: { value: "600" } });
    fireEvent.keyDown(currentTimeInput, { key: "Enter" });
    expect(setCurrentTimeMock).toHaveBeenCalledWith(600);

    fireEvent.change(currentTimeInput, { target: { value: "700" } });
    fireEvent.keyDown(currentTimeInput, { key: "Escape" });
    expect(currentTimeInput).toHaveValue(500);
  });

  it("should not allow values below minimum for Duration", () => {
    render(
      <PlayControls
        currentTime={500}
        setCurrentTime={setCurrentTimeMock}
        duration={2000}
        setDuration={setDurationMock}
      />
    );

    const durationInput = screen.getByTestId("duration-input");

    fireEvent.change(durationInput, { target: { value: "50" } });
    fireEvent.blur(durationInput);

    expect(setDurationMock).toHaveBeenCalledWith(100);
  });

  it("should round values to the nearest step for Duration", () => {
    render(
      <PlayControls
        currentTime={500}
        setCurrentTime={setCurrentTimeMock}
        duration={2000}
        setDuration={setDurationMock}
      />
    );

    const durationInput = screen.getByTestId("duration-input");

    fireEvent.change(durationInput, { target: { value: "157" } });
    fireEvent.blur(durationInput);

    expect(setDurationMock).toHaveBeenCalledWith(160);
  });

  it("should prevent invalid (non-numeric) inputs", () => {
    render(
      <PlayControls
        currentTime={500}
        setCurrentTime={setCurrentTimeMock}
        duration={2000}
        setDuration={setDurationMock}
      />
    );

    const currentTimeInput = screen.getByTestId("current-time-input");

    fireEvent.change(currentTimeInput, { target: { value: "abc" } });
    fireEvent.blur(currentTimeInput);

    expect(setCurrentTimeMock).toHaveBeenCalledWith(500);
  });

  it("should adjust currentTime if it exceeds duration", () => {
    render(
      <PlayControls
        currentTime={2100}
        setCurrentTime={setCurrentTimeMock}
        duration={2000}
        setDuration={setDurationMock}
      />
    );

    expect(setCurrentTimeMock).toHaveBeenCalledWith(2000);
  });
});
