<script>
  import { cn } from '$lib/utils';

  let { class: className = '', children, ...restProps } = $props();
</script>

<label class={cn('block', className)} {...restProps}>
  {@render children?.()}
</label>
