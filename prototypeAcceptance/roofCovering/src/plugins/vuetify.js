import Vue from 'vue';
import Vuetify from 'vuetify/lib/framework';
import '@mdi/font/css/materialdesignicons.css'


Vue.use(Vuetify);

export default new Vuetify({
    icons: {
        iconfont: 'mdi',
    },
    theme: {
        themes: {
            light: {
                primary: '#0066CC',
                secondary: '#0099FF',
                accent: '#0066CC',
                error: '#66CCFF',
            },
        },
    },
});
