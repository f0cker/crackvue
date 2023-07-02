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
           <b-card-group deck style="max-height: 19rem;
             align: center;
             margin-left: 0;
             margin-top: 0">
             <b-card class="crackq"
              align="center"
              style="min-width: 11rem;
                max-height: 19rem;
                max-width: 11rem;
                margin-left:0;
                margin-top: 0">
            <div class="border border-success"
              style="border-radius: 0.3rem"
            >
              <b-button-group
              class="btn-block"
              style="margin:0"
              vertical>
              <button
                @click="runBench(all=false)"
                class="btn btn-sm"
                >
                Benchmark
              </button>
              <button
                @click="runBench(all=true)"
                class="btn btn-sm"
                >
                Full Benchmark
              </button>
              <b-form-checkbox class="text-success" v-model="refresh" switch>
              Auto refresh
              </b-form-checkbox>
              </b-button-group>
              </div>
              </b-card>
          </b-card-group>
      </div>
      <br>
      <div align="center" style="max-height: 200rem">
      <tr>
      <b-card class="crackq"
        style="min-width: 90rem; max-width: 300rem; min-height: 40rem; margin-left:0;">
      <div slot="header">
        <small class="text-muted">
          CrackQ System Benchmarks
        </small>
      </div>
        <barGraph
         :chartData="bench_data"
         :options="bg_options">
        </barGraph>
        <div slot="footer"><small class="text-muted">Last updated at: {{ this.time }}</small></div>
      </b-card>
      </tr>
    </div>
    <br>
    </div>
    <br>
    </div>
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

tbody tr:hover {
  color: rgba(0, 255, 0, 1) !important;
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
  color: rgb(0, 255, 0);
  text-shadow: -2px 0 black, 0 2px black, 2px 0 black, 0 -1px black;
  }
</style>
<script>
import axios from 'axios';
import { validationMixin } from 'vuelidate';
import barGraph from './BarGraph.vue';
import showAdmin from './Admin.vue';
import showProfile from './Profile.vue';

// remove for prod
// axios.defaults.withCredentials = true;

export default {
  mixins: [validationMixin],
  data() {
    return {
      csrf_token: '',
      options: [],
      hashModes: [],
      benchmarks: [],
      message: '',
      variant: '',
      show_msg: false,
      gradient: null,
      refresh: false,
      time: Date(),

      // graph stuff
      bg_options: {
        maintainAspectRatio: false,
        scales: {
          xAxes: [{
            scaleLabel: {
              labelString: 'Hash Mode',
              display: true,
            },
            gridLines: {
              display: true,
            },
            ticks: {
              fontSize: 8,
              autoSkip: false,
              maxRotation: 90,
              beginAtZero: true,
            },
          }],
          yAxes: [{
            scaleLabel: {
              labelString: 'Speed (H/S)',
              display: true,
            },
            gridLines: {
              display: true,
            },
            ticks: {
              beginAtZero: true,
              callback: (label) => label.toLocaleString(),
            },
          }],
        },
        tooltips: {
          callbacks: {
            title: () => 'Hash Details',
            label: (item, data) => {
              const hashMode = data.labels[item.index];
              const hashData = this.options['Hash Modes'][hashMode];
              return `Hash mode: ${hashData[0]}, Description: ${hashData[1]}`;
            },
            afterLabel: (item, data) => {
              const hashMode = parseInt(data.labels[item.index], 10);
              const hashData = this.benchmarks[hashMode];
              return `Speed: ${hashData[1]}`;
            },
          },
        },
      },
      bench_data: {},
    };
  },
  components: {
    barGraph,
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
        buttonsStyling: false,
        confirmButtonClass: 'btn btn-sm w-25',
        cancelButtonClass: 'btn btn-danger btn-sm w-25',
      });
    },
    customAlert(msg, alertType) {
      this.message = msg;
      this.showAlert(alertType);
    },
    showProf() {
      this.$bvModal.show('profile-modal');
    },
    showAdmin() {
      this.$bvModal.show('admin-modal');
    },
    getRefresh() {
      if (this.refresh) {
        this.getBenchmarks();
      }
    },
    getBenchmarks() {
      const path = '/api/benchmark/';
      axios.get(process.env.VUE_APP_BASE_URL + path)
        .then((res) => {
          this.time = Date();
          const benchLabelsArray = [];
          const benchArray = [];
          this.benchmarks = res.data.Benchmarks;
          const benchKeys = Object.keys(res.data.Benchmarks);
          for (let key = 0; key < benchKeys.length; key += 1) {
            if (benchKeys[key] !== '2000') {
              benchLabelsArray.push(benchKeys[key]);
              benchArray.push(res.data.Benchmarks[benchKeys[key]][0]);
            }
          }
          this.bench_data = {
            labels: benchLabelsArray,
            datasets: [
              {
                fill: true,
                backgroundColor: 'rgba(255,0,0,1)',
                data: benchArray,
                label: 'Benchmark Results',
                pointRadius: 0,
              },
            ],
            responsive: true,
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
          this.hashModes = Object.keys(res.data['Hash Modes']).map((key) => ({
            id: key,
            name: res.data['Hash Modes'][key][0],
            category: res.data['Hash Modes'][key][1],
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
    runBench(all) {
      this.message = 'Queue benchmark job?';
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
            this.refresh = true;
            const payload = {
              benchmark_all: all,
            };
            const path = '/api/benchmark/';
            axios.post(process.env.VUE_APP_BASE_URL + path, payload)
              .then((res) => {
                this.job_id = res.data;
                this.message = `Job Submitted Successfully:\n ${this.job_id}`;
                this.showAlert('success');
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
              });
          } else if (result.dismiss) {
            this.message = 'Cancelled';
            this.showAlert('error');
          }
        });
    },
  },
  created() {
    axios.defaults.xsrfCookieName = 'csrftoken';
    axios.defaults.xsrfHeaderName = 'X-CSRFTOKEN';
    this.getOptions();
    this.getBenchmarks();
    this.timer = setInterval(this.getRefresh, 5000);
  },
};

</script>
