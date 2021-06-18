import "./style.css";

const { innerHeight: height, innerWidth: width } = window;

// canvas Setup
const canvasElem = document.createElement("canvas");
canvasElem.width = width;
canvasElem.height = height;
const c = canvasElem.getContext("2d");
document.body.appendChild(canvasElem);

const main = async () => {
  let stream = null;

  try {
    stream = await navigator.mediaDevices.getUserMedia({
      audio: true,
      video: false,
    });
  } catch (err) {
    console.log(`USER_MEDIA_ERROR: ${err.message}`);
  }

  const audioCtx = new AudioContext();

  const analyser = audioCtx.createAnalyser();

  const source = audioCtx.createMediaStreamSource(stream);
  source.connect(analyser);

  const bufferLength = analyser.frequencyBinCount;
  const dataArray = new Uint8Array(bufferLength);

  c.clearRect(0, 0, width, height);

  const draw = () => {
    requestAnimationFrame(draw);
    analyser.getByteTimeDomainData(dataArray);

    c.fillStyle = `rgb(0,0,0)`;
    c.fillRect(0, 0, width, height);

    c.lineWidth = 1;
    c.strokeStyle = `rgb(255,255,255)`;
    c.beginPath();

    const sliceWidth = (width * 1.0) / bufferLength;
    let x = 0;

    for (let i = 0; i < bufferLength; i++) {
      const value = dataArray[i];

      const v = value / 128.0;
      const y = (v * height) / 2;

      if (i === 0) {
        c.moveTo(x, y);
      } else {
        c.lineTo(x, y);
      }

      x += sliceWidth;
    }
    c.lineTo(width, height / 2);
    c.stroke();
  };

  draw();
};

main();
