import { render, screen } from "@testing-library/react";
import { Playhead } from "../../src/Timeline/Playhead";

describe("Playhead Component", () => {
  it("should maintain relative position during horizontal scrolling", () => {
    const { rerender } = render(<Playhead currentTime={100} visible={true} />);

    let playhead = screen.getByTestId("playhead");
    expect(playhead).toHaveStyle("transform: translateX(100px)");

    rerender(<Playhead currentTime={150} visible={true} />);
    playhead = screen.getByTestId("playhead");
    expect(playhead).toHaveStyle("transform: translateX(150px)");
  });

  it("should be hidden when out of view", () => {
    render(<Playhead currentTime={3000} visible={false} />);

    const playhead = screen.getByTestId("playhead");
    expect(playhead).toHaveClass("hidden");
  });
});
