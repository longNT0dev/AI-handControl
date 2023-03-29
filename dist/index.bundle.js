(() => {
  const e = document.getElementsByClassName("input_video")[0],
    n = document.getElementsByClassName("output_canvas")[0],
    t = n.getContext("2d"),
    a = new Hands({
      locateFile: (e) => `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${e}`,
    });
  a.setOptions({
    maxNumHands: 2,
    modelComplexity: 1,
    minDetectionConfidence: 0.5,
    minTrackingConfidence: 0.5,
  }),
    a.onResults(function (e) {
      if (
        (t.save(),
        t.clearRect(0, 0, n.width, n.height),
        t.drawImage(e.image, 0, 0, n.width, n.height),
        e.multiHandLandmarks)
      )
        for (const n of e.multiHandLandmarks)
          drawConnectors(t, n, HAND_CONNECTIONS, {
            color: "#00FF00",
            lineWidth: 5,
          }),
            drawLandmarks(t, n, { color: "#FF0000", lineWidth: 2 });
      t.restore();
    }),
    new Camera(e, {
      onFrame: async () => {
        await a.send({ image: e });
      },
      width: 1280,
      height: 720,
    }).start();
})();
