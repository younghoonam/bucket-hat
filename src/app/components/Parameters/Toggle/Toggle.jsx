import styles from "./Toggle.module.css";

export default function Toggle({ label, id, name, onChange = () => {}, defaultChecked }) {
  return (
    <div className="parameterWrapper parameterDivider">
      <div className={styles.parameterToggle}>
        <label>{label}</label>
        <input
          type="checkbox"
          className={styles.toggleCheckbox}
          id={id}
          name={name}
          onChange={onChange}
          defaultChecked={defaultChecked}
        />
        <label htmlFor={id} className={styles.toggleContainer}>
          <div>ON</div>
          <div>OFF</div>
        </label>
      </div>
    </div>
  );
}
