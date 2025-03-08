import { EB_Garamond } from "next/font/google";
import { useRef } from "react";
import "@/styles/Header.css";
import hamburgerIcon from "@/assets/hamburger.svg";

// Load EB Garamond font
const ebGaramond = EB_Garamond({
  subsets: ["latin"],
  weight: ["400", "700"], // Adjust weights as needed
});

export default function Header() {
  const hamburgerMenu = useRef();
  function handleHamburgerClick() {
    hamburgerMenu.current.classList.toggle("hide");
  }

  return (
    <header>
      <ul>
        <li>
          <a href="" className={`logo ${ebGaramond.className}`}>
            Patternea
          </a>
        </li>
        <li className="links">
          <div>
            <ul>
              <li>
                <a href="">About</a>
              </li>
            </ul>
          </div>
        </li>
        <li className="links">
          <a href="">[Gallery]</a>
        </li>
        <li className="links">Younghoo Nam @2025</li>
        <li className="hamburger" onClick={handleHamburgerClick}>
          <img src={hamburgerIcon} alt="" />
        </li>
      </ul>
      <div ref={hamburgerMenu} className="hamburger-menu hide">
        <ul>
          <li>
            <a href="">About</a>
          </li>
          <li>
            <a href="">[Gallery]</a>
          </li>
          <li>
            <a href="">Younghoo Nam @2025</a>
          </li>
        </ul>
      </div>
    </header>
  );
}
