<template>
  <template v-if="activeScreen === screens.INITIAL">
    <h1>Welcome to <i>Flashy</i> Quiz</h1>
    <p>Choose an option to start</p>

    <div class="initial-options">
      <BigButton :color="Color.RED" @click="openScreen(screens.QUIZ_OPERATION, { userType: UserType.PARTICIPANT })">
        Join
      </BigButton>
      <BigButton :color="Color.BLUE" @click="openScreen(screens.QUIZ_OPERATION, { userType: UserType.QUIZMASTER })">
        Create
      </BigButton>
    </div>
  </template>
  <QuizOperation v-else-if="activeScreen === screens.QUIZ_OPERATION" :userType="screenData.userType"
    @finish="openScreen(screens.INITIAL, {})" />
</template>

<script>
import BigButton from './components/BigButton.vue';
import QuizOperation from './components/QuizOperation.vue';
import UserType from './UserType';
import Color from './Color';

const screens = Object.freeze({
  INITIAL: Symbol("Initial"),
  QUIZ_OPERATION: Symbol("Quiz Operation")
});

export default {
  name: 'App',
  data() {
    return {
      UserType,
      Color,
      screens,
      activeScreen: screens.INITIAL,
      screenData: {}
    }
  },
  components: {
    QuizOperation,
    BigButton,
  },
  methods: {
    /**
     * Opens a screen
     * @param {Symbol} screen 
     * @param {Object} screenData is a record
     */
    openScreen(screen, screenData) {
      this.screenData = screenData;
      this.activeScreen = screen;
    }
  }
}
</script>

<style>
body {
  background-color: #202;
}

body,
html,
#app {
  height: 100%;
  margin: 0px;

  overflow: hidden;
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #fff;
}

h1 {
  text-align: center;
  margin-top: 0px;
  padding-top: 100px;
  font-size: 4em;
}

p {
  text-align: center;
  margin-top: 20px;
  font-size: 2em;
}

.black-text {
  color: #222;
}

.initial-options {
  text-align: center;
  margin-top: 80px;
}

.initial-options>button {
  margin: 50px;

  /* Chat-GPT was used for the syntax & name of the min function */
  width: min(350px, calc(50% - 105px));
  height: 250px;
}

/* The following are rgb values and should thus be wrapped like the following
`#my-red-button {
  background-color: rgb(var(--vibrant-red));
}`

This is so that it can be made transparent

Credit to Chat-GPT for choosing the colours
*/
:root {
  --vibrant-red: 244, 67, 54;
  --vibrant-green: 76, 175, 80;
  --vibrant-blue: 33, 150, 243;
  --vibrant-yellow: 255, 193, 7;
  --mundane-grey: 97, 106, 107;
}
</style>
