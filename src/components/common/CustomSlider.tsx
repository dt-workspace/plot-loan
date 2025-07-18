import React, { useState, useEffect } from 'react';
import { formatCurrency, formatPercentage, formatNumber } from '../../utils/calculations';

interface CustomSliderProps {
  min: number;
  max: number;
  step?: number;
  value: number;
  onChange: (value: number) => void;
  label: string;
  formatter?: (value: number) => string;
  className?: string;
  disabled?: boolean;
  showValue?: boolean;
  valuePosition?: 'top' | 'right' | 'bottom';
  type?: 'currency' | 'percentage' | 'number';
  compact?: boolean;
}

export const CustomSlider: React.FC<CustomSliderProps> = ({
  min,
  max,
  step = 1,
  value,
  onChange,
  label,
  formatter,
  className = '',
  disabled = false,
  showValue = true,
  valuePosition = 'top',
  type = 'number',
  compact = false
}) => {
  const [internalValue, setInternalValue] = useState(value);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    setInternalValue(value);
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = parseFloat(e.target.value);
    setInternalValue(newValue);
    onChange(newValue);
  };

  const handleMouseDown = () => {
    setIsDragging(true);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const formatValue = (val: number): string => {
    if (formatter) {
      return formatter(val);
    }

    switch (type) {
      case 'currency':
        return formatCurrency(val, compact);
      case 'percentage':
        return formatPercentage(val);
      case 'number':
        return formatNumber(val);
      default:
        return val.toString();
    }
  };

  const getSliderProgress = () => {
    return ((internalValue - min) / (max - min)) * 100;
  };

  return (
    <div className={`slider-container ${className}`}>
      <div className="flex items-center justify-between mb-2">
        <label className="text-sm font-medium text-gray-700">
          {label}
        </label>
        {showValue && valuePosition === 'right' && (
          <span className="text-sm font-semibold text-primary-600">
            {formatValue(internalValue)}
          </span>
        )}
      </div>

      {showValue && valuePosition === 'top' && (
        <div className="slider-value mb-2">
          {formatValue(internalValue)}
        </div>
      )}

      <div className="relative">
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={internalValue}
          onChange={handleChange}
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
          disabled={disabled}
          className={`slider w-full ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
          style={{
            background: `linear-gradient(to right, #2563eb 0%, #2563eb ${getSliderProgress()}%, #e2e8f0 ${getSliderProgress()}%, #e2e8f0 100%)`
          }}
        />

        {/* Custom thumb indicator */}
        <div
          className={`absolute top-0 h-2 w-2 bg-primary-600 rounded-full transform -translate-y-1 -translate-x-1 transition-transform ${
            isDragging ? 'scale-125' : ''
          }`}
          style={{
            left: `${getSliderProgress()}%`,
            pointerEvents: 'none'
          }}
        />

        {/* Min/Max labels */}
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>{formatValue(min)}</span>
          <span>{formatValue(max)}</span>
        </div>
      </div>

      {showValue && valuePosition === 'bottom' && (
        <div className="text-center mt-2">
          <span className="text-sm font-semibold text-primary-600">
            {formatValue(internalValue)}
          </span>
        </div>
      )}
    </div>
  );
};

// Specific slider variants
export const CurrencySlider: React.FC<Omit<CustomSliderProps, 'type'>> = (props) => (
  <CustomSlider {...props} type="currency" />
);

export const PercentageSlider: React.FC<Omit<CustomSliderProps, 'type'>> = (props) => (
  <CustomSlider {...props} type="percentage" />
);

export const NumberSlider: React.FC<Omit<CustomSliderProps, 'type'>> = (props) => (
  <CustomSlider {...props} type="number" />
);

// Range slider for min/max values
interface RangeSliderProps {
  min: number;
  max: number;
  step?: number;
  minValue: number;
  maxValue: number;
  onChange: (minValue: number, maxValue: number) => void;
  label: string;
  className?: string;
  disabled?: boolean;
  type?: 'currency' | 'percentage' | 'number';
}

export const RangeSlider: React.FC<RangeSliderProps> = ({
  min,
  max,
  step = 1,
  minValue,
  maxValue,
  onChange,
  label,
  className = '',
  disabled = false,
  type = 'number'
}) => {
  const handleMinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newMin = parseFloat(e.target.value);
    if (newMin <= maxValue) {
      onChange(newMin, maxValue);
    }
  };

  const handleMaxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newMax = parseFloat(e.target.value);
    if (newMax >= minValue) {
      onChange(minValue, newMax);
    }
  };

  const formatValue = (val: number): string => {
    switch (type) {
      case 'currency':
        return formatCurrency(val, true);
      case 'percentage':
        return formatPercentage(val);
      case 'number':
        return formatNumber(val);
      default:
        return val.toString();
    }
  };

  return (
    <div className={`slider-container ${className}`}>
      <div className="flex items-center justify-between mb-2">
        <label className="text-sm font-medium text-gray-700">
          {label}
        </label>
        <span className="text-sm font-semibold text-primary-600">
          {formatValue(minValue)} - {formatValue(maxValue)}
        </span>
      </div>

      <div className="relative">
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={minValue}
          onChange={handleMinChange}
          disabled={disabled}
          className={`slider absolute w-full ${disabled ? 'opacity-50' : ''}`}
          style={{ zIndex: 1 }}
        />
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={maxValue}
          onChange={handleMaxChange}
          disabled={disabled}
          className={`slider absolute w-full ${disabled ? 'opacity-50' : ''}`}
          style={{ zIndex: 2 }}
        />

        <div className="flex justify-between text-xs text-gray-500 mt-4">
          <span>{formatValue(min)}</span>
          <span>{formatValue(max)}</span>
        </div>
      </div>
    </div>
  );
};
