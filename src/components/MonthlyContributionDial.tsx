
import React, { useState, useRef, useEffect } from 'react';
import { PiggyBank } from 'lucide-react';

interface MonthlyContributionDialProps {
  value: number;
  onChange: (value: number) => void;
}

export const MonthlyContributionDial: React.FC<MonthlyContributionDialProps> = ({ value, onChange }) => {
  const [isDragging, setIsDragging] = useState(false);
  const dialRef = useRef<HTMLDivElement>(null);
  
  const minContribution = 0;
  const maxContribution = 2000;
  const step = 25;
  
  // Calculate angle based on contribution (240° range, starting from -120° to 120°)
  const getAngleFromContribution = (contribution: number) => {
    const normalizedContribution = (contribution - minContribution) / (maxContribution - minContribution);
    return normalizedContribution * 240 - 120; // -120° to 120°
  };
  
  const getContributionFromAngle = (angle: number) => {
    const normalizedAngle = (angle + 120) / 240;
    const clampedAngle = Math.max(0, Math.min(1, normalizedAngle));
    const rawContribution = minContribution + clampedAngle * (maxContribution - minContribution);
    return Math.round(rawContribution / step) * step;
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
    
    const newContribution = getContributionFromAngle(angle);
    onChange(newContribution);
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
  
  const currentAngle = getAngleFromContribution(value);
  
  return (
    <div className="flex flex-col items-center space-y-4">
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-purple-100 mb-2">
          <PiggyBank className="h-6 w-6 text-purple-600" />
        </div>
        <p className="text-lg font-semibold text-gray-800">Mėnesinis įnašas</p>
        <p className="text-2xl font-bold text-purple-600">€{value}</p>
      </div>
      
      <div 
        ref={dialRef}
        className="relative w-48 h-48 cursor-grab active:cursor-grabbing select-none"
        onMouseDown={handleMouseDown}
      >
        {/* Outer ring */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-purple-50 to-purple-100 shadow-lg border-4 border-purple-200"></div>
        
        {/* Inner dial face */}
        <div className="absolute inset-6 rounded-full bg-white shadow-inner border border-gray-100">
          {/* Contribution markers */}
          {[0, 500, 1000, 1500, 2000].map((contribution) => {
            const markerAngle = getAngleFromContribution(contribution);
            const isQuarter = contribution === 1000;
            return (
              <div
                key={contribution}
                className="absolute w-0.5 bg-purple-300 origin-bottom"
                style={{
                  height: isQuarter ? '20px' : '15px',
                  left: '50%',
                  bottom: '50%',
                  transform: `translateX(-50%) rotate(${markerAngle}deg)`,
                }}
              />
            );
          })}
          
          {/* Contribution numbers */}
          {[0, 500, 1000, 1500, 2000].map((contribution) => {
            const markerAngle = getAngleFromContribution(contribution);
            const radian = (markerAngle * Math.PI) / 180;
            const radius = 55;
            const x = Math.cos(radian) * radius;
            const y = Math.sin(radian) * radius;
            
            return (
              <div
                key={`label-${contribution}`}
                className="absolute text-xs font-bold text-purple-600"
                style={{
                  left: `calc(50% + ${x}px - 12px)`,
                  top: `calc(50% + ${y}px - 6px)`,
                }}
              >
                €{contribution}
              </div>
            );
          })}
          
          {/* Center dot */}
          <div className="absolute top-1/2 left-1/2 w-4 h-4 bg-purple-600 rounded-full transform -translate-x-1/2 -translate-y-1/2 z-10 shadow-md"></div>
          
          {/* Dial pointer with arrow */}
          <div
            className="absolute w-1 bg-gradient-to-t from-purple-600 to-purple-500 origin-bottom rounded-full z-20 transition-transform duration-100"
            style={{
              height: '50px',
              left: '50%',
              bottom: '50%',
              transform: `translateX(-50%) rotate(${currentAngle}deg)`,
            }}
          >
            {/* Arrow tip */}
            <div className="absolute -top-1 -left-2 w-0 h-0 border-l-[6px] border-r-[6px] border-b-[10px] border-l-transparent border-r-transparent border-b-purple-600"></div>
          </div>
        </div>
      </div>
    </div>
  );
};
