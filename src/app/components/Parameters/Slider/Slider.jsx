// Libraries
import { useEffect, useRef } from "react";

// Styles
import styles from "./Slider.module.css";

function ToolTip({ tooltipText = "" }) {
  return (
    <span className={styles.tooltip}>
      ?<span className={styles.tooltipText}>{tooltipText}</span>
    </span>
  );
}

export default function Parameter({
  min,
  max,
  defaultValue,
  onChange = () => {},
  label,
  id,
  name,
  marks,
  ticks,
  tooltipText,
  step = 1,
}) {
  const sliderRef = useRef(null);

  useEffect(() => {
    const slider = sliderRef.current;
    const percentage = ((slider.value - slider.min) / (slider.max - slider.min)) * 100;
    slider.style.setProperty("--progress", `${percentage}%`);
  });

  function updatePercentage(event) {
    const slider = event.target;
    const percentage = ((slider.value - slider.min) / (slider.max - slider.min)) * 100;
    slider.style.setProperty("--progress", `${percentage}%`);
  }

  return (
    <div className={"parameterWrapper " + (ticks ? "parameterDivider" : "parameterDivider")}>
      <div className={`${styles.parameterContainer} ${ticks ? styles.tickSpace : null}`}>
        <div className={styles.parameterLabel}>
          <label htmlFor={id}>{label}</label>
          {tooltipText ? <ToolTip tooltipText={tooltipText} /> : null}
        </div>
        <div className={styles.inputContainer}>
          <div className={styles.sliderContainer}>
            <input
              ref={sliderRef}
              className={`${styles.slider} ${ticks ? styles.ticking : styles.notTicking}`}
              type="range"
              id={id}
              step={step}
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
              <div className={styles.ticks}>
                {Array.from({ length: ticks }, (_, i) =>
                  (i + 1) % 5 === 1 ? (
                    <span key={i} className={styles.tick + " " + styles.thick}></span>
                  ) : (
                    <span key={i} className={styles.tick}></span>
                  )
                )}
              </div>
            ) : null}
            {marks ? (
              <div className={styles.marks}>
                {marks.map((mark) => (
                  <span
                    className={styles.mark}
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
            className={styles.numberArea}
            type="number"
            value={defaultValue}
            name={name}
            min={min}
            max={max}
            onChange={onChange}
          />
        </div>
      </div>
    </div>
  );
}
