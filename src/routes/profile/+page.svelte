<script>
    import { user } from '$lib/stores/Auth.js';
    import { selectedCoasters } from '$lib/stores/coasters';
    import {getFirestore, doc, updateDoc, getDoc} from 'firebase/firestore';
    import { onMount } from 'svelte';
    import '../../styles.css'

    let userName = '';
    let isEditing = false;
    const db = getFirestore();

    onMount(async () => {
        if ($user) {
            const userDoc = await getDoc(doc(db, 'users', $user.uid));
            if (userDoc.exists()) {
                userName = userDoc.data().userName;
            }
        }
    });

    async function updateProfile() {
        if ($user) {
            try {
                await updateDoc(doc(db, 'users', $user.uid), {
                    userName
                });
                isEditing = false;
            } catch (error) {
                console.error('Error updating profile:', error);
                alert('Error updating profile. Please try again.');
            }
        }
    }
</script>

<div class="profile-container">
    <h1>Profile</h1>

    {#if $user}
        <div class="profile-section">
            <h2>Account Details</h2>
            <p>Email: {$user.email}</p>

            <div class="user-name-section">
                <h3>Username</h3>
                {#if isEditing}
                    <form on:submit|preventDefault={updateProfile}>
                        <div class="form-group">
                            <label for="profile_username">Username</label>
                            <input
                                type="text"
                                id="profile_username"
                                name="profile_username"
                                autocomplete="username"
                                bind:value={userName}
                                class="form-input"
                                required
                            />
                        </div>
                        <div class="button-group">
                            <button
                                type="submit"
                                id="save_profile"
                                name="save_profile"
                                class="primary-button"
                            >
                                Save Changes
                            </button>
                            <button
                                type="button"
                                id="cancel_edit"
                                name="cancel_edit"
                                class="cancel-button"
                                on:click={() => isEditing = false}
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                {:else}
                    <div class="display-name">
                        <p>{userName || 'No username set'}</p>
                        <button
                            class="edit-button"
                            id="edit_profile"
                            name="edit_profile"
                            on:click={() => isEditing = true}
                        >
                            Edit
                        </button>
                    </div>
                {/if}
            </div>
        </div>

        <div class="stats-section">
            <h2>Statistics</h2>
            <p>Total Coasters Ridden: {$selectedCoasters?.size || 0}</p>
            <!-- We can add more stats here later if needed -->
        </div>
    {:else}
        <p>Please log in to view your profile.</p>
    {/if}
</div>
