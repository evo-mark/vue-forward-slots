<template>
    <div>
        <DataDisplay :data="props.deepObject" />
        <button @click="emit('update')">Update</button>
    </div>
</template>

<script setup>
import DataDisplay from './DataDisplay.vue';

const emit = defineEmits(["update"]);
const props = defineProps({
    deepObject: {
        type: Object,
        default: () => ({})
    }
})
</script>

<style lang="scss" scoped>

</style>