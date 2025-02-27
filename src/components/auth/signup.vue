<template>
    <div class="signup-form">
        <div class="close-button">
            <img src="../../assets/icons/close.svg" alt="">
        </div>
        <div class="header">
            <div class="text-group">
                <h2>Create account</h2>
                <p>Already have an account? <a href="#">Login</a></p>
            </div>
        </div>

        <div class="social-auth">
            <button class="social-button">
                <img src="../../assets/icons/google.svg" alt="" class="icon">
                Continue with Google
            </button>
            <button class="social-button">
                <img src="../../assets/icons/phone.svg" alt="" class="icon"> Continue with Phone
            </button>
        </div>

        <div class="divider">
            <span>or</span>
        </div>

        <div class="div">
            <label class="left">Continue with Email</label>
            <input type="email" placeholder="Enter Email" />
        </div>

        <div class="checkbox-group">
            <input type="checkbox" id="terms" />
            <label for="terms">I agree to service and Privacy policy</label>
        </div>

        <button class="continue-button">Continue</button>
    </div>
</template>

<script setup>

</script>

<style scoped>
.signup-form {
    background: #fff;
    padding: 50px;
    border-radius: 12px;
    width: 100%;
    max-width: 522px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    text-align: left
}

.header {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 1rem;
}

.close-button {
    background: transparent;
    border: none;
    margin-bottom: 10px;
    font-size: 24px;
    cursor: pointer;
}

h2 {
    font-size: 24px;
    margin-bottom: 0.5rem;
    text-align: left;
}

.icon {
    margin-right: 10px;
}

.left {
    margin-bottom: 10px;
    font-weight: 600;
}

p {
    text-align: left;
    color: #555;
    font-size: 16px;
    margin-bottom: 1.5rem;
}

a {
    color: #000;
    font-weight: bold;
    text-decoration: none;
}

.social-button {
    width: 100%;
    padding: 0.8rem;
    margin-bottom: 1rem;
    border: 1px solid rgba(146, 146, 146, 0.60);
    border-radius: 5px;
    background: #fff;
    font-size: 14px;
    font-weight: 600;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
}

.social-button svg {
    margin-right: 8px;
}

.divider {
    display: flex;
    align-items: center;
    text-align: center;
    color: #888;
    margin: 1rem 0;
    margin-bottom: 30px;
    margin-top: 30px;
}

.divider::before,
.divider::after {
    content: "";
    flex: 1;
    border-bottom: 1px solid #ccc;
}

.divider:not(:empty)::before {
    margin-right: .25em;
}

.divider:not(:empty)::after {
    margin-left: .25em;
}

input[type="email"] {
    width: 100%;
    padding: 0.8rem;
    margin: 0.5rem 0 1rem;
    border: 1px solid #ccc;
    border-radius: 6px;
    box-sizing: border-box;
}

.checkbox-group {
    display: flex;
    align-items: center;
    font-size: 0.85em;
    margin-bottom: 1.5rem;
    gap: 8px;
}

.continue-button {
    width: 100%;
    padding: 0.8rem;
    background: #000;
    color: #fff;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    font-size: 1em;
}

.terms {
    font-size: 3px !important;
}

@media (max-width: 768px) {
    .signup-form {
        padding: 20px;
        height: 100vh;
    }
}
</style>