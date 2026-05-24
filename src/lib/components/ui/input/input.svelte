<script>
  import { cn } from '$lib/utils';

  let { class: className = '', type = 'text', ...restProps } = $props();
</script>

<input
  class={cn(
    'flex min-h-10 w-full rounded-lg border border-[var(--border-light)] bg-[var(--bg-secondary)] px-3.5 py-2 text-sm text-[var(--text-primary)] outline-none transition-all duration-200 placeholder:text-[var(--text-muted)] focus:border-[var(--border-focus)] focus:ring-2 focus:ring-[var(--border-focus)]/15 disabled:cursor-not-allowed disabled:opacity-50 read-only:bg-[var(--bg-tertiary)] read-only:text-[var(--text-secondary)] read-only:border-[var(--border-light)]',
    className
  )}
  {type}
  {...restProps}
/>
