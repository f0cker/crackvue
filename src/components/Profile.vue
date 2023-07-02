<template>
  <div>
    <b-modal ref="profileModal"
      id="profile-modal"
      title="Profile"
      header-class="header"
      body-class="crackq"
      @shown="getProfile"
      @row-clicked="showEdit"
      @hide="clearCache"
      hide-header
      hide-footer>
      <div class="container">
      <b-table
        title="Click to edit"
        align="center"
        thead-class="text-success"
        tbody-class="text-success"
        borderless
        :items="profile_details"
        @row-clicked="showEdit"
        small
        style="align:center; margin:0; max-height=6rem width=100% heigh=100%">
      </b-table>
      </div>
        <br>
      <div align="center">
       <b-button-group style="align:center">
         <button
           type="button"
           @click="showEdit"
           class="btn btn-sm">
           Edit
         </button>
       </b-button-group>
     </div>
    </b-modal>
    <b-modal ref="editProfModal"
      id="edit-prof-modal"
      title="Edit User"
      header-class="header"
      body-class="crackq"
      @submit="edSubmit"
      @hide="clearCache && getProfile"
      hide-header
      hide-footer>
      <b-form-group
        id="edit-details-form"
        label="Email:">
        <b-form-input
          id="email-input"
          v-model="editDetailsForm.email"
          :state="validateState('email')"
          aria-describedby="email-live-feedback">
        </b-form-input>
      <b-form-invalid-feedback
        id="email-live-feedback">
        A valid email address is required
      </b-form-invalid-feedback>
      </b-form-group>
      <b-form-group
        id="edit-details-form"
        label="Password:">
        <b-form-input
          id="password-input"
          type="password"
          v-model="editDetailsForm.password"
          :state="validateState('password')"
          aria-describedby="pass-live-feedback">
        </b-form-input>
        <b-form-invalid-feedback
          id="pass-live-feedback">
          Current password is required
        </b-form-invalid-feedback>
      </b-form-group>
      <b-form-group
        id="edit-details-form"
        label="New Password:">
        <b-form-input
          id="new-password-input"
          type="password"
          :state="validateState('new_password')"
          v-model="editDetailsForm.new_password"
          aria-describedby="newpass-live-feedback">
        </b-form-input>
        <b-form-invalid-feedback
          id="newpass-live-feedback">
          Password should be at least 10 characters
        </b-form-invalid-feedback>
      </b-form-group>
      <b-form-group
        id="edit-details-form"
        label="Confirm Password:">
        <b-form-input
          required
          id="confirm-password-input"
          :state="validateState('confirm_password')"
          aria-describedby="confirm-live-feedback"
          type="password"
          v-model="editDetailsForm.confirm_password">
        </b-form-input>
        <b-form-invalid-feedback
          id="confirm-live-feedback">
          Passwords must match
        </b-form-invalid-feedback>
      </b-form-group>
      <br>
      <div align="center">
      <b-button-group>
        <button
          type="button"
          class="btn btn-sm"
          @click="edSubmit">
         Save
        </button>
      </b-button-group>
    </div>
      </b-modal>
  </div>
</template>

<style>
.crackq{
    margin: 0px;
    padding: 0px;
    background-color: rgba(71, 79, 86, 0.9);
    border-color: rgba(71, 79, 86, 0.9);
    color: rgb(0, 255, 0);
    border-style: ridge;
    border-width: 6px;
    box-shadow: 0px 0px 2px 2px green;
    }
.header{
    margin: 0px;
    padding: 0px;
    background-color: rgba(5, 5, 5, 1);
    color: white;
    border-bottom: None;
    border-style: ridge;
    border-width: 6px;
    box-shadow: 0px 0px 0px 2px green;
    }
.tab-title{
    margin: 0px;
    padding: 0px;
    background-color: green;
    }
</style>

