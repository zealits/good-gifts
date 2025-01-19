import React, { useEffect, useRef, useState } from 'react';
import jsQR from 'jsqr';
import './QRScanner.css'; // Import the CSS file

const QRScanner = ({ onScan }) => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [isScanning, setIsScanning] = useState(false);

  useEffect(() => {
    const startWebcam = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (videoRef.current) {
          // Set the video source object only once
          videoRef.current.srcObject = stream;

          // Wait until the video metadata is loaded before playing
          videoRef.current.onloadedmetadata = () => {
            videoRef.current.play().catch((error) => {
              console.error('Error playing video:', error);
            });
          };
        }
      } catch (error) {
        console.error('Error accessing webcam:', error);
      }
    };

    startWebcam();

    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        const tracks = videoRef.current.srcObject.getTracks();
        tracks.forEach((track) => track.stop());
      }
    };
  }, []);

  const scanFrame = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const code = jsQR(imageData.data, imageData.width, imageData.height);

      if (code) {
        console.log('QR Code detected:', code.data);
        onScan(code.data);
        setIsScanning(false);
      } else {
        requestAnimationFrame(scanFrame);
      }
    }
  };

  const startScan = () => {
    setIsScanning(true);
    scanFrame();
  };

  return (
    <div className="main-container">
      <div className="scanner-container">
        <video ref={videoRef} autoPlay playsInline muted></video>
        <canvas ref={canvasRef} style={{ display: 'none' }} />
        {!isScanning && <button onClick={startScan}>Start Scanning</button>}
        {isScanning && <p>Scanning for QR code...</p>}
      </div>
    </div>
  );
};

export default QRScanner;
