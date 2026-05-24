<script>
  import { cn } from '$lib/utils';

  let {
    class: className = '',
    variant = 'default',
    size = 'default',
    type = 'button',
    disabled = false,
    children,
    ...restProps
  } = $props();

  const variants = {
    default: 'bg-[var(--primary-color)] text-white border-[var(--primary-color)] hover:bg-[var(--primary-hover)] hover:shadow-md focus-visible:ring-2 focus-visible:ring-[var(--border-focus)]',
    outline: 'bg-[var(--bg-secondary)] text-[var(--text-primary)] border-[var(--border-light)] hover:bg-[var(--bg-tertiary)] hover:border-[var(--text-muted)] focus-visible:ring-2 focus-visible:ring-[var(--border-focus)]',
    ghost: 'bg-transparent text-[var(--text-primary)] border-transparent hover:bg-[var(--bg-tertiary)] focus-visible:ring-2 focus-visible:ring-[var(--border-focus)]'
  };

  const sizes = {
    default: 'min-h-10 px-4 py-2 text-sm',
    icon: 'h-10 w-10 p-0',
    smIcon: 'h-8 w-8 p-0'
  };
</script>

<button
  class={cn(
    'inline-flex items-center justify-center gap-2 rounded-lg border font-semibold tracking-wide transition-all duration-200 active:scale-[0.97] disabled:pointer-events-none disabled:opacity-50 select-none outline-none',
    variants[variant],
    sizes[size],
    className
  )}
  {type}
  {disabled}
  {...restProps}
>
  {@render children?.()}
</button>
