<script>
  export let title = "My Site Title";
</script>

<style>
  header {
    background-color: #b8e0d2;
    padding: 0.75rem 1rem;
    display: flex;
    align-items: center;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  }

  .logo {
    font-weight: bold;
    font-size: 1.25rem;
  }

  nav {
    margin-left: auto;
  }

  nav a {
    margin-left: 1rem;
    text-decoration: none;
    color: #2a2a2a;
    font-size: 0.9rem;
  }
</style>

<header>
  <div class="logo">{title}</div>
  <nav>
    <!-- placeholder links -->
    <a href="/">Home</a>
    <a href="/projects">Projects</a>
    <a href="/about">About</a>
  </nav>
</header>
