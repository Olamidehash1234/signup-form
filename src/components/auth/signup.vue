<template>
    <div class="carousel-form">
        <div v-if="step === 1" class="form-step">
            <div class="signup-form">
                <div class="close-button">
                    <img src="../../assets/icons/close.svg" alt="">
                </div>
                <div class="header">
                    <div class="text-group">
                        <h2>Create account</h2>
                        <p class="mb-4">Already have an account? <a href="#">Login</a></p>
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
                    <input type="email" v-model="email" placeholder="Enter Email" />
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
                    <img src="../../assets/icons/back.svg" alt="">
                </div>
                <h2 class="mb-4">Create a password</h2>

                <div class="bottom">
                    <p class="mb-1">Password should be at least 8 Characters</p>
                    <div class="password-input-container">
                        <input :type="showPassword ? 'text' : 'password'" v-model="password"
                            placeholder="Enter a password" :class="{ 'error': passwordError }" />
                        <img :src="showPassword ? eyeClose : eyeOpen" alt="toggle password visibility"
                            class="password-toggle" @click="togglePasswordVisibility" />
                    </div>
                    <p v-if="passwordError" class="error-message">Please choose a password that has at least 8
                        characters</p>
                    <button class="continue-btn mt-2" @click="validatePassword">Continue</button>
                </div>
            </div>
        </div>

        <div v-if="step === 3" class="form-step">
            <div class="form2">
                <div class="close-button" @click="step = 2">
                    <img src="../../assets/icons/back.svg" alt="">
                </div>
                <h2 class="">Check your email</h2>
                
                <div class="bottom">
                    <p class="mb-7">We sent a 6-digit code to <strong>{{ email }}</strong>. Code expires soon (Check your inbox and spam)</p>
                    
                    <div class="otp-container">
                        <input 
                            v-for="(digit, index) in 6" 
                            :key="index"
                            ref="otpInputs"
                            type="text" 
                            inputmode="numeric"
                            maxlength="1"
                            v-model="otpDigits[index]"
                            @input="handleOtpInput(index)"
                            @keydown="handleKeydown($event, index)"
                            @paste="handlePaste"
                            @keydown.delete="handleDelete(index)"
                            class="otp-input"
                            :class="{ 'filled': otpDigits[index] }"
                        />
                    </div>
                    
                    <button class="continue-btn" @click="verifyCode">Continue</button>
                    
                    <div class="verification-options">
                        <p v-if="countdown > 0" class="countdown">Request a new code in {{ countdown }} seconds</p>
                        <p v-else class="resend-option" @click="resetCountdown">Request a new code</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch, computed } from 'vue';
import eyeOpen from '../../assets/icons/eye-open.svg';
import eyeClose from '../../assets/icons/eye-closed.svg';

const step = ref(1);
const email = ref('');
const agreed = ref(false);
const password = ref('');
const passwordError = ref(false);
const showPassword = ref(false);
const otpDigits = ref(['', '', '', '', '', '']);
const otpInputs = ref([]);
const countdown = ref(30);
let countdownTimer = null;

// Computed property to get the complete verification code from individual digits
const verificationCode = computed(() => {
    return otpDigits.value.join('');
});

const nextStep = () => {
    if (email.value && agreed.value) {
        step.value = 2;
    }
};

const togglePasswordVisibility = () => {
    showPassword.value = !showPassword.value;
};

const validatePassword = () => {
    if (password.value.length < 8) {
        passwordError.value = true;
    } else {
        passwordError.value = false;
        step.value = 3;
        startCountdown();
        // Focus on first OTP input when step changes
        setTimeout(() => {
            if (otpInputs.value && otpInputs.value[0]) {
                otpInputs.value[0].focus();
            }
        }, 100);
    }
};

const handleOtpInput = (index) => {
    // Force digits only
    otpDigits.value[index] = otpDigits.value[index].replace(/[^0-9]/g, '');
    
    // Auto-forward to next input when a digit is entered
    if (otpDigits.value[index] && index < 5 && otpInputs.value[index + 1]) {
        otpInputs.value[index + 1].focus();
    }
};

