import styles from "./Footer.module.css";

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div>
        <h1 className={styles.logo}>Patternea</h1>
        <span>© 2025 Younghoo Nam. All rights reserved.</span>
        <a href="https://www.buymeacoffee.com/younghoonam" target="blank">
          <img
            className={styles.buymeacoffeeButton}
            src="/images/buymeacoffee.png"
            alt="Buy me a coffee donation link image"
          />
        </a>
      </div>
      <div className={styles.disclaimer}>
        <p>
          This project is a work in progress, and there may be errors in the pattern calculations.
          The generated patterns may not always match the 3D preview exactly. Please test with scrap
          fabric before using valuable materials. Use at your own discretion.
        </p>
      </div>
    </footer>
  );
}
