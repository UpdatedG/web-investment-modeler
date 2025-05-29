
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
  
  // Calculate angle based on years (180° range, starting from -90° to 90°)
  const getAngleFromYears = (years: number) => {
    const normalizedYears = Math.max(0, Math.min(1, (years - minYears) / (maxYears - minYears)));
    return normalizedYears * 180 - 90; // -90° to 90°
  };
  
  const getYearsFromAngle = (angle: number) => {
    const normalizedAngle = Math.max(0, Math.min(1, (angle + 90) / 180));
    return Math.round(minYears + normalizedAngle * (maxYears - minYears));
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
    
    const newYears = getYearsFromAngle(angle);
    if (newYears !== value) {
      onChange(newYears);
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
          {/* Arc background */}
          <svg className="absolute inset-0 w-full h-full" viewBox="0 0 120 120">
            <path
              d="M 20 60 A 40 40 0 0 1 100 60"
              stroke="#e5e7eb"
              strokeWidth="3"
              fill="none"
            />
          </svg>
          
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
          
          {/* Year numbers positioned around the arc */}
          {[5, 10, 20, 30, 40].map((years) => {
            const markerAngle = getAngleFromYears(years);
            const radian = (markerAngle * Math.PI) / 180;
            const radius = 45;
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
          <div className="absolute top-1/2 left-1/2 w-3 h-3 bg-orange-600 rounded-full transform -translate-x-1/2 -translate-y-1/2 z-10 shadow-md"></div>
          
          {/* Dial pointer with arrow */}
          <div
            className="absolute origin-bottom z-20 transition-transform duration-75"
            style={{
              width: '2px',
              height: '45px',
              left: '50%',
              bottom: '50%',
              transform: `translateX(-50%) rotate(${currentAngle}deg)`,
              background: 'linear-gradient(to top, #ea580c, #f97316)',
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
                borderBottom: '8px solid #ea580c',
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
