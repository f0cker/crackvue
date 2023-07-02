<template>
  <div>
    <b-modal ref="reportModal"
      id="report-modal"
      title="Generate Report"
      header-class="header"
      body-class="crackq"
        @hide="onReset"
        @submit="onSubmit"
        hide-header
        hide-footer>
      <div class="container">
        <br>
        <b-form-checkbox
          v-model="genReportForm.policy_check"
          v-b-popover.hover="'Include reporting metric for non-compliant passwords'"
          switch>
        Check policy discrepancy
        </b-form-checkbox>
        <br>
        <b-form-group
          id="length-details-form"
          label="Complexity Length:">
          <b-form-input
            id="length-input"
            type="range"
            min="1"
            max="32"
            :disabled="!genReportForm.policy_check"
            v-model="genReportForm.complexityLength">
          </b-form-input>
          <div><strong>{{ genReportForm.complexityLength }}</strong></div>
        </b-form-group>
        <br>
      <b-form-group id="form-adminfile-group"
                  label="Sensitive Accounts (case sensitive):"
                  v-b-popover.hover="'File containing a list of accounts considered sensitive,\
                  listed one per line. Examples include Domain Admins, SPN accounts etc.'"
                  label-for="form-adminfile-input">
        <input id="form-adminfile-input"
                      ref="file"
                      type="file"
                      v-on:change="selectedFile"
                      placeholder="Enter Senstitive Accounts">
      </b-form-group>
      <br>
      <div align="center">
        <b-button-group>
          <button
          type="submit"
          @click="onSubmit"
          class="btn btn-sm">
            Submit
          </button>
          <button
            type="reset"
            @click="onReset"
            class="btn-secondary btn-sm">
            Reset
          </button>
        </b-button-group>
      </div>
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
} from 'vuelidate/lib/validators';

export default {
  name: 'showReport',
  data() {
    return {
      loading: false,
      genReportForm: {
        policy_check: '',
        complexityLength: '',
        admin_list: [],
      },
    };
  },
  methods: {
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
    selectedFile() {
      const file = this.$refs.file.files[0];
      const reader = new FileReader();
      reader.readAsText(file, 'UTF-8');
      reader.onload = (evt) => {
        const text = evt.target.result;
        this.admin_list = text.split(/\r?\n/);
        if (this.admin_list[this.admin_list.length - 1] === '') this.admin_list.pop();
      };
      reader.onerror = (evt) => {
        this.message = 'Error reading file';
        this.showAlert('error');
      };
    },
    initForm() {
      this.genReportForm.policy_check = false;
      this.genReportForm.complexityLength = 8;
      this.genReportForm.admin_list = [];
    },
    onSubmit() {
      if (typeof this.genReportForm.policy_check !== 'boolean') {
        this.genReportForm.policy_check = false;
      }
      const payload = {
        job_id: this.$parent.jobid,
        policy_check: this.genReportForm.policy_check,
        complexity_length: this.genReportForm.complexityLength,
        admin_list: this.admin_list,
      };
      this.preCheck(payload);
      this.$refs.reportModal.hide();
    },
    onReset() {
      this.$refs.reportModal.hide();
    },
    preCheck(payload) {
      const jobID = payload.job_id;
      const path = '/api/queuing/';
      this.loading = true;
      axios.get(process.env.VUE_APP_BASE_URL + path + jobID)
        .then((res) => {
          if (res.status === 200) {
            if (res.data) {
              if (res.data['Job Details'].username !== 'True') {
                this.message = 'The username option was not selected for this job, this will cause some reporting stats to fail. ';
                this.message += 'Are you sure you want to proceed?';
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
                }).then((result) => {
                  if (result.value === true) {
                    this.genReport(payload);
                  }
                });
              } else {
                this.genReport(payload);
              }
            }
          }
        })
        .catch((error) => {
          this.loading = false;
          if (error.response) {
            if (error.response.status === 401) {
              this.message = 'Unauthorized';
              this.variant = 'danger';
              this.show_msg = true;
            } else if (error.response.status !== 200) {
              this.message = 'Error getting job details';
              this.variant = 'danger';
              this.show_msg = true;
            }
          }
        });
      return this.user_check;
    },
    genReport(payload) {
      const path = '/api/reports';
      axios.post(process.env.VUE_APP_BASE_URL + path, payload)
        .then((res) => {
          if (res.status === 202) {
            this.message = 'Successfully queued report generation';
            this.showAlert('success');
            this.getComp();
          } else if (res.status === 401) {
            this.message = 'Error: Not authorized';
            this.showAlert('error');
          } else {
            this.message = 'Error: Internal Error';
            this.showAlert('error');
          }
        })
        .catch((error) => {
          if (error.response.status === 401) {
            this.message = 'Error: Not authorized';
            this.showAlert('error');
          } else if (error.response.status !== 202) {
            const msgObj = error.response.data;
            this.message = 'Error generating report:\n';
            if (typeof msgObj === 'object') {
              const objKeys = Object.keys(msgObj);
              if (objKeys.length > 0) {
                for (let i = 0; i < objKeys.length; i += 1) {
                  this.message += `${[objKeys[i]]} - ${msgObj[objKeys[i]]}\n`;
                }
              } else if (msgObj.msg) {
                this.message += `${msgObj.msg}`;
              }
            }
            this.showAlert('error');
          }
        });
    },
  },
  created() {
    axios.defaults.xsrfCookieName = 'csrftoken';
    axios.defaults.xsrfHeaderName = 'X-CSRFTOKEN';
  },
};

</script>
