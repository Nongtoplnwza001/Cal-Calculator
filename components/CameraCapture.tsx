import React, { useRef, useEffect, useState } from 'react';

interface CameraCaptureProps {
  onCapture: (base64Image: string) => void;
  onClose: () => void;
}

export const CameraCapture: React.FC<CameraCaptureProps> = ({ onCapture, onClose }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    const startCamera = async () => {
      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'environment' } // Prefer back camera on mobile
        });
        
        if (mounted) {
          setStream(mediaStream);
          if (videoRef.current) {
            videoRef.current.srcObject = mediaStream;
          }
        } else {
          // If unmounted before stream loads, stop it immediately
          mediaStream.getTracks().forEach(track => track.stop());
        }
      } catch (err) {
        console.error("Error accessing camera:", err);
        if (mounted) {
          setError("ไม่สามารถเข้าถึงกล้องได้ กรุณาอนุญาตการใช้งานกล้องในเบราว์เซอร์");
        }
      }
    };

    startCamera();

    return () => {
      mounted = false;
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  // Cleanup stream when component unmounts or stream changes
  useEffect(() => {
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [stream]);

  const handleCapture = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      
      // Set canvas dimensions to match video
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      const context = canvas.getContext('2d');
      if (context) {
        // Flip horizontally if using front camera (optional, usually environment is back)
        // context.translate(canvas.width, 0);
        // context.scale(-1, 1);
        
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        
        // Convert to base64
        const base64Image = canvas.toDataURL('image/jpeg', 0.8);
        onCapture(base64Image);
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black flex flex-col items-center justify-center animate-fadeIn">
      {error ? (
        <div className="text-white text-center p-6 max-w-sm bg-gray-900 rounded-2xl mx-4">
          <div className="text-4xl mb-4">📷</div>
          <p className="mb-6 text-red-300 font-medium">{error}</p>
          <button 
            onClick={onClose} 
            className="px-6 py-2 bg-white text-gray-900 rounded-full font-bold hover:bg-gray-200 transition-colors"
          >
            ปิด
          </button>
        </div>
      ) : (
        <>
          <div className="relative w-full h-full flex items-center justify-center overflow-hidden bg-black">
            {!stream && (
               <div className="absolute inset-0 flex items-center justify-center z-10">
                 <div className="w-12 h-12 border-4 border-white/20 border-t-white rounded-full animate-spin"></div>
               </div>
            )}
            <video 
              ref={videoRef} 
              autoPlay 
              playsInline 
              muted
              className="absolute w-full h-full object-cover"
            />
          </div>
          
          {/* Controls Overlay */}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent pt-12 pb-10 px-6 flex justify-between items-center z-20">
             <button 
              onClick={onClose}
              className="p-3 rounded-full bg-white/10 text-white backdrop-blur-md hover:bg-white/20 transition-all border border-white/10"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
            
            <button 
              onClick={handleCapture}
              className="transform active:scale-95 transition-transform"
            >
              <div className="w-20 h-20 rounded-full border-4 border-white flex items-center justify-center p-1">
                 <div className="w-full h-full bg-white rounded-full"></div>
              </div>
            </button>
            
            <div className="w-12"></div> {/* Spacer for balance */}
          </div>
          
          <canvas ref={canvasRef} className="hidden" />
        </>
      )}
    </div>
  );
};