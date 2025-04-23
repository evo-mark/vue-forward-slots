<template>
	<div>
		<p>First Level Reporting</p>
		<ForwardSlots :slots="$slots" :only="['item.test']">
			<SecondLevel :message="message">
				<div>{{  message }}</div>
			</SecondLevel>
		</ForwardSlots>
	</div>
</template>

<script setup>
import { ref, computed } from "vue";
import { ForwardSlots } from "@evomark/vue-forward-slots";
import SecondLevel from "./Second.vue";

const messages = ["Hello World","This is just a dream on New Year's Day","No power in the verse"];
const messageId = ref(0);
const message = computed(() => messages[messageId.value]);

setInterval(() => {
	let target = messageId.value + 1;
	if (target >= messages.length - 1) {
		target = 0;
	}
	messageId.value = target;
}, 4000)
</script>
