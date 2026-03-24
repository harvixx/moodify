// src/features/home/utils/faceDetection.js
import {
  FaceLandmarker,
  FilesetResolver,
} from "@mediapipe/tasks-vision";

let faceLandmarker = null;
let running = false;

// ─────────────────────────────────────────────
// Emotion detection — blendshapes → scores
// ─────────────────────────────────────────────
const detectEmotion = (map) => {
  const smileScore = ((map.mouthSmileLeft || 0) + (map.mouthSmileRight || 0)) / 2;
  const frownScore = ((map.mouthFrownLeft || 0) + (map.mouthFrownRight || 0)) / 2;
  const browDown   = ((map.browDownLeft   || 0) + (map.browDownRight   || 0)) / 2;
  const eyeSquint  = ((map.eyeSquintLeft  || 0) + (map.eyeSquintRight  || 0)) / 2;

  // Extra sad signals
  const cheekSquint  = ((map.cheekSquintLeft  || 0) + (map.cheekSquintRight || 0)) / 2;
  const browInnerUp  =  map.browInnerUp  || 0; // sad mein bhaun upar jaati hai
  const jawForward   =  map.jawForward   || 0;
  const mouthClose   =  map.mouthClose   || 0;

  // Extra angry signals  
  const browDownFull = ((map.browDownLeft || 0) + (map.browDownRight || 0)) / 2;
  const noseSneer    = ((map.noseSneerLeft || 0) + (map.noseSneerRight || 0)) / 2;
  const mouthPress   = ((map.mouthPressLeft || 0) + (map.mouthPressRight || 0)) / 2;

  // ✅ Amplified scores — weak signals ko boost karo
  const scores = {
    happy:   smileScore * 1.0,

    // Sad — multiple signals combine karo + amplify
    sad:     Math.min(1, (frownScore * 2.5) + (browInnerUp * 1.5) + (cheekSquint * 0.5)),

    // Angry — browDown + noseSneer strong signal hai
    angry:   Math.min(1, (browDownFull * 2.0) + (noseSneer * 3.0) + (mouthPress * 1.0)),

    // Relaxed — eyeSquint subtle hota hai, boost karo
    relaxed: Math.min(1, eyeSquint * 2.0),

    // Neutral — sirf tab jab koi aur emotion strong na ho
    neutral: 0, // baad mein calculate karenge
  };

  // Neutral = koi emotion strong nahi
  const maxOther = Math.max(scores.happy, scores.sad, scores.angry, scores.relaxed);
  scores.neutral = Math.max(0, 0.3 - maxOther); // sirf tab jab sab low hain

  const sorted = Object.entries(scores)
    .sort((a, b) => b[1] - a[1])
    .map(([emotion, score]) => ({
      emotion,
      score: parseFloat(score.toFixed(3)),
    }));

  return {
    dominant:  sorted[0].emotion,
    topTwo: sorted.slice(0, 2),
    allScores: scores,
  }
}

// INIT — MediaPipe model load
// ─────────────────────────────────────────────
export const initFaceDetector = async () => {
  try {
    console.log("⏳ Loading MediaPipe model...");

    // ✅ jsDelivr CDN — npm package se directly
    const vision = await FilesetResolver.forVisionTasks(
      "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.3/wasm"
    );

    faceLandmarker = await FaceLandmarker.createFromOptions(vision, {
      baseOptions: {
        // ✅ Correct URL — no space
        modelAssetPath:
          "https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task",
        delegate: "GPU",
      },
      outputFaceBlendshapes: true,
      runningMode: "VIDEO",
      numFaces: 1,
    });

    console.log("✅ MediaPipe model loaded!");
  } catch (err) {
    console.error("❌ Face detector init failed:", err);

    // GPU fail hone par CPU fallback try karo
    try {
      console.log("⏳ Retrying with CPU...");

      const vision = await FilesetResolver.forVisionTasks(
        "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.3/wasm"
      );

      faceLandmarker = await FaceLandmarker.createFromOptions(vision, {
        baseOptions: {
          modelAssetPath:
            "https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task",
          delegate: "CPU", // ← GPU nahi chala toh CPU
        },
        outputFaceBlendshapes: true,
        runningMode: "VIDEO",
        numFaces: 1,
      });

      console.log("✅ MediaPipe loaded with CPU fallback!");
    } catch (cpuErr) {
      console.error("❌ CPU fallback also failed:", cpuErr);
      throw cpuErr;
    }
  }
};

// ─────────────────────────────────────────────
// START — camera + detection loop
// ─────────────────────────────────────────────
export const startDetection = async (videoRef, onEmotion) => {
  if (!faceLandmarker) {
    console.error("❌ Model not initialized — call initFaceDetector() first");
    throw new Error("Model not initialized");
  }

  const video = videoRef.current;

  // Camera stream lo
  const stream = await navigator.mediaDevices.getUserMedia({
    video: { facingMode: "user", width: 640, height: 480 },
  });

  video.srcObject = stream;

  // Video metadata load hone ka wait karo — phir play karo
  await new Promise((resolve, reject) => {
    video.onloadedmetadata = () => {
      video.play().then(resolve).catch(reject);
    };
    // Timeout fallback — 5s mein nahi aaya toh error
    setTimeout(() => reject(new Error("Video load timeout")), 5000);
  });

  running = true;
  console.log("✅ Detection started");

  // Detection loop
  const detect = () => {
    if (!running) return;

    try {
      const results = faceLandmarker.detectForVideo(video, Date.now());

      if (results.faceBlendshapes?.length > 0) {
        const blendShapes = results.faceBlendshapes[0].categories;

        const map = {};
        blendShapes.forEach((b) => {
          map[b.categoryName] = b.score;
        });

        const emotionData = detectEmotion(map);
        onEmotion(emotionData);
      }
    } catch (err) {
      console.warn("Detection frame error:", err);
    }

    requestAnimationFrame(detect);
  };

  detect();
};

// ─────────────────────────────────────────────
// STOP — camera band karo
// ─────────────────────────────────────────────
export const stopDetection = (videoRef) => {
  running = false;

  if (videoRef?.current?.srcObject) {
    videoRef.current.srcObject.getTracks().forEach((track) => track.stop());
    videoRef.current.srcObject = null;
  }

  console.log("🛑 Detection stopped");
};