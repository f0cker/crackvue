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
        <hr><br><br>
            <b-card class="crackq text-center">
        <div slot="header"><small class="text-muted">Report List</small></div>
        <div class="text-muted">
          <table class="table-sm table-striped table-hover text-muted">
          <thead>
            <tr>
              <th scope="col">Job ID</th>
              <th scope="col">Status</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(data, job_id) in reportQueue" :key="job_id">
              <td>{{ job_id }}</td>
              <td v-if="data">
                {{ data }}</td>
              <td v-else>Loading</td>
              <td>
                <!--<showReport v-bind:jobID="jobid"></showReport> -->
                <div class="btn-group" role="group">
                  <button type="button"
                    class="btn btn-sm"
                    @click="showReport(job_id)">
                    View Report
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
       </div>
      </b-card>
      <br>
    </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import showAdmin from './Admin.vue';
import showProfile from './Profile.vue';

export default {
  data() {
    return {
      reportQueue: [],
      report: {},
      message: '',
      show_msg: false,
    };
  },
  components: {
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
    getReports() {
      const path = '/api/reports';
      axios.get(process.env.VUE_APP_BASE_URL + path)
        .then((res) => {
          this.reportQueue = res.data;
        })
        .catch((error) => {
          if (error.response.status === 401) {
            window.location.href = 'login';
          }
        });
    },
    showReport(jobID) {
      window.open(`/report/${jobID}`, '_blank');
    },
    getReport(jobID) {
      const path = '/api/reports';
      const jobid = jobID.substring(0, jobID.length - 7);
      const payload = { params: { job_id: jobid } };
      axios.get(process.env.VUE_APP_BASE_URL + path, payload)
        .then((res) => {
          if (res.status === 200) {
            this.report = res.data;
          }
        })
        .catch((error) => {
          if (error.response.status === 401) {
            window.location.href = 'login';
          } else {
            const msgObj = error.response.data;
            this.message = `Error getting report: ${msgObj.msg}`;
            this.showAlert('error');
          }
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
    this.getReports();
  },
};

</script>
