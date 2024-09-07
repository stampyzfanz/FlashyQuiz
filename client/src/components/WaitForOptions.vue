<template>
    <h1>Question {{ screenState.questionNumber + 1 }}</h1>
    <h2>Look up</h2>

    <div class="progress-bar">
        <ProgressBar :duration="screenState.questionDuration" />
    </div>
</template>

<script>
import ProgressBar from './ProgressBar.vue';

export default {
    name: 'WaitForOptions',
    props: {
        screenState: {
            required: true,
            type: Object
        },
    },
    emits: ["callParentComponent"],
    components: { ProgressBar }
};
</script>

<style scoped>
h2 {
    text-align: center;

    margin-left: 10%;
    margin-right: 10%;
    font-size: 2.5rem;
    height: 110px;
}

.progress-bar {
    width: calc(100vw - 4rem);
    margin-left: 2rem;
    margin-right: 2rem;

    position: absolute;
    bottom: 35px;
}
</style>