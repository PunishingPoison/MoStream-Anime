import { Star } from '@/utils/icons';
import { cn } from '@/utils/helpers';

interface RatingProps {
  rate: number;
  count?: number;
}

const Rating: React.FC<RatingProps> = ({ rate, count }) => {
  const percentage = Math.round((rate / 10) * 100);
  const color = rate >= 7 ? 'text-success' : rate >= 5 ? 'text-warning' : 'text-danger';

  return (
    <div className="inline-flex items-center gap-1">
      <Star className={cn(color, 'drop-shadow-sm')} />
      <span className={cn('text-xs font-bold tracking-tight', color)}>{percentage}%</span>
      {count !== undefined && <span className="text-xs text-muted-foreground/60">({count.toLocaleString()})</span>}
    </div>
  );
};

export default Rating;
