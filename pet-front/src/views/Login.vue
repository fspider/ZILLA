<template>
    
</template>

<script>
    import { mapGetters } from 'vuex'

    export default {
        name: 'Login',

        $_veeValidate: {
            validator: 'new'
        },

        data: () => ({
            snackbar: false,
            loginForm: {
                email: '',
                password: ''
            },
        }),

        methods: {
            submit() {
                this.$validator.validate().then(result => {
                    if (result) {
                        this.$store.dispatch('login', this.loginForm).then(() => {
                            this.$router.push({path: '/'});
                        }).catch(() => {
                            this.snackbar = true;
                        });
                    }
                });
            },
        },
        computed: {
            ...mapGetters(['default_phone_code'])
        },
    }
</script>

<style>

</style>