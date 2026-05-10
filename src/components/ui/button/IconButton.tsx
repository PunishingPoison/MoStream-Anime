import { Button } from '@heroui/react';
import { cn } from '@/utils/helpers';

interface IconButtonProps {
  onPress?: () => void;
  size?: 'sm' | 'md' | 'lg';
  radius?: 'none' | 'sm' | 'md' | 'lg' | 'full';
  disableRipple?: boolean;
  icon: React.ReactNode;
  className?: string;
}

const IconButton: React.FC<IconButtonProps> = ({
  onPress,
  size = 'md',
  radius = 'md',
  disableRipple = false,
  icon,
  className,
}) => {
  return (
    <Button
      isIconOnly
      onPress={onPress}
      size={size}
      radius={radius}
      disableRipple={disableRipple}
      variant="light"
      className={cn('text-foreground', className)}
    >
      {icon}
    </Button>
  );
};

export default IconButton;
