<template>
    <!-- 
        Note that the icons are sourced from 
        Font Awesome by Dave Gandy - http://fontawesome.io"
     -->
    <div v-if="screenState.isCorrect" id="result">
        <h1>Correct</h1>
        <i id="icon" class="fa-solid fa-circle-check"></i>
        <p>Congratulations! Keep up the good work</p>
    </div>
    <div v-else id="result">
        <h1>Incorrect</h1>
        <i id="icon" class="fa-solid fa-circle-xmark"></i>
        <p>Better luck next time</p>
    </div>
</template>

<script>
export default {
    name: 'IsCorrectAnswer',
    emits: ["callParentComponent"],
    props: {
        screenState: {
            required: true,
            type: Object
        },
    },
    /**
     * Changes background colour in a simple way, as recomended by Ezra Siton
     * https://stackoverflow.com/questions/65418203/having-a-hard-time-changing-background-color-in-vue-js
     * However, more modern lifecycle hooks were used as recomended by Vue
     * https://vuejs.org/guide/essentials/lifecycle.html#lifecycle-diagram
     */
    mounted() {
        if (this.screenState.isCorrect) {
            document.body.style.backgroundColor = "#00a30b";
        } else {
            document.body.style.backgroundColor = "#d11f1f";
        }
    },
    unmounted() {
        document.body.style.backgroundColor = "#202";
    },
};
</script>

<style scoped>
#result {
    text-align: center;
    margin-left: 20%;
    margin-right: 20%;
    font-size: 1.5rem;
}

#icon {
    font-size: 128px;
    margin-bottom: 64.32px;
}
</style>