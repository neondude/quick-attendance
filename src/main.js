// Import Bootstrap CSS via SCSS
import "./scss/styles.scss";
import * as bootstrap from "bootstrap";
import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";

createApp(App).use(router).mount("#app");
