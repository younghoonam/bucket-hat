"use client";

import { useRef } from "react";
import Footer from "../components/Footer/Footer";
import Header from "../components/Header";
import styles from "./about.module.css";

export default function About() {
  const formRef = useRef();
  const cursiveRef = useRef();

  async function handleSubmit(event) {
    event.preventDefault();

    const formData = new FormData(formRef.current);
    const formEntries = Object.fromEntries(formData.entries());

    formRef.current.reset();
    cursiveRef.current.classList.toggle(styles.writeCursive);
    setTimeout(() => {
      cursiveRef.current.classList.toggle(styles.writeCursive);
    }, 2000);
    const response = await fetch("/api/feedback", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formEntries),
    });

    const data = await response.json();

    console.log(data);
  }

  return (
    <>
      <Header />
      <div className={styles.backgroundContainer}>
        <svg
          ref={cursiveRef}
          className={styles.cursive}
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 926.46 407.44"
        >
          <path
            fill="none"
            stroke="#000000"
            strokeWidth="1"
            d="M0,403.51c7.42-3.23,136.84-30.03,214.86-77.56,69.96-42.62,98.34-91.24,109.51-113.55,3.86-7.7,18.43-37.57,14.4-45.18s-13.79-12.45-21.69-9.01c-3.34,1.46-6.29,5.08-5.12,8.53.64,1.89,2.32,3.2,3.94,4.37,10.6,7.68,22.11,14.26,31.45,23.43,14.3,14.05,22.74,34.73,19.37,54.49s-19.87,37.36-39.82,39.31c-8.5.83-18.85-2.59-20.69-10.93-.88-3.97.46-8.13,2.39-11.7,4.01-7.4,10.74-13.29,18.6-16.28,8.22-3.12,17.24-3.09,25.92-4.49,25.29-4.08,48.05-21.42,58.71-44.71,1.14-2.48,2.16-5.2,1.67-7.88s-3.11-5.15-5.76-4.51c-1.7.41-2.9,1.9-3.84,3.37-8.22,12.8-6.46,29.34-4.41,44.41,1.14,8.38,2.95,17.84,10.11,22.33,8.53,5.35,19.91.55,27.41-6.17,21.4-19.18,26.39-50.25,30.08-78.76,2.07,29.03-3.14,58.55-15.02,85.12,9.86-12.3,15.05-27.59,22.37-41.56,7.31-13.97,18.05-27.6,33.3-31.63-.81,16.15-1.62,32.29-2.43,48.44-.12,2.44-.21,5.04,1.05,7.14,3.15,5.26,11.51,3.1,15.93-1.15,7.01-6.72,10.19-16.39,13.13-25.65,9.03-28.47,18.06-56.95,27.09-85.42-8.68,25.09-13.64,51.47-14.66,78.01-.21,5.57.07,11.93,4.31,15.55,4.01,3.43,10.32,2.92,14.77.09,4.45-2.83,7.39-7.49,9.83-12.16,6.72-12.91,10.05-30.35-.07-40.81-9.98-10.31-26.82-7.86-40.77-4.51-4.46,1.07-10.1,4.01-8.88,8.43.83,3.01,4.44,4.15,7.53,4.61,26.07,3.85,74.34-1.92,141.26-25.11C802.97,108.33,881.89,30.04,922.97,0"
          />
        </svg>
        <img id={styles.hat1} className={styles.hat} src="/images/hats/hat1.png" />
        <img id={styles.hat2} className={styles.hat} src="/images/hats/hat2.png" />
        <img id={styles.hat3} className={styles.hat} src="/images/hats/hat3.png" />
        <img id={styles.hat4} className={styles.hat} src="/images/hats/hat4.png" />
        <img id={styles.hat5} className={styles.hat} src="/images/hats/hat5.png" />
      </div>
      <div className={styles.container}>
        <h1 className={styles.heading}>About</h1>
        <p className={styles.paragraph}>
          One of the biggest challenges of sewing from patterns is that you often have little idea
          of how the final garment will look. Small differences in length and angle can
          significantly affect the final shape, especially for small and three-dimensional garments
          like hats. Additionally, making adjustments to one piece often means having to modify all
          the other pieces, which can be frustrating and time-consuming.
          <br />
          <br />
          I sew quite a few hats every year—most of them bucket hats. They’re comfortable and match
          my style. Over time, I developed a preference for how a bucket hat should fit me—a
          slightly short brim, angled low so that the edge sits just above my eye level. However,
          most patterns available online lacked the details I was looking for, so I decided to build
          this project to create patterns for my taste.
          <br />
          <br />
          This tool allows you to customize size, shape, seam allowance, and even preview the hat
          using a physics engine that simulates how it would look on a head! But, please note that
          this project is still a work in progress, and there may be some bugs in the pattern
          calculations. I can’t guarantee that every generated pattern will turn out exactly as
          shown in the preview, so test it out first before using any precious fabrics.
        </p>
        <h1 className={styles.heading}>Feedback</h1>
        <p className={styles.paragraph}>
          If you have feedback, suggestions, found any bugs or just have something to say, feel free
          to leave a message below!
        </p>
        <form
          ref={formRef}
          className={styles.form}
          onSubmit={(event) => {
            handleSubmit(event);
          }}
          method="post"
        >
          <label htmlFor="name">Name*</label>
          <input type="text" id="name" name="name" required />
          <label htmlFor="email">Email</label>
          <input type="email" id="email" name="email" />
          <label htmlFor="message">Message*</label>
          <textarea id="message" name="message" rows="4" required></textarea>
          <button type="submit">Send</button>
        </form>
        <h1 className={styles.heading}>Thank You!</h1>
        <p className={styles.paragraph}>
          Thank you for your interest in this project and taking the time to read this page. I hope
          this tool can help you create bucket hats that you were always looking for. I plan on
          polishing the project by adding more simulation parameters, advanced measurements, export
          settings, and so on. Drop by once in a while!
        </p>
      </div>
      <Footer />
    </>
  );
}
