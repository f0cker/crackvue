<template>
  <div>
    <b-modal ref="tasksModal"
      id="tasks-modal"
      title="Create Task"
      header-class="header"
      body-class="crackq"
        @shown="getTemplates()"
        @hide="onReset"
        @submit="onSubmit"
        hide-header
        hide-footer>
      <div class="container-flex"
        style="overflow: auto;
        text-overflow: auto;
        over-flow: break-word;
        white-space: wrap;">
      <b-form @reset="onReset" @submit.prevent="onSubmit" class="w-100">
        <b-form-group
          id="task-name-group"
          label="Task Name:"
          label-for="task-name-input">
          <b-form-input
            id="task-name-input"
            name="task-name-input"
            @input="$v.addTaskForm.$touch"
            v-model="addTaskForm.name"
            :state="$v.addTaskForm.name.$dirty ? !$v.addTaskForm.name.$error : null"
            aria-describedby="name-live-feedback">
          </b-form-input>
          <b-form-invalid-feedback id="name-live-feedback">
            Invalid Input: [A-Za-z0-9] ' ' or '-' only. Min length of 3 and max 40
          </b-form-invalid-feedback>
        </b-form-group>
          <div>
            <label class="secondary">Hash Mode:</label>
              <multiselect
                class="primary-text"
                v-model="addTaskForm.hash_mode"
                placeholder="Type to search"
                track-by="name"
                label="name"
                :options="hashModes">
              </multiselect>
          </div>
          <div class="mt-3">Selected: <strong>{{ addTaskForm.hash_mode.id }}</strong></div>
        <br>
        <b-form-group id="form-hashfile-group"
                    label="Hash File:"
                    label-for="form-hashfile-input">
        <input id="form-hashfile-input"
            ref="file"
            type="file"
            v-on:change="selectedFile"
            required
            placeholder="Enter Hash File Path">
        </b-form-group>
        <br>
        <b-form-group id="form-options-group">
        <b-form-checkbox v-model="addTaskForm.disable_brain" switch>
        Disable brain
        </b-form-checkbox>
          <b-form-checkbox v-model="addTaskForm.username" switch>
          Show usernames
          </b-form-checkbox>
          <b-form-checkbox v-model="addTaskForm.notify" switch>
          Send notification email
          </b-form-checkbox>
      </b-form-group>
      </b-form>
      <br>
      <div>
      Available Templates:
      </div>
      <b-table
        headerTitle="Available Templates"
        label="Available Templates"
        title="Click to view details"
        align="center"
        thead-class="text-success"
        tbody-class="text-success"
        borderless
        selectable
        :fields="fields"
        :items="tasks_list"
        @row-clicked="showTemp"
        small
        responsive
      >
       <template #cell(Selected)="row">
        <b-form-checkbox @input="onPreviewClick($event, row.index, row.item)">
        </b-form-checkbox>
      </template>
      </b-table>
      </div>
      <br>
      <div align="center">
        <b-button-group>
          <button
          type="submit"
          @click="onSubmit"
          class="btn btn-sm">
            Queue Task
          </button>
          <button
            type="submit"
            @click="onDelete"
            class="btn-danger btn-sm">
            Delete Template
          </button>
          <button
            type="reset"
            @click="onReset"
            class="btn-secondary btn-sm">
            Reset
          </button>
        </b-button-group>
      </div>
    </b-modal>
    <b-modal ref="taskModal"
      id="task-modal"
      title="Task Details"
      header-class="header"
      body-class="crackq"
      @hide="onBack"
      hide-header
      hide-footer>
      <div class="container-flex"
        style="overflow: auto;
        text-overflow: auto;
        over-flow: break-word;
        white-space: wrap;">
      <b-table
        align="center"
        thead-class="text-success"
        tbody-class="text-success"
        borderless
        :items="task_details"
      >
      </b-table>
      </div>
      <br>
      <div align="center">
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
import { validationMixin } from 'vuelidate';
import { required, maxLength, minLength } from 'vuelidate/lib/validators';

