// Libs
import { useEffect, useRef } from "react";

// Styles
import styles from "./Accordion.module.css";

export default function Accordion({ children, name, id }) {
  const contentRef = useRef();

  useEffect(() => {
    contentRef.current.style.setProperty(
      "--expanded-height",
      `${140 * (children.length ? children.length : 1)}px`
    );
  });

  return (
    <div className="parameterWrapper parameterDivider">
      <div className={styles.accordion}>
        <input type="checkbox" id={id} className={styles.hiddenCheckbox} />
        <label htmlFor={id} className={styles.label}>
          {name}
          <span className={styles.arrow}>▼</span>
        </label>
        <div ref={contentRef} className={styles.content}>
          {children}
        </div>
      </div>
    </div>
  );
}
