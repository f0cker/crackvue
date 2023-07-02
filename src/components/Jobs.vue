<template>
  <div>
    <b-modal ref="detailsModal"
      id="details-modal"
      title="Job Details"
      header-class="header"
      body-class="crackq"
      @shown="getJob(jobID)"
      @hide="clearCache"
      hide-header
      hide-footer>
    <b-tabs
      content-class="mt-1"
      fill>
        <b-tab
           align="center"
           title="Cracked">
           <td v-if="job_details.Cracked" width="500px">
                <b-textarea v-if="cracked"
                  readonly
                  rows="20"
                  v-model="cracked">
                </b-textarea>
           </td>
           <td v-else-if="job_details===401">
             Unauthorized
           </td>
           <td v-else-if="job_details===500">
             Error
           </td>
           <td v-else-if="loading">
             <div class="spinner-border" align="center"></div>
           </td>
          </b-tab>
          <b-tab
            align="center"
            title="Job Details">
            <table>
              <td v-if="job_details==401">Unauthorized
              </td>
              <td v-else-if="job_details.State || job_details['HC State']" width="500px">
                <tr v-for="(data, key) in job_details" :key="key">
                  <td v-if="key=='HC State' && data=='Initializing'">
                    {{ key }}: {{ data }}
                  </td>
                  <td v-else-if="key=='HC State' && data!='Initializing'">
                    <tr v-for="(ndata, nkey) in data" :key="nkey">
                      <td v-if="nkey!='HC State' && nkey!='Speed Array'">
                        {{ nkey }}: {{ ndata }}
                      </td>
                    </tr>
                  </td>
                  <td v-else-if="key!='State' && key!='HC State' && key!='Job Details' && key!='Cracked'">
                    {{ key }}: {{ data }}
                  </td>
                  <td v-else-if="key!='Cracked'">
                    <tr v-for="(ndata, nkey) in data" :key="nkey">
                      <td v-if="nkey!='HC State'">
                        {{ nkey }}: {{ ndata }}
                      </td>
                    </tr>
                  </td>
                </tr>
              </td>
             <td v-else-if="job_details == 500">Error
             </td>
             <td v-else-if="loading">
               <div class="spinner-border" align="center"></div>
             </td>
           </table>
          </b-tab>
        </b-tabs>
        <br>
       <div align="center">
       <b-button-group>
         <button v-if="job_details['HC State']"
           type="button"
           class="btn btn-sm"
           @click="fileSaver(jobID + '.txt', job_details['HC State'])">
             Export
         </button>
         <button class="btn-secondary btn-sm" type="submit"
           @click="showTempModal()">
          Save Template
         </button>
       </b-button-group>
     </div>
    </b-modal>
    <b-modal ref="templateModal"
      id="template-modal"
      title="Create Template"
      header-class="header"
      body-class="crackq"
      @hide="onBack"
      hide-header
      hide-footer>
      <div>
      <b-form @reset="onReset" @submit.prevent="onSubmit" class="w-100">
        <b-form-group
          id="template-name-group"
          label="Template Name:"
          label-for="template-name-input">
          <b-form-input
            id="template-name-input"
            name="template-name-input"
            @input="$v.addTemplateForm.$touch"
            v-model="addTemplateForm.name"
            :state="$v.addTemplateForm.name.$dirty ? !$v.addTemplateForm.name.$error : null"
            aria-describedby="tempname-live-feedback">
          </b-form-input>
          <b-form-invalid-feedback id="tempname-live-feedback">
            Invalid Input: [A-Za-z0-9] ' ' or '-' only. Min length of 3 and max 40
          </b-form-invalid-feedback>
        </b-form-group>
      </b-form>
      </div>
      <br>
      <div align="center">
          <button
            @click="onSubmit"
            class="btn btn-sm">
            Save
          </button>
          <button
            @click="onBack"
            class="btn-secondary btn-sm">
            Back
          </button>
      </div>
    </b-modal>
  </div>
</template>

<style>
.crackq{
    margin: 0px;
    padding: 0px;
    background-color: rgba(21, 29, 30, 1) !important;
    border-color: rgba(21, 29, 26, 0.9) !important;
    color: rgb(0, 255, 0);
    border-style: ridge;
    border-radius: 0.3rem;
    border-width: 5px !important;
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
import { saveAs } from 'file-saver';
import { validationMixin } from 'vuelidate';
import { required, maxLength, minLength } from 'vuelidate/lib/validators';

export default {
  name: 'showDetails',
  props: {
    jobID: String,
  },
  mixins: [validationMixin],
  data() {
    return {
      job_details: {},
      loading: false,
      cracked: [],
      addTemplateForm: {
        name: '',
        job_id: this.jobID,
      },
    };
  },
  validations: {
    addTemplateForm: {
      name: {
        strictString(name) {
          return (
            !/[^A-Za-z0-9\_\-\ ]/.test(name)
          );
        },
        minLength: minLength(3),
        maxLength: maxLength(40),
        required,
      },
    },
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
    customAlert(msg, alertType) {
      this.message = msg;
      this.showAlert(alertType);
    },
    clearCache() {
      this.job_details = {};
      this.cracked = [];
    },
    fileSaver(fileName) {
      const blob = new Blob([this.cracked], { type: 'text/plain;charset=utf-8' });
      saveAs(blob, fileName);
    },
    getJob(jobID) {
      const path = '/api/queuing/';
      this.loading = true;
      axios.get(process.env.VUE_APP_BASE_URL + path + jobID)
        .then((res) => {
          if (res.status === 200) {
            this.job_details = res.data;
            if (res.data.Cracked) {
              this.cracked = res.data.Cracked.join('\r\n');
            } else {
              this.cracked = [];
            }
            this.loading = false;
          }
        })
        .catch((error) => {
          this.loading = false;
          this.job_details = error.response.status;
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
    },
    showTempModal() {
      this.$bvModal.show('template-modal');
    },
    addTemplate() {
      const payload = this.addTemplateForm;
      const path = '/api/tasks/templates';
      axios.put(process.env.VUE_APP_BASE_URL + path, payload)
        .then((res) => {
          if (res.status === 200) {
            this.message = 'Successfully added template';
            this.showAlert('success');
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
          } else if (error.response.status !== 200) {
            const msgObj = error.response.data;
            this.message = 'Error adding template:\n';
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
        });
    },
    onBack() {
      this.$bvModal.hide('template-modal');
    },
    onReset() {
      this.addTemplateForm.name = '';
    },
    onSubmit() {
      this.$v.addTemplateForm.$touch();
      if (this.$v.addTemplateForm.$anyError) {
        return;
      }
      this.addTemplateForm.job_id = this.jobID;
      this.addTemplate();
      this.$bvModal.hide('template-modal');
      this.$bvModal.hide('details-modal');
    },
  },
};
</script>
