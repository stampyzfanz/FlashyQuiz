<template>
    <div class="options" :class="options[0].length === 0 ? 'fullscreen' : 'smaller'">
        <BigButton v-for="(option, i) in options" :key="'option' + i" :color="getColor(i)" :class="getClass(i)"
            @click="selectOption(i)" :disabled="disabled || hasParticipantAnswered">
            {{ option }}
        </BigButton>
    </div>
</template>

<script>
import Util from '@/util';
import BigButton from './BigButton.vue';
import Color from '@/Color';

export default {
    name: 'AnswerOptions',
    emits: ["selectOption"],
    props: {
        options: {
            required: true,
            type: Array,
            validator: (array) => array.length === 4 && Util.isArrayOfStrings(array)
        },
        correctAnswerIndex: {
            default: undefined,
            type: Number,
            validator: (number) => Number.isInteger(number) && 0 <= number <= 4
        },
        disabled: Boolean
    },
    data() {
        return {
            /*
             * This would only ever be true for the participant
             * and is when the wrong options are greyed out
             */
            hasParticipantAnswered: false
        };
    },
    computed: {
        /**
         * Whether or not the correct answer has been released, 
         * and participants are no longer able to submit answers
         */
        isAnswered() {
            return this.correctAnswerIndex !== undefined;
        },
    },
    methods: {
        /**
         * 
         * @param {Number} optionNumber integer between 0 and 3 inclusive
         * @returns {String} the class that the option should have
         */
        getClass(optionNumber) {
            if (this.hasParticipantAnswered) {
                return "grey";
            } else if (this.isAnswered === false) {
                return "";
            } else if (this.correctAnswerIndex === optionNumber) {
                return "correct";
            } else {
                return "incorrect";
            }
        },
        /**
         * Tells the parent component when an option is selected
         * Note that it doesn't activate when the button is disabled
         * @param {Number} optionNumber integer
         */
        selectOption(optionNumber) {
            this.$emit("selectOption", optionNumber);
            this.hasParticipantAnswered = true;
        },
        /**
         * 
         * @param {Number} optionIndex integer
         * @returns {Symbol} A symbol representing the color
         */
        getColor(optionIndex) {
            switch (optionIndex) {
                case 0: return Color.RED;
                case 1: return Color.GREEN;
                case 2: return Color.BLUE;
                case 3: return Color.YELLOW;
            }
        }
    },
    components: { BigButton }
};
</script>

<style scoped>
.options {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    grid-template-rows: repeat(2, 1fr);
    margin: 2rem;
    grid-gap: 2rem;
}

.fullscreen.options {
    height: calc(100vh - 4rem);
}

.smaller.options {
    height: calc(100vh - 12rem - 40px);
}

.correct {
    filter: brightness(115%);
    transition: filter 1s;
}

.incorrect {
    filter: opacity(30%);
    transition: filter 1s;
}

.grey {
    filter: grayscale(100%);
    transition: filter 1s;
}

button {
    font-size: 1.5rem;
}
</style>