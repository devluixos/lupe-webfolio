<!-- src/routes/+layout.svelte -->
<script lang="ts">
  import Header from '../components/Header.svelte';
  import RadialMenu from '../components/RadialMenu.svelte';

  // Just a plain JS array—no need for MenuItem type here
  const menuData = [
    { label: 'Home',    link: '/' },
    {
      label: 'Projects',
      children: [
        { label: 'Alpha', link: '/projects/alpha' },
        { label: 'Beta',  link: '/projects/beta' }
      ]
    },
    { label: 'About',   link: '/about' },
    { label: 'Contact', link: '/contact' }
  ];
</script>

<style>
  :global(body) {
    margin: 0;
    background-color: #e6f4ea;
    font-family: system-ui, sans-serif;
  }
  .app-container {
    display: flex;
    flex-direction: column;
    min-height: 100vh;
  }
  main {
    flex: 1;
    padding: 1rem;
  }
</style>

<div class="app-container">
  <Header title="Retro Webfolio" />

  <!-- Pass the data via the `items` prop -->
  <RadialMenu
    items={menuData}
    size={400}
    innerRadius={120}
    outerRadius={180}
  />

  <main>
    <slot />
  </main>
</div>
