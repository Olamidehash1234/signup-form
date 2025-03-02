<template>
    <div class="carousel-form">
      <div v-if="step === 1" class="form-step">
        <div class="signup-form">
          <div class="close-button">
            <img src="../../assets/icons/close.svg" alt="Close">
          </div>
          <div class="header">
            <div class="text-group">
              <h2>Create account</h2>
              <p class="mb-4">Already have an account? <router-link to="/auth/login">Login</router-link></p>
            </div>
          </div>
  
          <div class="social-auth">
            <button class="social-button">
              <img src="../../assets/icons/google.svg" alt="Google" class="icon">
              Continue with Google
            </button>
            <button class="social-button" @click="toggleInputMode">
              <img :src="inputMode === 'email' ? number : gmail" alt="Toggle Input" class="icon">
              Continue with {{ inputMode === 'email' ? 'Phone' : 'Email' }}
            </button>
          </div>
  
          <div class="divider">
            <span>or</span>
          </div>
  
          <div class="input-group">
            <label class="left">Continue with {{ inputMode === 'email' ? 'Email' : 'Phone' }}</label>
            <input v-if="inputMode === 'email'" type="email" v-model="email" placeholder="Enter Email"
                   @input="validateEmail" :class="{ 'error': emailError }" />
            <div v-else class="phone-input-container">
              <div class="country-code">
                <p>+234</p>
              </div>
              <input type="tel" inputmode="numeric" v-model="phone" placeholder="Enter number"
                     @input="validatePhone" :class="{ 'error': phoneError }" maxlength="10" />
            </div>
            <span v-if="emailError || phoneError" class="error-message">
              {{ inputMode === 'email' ? 'Please enter a valid email address' : 'Please enter a valid 10-digit phone number' }}
            </span>
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
          <h2 class="mb-4">Create a password</h2>
  
          <div class="bottom">
            <p class="mb-1">Password should be at least 8 Characters</p>
            <div class="password-input-container">
              <input :type="showPassword ? 'text' : 'password'" v-model="password"
                     placeholder="Enter a password" :class="{ 'error': passwordError }" />
              <img :src="showPassword ? eyeClose : eyeOpen" alt="Toggle Password Visibility"
                   class="password-toggle" @click="togglePasswordVisibility" />
            </div>
            <p v-if="passwordError" class="error-message">Please choose a password that has at least 8 characters</p>
            <button class="continue-btn mt-2" @click="validatePassword">Continue</button>
          </div>
        </div>
      </div>
  
      <div v-if="step === 3" class="form-step">
        <div class="form2">
          <div class="close-button" @click="step = 2">
            <img src="../../assets/icons/back.svg" alt="Back">
          </div>
          <h2 class="">Check your {{ inputMode === 'email' ? 'email' : 'inbox' }}</h2>
  
          <div class="bottom">
            <p class="mb-7">We sent a 6-digit code to <strong>{{ inputMode === 'email' ? email : '+1 ' + phone }}</strong>. Code expires soon {{ inputMode === 'email' ? '(Check your inbox and spam)' : '' }}</p>
  
            <div class="otp-container">
              <input v-for="(digit, index) in 6" :key="index" ref="otpInputs" type="text" inputmode="numeric"
                     maxlength="1" v-model="otpDigits[index]" @input="handleOtpInput(index)"
                     @keydown="handleKeydown($event, index)" @paste="handlePaste"
                     @keydown.delete="handleDelete(index)" class="otp-input"
                     :class="{ 'filled': otpDigits[index] }" />
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
  import number from '../../assets/icons/phone.svg';
  import gmail from '../../assets/icons/emai.svg';
  import { useRouter } from 'vue-router';
  
  const router = useRouter();
  
  const step = ref(1);
  const email = ref('');
  const phone = ref('');
  const inputMode = ref('email');
  const agreed = ref(false);
  const password = ref('');
  const passwordError = ref(false);
  const showPassword = ref(false);
  const otpDigits = ref(Array(6).fill(''));
  const otpInputs = ref([]);
  const countdown = ref(30);
  const emailError = ref(false);
  const phoneError = ref(false);
  let countdownTimer = null;
  
  const validateEmail = () => {
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    emailError.value = !emailRegex.test(email.value);
  };
  
  const validatePhone = () => {
    phone.value = phone.value.replace(/\D/g, '');
    phoneError.value = phone.value.length !== 10;
  };
  
  watch(inputMode, () => {
    emailError.value = false;
    phoneError.value = false;
  });
  
  const nextStep = () => {
    if (inputMode.value === 'email') {
      validateEmail();
      if (!emailError.value && email.value && agreed.value) step.value = 2;
    } else {
      validatePhone();
      if (!phoneError.value && phone.value && agreed.value) step.value = 2;
    }
  };
  
  const toggleInputMode = () => {
    inputMode.value = inputMode.value === 'email' ? 'phone' : 'email';
  };
  
  const togglePasswordVisibility = () => {
    showPassword.value = !showPassword.value;
  };
  
  const validatePassword = () => {
    passwordError.value = password.value.length < 8;
    if (!passwordError.value) {
      step.value = 3;
      startCountdown();
      setTimeout(() => otpInputs.value[0]?.focus(), 100);
    }
  };
  
  const handleOtpInput = (index) => {
    otpDigits.value[index] = otpDigits.value[index].replace(/[^0-9]/g, '');
    if (otpDigits.value[index] && index < 5) otpInputs.value[index + 1]?.focus();
  };
  
  const handleKeydown = (event, index) => {
    if (event.key === 'ArrowRight' && index < 5) otpInputs.value[index + 1]?.focus();
    else if (event.key === 'ArrowLeft' && index > 0) otpInputs.value[index - 1]?.focus();
  };
  
  const handleDelete = (index) => {
    if (!otpDigits.value[index] && index > 0) {
      otpDigits.value[index - 1] = '';
      otpInputs.value[index - 1]?.focus();
    }
  };
  
  const handlePaste = (event) => {
    event.preventDefault();
    const pastedData = event.clipboardData.getData('text').replace(/[^0-9]/g, '').substring(0, 6);
    pastedData.split('').forEach((digit, i) => otpDigits.value[i] = digit);
    otpInputs.value[pastedData.length < 6 ? pastedData.length : 5]?.focus();
  };
  
  const startCountdown = () => {
    countdown.value = 30;
    clearInterval(countdownTimer);
    countdownTimer = setInterval(() => countdown.value > 0 ? countdown.value-- : clearInterval(countdownTimer), 1000);
  };
  
  const resetCountdown = () => {
    startCountdown();
    otpDigits.value = Array(6).fill('');
    otpInputs.value[0]?.focus();
  };
  
  const verifyCode = () => {
    const code = otpDigits.value.join('');
    if (code.length === 6) alert('Verification successful! Account created.');
    else alert('Please enter a valid 6-digit code');
  };
  
  watch(step, (newStep) => {
    if (newStep === 3) {
      startCountdown();
      setTimeout(() => otpInputs.value[0]?.focus(), 100);
    }
  });
  
  onUnmounted(() => clearInterval(countdownTimer));
  </script>

