
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
  
  // Calculate angle based on age (0° to 300°, leaving 60° gap at bottom)
  const getAngleFromAge = (age: number) => {
    const normalizedAge = (age - minAge) / (maxAge - minAge);
    return normalizedAge * 300 - 150; // -150° to 150°
  };
  
  const getAgeFromAngle = (angle: number) => {
    const normalizedAngle = (angle + 150) / 300; // 0 to 1
    return Math.round(minAge + normalizedAngle * (maxAge - minAge));
  };
  
  const handleMouseDown = () => setIsDragging(true);
  
  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging || !dialRef.current) return;
    
    const rect = dialRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    const angle = Math.atan2(e.clientY - centerY, e.clientX - centerX) * (180 / Math.PI);
    
    // Constrain angle to valid range (-150° to 150°)
    let constrainedAngle = angle;
    if (angle > 150) constrainedAngle = 150;
    if (angle < -150) constrainedAngle = -150;
    
    const newAge = getAgeFromAngle(constrainedAngle);
    if (newAge >= minAge && newAge <= maxAge) {
      onChange(newAge);
    }
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
        className="relative w-48 h-48 cursor-pointer select-none"
        onMouseDown={handleMouseDown}
      >
        {/* Outer ring */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 shadow-lg"></div>
        
        {/* Inner dial face */}
        <div className="absolute inset-4 rounded-full bg-white shadow-inner">
          {/* Age markers */}
          {[20, 30, 40, 50, 60, 70].map((age) => {
            const markerAngle = getAngleFromAge(age);
            const isQuarter = age % 20 === 0;
            return (
              <div
                key={age}
                className="absolute w-0.5 bg-gray-300 origin-bottom"
                style={{
                  height: isQuarter ? '16px' : '12px',
                  left: '50%',
                  bottom: '50%',
                  transform: `translateX(-50%) rotate(${markerAngle}deg)`,
                }}
              />
            );
          })}
          
          {/* Age numbers */}
          {[20, 30, 40, 50, 60, 70].map((age) => {
            const markerAngle = getAngleFromAge(age);
            const radian = (markerAngle * Math.PI) / 180;
            const radius = 70;
            const x = Math.cos(radian) * radius;
            const y = Math.sin(radian) * radius;
            
            return (
              <div
                key={`label-${age}`}
                className="absolute text-xs font-medium text-gray-600"
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
          <div className="absolute top-1/2 left-1/2 w-3 h-3 bg-blue-600 rounded-full transform -translate-x-1/2 -translate-y-1/2 z-10"></div>
          
          {/* Dial pointer */}
          <div
            className="absolute w-1 bg-blue-600 origin-bottom rounded-full z-20 transition-transform duration-150"
            style={{
              height: '60px',
              left: '50%',
              bottom: '50%',
              transform: `translateX(-50%) rotate(${currentAngle}deg)`,
            }}
          >
            <div className="absolute -top-2 -left-1 w-3 h-3 bg-blue-600 rounded-full"></div>
          </div>
        </div>
      </div>
    </div>
  );
};
