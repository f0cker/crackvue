<template>
  <b-container
    fluid
    class="report"
    style="min-width: 1300px">
  <html>
     <head class="report">
       <title>
         CrackQ Password Analysis Report
       </title>
     </head>
      <body>
        <br><br>
          <b-card
          class="report-head bg-light">
          <div>
          <h4>CrackQ Password Analysis Report</h4>
        </div>
      </b-card>
        <br><br>
        <b-card
          style="min-width: 1200px"
          class="report-card"
          align="center">
          <div id="overview"
            class="report">
          <img :src=report.donut width="1000" height="700"/>
        </div>
      </b-card>
      <br><br>
      <b-card
        header="AD Analysis Stats"
        class="report-card mx-auto"
        style="max-width: 70rem">
        <div class="report">
          <b-table
          class="report text-secondary"
          hover
          label="AD Stats"
          width="100px" height="150"
          stacked
          :items="Object.entries(report.ad_stats)"
          small
        ></b-table>
        </div>
      </b-card>
      <br><br>
      <b-card
        class="report-card"
        align="center">
        <br><br>
          <div id="vis1"
            class="report">
        </div>
        <br><br>
        <div id="vis2" class="report">
        </div>
        <br><br>
        <div id="vis3" align="center" class="report">
        </div>
        <br><br>
        <div id="vis4" align="center" class="report">
        </div>
        <br><br>
        <div id="vis5" align="center" class="report">
        </div>
      </b-card>
      <br><br>
        <b-card
        style="min-width: 1200px"
        class="report-card"
        align="center">
        <div id="vis6"
          align="center">
        </div>
      </b-card>
      <br><br>
      </body>
  </html>
</b-container>
</template>

<style>
.report-head {
    background: bg-light !important;
    color: black !important;
    text: black !important;
    text-align: center;
    font-weight: "bold" !important;
    font-family: "Arial" !important;
    box-shadow: 0px 0px 2px 2px rgba(200, 200, 200, .7) !important;
    border-style: none !important;
    }
.report {
    background-color: white !important;
    background: white !important;
    color: black !important;
    text: black !important;
    text-align: center;
    font-weight: "bold" !important;
    font-family: "Arial" !important;
    border-color: black !important;
    }
.report-card {
    background-color: white !important;
    background: white !important;
    color: black !important;
    text: black !important;
    text-align: center;
    font-weight: "bold" !important;
    font-family: "Arial" !important;
    box-shadow: 0px 0px 2px 2px rgba(200, 200, 200, .7) !important;
    border-style: none !important;
    }
.table.report tr:hover {
  color: rgba(0, 0, 0, 1) !important;
  }
</style>
<style scoped>
head {
    margin: 0px;
    padding: 0px;
    background-color: grey !important;
    background: white !important;
    color: black !important;
    text: black !important;
    text-align: center;
    align: center;
    }
body {
    background-color: white !important;
    background: white !important;
    color: black !important;
    align: center;
    }
</style>
<script>
import axios from 'axios';
import vegaEmbed from 'vega-embed';

export default {
  name: 'showReport',
  props: {
    jobID: String,
  },
  data() {
    return {
      reportQueue: [],
      report: {},
      message: '',
      show_msg: false,
    };
  },
  methods: {
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
    getReport(jobID) {
      const path = '/api/reports';
      const jobid = jobID.substring(0, jobID.length - 7);
      const payload = { params: { job_id: jobid } };
      axios.get(process.env.VUE_APP_BASE_URL + path, payload)
        .then((res) => {
          this.report = res.data;
          vegaEmbed('#vis1', this.report.topx_chart);
          vegaEmbed('#vis2', this.report.len_chart);
          vegaEmbed('#vis3', this.report.base_chart);
          vegaEmbed('#vis4', this.report.country_chart);
          vegaEmbed('#vis5', this.report.city_chart);
          vegaEmbed('#vis6', this.report.city_gps_chart);
        })
        .catch((error) => {
          if (error.response.status === 401) {
            this.$router.push('/login');
          }
        });
    },
  },
  created() {
    const jobid = this.$router.currentRoute.params.job_id;
    this.getReport(jobid);
  },
};

</script>
