<template>
    <div class="carousel-form">
        <div v-if="step === 1" class="form-step">
            <div class="login-form">
                <div class="close-button">
                    <img src="../../assets/icons/close.svg" alt="Close">
                </div>
                <div class="header">
                    <div class="text-group">
                        <h2>Log In</h2>
                        <p class="mb-4">Don't have an account? <router-link to="/auth/signup">Sign up</router-link></p>
                    </div>
                </div>

                <div class="social-auth">
                    <button class="social-button">
                        <img src="../../assets/icons/google.svg" alt="Google" class="icon">
                        Continue with Google
                    </button>
                    <button class="social-button" @click="toggleInputMode">
                        <img :src="inputMode === 'email' ? number : gmail" alt="Auth method" class="icon">
                        Continue with {{ inputMode === 'email' ? 'Phone' : 'Email' }}
                    </button>
                </div>

                <div class="divider"><span>or</span></div>

                <div class="auth-input">
                    <label class="left">Continue with {{ inputMode === 'email' ? 'Email' : 'Phone' }}</label>

                    <input v-if="inputMode === 'email'" type="email" v-model="email" placeholder="Enter Email" />

                    <div v-else class="phone-input-container">
                        <div class="country-code"><span>+1</span></div>
                        <input type="tel" inputmode="numeric" v-model="phone" placeholder="Enter number" />
                    </div>
                </div>

                <div class="checkbox-group">
                    <input type="checkbox" id="terms" v-model="agreed" />
                    <label for="terms">I agree to service and Privacy policy</label>
                </div>

                <button class="continue-button" @click="nextStep">Continue</button>
            </div>
        </div>

        <div v-if="step === 2" class="form-step">
            <div class="form2">
                <div class="close-button" @click="step = 1">
                    <img src="../../assets/icons/back.svg" alt="Back">
                </div>
                <h2 class="mb-4 mt-4">Enter password</h2>

                <div class="bottom">
                    <p class="mb-1">Enter your password</p>
                    <div class="password-input-container">
                        <input :type="showPassword ? 'text' : 'password'" v-model="password"
                            placeholder="Enter a password" :class="{ 'error': passwordError }" />
                        <img :src="showPassword ? eyeClose : eyeOpen" alt="Toggle visibility" class="password-toggle"
                            @click="togglePasswordVisibility" />
                    </div>
                    <p v-if="passwordError" class="error-message">
                        Please choose a password that has at least 8 characters
                    </p>

                    <p class="right mb-1 mt-1">Forgot Password?</p>
                    <button class="continue-btn mt-2" @click="validatePassword">Continue</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import eyeOpen from '../../assets/icons/eye-open.svg';
import eyeClose from '../../assets/icons/eye-closed.svg';
import number from '../../assets/icons/phone.svg';
import gmail from '../../assets/icons/emai.svg';

// Form state
const step = ref(1);
const email = ref('');
const phone = ref('');
const inputMode = ref('email');
const agreed = ref(false);
const password = ref('');
const passwordError = ref(false);
const showPassword = ref(false);

// Methods
const toggleInputMode = () => {
    inputMode.value = inputMode.value === 'email' ? 'phone' : 'email';
};

const nextStep = () => {
    const isValid = (inputMode.value === 'email' && email.value) ||
        (inputMode.value === 'phone' && phone.value);

    if (isValid && agreed.value) {
        step.value = 2;
    }
};

const togglePasswordVisibility = () => {
    showPassword.value = !showPassword.value;
};

const validatePassword = () => {
    if (password.value.length < 8) {
        passwordError.value = true;
        return;
    }

    passwordError.value = false;
    // Login submission
    alert(`Login successful with ${inputMode.value}: ${inputMode.value === 'email' ? email.value : phone.value}`);
};
</script>

<style scoped>
/* Base styles */
.form-step {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
}

.carousel-form {
    margin: 0 auto;
    padding: 20px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    border-radius: 8px;
}

.login-form {
    background: #fff;
    padding: 50px;
    border-radius: 12px;
    width: 100%;
    max-width: 522px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    text-align: left;
}

/* Header styles */
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

/* Text styles */
p {
    text-align: left;
    color: #555;
    font-size: 16px;
}

a {
    color: #000;
    font-weight: bold;
    text-decoration: none;
}

/* Social auth buttons */
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

.icon {
    margin-right: 10px;
}

