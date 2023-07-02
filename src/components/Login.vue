<template>
  <div align="center" class="login">
    <img src="../assets/crackq_medium.png">
      <div class="container-sm text-muted col-sm-3 login" align="left">
        <b-form @submit.stop.prevent="onSubmit">
          <b-form-group
            id="login-form-group"
            label-for="login-form-input">
            <label for="user-form-input">Username:</label>
            <b-form-input
              id="user-form-input"
              name="user-form-input"
              v-model="loginForm.username"
              :state="validateState('username')"
              aria-describedby="name-live-feedback">
            </b-form-input>
          <br>
            <label for="pass-form-input">Password:</label>
            <b-form-input
              id="pass-form-input"
              name="pass-form-input"
              title="Password:"
              type="password"
              :state="validateState('password')"
              v-model="loginForm.password"
              aria-describedby="name-live-feedback">
            </b-form-input>
          </b-form-group>
          <b-form-invalid-feedback
            id="name-live-feedback">
            This field is required
          </b-form-invalid-feedback>
          <div class="form-group login">
            <button
              type="submit"
              class="btn btn-sm login">
              Login
            </button>
          </div>
          <div>
            <button
              @click="$router.push('/api/sso')"
              type="button"
              class="btn btn-sm">
              Single Sign-On
            </button>
          </div>
        </b-form>
    </div>
  </div>
</template>

<style>
h2 {
  color: rgb(0, 255, 0);
  text-shadow: -1px 0 black, 0 1px black, 1px 0 black, 0 -1px black;
  background-color: rgba(0, 0, 0, 1);
  }
.crackq-text {
  color: rgb(0, 255, 0);
  text-shadow: -1px 0 black, 0 1px black, 1px 0 black, 0 -1px black;
  background-color: rgba(0, 0, 0, 1);
  }
.login {
  background-color: rgba(0, 0, 0, 1);
  }
</style>
<script>
import axios from 'axios';
import { required } from 'vuelidate/lib/validators';
import {
  validationMixin,
} from 'vuelidate';

// remove for prod
// axios.defaults.withCredentials = true;

export default {
  mixins: [validationMixin],
  data() {
    return {
      auth_result: null,
      username: '',
      password: '',
      submitted: false,
      loginForm: {
        username: '',
        password: '',
      },
    };
  },
  validations: {
    loginForm: {
      username: {
        required,
      },
      password: {
        required,
      },
    },
  },
  methods: {
    validateState(name) {
      const { $dirty, $error } = this.$v.loginForm[name];
      return $dirty ? !$error : null;
    },
    showAlert(alertType) {
      this.$swal({
        text: this.message,
        icon: alertType,
        showCloseButton: true,
        background: '#000000',
        confirmButtonColor: 'success',
        showConfirmButton: false,
      });
    },
    initForm() {
      this.loginForm.username = '';
      this.loginForm.password = '';
    },
    onSubmit() {
      this.$v.loginForm.$touch();
      if (this.$v.loginForm.$anyError) {
        return;
      }
      const path = '/api/login';
      axios.post(process.env.VUE_APP_BASE_URL + path, {
        user: this.loginForm.username,
        password: this.loginForm.password,
      })
        .then((res) => {
          if (res.status === 200) {
            this.message = 'Login Success';
            this.showAlert('success');
            window.location.href = '/';
          }
        })
        .catch((error) => {
          if (error.response.status === 401) {
            this.message = 'Login Failed';
            this.showAlert('error');
          } else {
            this.message = 'Login Error';
            this.showAlert('error');
          }
        });
    },
  },
  created() {
    this.initForm();
  },
};
</script>
