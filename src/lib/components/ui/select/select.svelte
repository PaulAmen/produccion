<script>
  import { cn } from '$lib/utils';

  let { class: className = '', children, ...restProps } = $props();
</script>

<select
  class={cn(
    'flex min-h-10 w-full rounded-lg border border-[#cbd5cf] bg-[#fbfcfb] px-3 py-2 text-sm text-[#16231d] outline-none transition-colors focus:border-[#17633e] disabled:cursor-not-allowed disabled:opacity-60',
    className
  )}
  {...restProps}
>
  {@render children?.()}
</select>
