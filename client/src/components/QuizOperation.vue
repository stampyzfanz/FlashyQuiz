<template>
    <component :is="activeScreen" v-bind:screenState="screenState" @callParentComponent="executeMethod">
    </component>
    <FastLoadingIcon v-if="isLoading" top="85%" speed="1500" />
</template>

<script>
import { shallowRef } from 'vue';

import Util from '@/util';
import UserType from '@/UserType';

import EnterCode from './EnterCode.vue';
import AnswerOptionsScreen from './AnswerOptionsScreen.vue';
import QuizLobby from './QuizLobby.vue';
import ParticipantLobby from './ParticipantLobby.vue';
import FastLoadingIcon from './FastLoadingIcon.vue';
import IsCorrectAnswer from './IsCorrectAnswer.vue';
import QuizQuestion from './QuizQuestion.vue';
import WaitForOptions from './WaitForOptions.vue';
import EndingScreen from './EndingScreen.vue';

const components = {
    EnterCode, ParticipantLobby, IsCorrectAnswer, AnswerOptionsScreen, WaitForOptions, // mostly participants
    QuizLobby, QuizQuestion, // mostly quiz masters
    EndingScreen,
    FastLoadingIcon // can't be activeScreen
}

export default {
    name: 'QuizOperation',
    data() {
        return {
            activeScreen: null,
            /**
             * Will contain data that is only needed for the active screen
             * @type {Object}
             */
            screenData: {},
            /**
             * Will contain data that needs to persist for the entire quiz
             * @type {Object}
             */
            quizData: {},
            isLoading: false,
            hasStarted: false
        };
    },
    props: {
        userType: Util.createEnumProperty(UserType)
    },
    emits: ["finish"],
    /**
     * Initialises the quiz's operation
     */
    async created() {
        // Sets initial screen and data depending on type of user
        if (this.userType === UserType.QUIZMASTER) {
            this.screenData.players = [];
            this.activeScreen = shallowRef(QuizLobby);
        } else {
            this.activeScreen = shallowRef(EnterCode);
        }

        // Connects to server and tells it the type of user
        this.$socketUtil.connect();
        this.$socketUtil.socket.emit("user type", this.userType);

        // If its the quiz master, request the quiz code and handle when players join
        if (this.userType === UserType.QUIZMASTER) {
            this.isLoading = true;

            // Artificially create a delay to make software more intuitive 
            const delayPromise = new Promise((resolve) => {
                setTimeout(resolve, 420);
            });

            this.$socketUtil.socket.once("quiz code", async quizCode => {
                await delayPromise;
                this.quizData.quizCode = quizCode;
                this.isLoading = false;
            });

            this.$socketUtil.socket.on("new player", this.newPlayerJoins);
        }



        // Allow server to notify client to update GUI and data
        this.$socketUtil.socket.on("change screen", this.changeScreen);
        this.$socketUtil.socket.on("change screen data", this.changeScreenData);
    },
    methods: {
        /**
         * Allows the active screen to execute a method on this class without
         * having to manually expose each method to the active screen in the template
         * @param {String} method 
         * @param  {...any} args 
         */
        executeMethod(method, ...args) {
            this[method](...args);
        },
        /**
         * Executes when a participant enters the quiz, and sets their name
         * While unfinished, the name was intended to be shown on their screen
         * @param {String} name 
         */
        enterQuiz(name) {
            this.quizData.name = name;
            this.activeScreen = shallowRef(ParticipantLobby);
        },
        /**
         * Allows the quiz master to start the quiz
         */
        startQuiz() {
            this.$socketUtil.socket.emit("startQuiz");
            this.hasStarted = true;
            this.isLoading = true;
        },
        /**
         * Tells the quizmaster when a participant enters the quiz
         * While unfinished, the player's name itself 
         * was intended to be shown on their screen in a list
         * @param {String} name 
         */
        newPlayerJoins(name) {
            if (this.activeScreen.name === "QuizLobby") {
                this.screenData.players.push(name);
            }
        },
        /**
         * Tells the server the option that the participant has selected
         * @param {Number} optionNumber integer
         */
        selectOption(optionNumber) {
            this.$socketUtil.socket.emit("answer", optionNumber);
        },

        /**
         * Allows the server to change the client's active screen
         * @param {String} screen 
         * @param {Object} specificScreenData 
         */
        changeScreen(screen, specificScreenData) {
            console.log("Change screen", screen, specificScreenData)
            this.isLoading = false;
            this.screenData = specificScreenData ?? {};
            this.activeScreen = shallowRef(components[screen]);
        },

        /**
         * Allows the server to change any property of the scree's current data
         * @param {String} key 
         * @param {Any} value
         */
        changeScreenData(key, value) {
            console.log("Change screen data", key, value);
            this.isLoading = false;
            this.screenData[key] = value;
        },

        /**
         * Tells parent component that the quiz has finished operation
         */
        finish() {
            this.$emit("finish");
        }
    },
    computed: {
        /**
         * Allows the active screen to only need to access a single variable for data
         */
        screenState() {
            return {
                ...this.screenData,
                ...this.quizData,
                userType: this.userType
            }
        }
    },
    components
};
</script>

<style scoped>
footer {
    /* This css ruleset was generated using Chat-GPT */
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    background-color: black;
    color: white;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px;
}
</style>