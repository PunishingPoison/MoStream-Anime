import { cn } from '@/utils/helpers';

interface SectionTitleProps {
  children: React.ReactNode;
  color?: 'primary' | 'warning' | 'foreground';
  className?: string;
}

const SectionTitle: React.FC<SectionTitleProps> = ({ children, color = 'primary', className }) => {
  return (
    <div className="flex items-center gap-3">
      <div className={cn('h-7 w-1 rounded-full md:h-8', {
        'bg-primary shadow-sm shadow-primary/50': color === 'primary',
        'bg-warning shadow-sm shadow-warning/50': color === 'warning',
        'bg-foreground': color === 'foreground',
      })} />
      <h3
        className={cn(
          'text-xl font-black tracking-tight md:text-2xl text-shadow',
          {
            'text-primary': color === 'primary',
            'text-warning': color === 'warning',
            'text-foreground': color === 'foreground',
          },
          className,
        )}
      >
        {children}
      </h3>
    </div>
  );
};

export default SectionTitle;
