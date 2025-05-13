import styles from "./ExportButton.module.css";

export default function ExportButton({ exportButtonRef, containerRef, onChange }) {
  return (
    <div ref={containerRef} className={styles.exportButtonContainer}>
      <button ref={exportButtonRef} className={styles.exportButton} id="exportPdf">
        Export to PDF
      </button>
      <div className={styles.paperSizeSelection}>
        <select name="paperSize" id="paperSize" onChange={onChange}>
          <option value={"a4"}>A4</option>
          <option value={"a3"}>A3</option>
          <option value={"letter"}>Letter</option>
          <option value={"legal"}>Legal</option>
        </select>
      </div>
    </div>
  );
}
