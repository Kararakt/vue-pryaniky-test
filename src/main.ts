import './scss/index.scss';

import App from './App.vue';
import router from './router/router';

import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { faX, faTrash, faPenToSquare } from '@fortawesome/free-solid-svg-icons';

const app = createApp(App);

library.add(faX, faTrash, faPenToSquare);

app.use(router).component('font-awesome-icon', FontAwesomeIcon).mount('#app');
