<!-- src/lib/components/RadialMenu.svelte -->
<script lang="ts">
  // 1) Declare the MenuItem type locally
  type MenuItem = {
    label: string;
    link?: string;
    children?: MenuItem[];
  };

  // 2) Props
  export let items: MenuItem[] = [];
  export let size = 300;
  export let innerRadius = 100;
  export let outerRadius = 140;

  // 3) Center coordinates
  const cx = size / 2;
  const cy = size / 2;

  // 4) Compute slice angle
  const count = items.length;
  const sliceAngle = count > 0 ? 360 / count : 0;

  // 5) Helper: polar → Cartesian
  function polarToCartesian(r: number, angleDeg: number) {
    const rad = (angleDeg - 90) * Math.PI / 180;
    return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
  }

  // 6) Precompute main slices
  $: mainSlices = items.map((item, i) => {
    const start = i * sliceAngle;
    const end   = start + sliceAngle;
    const mid   = start + sliceAngle / 2;
    const labelPos = polarToCartesian(innerRadius * 0.65, mid);
    return { item, start, end, labelPos, index: i };
  });

  // 7) Precompute sub-slices
  $: subSlices = items.map((item, i) => {
    if (!item.children) return [];
    const step = sliceAngle / item.children.length;
    return item.children.map((sub, j) => {
      const start = i * sliceAngle + j * step;
      const end   = start + step;
      const mid   = start + step / 2;
      const labelPos = polarToCartesian(outerRadius * 0.75, mid);
      return { sub, start, end, labelPos, parent: i };
    });
  });

  // 8) Interaction state
  let hovered: number | null = null;
  let focused: number | null = null;

  // 9) Keyboard nav on the <svg> container
  function handleKeydown(event: KeyboardEvent) {
    if (!count) return;
    if (event.key === 'ArrowRight') {
      focused = focused === null ? 0 : (focused + 1) % count;
      hovered = null;
      event.preventDefault();
    }
    if (event.key === 'ArrowLeft') {
      focused = focused === null ? count - 1 : (focused - 1 + count) % count;
      hovered = null;
      event.preventDefault();
    }
  }

  // 10) Activate a link on Enter/Space or click
  function activate(link?: string) {
    if (link) location.href = link;
  }
</script>

<svg
  width={size}
  height={size}
  viewBox={`0 0 ${size} ${size}`}
  role="menu"
  tabindex="0"
  on:keydown={handleKeydown}
  on:mouseleave={() => { hovered = null; focused = null; }}
>
  <!-- INNER RING -->
  {#each mainSlices as { item, start, end, labelPos, index }}
    <path
      d={`
        M ${polarToCartesian(innerRadius, end).x} ${polarToCartesian(innerRadius, end).y}
        A ${innerRadius} ${innerRadius} 0 ${end - start > 180 ? 1 : 0} 0
          ${polarToCartesian(innerRadius, start).x} ${polarToCartesian(innerRadius, start).y}
        L ${cx} ${cy} Z
      `}
      class="slice main {(hovered === index || focused === index) ? 'active' : ''}"
      role="menuitem"
      tabindex={focused === index ? 0 : -1}
      aria-haspopup={item.children ? 'true' : undefined}
      aria-expanded={hovered === index ? 'true' : 'false'}
      on:mouseenter={() => { hovered = index; focused = null; }}
      on:focus={() => { focused = index; hovered = null; }}
      on:click={() => activate(item.link)}
      on:keydown={(e) => (e.key === 'Enter' || e.key === ' ') && activate(item.link)}
    />
    <text x={labelPos.x} y={labelPos.y}>{item.label}</text>
  {/each}

  <!-- OUTER RING (sub-menu) -->
  {#if hovered !== null && subSlices[hovered].length}
    {#each subSlices[hovered] as { sub, start, end, labelPos }}
      <path
        d={`
          M ${polarToCartesian(outerRadius, end).x} ${polarToCartesian(outerRadius, end).y}
          A ${outerRadius} ${outerRadius} 0 ${end - start > 180 ? 1 : 0} 0
            ${polarToCartesian(outerRadius, start).x} ${polarToCartesian(outerRadius, start).y}
          L ${cx} ${cy} Z
        `}
        class="slice sub"
        role="menuitem"
        tabindex="0"
        on:click={() => activate(sub.link)}
        on:keydown={(e) => (e.key === 'Enter' || e.key === ' ') && activate(sub.link)}
      />
      <text x={labelPos.x} y={labelPos.y}>{sub.label}</text>
    {/each}
  {/if}
</svg>

<style>
  svg {
    overflow: visible;
    outline: none;
  }
  .slice {
    fill: var(--slice-bg, #8ecae6);
    stroke: #023047;
    stroke-width: 2;
    transition: transform 0.2s, fill 0.2s;
    cursor: pointer;
  }
  .slice.main.active {
    fill: var(--slice-active, #219ebc);
    transform-origin: center;
    transform: scale(1.05);
  }
  .slice.sub {
    fill: var(--sub-bg, #ffb703);
  }
  text {
    font-family: sans-serif;
    font-size: 0.75rem;
    text-anchor: middle;
    dominant-baseline: middle;
    pointer-events: none;
  }
</style>
