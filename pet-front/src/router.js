import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

import Layout from './views/layout/index';
import Home from './views/home/index';
import Sign from './views/sign/index';
import Login from './views/login/index';
import Register from './views/register/index';
import Templates from './views/templates/index';
import ToSigning from './views/toSigning/index';
import History from './views/history/index';
import Settings from './views/settings/index';
import Backups from './views/backups/index';

const routes = [
    {
        path: '/login',
        component: Login,
    },
    {
        path: '/register',
        component: Register,
    },
    {
        path: '/sign',
        component: Sign
    },
    {
        path: '/',
        component: Layout,
        redirect: '/create',
        children: [
            {
                path: '/create',
                component: Home
            },
            {
                path: '/templates',
                component: Templates
            },
            {
                path: '/to-signing',
                component: ToSigning
            },
            {
                path: '/history',
                component: History
            },
             
            {
                path: '/settings',
                component: Settings
            },
            {
                path: '/backups',
                component: Backups
            }
        ] 
    }
]

const router = new Router({
    routes
});

router.beforeEach((to, from, next) => {
    // console.log(to);
    if (to.fullPath !== '/login' && to.fullPath !== '/register' && to.path !== '/sign') {

        if (!localStorage.user) {
            // console.log('1');
            next('/login');
        }else{
            // console.log('1');
            next();
        }
    }else{
        // console.log('3');
        next();
    }
});

export default router;