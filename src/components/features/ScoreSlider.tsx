import { useState } from 'react';
import { motion } from 'framer-motion';

interface ScoreSliderProps {
  label?: string;
  value: number;
  max?: number;
  min?: number;
  step?: number;
  onChange: (value: number) => void;
  color?: string;
  showValue?: boolean;
}

export function ScoreSlider({
  label,
  value,
  max = 50,
  min = 0,
  step = 1,
  onChange,
  color = '#d4af37',
  showValue = true,
}: ScoreSliderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const percentage = ((value - min) / (max - min)) * 100;

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-2">
        {label && <label className="text-sm text-gray-300">{label}</label>}
        {showValue && (
          <motion.span
            key={value}
            initial={{ scale: 1.2 }}
            animate={{ scale: 1 }}
            className="text-lg font-bold"
            style={{ color }}
          >
            {value}
          </motion.span>
        )}
      </div>
      <div className="relative h-2">
        <div className="absolute inset-0 bg-gray-700 rounded-full" />
        <motion.div
          className="absolute inset-y-0 left-0 rounded-full"
          style={{ backgroundColor: color }}
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.3 }}
        />
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          onMouseDown={() => setIsDragging(true)}
          onMouseUp={() => setIsDragging(false)}
          onTouchStart={() => setIsDragging(true)}
          onTouchEnd={() => setIsDragging(false)}
          className="absolute inset-0 w-full opacity-0 cursor-pointer"
        />
        <motion.div
          className="absolute top-1/2 -translate-y-1/2 w-5 h-5 rounded-full border-2 shadow-lg cursor-pointer"
          style={{
            left: `calc(${percentage}% - 10px)`,
            borderColor: color,
            backgroundColor: isDragging ? color : '#1a1a2e',
            boxShadow: isDragging ? `0 0 20px ${color}80` : 'none',
          }}
          animate={{ scale: isDragging ? 1.2 : 1 }}
        />
      </div>
      <div className="flex justify-between mt-1 text-xs text-gray-500">
        <span>{min}</span>
        <span>{max}</span>
      </div>
    </div>
  );
}
