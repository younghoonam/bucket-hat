import { useEffect, useRef } from "react";
import "@/styles/Parameter.css";
import { div } from "three/tsl";

function ToolTip({ tooltipText = "" }) {
  return (
    <span className="tooltip">
      ?<span className="tooltip-text">{tooltipText}</span>
    </span>
  );
}

export default function Parameter({ defaultValue, onChange, label, id, name }) {
  useEffect(() => {});

  return (
    <div className="parameter-container">
      <div className="parameter-label">
        <label htmlFor={id}>{label}</label>
      </div>
      <div className="input-container"></div>
    </div>
  );
}
