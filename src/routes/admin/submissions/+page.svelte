<script>
    import { getFirestore, collection, query, where, updateDoc, doc, getDocs } from 'firebase/firestore';
    import { onMount } from 'svelte';
    import '../../../styles.css';

    const db = getFirestore();
    let submissions = [];
    let loading = true;
    let error = null;

    onMount(async () => {
        try {
            const q = query(collection(db, 'coasters'), where('status', '==', 'submitted'));
            const querySnapshot = await getDocs(q);
            submissions = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
                dateAdded: doc.data().dateAdded?.toDate()
            }));
            submissions.sort((a, b) => b.dateAdded - a.dateAdded);
        } catch (err) {
            error = 'Error loading submissions';
            console.error('Error:', err);
        } finally {
            loading = false;
        }
    });

    async function approveCoaster(coasterId) {
        try {
            await updateDoc(doc(db, 'coasters', coasterId), {
                status: 'approved'
            });
            
            // Remove from local list
            submissions = submissions.filter(s => s.id !== coasterId);
        } catch (err) {
            alert('Error approving coaster');
            console.error('Error:', err);
        }
    }

    async function rejectCoaster(coasterId) {
        if (confirm('Are you sure you want to reject this submission? This cannot be undone.')) {
            try {
                await updateDoc(doc(db, 'coasters', coasterId), {
                    status: 'rejected'
                });
                submissions = submissions.filter(s => s.id !== coasterId);
            } catch (err) {
                alert('Error rejecting coaster');
                console.error('Error:', err);
            }
        }
    }
</script>

<div class="container mx-auto p-4">
    <div class="content-wrapper">
        <h1 class="main-header">Review Submissions</h1>

        {#if loading}
            <div class="text-center">Loading submissions...</div>
        {:else if error}
            <div class="error-message">{error}</div>
        {:else if submissions.length === 0}
            <div class="text-center p-4">No pending submissions</div>
        {:else}
            <div class="grid gap-4">
                {#each submissions as submission}
                    <div class="bg-white p-4 rounded-lg shadow {submission.isNewPark ? 'border-2 border-yellow-400' : ''}">
                        <div class="flex justify-between items-start">
                            <div>
                                <h2 class="text-xl font-bold">{submission.coaster_name}</h2>
                                <div class="mt-2">
                                    <p><strong>Location:</strong> {submission.location}</p>
                                    <p><strong>Country:</strong> {submission.country}</p>
                                    <p><strong>Continent:</strong> {submission.continent}</p>
                                    {#if submission.submitter_email !== 'anonymous'}
                                        <p><strong>Submitter Email:</strong> {submission.submitter_email}</p>
                                    {/if}
                                    <p><strong>Submitted:</strong> {submission.dateAdded?.toLocaleString()}</p>
                                    {#if submission.isNewPark}
                                        <p class="text-yellow-600 font-bold mt-2">⚠️ New Park Submission</p>
                                    {/if}
                                </div>
                            </div>
                            <div class="flex gap-2">
                                <button
                                    class="primary-button"
                                    on:click={() => approveCoaster(submission.id)}
                                >
                                    Approve
                                </button>
                                <button
                                    class="danger-button"
                                    on:click={() => rejectCoaster(submission.id)}
                                >
                                    Reject
                                </button>
                            </div>
                        </div>
                    </div>
                {/each}
            </div>
        {/if}
    </div>
</div> 