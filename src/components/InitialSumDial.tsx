
import React, { useState, useRef, useEffect } from 'react';
import { Euro } from 'lucide-react';

interface InitialSumDialProps {
  value: number;
  onChange: (value: number) => void;
}

export const InitialSumDial: React.FC<InitialSumDialProps> = ({ value, onChange }) => {
  const [isDragging, setIsDragging] = useState(false);
  const dialRef = useRef<HTMLDivElement>(null);
  
  const minSum = 100;
  const maxSum = 50000;
  
  // Calculate angle based on sum (0° to 300°, leaving 60° gap at bottom)
  const getAngleFromSum = (sum: number) => {
    // Use logarithmic scale for better distribution
    const logSum = Math.log(sum);
    const logMin = Math.log(minSum);
    const logMax = Math.log(maxSum);
    const normalizedSum = (logSum - logMin) / (logMax - logMin);
    return normalizedSum * 300 - 150; // -150° to 150°
  };
  
  const getSumFromAngle = (angle: number) => {
    const normalizedAngle = (angle + 150) / 300; // 0 to 1
    const logMin = Math.log(minSum);
    const logMax = Math.log(maxSum);
    const logSum = logMin + normalizedAngle * (logMax - logMin);
    return Math.round(Math.exp(logSum) / 50) * 50; // Round to nearest 50
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
    
    const newSum = getSumFromAngle(constrainedAngle);
    if (newSum >= minSum && newSum <= maxSum) {
      onChange(newSum);
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
  
  const currentAngle = getAngleFromSum(value);
  const formatSum = (sum: number) => sum >= 1000 ? `${(sum/1000).toFixed(0)}k` : sum.toString();
  
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
        className="relative w-48 h-48 cursor-pointer select-none"
        onMouseDown={handleMouseDown}
      >
        {/* Outer ring */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 shadow-lg"></div>
        
        {/* Inner dial face */}
        <div className="absolute inset-4 rounded-full bg-white shadow-inner">
          {/* Sum markers */}
          {[500, 1000, 5000, 10000, 25000].map((sum) => {
            const markerAngle = getAngleFromSum(sum);
            const isQuarter = [1000, 10000].includes(sum);
            return (
              <div
                key={sum}
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
          
          {/* Sum numbers */}
          {[500, 1000, 5000, 10000, 25000].map((sum) => {
            const markerAngle = getAngleFromSum(sum);
            const radian = (markerAngle * Math.PI) / 180;
            const radius = 65;
            const x = Math.cos(radian) * radius;
            const y = Math.sin(radian) * radius;
            
            return (
              <div
                key={`label-${sum}`}
                className="absolute text-xs font-medium text-gray-600"
                style={{
                  left: `calc(50% + ${x}px - 12px)`,
                  top: `calc(50% + ${y}px - 6px)`,
                }}
              >
                €{formatSum(sum)}
              </div>
            );
          })}
          
          {/* Center dot */}
          <div className="absolute top-1/2 left-1/2 w-3 h-3 bg-green-600 rounded-full transform -translate-x-1/2 -translate-y-1/2 z-10"></div>
          
          {/* Dial pointer */}
          <div
            className="absolute w-1 bg-green-600 origin-bottom rounded-full z-20 transition-transform duration-150"
            style={{
              height: '60px',
              left: '50%',
              bottom: '50%',
              transform: `translateX(-50%) rotate(${currentAngle}deg)`,
            }}
          >
            <div className="absolute -top-2 -left-1 w-3 h-3 bg-green-600 rounded-full"></div>
          </div>
        </div>
      </div>
    </div>
  );
};
