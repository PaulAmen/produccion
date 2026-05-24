<script>
  import { cn } from '$lib/utils';

  let { class: className = '', children, ...restProps } = $props();
</script>

<section
  class={cn(
    'rounded-xl border border-[var(--border-light)] bg-[var(--bg-secondary)] shadow-[var(--shadow-md)] overflow-hidden transition-all duration-300',
    className
  )}
  {...restProps}
>
  {@render children?.()}
</section>
