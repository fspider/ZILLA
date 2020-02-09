<template>
  	<v-layout align-center fill-height justify-center>
		<v-flex xs12 sm8 md4>
            <v-card class="elevation-12 text-xs-center login-form">
                <h4 class="text-xs-center display-1">Login</h4>

                <v-card-text>
                    <v-form class="mb-4 mt-3" autocomplete="off">
                        <v-text-field v-model="login"  v-on:keyup.enter="submit" v-validate="'required|email'" :error-messages="errors.collect('email')"
                        label="E-mail" data-vv-name="email" required></v-text-field>

                        <v-text-field type="password" v-model="password"  v-on:keyup.enter="submit" v-validate="'required'" :error-messages="errors.collect('password')"
                        label="Password" data-vv-name="password" required></v-text-field>

                        <div class="text-xs-center">
                            <v-btn large color="primary" @click="submit">Login</v-btn>
                        </div>

                        <div class="text-xs-center">
                            <router-link to="/register">register</router-link>
                        </div>
                    </v-form>
                </v-card-text>
            </v-card>
        </v-flex>
	</v-layout>
</template>

<script>
    import Vue from 'vue'
    import VeeValidate from 'vee-validate'

    Vue.use(VeeValidate)

	export default {
        $_veeValidate: {
            validator: 'new'
        },

		name: "Login",
		
		components: { },

		data() {
			return {
                login: '',
                password: '',
                dictionary: {
                    attributes: {
                        email: 'E-mail Address'
                    },
                    custom: {
                        password: {
                            required: () => 'Password can not be empty'
                        }
                    }
                }
			}
		},

		methods: {
			
            submit(){
                this.$validator.validateAll().then(result => {
                    if (result) {
                        let username = this.login,
                            password = this.password;

                        const requestOptions = {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ username, password })
                        };
                        let url = window.location.protocol + '//' + window.location.hostname + ':4000/users/authenticate';
                        
                        return fetch(url, requestOptions).then(res => {
                            res.json().then(user => {
                                console.log(user);
                                if (user.token) {
                                    localStorage.setItem('user', JSON.stringify(user));
                                    this.$router.push({path: '/'});
                                }
                                return user;
                            })
                        })
                    }
                });
                
            }
		}
	};
</script>

<style>

</style>