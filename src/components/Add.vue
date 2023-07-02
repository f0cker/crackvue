<template>
  <div>
    <b-modal ref="addJobModal"
            id="job-modal"
            title="Add a new job"
            hide-footer>
      <b-form @reset="onReset" @submit="onSubmit" class="w-100">
        <b-form-group id="form-name-group"
                    label="Job Name:"
                    label-for="form-name-input">
          <b-form-input id="form-name-input"
                        type="text"
                        v-model="addJobForm.name"
                        required
                        placeholder="Enter Job Name">
          </b-form-input>
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
        <b-form-group id="form-hashmode-group"
                    label="Hash Mode:"
                    label-for="form-hashmode-input">
          <b-form-select id="form-hashmode-input"
                        :options="options['Hash Modes']"
                        v-model="addJobForm.hash_mode"
                        required
                        placeholder="Enter Hash Mode">
          </b-form-select>
          <div class="mt-3">Selected: <strong>{{ addJobForm.hash_mode }}</strong></div>
        </b-form-group>
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
        <b-form-group id="form-mask-group"
                    label="Mask:"
                    label-for="form-mask-input">
          <b-form-input id="form-name-input"
                        type="text"
                        v-model="addJobForm.mask"
                        placeholder="Enter Mask For Brute Mode">
          </b-form-input>
        </b-form-group>
        <b-form-group id="form-options-group">
          <b-form-checkbox
          v-model="addJobForm.username">
          Show usernames
          </b-form-checkbox>
          <b-form-checkbox
          v-model="addJobForm.notify">
          Send notification email
          </b-form-checkbox>
        </b-form-group>
        <b-button-group>
          <b-button type="submit" variant="primary">Submit</b-button>
          <b-button type="reset" variant="danger">Reset</b-button>
        </b-button-group>
      </b-form>
    </b-modal>
  </div>
</template>

<style>
.crackq{
    margin: 0px;
    padding: 0px;
    background-color: rgba(71, 79, 86, 0.9);
    border-color: rgba(71, 79, 86, 0.9);
    color: white;
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
    background-color: rgba(71, 79, 86, 0.9);
    color: white;
    }
</style>

<script>
import axios from 'axios';
import { saveAs } from 'file-saver';

export default {
  name: 'addJob',
  props: {
    jobID: String,
  },
  data() {
    return {
      job_details: {},
    };
  },
  methods: {
    fileSaver(fileName, data) {
      const blob = new Blob([data['HC State'].Cracked.join('\r\n')], { type: 'text/plain;charset=utf-8' });
      saveAs(blob, fileName);
    },
    getJob(jobID) {
      const path = '/api/queuing/';
      axios.get(process.env.VUE_APP_BASE_URL + path + jobID)
        .then((res) => {
          if (res.status === 200) {
            // this.show_msg = true;
            this.job_details = res.data;
          }
        })
        .catch((error) => {
          this.show_msg = true;
          if (error.response.status === 401) {
            this.message = 'Unauthorized';
          } else if (error.response.status !== 200) {
            this.message = 'Error getting job details';
            this.variant = 'danger';
            this.show_msg = true;
          }
        });
    },
  },
};
</script>
