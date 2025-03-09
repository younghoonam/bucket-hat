// Libraries
import { useEffect, useRef } from "react";
import { Tooltip } from "react-tooltip";

// Styles
import styles from "./Slider.module.css";

function mmToInchesFraction(mm) {
  const inches = mm / 25.4; // Convert mm to inches
  const whole = Math.floor(inches); // Get the whole number part
  const fraction = inches - whole; // Get the fractional part

  // Define closest fractions in eighths
  const eighths = [0, 1 / 8, 1 / 4, 3 / 8, 1 / 2, 5 / 8, 3 / 4, 7 / 8, 1];
  const fractionSymbols = ["", "⅛", "¼", "⅜", "½", "⅝", "¾", "⅞", ""];

  // Find the closest fraction
  let closestIndex = 0;
  let minDiff = Infinity;
  for (let i = 0; i < eighths.length; i++) {
    let diff = Math.abs(fraction - eighths[i]);
    if (diff < minDiff) {
      minDiff = diff;
      closestIndex = i;
    }
  }

  // Build the result string
  let fractionStr = fractionSymbols[closestIndex];
  let result =
    (whole == 0 && fractionStr ? "" : whole) + (fractionStr ? "" + fractionStr : "") + '"';

  return result.trim();
}

function mmToInches(mm) {
  let inches = mm / 25.4; // Convert mm to inches
  inches *= 100;
  inches = Math.round(inches);
  inches /= 100;
  return inches;
}

function inchesToMm(inch) {
  return Math.round(inch * 25.4);
}

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
  isMillimeter = true,
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

  const tooltip = (
    <>
      <a className={styles.tooltip} data-tooltip-id={id} data-tooltip-html={tooltipText}>
        ?
      </a>

      <Tooltip className={styles.tooltipText} id={id} opacity={1} />
    </>
  );

  return (
    <div className={"parameterWrapper " + (ticks ? "parameterDivider" : "parameterDivider")}>
      <div className={`${styles.parameterContainer} ${ticks ? styles.tickSpace : null}`}>
        <div className={styles.parameterLabel}>
          <label htmlFor={id}>{label}</label>
          {/* {tooltipText ? <ToolTip tooltipText={tooltipText} /> : null} */}
          {tooltipText ? tooltip : null}
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
                    {isMillimeter ? mark.label : mmToInchesFraction(mark.label)}
                  </span>
                ))}
              </div>
            ) : null}
          </div>
          <input
            className={styles.numberArea}
            type="number"
            value={isMillimeter ? defaultValue : mmToInches(defaultValue)}
            name={name}
            min={min}
            max={max}
            onChange={isMillimeter ? onChange : null}
            // onBlur={(e) => {
            //   e.target.value = inchesToMm(e.target.value);
            //   onchange(e);
            // }}
          />
        </div>
      </div>
    </div>
  );
}
