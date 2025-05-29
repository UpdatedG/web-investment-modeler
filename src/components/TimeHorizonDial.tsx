
import React, { useState, useRef, useEffect } from 'react';
import { Clock } from 'lucide-react';

interface TimeHorizonDialProps {
  value: number;
  onChange: (value: number) => void;
}

export const TimeHorizonDial: React.FC<TimeHorizonDialProps> = ({ value, onChange }) => {
  const [isDragging, setIsDragging] = useState(false);
  const dialRef = useRef<HTMLDivElement>(null);
  
  const minYears = 1;
  const maxYears = 50;
  
  // Calculate angle based on years (240° range, starting from -120° to 120°)
  const getAngleFromYears = (years: number) => {
    const normalizedYears = (years - minYears) / (maxYears - minYears);
    return normalizedYears * 240 - 120; // -120° to 120°
  };
  
  const getYearsFromAngle = (angle: number) => {
    const normalizedAngle = (angle + 120) / 240;
    const clampedAngle = Math.max(0, Math.min(1, normalizedAngle));
    return Math.round(minYears + clampedAngle * (maxYears - minYears));
  };
  
  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };
  
  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging || !dialRef.current) return;
    
    const rect = dialRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    const deltaX = e.clientX - centerX;
    const deltaY = e.clientY - centerY;
    let angle = Math.atan2(deltaY, deltaX) * (180 / Math.PI);
    
    // Convert to our coordinate system and constrain
    if (angle < -120) angle = -120;
    if (angle > 120) angle = 120;
    
    const newYears = getYearsFromAngle(angle);
    onChange(newYears);
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
  
  const currentAngle = getAngleFromYears(value);
  
  return (
    <div className="flex flex-col items-center space-y-4">
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-orange-100 mb-2">
          <Clock className="h-6 w-6 text-orange-600" />
        </div>
        <p className="text-lg font-semibold text-gray-800">Investavimo laikotarpis</p>
        <p className="text-2xl font-bold text-orange-600">{value} {value === 1 ? 'metai' : 'metų'}</p>
      </div>
      
      <div 
        ref={dialRef}
        className="relative w-48 h-48 cursor-grab active:cursor-grabbing select-none"
        onMouseDown={handleMouseDown}
      >
        {/* Outer ring */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-orange-50 to-orange-100 shadow-lg border-4 border-orange-200"></div>
        
        {/* Inner dial face */}
        <div className="absolute inset-6 rounded-full bg-white shadow-inner border border-gray-100">
          {/* Year markers */}
          {[5, 10, 20, 30, 40].map((years) => {
            const markerAngle = getAngleFromYears(years);
            const isQuarter = years === 20;
            return (
              <div
                key={years}
                className="absolute w-0.5 bg-orange-300 origin-bottom"
                style={{
                  height: isQuarter ? '20px' : '15px',
                  left: '50%',
                  bottom: '50%',
                  transform: `translateX(-50%) rotate(${markerAngle}deg)`,
                }}
              />
            );
          })}
          
          {/* Year numbers */}
          {[5, 10, 20, 30, 40].map((years) => {
            const markerAngle = getAngleFromYears(years);
            const radian = (markerAngle * Math.PI) / 180;
            const radius = 55;
            const x = Math.cos(radian) * radius;
            const y = Math.sin(radian) * radius;
            
            return (
              <div
                key={`label-${years}`}
                className="absolute text-xs font-bold text-orange-600"
                style={{
                  left: `calc(50% + ${x}px - 8px)`,
                  top: `calc(50% + ${y}px - 6px)`,
                }}
              >
                {years}
              </div>
            );
          })}
          
          {/* Center dot */}
          <div className="absolute top-1/2 left-1/2 w-4 h-4 bg-orange-600 rounded-full transform -translate-x-1/2 -translate-y-1/2 z-10 shadow-md"></div>
          
          {/* Dial pointer with arrow */}
          <div
            className="absolute w-1 bg-gradient-to-t from-orange-600 to-orange-500 origin-bottom rounded-full z-20 transition-transform duration-100"
            style={{
              height: '50px',
              left: '50%',
              bottom: '50%',
              transform: `translateX(-50%) rotate(${currentAngle}deg)`,
            }}
          >
            {/* Arrow tip */}
            <div className="absolute -top-1 -left-2 w-0 h-0 border-l-[6px] border-r-[6px] border-b-[10px] border-l-transparent border-r-transparent border-b-orange-600"></div>
          </div>
        </div>
      </div>
    </div>
  );
};
