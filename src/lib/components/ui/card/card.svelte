<script>
  import { cn } from '$lib/utils';

  let { class: className = '', children, ...restProps } = $props();
</script>

<section
  class={cn(
    'rounded-lg border border-[#d7ded9] bg-white shadow-[0_12px_32px_rgba(21,32,28,0.08)]',
    className
  )}
  {...restProps}
>
  {@render children?.()}
</section>
