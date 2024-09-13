<template>
	<div>
		Second received slots: {{ Object.keys($slots).length ? Object.keys($slots).join(", ") : "None" }}
		<slot></slot>
		<slot name="one"></slot>
		<slot name="item.test"></slot>
	</div>
</template>

<script setup></script>
