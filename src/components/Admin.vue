<template>
  <div>
    <b-modal ref="adminModal"
      id="admin-modal"
      title="Admin"
      header-class="header"
      body-class="crackq"
      @shown="getUsers()"
      @hide="clearCache"
      hide-header
      hide-footer>
      <div class="container-flex"
        style="overflow: auto;
        text-overflow: auto;
        over-flow: break-word;
        white-space: wrap;">
      <b-table
        title="Click to edit"
        align="center"
        thead-class="text-success"
        tbody-class="text-success"
        borderless
        :items="admin_details"
        @row-clicked="showEdit"
        small
      >
      </b-table>
      </div>
      <br>
       <div align="center">
       <b-button-group style="align:center">
         <button
           type="button"
           class="btn btn-sm"
           @click="showAdd">
           Add User
         </button>
       </b-button-group>
     </div>
    </b-modal>
    <b-modal ref="editModal"
      id="edit-modal"
      title="Edit User"
      header-class="header"
      body-class="crackq"
      @submit="edSubmit"
      @hide="clearCache && getUsers"
      hide-header
      hide-footer>
      <b-form-group
        id="edit-details-form"
        label="Email:">
        <b-form-input
          id="email-input"
          type="email"
          :state="validateState('email')"
          aria-describedby="email-live-feedback"
          v-model="editDetailsForm.email">
        </b-form-input>
        <b-form-invalid-feedback
          id="email-live-feedback">
          A valid email address is required
        </b-form-invalid-feedback>
      </b-form-group>
      <b-form-group
        id="edit-details-form"
        label="Change Password:">
        <b-form-input
          id="new-password-input"
          type="password"
          :state="validateState('new_password')"
          aria-describedby="newpass-live-feedback"
          v-model="editDetailsForm.new_password">
        </b-form-input>
      </b-form-group>
      <b-form-group
        id="edit-details-form"
        label="Confirm Password:">
        <b-form-input
          id="confirm-password-input"
          :state="validateState('confirm_password')"
          aria-describedby="confirm-live-feedback"
          type="password"
          v-model="editDetailsForm.confirm_password">
        </b-form-input>
        <b-form-invalid-feedback
          id="confirm-live-feedback">
          Passwords do not match
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
        <button
          type="button"
          class="btn-danger btn-sm"
@click="delUser">
         Delete
        </button>
        <button
          type="button"
          class="btn-secondary btn-sm"
@click="makeAdmin">
         Admin
        </button>
      </b-button-group>
    </div>
    </b-modal>
    <b-modal ref="addModal"
      id="add-modal"
      title="Add User"
      header-class="header"
      body-class="crackq"
      @submit="addSubmit"
      @hide="clearCache && getUsers"
      hide-header
      hide-footer>
      <b-form-group
        id="add-user-form"
        label="Username:">
        <b-form-input
          id="user-input"
          type="text"
          :state="validateStateAdd('user')"
          aria-describedby="user-live-feedback"
          v-model="addUserForm.user">
        </b-form-input>
        <b-form-invalid-feedback
          id="user-live-feedback">
          Invalid Input: [A-Za-z0-9_] only. Min length of 3 and max 40
        </b-form-invalid-feedback>
      </b-form-group>
      <b-form-group
        id="add-user-form"
        label="Email:">
        <b-form-input
          id="email-input"
          type="email"
          :state="validateStateAdd('email')"
          aria-describedby="email-live-feedback"
          v-model="addUserForm.email">
        </b-form-input>
        <b-form-invalid-feedback
          id="email-live-feedback">
          A valid email address is required
        </b-form-invalid-feedback>
      </b-form-group>
      <b-form-group
        id="add-user-form"
        label="Password:">
        <b-form-input
          id="password-input"
          type="password"
          :state="validateStateAdd('password')"
          aria-describedby="newpass-live-feedback"
          v-model="addUserForm.password">
        </b-form-input>
        <b-form-invalid-feedback
          id="newpass-live-feedback">
          Password should be at least 10 characters
        </b-form-invalid-feedback>
      </b-form-group>
      <b-form-group
        id="add-user-form"
        label="Confirm Password:">
        <b-form-input
          required
          id="confirm-password-input"
          type="password"
          :state="validateStateAdd('confirm_password')"
          aria-describedby="confirmpass-live-feedback"
          v-model="addUserForm.confirm_password">
        </b-form-input>
        <b-form-invalid-feedback
          id="confirmpass-live-feedback">
          Passwords do not match
        </b-form-invalid-feedback>
        <br>
        <b-form-checkbox v-model="addUserForm.admin" switch>
        Admin
        </b-form-checkbox>
      </b-form-group>
      <br>
      <div align="center">
      <b-button-group>
        <button
          type="button"
          class="btn btn-sm"
          @click="addSubmit">
         Create
        </button>
      </b-button-group>
      </div>
    </b-modal>
  </div>

