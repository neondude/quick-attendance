import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import { ref } from "vue";
import DemoCounter from "../DemoCounter.vue";

function mountWithState(count = 0) {
  const state = ref({ count });
  const dispatched = [];
  const dispatch = (action) => dispatched.push(action);
  return {
    wrapper: mount(DemoCounter, {
      global: {
        provide: { state, dispatch },
      },
    }),
    state,
    dispatched,
  };
}

describe("DemoCounter", () => {
  it("renders the current count", () => {
    const { wrapper } = mountWithState(5);
    expect(wrapper.text()).toContain("5");
  });

  it("dispatches INCREMENT when + is clicked", async () => {
    const { wrapper, dispatched } = mountWithState();
    await wrapper.find("button.btn-primary").trigger("click");
    expect(dispatched).toContainEqual({ type: "INCREMENT" });
  });

  it("dispatches DECREMENT when − is clicked", async () => {
    const { wrapper, dispatched } = mountWithState();
    await wrapper.find("button.btn-outline-secondary").trigger("click");
    expect(dispatched).toContainEqual({ type: "DECREMENT" });
  });

  it("dispatches RESET when Reset is clicked", async () => {
    const { wrapper, dispatched } = mountWithState(3);
    await wrapper.find("button.btn-outline-danger").trigger("click");
    expect(dispatched).toContainEqual({ type: "RESET" });
  });
});
