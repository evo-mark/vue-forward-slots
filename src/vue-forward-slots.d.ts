import { DefineComponent, Slot } from "vue";

export interface ForwardSlotsProps {
	slots: {
		[name: string]: Slot | undefined;
	};
	only?: string | string[];
	except?: string | string[];
	inheritAttrs: boolean;
	inheritDirectives: boolean;
	filterNative: boolean;
}

export const ForwardSlots: DefineComponent<ForwardSlotsProps>;
