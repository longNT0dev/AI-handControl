const videoElement = document.getElementsByClassName("input_video")[0];
const canvasElement = document.getElementsByClassName("output_canvas")[0];
const canvasCtx = canvasElement.getContext("2d");
const eventScroll = new Event("SCROLL_EVENT");


window.addEventListener("SCROLL_EVENT", () => {

});


function onResults(results) {
  canvasCtx.save();
  canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);
  canvasCtx.drawImage(
    results.image,
    0,
    0,
    canvasElement.width,
    canvasElement.height
  );
  if (results.multiHandLandmarks && results.multiHandLandmarks.length > 0) {
    // Get the landmarks for the first hand
    const landmarks = results.multiHandLandmarks[0];

    // Get the x and y coordinates for the index and middle fingers
    const indexFinger = landmarks[8];
    const middleFinger = landmarks[12];
    const xDiff = middleFinger.x - indexFinger.x;
    const yDiff = middleFinger.y - indexFinger.y;

    // Check if the fingers are close together horizontally
    if (Math.abs(xDiff) < 20) {
      // Check if the fingers are moving up or down
      if (yDiff < -0.04 && lastGesture !== "down") {
        console.log("User swiped down", { yDiff })
        lastGesture = "down";
        window.dispatchEvent(eventScroll)
      } else if (yDiff > 0.03 && lastGesture !== "up") {
        console.log("User swiped up", { yDiff })
        lastGesture = "up";
        window.dispatchEvent(eventScroll)
      }
    }
  }
  canvasCtx.restore();
}

const hands = new Hands({
  locateFile: (file) => {
    console.log(file)
    return `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`;
  },
});
hands.setOptions({
  maxNumHands: 2,
  modelComplexity: 1,
  minDetectionConfidence: 0.5,
  minTrackingConfidence: 0.5,
});
hands.onResults(onResults);

let lastGesture = null;
const camera = new Camera(videoElement, {
  onFrame: async () => {
    await hands.send({ image: videoElement });
  },
  width: 1280,
  height: 720,
});
camera.start();
