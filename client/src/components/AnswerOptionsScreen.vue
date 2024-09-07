<template>
    <AnswerOptions :options="screenState.options" :correctAnswerIndex="screenState.correctAnswerIndex"
        @selectOption="selectOption" :disabled="false" />
</template>

<script>
import AnswerOptions from './AnswerOptions.vue';

export default {
    name: "AnswerOptionsScreen",
    emits: ["callParentComponent"],
    props: {
        screenState: {
            required: true,
            type: Object
        },
    },
    methods: {
        selectOption(...args) {
            this.$emit("callParentComponent", "selectOption", ...args)
        }
    },
    components: { AnswerOptions }
};
</script>

<style scoped></style>