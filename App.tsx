import React, { useState, useRef, useCallback } from 'react';
import { analyzeFoodImage } from './services/geminiService';
import { AnalysisState } from './types';
import { NutritionDisplay } from './components/NutritionDisplay';
import { CameraCapture } from './components/CameraCapture';

const App: React.FC = () => {
  const [state, setState] = useState<AnalysisState>({
    isLoading: false,
    data: null,
    error: null,
    imagePreview: null,
  });
  const [showCamera, setShowCamera] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const processImage = async (base64String: string, mimeType: string) => {
    setState({
      isLoading: true,
      data: null,
      error: null,
      imagePreview: base64String,
    });
    setShowCamera(false); // Close camera if open

    try {
      // Extract base64 data (remove "data:image/jpeg;base64," prefix)
      const base64Data = base64String.split(',')[1];
      
      const result = await analyzeFoodImage(base64Data, mimeType);
      
      setState(prev => ({
        ...prev,
        isLoading: false,
        data: result,
      }));
    } catch (err: any) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: err.message || 'เกิดข้อผิดพลาดในการวิเคราะห์',
      }));
    }
  };

  const handleFileSelect = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Basic validation
    if (!file.type.startsWith('image/')) {
      setState(prev => ({ ...prev, error: 'กรุณาอัปโหลดไฟล์รูปภาพเท่านั้น' }));
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      processImage(base64String, file.type);
    };
    reader.readAsDataURL(file);
  }, []);

  const handleCameraCapture = (base64Image: string) => {
    // Camera capture is usually JPEG
    processImage(base64Image, 'image/jpeg');
  };

  const handleReset = () => {
    setState({
      isLoading: false,
      data: null,
      error: null,
      imagePreview: null,
    });
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 py-12 px-4 sm:px-6 lg:px-8">
      {/* Camera Modal */}
      {showCamera && (
        <CameraCapture 
          onCapture={handleCameraCapture} 
          onClose={() => setShowCamera(false)} 
        />
      )}

      {/* Header */}
      <div className="max-w-4xl mx-auto text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight mb-4">
          NutriScan <span className="text-green-600">AI</span>
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          ผู้ช่วยอัจฉริยะวิเคราะห์โภชนาการจากรูปภาพ เพียงถ่ายรูปอาหารของคุณ
          ให้ AI ช่วยคำนวณแคลอรี่และสารอาหาร
        </p>
      </div>

      <main className="max-w-4xl mx-auto">
        {state.error && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded shadow-sm" role="alert">
            <p className="font-bold">ข้อผิดพลาด</p>
            <p>{state.error}</p>
          </div>
        )}

        {!state.imagePreview && (
          <div className="bg-white rounded-3xl shadow-sm border-4 border-dashed border-gray-200 p-8 md:p-12">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileSelect}
              accept="image/*"
              className="hidden"
            />
            
            <div className="flex flex-col items-center justify-center space-y-6">
              <div className="p-4 bg-green-100 rounded-full">
                <svg className="w-12 h-12 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              
              <div className="text-center">
                <h3 className="text-2xl font-bold text-gray-800 mb-2">เริ่มการวิเคราะห์</h3>
                <p className="text-gray-500 mb-8">เลือกวิธีนำเข้ารูปภาพอาหารของคุณ</p>
                
                <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md mx-auto">
                  <button 
                    onClick={triggerFileInput}
                    className="flex-1 flex items-center justify-center gap-2 px-6 py-4 bg-white border-2 border-green-100 rounded-xl text-green-700 font-semibold hover:bg-green-50 hover:border-green-200 transition-all shadow-sm group"
                  >
                    <svg className="w-5 h-5 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                    อัปโหลดรูป
                  </button>
                  
                  <button 
                    onClick={() => setShowCamera(true)}
                    className="flex-1 flex items-center justify-center gap-2 px-6 py-4 bg-green-600 text-white rounded-xl font-semibold hover:bg-green-700 hover:shadow-lg hover:-translate-y-0.5 transition-all shadow-md"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /></svg>
                    ถ่ายรูปเลย
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {state.isLoading && (
          <div className="bg-white rounded-3xl p-12 text-center shadow-lg border border-gray-100 animate-pulse">
            <div className="w-24 h-24 mx-auto mb-6 relative">
               <div className="absolute inset-0 border-4 border-gray-200 rounded-full"></div>
               <div className="absolute inset-0 border-4 border-green-500 rounded-full border-t-transparent animate-spin"></div>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">กำลังวิเคราะห์...</h2>
            <p className="text-gray-500">AI กำลังคำนวณแคลอรี่และสารอาหารจากรูปภาพของคุณ</p>
            {state.imagePreview && (
              <img 
                src={state.imagePreview} 
                alt="Analyzing" 
                className="mt-6 mx-auto h-48 w-48 object-cover rounded-xl shadow-md opacity-50"
              />
            )}
          </div>
        )}

        {!state.isLoading && state.data && (
           <NutritionDisplay data={state.data} onReset={handleReset} />
        )}

        {/* Footer Credit */}
        <div className="mt-12 text-center text-sm text-gray-400">
          Powered by Gemini AI & React
        </div>
      </main>
    </div>
  );
};

export default App;