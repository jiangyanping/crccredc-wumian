<template>
    <v-app id="app">
        <router-view />
    </v-app>
</template>
<style>
@import './assets/css/reset.css';
#app {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    width: 100%;
    height: 100%;
    font-size: 15px;
    background-color: #333333;
}

* {
    box-sizing: border-box;
}

html,
body {
    width: 100%;
    height: 100%;
}
.v-application .accent {
    background-color: #0066CC !important;
    border-color: #0066CC !important;
}
</style>
<script>
export default {
    name: 'App',
};
</script>
