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
        <div slot="header"><small class="text-muted">Failed Jobs</small></div>
        <b-tabs card v-model="tabIndex"
        title-item-class="tab-item">
          <showDetails v-bind:jobID="jobid"></showDetails>
          <b-tab
          @click="update"
          title="My Jobs">
          <table class="table-sm table-striped table-hover text-muted">
          <thead>
            <tr>
              <th scope="col">Job ID</th>
              <th scope="col">Job Name</th>
              <th scope="col">Error Message</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(data, job_id) in fail_q" :key="job_id" @click="jobid=job_id">
              <td v-if="job_id">
                {{ job_id }}</td>
              <td v-else>None</td>
              <td v-if="data.Name">
                {{ data.Name }}</td>
              <td v-else>None</td>
              <td v-if="data.Error">
                {{ data.Error}}</td>
              <td v-else>None</td>
              <td>
                <div class="btn-group" role="group">
                  <button type="button"
                    class="btn btn-sm"
                    v-b-modal="'details-modal'">
                    Details
                  </button>
                  <button type="button"
                    class="btn-warning btn-sm"
                     @click="resJob(job_id)">
                     Restore
                  </button>
                  <button type="button"
                    class="btn-danger btn-sm"
                     @click="delJob(job_id)">
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </b-tab>
      <b-tab
      @click="update"
      title="All Jobs">
        <table class="table-sm table-striped table-hover text-muted">
          <thead>
            <tr>
              <th scope="col">Job ID</th>
              <th scope="col">Job Name</th>
              <th scope="col">Error Message</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(data, job_id) in fail_q" :key="job_id" @click="jobid=job_id">
              <td v-if="job_id">
                {{ job_id }}</td>
              <td v-else>None</td>
              <td v-if="data">
                {{ data.Name }}</td>
              <td v-else>None</td>
              <td v-if="data">
                {{ data.Error }}</td>
              <td v-else>None</td>
              <td>
                <div class="btn-group" role="group">
                  <button type="button"
                    class="btn btn-sm"
                    v-b-modal="'details-modal'">
                    Details
                  </button>
                  <button type="button"
                    class="btn-warning btn-sm"
                     @click="resJob(job_id)">
                     Restore
                  </button>
                  <button type="button"
                    class="btn-danger btn-sm"
                     @click="delJob(job_id)">
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </b-tab>
      </b-tabs>
      </b-card>
      </div>
    </div>
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
      tabIndex: 0,
    };
  },
  components: {
    showDetails,
    showProfile,
    showAdmin,
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
    update() {
      this.tabIndex = 1 - this.tabIndex;
      this.getFail();
    },
    getFail() {
      let path = '/api/queuing/failed';
      if (this.tabIndex === 1) {
        path = '/api/queuing/failed';
      } else {
        path = '/api/queuing/failedless';
      }
      axios.get(process.env.VUE_APP_BASE_URL + path)
        .then((res) => {
          this.fail_q = res.data;
        })
        .catch((error) => {
          if (error.response.status === 401) {
            window.location.href = 'login';
          }
        });
    },
    delJob(jobID) {
      const path = '/api/queuing/';
      axios.delete(process.env.VUE_APP_BASE_URL + path + jobID)
        .then((res) => {
          if (res.status === 200) {
            this.message = 'Deleted';
            this.showAlert('success');
            this.getFail();
          } else if (res.status === 204) {
            this.message = 'Deleting Job';
            this.timedAlert(jobID);
            this.getFail();
          }
        })
        .catch((error) => {
          const msgObj = error.response.data;
          this.message = `Error deleting job: ${msgObj.msg}`;
          this.showAlert('error');
          this.getFail();
        });
    },
    resJob(jobID) {
      const path = '/api/add';
      const payload = {
        job_id: jobID,
      };
      axios.post(process.env.VUE_APP_BASE_URL + path, payload)
        .then((res) => {
          if (res.status === 202) {
            this.message = `Job Resumed: ${jobID}`;
            this.showAlert('success');
            this.getFail();
          }
        })
        .catch((error) => {
          if (error.response.status !== 202) {
            const msgObj = error.response.data;
            this.message = `Error resuming job: ${msgObj.msg}`;
            this.showAlert('error');
          }
          this.getFail();
        });
    },
    getJob(jobID) {
      const path = '/api/queuing/';
      axios.get(process.env.VUE_APP_BASE_URL + path + jobID)
        .then((res) => {
          if (res.status === 200) {
            this.job_details = res.data;
            this.getFail();
          }
        })
        .catch((error) => {
          this.show_msg = true;
          if (error.response.status === 401) {
            this.message = 'Unauthorized';
            this.variant = 'danger';
            this.show_msg = true;
          } else if (error.response.status !== 200) {
            this.message = 'Error getting job details';
            this.variant = 'danger';
            this.show_msg = true;
          }
          this.getFail();
        });
    },
    showProf() {
      this.$bvModal.show('profile-modal');
    },
    showAdmin() {
      this.$bvModal.show('admin-modal');
    },
  },
  created() {
    this.getFail();
  },
};
</script>
