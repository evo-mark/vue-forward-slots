<template>
	<div>
		<p>First Level Reporting</p>
		<ForwardSlots :slots="$slots" :except="[/^item.*/i]">
			<SecondLevel />
		</ForwardSlots>
	</div>
</template>

<script setup>
import { ForwardSlots } from "@evomark/vue-forward-slots";
import SecondLevel from "./Second.vue";
</script>
