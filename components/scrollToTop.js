import { useState, useEffect } from "react";
import { Button } from "react-bootstrap";

/**
 * @component ScrollToTop
 * @description This component renders a "scroll to top" button that appears when the user scrolls down the page.
 * When clicked, it smoothly scrolls the page back to the top. The button's visibility is controlled based on
 * the window's vertical scroll position, and it fades in and out based on its opacity style.
 * @returns {JSX.Element} - The JSX element representing the "scroll to top" button.
 */
export default function ScrollToTop() {
  const [visible, setVisible] = useState(false);
  const pageYOffsetTrigger = 300;

  function scrollBehavior() {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  }

  useEffect(() => {
    function toggleVisibility() {
      window.pageYOffset > pageYOffsetTrigger ? setVisible(true) : setVisible(false)
    }

    window.addEventListener("scroll", toggleVisibility);
    return () => { window.removeEventListener("scroll", toggleVisibility) }
  }, []);

  return (
    <div className="scrollToTop" style={ visible ? {opacity: '1'} : {opacity: '0'} }>
      <Button onClick={scrollBehavior} className="scrollToTopBtn" aria-label="Scroll to Top Button">
        <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M18 15l-6-6-6 6"/>
        </svg>
      </Button>
    </div>
  );
}
