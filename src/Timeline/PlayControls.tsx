import React, { useState, useRef, useEffect } from "react";

type PlayControlsProps = {
  currentTime: number;
  setCurrentTime: (time: number) => void;
  duration: number;
  setDuration: (duration: number) => void;
};

export const PlayControls = ({
  currentTime,
  setCurrentTime,
  duration,
  setDuration,
}: PlayControlsProps) => {
  const [tempTime, setTempTime] = useState(String(currentTime));
  const [tempDuration, setTempDuration] = useState(String(duration));
  const timeInputRef = useRef<HTMLInputElement>(null);
  const durationInputRef = useRef<HTMLInputElement>(null);
  const confirmedRef = useRef(false);

  const adjustToStep = (value: number, step: number) =>
    Math.round(value / step) * step;

  const validateValue = (
    value: string,
    min: number,
    max: number,
    step: number
  ): number => {
    const sanitizedValue = value.replace(/^0+/, "");
    const parsed = parseFloat(sanitizedValue);
    if (isNaN(parsed)) return NaN;
    return Math.max(min, Math.min(max, adjustToStep(parsed, step)));
  };

  const confirmValue = (
    value: string,
    min: number,
    max: number,
    step: number,
    tempSetter: React.Dispatch<React.SetStateAction<string>>,
    finalSetter: (val: number) => void
  ) => {
    const validatedValue = validateValue(value, min, max, step);
    let tempValue = validatedValue;
    if (isNaN(validatedValue)) {
      tempValue = finalSetter === setCurrentTime ? currentTime : duration;
    }
    tempSetter(String(tempValue));
    finalSetter(tempValue);
  };

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    e.target.select();
  };

  const handleKeyPress = (
    e: React.KeyboardEvent<HTMLInputElement>,
    value: string,
    min: number,
    max: number,
    step: number,
    tempSetter: React.Dispatch<React.SetStateAction<string>>,
    finalSetter: (val: number) => void,
    ref: React.RefObject<HTMLInputElement>,
    previousValue: string
  ) => {
    if (e.key === "Enter") {
      confirmedRef.current = true;
      confirmValue(value, min, max, step, tempSetter, finalSetter);
      ref.current?.blur();
    }
    if (e.key === "Escape") {
      confirmedRef.current = true;
      tempSetter(previousValue);
      ref.current?.blur();
    }
    if (e.key === "ArrowUp" || e.key === "ArrowDown") {
      e.preventDefault();
      const stepDelta = e.key === "ArrowUp" ? step : -step;
      const currentValue = validateValue(value, min, max, step);
      const newValue = Math.max(min, Math.min(max, currentValue + stepDelta));
      tempSetter(String(newValue));
      finalSetter(newValue);

      setTimeout(() => {
        if (ref.current) {
          ref.current.select();
        }
      }, 0);
    }
  };

  const handleBlur = (
    value: string,
    min: number,
    max: number,
    step: number,
    tempSetter: React.Dispatch<React.SetStateAction<string>>,
    finalSetter: (val: number) => void
  ) => {
    if (confirmedRef.current) {
      confirmedRef.current = false;
      return;
    }
    confirmValue(value, min, max, step, tempSetter, finalSetter);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    min: number,
    max: number,
    step: number,
    tempSetter: React.Dispatch<React.SetStateAction<string>>,
    finalSetter: (val: number) => void
  ) => {
    const newValue = parseFloat(e.target.value);
    if (newValue === currentTime + step || newValue === currentTime - step) {
      e.target.select();
      const validatedValue = validateValue(e.target.value, min, max, step);
      tempSetter(String(validatedValue));
      finalSetter(validatedValue);
    } else {
      tempSetter(e.target.value);
    }
  };

  useEffect(() => {
    setTempTime(String(currentTime));
    setTempDuration(String(duration));
    if (currentTime > duration) {
      setCurrentTime(duration);
    }
  }, [currentTime, duration]);

  return (
    <div
      className="flex items-center justify-between border-b border-r border-solid border-gray-700 px-2"
      data-testid="play-controls"
    >
      <fieldset className="flex gap-1">
        Current
        <input
          ref={timeInputRef}
          className="bg-gray-700 px-1 rounded w-16"
          type="number"
          data-testid="current-time-input"
          min={0}
          max={duration}
          step={10}
          value={tempTime}
          onFocus={handleFocus}
          onChange={(e) =>
            handleChange(e, 0, duration, 10, setTempTime, setCurrentTime)
          }
          onBlur={() =>
            handleBlur(tempTime, 0, duration, 10, setTempTime, setCurrentTime)
          }
          onKeyDown={(e) =>
            handleKeyPress(
              e,
              tempTime,
              0,
              duration,
              10,
              setTempTime,
              setCurrentTime,
              timeInputRef,
              String(currentTime)
            )
          }
        />
      </fieldset>
      -
      <fieldset className="flex gap-1">
        <input
          ref={durationInputRef}
          className="bg-gray-700 px-1 rounded w-16"
          type="number"
          data-testid="duration-input"
          min={100}
          max={6000}
          step={10}
          value={tempDuration}
          onFocus={handleFocus}
          onChange={(e) =>
            handleChange(e, 0, duration, 10, setTempDuration, setDuration)
          }
          onBlur={() =>
            handleBlur(
              tempDuration,
              100,
              6000,
              10,
              setTempDuration,
              setDuration
            )
          }
          onKeyDown={(e) =>
            handleKeyPress(
              e,
              tempDuration,
              100,
              6000,
              10,
              setTempDuration,
              setDuration,
              durationInputRef,
              String(duration)
            )
          }
        />
        Duration
      </fieldset>
    </div>
  );
};
