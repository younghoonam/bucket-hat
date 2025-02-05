import "./Header.css";

export default function Header() {
  return (
    <header>
      <ul>
        <li>
          <a href="">Patterno</a>
        </li>
        <li>
          <div>
            <ul>
              <li>
                <a href="">About</a>
              </li>
              <span> / </span>
              <li>
                <a href="">Examples</a>
              </li>
              <span> / </span>
              <li>
                <a href="">Contact</a>
              </li>
            </ul>
          </div>
        </li>
        <li>
          <a href="">[Gallery]</a>
        </li>
        <li>Younghoo Nam @2025</li>
      </ul>
    </header>
  );
}
