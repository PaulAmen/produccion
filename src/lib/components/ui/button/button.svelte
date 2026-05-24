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
    default: 'bg-[#17633e] text-white border-[#17633e] hover:bg-[#124f32]',
    outline: 'bg-white text-[#21322b] border-[#cad4ce] hover:bg-[#f7faf8]',
    ghost: 'bg-transparent text-[#21322b] border-transparent hover:bg-[#eef2ef]'
  };

  const sizes = {
    default: 'min-h-10 px-3',
    icon: 'h-10 w-10 p-0',
    smIcon: 'h-8 w-8 p-0'
  };
</script>

<button
  class={cn(
    'inline-flex items-center justify-center gap-2 rounded-lg border font-medium transition-colors disabled:pointer-events-none disabled:opacity-60',
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