export default {
  name: 'showTasks',
  mixins: [validationMixin],
  data() {
    return {
      csrf_token: '',
      loading: false,
      hashModes: [],
      tasks_list: [],
      tasks: [],
      task_details: [],
      hash_list: '',
      fields: ['Selected', 'Name', 'ID'],
      addTaskForm: {
        hash_mode: '',
        disable_brain: false,
        username: false,
        notify: false,
        name: '',
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
    onSubmit() {
      this.$v.addTaskForm.$touch();
      if (this.$v.addTaskForm.$anyError) {
        return;
      }
      const payload = {};
      const jobs = [];
      for (let i = 0; i < this.tasks.length; i += 1) {
        let job = {};
        const tempID = this.tasks[i];
        const task = this.tasks_list.find(({ ID }) => ID === tempID);
        job = task.Details;
        // temporarily ignore stats field until functionality added
        delete job.stats;
        if (parseInt(job.attack_mode, 10) === 3) {
          this.addTaskForm.disable_brain = true;
        }
        job.name = `${this.addTaskForm.name} ${task.Name}`;
        job.hash_list = this.hash_list;
        job.hash_mode = this.addTaskForm.hash_mode.id;
        job.disable_brain = this.addTaskForm.disable_brain;
        job.username = this.addTaskForm.username;
        job.notify = this.addTaskForm.notify;
        const jobKeys = Object.keys(job);
        for (let ii = 0; ii < jobKeys.length; ii += 1) {
          if (job[jobKeys[ii]] === 'None') {
            job[jobKeys[ii]] = null;
          }
        }
        jobs.push(job);
      }
      payload.name = this.addTaskForm.name;
      payload.jobs = jobs;
      this.addTasks(payload);
      this.$refs.tasksModal.hide();
    },
    onDelete() {
      for (let i = 0; i < this.tasks.length; i += 1) {
        const tempID = this.tasks[i];
        this.message = 'Are you sure you want to delete the template/s?';
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
            this.delTemp(tempID);
            this.tasks.pop(tempID);
          }
        });
      }
    },
    onBack() {
      this.$bvModal.hide('task-modal');
      this.task_details = [];
    },
    onReset() {
      this.tasks = [];
      this.task_details = [];
      this.addTaskForm.name = '';
      this.addTaskForm.hash_mode = '';
      this.hash_list = '';
      this.$bvModal.hide('task-modal');
      this.$bvModal.hide('tasks-modal');
    },
    selectedFile() {
      const file = this.$refs.file.files[0];
      const reader = new FileReader();
      reader.readAsText(file, 'UTF-8');
      reader.onload = (evt) => {
        const text = evt.target.result;
        this.hash_list = text.split(/\r?\n/);
        if (this.hash_list[this.hash_list.length - 1] === '') this.hash_list.pop();
      };
      reader.onerror = () => {
        this.message = 'Error reading file';
        this.showAlert('error');
      };
    },
    onPreviewClick(value, index, item) {
      if (this.tasks.includes(item.ID)) {
        this.tasks.pop(item.ID);
      } else {
        this.tasks.push(item.ID);
      }
    },
    showTemp(row) {
      const details = this.tasks_list.find(({ ID }) => ID === row.ID);
      this.task_details.push(details.Details);
      this.$bvModal.show('task-modal');
    },
    getTemplates() {
      this.loading = true;
      this.hashModes = this.$parent._data.hashModes;
      const path = '/api/tasks/templates';
      axios.get(process.env.VUE_APP_BASE_URL + path)
        .then((res) => {
          if (res.status === 200) {
            this.tasks_list = res.data;
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
            this.message = 'Error Getting Tasks List:\n';
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
    addTasks(payload) {
      this.timedAlert();
      const path = '/api/tasks';
      axios.post(process.env.VUE_APP_BASE_URL + path, payload)
        .then((res) => {
          if (res.status === 202) {
            this.message = 'Successfully queued task';
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
          } else if (error.response.status !== 202) {
            const msgObj = error.response.data;
            this.message = 'Error Queuing Tasks:\n';
            if (typeof msgObj === 'object') {
              if (Object.keys(msgObj).includes('jobs')) {
                if (typeof msgObj.jobs === 'object') {
                  const jobCount = Object.keys(msgObj.jobs).length;
                  for (let ii = 0; ii < jobCount; ii += 1) {
                    const objKeys = Object.keys(msgObj.jobs[ii]);
                    for (let i = 0; i < objKeys.length; i += 1) {
                      this.message += `${[objKeys[i]]} - ${msgObj.jobs[ii][objKeys[i]]}\r\n`;
                    }
                  }
                }
              } else {
                this.message += `${msgObj.msg}`;
              }
              this.showAlert('error');
            }
          }
        });
    },
    delTemp(tempID) {
      const path = '/api/tasks/templates/';
      axios.delete(process.env.VUE_APP_BASE_URL + path + tempID)
        .then((res) => {
          if (res.status === 200) {
            this.message = 'Deleted';
            this.showAlert('success');
            this.getTemplates();
          }
        })
        .catch((error) => {
          const msgObj = error.response.data;
          this.message = `Error deleting template: ${msgObj.msg}`;
          this.showAlert('error');
        });
    },
    timedAlert() {
      this.$swal({
        text: 'Adding Task...',
        background: '#000000',
        timer: 8000,
        confirmButtonColor: '#00ff00',
        didOpen: () => {
          this.$swal.showLoading();
        },
        customClass: {
          loader: 'spinner-border',
        },
        willClose: () => {
        },
      });
    },
  },
  validations: {
    addTaskForm: {
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
      //hash_list: {
      // required,
      //},
    },
  },
  created() {
    axios.defaults.xsrfCookieName = 'csrftoken';
    axios.defaults.xsrfHeaderName = 'X-CSRFTOKEN';
  },
};

</script>
