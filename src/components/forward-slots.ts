import { computed, defineComponent, h, PropType, Slot, VNode, VNodeProps } from "vue";

type SlotOption = string | RegExp | (string | RegExp)[];

type Slots = {
	[name: string]: Slot | undefined;
};

interface ForwardSlotsProps {
	slots: Slots;
	only?: SlotOption;
	except?: SlotOption;
	inheritAttrs: boolean;
	filterNative: boolean;
}

function isValidSlotOption(value: any): value is SlotOption {
	return typeof value === "string" || value instanceof RegExp || Array.isArray(value);
}

function wrap(input: any): string[] {
	if (!Array.isArray(input)) {
		input = [input];
	}

	return input.filter(Boolean);
}

function createSlots(slots: Slots, options: ForwardSlotsProps, nativeSlots: string[]) {
	const include = wrap(options.only);
	const exclude = wrap(options.except);

	return Object.entries(slots)
		.filter(([slotName]) => shouldIncludeSlot(slotName, include, exclude, nativeSlots, options.filterNative))
		.reduce((result, [slotName, slotFunction]) => {
			result[slotName] = (args: any) => slotFunction(args);
			return result;
		}, {} as Slots);
}

function resolveSlotInclusionExpression(expression: string | RegExp): string | RegExp {
	if (expression instanceof RegExp) return expression;
	else {
		const maybeRegex = expression
			.replace(/[-\/\\^$+?.()|[\]{}]/g, "\\$&")
			.replace(/^\*/, ".*")
			.replace(/\*$/, ".*");
		return maybeRegex.includes(".*") ? new RegExp(`^${maybeRegex}$`) : expression;
	}
}

function shouldIncludeSlot(
	key: string,
	include: (string | RegExp)[],
	exclude: (string | RegExp)[],
	nativeSlots: string[],
	filterNative: boolean,
): boolean {
	if (include.length) {
		return include.some((item) => {
			item = resolveSlotInclusionExpression(item);
			if (nativeSlots.includes(key) && filterNative !== true) return true;
			else if (item instanceof RegExp) return item.test(key);
			else return item === key;
		});
	}

	return exclude.every((item) => {
		item = resolveSlotInclusionExpression(item);
		if (nativeSlots.includes(key) && filterNative !== true) return true;
		else if (item instanceof RegExp) return item.test(key) === false;
		else return item !== key;
	});
}

function createComponent(
	component: VNode | undefined,
	options: ForwardSlotsProps,
	slots: Slots,
	attrs: VNodeProps,
	nativeSlots: string[],
): VNode {
	return h(component, attrs, createSlots(slots, options, nativeSlots));
}

export const ForwardSlots = defineComponent({
	name: "ForwardSlots",
	inheritAttrs: false,
	props: {
		slots: {
			type: Object as PropType<Slots>,
			default: () => ({}),
			required: true,
		},
		only: {
			type: [String, RegExp, Array] as PropType<SlotOption>,
			default: () => [] as SlotOption,
			validator: isValidSlotOption,
		},
		except: {
			type: [String, RegExp, Array] as PropType<SlotOption>,
			default: () => [] as SlotOption,
			validator: isValidSlotOption,
		},
		inheritAttrs: {
			type: Boolean,
			default: true,
		},
		filterNative: {
			type: Boolean,
			default: false,
		},
	},
	setup(props: ForwardSlotsProps, { slots, attrs }) {
		const children = computed(() => slots.default?.() || []);

		return () =>
			children.value.map((node: VNode) => {
				const nativeSlots = Object.keys(node.children ?? {});
				const slots = Object.assign({}, props.slots, node.children);
				const passthruAttrs = props.inheritAttrs ? attrs : {};
				return createComponent(node, props, slots, passthruAttrs, nativeSlots);
			});
	},
});
