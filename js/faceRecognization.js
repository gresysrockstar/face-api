var input = document.getElementById("myVideo");

Promise.all([
  faceapi.nets.tinyFaceDetector.loadFromUri("face-api/weights"),
  faceapi.nets.faceLandmark68Net.loadFromUri("face-api/weights"),
  faceapi.nets.faceRecognitionNet.loadFromUri("face-api/weights"),
  faceapi.nets.faceExpressionNet.loadFromUri("face-api/weights"),
  faceapi.nets.ssdMobilenetv1.loadFromUri("face-api/weights")
]).then(startVideo);

//

function startVideo() {
  navigator.getUserMedia(
    { video: {} },
    stream => (input.srcObject = stream),
    err => Console.error(err)
  );
}
//

input.addEventListener("play", () => {
  const canvas = faceapi.createCanvasFromMedia(input);
  document.body.append(canvas);
  const displaySize = { width: input.width, height: input.height };

  faceapi.matchDimensions(canvas, displaySize);

  //
  setInterval(async () => {
    const detections = await faceapi
      .detectAllFaces(input, new faceapi.TinyFaceDetectorOptions())
      .withFaceLandmarks()
      .withFaceExpressions();

    //
    canvas.getContext("2d").clearRect(0, 0, canvas.width, canvas.height);
    const resizedDetections = faceapi.resizeResults(detections, displaySize);
    //
    // faceapi.draw.drawDetections(canvas, resizedDetections);
    faceapi.draw.drawFaceLandmarks(canvas, resizedDetections);

    faceapi.draw.drawFaceExpressions(canvas, resizedDetections);
  }, 100);
});
