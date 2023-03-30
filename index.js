// Create a new Holistic instance
// const holistic = new Holistic({
//   locateFile: (file) => {
//     return `https://cdn.jsdelivr.net/npm/@mediapipe/holistic/${file}`;
//   },
// });

// const videoElement = document.getElementsByClassName("input_video")[0];

// // Create a variable to track the last detected gesture
// let lastGesture = null;

// // Start the camera and attach it to a video element
// const camera = new Camera(videoElement, {
//   onFrame: async () => {
//     // Run the Holistic model on the video frame
//     const predictions = await holistic.estimateHands(videoElement);

//     // Check if there are any hands detected
//     if (predictions.multiHandLandmarks) {
//       // Get the landmarks for the first hand
//       const landmarks = predictions.multiHandLandmarks[0];

//       // Get the x and y coordinates for the index and middle fingers
//       const indexFinger = landmarks[8];
//       const middleFinger = landmarks[12];
//       const xDiff = middleFinger.x - indexFinger.x;
//       const yDiff = middleFinger.y - indexFinger.y;

//       // Check if the fingers are close together horizontally
//       if (Math.abs(xDiff) < 20) {
//         // Check if the fingers are moving up or down
//         if (yDiff > 0 && lastGesture !== 'down') {
//           lastGesture = 'down';
//           console.log('User swiped down');
//         } else if (yDiff < 0 && lastGesture !== 'up') {
//           lastGesture = 'up';
//           console.log('User swiped up');
//         }
//       }
//     }
//   },
//   width: 640,
//   height: 480,
// });

// // Start the camera
// camera.start();

const videoElement = document.getElementsByClassName("input_video")[0];
const canvasElement = document.getElementsByClassName("output_canvas")[0];
const canvasCtx = canvasElement.getContext("2d");

function onResults(results) {
  canvasCtx.save();
  canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);
  canvasCtx.drawImage(
    results.segmentationMask,
    0,
    0,
    canvasElement.width,
    canvasElement.height
  );

  // Only overwrite existing pixels.
  canvasCtx.globalCompositeOperation = "source-in";
  canvasCtx.fillStyle = "#00FF00";
  canvasCtx.fillRect(0, 0, canvasElement.width, canvasElement.height);

  // Only overwrite missing pixels.
  canvasCtx.globalCompositeOperation = "destination-atop";
  canvasCtx.drawImage(
    results.image,
    0,
    0,
    canvasElement.width,
    canvasElement.height
  );

  canvasCtx.globalCompositeOperation = "source-over";
  drawConnectors(canvasCtx, results.poseLandmarks, POSE_CONNECTIONS, {
    color: "#00FF00",
    lineWidth: 4,
  });
  drawLandmarks(canvasCtx, results.poseLandmarks, {
    color: "#FF0000",
    lineWidth: 2,
  });
  drawConnectors(canvasCtx, results.faceLandmarks, FACEMESH_TESSELATION, {
    color: "#C0C0C070",
    lineWidth: 1,
  });
  drawConnectors(canvasCtx, results.leftHandLandmarks, HAND_CONNECTIONS, {
    color: "#CC0000",
    lineWidth: 5,
  });
  drawLandmarks(canvasCtx, results.leftHandLandmarks, {
    color: "#00FF00",
    lineWidth: 2,
  });
  drawConnectors(canvasCtx, results.rightHandLandmarks, HAND_CONNECTIONS, {
    color: "#00CC00",
    lineWidth: 5,
  });
  drawLandmarks(canvasCtx, results.rightHandLandmarks, {
    color: "#FF0000",
    lineWidth: 2,
  });
  canvasCtx.restore();
}

const holistic = new Holistic({
  locateFile: (file) => {
    return `https://cdn.jsdelivr.net/npm/@mediapipe/holistic/${file}`;
  },
});

holistic.setOptions({
  modelComplexity: 1,
  smoothLandmarks: true,
  enableSegmentation: true,
  smoothSegmentation: true,
  refineFaceLandmarks: true,
  minDetectionConfidence: 0.5,
  minTrackingConfidence: 0.5,
});
holistic.onResults(onResults);

const camera = new Camera(videoElement, {
  onFrame: async () => {
    // await holistic.send({image: videoElement});
    const predictions = await holistic.estimateHands(videoElement);

    // Check if there are any hands detected
    if (predictions.multiHandLandmarks) {
      // Get the landmarks for the first hand
      const landmarks = predictions.multiHandLandmarks[0];

      // Get the x and y coordinates for the index and middle fingers
      const indexFinger = landmarks[8];
      const middleFinger = landmarks[12];
      const xDiff = middleFinger.x - indexFinger.x;
      const yDiff = middleFinger.y - indexFinger.y;

      // Check if the fingers are close together horizontally
      if (Math.abs(xDiff) < 20) {
        // Check if the fingers are moving up or down
        if (yDiff > 0 && lastGesture !== "down") {
          lastGesture = "down";
          console.log("User swiped down");
        } else if (yDiff < 0 && lastGesture !== "up") {
          lastGesture = "up";
          console.log("User swiped up");
        }
      }
    }
  },
  width: 1280,
  height: 720,
});
camera.start();
