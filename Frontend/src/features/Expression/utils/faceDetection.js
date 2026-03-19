import {
  FaceLandmarker,
  FilesetResolver,
} from "@mediapipe/tasks-vision";

let faceLandmarker;
let running = false;

export const initFaceDetector = async () => {
  const vision = await FilesetResolver.forVisionTasks(
    "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision/wasm"
  );

  faceLandmarker = await FaceLandmarker.createFromOptions(vision, {
    baseOptions: {
      modelAssetPath:
        "https://storage.googleapis.com/mediapipe-assets/face_landmarker_v2_with_blendshapes.task",
    },
    outputFaceBlendshapes: true,
    runningMode: "VIDEO",
    numFaces: 1,
  });
};

export const startDetection = async (videoRef, setExpression) => {
  if (!faceLandmarker) {
    console.error("Model not initialized");
    return;
  }

  const video = videoRef.current;

  const stream = await navigator.mediaDevices.getUserMedia({
    video: true,
  });

  video.srcObject = stream;

  await video.play();

  running = true;

  const detect = async () => {
    if (!running) return;

    const results = faceLandmarker.detectForVideo(
      video,
      Date.now()
    );

    if (
      results.faceBlendshapes &&
      results.faceBlendshapes.length > 0
    ) {
      const blendShapes =
        results.faceBlendshapes[0].categories;

      // convert to object
      const map = {};
      blendShapes.forEach((b) => {
        map[b.categoryName] = b.score;
      });

      const smile =
        (map.mouthSmileLeft + map.mouthSmileRight) / 2;

      const frown =
        (map.mouthFrownLeft + map.mouthFrownRight) / 2;

      // 🔥 Expression Logic
      let expression = "😐 Normal";

      if (smile > 0.25) {
        expression = "😊 Happy";
      } else if (frown > 0.15) {
        expression = "😞 Sad";
      }

      setExpression(expression);
    }

    requestAnimationFrame(detect);
  };

  detect();
};

export const stopDetection = () => {
  running = false;
};