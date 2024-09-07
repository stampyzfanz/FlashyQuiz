<template>
    <h1>Get ready to start after everyone else joins</h1>

    <FastLoadingIcon top="50%" speed="2500" />
</template>

<script>
import FastLoadingIcon from './FastLoadingIcon.vue';

export default {
    name: 'ParticipantLobby',
    components: { FastLoadingIcon },
    emits: ["callParentComponent"],
    props: {
        screenState: {
            required: true,
            type: Object
        },
    },
};
</script>

<style scoped>
h1 {
    text-align: center;
    margin-top: 0px;
    padding-top: 100px;
    font-size: 4em;
}
</style>