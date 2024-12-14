<script>
    import { showAuthModal, loginUser, registerUser, resetPassword } from '$lib/stores/auth';

    let isLogin = true;
    let email = '';
    let password = '';
    let error = '';

    async function handleSubmit(e) {
        e.preventDefault();
        error = '';

        const result = isLogin
            ? await loginUser(email, password)
            : await registerUser(email, password);

        if (!result.success) {
            error = result.error;
        }
    }

    async function handleForgotPassword() {
        if (!email) {
            error = 'Please enter your email address';
            return;
        }
        const result = await resetPassword(email);
        if (result.success) {
            alert('Password reset email sent! Check your inbox.');
        } else {
            error = result.error;
        }
    }
</script>

{#if $showAuthModal}
    <div class="modal-overlay">
        <div class="modal">
            <h2>{isLogin ? 'Login' : 'Sign Up'}</h2>

            {#if error}
                <div class="error">{error}</div>
            {/if}

            <form on:submit={handleSubmit}>
                <input
                        type="email"
                        placeholder="Email"
                        bind:value={email}
                        required
                />
                <input
                        type="password"
                        placeholder="Password"
                        bind:value={password}
                        required
                />
                <button type="submit">
                    {isLogin ? 'Login' : 'Sign Up'}
                </button>
            </form>

            {#if isLogin}
                <button
                        class="forgot-password"
                        on:click={handleForgotPassword}
                >
                    Forgot Password?
                </button>
            {/if}

            <button
                    class="toggle-auth"
                    on:click={() => isLogin = !isLogin}
            >
                {isLogin ? 'Need an account? Sign up' : 'Have an account? Login'}
            </button>

            <button
                    class="close-modal"
                    on:click={() => showAuthModal.set(false)}
            >
                ×
            </button>
        </div>
    </div>
{/if}

<style>
    .modal-overlay {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.5);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 1000;
    }

    .modal {
        background: white;
        padding: 2rem;
        border-radius: 0.5rem;
        width: 90%;
        max-width: 400px;
        position: relative;
    }

    .error {
        color: #dc2626;
        margin-bottom: 1rem;
        font-size: 0.875rem;
    }

    form {
        display: flex;
        flex-direction: column;
        gap: 1rem;
    }

    input {
        padding: 0.5rem;
        border: 1px solid #ddd;
        border-radius: 0.25rem;
    }

    button {
        padding: 0.5rem 1rem;
        border: none;
        border-radius: 0.25rem;
        cursor: pointer;
    }

    button[type="submit"] {
        background: #0066ff;
        color: white;
    }

    .forgot-password {
        margin-top: 0.5rem;
        background: none;
        color: #666;
        font-size: 0.9rem;
        text-decoration: underline;
        width: 100%;
        text-align: center;
    }

    .toggle-auth {
        margin-top: 1rem;
        background: none;
        color: #0066ff;
        width: 100%;
        text-align: center;
    }

    .close-modal {
        position: absolute;
        top: 0.5rem;
        right: 0.5rem;
        background: none;
        font-size: 1.5rem;
    }
</style>