<template>
    <h1>Code: {{ screenState.quizCode ?? 'loading...' }}</h1>

    <h2>{{ numberOfPlayersText }}</h2>

    <BigButton id="start-button" :color="this.screenState.players.length === 0 ? Color.GREY : Color.YELLOW"
        @click="startQuiz" :disabled="this.screenState.players.length === 0">
        Start
    </BigButton>
</template>

<script>
import BigButton from './BigButton.vue';
import Color from '@/Color';

export default {
    name: "QuizLobby",
    emits: ["callParentComponent"],
    props: {
        screenState: {
            required: true,
            type: Object
        },
    },
    data() {
        return {
            Color
        };
    },
    computed: {
        /**
         * 
         * @returns {string} that communicates how many players are currently in the quiz
         */
        numberOfPlayersText() {
            if (this.screenState.players.length === 0) {
                return 'There are no players waiting to start';
            } else if (this.screenState.players.length === 1) {
                return 'There is one player waiting to start';
            } else {
                return "There are " + this.screenState.players.length
                    + " players waiting to start";
            }
        }
    },
    methods: {
        startQuiz() {
            this.$emit("callParentComponent", "startQuiz");
        }
    },
    components: { BigButton }
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

/* adapted from https://www.w3schools.com/howto/howto_css_center_button.asp */
#start-button {
    margin: 0;
    position: absolute;
    left: 50%;
    top: 460px;
    -ms-transform: translate(-50%, -50%);
    transform: translate(-50%, -50%);
}
</style>