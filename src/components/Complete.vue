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
         <b-card no-body
           class="crackq text-center">
        <div slot="header"><small class="text-muted">Complete Jobs</small></div>
        <showReport></showReport>
        <b-tabs card v-model="tabIndex"
        title-item-class="tab-item">
          <showDetails v-bind:jobID="jobid"></showDetails>
          <b-tab
          @click="update"
          title="My Jobs">
          <table
            class="table-sm table-striped table-hover text-muted">
            <thead>
            <tr>
              <th scope="col">Job ID</th>
              <th scope="col">Job Name</th>
              <th scope="col">Cracked</th>
              <th scope="col">Running Time</th>
              <th></th>
            </tr>
          </thead>
        <tbody>
        <tr v-for="(data, job_id) in comp_q" :key="job_id"
        @click="jobid=job_id">
              <td v-if="job_id">
                {{ job_id }}</td>
              <td v-else>None</td>
              <td v-if="data.Name">
                {{ data.Name }}</td>
              <td v-else>None</td>
              <td v-if="data.Cracked">
                {{ data.Cracked }}</td>
              <td v-else>None</td>
              <td v-if="data['Running Time']">
                {{ data['Running Time'] }}</td>
              <td v-else>None</td>
              <td>
                <div role="group">
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
                  <button type="button"
                    class="btn-secondary btn-sm"
                    @click="showReport(job_id)">
                    Report
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
              <th scope="col">Cracked</th>
              <th scope="col">Running Time</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
          <tr v-for="(data, job_id) in comp_q" :key="job_id"
          @click="jobid=job_id">
              <td v-if="job_id">
                {{ job_id }}</td>
              <td v-else>None</td>
              <td v-if="data.Name">
                {{ data.Name }}</td>
              <td v-else>None</td>
              <td v-if="data.Cracked">
                {{ data.Cracked }}</td>
              <td v-else>None</td>
              <td v-if="data['Running Time']">
                {{ data['Running Time'] }}</td>
              <td v-else>None</td>
              <td>
                <div role="group">
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
                  <button type="button"
                    class="btn-secondary btn-sm"
                    @click="showReport(job_id)">
                    Report
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

<style>
.crackq{
    margin: 0px;
    padding: 0px;
    background-color: rgba(71, 79, 86, 1);
    border-color: rgba(71, 79, 86, 0.9);
    font-size: small;
    color: rgba(0, 255, 0, 0.7);
    text-shadow: -0.5px -0.9px black, 0px 0px;
    border-style: ridge;
    border-width: 6px;
    box-shadow: 0px 0px 2px 2px rgba(0, 255, 0, 1);
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

.multiselect__placeholder, .multiselect__input::placeholder {
    text-shadow: None;
  }

.crackq-text {
  color: rgb(0, 255, 0);
  text-shadow: -2px 0 black, 0 2px black, 2px 0 black, 0 -1px black;
  }

.tab-text {
  color: green !important;
  }

</style>

<script>
import axios from 'axios';
import showDetails from './Jobs.vue';
import showAdmin from './Admin.vue';
import showProfile from './Profile.vue';
import showReport from './ReportModal.vue';

export default {
  data() {
    return {
      comp_q: [],
      message: '',
      show_msg: false,
      jobid: '',
      tabIndex: 0,
    };
  },
  components: {
    showDetails,
    showProfile,
    showAdmin,
    showReport,
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
    addAlert() {
      this.$swal({
        text: 'Restoring Job...',
        background: '#000000',
        timer: 2000,
        confirmButtonColor: '#00ff00',
        didOpen: () => {
          this.$swal.showLoading();
        },
        willClose: () => {
          this.getComp();
        },
        customClass: {
          loader: 'spinner-border',
        },
      });
    },
    update() {
      this.tabIndex = 1 - this.tabIndex;
      this.getComp();
    },
    getComp() {
      let path = '/api/queuing/complete';
      if (this.tabIndex === 1) {
        path = '/api/queuing/complete';
      } else {
        path = '/api/queuing/completeless';
      }
      axios.get(process.env.VUE_APP_BASE_URL + path)
        .then((res) => {
          this.comp_q = res.data;
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
            this.getComp();
          } else if (res.status === 204) {
            this.message = `Deleting Job: ${jobID}\n`;
            this.message += '\nSent signal to hashcat';
            this.showAlert('success');
            this.getComp();
          }
        })
        .catch((error) => {
          const msgObj = error.response.data;
          this.message = `Error deleting job: ${msgObj.msg}`;
          this.showAlert('error');
          this.getComp();
        });
    },
    resJob(jobID) {
      const path = '/api/add';
      const payload = {
        job_id: jobID,
      };
      this.addAlert();
      axios.post(process.env.VUE_APP_BASE_URL + path, payload)
        .then((res) => {
          if (res.status === 202) {
            this.message = `Successfully restored job: ${jobID}`;
            this.showAlert('success');
            this.getComp();
          }
        })
        .catch((error) => {
          if (error.response.status !== 202) {
            const msgObj = error.response.data;
            this.message = `Error resuming job: ${msgObj.msg}`;
            this.showAlert('error');
          }
          this.getComp();
        });
    },
    showProf() {
      this.$bvModal.show('profile-modal');
    },
    showAdmin() {
      this.$bvModal.show('admin-modal');
    },
    showReport() {
      this.$bvModal.show('report-modal');
    },
  },
  created() {
    this.getComp();
  },
};
</script>
