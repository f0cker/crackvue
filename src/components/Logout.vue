<template>
    <div>
    </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
    };
  },
  methods: {
    logout() {
      const path = '/api/logout';
      axios.get(process.env.VUE_APP_BASE_URL + path)
        .then((res) => {
          this.options = res.data;
          if (res.status === 200) {
            window.location.href = 'login';
          }
        })
        .catch((error) => {
          this.show_msg = true;
          if (error.response.status !== 200) {
            this.message = 'Error logging out';
          } else {
            // eslint-disable-next-line
            console.error(error);
          }
        });
    },
  },
  created() {
    this.logout();
  },
};
</script>
