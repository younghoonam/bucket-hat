import { useEffect } from "react";

export function useResponsiveScroll(graphicContainerRef, exportButtonRef, configuratorRef) {
  useEffect(() => {
    // Check if refs are current to avoid null errors
    if (!graphicContainerRef.current || !exportButtonRef.current) return;

    function handleScroll() {
      // Only apply changes on mobile/small screens
      if (window.innerWidth <= 768) {
        if (window.scrollY > 0) {
          graphicContainerRef.current.classList.add("floating");
          // exportButtonRef.current.classList.add("hide");
          exportButtonRef.current.style.display = "none";
          configuratorRef.current.style.marginTop = "20rem";
        } else {
          graphicContainerRef.current.classList.remove("floating");
          // exportButtonRef.current.classList.remove("hide");
          exportButtonRef.current.style.display = "";
          configuratorRef.current.style.marginTop = "";
        }
      }
    }

    // Add event listener
    window.addEventListener("scroll", handleScroll);

    // Cleanup function to remove event listener
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [graphicContainerRef, exportButtonRef]);
}
