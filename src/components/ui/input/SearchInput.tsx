import { cn } from '@/utils/helpers';
import { BiSearchAlt2 } from 'react-icons/bi';

interface SearchInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  className?: string;
}

const SearchInput: React.FC<SearchInputProps> = ({ className, ...props }) => {
  return (
    <div className={cn('relative flex items-center', className)}>
      <BiSearchAlt2 className="pointer-events-none absolute left-3.5 text-muted-foreground/40" size={18} />
      <input
        {...props}
        className="w-full rounded-full border border-white/10 bg-white/5 py-2.5 pl-10 pr-4 text-sm text-foreground/90 outline-none backdrop-blur-sm transition-all duration-300 placeholder:text-muted-foreground/30 hover:border-white/20 hover:bg-white/[0.07] focus:border-primary/50 focus:bg-white/5 focus:text-foreground focus:shadow-[0_0_20px_-5px_rgba(59,130,246,0.3)] focus:ring-1 focus:ring-primary/20"
      />
    </div>
  );
};

export default SearchInput;
