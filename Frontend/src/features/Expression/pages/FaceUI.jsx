import { useEffect, useRef, useState } from "react";
import {
  initFaceDetector,
  startDetection,
  stopDetection,
} from "../utils/faceDetection";

const FaceUI = () => {
  const videoRef = useRef(null);
  const [expression, setExpression] = useState("Not Started");

  useEffect(() => {
    initFaceDetector();
  }, []);

  const handleStart = () => {
    startDetection(videoRef, setExpression);
  };

  const handleStop = () => {
    stopDetection();
    setExpression("Stopped");
  };

  return (
    <div style={{ textAlign: "center" }}>
      <h2>Face Expression Detector</h2>

      <video
        ref={videoRef}
        style={{
          width: "400px",
          borderRadius: "10px",
        }}
        autoPlay
        playsInline
      />

      <br /><br />

      <button onClick={handleStart}>
        Start Detection
      </button>

      <button onClick={handleStop} style={{ marginLeft: "10px" }}>
        Stop
      </button>

      <h3>{expression}</h3>
    </div>
  );
};

export default FaceUI;