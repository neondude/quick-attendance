// Import Bootstrap CSS via SCSS
import "./scss/styles.scss";
import * as bootstrap from "bootstrap";
import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import { seedDevelopmentData } from "./seedDevelopmentData";

async function startApp() {
	const url = new URL(window.location.href);
	const shouldSeed = import.meta.env.DEV && url.searchParams.get("seed") === "1";

	if (shouldSeed) {
		try {
			await seedDevelopmentData();
		} catch (error) {
			console.error("[seed] Failed to seed development data", error);
		}

		url.searchParams.delete("seed");
		window.history.replaceState({}, "", url.toString());
	}

	createApp(App).use(router).mount("#app");
}

startApp();
