import Login from '../../components/auth/login.vue';

export default {
  title: 'Auth/Login',
  component: Login,
  tags: ['autodocs'],
};

export const LoginForm = {
  render: () => ({
    components: { Login },
    template: '<Login />'
  })
};