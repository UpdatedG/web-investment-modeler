
import React, { useState, useRef, useEffect } from 'react';
import { User } from 'lucide-react';

interface AgeDialProps {
  value: number;
  onChange: (value: number) => void;
}

export const AgeDial: React.FC<AgeDialProps> = ({ value, onChange }) => {
  const [isDragging, setIsDragging] = useState(false);
  const dialRef = useRef<HTMLDivElement>(null);
  
  const minAge = 18;
  const maxAge = 80;
  
  // Calculate angle based on age (180° range, starting from -90° to 90°)
  const getAngleFromAge = (age: number) => {
    const normalizedAge = Math.max(0, Math.min(1, (age - minAge) / (maxAge - minAge)));
    return normalizedAge * 180 - 90; // -90° to 90°
  };
  
  const getAgeFromAngle = (angle: number) => {
    const normalizedAngle = Math.max(0, Math.min(1, (angle + 90) / 180));
    return Math.round(minAge + normalizedAngle * (maxAge - minAge));
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
    
    const newAge = getAgeFromAngle(angle);
    if (newAge !== value) {
      onChange(newAge);
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
  
  const currentAngle = getAngleFromAge(value);
  
  return (
    <div className="flex flex-col items-center space-y-4">
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-blue-100 mb-2">
          <User className="h-6 w-6 text-blue-600" />
        </div>
        <p className="text-lg font-semibold text-gray-800">Amžius</p>
        <p className="text-2xl font-bold text-blue-600">{value} metų</p>
      </div>
      
      <div 
        ref={dialRef}
        className="relative w-48 h-48 cursor-grab active:cursor-grabbing select-none"
        onMouseDown={handleMouseDown}
      >
        {/* Outer ring */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-blue-50 to-blue-100 shadow-lg border-4 border-blue-200"></div>
        
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
          
          {/* Age markers */}
          {[20, 30, 40, 50, 60, 70].map((age) => {
            const markerAngle = getAngleFromAge(age);
            const isQuarter = age % 20 === 0;
            return (
              <div
                key={age}
                className="absolute w-0.5 bg-blue-300 origin-bottom"
                style={{
                  height: isQuarter ? '20px' : '15px',
                  left: '50%',
                  bottom: '50%',
                  transform: `translateX(-50%) rotate(${markerAngle}deg)`,
                }}
              />
            );
          })}
          
          {/* Age numbers positioned around the arc */}
          {[20, 30, 40, 50, 60, 70].map((age) => {
            const markerAngle = getAngleFromAge(age);
            const radian = (markerAngle * Math.PI) / 180;
            const radius = 45;
            const x = Math.cos(radian) * radius;
            const y = Math.sin(radian) * radius;
            
            return (
              <div
                key={`label-${age}`}
                className="absolute text-xs font-bold text-blue-600"
                style={{
                  left: `calc(50% + ${x}px - 8px)`,
                  top: `calc(50% + ${y}px - 6px)`,
                }}
              >
                {age}
              </div>
            );
          })}
          
          {/* Center dot */}
          <div className="absolute top-1/2 left-1/2 w-3 h-3 bg-blue-600 rounded-full transform -translate-x-1/2 -translate-y-1/2 z-10 shadow-md"></div>
          
          {/* Dial pointer with arrow */}
          <div
            className="absolute origin-bottom z-20 transition-transform duration-75"
            style={{
              width: '2px',
              height: '45px',
              left: '50%',
              bottom: '50%',
              transform: `translateX(-50%) rotate(${currentAngle}deg)`,
              background: 'linear-gradient(to top, #2563eb, #3b82f6)',
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
                borderBottom: '8px solid #2563eb',
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
