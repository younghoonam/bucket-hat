import { useEffect, useRef } from "react";
import "./Parameter.css";
import { div } from "three/tsl";

function ToolTip({ tooltipText = "" }) {
  return (
    <span className="tooltip">
      ?<span className="tooltip-text">{tooltipText}</span>
    </span>
  );
}

export default function Parameter({
  min,
  max,
  defaultValue,
  onChange,
  label,
  id,
  name,
  marks,
  ticks,
  tooltipText,
}) {
  const sliderRef = useRef(null);

  useEffect(() => {
    const slider = sliderRef.current;
    const percentage =
      ((slider.value - slider.min) / (slider.max - slider.min)) * 100;
    slider.style.setProperty("--progress", `${percentage}%`);
  });

  function updatePercentage(event) {
    const slider = event.target;
    const percentage =
      ((slider.value - slider.min) / (slider.max - slider.min)) * 100;
    slider.style.setProperty("--progress", `${percentage}%`);
  }

  return (
    <div className="parameter-container">
      <div className="parameter-label">
        <label htmlFor={id}>{label}</label>
        <ToolTip tooltipText={tooltipText} />
      </div>
      <div className="input-container">
        <div className="slider-container">
          <input
            ref={sliderRef}
            className="slider"
            type="range"
            id={id}
            name={name}
            min={min}
            max={max}
            value={defaultValue}
            onChange={(e) => {
              onChange(e);
              updatePercentage(e);
            }}
          />

          {ticks ? (
            <div className="ticks">
              {Array.from({ length: ticks }, (_, i) =>
                (i + 1) % 5 === 1 ? (
                  <span key={i} className="tick thick"></span>
                ) : (
                  <span key={i} className="tick"></span>
                )
              )}
            </div>
          ) : null}
          {marks ? (
            <div className="marks">
              {marks.map((mark) => (
                <span
                  className="mark"
                  key={mark.value}
                  style={{
                    left: `${((mark.value - min) / (max - min)) * 100}%`,
                  }}
                >
                  {mark.label}
                </span>
              ))}
            </div>
          ) : null}
        </div>
        <input
          className="number-area"
          type="number"
          value={defaultValue}
          name={name}
          min={min}
          max={max}
          onChange={onChange}
        />
      </div>
    </div>
  );
}
