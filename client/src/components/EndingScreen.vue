<template>
    <h1>Congratulations!</h1>
    <h2 v-if="screenState.userType === UserType.QUIZMASTER">
        You have all reached the end of the quiz and tried your best, which is what counts!
        <br />
        <br />
        Click the button below to return to the home screen and let the fun continue!
    </h2>
    <h2 v-else>
        Click the button below to return to the home screen and let the fun continue!
    </h2>

    <BigButton :color="Color.GREEN" @click="goHome()" id="home-button">
        Home
    </BigButton>
</template>

<script>
import Color from '@/Color';
import UserType from '@/UserType';
import BigButton from './BigButton.vue';
// Chat-GPT was used to create the text above

export default {
    name: "EndingScreen",
    data() {
        return {
            Color,
            UserType
        };
    },
    methods: {
        goHome() {
            if (this.screenState.userType === this.UserType.QUIZMASTER) {
                this.$socketUtil.socket.emit("close leaderboard");
            }

            this.$emit("callParentComponent", "finish");
        }
    },
    emits: ["callParentComponent"],
    props: {
        screenState: {
            required: true,
            type: Object
        },
    },
    components: { BigButton }
};
</script>

<style scoped>
h2 {
    text-align: center;

    margin-left: 10%;
    margin-right: 10%;
    font-size: 1.5rem;
    height: 110px;
}

#home-button {
    margin: 0;
    position: absolute;
    left: 50%;
    top: 500px;
    -ms-transform: translate(-50%, -50%);
    transform: translate(-50%, -50%);
}

h1 {
    text-align: center;
    margin-top: 0px;
    padding-top: 100px;
    font-size: 4em;
}
</style>