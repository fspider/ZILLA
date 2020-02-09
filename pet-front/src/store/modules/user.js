// import {loginByEmail, logout} from '@/api/login';
import {getToken, setToken, removeToken} from '@/utils/auth';

const user = {
    state: {
        user: '',
        token: getToken(),
        roles: [],
        drawerRight: false,
    },

    mutations: {
        SET_TOKEN: (state, token) => {
            state.token = token;
        },

        SET_DRAWER_RIGHT: (state, status) => {
            state.drawerRight = status;
        },

        SET_ROLES: (state, roles) => {
            state.roles = roles;
        },

        SET_USER: (state, user) => {
            state.user = user;
        }
    },

    actions: {
        drawerRight({commit, state}, status) {
            if (state.drawerRight == 1) {
                commit('SET_DRAWER_RIGHT', false);
            } else {
                commit('SET_DRAWER_RIGHT', true);
            }
        },

        // login({commit}, userInfo) {
        //     const email = userInfo.email.trim()
        //     return new Promise((resolve, reject) => {
        //         loginByEmail(email, userInfo.password).then(response => {
        //             const data = response.data;
        //             const token = data.access_token;

        //             commit('SET_TOKEN', token);
        //             setToken(token);
        //             console.log(token);
        //             resolve(data);
        //         }).catch(error => {
        //             reject(error);
        //         })
        //     })
        // },
        GetUserInfo({commit, state}) {
            return new Promise((resolve, reject) => {
                getUserInfo().then(response => {
                    if (!response.data) {
                        reject('error');
                    }
                    const data = response.data;

                    if (data.role && data.role.length > 0) {
                        commit('SET_ROLES', data.role);
                    } else {
                        reject('getInfo: roles must be a non-null array !');
                    }
                    commit('SET_USER', data);
                    resolve(response);
                }).catch(error => {
                    console.log(error);
                    reject(error);
                })
            })
        },

        LogOut({commit, state}) {
            commit('SET_TOKEN', '');
            commit('SET_ROLES', []);
            removeToken();
        },

        FedLogOut({commit}) {
            commit('SET_TOKEN', '');
            commit('SET_ROLES', []);
            removeToken();
        },
    }
}

export default user
