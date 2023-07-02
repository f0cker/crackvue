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
        <div slot="header"><small class="text-muted">Current Job</small></div>
          <div
            class="text-muted">
          <table
            class="table-sm table-striped table-hover text-muted">
          <thead>
            <tr>
              <th scope="col">Job ID</th>
              <th scope="col">Job Name</th>
              <th scope="col">Status</th>
              <th scope="col">Total Hashes</th>
              <th scope="col">Cracked Hashes</th>
              <th scope="col">Speed</th>
              <th scope="col">Progress</th>
              <th scope="col">ETA</th>
              <th></th>
            </tr>
          </thead>
          <tbody
          v-if="queue['Current Job']">
            <showDetails v-bind:jobID="jobid" ></showDetails>
            <tr v-for="(data, job_id) in queue['Current Job']" :key="job_id"
              @click="jobid=job_id">
              <td>{{ job_id }}</td>
              <td v-if="data['Job Details']">
                {{ data['Job Details'].name }}</td>
              <td v-else>Initializing...</td>
              <td v-if="data['Job Details']">
                {{ data.State['HC State']['HC Status'] }}</td>
              <td v-else>Initializing...</td>
              <td v-if="data.State['HC State']">
                {{ data.State['HC State']['Total Hashes'] }}</td>
              <td v-else>None</td>
              <td v-if="data.State['HC State']">
                {{ data.State['HC State']['Cracked Hashes'] }}</td>
              <td v-else>None</td>
              <td v-if="data.State['HC State']">
                 {{ data.State['HC State']['Speed All'] }}</td>
              <td v-else>None</td>
              <td v-if="data.State['HC State']">
                {{ data.State['HC State']['Progress']}} %</td>
              <td v-else>None</td>
              <td v-if="data.State['HC State']">
                {{ data.State['HC State']['ETA (Relative)']}}</td>
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
                     @click="stopJob(job_id)">
                    Stop/Pause
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
       </div>
      </b-card>
      <br>
      <b-card class="crackq text-center"
        style="max-width: 85rem"
        responsive>
        <div slot="header"><small class="text-muted">Queued Jobs</small></div>
        <div
          style="overflow: hidden;
          text-overflow: ellipsis;
          white-space: wrap;
          font-size: 0.8rem "
          class="text-muted">
          <table
            style="max-width: 80rem;"
            class="responsive table-sm table-striped table-hover text-muted">
          <thead>
            <tr>
              <th >Job ID</th>
              <th scope="col">Job Name</th>
              <th scope="col">Status</th>
              <th scope="col">Hash Mode</th>
              <th scope="col">Attack Mode</th>
              <th scope="col">Rules/Mask</th>
              <th scope="col">Wordlists</th>
              <th scope="col">ETA</th>
              <th scope="col">Progress</th>
              <th scope="col">Cracked Hashes</th>
              <th></th>
            </tr>
           </thead>
           <draggable
             :v-model="queueList"
             @end="qreorder"
             tag="tbody">
             <tr v-for="(data, job_id) in queue['Queued Jobs']" :key="job_id"
               @click="jobid=job_id">
              <td>{{ job_id }}</td>
              <td v-if="data['Job Details'].name">
                {{ data['Job Details'].name }}</td>
              <td v-else>None</td>
              <td v-if="data.Status">
                {{ data.Status }}</td>
              <td v-else>None</td>
              <td v-if="data['Job Details'].hash_mode">
                {{ data['Job Details'].hash_mode}}</td>
              <td v-else>None</td>
              <td v-if="data['Job Details'].attack_mode">
                {{ data['Job Details'].attack_mode}}</td>
              <td v-else>None</td>
              <td v-if="data['Job Details'].rules!=''">
                {{ data['Job Details'].rules}}</td>
              <td v-else-if="data['Job Details'].mask">
                {{ data['Job Details'].mask}}</td>
              <td v-else>None</td>
              <td v-if="data['Job Details'].wordlist">
                {{ data['Job Details'].wordlist}}</td>
              <td v-else>None</td>
              <td v-if="data.State['HC State']">
                {{ data['State']['HC State']['ETA (Relative)']}}</td>
              <td v-else>None</td>
              <td v-if="data.State['HC State']">
                {{ data['State']['HC State']['Progress']}}</td>
              <td v-else>None</td>
              <td v-if="data.State['HC State']">
                {{ data['State']['HC State']['Cracked Hashes'] }}</td>
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
                     @click="stopJob(job_id)">
                    Stop/Pause
                  </button>
                  <button type="button"
                    class="btn-danger btn-sm"
                    @click="delJob(job_id)">
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          </draggable>
        </table>
    </div>
    </b-card>
    </div>
    </div>
</div>
</template>

<script>
import axios from 'axios';
import draggable from 'vuedraggable';
import showDetails from './Jobs.vue';
import showAdmin from './Admin.vue';
import showProfile from './Profile.vue';

