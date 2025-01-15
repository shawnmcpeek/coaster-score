<script>
    import { getFirestore, collection, addDoc, serverTimestamp } from 'firebase/firestore';
    import '../../styles.css';

    const db = getFirestore();
    let submitting = false;
    let submitStatus = '';

    // Form data
    let coaster_name = '';
    let continent = '';
    let country = '';
    let location = '';
    let submitter_email = ''; // Optional field for contact
    let isNewPark = false;

    const continents = [
        'North America',
        'South America',
        'Europe',
        'Asia',
        'Africa',
        'Australia',
        'Central America',
        'Oceania'
    ];

    async function handleSubmit() {
        if (!coaster_name || !continent || !country || !location) {
            submitStatus = 'Please fill in all required fields.';
            return;
        }

        submitting = true;
        submitStatus = '';

        try {
            await addDoc(collection(db, 'coasters'), {
                coaster_name: coaster_name.trim(),
                continent,
                country: country.trim(),
                location: location.trim(),
                status: 'submitted',
                dateAdded: serverTimestamp(),
                submitter_email: submitter_email.trim() || 'anonymous',
                isNewPark: isNewPark
            });

            // Clear form
            coaster_name = '';
            continent = '';
            country = '';
            location = '';
            submitter_email = '';
            isNewPark = false;
            
            submitStatus = 'Coaster submitted successfully! It will be reviewed by an admin.';
        } catch (error) {
            console.error('Error submitting coaster:', error);
            submitStatus = 'Error submitting coaster. Please try again.';
        } finally {
            submitting = false;
        }
    }
</script>

<div class="container mx-auto p-4">
    <div class="content-wrapper" style="max-width: 66%; margin: 0 auto;">
        <h1 class="main-header">Submit a Coaster</h1>
        
        <div class="bg-gray-100 p-4 rounded-lg mb-4">
            <p>Please provide accurate information about the coaster you'd like to add. 
               All submissions will be reviewed by an admin before being added to the database.</p>
        </div>

        <form on:submit|preventDefault={handleSubmit} class="space-y-4">
            <div class="form-group">
                <label for="coaster_name" class="block mb-2">Coaster Name *</label>
                <input
                    type="text"
                    id="coaster_name"
                    name="coaster_name"
                    autocomplete="off"
                    bind:value={coaster_name}
                    class="form-input"
                    required
                />
            </div>

            <div class="form-group">
                <label for="continent" class="block mb-2">Continent *</label>
                <select
                    id="continent"
                    name="continent"
                    autocomplete="off"
                    bind:value={continent}
                    class="form-input"
                    required
                >
                    <option value="">Select a continent</option>
                    {#each continents as c}
                        <option value={c}>{c}</option>
                    {/each}
                </select>
            </div>

            <div class="form-group">
                <label for="country" class="block mb-2">Country *</label>
                <input
                    type="text"
                    id="country"
                    name="country"
                    autocomplete="country-name"
                    bind:value={country}
                    class="form-input"
                    required
                />
            </div>

            <div class="form-group">
                <label for="location" class="block mb-2">Park Name *</label>
                <input
                    type="text"
                    id="location"
                    name="location"
                    autocomplete="off"
                    bind:value={location}
                    class="form-input"
                    required
                />
                <div class="mt-2">
                    <label class="inline-flex items-center">
                        <input
                            type="checkbox"
                            id="isNewPark"
                            name="isNewPark"
                            bind:checked={isNewPark}
                            class="form-checkbox"
                        />
                        <span class="ml-2">This is a new park not currently in the database</span>
                    </label>
                </div>
            </div>

            <div class="form-group">
                <label for="submitter_email" class="block mb-2">Your Email (Optional)</label>
                <input
                    type="email"
                    id="submitter_email"
                    name="submitter_email"
                    autocomplete="email"
                    bind:value={submitter_email}
                    class="form-input"
                    placeholder="In case we need to contact you about this submission"
                />
            </div>

            {#if submitStatus}
                <div class={submitStatus.includes('Error') ? 
                    'error-message' :
                    'success-message'}>
                    {submitStatus}
                </div>
            {/if}

            <button
                type="submit"
                id="submit_coaster"
                name="submit_coaster"
                disabled={submitting}
                class="primary-button"
            >
                {submitting ? 'Submitting...' : 'Submit Coaster'}
            </button>
        </form>
    </div>
</div> 