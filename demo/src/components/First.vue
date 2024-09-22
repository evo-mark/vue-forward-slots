<template>
	<div>
		<p>First Level Reporting</p>
		<ForwardSlots :slots="$slots" :only="['item.test']">
			<SecondLevel>
				<div>Hello World</div>
			</SecondLevel>
		</ForwardSlots>
	</div>
</template>

<script setup>
import { ForwardSlots } from "@evomark/vue-forward-slots";
import SecondLevel from "./Second.vue";
</script>
