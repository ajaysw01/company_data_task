import React from "react";
import "./Spinner.css"; // Ensure CSS file exists

const Spinner = () => {
  return (
    <div className="loadingSpinnerContainer">
      <div className="loadingSpinner"></div>
    </div>
  );
};

export default Spinner;
