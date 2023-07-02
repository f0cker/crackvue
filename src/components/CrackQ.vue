<template>
 <div margin=0>
  <div class="container" style="font-size: 0.9rem">
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
         <div align="center">
          <b-card-group deck style="max-height: 10rem; align: center">
            <b-card
              class="crackq"
              align="center"
              style="min-width: 10rem; max-height: 8rem; max-width: 12rem">
            <div class="border border-success"
              style="border-radius: 0.3rem"
            >
              <b-button-group
              class="btn-block"
              style="margin:0; width: 100%"
              vertical>
              <button
                active
                class="btn btn-sm"
                v-b-modal.job-modal>
                Q Job
              </button>
              <showTasks></showTasks>
              <button
                class="btn btn-sm"
                @click="showTasks"
              >
                Q Task
              </button>
              <button
                @click="customAlert('Feature not implemented', 'error')"
                class="btn btn-sm"
                >
                Auto-crack
            </button>
          </b-button-group>
          </div>
          </b-card>
          <b-card
            class="crackq"
            style="min-width: 4rem; max-height: 8rem; max-width: 10rem; margin-left:0">
            <div slot="header" style="font-size: 0.8rem">
              <small class="text-muted">CrackQ Status</small></div>
              <div v-if="queue" class="text-muted">
                <td v-if="typeof queue['Current Job'] == 'object' &&
                  Object.keys(queue['Current Job']).length >= 1"
                  class="text-danger">
                    Busy</td>
                  <td v-else
                  class="text-success">
                    Idle</td>
              <td>{{ queue['Current Job'].length }}</td>
            </div>
          </b-card>
          <b-card
            class="crackq"
            style="min-width: 5rem; max-height: 8rem; max-width: 10rem; margin-left:0">
            <div slot="header" style="font-size: 0.8rem">
            <small type="dark" class="text-muted">Queue Size</small></div>
          <div class="text-muted shadow-lg">
          <td v-if="queue['Queue Size'] >= 0">
              {{ queue['Queue Size'] }} </td>
          <td v-else>0</td>
          </div>
          </b-card>
          <b-card
            class="crackq"
            style="min-width: 5rem; max-height: 8rem; max-width: 10rem; margin-left:0">
            <div slot="header" style="font-size: 0.8rem">
            <small class="text-muted">Connection</small></div>
            <div class="text-success">
              <td v-if="connected">
              OK</td>
              <td v-else class="text-danger">
              Not Connected!</td>
          </div>
          </b-card>
          <b-card
            class="crackq"
            style="min-width: 11rem; max-height: 8rem; max-width: 10rem; margin-left:0">
            <div slot="header" style="font-size: 0.8rem">
            <small class="text-muted">Brain Activity</small></div>
            <div v-if="queue" class="text-muted">
              <td v-if="typeof queue['Current Job'] == 'object' &&
                Object.keys(queue['Current Job']).length >= 1">
                <tr v-for="(data, job_id) in queue['Current Job']" :key="job_id">
                  <td v-if="data.State['HC State']" class="text-success">
                    RX: <br>{{ data.State['HC State']['Brain Traffic (RX)']}} </td>
                  <td v-else class="text-success">
                    RX: 0
                  </td>
                    <td> | </td>
                  <td v-if="data.State['HC State']" class="text-danger">
                    TX: <br> {{ data.State['HC State']['Brain Traffic (TX)']}} </td>
                  <td v-else class="text-danger">
                    TX: 0
                  </td>
                </tr>
              <td v-else>0</td>
          </div>
          </b-card>
          <b-card
            class="crackq"
            style="min-width: 9rem; max-height: 8rem; max-width: 16rem; margin-left:0">
            <div slot="header" style="font-size: 0.8rem">
            <small class="text-muted">Last Completed</small></div>
            <div
              align="center"
              style="overflow: hidden;
              margin:0; max-height=10rem width=100% heigh=100%">
            <b-table
              align="center"
              thead-class="d-none"
              tbody-class="text-muted"
              borderless
              :fields="jobFilter"
              :items="lastCompItems"
              @row-clicked="showModal"
              small
              style="align:center; margin:0; max-height=6rem width=100% heigh=100%">
            <showDetails v-bind:jobID="jobid" ></showDetails>
          </b-table>
          </div>
          </b-card>
        </b-card-group>
      </div>
      <br>
      <div align="center">
      <tr>
      <b-card-group deck
        style="min-width: 60rem max-height: 40rem">
      <b-card
        class="crackq">
      <div slot="header">
        <small class="text-muted">
          Current Job Speed (h/s)
        </small>
      </div>
        <lineGraph
         :chartData="speed_data"
         :options="lg_options">
        </lineGraph>
        <div slot="footer"><small class="text-muted">Last updated at: {{ this.time }}</small></div>
      </b-card>
      <b-card
        class="crackq">
          <div slot="header">
            <small class="text-muted">
              Current Job Progress & Cracked %
            </small>
          </div>
        <donGraph
         :chartData="multi_data"
         :options="dg_options">
        </donGraph>
        <div slot="footer"><small class="text-muted">Last updated at: {{ this.time }}</small></div>
      </b-card>
      <b-card
        class="crackq">
      <div slot="header">
        <small class="text-muted">
          GPU Device Temperature C
        </small>
      </div>
        <barGraph
         :chartData="temp_data"
         :options="bg_options">
        </barGraph>
        <div slot="footer"><small class="text-muted">Last updated at: {{ this.time }}</small></div>
      </b-card>
      </b-card-group>
      </tr>
    </div>
    <br>
    <div
      style="align: center"
    >
      <b-card
        style="text-align: center"
        class="crackq">
        <div slot="header"><small class="text-muted">Current Job</small></div>
        <div
          class="text-muted align-center">
            <table align="center" class="table-sm table-striped text-muted">
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
                  <tr
                  v-for="(data, job_id) in queue['Current Job']"
                  :key="job_id"
                  @click="showMoodal(job_id)">
                  <td>{{ job_id }}</td>
                  <td v-if="data['Job Details']">
                    {{ data['Job Details'].name }}</td>
                  <td v-else>Initializing...</td>
                  <td v-if="data['Job Details']">
                    {{ data.State['HC State']['HC Status'] }}</td>
                  <td v-else>Initializing...</td>
                  <td v-if="data['Job Details']">
                    {{ data.State['HC State']['Total Hashes'] }}</td>
                  <td v-else>None</td>
                  <td v-if="data['Job Details']">
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
                </tr>
              </tbody>
            </table>
        </div>
      </b-card>
    </div>
    <br>
    </div>
    </div>
    <b-modal ref="addJobModal"
      id="job-modal"
      dark
      title="Add a new job"
      header-class="header"
      body-class="crackq"
      hide-header
      hide-footer>
      <div class="container">
      <b-form @reset="onReset" @submit.prevent="onSubmit" class="w-100">
        <b-form-group
          id="form-name-group"
          label="Job Name:"
          label-for="form-name-input">
          <b-form-input
            id="form-name-input"
            name="form-name-input"
            @input="$v.addJobForm.$touch"
            v-model="addJobForm.name"
            :state="$v.addJobForm.name.$dirty ? !$v.addJobForm.name.$error : null"
            aria-describedby="name-live-feedback">
          </b-form-input>
          <b-form-invalid-feedback id="name-live-feedback">
            Invalid Input: [A-Za-z0-9] ' ' or '-' only. Min length of 3 and max 40
          </b-form-invalid-feedback>
        </b-form-group>
        <b-form-group id="form-attack-group"
          label="Attack Mode:"
          label-for="form-attack-input">
          <b-form-select id="form-attack-input"
            :options="options['Attack Modes']"
            v-model="addJobForm.attack_mode"
            required
            placeholder="Enter Attack Mode">
          </b-form-select>
          <div class="mt-3">Selected: <strong>{{ addJobForm.attack_mode }}</strong></div>
        </b-form-group>
          <div>
            <label class="secondary">Hash Mode:</label>
              <multiselect
                class="primary-text"
                v-model="addJobForm.hash_mode"
                placeholder="Type to search"
                track-by="name"
                label="name"
                required
                :options="hashModes">
              </multiselect>
          </div>
          <div class="mt-3">Selected: <strong>{{ addJobForm.hash_mode.id }}</strong></div>
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
        <b-form-group id="form-wordlist-group"
          label="Wordlist:"
          label-for="form-wordlist-input">
          <b-form-select id="form-wordlist-input"
                        :options="options.Wordlists"
                        v-model="selected_word"
                        placeholder="Wordlist">
          </b-form-select>
        <div class="mt-3">Selected: <strong>{{ selected_word }}</strong></div>
        </b-form-group>
        <div v-if="addJobForm.attack_mode==1">
        <b-form-group id="form-wordlist2-group"
          label="Wordlist 2:"
          label-for="form-wordlist2-input">
          <b-form-select id="form-wordlist2-input"
                        :options="options.Wordlists"
                        v-model="selected_word2"
                        placeholder="Wordlist 2">
          </b-form-select>
          <div class="mt-3">Selected: <strong>{{ selected_word2 }}</strong></div>
        </b-form-group>
        </div>
        <b-form-group id="form-rules-group"
                    label="Rules:"
                    label-for="form-rules-input">
          <b-form-select id="form-rules-input"
                        :options="options.Rules"
                        v-model="selected_rules"
                        multiple :select-size="3"
                        placeholder="Rules">
          </b-form-select>
          <div class="mt-3">Selected: <strong>{{ selected_rules }}</strong></div>
        </b-form-group>
        <b-form-group id="form-maskfile-group"
                    label="Mask File:"
                    label-for="form-maskfile-input">
          <b-form-select id="form-maskfile-input"
                        :options="options['Mask Files']"
                        v-model="selected_maskfile"
                        multiple :select-size="1"
                        placeholder="Select Mask File for Brute Mode">
          </b-form-select>
          <div class="mt-3">Selected: <strong>{{ selected_maskfile }}</strong></div>
        </b-form-group>
        <b-form-group id="form-mask-group"
        label="Custom Mask:"
        label-for="form-mask-input"
        v-b-popover.hover="'Custom character sets: ?1 = ?l?d, ?2 = ?l?d?u, ?3 = ?l?d?s, ?4 = ?u?d?s'">
          <b-form-input id="form-name-input"
                        type="text"
                        v-model="addJobForm.mask"
                        placeholder="Enter Mask For Brute Mode">
          </b-form-input>
        </b-form-group>
        <b-form-group id="form-options-group">
          <b-form-checkbox v-model="addJobForm.username" switch>
          Show usernames
          </b-form-checkbox>
          <b-form-checkbox v-model="addJobForm.notify" switch>
          Send notification email
          </b-form-checkbox>
          <b-form-checkbox v-model="addJobForm.increment" switch>
          Increment
          </b-form-checkbox>
          <b-form-checkbox v-model="addJobForm.brain" switch>
          Disable brain
          </b-form-checkbox>
          <b-form-checkbox v-model="addJobForm.potcheck"
            v-b-popover.hover="'Run hashcat using the system wordlist first,\
            updated from the potfile daily'"
             switch>
          Potfile++
          </b-form-checkbox>
        <div class="container" v-if="addJobForm.increment">
          <label for="incmin">Increment Min</label>
          <b-form-spinbutton id="incmin" name="min" min=1 max=20 size=sm
            style="width: 7rem"
            small
            class="crackq"
            v-model="addJobForm.incmin">
          </b-form-spinbutton>
          <label for="incmax">Increment Max</label>
          <b-form-spinbutton id="incmax" name="max" min=1 max=20 size=sm
            style="width: 7rem"
            class="crackq"
            small
            v-model="addJobForm.incmax">
          </b-form-spinbutton>
        </div>
        <br>
        <div class="container"
          v-b-popover.hover="'Optional timeout value for the job in hours, default is 3 weeks'">
          <label for="form-timeout-input">Job Timeout</label>
          <b-form-input id="form-timeout-input"
            :disabled="!disable_timeout"
            type="range"
            v-model="addJobForm.timeout"
            min="1"
            max="8000">
          Job timeout
          </b-form-input>
          <div><strong>{{ addJobForm.timeout }} hour/s</strong></div>
        </div>
      </b-form-group>
      <div align="center">
        <b-button-group>
          <button
          type="submit"
          class="btn btn-sm">
            Submit
          </button>
          <button
          type="reset"
          class="btn-secondary btn-sm">
            Reset
          </button>
        </b-button-group>
      </div>
    </b-form>
    </div>
    </b-modal>
  </div>
 </div>
