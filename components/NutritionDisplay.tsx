import React from 'react';
import { NutritionData } from '../types';
import { MacroChart } from './MacroChart';

interface NutritionDisplayProps {
  data: NutritionData;
  onReset: () => void;
}

export const NutritionDisplay: React.FC<NutritionDisplayProps> = ({ data, onReset }) => {
  if (!data.is_food) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-xl p-8 text-center shadow-sm max-w-md mx-auto mt-6">
        <div className="text-4xl mb-4">🚫</div>
        <h3 className="text-xl font-bold text-red-800 mb-2">ไม่พบอาหารในรูปภาพ</h3>
        <p className="text-red-600 mb-6">ระบบไม่สามารถตรวจจับอาหารได้ กรุณาอัปโหลดรูปอาหารที่ชัดเจน</p>
        <button
          onClick={onReset}
          className="px-6 py-2 bg-white text-red-600 border border-red-200 rounded-full font-medium hover:bg-red-50 transition-colors"
        >
          ลองใหม่อีกครั้ง
        </button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto bg-white rounded-3xl shadow-xl overflow-hidden mt-8 border border-gray-100">
      <div className="md:flex">
        {/* Left Side: Summary & Chart */}
        <div className="md:w-1/2 p-6 md:p-8 bg-gray-50 flex flex-col justify-center items-center">
           <h2 className="text-3xl font-bold text-gray-800 mb-2 text-center">{data.food_name}</h2>
           <div className="text-5xl font-extrabold text-green-600 mb-6">
             {data.calories} <span className="text-lg font-medium text-gray-500">kcal</span>
           </div>
           
           <MacroChart protein={data.protein} carbs={data.carbs} fat={data.fat} />
        </div>

        {/* Right Side: Details & Description */}
        <div className="md:w-1/2 p-6 md:p-8 flex flex-col justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-700 mb-4 border-b pb-2">ข้อมูลทางโภชนาการ</h3>
            
            <div className="space-y-4 mb-8">
              <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                  <span className="font-medium text-gray-700">โปรตีน</span>
                </div>
                <span className="font-bold text-blue-700">{data.protein}g</span>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  <span className="font-medium text-gray-700">คาร์โบไฮเดรต</span>
                </div>
                <span className="font-bold text-green-700">{data.carbs}g</span>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-amber-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                  <span className="font-medium text-gray-700">ไขมัน</span>
                </div>
                <span className="font-bold text-amber-700">{data.fat}g</span>
              </div>
            </div>

            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-700 mb-2">คำแนะนำจากนักโภชนาการ</h3>
              <p className="text-gray-600 leading-relaxed bg-white p-4 rounded-xl border border-gray-100 italic">
                "{data.description}"
              </p>
            </div>
          </div>

          <button
            onClick={onReset}
            className="w-full py-3 bg-gray-900 text-white rounded-xl font-semibold hover:bg-gray-800 transition-all transform active:scale-95 shadow-lg"
          >
            วิเคราะห์รูปใหม่
          </button>
        </div>
      </div>
    </div>
  );
};