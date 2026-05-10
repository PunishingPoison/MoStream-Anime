import { Button, ButtonGroup } from '@heroui/react';
import { cn } from '@/utils/helpers';

interface SelectButtonData {
  label: string;
  value: string;
  endContent?: React.ReactNode;
}

interface SelectButtonProps {
  color?: 'primary' | 'warning' | 'default';
  groupType?: 'list' | 'buttons';
  value: string;
  onChange: (value: string) => void;
  data: SelectButtonData[];
}

const SelectButton: React.FC<SelectButtonProps> = ({
  color = 'primary',
  groupType = 'buttons',
  value,
  onChange,
  data,
}) => {
  if (groupType === 'list') {
    return (
      <div className="flex flex-col gap-2">
        {data.map((item) => (
          <Button
            key={item.value}
            variant={value === item.value ? 'solid' : 'flat'}
            color={color}
            onPress={() => onChange(item.value)}
            className="justify-between"
            fullWidth
          >
            <span>{item.label}</span>
            {item.endContent}
          </Button>
        ))}
      </div>
    );
  }

  return (
    <ButtonGroup>
      {data.map((item) => (
        <Button
          key={item.value}
          variant={value === item.value ? 'solid' : 'flat'}
          color={color}
          onPress={() => onChange(item.value)}
        >
          {item.label}
        </Button>
      ))}
    </ButtonGroup>
  );
};

export default SelectButton;