</template>

<style>
.btn-group.special {
  display: flex;
}
.dropdown .dropdown-menu {
  background: black;
  }
.dropdown-item:hover {
  background: black;
  color: rgba(0, 255, 0, 1) !important;
  }
a {
  color: rgba(0, 255, 0, 0.7) !important;
  }
a:hover {
  color: rgba(0, 255, 0, 1) !important;
  }
.special .btn {
  flex: 1;
    }
.text-primary {
 color: white !important;
  }
.text-primary:hover {
 color: black !important;
}

tbody tr:hover {
  color: rgba(0, 255, 0, 1) !important;
  }

.crackqtable{
    margin: 0px;
    padding: 0px;
    background-color: rgba(21, 29, 30, 1) !important;
    border-color: rgba(21, 29, 26, 0.9) !important;
    font-size: small;
    color: rgba(0, 255, 0, 0.7);
    text-shadow: -0.5px -0.9px black, 0px 0px;
    border-style: ridge;
    border-width: 6px;
    box-shadow: 0px 0px 2px 2px rgba(0, 255, 0, 1);
    }

.crackq{
    margin: 0px;
    padding: 0px;
    background-color: rgba(21, 29, 30, 1) !important;
    border-color: rgba(21, 29, 26, 0.9) !important;
    font-size: small;
    color: rgba(0, 255, 0, 0.7);
    text-shadow: -0.5px -0.9px black, 0px 0px !important;
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
.tab-title{
    margin: 0px;
    padding: 0px;
    background-color: rgba(71, 79, 86, 0.9);
    color: white;
    }

.multiselect__placeholder, .multiselect__input::placeholder {
    text-shadow: None;
  }

.crackq-text {
  color: rgb(0, 255, 0) !imporant;
  text-shadow: -2px 0 black, 0 2px black, 2px 0 black, 0 -1px black;
  }

</style>
<script>
import axios from 'axios';
import { required, maxLength, minLength } from 'vuelidate/lib/validators';
import { validationMixin } from 'vuelidate';
import lineGraph from './LineGraph.vue';
import donGraph from './DonGraph.vue';
import barGraph from './BarGraph.vue';
import showDetails from './Jobs.vue';
import showAdmin from './Admin.vue';
import showProfile from './Profile.vue';
import showTasks from './TaskModal.vue';

export default {
  mixins: [validationMixin],
  data() {
    return {
      csrf_token: '',
      file: '',
      selected_word: null,
      selected_word2: null,
      selected_rules: [],
      selected_maskfile: [],
      options: [],
      hashModes: [],
      queue: '',
      hash_list: '',
      addJobForm: {
        name: '',
        hash_file: '',
        hash_mode: '',
        attack_mode: 0,
        wordlist: '',
        mask: null,
        maskfile: null,
        rules: null,
        notify: false,
        timeout: '',
      },
      message: '',
      variant: '',
      show_msg: false,
      job_details: [],
      job_id: '',
      gradient: null,
      jobid: '',
      lastCompItems: [],
      jobFilter: ['job_name'],
      connected: true,
      time: Date(),
      disable_timeout: false,

      // graph stuff
      lg_options: {
        animation: false,
        scales: {
          yAxes: [{
            ticks: {
              display: false,
            },
            gridLines: {
              display: false,
            },
          }],
          xAxes: [{
            ticks: {
              source: 'data',
              autoSkip: true,
              display: false,
            },
            gridLines: {
              display: false,
            },
          }],
        },
      },
      bg_options: {
        scales: {
          xAxes: [{
            gridLines: {
              display: false,
            },
            ticks: {
              beginAtZero: true,
            },
          }],
          yAxes: [{
            gridLines: {
              display: false,
            },
            ticks: {
              beginAtZero: true,
            },
          }],
        },
      },
      dg_options: {
        tooltips: {
          callbacks: {
            label: (item, data) => {
              const label = data.datasets[item.datasetIndex].labels[item.index];
              const value = data.datasets[item.datasetIndex].data[item.index];
              return `${label}: ${value}`;
            },
          },
        },
        scales: {
          xAxes: [{
            gridLines: {
              display: false,
            },
            ticks: {
              display: false,
            },
          }],
          yAxes: [{
            gridLines: {
              display: false,
            },
            ticks: {
              display: false,
              beginAtZero: true,
            },
          }],
        },
      },
      prog_data: {},
      cracked_data: {},
      speed_data: {},
      multi_data: {},
      temp_data: {},
    };
  },
  validations: {
    addJobForm: {
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
  components: {
    lineGraph,
    donGraph,
    barGraph,
    showDetails,
    showProfile,
    showAdmin,
    showTasks,
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
    timedAlert() {
      this.$swal({
        text: 'Adding Job...',
        background: '#000000',
        timer: 6000,
        confirmButtonColor: '#00ff00',
        didOpen: () => {
          this.$swal.showLoading();
        },
        customClass: {
          loader: 'spinner-border',
        },
        willClose: () => {
          this.getQueue();
        },
      });
    },
    showModal(record) {
      this.jobid = record.job_id;
      this.$bvModal.show('details-modal');
    },
    showMoodal(id) {
      this.jobid = id;
      this.$bvModal.show('details-modal');
    },
    showProf() {
      this.$bvModal.show('profile-modal');
    },
    showAdmin() {
      this.$bvModal.show('admin-modal');
    },
    showTasks() {
      this.$bvModal.show('tasks-modal');
      this.getQueue();
    },
    getQueue() {
      const path = '/api/queuing/all';
      axios.get(process.env.VUE_APP_BASE_URL + path)
        .then((res) => {
          this.time = Date();
          this.queue = res.data;
          this.connected = true;
          let progArray = [];
          let crackedArray = [];
          let spArray = [];
          let tempArray = [];
          const tempLabelsArray = [];
          const spLabelsArray = [];
          let speed = '';
          this.lastCompItems = this.queue['Last Complete'];
          // this.gradient = this.$refs.canvas.getContext('2d').createLinearGradient(0, 0, 0, 450)
          // this.gradient = this.$refs.speedchart;
          // this.gradient.getContext('3d');
          // this.gradient.createLinearGradient(0, 0, 0, 450);
          // this.gradient.addColorStop(0, 'rgba(128, 182, 244, 0.6)');
          // this.gradient.addColorStop(1, 'rgba(244, 144, 128, 0.6)');
          if (Object.keys(res.data['Current Job']).length >= 1) {
            const jobID = Object.keys(res.data['Current Job'])[0];
            if (res.data['Current Job'][jobID].State['HC State']) {
              const jobProg = res.data['Current Job'][jobID].State['HC State'].Progress;
              progArray.push(100 - jobProg);
              progArray.push(jobProg);
              const jobTotal = res.data['Current Job'][jobID].State['HC State']['Total Hashes'];
              const jobCracked = res.data['Current Job'][jobID].State['HC State']['Cracked Hashes'];
              crackedArray.push(jobTotal - jobCracked);
              crackedArray.push(jobCracked);
              spArray = res.data['Current Job'][jobID].State['Speed Array'];
              spArray.push(res.data['Current Job'][jobID].State['Speed Array']);
              speed = res.data['Current Job'][jobID].State['HC State']['Speed All'];
              let i;
              for (i = 1; i <= spArray.length; i += 1) {
                spLabelsArray.push(i);
              }
              /* for (const key in temps) {
                  tempLabelsArray.push(key);
                  tempArray.push(temps[key]);
                }
              */
              const temps = res.data['Current Job'][jobID].State['HC State']['Device Temperatures'];
              const tempKeys = Object.keys(temps);
              if (tempKeys.length > 1) {
                for (let key = 0; key < tempKeys.length; key += 1) {
                  tempLabelsArray.push(key);
                  tempArray.push(temps[key]);
                }
              }
            }
          } else {
            progArray = [0, 0];
            crackedArray = [0, 0];
            spArray = [0];
            tempArray = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
            speed = 0;
          }
          this.speed_data = {
            labels: spLabelsArray,
            datasets: [
              {
                fill: true,
                fillColor: [
                  'rgba(208, 76, 76, 0.1)',
                ],
                backgroundColor: [
                  'rgba(0,255,0,1)',
                  // this.gradient,
                  // 'rgba(255,0,0,1)',
                ],
                data: spArray,
                label: speed,
                pointRadius: 0,
              },
            ],
          };
          this.prog_data = {
            labels: ['Progress % Remaining', 'Progress % Complete'],
            datasets: [
              {
                fillColor: [
                  // 'rgba(255, 255, 0, 0.9)',
                ],
                backgroundColor: [
                  'rgba(148,159,177,0.2)',
                  'rgba(0,255,0,1)',
                ],
                borderColor: [
                  // 'rgba(255, 255, 255, 0.4)',
                ],
                data: progArray,
                label: 'test_label',
                borderWidth: 0,
              },
            ],
          };
          this.multi_data = {
            // labels: ['% Remaining', '% Complete', 'Uncracked', 'Cracked'],
            datasets: [
              {
                fillColor: [
                ],
                backgroundColor: [
                  'rgba(148,159,177,0.2)',
                  'rgba(0,255,0,1)',
                ],
                borderColor: [
                ],
                data: progArray,
                labels: ['% Remaining', '% Complete'],
                borderWidth: 0,
              },
              {
                fillColor: [
                ],
                backgroundColor: [
                  'rgba(148,159,177,0.2)',
                  'rgba(255,0,0,1)',
                ],
                borderColor: [
                ],
                data: crackedArray,
                labels: ['Uncracked', 'Cracked'],
                borderWidth: 0,
              },
            ],
          };
          this.temp_data = {
            labels: tempLabelsArray,
            datasets: [
              {
                fill: true,
                backgroundColor: [
                  'rgba(255,0,0,1)',
                  'rgba(255,0,0,1)',
                  'rgba(255,0,0,1)',
                  'rgba(255,0,0,1)',
                  'rgba(255,0,0,1)',
                  'rgba(255,0,0,1)',
                  'rgba(255,0,0,1)',
                  'rgba(255,0,0,1)',
                  'rgba(255,0,0,1)',
                  'rgba(255,0,0,1)',
                  'rgba(255,0,0,1)',
                  'rgba(255,0,0,1)',
                ],
                data: tempArray,
                label: 'Device Temperate (C)',
                pointRadius: 0,
              },
            ],
          };
          this.cracked_data = {
            labels: ['Remaining', 'Cracked'],
            datasets: [
              {
                fillColor: [
                  'rgba(208, 76, 76, 1)',
                  'rgba(148,159,177,0.2)',
                ],
                backgroundColor: [
                  'rgba(148,159,177,0.2)',
                  // 'rgba(255, 255, 0, 0.9)',
                  // 'rgba(255, 255, 0, 1)',
                  // 'rgba(132, 0, 255, 1)',
                  // 'rgba(208, 76, 76, 1)',
                  'rgba(0,255,0,1)',
                  // 'rgba(255,0,0,1)',
                ],
                borderColor: [
                  'rgba(255, 255, 255, 0.4)',
                ],
                data: crackedArray,
                label: 'test_label',
                borderWidth: 0,
              },
            ],
          };
        })
        .catch((error) => {
          this.connected = false;
          if (error.response) {
            if (error.response.status === 401) {
              window.location.href = 'login';
            }
          }
        });
    },
    getOptions() {
      const path = '/api/options';
      axios.get(process.env.VUE_APP_BASE_URL + path)
        .then((res) => {
          this.options = res.data;
          this.options.Wordlists.splice(0, 0, '');
          this.addJobForm.timeout = Number(this.options.timeout.Value) / 3600;
          this.disable_timeout = Boolean(this.options.timeout.Modify);
          this.hashModes = Object.keys(res.data['Hash Modes']).map((key) => ({
            id: key,
            name: res.data['Hash Modes'][key][0],
            category: res.data['Hash Modes'][key][1],
            benchmark: res.data['Hash Modes'][key][2],
          }));
        })
        .catch((error) => {
          if (error.response.status === 401) {
            window.location.href = 'login';
          }
        });
    },
    logout() {
      const path = '/api/logout';
      axios.get(process.env.VUE_APP_BASE_URL + path)
        .then((res) => {
          this.options = res.data;
          if (res.status === 200) {
            this.message = 'Logged Out';
            this.showAlert('success');
            window.location.href = 'login';
          }
        })
        .catch((error) => {
          this.show_msg = true;
          if (error.response.status !== 200) {
            this.message = 'Error Logging Out';
            this.showAlert('error');
          }
        });
    },
    addJob(payload) {
      const path = '/api/add';
      this.timedAlert();
      axios.post(process.env.VUE_APP_BASE_URL + path, payload)
        .then((res) => {
          this.job_id = res.data;
          this.message = `Job Submitted Successfully:\n ${this.job_id}`;
          this.showAlert('success');
          this.getQueue();
        })
        .catch((error) => {
          if (error.response.status !== 202) {
            this.message = 'Error Submitting Job:\n';
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
          this.getQueue();
        });
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
    initForm() {
      this.addJobForm.name = '';
      this.addJobForm.hash_mode = '';
      this.addJobForm.hash_file = '';
      this.addJobForm.attack_mode = '';
      this.addJobForm.wordlist = null;
      this.addJobForm.username = 'false';
      this.addJobForm.notify = 'false';
      this.addJobForm.increment = 'false';
      this.addJobForm.brain = 'false';
      this.addJobForm.potcheck = 'false';
    },
    onSubmit() {
      this.$v.addJobForm.$touch();
      if (this.$v.addJobForm.$anyError) {
        return;
      }
      if (parseInt(this.addJobForm.attack_mode, 10) === '3') {
        this.addJobForm.brain = true;
      }
      const payload = {
        name: this.addJobForm.name,
        hash_mode: this.addJobForm.hash_mode.id,
        hash_list: this.hash_list,
        wordlist: this.selected_word,
        wordlist2: this.selected_word2,
        rules: this.selected_rules,
        attack_mode: this.addJobForm.attack_mode,
        mask: this.addJobForm.mask,
        mask_file: this.selected_maskfile,
        username: this.addJobForm.username,
        notify: this.addJobForm.notify,
        increment: this.addJobForm.increment,
        increment_min: this.addJobForm.incmin,
        increment_max: this.addJobForm.incmax,
        potcheck: this.addJobForm.potcheck,
        timeout: Number(this.addJobForm.timeout * 3600),
      };
      this.addJob(payload);
      this.$refs.addJobModal.hide();
      this.initForm();
    },
    onReset(evt) {
      evt.preventDefault();
      this.$refs.addJobModal.hide();
      this.initForm();
    },
  },
  created() {
    axios.defaults.xsrfCookieName = 'csrftoken';
    axios.defaults.xsrfHeaderName = 'X-CSRFTOKEN';
    this.getQueue();
    this.getOptions();
    this.timer = setInterval(this.getQueue, 30000);
  },
// mounted() {
  // this.gradient = this.$refs.canvas.getContext('2d');
  // this.gradient.addColorStop(0, 'rgba(0, 231, 255, 0.9)');
  // this.gradient.addColorStop(0.5, 'rgba(0, 231, 255, 0.25)');
  // this.gradient.addColorStop(1, 'rgba(0, 231, 255, 0)');
  // console.log(this.gradient);
  // },
};

</script>
