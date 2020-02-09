import _ from 'lodash';

const getters = {
    token: state => state.user.token,
    name: state => state.user.user.user.name
};

export default getters;
