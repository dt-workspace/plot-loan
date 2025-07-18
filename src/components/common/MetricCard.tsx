import React from 'react';
import { formatCurrency, formatPercentage, formatNumber } from '../../utils/calculations';

interface MetricCardProps {
  label: string;
  value: string | number;
  type?: 'currency' | 'percentage' | 'number' | 'text';
  compact?: boolean;
  className?: string;
  valueClassName?: string;
  icon?: string;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: number;
  description?: string;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  label,
  value,
  type = 'text',
  compact = false,
  className = '',
  valueClassName = '',
  icon,
  trend,
  trendValue,
  description
}) => {
  const formatValue = (val: string | number): string => {
    if (typeof val === 'string') return val;

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

  const getTrendColor = (trend: 'up' | 'down' | 'neutral') => {
    switch (trend) {
      case 'up':
        return 'text-green-600';
      case 'down':
        return 'text-red-600';
      case 'neutral':
        return 'text-gray-600';
      default:
        return 'text-gray-600';
    }
  };

  const getTrendIcon = (trend: 'up' | 'down' | 'neutral') => {
    switch (trend) {
      case 'up':
        return '↗️';
      case 'down':
        return '↘️';
      case 'neutral':
        return '→';
      default:
        return '';
    }
  };

  return (
    <div className={`metric-card ${className}`}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            {icon && <span className="text-lg">{icon}</span>}
            <span className="metric-label">{label}</span>
          </div>

          <div className={`metric-value ${valueClassName}`}>
            {formatValue(value)}
          </div>

          {description && (
            <p className="text-sm text-gray-500 mt-1">{description}</p>
          )}

          {trend && trendValue !== undefined && (
            <div className={`flex items-center gap-1 mt-2 text-sm ${getTrendColor(trend)}`}>
              <span>{getTrendIcon(trend)}</span>
              <span>{formatValue(trendValue)}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Specific metric card variants
export const CurrencyMetricCard: React.FC<Omit<MetricCardProps, 'type'>> = (props) => (
  <MetricCard {...props} type="currency" />
);

export const PercentageMetricCard: React.FC<Omit<MetricCardProps, 'type'>> = (props) => (
  <MetricCard {...props} type="percentage" />
);

export const NumberMetricCard: React.FC<Omit<MetricCardProps, 'type'>> = (props) => (
  <MetricCard {...props} type="number" />
);

// Grid layout for multiple metric cards
interface MetricGridProps {
  children: React.ReactNode;
  columns?: 1 | 2 | 3 | 4;
  className?: string;
}

export const MetricGrid: React.FC<MetricGridProps> = ({
  children,
  columns = 2,
  className = ''
}) => {
  const gridClass = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4'
  };

  return (
    <div className={`grid ${gridClass[columns]} gap-4 ${className}`}>
      {children}
    </div>
  );
};
