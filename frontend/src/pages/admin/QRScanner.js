import React, { useEffect, useRef, useState } from 'react';
import jsQR from 'jsqr';

const QRScanner = ({ onScan }) => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [isScanning, setIsScanning] = useState(false);

  useEffect(() => {
    const startWebcam = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play();
        }
      } catch (error) {
        console.error('Error accessing webcam:', error);
      }
    };

    startWebcam();

    return () => {
      // Stop webcam on component unmount
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

      // Draw video frame onto the canvas
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const code = jsQR(imageData.data, imageData.width, imageData.height);

      if (code) {
        console.log('QR Code detected:', code.data);
        onScan(code.data); // Pass scanned QR code data to the parent component
        setIsScanning(false);
      } else {
        // If no QR code is detected, keep scanning
        requestAnimationFrame(scanFrame);
      }
    }
  };

  const startScan = () => {
    setIsScanning(true);
    scanFrame();
  };

  return (
    <div>
      <video ref={videoRef} style={{ width: '100%', height: 'auto' }} />
      <canvas ref={canvasRef} style={{ display: 'none' }} />
      {!isScanning && <button onClick={startScan}>Start Scanning</button>}
      {isScanning && <p>Scanning for QR code...</p>}
    </div>
  );
};

export default QRScanner;
