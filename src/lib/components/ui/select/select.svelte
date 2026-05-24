<script>
  import { cn } from '$lib/utils';

  let { class: className = '', children, ...restProps } = $props();
</script>

<select
  class={cn(
    'flex min-h-10 w-full rounded-lg border border-[var(--border-light)] bg-[var(--bg-secondary)] px-3 py-2 text-sm text-[var(--text-primary)] outline-none transition-all duration-200 focus:border-[var(--border-focus)] focus:ring-2 focus:ring-[var(--border-focus)]/15 disabled:cursor-not-allowed disabled:opacity-50',
    className
  )}
  {...restProps}
>
  {@render children?.()}
</select>
