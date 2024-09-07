<template>
    <button :disabled="disabled">
        <slot></slot>
    </button>
</template>

<script>
import Util from '@/util';
import Color from '@/Color';

export default {
    name: 'BigButton',
    data() {
        return {
        };
    },
    props: {
        "color": Util.createEnumProperty(Color),
        "disabled": Boolean
    },
    /**
     * These computed colours are used in the CSS
     */
    computed: {
        colorVar() {
            return `rgb(var(${this.color.description}))`
        },
        darkerColorVar() {
            return `rgba(var(${this.color.description}), .6)`
        }
    },
};
</script>

<style scoped>
button {
    background-color: v-bind('colorVar');

    padding: 50px;


    border: 0px;
    border-radius: 10px;

    color: white;

    font-size: 2rem;
    font-weight: bold;

    text-shadow: 0 0px 3px rgba(0, 0, 0, 0.25);
    box-shadow: 0 5px 0 v-bind('darkerColorVar');
}

button:enabled {
    cursor: pointer;

    transition: transform 200ms, box-shadow 200ms;
}

button:enabled:active {
    box-shadow: 0 3px 0 v-bind('darkerColorVar');
    transform: translateY(2px);
}
</style>