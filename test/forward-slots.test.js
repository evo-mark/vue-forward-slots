import { expect, test, describe, vi } from "vitest";
import { mount } from "@vue/test-utils";
import { ForwardSlots } from "../src";
import { h } from "vue";

const mockSlots = {
	prepend: () => h("span", { id: "prepend" }, "Before the world"),
	"prepend.one": () => h("span", { id: "prepend-one" }, "One"),
	"prepend.two": () => h("span", { id: "prepend-two" }, "Two"),
	default: () => h("span", { id: "mock" }, "Hello world"),
	append: () => h("span", { id: "append" }, "After the world"),
};

describe("forwarding slots", () => {
	test("passes through the default slot", () => {
		const Inner = {
			setup(_, { slots }) {
				return () => h("div", { id: "inner" }, slots);
			},
		};
		const wrapper = mount(ForwardSlots, {
			props: {
				slots: mockSlots,
			},
			slots: {
				default: () => h(Inner),
			},
		});

		expect(wrapper.html()).toContain("Hello world");
	});

	test("passes through named slots", () => {
		const Inner = {
			setup(_, { slots }) {
				return () => [
					h("div", { id: "prepend-slot" }, slots?.prepend()),
					h("div", { id: "default-slot" }, slots.default()),
					h("div", { id: "append-slot" }, slots?.append()),
				];
			},
		};
		const wrapper = mount(ForwardSlots, {
			props: {
				slots: mockSlots,
			},
			slots: {
				default: () => h(Inner),
			},
		});

		expect(wrapper.html()).toContain("Before the world");
		expect(wrapper.html()).toContain("Hello world");
		expect(wrapper.html()).toContain("After the world");
	});
});

describe("forwarding attributes", () => {
	const Inner = {
		name: "Inner",
		props: {
			foo: {
				type: String,
				required: true,
			},
		},
		setup(props, { slots }) {
			return () => h("div", { id: "inner" }, { ...slots });
		},
	};

	test("passes through all attributes by default", () => {
		const wrapper = mount(ForwardSlots, {
			props: {
				slots: mockSlots,
				foo: "bar",
			},
			slots: {
				default: () => h(Inner),
			},
		});

		const component = wrapper.findComponent(Inner);

		expect(component.props().foo).toBe("bar");
		expect(wrapper.html()).toContain("Hello world");
	});

	test("passes through all attributes to multiple components", () => {
		const Second = {
			name: "Second",
			props: {
				foo: {
					type: String,
					required: true,
				},
			},
			setup(_, { slots }) {
				return () => h("div", { id: "second" }, { ...slots });
			},
		};
		const wrapper = mount(ForwardSlots, {
			props: {
				slots: mockSlots,
				foo: "bar",
			},
			slots: {
				default: [h(Inner), h(Second)],
			},
		});

		const componentOne = wrapper.findComponent(Inner);
		const componentTwo = wrapper.findComponent(Second);

		expect(componentOne.props().foo).toBe("bar");
		expect(componentTwo.props().foo).toBe("bar");
		expect(wrapper.html()).toContain("Hello world");
	});

	test("disables passthrough of attributes", () => {
		const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});
		const wrapper = mount(ForwardSlots, {
			props: {
				slots: mockSlots,
				foo: "bar",
				inheritAttrs: false,
			},
			slots: {
				default: () => h(Inner),
			},
		});

		const component = wrapper.findComponent(Inner);

		expect(component.props().foo).toBeUndefined();
		expect(wrapper.html()).toContain("Hello world");

		expect(warnSpy).toHaveBeenCalled();
		warnSpy.mockRestore();
	});
});

