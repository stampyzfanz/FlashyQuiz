<template>
    <div id="enter-code-container">
        <form @submit.prevent="submitForm" id="enter-code-form">
            <p class="black-text">Enter your quiz code here</p>
            <div class="enter-code-row">
                <AutocompleteInput placeholder="quiz" :options="wordList"
                    @validInput="searchQuery => { this.word1 = searchQuery; focusNextInput() }" />
                <AutocompleteInput placeholder="code" :options="wordList"
                    @validInput="searchQuery => { this.word2 = searchQuery }" id="word2" />
                <BigButton type="submit" :color="Color.GREEN">
                    Join
                </BigButton>
            </div>
        </form>
    </div>
</template>

<script>
/* eslint-disable */
import AutocompleteInput from './AutocompleteInput.vue';
import BigButton from './BigButton.vue';
import Color from '@/Color';

export default {
    name: "EnterCode",
    emits: ["callParentComponent"],
    data() {
        return {
            wordList: [],
            word1: null,
            word2: null,
            Color
        };
    },
    async mounted() {
        const response = await fetch("http://localhost:3000/wordList.json");
        this.wordList = await response.json();
    },
    methods: {
        focusNextInput() {
            document.querySelector('#word2 .search').focus()
        },
        async submitForm() {
            try {
                const quizcode = `${this.word1}-${this.word2}`
                const response = await this.$socketUtil.response("join quiz", quizcode);

                if (response.status === "Success") {
                    // If successful
                    this.$emit("callParentComponent", "enterQuiz", response.name);
                } else {
                    // If the code is invalid
                    alert("Unfortunately, that code doesn't exist. Please try another");
                }
            } catch (error) {
                if (error instanceof this.$socketUtil.TimeoutError) {
                    // If the code timed out
                    alert("Unfortunately, the server is busy and the request has timed out");
                } else {
                    // If an unknown error occurred
                    alert("Please report the following error message: " + error);
                    throw error;
                }
            }
        }
    },
    components: { AutocompleteInput, BigButton }
};
</script>

<style scoped>
.enter-code-row {
    display: flex;
    flex-direction: row;
    justify-content: space-around;

    width: 30em;

    padding-bottom: 50px;
}

#enter-code-container {
    display: flex;
    vertical-align: centre;

    height: 100%;
    width: 100%;
}

#enter-code-form {
    text-align: center;
    display: inline-block;
    background-color: #fff;
    margin-left: auto;
    margin-right: auto;

    margin-top: auto;
    margin-bottom: auto;

    border-radius: 20px;
    padding: 20px;
}

.enter-code-row * {
    min-width: 5em;
}

form:deep(button) {
    padding: 10px 0px 10px 0px;
    font-size: 1.5rem;
}
</style>