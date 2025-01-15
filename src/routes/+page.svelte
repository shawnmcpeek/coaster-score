<script>
    import { selectedCoasters } from '$lib/stores/coasters';
    import { user } from '$lib/stores/Auth.js';
    import { onMount } from 'svelte';
    import { getFirestore, collection, getDocs, query, where, doc, getDoc } from 'firebase/firestore';
    import '../styles.css'

    let coasters = [];
    let expandedSections = new Set();
    let userName = '';
    const db = getFirestore();

    onMount(async () => {
        console.log('Starting coaster fetch...');
        const coastersCollection = collection(db, 'coasters');
        const q = query(coastersCollection, where('status', '==', 'approved'));
        const querySnapshot = await getDocs(q);
        
        console.log('Query snapshot size:', querySnapshot.size);
        console.log('Raw Firestore data:', querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        
        coasters = querySnapshot.docs.map(doc => ({
            id: doc.id,
            Continent: doc.data().continent,
            Country: doc.data().country,
            Location: doc.data().location,
            coaster_name: doc.data().coaster_name
        }));
        
        console.log('Processed coasters:', coasters);
        console.log('Unique continents:', [...new Set(coasters.map(c => c.Continent))]);

        if ($user) {
            console.log('User is logged in, fetching user data...');
            const userDoc = await getDoc(doc(db, 'users', $user.uid));
            if (userDoc.exists()) {
                userName = userDoc.data().userName;
                console.log('Username:', userName);
            }
        }
    });

    $: {
        console.log('Reactive continents update:', continents);
        console.log('Current coasters length:', coasters.length);
    }

    // Rest of your code remains exactly the same
    $: continents = [...new Set(coasters.map(c => c.Continent))].sort();

    function getCountriesForContinent(continent) {
        return [...new Set(coasters
            .filter(c => c.Continent === continent)
            .map(c => c.Country))].sort();
    }

    function getLocationsForCountry(continent, country) {
        return [...new Set(coasters
            .filter(c => c.Continent === continent && c.Country === country)
            .map(c => c.Location))].sort();
    }

    function getCoastersForLocation(continent, country, location) {
        return coasters
            .filter(c =>
                c.Continent === continent &&
                c.Country === country &&
                c.Location === location)
            .sort((a, b) => a.coaster_name.localeCompare(b.coaster_name));
    }

    function getSelectedCoasterCountForContinent(continent) {
        return coasters
            .filter(c => c.Continent === continent && $selectedCoasters.has(c.id))
            .length;
    }

    function toggleCoaster(coaster, event) {
        event.stopPropagation();
        selectedCoasters.update(current => {
            const newSelected = new Set(current);
            if (newSelected.has(coaster.id)) {
                newSelected.delete(coaster.id);
            } else {
                newSelected.add(coaster.id);
            }
            localStorage.setItem('selectedCoasters', JSON.stringify([...newSelected]));
            return newSelected;
        });
    }

    function toggleSection(id) {
        expandedSections = new Set(expandedSections);
        if (expandedSections.has(id)) {
            expandedSections.delete(id);
        } else {
            expandedSections.add(id);
        }
    }

    function clearAllSelections() {
        if (confirm('Are you sure you want to clear all your coaster selections? This cannot be undone.')) {
            selectedCoasters.set(new Set());
            localStorage.removeItem('selectedCoasters');
        }
    }
</script>

<!-- Rest of your template code remains exactly the same -->
<div class="container">
    <h1 class="main-header">
        {#if $user && userName}
            Welcome, {userName}, to The Coaster Tracker!
        {:else}
            Welcome to The Coaster Tracker!
        {/if}
    </h1>

    <div class="instructions">
        <p>Please select the coasters you have ridden from the list below. Your total coaster count will be displayed.</p>
    </div>
    
    <div class="title-container">
        <h2 class="title">Total Coasters Ridden: {$selectedCoasters.size}</h2>
        <button class="danger-button" on:click={clearAllSelections}>
            Clear All Selections
        </button>
    </div>

    <div class="continent-grid">
        {#each continents as continent}
            <div class="continent-card">
                <button
                    class="section-button"
                    on:click={() => toggleSection(continent)}
                    aria-expanded={expandedSections.has(continent)}
                >
                    <span class="bold">
                        {continent} ({getSelectedCoasterCountForContinent(continent)} coasters)
                    </span>
                </button>

                {#if expandedSections.has(continent)}
                    {#each getCountriesForContinent(continent) as country}
                        <div class="indent">
                            <button
                                class="section-button"
                                on:click={() => toggleSection(`${continent}-${country}`)}
                                aria-expanded={expandedSections.has(`${continent}-${country}`)}
                            >
                                {country}
                            </button>

                            {#if expandedSections.has(`${continent}-${country}`)}
                                {#each getLocationsForCountry(continent, country) as location}
                                    <div class="indent">
                                        <button
                                            class="section-button"
                                            on:click={() => toggleSection(`${continent}-${country}-${location}`)}
                                            aria-expanded={expandedSections.has(`${continent}-${country}-${location}`)}
                                        >
                                            {location}
                                        </button>

                                        {#if expandedSections.has(`${continent}-${country}-${location}`)}
                                            {#each getCoastersForLocation(continent, country, location) as coaster}
                                                <button
                                                    class="coaster-button {$selectedCoasters.has(coaster.id) ? 'selected-coaster' : ''}"
                                                    on:click={(e) => toggleCoaster(coaster, e)}
                                                    aria-pressed={$selectedCoasters.has(coaster.id)}
                                                >
                                                    {coaster.coaster_name}
                                                </button>
                                            {/each}
                                        {/if}
                                    </div>
                                {/each}
                            {/if}
                        </div>
                    {/each}
                {/if}
            </div>
        {/each}
    </div>
</div>