
import React, { useState, useRef, useEffect } from 'react';
import { Euro } from 'lucide-react';

interface InitialSumDialProps {
  value: number;
  onChange: (value: number) => void;
}

export const InitialSumDial: React.FC<InitialSumDialProps> = ({ value, onChange }) => {
  const [isDragging, setIsDragging] = useState(false);
  const dialRef = useRef<HTMLDivElement>(null);
  
  // Dynamic range based on current value
  const getDynamicRange = (currentValue: number) => {
    if (currentValue <= 1000) return { min: 100, max: 2000, step: 50 };
    if (currentValue <= 5000) return { min: 500, max: 10000, step: 100 };
    if (currentValue <= 25000) return { min: 2000, max: 50000, step: 500 };
    if (currentValue <= 100000) return { min: 10000, max: 200000, step: 1000 };
    return { min: 50000, max: 500000, step: 5000 };
  };
  
  const range = getDynamicRange(value);
  
  // Calculate angle based on sum (180° range, starting from -90° to 90°)
  const getAngleFromSum = (sum: number) => {
    const normalizedSum = Math.max(0, Math.min(1, (sum - range.min) / (range.max - range.min)));
    return normalizedSum * 180 - 90; // -90° to 90°
  };
  
  const getSumFromAngle = (angle: number) => {
    const normalizedAngle = Math.max(0, Math.min(1, (angle + 90) / 180));
    const rawSum = range.min + normalizedAngle * (range.max - range.min);
    return Math.round(rawSum / range.step) * range.step;
  };
  
  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
    updateValue(e.clientX, e.clientY);
  };
  
  const updateValue = (clientX: number, clientY: number) => {
    if (!dialRef.current) return;
    
    const rect = dialRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    const deltaX = clientX - centerX;
    const deltaY = clientY - centerY;
    
    // Calculate angle in degrees
    let angle = Math.atan2(deltaY, deltaX) * (180 / Math.PI);
    
    // Normalize to our range (-90° to 90°)
    if (angle > 90) angle = 90;
    if (angle < -90) angle = -90;
    
    const newSum = getSumFromAngle(angle);
    if (newSum !== value) {
      onChange(newSum);
    }
  };
  
  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging) return;
    updateValue(e.clientX, e.clientY);
  };
  
  const handleMouseUp = () => setIsDragging(false);
  
  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging]);
  
  const currentAngle = getAngleFromSum(value);
  const formatSum = (sum: number) => sum >= 1000 ? `${(sum/1000).toFixed(0)}k` : sum.toString();
  
  // Generate marker values based on current range
  const getMarkers = () => {
    const markers = [];
    const step = (range.max - range.min) / 4;
    for (let i = 1; i <= 3; i++) {
      markers.push(Math.round((range.min + step * i) / range.step) * range.step);
    }
    return markers;
  };
  
  const markers = getMarkers();
  
  return (
    <div className="flex flex-col items-center space-y-4">
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-green-100 mb-2">
          <Euro className="h-6 w-6 text-green-600" />
        </div>
        <p className="text-lg font-semibold text-gray-800">Pradinė suma</p>
        <p className="text-2xl font-bold text-green-600">€{value.toLocaleString()}</p>
      </div>
      
      <div 
        ref={dialRef}
        className="relative w-48 h-48 cursor-grab active:cursor-grabbing select-none"
        onMouseDown={handleMouseDown}
      >
        {/* Outer ring */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-green-50 to-green-100 shadow-lg border-4 border-green-200"></div>
        
        {/* Inner dial face */}
        <div className="absolute inset-6 rounded-full bg-white shadow-inner border border-gray-100">
          {/* Arc background */}
          <svg className="absolute inset-0 w-full h-full" viewBox="0 0 120 120">
            <path
              d="M 20 60 A 40 40 0 0 1 100 60"
              stroke="#e5e7eb"
              strokeWidth="3"
              fill="none"
            />
          </svg>
          
          {/* Sum markers */}
          {markers.map((sum, index) => {
            const markerAngle = getAngleFromSum(sum);
            return (
              <div
                key={sum}
                className="absolute w-0.5 bg-green-300 origin-bottom"
                style={{
                  height: '15px',
                  left: '50%',
                  bottom: '50%',
                  transform: `translateX(-50%) rotate(${markerAngle}deg)`,
                }}
              />
            );
          })}
          
          {/* Sum numbers positioned around the arc */}
          {markers.map((sum) => {
            const markerAngle = getAngleFromSum(sum);
            const radian = (markerAngle * Math.PI) / 180;
            const radius = 45;
            const x = Math.cos(radian) * radius;
            const y = Math.sin(radian) * radius;
            
            return (
              <div
                key={`label-${sum}`}
                className="absolute text-xs font-bold text-green-600"
                style={{
                  left: `calc(50% + ${x}px - 12px)`,
                  top: `calc(50% + ${y}px - 6px)`,
                }}
              >
                €{formatSum(sum)}
              </div>
            );
          })}
          
          {/* Range indicators */}
          <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 text-xs text-gray-500">
            €{formatSum(range.min)} - €{formatSum(range.max)}
          </div>
          
          {/* Center dot */}
          <div className="absolute top-1/2 left-1/2 w-3 h-3 bg-green-600 rounded-full transform -translate-x-1/2 -translate-y-1/2 z-10 shadow-md"></div>
          
          {/* Dial pointer with arrow */}
          <div
            className="absolute origin-bottom z-20 transition-transform duration-75"
            style={{
              width: '2px',
              height: '45px',
              left: '50%',
              bottom: '50%',
              transform: `translateX(-50%) rotate(${currentAngle}deg)`,
              background: 'linear-gradient(to top, #059669, #10b981)',
            }}
          >
            {/* Arrow tip */}
            <div 
              className="absolute -top-1.5 left-1/2 transform -translate-x-1/2"
              style={{
                width: '0',
                height: '0',
                borderLeft: '4px solid transparent',
                borderRight: '4px solid transparent',
                borderBottom: '8px solid #059669',
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
