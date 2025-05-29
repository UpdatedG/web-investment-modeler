
import * as React from "react"
import * as SliderPrimitive from "@radix-ui/react-slider"
import { cn } from "@/lib/utils"

interface EnhancedSliderProps extends React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root> {
  colorScheme?: 'blue' | 'green' | 'purple' | 'orange';
  showSparkles?: boolean;
}

const EnhancedSlider = React.forwardRef<
  React.ElementRef<typeof SliderPrimitive.Root>,
  EnhancedSliderProps
>(({ className, colorScheme = 'blue', showSparkles = true, ...props }, ref) => {
  const [sparkles, setSparkles] = React.useState<Array<{ id: number; x: number; y: number; opacity: number }>>([]);
  
  const value = props.value?.[0] || 0;
  const min = props.min || 0;
  const max = props.max || 100;
  const percentage = ((value - min) / (max - min)) * 100;

  const getTrackColor = () => {
    switch (colorScheme) {
      case 'blue': return `linear-gradient(90deg, #3b82f6 0%, #1d4ed8 ${percentage}%, #e2e8f0 ${percentage}%, #e2e8f0 100%)`;
      case 'green': return `linear-gradient(90deg, #10b981 0%, #047857 ${percentage}%, #e2e8f0 ${percentage}%, #e2e8f0 100%)`;
      case 'purple': return `linear-gradient(90deg, #8b5cf6 0%, #6d28d9 ${percentage}%, #e2e8f0 ${percentage}%, #e2e8f0 100%)`;
      case 'orange': return `linear-gradient(90deg, #f97316 0%, #ea580c ${percentage}%, #e2e8f0 ${percentage}%, #e2e8f0 100%)`;
      default: return `linear-gradient(90deg, #3b82f6 0%, #1d4ed8 ${percentage}%, #e2e8f0 ${percentage}%, #e2e8f0 100%)`;
    }
  };

  const getThumbColor = () => {
    switch (colorScheme) {
      case 'blue': return percentage > 70 ? 'border-blue-600 bg-blue-500 shadow-blue-400' : 'border-blue-500 bg-blue-400 shadow-blue-300';
      case 'green': return percentage > 70 ? 'border-green-600 bg-green-500 shadow-green-400' : 'border-green-500 bg-green-400 shadow-green-300';
      case 'purple': return percentage > 70 ? 'border-purple-600 bg-purple-500 shadow-purple-400' : 'border-purple-500 bg-purple-400 shadow-purple-300';
      case 'orange': return percentage > 70 ? 'border-orange-600 bg-orange-500 shadow-orange-400' : 'border-orange-500 bg-orange-400 shadow-orange-300';
      default: return percentage > 70 ? 'border-blue-600 bg-blue-500 shadow-blue-400' : 'border-blue-500 bg-blue-400 shadow-blue-300';
    }
  };

  React.useEffect(() => {
    if (!showSparkles) return;
    
    const interval = setInterval(() => {
      if (Math.random() > 0.7) {
        const newSparkle = {
          id: Math.random(),
          x: Math.random() * 100,
          y: Math.random() * 20 + 40,
          opacity: 1
        };
        
        setSparkles(prev => [...prev, newSparkle]);
        
        setTimeout(() => {
          setSparkles(prev => prev.filter(s => s.id !== newSparkle.id));
        }, 1000);
      }
    }, 200);

    return () => clearInterval(interval);
  }, [showSparkles]);

  return (
    <div className="relative">
      <SliderPrimitive.Root
        ref={ref}
        className={cn(
          "relative flex w-full touch-none select-none items-center",
          className
        )}
        {...props}
      >
        <SliderPrimitive.Track 
          className="relative h-3 w-full grow overflow-hidden rounded-full"
          style={{ background: getTrackColor() }}
        >
          <SliderPrimitive.Range className="absolute h-full bg-transparent" />
        </SliderPrimitive.Track>
        <SliderPrimitive.Thumb 
          className={cn(
            "block h-6 w-6 rounded-full border-3 ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 shadow-lg hover:scale-110",
            getThumbColor()
          )}
        />
      </SliderPrimitive.Root>
      
      {showSparkles && sparkles.map(sparkle => (
        <div
          key={sparkle.id}
          className="absolute pointer-events-none animate-ping"
          style={{
            left: `${sparkle.x}%`,
            top: `${sparkle.y}%`,
            opacity: sparkle.opacity,
            animation: 'ping 1s cubic-bezier(0, 0, 0.2, 1)'
          }}
        >
          <div className={cn(
            "w-1 h-1 rounded-full",
            colorScheme === 'blue' && "bg-blue-400",
            colorScheme === 'green' && "bg-green-400", 
            colorScheme === 'purple' && "bg-purple-400",
            colorScheme === 'orange' && "bg-orange-400"
          )} />
        </div>
      ))}
    </div>
  )
})
EnhancedSlider.displayName = SliderPrimitive.Root.displayName

export { EnhancedSlider }