/* Divider */
.divider {
    display: flex;
    align-items: center;
    text-align: center;
    color: #000;
    margin: 30px 0;
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

/* Input styles */
.auth-input .left {
    margin-bottom: 10px;
    font-weight: 600;
}

input[type="email"],
input[type="tel"] {
    width: 100%;
    padding: 0.8rem;
    margin: 0.5rem 0 1rem;
    border: 1px solid #ccc;
    border-radius: 6px;
    box-sizing: border-box;
}

/* Phone input styling */
.phone-input-container {
    display: flex;
    align-items: center;
    margin: 0.5rem 0 1rem;
    width: 100%;
}

.country-code {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0.8rem;
    border: 1px solid #ccc;
    border-radius: 6px 0 0 6px;
    background-color: #f5f5f5;
    border-right: none;
    min-width: 50px;
}

.phone-input-container input {
    flex: 1;
    margin: 0;
    border-radius: 0 6px 6px 0;
}

/* Checkbox */
.checkbox-group {
    display: flex;
    align-items: center;
    font-size: 0.85em;
    margin-bottom: 1.5rem;
    gap: 8px;
}

/* Button */
.continue-button,
.continue-btn {
    width: 100%;
    padding: 0.8rem;
    background: #000;
    color: #fff;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    font-size: 1em;
}

/* Password form */
.form2 {
    background: #fff;
    padding: 50px;
    border-radius: 12px;
    width: 100%;
    max-width: 522px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.bottom {
    display: flex;
    flex-direction: column;
}

.bottom p {
    color: #161616;
    font-size: 14px;
    font-weight: 400;
}

.password-input-container {
    position: relative;
    width: 100%;
}

.password-input-container input {
    width: 100%;
    padding: 0.8rem !important;
    border-radius: 6px;
    border: 1px solid #ccc;
    padding-right: 40px;
}

.password-toggle {
    position: absolute;
    right: 12px;
    top: 50%;
    transform: translateY(-50%);
    cursor: pointer;
    width: 20px;
    height: 20px;
}

.bottom input.error {
    border: 1px solid #C00;
    background: rgba(204, 0, 0, 0.10);
}

.error-message {
    color: #C00 !important;
    font-size: 14px;
    margin-top: 8px;
    margin-bottom: 8px;
}

.right {
    cursor: pointer;
    align-self: flex-end;
}

.right:hover {
    text-decoration: underline;
}

/* Mobile responsiveness */
@media (max-width: 768px) {

    /* Base container */
    .carousel-form {
        padding: 0;
        box-shadow: none;
        margin: 0;
        border-radius: 0;
        padding-top: 200px;
    }

    .carousel-form::before {
        content: "";
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        height: 200px;
        background-image: url('../../assets/images/auth/foodbag.png');
        background-size: cover;
        background-position: center;
        z-index: 0;
    }

    /* Forms */
    .login-form,
    .form2 {
        border-radius: 0;
        box-shadow: none !important;
        padding: 20px;
        max-width: 100%;
    }

    .form-step {
        height: 100vh;
        align-items: flex-start;
        padding: 0;
    }

    /* Hide close button */
    .close-button {
        display: none;
    }

    /* Text elements */
    .text-group h2 {
        font-size: 24px;
        font-weight: 600;
        margin-bottom: 8px;
        padding-top: 20px;
    }

    .text-group p {
        font-size: 16px;
        margin-bottom: 15px !important;
    }

    /* Social buttons */
    .social-button {
        padding: 12px;
        border-radius: 8px;
        margin-bottom: 10px !important;
        font-size: 14px;
    }

    .social-button .icon {
        height: 20px;
    }

    /* Divider */
    .divider {
        margin: 20px 0;
        color: #757575;
        font-size: 14px;
    }

    /* Input fields */
    .auth-input label.left {
        font-size: 14px;
        color: #333;
        display: block;
        margin-bottom: 8px;
    }

    input[type="email"],
    input[type="tel"],
    .phone-input-container input {
        padding: 12px;
        font-size: 14px;
        border: 1px solid rgba(146, 146, 146, 0.60);
        border-radius: 8px;
    }

    .country-code {
        padding: 11px;
        font-size: 14px;
        color: #333;
        background-color: #f9f9f9;
    }

    /* Checkbox */
    .checkbox-group {
        margin: 15px 0;
    }

    .checkbox-group label {
        font-size: 14px;
        color: #333;
    }

    /* Continue button */
    .continue-button,
    .continue-btn {
        padding: 12px;
        font-size: 16px;
        font-weight: 500;
        border-radius: 8px;
        margin-top: 5px;
    }

    /* Error messages */
    .error-message {
        font-size: 12px;
        margin-top: 5px;
    }
}

/* Extra small devices */
@media (max-width: 480px) {
    .social-auth {
        display: flex;
        flex-direction: column;
        gap: 10px;
    }

    .social-button {
        padding: 12px 10px;
    }
}
</style>