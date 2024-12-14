<script>
    import { getFirestore, collection, addDoc } from 'firebase/firestore';
    import '../../styles.css'

    let message = '';
    let email = '';
    let name = '';
    let status = '';
    let isSubmitting = false;
    let showForm = false;

    async function handleSubmit(e) {
        e.preventDefault();
        isSubmitting = true;
        status = '';

        try {
            const db = getFirestore();
            await addDoc(collection(db, 'contact_messages'), {
                name,
                email,
                message,
                timestamp: new Date(),
                read: false
            });

            // Clear form
            name = '';
            email = '';
            message = '';
            status = 'Message sent successfully!';
            setTimeout(() => {
                showForm = false;
                status = '';
            }, 3000);
        } catch (error) {
            console.error('Error sending message:', error);
            status = 'Error sending message. Please try again.';
        } finally {
            isSubmitting = false;
        }
    }
</script>

<div class="container">
    <div class="content-wrapper">
        <section class="about-section">
            <h2>About This Site</h2>
            <div class="about-content">
                <p>I love riding coasters, and I am always amused when I hear other coaster fans talking about their "score" - how many coasters they've ridden.</p>
                <p>This site was created to help coaster enthusiasts keep track of their progress and share their scores with others.</p>
            </div>
        </section>

        <section class="contact-section">
            <h2>Contact</h2>
            <p>Did I miss a coaster? A park? Anything else?</p>

            {#if !showForm}
                <button class="contact-button" on:click={() => showForm = true}>
                    Contact Coaster Score
                </button>
            {:else}
                <form on:submit={handleSubmit} class="contact-form">
                    <div class="form-group">
                        <input
                                type="text"
                                bind:value={name}
                                required
                                placeholder="Your name"
                                id="name"
                                autocomplete="name"
                        />
                    </div>

                    <div class="form-group">
                        <input
                                type="email"
                                bind:value={email}
                                required
                                placeholder="Your email"
                                id="email"
                                autocomplete="email"
                        />
                    </div>

                    <div class="form-group">
                        <textarea
                                bind:value={message}
                                required
                                placeholder="Your message"
                                rows="4"
                                id="message"
                        ></textarea>
                    </div>

                    <div class="button-group">
                        <button
                                type="submit"
                                class="submit-button"
                                disabled={isSubmitting}
                        >
                            {isSubmitting ? 'Sending...' : 'Send Message'}
                        </button>
                        <button
                                type="button"
                                class="cancel-button"
                                on:click={() => showForm = false}
                        >
                            Cancel
                        </button>
                    </div>

                    {#if status}
                        <p class={status.includes('Error') ? 'error-message' : 'success-message'}>
                            {status}
                        </p>
                    {/if}
                </form>
            {/if}
        </section>

        <section class="support-section">
            <h2>Support This Project</h2>
            <p>If you find this site useful and would like to support its development, consider buying me a coffee!</p>

            <a href="https://venmo.com/Shawn-McPeek-1"
            target="_blank"
            rel="noopener noreferrer"
            class="support-button"
            >
            Buy Me a Coffee ☕
            </a>
        </section>
    </div>
</div>

