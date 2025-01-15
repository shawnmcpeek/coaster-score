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
                <form on:submit|preventDefault={handleSubmit} class="space-y-4">
                    <div class="form-group">
                        <label for="contact_name">Name</label>
                        <input
                            type="text"
                            id="contact_name"
                            name="contact_name"
                            autocomplete="name"
                            bind:value={name}
                            class="form-input"
                            required
                        />
                    </div>

                    <div class="form-group">
                        <label for="contact_email">Email</label>
                        <input
                            type="email"
                            id="contact_email"
                            name="contact_email"
                            autocomplete="email"
                            bind:value={email}
                            class="form-input"
                            required
                        />
                    </div>

                    <div class="form-group">
                        <label for="contact_message">Message</label>
                        <textarea
                            id="contact_message"
                            name="contact_message"
                            autocomplete="off"
                            bind:value={message}
                            class="form-input"
                            rows="4"
                            required
                        ></textarea>
                    </div>

                    <button
                        type="submit"
                        id="contact_submit"
                        name="contact_submit"
                        disabled={isSubmitting}
                        class="primary-button"
                    >
                        {isSubmitting ? 'Sending...' : 'Send Message'}
                    </button>
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

