<!-- layouts/MainLayout.vue -->
<template>
    <div>
      <signup />
    </div>
  </template>
  
  <script>
import signup from '../components/auth/signup.vue';
  
  export default {
    name: 'MainLayout',
    components: {
      signup,
    },
    data() {
      return {
      };
    },
    methods: {
    }
  };
  </script>
  
  <style scoped>
  /* Add any scoped styles here */
  </style>
  