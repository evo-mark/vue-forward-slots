import {
	defineComponent,
	h,
	PropType,
	Slot,
	VNode,
	VNodeProps,
	Fragment,
	getCurrentInstance,
	withDirectives,
	type DirectiveArguments,
} from "vue";

type SlotOption = string | RegExp | (string | RegExp)[];

type Slots = {
	[name: string]: Slot | undefined;
};

interface ForwardSlotsProps {
	slots: Slots;
	only?: SlotOption;
	except?: SlotOption;
	inheritAttrs: boolean;
	inheritDirectives: boolean;
	filterNative: boolean;
}

function directivesToArguments(directives: NonNullable<VNode["dirs"]>): DirectiveArguments {
	return directives.map((binding) => [binding.dir, binding.value, binding.arg, binding.modifiers]);
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
			if (slotFunction) {
				result[slotName] = (args: any) => slotFunction(args);
			}
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
): VNode | undefined {
	if (!component) return undefined;
	else return h(component, attrs, createSlots(slots, options, nativeSlots));
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
		inheritDirectives: {
			type: Boolean,
			default: false,
		},
		filterNative: {
			type: Boolean,
			default: false,
		},
	},
	setup(props: ForwardSlotsProps, { slots, attrs }) {
		const instance = getCurrentInstance();

		const createNodeArray = (node: VNode): undefined | VNode | VNode[] => {
			if (node.type === Fragment && Array.isArray(node.children) && node.children?.length) {
				return (node.children as VNode[]).map(createNodeArray) as VNode[];
			}
			const nativeSlots = Object.keys(node.children ?? {});
			const slots = Object.assign({}, props.slots, node.children);
			const passthruAttrs = props.inheritAttrs ? attrs : {};
			return createComponent(node, props, slots, passthruAttrs as VNodeProps, nativeSlots);
		};

		return () => {
			const defaultSlots = slots.default && typeof slots.default === "function" ? slots.default() : [];
			const directives = instance?.vnode.dirs;
			const nodes = defaultSlots.map(createNodeArray);
			if (!directives?.length || !props.inheritDirectives) {
				instance!.vnode.dirs = null;
				return nodes;
			}
			const directiveArguments = directives ? directivesToArguments(directives) : undefined;
			const applyDirectives = (node: VNode | undefined): VNode | undefined => {
				if (!node) return undefined;
				else return withDirectives(node, directiveArguments ?? []);
			};
			const apply = (node: undefined | VNode | VNode[]): undefined | VNode | VNode[] => {
				return Array.isArray(node) ? (node.map(apply) as VNode[]) : applyDirectives(node);
			};
			instance!.vnode.dirs = null;
			return nodes.map(apply).filter(Boolean);
		};
	},
});
