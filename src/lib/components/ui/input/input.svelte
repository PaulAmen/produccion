<script>
  import { cn } from '$lib/utils';

  let { class: className = '', type = 'text', ...restProps } = $props();
</script>

<input
  class={cn(
    'flex min-h-10 w-full rounded-lg border border-[#cbd5cf] bg-[#fbfcfb] px-3 py-2 text-sm text-[#16231d] outline-none transition-colors placeholder:text-[#7b8a82] focus:border-[#17633e] disabled:cursor-not-allowed disabled:opacity-60 read-only:bg-[#eef2ef]',
    className
  )}
  {type}
  {...restProps}
/>