export default {
  data() {
    return {
      file: '',
      selected_word: 'None',
      selected_rules: ['None'],
      options: [],
      queue: [],
      queueList: [],
      queueUpdate: [],
      hash_list: '',
      addJobForm: {
        name: '',
        hash_file: '',
        hash_mode: '',
        attack_mode: '',
        wordlist: '',
        mask: null,
        rules: null,
      },
      message: '',
      show_msg: false,
      job_details: [],
      jobid: '',
      loading: false,
    };
  },
  components: {
    showDetails,
    draggable,
    showProfile,
    showAdmin,
  },
  computed: {
  },
  methods: {
    loadSpin() {
      this.loading = true;
    },
    qreorder(evt) {
      const oldItem = this.queueList[evt.oldIndex];
      this.queueList.splice(evt.oldIndex, 1);
      this.queueList.splice(evt.newIndex, 0, oldItem);
      const batchList = [];
      const queueIndex = Object.keys(this.queueList);
      if (queueIndex.length > 1) {
        for (let index = 0; index < queueIndex.length; index += 1) {
          const batch = {};
          batch.job_id = this.queueList[index];
          batch.place = index;
          batchList.push(batch);
        }
      }
      const payload = {
        batch_job: batchList,
      };
      const path = '/api/queuing/reorder';
      axios.put(process.env.VUE_APP_BASE_URL + path, payload)
        .then((res) => {
          if (res.status === 200) {
            this.message = 'Successfully reordered queue';
            this.showAlert('success');
            this.getQueue();
          }
        })
        .catch((error) => {
          this.show_msg = true;
          if (error.response.status !== 200) {
            const msgObj = error.response.data;
            this.message = `Error reordering queue: ${msgObj.msg}`;
            this.showAlert('error');
          }
          this.getQueue();
        });
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
    timedAlert(jobID) {
      this.$swal({
        text: this.message,
        background: '#000000',
        timer: 6000,
        timerProgressBar: true,
        confirmButtonColor: '#00ff00',
        didOpen: () => {
          this.$swal.showLoading();
        },
        willClose: () => {
          this.getQueue();
          const curJobArray = Object.keys(this.queue['Current Job']);
          if (curJobArray.includes(jobID)) {
            this.message = 'Job may not be deleted yet.\nWaiting for Hashcat';
            this.showAlert('warning');
          } else {
            this.showAlert('success');
          }
        },
      });
    },
    getQueue() {
      const path = '/api/queuing/all';
      axios.get(process.env.VUE_APP_BASE_URL + path)
        .then((res) => {
          this.queue = res.data;
          this.queueList = [];
          const resKeys = Object.keys(res.data['Queued Jobs']);
          for (let i = 0; i < resKeys.length; i += 1) {
            this.queueList.push(resKeys[i]);
          }
        })
        .catch((error) => {
          if (error.response.status === 401) {
            window.location.href = 'login';
          }
        });
    },
    getOptions() {
      const path = '/api/options';
      axios.get(process.env.VUE_APP_BASE_URL + path)
        .then((res) => {
          this.options = res.data;
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
            this.getQueue();
          } else if (res.status === 204) {
            this.message = `Deleting Job: ${jobID}\r\n`;
            this.message += '\r\nSent signal to hashcat';
            this.showAlert('success');
            this.getQueue();
          }
        })
        .catch((error) => {
          const msgObj = error.response.data;
          this.message = `Error deleting job: ${msgObj.msg}`;
          this.showAlert('error');
          this.getQueue();
        });
    },
    stopJob(jobID) {
      const path = '/api/queuing/';
      axios.patch(process.env.VUE_APP_BASE_URL + path + jobID)
        .then((res) => {
          if (res.status === 204) {
            this.message = `Stopping Job: ${jobID}`;
            this.message += '\nSent signal to hashcat';
            this.showAlert('success');
            this.getQueue();
          } else if (res.status === 200) {
            this.message = `Stopped Job: ${jobID}`;
            this.showAlert('success');
            this.getQueue();
          }
        })
        .catch((error) => {
          this.show_msg = true;
          if (error.response.status !== 204) {
            const msgObj = error.response.data;
            this.message = `Error stopping job: ${msgObj.msg}`;
            this.showAlert('error');
          }
          this.getQueue();
        });
    },
    getJob(jobID) {
      const path = '/api/queuing/';
      axios.get(process.env.VUE_APP_BASE_URL + path + jobID)
        .then((res) => {
          if (res.status === 200) {
            this.job_details = res.data;
            this.getQueue();
          }
        })
        .catch((error) => {
          this.show_msg = true;
          if (error.response.status === 401) {
            this.message = 'Unauthorized';
          } else if (error.response.status !== 201) {
            this.message = 'Error getting job details';
          }
          this.getQueue();
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
    this.getQueue();
    this.getOptions();
    this.timer = setInterval(this.getQueue, 30000);
  },
};
</script>
