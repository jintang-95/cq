import Vue from "vue";
import Antd, { message } from "ant-design-vue";

import App from "./App.vue";
import router from "./router";
import store from "./store";

import "ant-design-vue/dist/antd.css";

Vue.use(Antd);
Vue.prototype.$message = message;
Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount("#app");
