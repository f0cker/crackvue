import Vue from 'vue';
import Router from 'vue-router';
import CrackQ from './components/CrackQ.vue';
import Login from './components/Login.vue';
import Logout from './components/Logout.vue';
import Queues from './components/Queues.vue';
import Complete from './components/Complete.vue';
import Failed from './components/Failed.vue';
import Reports from './components/Reports.vue';
import Tasks from './components/Tasks.vue';
import Report from './components/Report.vue';
import Admin from './components/Admin.vue';
import Profile from './components/Profile.vue';
import Benchmarks from './components/Benchmarks.vue';

Vue.use(Router);

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'CrackQ',
      component: CrackQ,
    },
    {
      path: '/queues',
      name: 'Queues',
      component: Queues,
    },
    {
      path: '/complete',
      name: 'Complete',
      component: Complete,
    },
    {
      path: '/failed',
      name: 'Failed',
      component: Failed,
    },
    {
      path: '/login',
      name: 'Login',
      component: Login,
    },
    {
      path: '/logout',
      name: 'Logout',
      component: Logout,
    },
    {
      path: '/reports',
      name: 'Reports',
      component: Reports,
    },
    {
      path: '/tasks',
      name: 'Tasks',
      component: Tasks,
    },
    {
      path: '/report/:job_id',
      name: 'Report',
      component: Report,
    },
    {
      path: '/admin',
      name: 'Admin',
      component: Admin,
    },
    {
      path: '/profile',
      name: 'Profile',
      component: Profile,
    },
    {
      path: '/benchmarks',
      name: 'Benchmarks',
      component: Benchmarks,
    },
  ],
});
