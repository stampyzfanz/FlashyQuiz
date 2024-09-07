<template>
    <!-- Question itself -->
    <h2>
        {{ screenState.question }}
    </h2>

    <!-- Options -->
    <AnswerOptions v-if="showOptions" :options="screenState.options" :correctAnswerIndex="screenState.correctAnswerIndex"
        :disabled="true" />

    <div class="progress-bar">
        <ProgressBar v-if="isReflecting" :duration="screenState.reflectionDuration" />
        <ProgressBar v-else-if="showOptions" :duration="screenState.answerDuration" />
        <ProgressBar v-else :duration="screenState.questionDuration" />
    </div>
</template>

<script>
import AnswerOptions from './AnswerOptions.vue';
import ProgressBar from './ProgressBar.vue';

export default {
    name: "QuizQuestion",
    emits: ["callParentComponent"],
    props: {
        screenState: {
            required: true,
            type: Object
        },
    },
    computed: {
        /**
         * Whether or not the options are current shown
         * @return {Boolean}
         */
        showOptions: function () {
            return this.screenState.options !== undefined;
        },
        /**
         * Whether or not the correct answer is displayed and users are left to reflect
         * @return {Boolean}
         */
        isReflecting: function () {
            return this.screenState.correctAnswerIndex !== undefined && this.showOptions;
        }
    },
    components: { AnswerOptions, ProgressBar }
};
</script>

<style scoped>
h2 {
    text-align: center;

    margin-left: 10%;
    margin-right: 10%;
    font-size: 2rem;
    height: 110px;
}

button {
    margin-bottom: 0px !important;
}

.progress-bar {
    width: calc(100vw - 4rem);
    margin-left: 2rem;
    margin-right: 2rem;

    position: absolute;
    bottom: 0px;
    margin-bottom: 35px;
}
</style>