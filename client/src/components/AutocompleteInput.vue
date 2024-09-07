<!-- adapted from http://jsfiddle.net/cZb9r/3/ written in another language -->
<template>
    <div class="search-container">
        <div @click="clickedInput">
            <input :placeholder="placeholder" class="search" type="text" name="search" v-model="searchQuery"
                @keyup.enter="selectSuggestion" @focusout="autocomplete" @invalid="handleInvalidInput"
                :pattern="regexPatternForOptions" :disabled="!hasReceivedOptions" required />
        </div>
        <input class="suggestion" type="text" disabled="disabled" :value="suggestion" />
    </div>
</template>

<script>
import Util from '@/util';

export default {
    name: 'AutocompleteInput',
    props: {
        options: {
            type: Array,
            required: true,
            validator: Util.isArrayOfStrings
        },
        placeholder: String
    },
    data() {
        return {
            searchQuery: "",
            suggestion: "",
        };
    },
    computed: {
        /**
         * Creates the regular expression pattern that HTML uses to 
         * perform clientside validation on text inputs
         */
        regexPatternForOptions() {
            return this.options.join("|");
        },
        hasReceivedOptions() {
            return this.options.length !== 0;
        }
    },
    methods: {
        /**
         * If the user confirms that the word is correct,
         * remove the suggestion and autocomplete the word in the text input
         */
        selectSuggestion() {
            if (this.suggestion.length >= 3) {
                this.searchQuery = this.suggestion;
            }
            this.suggestion = "";
        },
        // TODO DOESN"T WORK?
        handleInvalidInput(event) {
            event.target.setCustomValidity('Please enter a valid option.')
        },
        /**
         * Allows error to be presented if the server hasn't responded
         */
        clickedInput() {
            if (!this.hasReceivedOptions) {
                alert("Apologies, the server is currently unavailable. Please try again later.");
            }
        },
        /**
         * Autocompletes the input to a given word
         * @param {String} word 
         */
        autocomplete(word) {
            if (this.suggestion.length >= 3) {
                if (typeof word === 'string') {
                    this.searchQuery = word;
                    this.suggestion = word;
                } else {
                    this.searchQuery = this.suggestion;
                }
            }
        },
    },
    watch: {
        /**
         * Executes whenever searchQuery changes to 
         * create a suggestion or autocompletion if needed
         * @param {String} oldSearchQuery its previous value
         */
        searchQuery(_, oldSearchQuery) {
            // remove all whitespace
            this.searchQuery = this.searchQuery.replace(/\s/g, "");

            const shouldDisplaySuggestion = this.searchQuery.length >= 3;

            // change ensure previous suggestion is no longer displayed
            if (!shouldDisplaySuggestion) {
                this.suggestion = "";
            }

            // If the entire word is typed, tell parent it has been selected and exit
            for (const word of this.options) {
                if (this.searchQuery.toLowerCase() === word) {
                    this.autocomplete(word);
                    this.$emit("validInput", this.searchQuery);
                    return;
                }
            }

            // if it starts with a word, suggest if necessary then exit
            for (const word of this.options) {
                if (word.startsWith(this.searchQuery.toLowerCase())) {
                    if (shouldDisplaySuggestion) {
                        this.suggestion = this.searchQuery + word.slice(this.searchQuery.length);
                    }
                    return;
                }
            }

            // if there's no word that starts with the new letter that the user types
            // don't allow the user to type the new letter
            this.searchQuery = oldSearchQuery;
        }
    },
};
</script>

<style scoped>
.search-container {
    position: relative;
}

.search-container input {

    padding: 5px;
    font-size: 2rem;
    /* width: 200px; */
    width: 4.5em;

    border-radius: 1.5em;

}

.search {
    position: relative;
    color: #000;
    z-index: 10;
    border: 1px solid #666;
    background: transparent;
}

.suggestion {
    position: absolute;
    top: 0;
    left: 0;
    z-index: 0;
    color: #ccc;
    background: transparent;
    border: 1px solid #fff;
}

/* 
As recomended by 'Doin' to handle the press of a disabled text input
https://stackoverflow.com/questions/3100319/event-on-a-disabled-input 
*/
input[disabled] {
    pointer-events: none
}
</style>