import "./style.css";
import spinnerGIF from "../asset/Spinner-full.gif";

function SpinnerFull() {
  return (
    <div className="spinner-full">
      <img src={spinnerGIF} alt="Loading Spinner" className="spinner-image" />
    </div>
  );
}

export default SpinnerFull;
