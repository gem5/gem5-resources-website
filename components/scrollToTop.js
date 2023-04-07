import { useState, useEffect } from "react";

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
      <button onClick={scrollBehavior} className="scrollToTopBtn">
        <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M18 15l-6-6-6 6"/>
        </svg>
      </button>
    </div>
  );
}
