import Vue from 'vue';
import App from './App.vue';
import './registerServiceWorker';

Vue.config.productionTip = false;
Vue.deferredPrompt = null;

window.addEventListener('beforeinstallprompt', e => {
  e.preventDefault();
  Vue.deferredPrompt = e;
});

new Vue({
  render: function (h) { return h(App) }
}).$mount('#app');
