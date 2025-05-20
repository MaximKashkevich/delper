import { createStore } from 'vuex';
import auth from './modules/auth';
import category from './modules/category';
import projects from './modules/projects';

export default createStore({
    modules: {
        auth,
        category,
        projects,
    },
});