</template>

<style>

input:focus, textarea {outline:none ! important; }

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
  maxLength,
  email,
  sameAs,
} from 'vuelidate/lib/validators';

export default {
  name: 'adminDetails',
  data() {
    return {
      loading: false,
      admin_details: [],
      user_details: [],
      editDetailsForm: {
        email: '',
        password: '',
        new_password: '',
        confirm_password: '',
      },
      addUserForm: {
        user: '',
        email: '',
        password: '',
        confirm_password: '',
        admin: 'false',
      },
    };
  },
  validations: {
    editDetailsForm: {
      email: {
        email,
      },
      confirm_password: {
        minLength: minLength(10),
        sameAsPass: sameAs('new_password'),
      },
      new_password: {
        minLength: minLength(10),
      },
    },
    addUserForm: {
      user: {
        required,
        minLength: minLength(3),
        maxLength: maxLength(40),
        strictString(user) {
          return (
            !/\W/.test(user)
          );
        },
      },
      email: {
        email,
      },
      confirm_password: {
        required,
        minLength: minLength(10),
        samAsPass: sameAs('password'),
      },
      password: {
        required,
        minLength: minLength(10),
      },
    },
  },
  methods: {
    validateState(name) {
      const { $dirty, $error } = this.$v.editDetailsForm[name];
      return $dirty ? !$error : null;
    },
    validateStateAdd(name) {
      const { $dirty, $error } = this.$v.addUserForm[name];
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
      this.admin_details = [];
      this.user_details = [];
    },
    initForm() {
      this.editDetailsForm.email = this.user_details.email;
      this.editDetailsForm.password = '';
      this.editDetailsForm.new_password = '';
      this.editDetailsForm.confirm_password = '';
      this.addUserForm.password = '';
      this.addUserForm.confirm_password = '';
      this.addUserForm.email = '';
      this.addUserForm.admin = false;
    },
    showEdit(row) {
      this.getUsers(row.user_id);
      this.initForm();
      this.$bvModal.show('edit-modal');
    },
    showAdd() {
      this.initForm();
      this.$bvModal.show('add-modal');
    },
    getUsers(id) {
      this.loading = true;
      let path = '/api/admin/';
      if (id) {
        path = `/api/admin/${id}`;
      }
      axios.get(process.env.VUE_APP_BASE_URL + path)
        .then((res) => {
          if (res.status === 200) {
            if (id) {
              this.user_details = Object.keys(res.data).map((key) => (
                res.data[key]
              ));
            } else {
              this.admin_details = Object.keys(res.data).map((key) => (
                res.data[key]
              ));
            }
            this.loading = false;
          }
        })
        .catch((error) => {
          this.loading = false;
          if (error.response) {
            if (error.response.status === 401) {
              this.message = 'Unauthorized';
            } else if (error.response.status !== 200) {
              this.message = 'Error fetching user details';
            }
            this.showAlert('error');
          }
        });
    },
    addUser(payload) {
      const path = '/api/admin/';
      axios.post(process.env.VUE_APP_BASE_URL + path, payload)
        .then((res) => {
          if (res.status === 200) {
            this.message = 'User added';
            this.showAlert('success');
          }
        })
        .catch((error) => {
          if (error.response.status !== 200) {
            this.message = 'Error adding user:\n';
            if (Array.isArray(error.response.data)) {
              let tempArray = [];
              tempArray = error.response.data.map((item) => item.msg);
              this.message += tempArray.join(', ');
            } else {
              this.message += `${error.response.data.msg}`;
            }
            this.showAlert('error');
          }
        });
      this.getUsers();
    },
    editUser(id, payload) {
      const path = `/api/admin/${id}`;
      axios.patch(process.env.VUE_APP_BASE_URL + path, payload)
        .then((res) => {
          this.message = 'User modified:\n';
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
          if (error.response.status !== 200) {
            this.message = 'Error modifying user:\n';
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
          this.getUsers();
        });
    },
    addSubmit() {
      this.$v.addUserForm.$touch();
      if (this.$v.addUserForm.$anyError) {
        return;
      }
      const payload = {
        user: this.addUserForm.user,
        email: this.addUserForm.email,
        password: this.addUserForm.password,
        confirm_password: this.addUserForm.confirm_password,
      };
      this.addUser(payload);
      this.clearCache();
      this.$bvModal.hide('add-modal');
      this.$bvModal.hide('admin-modal');
      this.$bvModal.hide('edit-modal');
    },
    edSubmit() {
      const id = this.user_details[0];
      this.$v.editDetailsForm.$touch();
      if (this.$v.editDetailsForm.$anyError) {
        return;
      }
      const payload = {
        email: this.editDetailsForm.email,
        // password: this.editDetailsForm.password,
        // new_password: this.editDetailsForm.new_password,
        // confirm_password: this.editDetailsForm.confirm_password,
      };
      if (this.editDetailsForm.new_password) {
        payload.new_password = this.editDetailsForm.new_password;
      }
      if (this.editDetailsForm.confirm_password) {
        payload.confirm_password = this.editDetailsForm.confirm_password;
      }
      this.editUser(id, payload);
      this.clearCache();
      this.$bvModal.hide('add-modal');
      this.$bvModal.hide('admin-modal');
      this.$bvModal.hide('edit-modal');
      this.initForm();
    },
    onReset(evt) {
      evt.preventDefault();
      this.$bvModal.hide('add-modal');
      this.$bvModal.hide('edit-modal');
      this.getUsers();
      this.initForm();
    },
    makeAdmin() {
      const id = this.user_details[0];
      let path = '';
      if (id) {
        path = `/api/admin/${id}`;
      } else {
        this.message = 'Error invalid user selected';
        this.showAlert('error');
        return;
      }
      this.message = 'Toggle admin rights for this user?';
      this.$swal({
        text: this.message,
        icon: 'question',
        iconColor: '#00ff00',
        showCloseButton: true,
        background: '#000000',
        buttonsStyling: false,
        confirmButtonClass: 'btn btn-sm w-25',
        cancelButtonClass: 'btn btn-danger btn-sm w-25',
        showConfirmButton: true,
        showCancelButton: true,
      })
        .then((result) => {
          if (result.value === true) {
            axios.put(process.env.VUE_APP_BASE_URL + path)
              .then((res) => {
                if (res.status === 200) {
                  this.message = 'Admin status updated';
                  this.showAlert('success');
                }
              })
              .catch((error) => {
                this.loading = false;
                if (error.response) {
                  if (error.response.status === 401) {
                    this.message = 'Unauthorized';
                  } else if (error.response.status !== 200) {
                    this.message = 'Error updating user';
                  }
                  this.showAlert('error');
                }
              });
          } else if (result.dismiss) {
            this.message = 'Cancelled';
            this.showAlert('error');
          }
          this.clearCache();
          this.$bvModal.hide('add-modal');
          this.$bvModal.hide('admin-modal');
          this.$bvModal.hide('edit-modal');
        });
    },
    delUser() {
      const id = this.user_details[0];
      let path = '';
      if (id) {
        path = `/api/admin/${id}`;
      } else {
        this.message = 'Error invalid user selected';
        this.showAlert('error');
        return;
      }
      this.message = 'Are you sure you want to delete this user?';
      this.$swal({
        text: this.message,
        icon: 'question',
        iconColor: '#00ff00',
        showCloseButton: true,
        background: '#000000',
        buttonsStyling: false,
        confirmButtonClass: 'btn btn-sm w-25',
        cancelButtonClass: 'btn btn-danger btn-sm w-25',
        showConfirmButton: true,
        showCancelButton: true,
      })
        .then((result) => {
          if (result.value === true) {
            axios.delete(process.env.VUE_APP_BASE_URL + path)
              .then((res) => {
                if (res.status === 200) {
                  this.message = 'User deleted';
                  this.showAlert('success');
                }
              })
              .catch((error) => {
                this.loading = false;
                if (error.response) {
                  if (error.response.status === 401) {
                    this.message = 'Unauthorized';
                  } else if (error.response.status !== 200) {
                    this.message = 'Error deleting user';
                  }
                  this.showAlert('error');
                }
              });
          } else if (result.dismiss) {
            this.message = 'Cancelled';
            this.showAlert('error');
          }
        });
      this.clearCache();
      this.$bvModal.hide('add-modal');
      this.$bvModal.hide('admin-modal');
      this.$bvModal.hide('edit-modal');
    },
  },
  created() {
    axios.defaults.xsrfCookieName = 'csrftoken';
    axios.defaults.xsrfHeaderName = 'X-CSRFTOKEN';
  },
};
</script>
