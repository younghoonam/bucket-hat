import styles from "./PresetSelection.module.css";

export default function PresetSelection({ onChange }) {
  return (
    <div className="parameterWrapper parameterDivider">
      <div className={styles.parameterToggle}>
        <label htmlFor="presets">Presets</label>
        <div className={styles.presetSelection}>
          <select name="presets" id="presets" onChange={onChange}>
            <option value={"universal"}>Universal</option>
            <option value={"large"}>Large</option>
            <option value={"small"}>Small</option>
            <option value={"wideBrim"}>Wide Brim</option>
            <option value={"lowBrim"}>Low Brim</option>
          </select>
        </div>
      </div>
    </div>
  );
}
