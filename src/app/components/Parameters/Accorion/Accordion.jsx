// Libs
import { useEffect, useRef } from "react";

// Styles
import styles from "./Accordion.module.css";

export default function Accordion({ children, name }) {
  const accordionRef = useRef();

  useEffect(() => {});

  return (
    <div className="parameterWrapper parameterDivider">
      <div className={styles.accordion}>
        <input type="checkbox" id="section1" className={styles.hiddenCheckbox} />
        <label htmlFor="section1" className={styles.label}>
          {name}
          <span className={styles.arrow}>▼</span>
        </label>
        <div className={styles.content}>{children}</div>
      </div>
    </div>
  );
}
