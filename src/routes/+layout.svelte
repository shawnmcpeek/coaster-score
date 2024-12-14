<script>
    import Header from '$lib/Header.svelte';
    import { page } from '$app/stores';
</script>

<div class="app">
    <Header currentPath={$page.url.pathname} />
    <main>
        <slot />
    </main>
</div>

