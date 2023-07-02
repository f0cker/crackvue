<template>
  <div class="container fluid" style="font-size: 0.9rem">
    <div class="row">
      <div class="col-sm-16">
        <b-navbar toggleable="lg"
          type="dark">
          <b-navbar-brand>
            <img src="../assets/crackq_small.png">
          </b-navbar-brand>
          <showProfile></showProfile>
          <showAdmin></showAdmin>
          <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>
           <b-collapse id="nav-collapse" is-nav>
            <b-navbar-nav>
             <b-nav-item href="/">Home</b-nav-item>
             <b-nav-item href="/queues">Queues</b-nav-item>
             <b-nav-item href="/complete">Complete</b-nav-item>
             <b-nav-item href="/failed">Failed</b-nav-item>
             <b-nav-item href="/reports">Reports</b-nav-item>
             <b-nav-item href="/tasks">Tasks</b-nav-item>
             <b-nav-item href="/benchmarks">Benchmarks</b-nav-item>
             <b-nav-item-dropdown text="User" right>
               <b-dropdown-item @click="showProf">Profile</b-dropdown-item>
               <b-dropdown-item @click="showAdmin">Admin</b-dropdown-item>
               <b-dropdown-item href="/login">Login</b-dropdown-item>
               <b-dropdown-item href="/logout" >Logout</b-dropdown-item>
             </b-nav-item-dropdown>
           </b-navbar-nav>
           </b-collapse>
         </b-navbar>
         <br>
         <b-card class="crackq text-center">
        <div slot="header"><small class="text-muted">Tasks</small></div>
          <table class="table-sm table-striped table-hover text-muted">
          <thead>
            <tr>
              <th scope="col">Task ID</th>
              <th scope="col">Task Name</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="task in tasks_list"
              :key="task.task_id">
              <td v-if="task.task_id">
                {{ task.task_id }}
              </td>
              <td v-else>None</td>
              <td v-if="task.name">
                {{ task.name }}
              </td>
              <td v-else>None</td>
              <td>
              <button type="button"
                class="btn btn-sm"
                @click="showTask(task)">
                Details
              </button>
              <button type="button"
                class="btn-danger btn-sm"
                @click="delTask(task.task_id)">
                Delete
              </button>
              </td>
            </tr>
          </tbody>
        </table>
      </b-card>
      </div>
    </div>
    <showDetails v-bind:jobID="jobid"></showDetails>
    <b-modal ref="taskDetailsModal"
      id="task-details-modal"
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
        label="Task Jobs"
        title="Click to view details"
        thead-class="text-success"
        tbody-class="text-success"
        borderless
        :items="jobs_list"
        :fields="columns"
        @row-clicked="showModal"
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

<script>
import axios from 'axios';
import showDetails from './Jobs.vue';
import showAdmin from './Admin.vue';
import showProfile from './Profile.vue';

export default {
  data() {
    return {
      fail_q: [],
      message: '',
      show_msg: false,
      job_details: [],
      jobid: '',
      tasks_list: [],
      jobs_list: [],
      columns: [
        {
          key: 'name',
          label: 'Job Name',
          formatter: 'jobName',
        },
      ],
    };
  },
  components: {
    showDetails,
    showProfile,
    showAdmin,
  },
  methods: {
    jobName(value) {
      return `${value.first} ${value.last}`;
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
    getTasks() {
      const path = '/api/tasks';
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
            window.location.href = 'login';
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
    delTask(taskID) {
      const path = '/api/tasks/';
      this.message = 'Are you sure you want to delete this task?\n(Note: this will not delete the associated jobs)';
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
          axios.delete(process.env.VUE_APP_BASE_URL + path + taskID)
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
              this.getTasks();
            })
            .catch((error) => {
              if (error.response.status === 401) {
                window.location.href = 'login';
              } else if (error.response.status !== 200) {
                const msgObj = error.response.data;
                this.message = 'Error Deleting Task:\n';
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
        }
      });
    },
    showTask(task) {
      this.jobs_list = task.jobs;
      this.$bvModal.show('task-details-modal');
    },
    onBack() {
      this.$bvModal.hide('task-details-modal');
      this.task_details = [];
    },
    showProf() {
      this.$bvModal.show('profile-modal');
    },
    showAdmin() {
      this.$bvModal.show('admin-modal');
    },
    showModal(record) {
      this.jobid = record.job_id;
      this.$bvModal.show('details-modal');
    },
  },
  created() {
    this.getTasks();
  },
};
</script>
