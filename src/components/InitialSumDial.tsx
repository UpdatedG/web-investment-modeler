
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
    if (currentValue <= 10000) return { min: 500, max: 50000, step: 500 };
    if (currentValue <= 50000) return { min: 5000, max: 200000, step: 1000 };
    return { min: 20000, max: 500000, step: 5000 };
  };
  
  const range = getDynamicRange(value);
  
  // Calculate angle based on sum (300° range)
  const getAngleFromSum = (sum: number) => {
    const normalizedSum = Math.max(0, Math.min(1, (sum - range.min) / (range.max - range.min)));
    return 210 + normalizedSum * 300;
  };
  
  const getSumFromAngle = (angle: number) => {
    angle = ((angle % 360) + 360) % 360;
    if (angle < 210) angle += 360;
    if (angle > 510) angle = 510;
    if (angle < 210) angle = 210;
    
    const normalizedAngle = (angle - 210) / 300;
    const rawSum = range.min + normalizedAngle * (range.max - range.min);
    return Math.round(rawSum / range.step) * range.step;
  };
  
  const updateValue = (clientX: number, clientY: number) => {
    if (!dialRef.current) return;
    
    const rect = dialRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    const deltaX = clientX - centerX;
    const deltaY = clientY - centerY;
    
    let angle = Math.atan2(deltaY, deltaX) * (180 / Math.PI);
    angle = ((angle % 360) + 360) % 360;
    
    const newSum = getSumFromAngle(angle);
    if (newSum !== value) {
      onChange(newSum);
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
  
  const currentAngle = getAngleFromSum(value);
  const radius = 80;
  const strokeWidth = 8;
  const handleRadius = 12;
  
  const handleX = Math.cos((currentAngle - 90) * Math.PI / 180) * radius + 100;
  const handleY = Math.sin((currentAngle - 90) * Math.PI / 180) * radius + 100;
  
  const startAngle = 210;
  const endAngle = 510;
  const startX = Math.cos((startAngle - 90) * Math.PI / 180) * radius + 100;
  const startY = Math.sin((startAngle - 90) * Math.PI / 180) * radius + 100;
  const endX = Math.cos((endAngle - 90) * Math.PI / 180) * radius + 100;
  const endY = Math.sin((endAngle - 90) * Math.PI / 180) * radius + 100;
  
  const activeEndX = Math.cos((currentAngle - 90) * Math.PI / 180) * radius + 100;
  const activeEndY = Math.sin((currentAngle - 90) * Math.PI / 180) * radius + 100;
  
  const largeArcFlag = (currentAngle - startAngle) > 180 ? 1 : 0;
  
  const formatSum = (sum: number) => {
    if (sum >= 1000000) return `€${(sum/1000000).toFixed(1)}M`;
    if (sum >= 1000) return `€${(sum/1000).toFixed(0)}k`;
    return `€${sum}`;
  };
  
  return (
    <div className="flex flex-col items-center space-y-6">
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-green-100 mb-2">
          <Euro className="h-6 w-6 text-green-600" />
        </div>
        <p className="text-lg font-semibold text-gray-800">Pradinė suma</p>
        <p className="text-3xl font-bold text-green-600">{formatSum(value)}</p>
        <p className="text-sm text-gray-500">{formatSum(range.min)} - {formatSum(range.max)}</p>
      </div>
      
      <div 
        ref={dialRef}
        className="relative w-48 h-48 cursor-pointer select-none"
        onMouseDown={handleMouseDown}
      >
        <svg width="200" height="200" className="absolute inset-0">
          <path
            d={`M ${startX} ${startY} A ${radius} ${radius} 0 1 1 ${endX} ${endY}`}
            stroke="#e5e7eb"
            strokeWidth={strokeWidth}
            fill="none"
            strokeLinecap="round"
          />
          
          <path
            d={`M ${startX} ${startY} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${activeEndX} ${activeEndY}`}
            stroke="#10b981"
            strokeWidth={strokeWidth}
            fill="none"
            strokeLinecap="round"
          />
          
          <circle
            cx={handleX}
            cy={handleY}
            r={handleRadius}
            fill="white"
            stroke="#10b981"
            strokeWidth="3"
            className="cursor-grab active:cursor-grabbing drop-shadow-md"
          />
        </svg>
        
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center bg-white rounded-full w-20 h-20 flex items-center justify-center shadow-sm border">
            <span className="text-sm font-bold text-gray-700">{formatSum(value)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