describe("when using the 'only' prop", () => {
	const Inner = {
		name: "Inner",
		props: {
			foo: {
				type: String,
				required: true,
			},
		},
		setup(props, { slots }) {
			return () => [
				slots?.prepend ? h("div", { id: "prepend-slot" }, slots?.prepend()) : undefined,
				slots?.["prepend.one"] ? h("div", { id: "prepend-one" }, slots["prepend.one"]()) : undefined,
				slots?.["prepend.two"] ? h("div", { id: "prepend-two" }, slots["prepend.two"]()) : undefined,
				slots.default ? h("div", { id: "default-slot" }, slots.default()) : undefined,
				slots?.append ? h("div", { id: "append-slot" }, slots?.append()) : undefined,
			];
		},
	};

	test("excludes other slots", () => {
		const wrapper = mount(ForwardSlots, {
			props: {
				slots: mockSlots,
				only: "default",
				foo: "bar",
			},
			slots: {
				default: () => h(Inner),
			},
		});

		expect(wrapper.html()).not.toContain("Before the world");
	});

	test("includes the named slot", () => {
		const wrapper = mount(ForwardSlots, {
			props: {
				slots: mockSlots,
				only: "default",
				foo: "bar",
			},
			slots: {
				default: () => h(Inner),
			},
		});

		expect(wrapper.html()).toContain("Hello world");
	});

	test("includes multiple named slots", () => {
		const wrapper = mount(ForwardSlots, {
			props: {
				slots: mockSlots,
				only: ["default", "prepend", "append"],
				foo: "bar",
			},
			slots: {
				default: () => h(Inner),
			},
		});

		expect(wrapper.html()).toContain("Before the world");
		expect(wrapper.html()).toContain("Hello world");
		expect(wrapper.html()).toContain("After the world");
	});

	test("includes wildcard matches", () => {
		const wrapper = mount(ForwardSlots, {
			props: {
				slots: mockSlots,
				only: "prepend*",
				foo: "bar",
			},
			slots: {
				default: () => h(Inner),
			},
		});

		expect(wrapper.html()).toContain("Before the world");
		expect(wrapper.html()).toContain("One");
		expect(wrapper.html()).toContain("Two");
		expect(wrapper.html()).not.toContain("Hello world");
		expect(wrapper.html()).not.toContain("After the world");
	});

	test("includes array with regex", () => {
		const wrapper = mount(ForwardSlots, {
			props: {
				slots: mockSlots,
				only: ["default", /ONE$/i],
				foo: "bar",
			},
			slots: {
				default: () => h(Inner),
			},
		});

		expect(wrapper.html()).toContain("Hello world"); // Default
		expect(wrapper.html()).toContain("One"); // Prepend One
		expect(wrapper.html()).not.toContain("Before the world");
		expect(wrapper.html()).not.toContain("Two");
		expect(wrapper.html()).not.toContain("After the world");
	});
});

describe("when using the 'except' prop", () => {
	const Inner = {
		name: "Inner",
		props: {
			foo: {
				type: String,
				required: true,
			},
		},
		setup(props, { slots }) {
			return () => [
				slots?.prepend ? h("div", { id: "prepend-slot" }, slots?.prepend()) : undefined,
				slots?.["prepend.one"] ? h("div", { id: "prepend-one" }, slots["prepend.one"]()) : undefined,
				slots?.["prepend.two"] ? h("div", { id: "prepend-two" }, slots["prepend.two"]()) : undefined,
				slots.default ? h("div", { id: "default-slot" }, slots.default()) : undefined,
				slots?.append ? h("div", { id: "append-slot" }, slots?.append()) : undefined,
			];
		},
	};

	test("excludes the named slot", () => {
		const wrapper = mount(ForwardSlots, {
			props: {
				slots: mockSlots,
				except: "default",
				foo: "bar",
			},
			slots: {
				default: () => h(Inner),
			},
		});

		expect(wrapper.html()).not.toContain("Hello world");
	});

	test("excludes multiple named slots", () => {
		const wrapper = mount(ForwardSlots, {
			props: {
				slots: mockSlots,
				except: ["default", "prepend", "append"],
				foo: "bar",
			},
			slots: {
				default: () => h(Inner),
			},
		});

		expect(wrapper.html()).not.toContain("Before the world");
		expect(wrapper.html()).toContain("One");
		expect(wrapper.html()).toContain("Two");
		expect(wrapper.html()).not.toContain("Hello world");
		expect(wrapper.html()).not.toContain("After the world");
	});

	test("excludes wildcard matches", () => {
		const wrapper = mount(ForwardSlots, {
			props: {
				slots: mockSlots,
				except: "prepend*",
				foo: "bar",
			},
			slots: {
				default: () => h(Inner),
			},
		});

		expect(wrapper.html()).not.toContain("Before the world");
		expect(wrapper.html()).not.toContain("One");
		expect(wrapper.html()).not.toContain("Two");
		expect(wrapper.html()).toContain("Hello world");
		expect(wrapper.html()).toContain("After the world");
	});

	test("excludes array with regex", () => {
		const wrapper = mount(ForwardSlots, {
			props: {
				slots: mockSlots,
				except: ["default", /ONE$/i],
				foo: "bar",
			},
			slots: {
				default: () => h(Inner),
			},
		});

		expect(wrapper.html()).not.toContain("Hello world"); // Default
		expect(wrapper.html()).not.toContain("One"); // Prepend One
		expect(wrapper.html()).toContain("Before the world");
		expect(wrapper.html()).toContain("Two");
		expect(wrapper.html()).toContain("After the world");
	});
});
