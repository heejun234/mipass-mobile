import { cn } from '@/lib/utils';

interface InputProps extends Omit<React.ComponentProps<'input'>, 'size'> {
  inputSize?: 'sm' | 'default';
  errorMessage?: string;
  Icon?: React.ReactNode;
  wrapperClassName?: string;
}

const Input = ({ className, type, inputSize = 'default', errorMessage, Icon, wrapperClassName, ...props }: InputProps) => {
  return (
    <div className={cn('w-full space-y-1', wrapperClassName)}>
      <div
        className={cn(
          'border-input flex w-full items-center gap-2 rounded-md border bg-transparent px-3 shadow-xs transition-[color,box-shadow]',
          'focus-within:border-ring focus-within:ring-ring/50 focus-within:ring-[3px]',
          'has-[input[aria-invalid=true]]:ring-destructive/20 dark:has-[input[aria-invalid=true]]:ring-destructive/40 has-[input[aria-invalid=true]]:border-destructive',
          'has-[input:disabled]:bg-neutral-200/50',
          errorMessage ? 'border-destructive' : '',
          inputSize === 'sm' ? 'h-9' : 'h-11',
          className
        )}
      >
        {Icon && <div className='text-muted-foreground shrink-0'>{Icon}</div>}
        <input
          type={type}
          data-slot='input'
          aria-invalid={errorMessage ? true : props['aria-invalid']}
          className={cn(
            'file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground text-md text-foreground flex-1 bg-transparent py-1 outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium read-only:pointer-events-none read-only:cursor-not-allowed read-only:opacity-50 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
            (type === 'date' || type === 'time' || type === 'datetime-local') && '[&::-webkit-calendar-picker-indicator]:cursor-pointer'
          )}
          {...props}
        />
      </div>
      {errorMessage ? (
        <p className='text-xs !text-red-500' aria-live='polite'>
          {errorMessage}
        </p>
      ) : null}
    </div>
  );
};

export default Input;