<style scoped>
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
    position: relative;
    overflow: hidden
}

.signup-form {
    background: #fff;
    padding: 40px;
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

input[type="email"],
input[type="tel"] {
    width: 100%;
    padding: 0.8rem;
    margin: 0;
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
    padding: 0.7rem;
    border: 1px solid rgba(146, 146, 146, 0.60);
    border-radius: 6px 0 0 6px;
    color: #757575;
    border-right: none;
    font-family: 14px !important;
    min-width: 50px;
}

.phone-input-container input {
    flex: 1;
    margin: 0;
    font-size: 14px;
    border-radius: 0 6px 6px 0;
}

.checkbox-group {
    display: flex;
    align-items: center;
    font-size: 0.85em;
    margin-bottom: 1.5rem;
    margin-top: 10px;
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
    margin-bottom: 10px !important;
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

    .signup-form,
    .form2 {
        padding: 20px;
    }

    .otp-input {
        width: 40px;
        height: 40px;
        font-size: 16px;
    }

    .close-button{
        display: none;
    }
}

@media (max-width: 400px) {
    .otp-input {
        width: 40px;
        height: 45px;
        font-size: 14px;
    }
}

@media (max-width: 768px) {
    .carousel-form {
        padding: 0;
        box-shadow: none;
        margin: 0;
        border-radius: 0;
    }

    .form2{
        border-radius: 0;
        box-shadow: none;
        padding: 20px;
    }

    .form-step {
        height: 100vh;
        align-items: flex-start;
        padding: 0;
    }

    .signup-form,
    .form-step {
        max-width: 100%;
        padding-top: 20px;
        border-radius: 0;
        box-shadow: none;
    }

    .header {
        margin-top: 10px;
        margin-bottom: 20px;
    }

    .text-group h2 {
        font-size: 24px;
        font-weight: 600;
        margin-bottom: 8px;
    }

    .text-group p {
        font-size: 16px;
        margin-bottom: 15px !important;
    }

    .social-button {
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 12px;
        border-radius: 8px;
        background: #fff;
        border: 1px solid rgba(146, 146, 146, 0.60);
        margin-bottom: 10px !important;
        font-size: 14px;
    }

    .social-button:first-child {
        border: 1px solid rgba(146, 146, 146, 0.60);
    }

    .social-button .icon {
        margin-right: 8px;
        height: 20px;
    }

    .divider {
        margin: 20px 0;
        color: #757575;
        font-size: 14px;
    }

    .div {
        margin-bottom: 15px;
    }

    .div label.left {
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
        /* border-radius: 8px; */
    }

    .phone-input-container {
        margin-top: 0;
    }

    .country-code {
        padding: 11px;
        font-size: 14px;
        font-weight: 400;
        color: #333;
        background-color: #f9f9f9;
        border: 1px solid rgba(146, 146, 146, 0.60);
        border-right: none;
    }

    .checkbox-group {
        margin: 15px 0;
    }

    .checkbox-group label {
        font-size: 14px;
        color: #333;
    }

    .continue-button {
        padding: 12px;
        font-size: 16px;
        font-weight: 500;
        border-radius: 8px;
        background-color: #000;
        margin-top: 5px;
    }

    .error-message {
        font-size: 12px;
        margin-top: 5px;
    }
}

@media (max-width: 480px) {

    .social-button {
        padding: 12px 10px;
    }

    .social-auth {
        display: flex;
        flex-direction: column;
        gap: 10px;
    }
}

@media (max-width: 768px) {

    .carousel-form {
        padding-top: 200px;
    }
    
    .carousel-form::before {
        content: "";
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        height:200px;
        background-image: url('../../assets/images/auth/foodbag.png');
        background-size: cover;
        background-position: center;
        z-index: 0;
    }
}
</style>