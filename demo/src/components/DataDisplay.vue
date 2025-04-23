<template>
    <div>
        {{ data.linePrice.exc_tax }}
    </div>
</template>

<script setup>
const { data } = defineProps({
    data: {
        type: Object,
        required: true
    }
})
</script>

<style lang="scss" scoped>

</style>