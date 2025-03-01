import Signup from '../../components/auth/signup.vue';

export default {
  title: 'Auth/Signup',
  component: Signup,
  tags: ['autodocs'],
  argTypes: {
    // Add any props/events you want to control from Storybook here
  },
};

// Base story showing default signup form
export const Default = {
  render: () => ({
    components: { Signup },
    template: '<Signup />'
  }),
};

// Story showing different states or variations could be added here
export const Loading = {
  render: () => ({
    components: { Signup },
    template: '<Signup :isLoading="true" />'
  }),
};

// Story with error state
export const WithError = {
  render: () => ({
    components: { Signup },
    template: '<Signup :hasError="true" errorMessage="Invalid email format" />'
  }),
};

// Story showing success state
export const Success = {
  render: () => ({
    components: { Signup },
    template: '<Signup :isSuccess="true" />'
  }),
};