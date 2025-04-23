<template>
	<div>
		<a href="https://vitejs.dev" target="_blank">
			<img src="/vite.svg" class="logo" alt="Vite logo" />
		</a>
	</div>
	<FirstLevel>
		Default
		<template #one> One </template>
		<template #item.test> Wildcard Test</template>
	</FirstLevel>
	<ForwardSlots :slots="$slots">
		<Fragment v-for="n in 5" :key="n">
			{{ n }}
		</Fragment>
	</ForwardSlots>
	<div v-for="n in 3" :key="n">
		<slot name="testing">
			<ForwardSlots :slots="$slots" only="item.*" foo="bar">
				<TestDeepItem v-bind="dummyData" :deep-object="testObject" @update="changeTestObject"></TestDeepItem>
			</ForwardSlots>
		</slot>
	</div>
	{{  testObject.linePrice }}
</template>

<script setup>
import { ref } from "vue";
import { ForwardSlots } from "@evomark/vue-forward-slots";
import Fragment from "./components/Fragment.vue";
import FirstLevel from "./components/First.vue";
import TestDeepItem from "./components/DeepItem.vue";

const testObject = ref({
	id: 53,
	addon_parent_id: null,
	product: {
		id: 1,
		name: "Barber's Mate GBBA Talc",
		brand: null,
		slug: "barbers-mate-gbba-talc",
		cartImage: {
			id: 28,
			mediaable_type: "AdminUI\\AdminUI\\Models\\Admin",
			mediaable_id: 2,
			user_id: null,
			disk: "public",
			name: "talc-barbers-mate",
			extension: "jpg",
			media_folder_id: 5,
			title: "Talc - Barber's Mate",
			alt: "Talc - Barber's Mate",
			media_size: "278595",
			caption: null,
			description: null,
			width: 2048,
			height: 2048,
			created_at: "2023-04-26T13:31:23.000000Z",
			updated_at: "2023-04-26T13:33:01.000000Z",
			deleted_at: null,
			links: {
				default: "http://miketayloreducation.evo/media/Products/default/talc-barbers-mate.jpg",
				medium: "http://miketayloreducation.evo/media/Products/medium/talc-barbers-mate.jpg",
				small: "http://miketayloreducation.evo/media/Products/small/talc-barbers-mate.jpg",
				tiny: "http://miketayloreducation.evo/media/Products/tiny/talc-barbers-mate.jpg",
				thumbnail:
					"http://miketayloreducation.evo/media/Products/thumbnail/talc-barbers-mate.jpg"
			},
			pivot: { product_id: 1, media_id: 28, is_featured: true },
			folder: {
				id: 5,
				path: "Products",
				parent_folder: null,
				name: "Products",
				created_at: "2023-03-02T10:08:33.000000Z",
				updated_at: "2023-03-02T10:08:33.000000Z"
			}
		},
		onSale: false,
		stockDisplay: false,
		stock: {
			qty: 99999999,
			allocated: 0,
			available: 99999999,
			label: "In Stock",
			message: "In Stock",
			class: "success"
		}
	},
	notes: "",
	quantity: 1,
	itemPrice: { exc_tax: 1200, inc_tax: 1200, tax: 0, tax_rate: 0, tax_multiplier: 1 },
	linePrice: { exc_tax: 1200, inc_tax: 1200, tax: 0, tax_rate: 0, tax_multiplier: 1 },
	lineDiscount: null,
	lineWeight: 100,
	taxRate: 0
});


const dummyData = {
	foo: "bar",
	fizz: "buzz"
}
const changeTestObject = async () => {
	console.log("updating")
	await new Promise((resolve) => setTimeout(resolve,4000));
	testObject.value.linePrice.exc_tax += 10;
}
</script>

<style scoped>
.logo {
	height: 6em;
	padding: 1.5em;
	will-change: filter;
	transition: filter 300ms;
}
.logo:hover {
	filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
	filter: drop-shadow(0 0 2em #42b883aa);
}
</style>