const handleKeydown = (event, index) => {
    // Navigate between inputs with arrow keys
    if (event.key === 'ArrowRight' && index < 5) {
        otpInputs.value[index + 1].focus();
    } else if (event.key === 'ArrowLeft' && index > 0) {
        otpInputs.value[index - 1].focus();
    }
};

const handleDelete = (index) => {
    // If current input is empty and we're not at the first input, go back to previous input on delete
    if (!otpDigits.value[index] && index > 0) {
        otpDigits.value[index - 1] = '';
        otpInputs.value[index - 1].focus();
    }
};

const handlePaste = (event) => {
    event.preventDefault();
    const pastedData = event.clipboardData.getData('text');
    const numericData = pastedData.replace(/[^0-9]/g, '').substring(0, 6);
    
    // Fill in the OTP fields with pasted data
    for (let i = 0; i < numericData.length; i++) {
        if (i < 6) {
            otpDigits.value[i] = numericData[i];
        }
    }
    
    // Focus on the next empty input or the last input if all filled
    const nextEmptyIndex = otpDigits.value.findIndex(digit => !digit);
    if (nextEmptyIndex !== -1 && otpInputs.value[nextEmptyIndex]) {
        otpInputs.value[nextEmptyIndex].focus();
    } else if (otpInputs.value[5]) {
        otpInputs.value[5].focus();
    }
};

const startCountdown = () => {
    countdown.value = 30;
    clearInterval(countdownTimer);
    countdownTimer = setInterval(() => {
        if (countdown.value > 0) {
            countdown.value -= 1;
        } else {
            clearInterval(countdownTimer);
        }
    }, 1000);
};

const resetCountdown = () => {
    // Simulate sending a new code
    startCountdown();
    // Clear OTP fields
    otpDigits.value = ['', '', '', '', '', ''];
    // Focus on first input
    if (otpInputs.value && otpInputs.value[0]) {
        otpInputs.value[0].focus();
    }
    // You would add API call logic here to request a new code
};

const verifyCode = () => {
    // Get the complete verification code
    const code = verificationCode.value;
    
    // Add your verification logic here
    if (code.length === 6) {
        alert('Verification successful! Account created.');
        // Proceed to next step or dashboard
    } else {
        alert('Please enter a valid 6-digit code');
    }
};

// Start countdown when component mounts if on step 3
watch(step, (newStep) => {
    if (newStep === 3) {
        startCountdown();
        // Focus on first OTP input when step changes
        setTimeout(() => {
            if (otpInputs.value && otpInputs.value[0]) {
                otpInputs.value[0].focus();
            }
        }, 100);
    }
});

// Clean up interval when component unmounts
onUnmounted(() => {
    clearInterval(countdownTimer);
});
</script>

<style>
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
    color: #000;
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

.bottom input[type="password"] {
    width: 100%;
    padding: 0.8rem !important;
    border: 1px solid #ccc;
    border-radius: 6px;
    box-sizing: border-box;
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
    /* Make room for the icon */
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

.bottom .continue-btn {
    width: 100%;
    padding: 0.8rem;
    background: #000;
    color: #fff;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    font-size: 1em;
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

/* OTP Input Styling */
.otp-container {
    display: flex;
    justify-content: space-between;
    margin: 10px 0 20px;
    width: 100%;
    gap: 10px;
}

.otp-input {
    display: flex;
    width: 50px;
    height: 50px;
    text-align: center;
    font-size: 18px;
    font-weight: 600;
    border: 1px solid #ccc;
    border-radius: 6px;
    background: #fff;
    outline: none;
    transition: all 0.2s;
}

.otp-input:focus {
    border-color: #000;
    box-shadow: 0 0 0 2px rgba(0, 0, 0, 0.1);
}

.otp-input.filled {
    background-color: #f9f9f9;
}

.verification-options {
    margin-top: 15px;
    text-align: center;
}

.countdown {
    color: #777;
    font-size: 14px;
}

.resend-option {
    color: #000;
    font-weight: 600 !important;
    cursor: pointer;
    font-size: 16px !important;
}

@media (max-width: 768px) {
    .signup-form, .form2 {
        padding: 20px;
    }
    
    .otp-input {
        width: 40px;
        height: 40px;
        font-size: 16px;
    }
}

@media (max-width: 400px) {
    .otp-input {
        width: 40px;
        height: 45px;
        font-size: 14px;
    }
}
</style>