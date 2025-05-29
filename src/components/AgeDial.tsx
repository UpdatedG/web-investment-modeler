
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
  
  // Calculate angle based on age (300° range, starting from 210° to 510° which is -150° to 150°)
  const getAngleFromAge = (age: number) => {
    const normalizedAge = Math.max(0, Math.min(1, (age - minAge) / (maxAge - minAge)));
    return 210 + normalizedAge * 300; // 210° to 510°
  };
  
  const getAgeFromAngle = (angle: number) => {
    // Normalize angle to 210-510 range
    angle = ((angle % 360) + 360) % 360; // Ensure positive angle
    if (angle < 210) angle += 360; // Handle wrap-around
    if (angle > 510) angle = 510;
    if (angle < 210) angle = 210;
    
    const normalizedAngle = (angle - 210) / 300;
    return Math.round(minAge + normalizedAngle * (maxAge - minAge));
  };
  
  const updateValue = (clientX: number, clientY: number) => {
    if (!dialRef.current) return;
    
    const rect = dialRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    const deltaX = clientX - centerX;
    const deltaY = clientY - centerY;
    
    let angle = Math.atan2(deltaY, deltaX) * (180 / Math.PI);
    angle = ((angle % 360) + 360) % 360; // Ensure positive angle
    
    const newAge = getAgeFromAngle(angle);
    if (newAge !== value && newAge >= minAge && newAge <= maxAge) {
      onChange(newAge);
    }
  };
  
  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
    updateValue(e.clientX, e.clientY);
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
  const radius = 80;
  const strokeWidth = 8;
  const handleRadius = 12;
  
  // Calculate handle position
  const handleX = Math.cos((currentAngle - 90) * Math.PI / 180) * radius + 100;
  const handleY = Math.sin((currentAngle - 90) * Math.PI / 180) * radius + 100;
  
  // Create arc path
  const startAngle = 210;
  const endAngle = 510;
  const startX = Math.cos((startAngle - 90) * Math.PI / 180) * radius + 100;
  const startY = Math.sin((startAngle - 90) * Math.PI / 180) * radius + 100;
  const endX = Math.cos((endAngle - 90) * Math.PI / 180) * radius + 100;
  const endY = Math.sin((endAngle - 90) * Math.PI / 180) * radius + 100;
  
  const activeEndX = Math.cos((currentAngle - 90) * Math.PI / 180) * radius + 100;
  const activeEndY = Math.sin((currentAngle - 90) * Math.PI / 180) * radius + 100;
  
  const largeArcFlag = (currentAngle - startAngle) > 180 ? 1 : 0;
  
  return (
    <div className="flex flex-col items-center space-y-6">
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-blue-100 mb-2">
          <User className="h-6 w-6 text-blue-600" />
        </div>
        <p className="text-lg font-semibold text-gray-800">Amžius</p>
        <p className="text-3xl font-bold text-blue-600">{value}</p>
        <p className="text-sm text-gray-500">metų</p>
      </div>
      
      <div 
        ref={dialRef}
        className="relative w-48 h-48 cursor-pointer select-none"
        onMouseDown={handleMouseDown}
      >
        <svg width="200" height="200" className="absolute inset-0">
          {/* Background arc */}
          <path
            d={`M ${startX} ${startY} A ${radius} ${radius} 0 1 1 ${endX} ${endY}`}
            stroke="#e5e7eb"
            strokeWidth={strokeWidth}
            fill="none"
            strokeLinecap="round"
          />
          
          {/* Active arc */}
          <path
            d={`M ${startX} ${startY} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${activeEndX} ${activeEndY}`}
            stroke="#3b82f6"
            strokeWidth={strokeWidth}
            fill="none"
            strokeLinecap="round"
          />
          
          {/* Handle */}
          <circle
            cx={handleX}
            cy={handleY}
            r={handleRadius}
            fill="white"
            stroke="#3b82f6"
            strokeWidth="3"
            className="cursor-grab active:cursor-grabbing drop-shadow-md"
          />
        </svg>
        
        {/* Center display */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center bg-white rounded-full w-16 h-16 flex items-center justify-center shadow-sm border">
            <span className="text-lg font-bold text-gray-700">{value}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
