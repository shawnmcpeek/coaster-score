<script>
    import { user, showAuthModal, logoutUser } from '$lib/stores/Auth.js';
    import AuthModal from '$lib/components/AuthModal.svelte';
    import { getFirestore, doc, updateDoc, getDoc } from 'firebase/firestore';
    import { selectedCoasters } from '$lib/stores/coasters';

    let isAdmin = false;
    export let currentPath;
    const db = getFirestore();
    let showMenu = false;

    // Check if user is admin when they log in
    $: if ($user) {
        console.log('Checking admin status for user:', $user.uid);
        getDoc(doc(db, 'users', $user.uid)).then(docSnap => {
            if (docSnap.exists()) {
                console.log('User data:', docSnap.data());
                isAdmin = docSnap.data().isAdmin === true;
                console.log('Is admin?', isAdmin);
            }
        });
    }

    async function saveCoasters() {
        if ($user) {
            try {
                await updateDoc(doc(db, 'users', $user.uid), {
                    selectedCoasters: Array.from($selectedCoasters),
                    coasterScore: $selectedCoasters.size
                });
                alert('Coaster selections saved!');
            } catch (error) {
                console.error('Error saving coasters:', error);
                alert('Error saving your selections. Please try again.');
            }
        }
    }

    function handleClickOutside(event) {
        if (showMenu && !event.target.closest('.menu-dropdown') && !event.target.closest('.menu-button')) {
            showMenu = false;
        }
    }
</script>

<svelte:window on:click={handleClickOutside} />

<header>
    <div class="header-content">
        <div class="left-section">
            {#if currentPath !== '/'}
                <a href="/" class="home-link">← Back to Coasters</a>
            {/if}
        </div>

        <h1>Coaster Score</h1>

        <div class="header-controls">
            {#if $user}
                <button class="save-button" on:click={saveCoasters}>
                    Save Score
                </button>
                <button class="menu-button" on:click={() => showMenu = !showMenu}>
                    Menu
                </button>
                {#if showMenu}
                    <div class="menu-dropdown">
                        <a href="/profile">Profile</a>
                        <div class="menu-item">Score: {$selectedCoasters?.size || 0}</div>
                        <a href="/contact">Contact & Support</a>
                        {#if isAdmin}
                            <a href="/admin/submissions">Review Submissions</a>
                        {/if}
                        <button class="sign-out-button" on:click={logoutUser}>Sign Out</button>
                    </div>
                {/if}
            {:else}
                <button class="login-button" on:click={() => $showAuthModal = true}>
                    Login to Save Score
                </button>
            {/if}
            <a 
                href="/submit" 
                class="support-button"
            >
                Submit a Coaster
            </a>
            <a 
                href="https://venmo.com/Shawn-McPeek-1"
                target="_blank" 
                rel="noopener noreferrer" 
                class="support-button"
            >
                Buy Me a Coffee ☕
            </a>
        </div>
    </div>
</header>

<AuthModal />

<style>
    header {
        padding: 1rem;
    }

    .header-content {
        max-width: 1200px;
        margin: 0 auto;
        display: grid;
        grid-template-columns: 1fr auto 1fr;
        align-items: center;
        gap: 1rem;
    }

    .left-section {
        justify-self: start;
    }

    h1 {
        color: #DC143C;
        text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.6);
        margin: 0;
        font-size: 2rem;
        text-align: center;
    }

    /* Menu dropdown styles */
    .menu-dropdown {
        position: absolute;
        top: calc(100% + 0.5rem);
        right: 0;
        background: white;
        border-radius: 0.5rem;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        padding: 0;
        min-width: 200px;
        z-index: 50;
        overflow: hidden;
    }

    .menu-dropdown a,
    .menu-dropdown button,
    .menu-dropdown .menu-item {
        display: block;
        width: 100%;
        padding: 0.75rem 1rem;
        text-align: left;
        background: none;
        border: none;
        color: #333;
        text-decoration: none;
        cursor: pointer;
        font-size: 0.95rem;
    }

    .menu-dropdown a:hover,
    .menu-dropdown button:hover {
        background: #f3f4f6;
    }

    .menu-item {
        font-weight: 500;
        color: #666;
        cursor: default;
    }

    .sign-out-button {
        color: #dc2626 !important;
    }

    .home-link {
        color: white;
        text-decoration: none;
        padding: 0.5rem 1rem;
        border-radius: 0.25rem;
        transition: background-color 0.2s;
        background: rgba(0, 0, 0, 0.2);
    }

    .home-link:hover {
        background: rgba(0, 0, 0, 0.3);
    }
</style>