<script>
import axios from 'axios';
import {
  required,
  minLength,
  email,
  sameAs,
} from 'vuelidate/lib/validators';
import { validationMixin } from 'vuelidate';

export default {
  name: 'profileDetails',
  mixins: [validationMixin],
  data() {
    return {
      loading: false,
      profile_details: [],
      fields: [],
      editDetailsForm: {
        email: '',
        password: '',
        new_password: '',
        confirm_password: '',
      },
    };
  },
  validations: {
    editDetailsForm: {
      email: {
        email,
      },
      password: {
        required,
      },
      confirm_password: {
        minLength: minLength(10),
        samAsPass: sameAs('new_password'),
      },
      new_password: {
        minLength: minLength(10),
      },
    },
  },
  methods: {
    validateState(name) {
      const { $dirty, $error } = this.$v.editDetailsForm[name];
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
    customAlert(msg, alertType) {
      this.message = msg;
      this.showAlert(alertType);
    },
    clearCache() {
      this.profile_details = [];
    },
    getProfile() {
      const path = '/api/profile/';
      this.loading = true;
      axios.get(process.env.VUE_APP_BASE_URL + path)
        .then((res) => {
          if (res.status === 200) {
            this.fields = Object.keys(res.data).map((key) => (
              key
            ));
            this.profile_details = [res.data];
            this.loading = false;
          }
        })
        .catch((error) => {
          this.loading = false;
          if (error.response) {
            if (error.response.status === 401) {
              this.message = 'Unauthorized';
            } else if (error.response.status !== 200) {
              this.message = 'Error Profile details';
            }
            this.showAlert('error');
          }
        });
    },
    editProfile(payload) {
      const path = '/api/profile/';
      axios.post(process.env.VUE_APP_BASE_URL + path, payload)
        .then((res) => {
          this.message = 'Profile modified:\n';
          if (Array.isArray(res.data)) {
            let tempArray = [];
            tempArray = res.data.map((item) => item.msg);
            this.message += tempArray.join(', ');
          } else {
            this.message += `${res.data.msg}`;
          }
          this.showAlert('success');
        })
        .catch((error) => {
          if (error.response.status !== 202) {
            this.message = 'Error modifying profile:\n';
            const msgObj = error.response.data;
            if (typeof msgObj === 'object') {
              const objKeys = Object.keys(msgObj);
              if (objKeys.length > 1) {
                for (let i = 0; i < objKeys.length; i += 1) {
                  this.message += `${[objKeys[i]]} - ${msgObj[objKeys[i]]}\n`;
                }
              } else {
                this.message += `${msgObj.msg}`;
              }
            }
            this.showAlert('error');
          }
          this.getProfile();
        });
    },
    showEdit() {
      this.initForm();
      this.$bvModal.show('edit-prof-modal');
    },
    initForm() {
      this.editDetailsForm.email = this.profile_details.email;
      this.editDetailsForm.password = '';
      this.editDetailsForm.new_password = '';
      this.editDetailsForm.confirm_password = '';
    },
    edSubmit() {
      this.$v.editDetailsForm.$touch();
      if (this.$v.editDetailsForm.$anyError) {
        return;
      }
      const payload = {
        email: this.editDetailsForm.email,
        password: this.editDetailsForm.password,
        // new_password: this.editDetailsForm.new_password,
        // confirm_password: this.editDetailsForm.confirm_password,
      };
      if (this.editDetailsForm.new_password) {
        payload.new_password = this.editDetailsForm.new_password;
      }
      if (this.editDetailsForm.confirm_password) {
        payload.confirm_password = this.editDetailsForm.confirm_password;
      }
      this.editProfile(payload);
      this.$bvModal.hide('edit-prof-modal');
      this.$bvModal.hide('profile-modal');
      this.clearCache();
    },
  },
  created() {
    axios.defaults.xsrfCookieName = 'csrftoken';
    axios.defaults.xsrfHeaderName = 'X-CSRFTOKEN';
  },
};
</script>
