<template>
  	<v-layout align-center fill-height justify-center>
		<v-flex xs12 sm8 md4>
            <v-card class="elevation-12 text-xs-center login-form">
                <h4 class="text-xs-center display-1">Register</h4>

                <v-card-text>
                    <v-form class="mb-4 mt-3" autocomplete="off">
                        <v-text-field v-model="firstName"  v-on:keyup.enter="submit" v-validate="'required|max:10'" :counter="10" :error-messages="errors.collect('firstName')" 
                        label="First Name" data-vv-name="firstName" required ></v-text-field>

                        <v-text-field v-model="lastName"  v-on:keyup.enter="submit" v-validate="'required|max:10'" :counter="10" :error-messages="errors.collect('lastName')" 
                        label="Last Name" data-vv-name="lastName" required ></v-text-field>

                        <v-text-field v-model="email"  v-on:keyup.enter="submit" v-validate="'required|email'" :error-messages="errors.collect('email')"
                        label="E-mail" data-vv-name="email" required></v-text-field>

                        <v-text-field type="password" v-model="password"  v-on:keyup.enter="submit" v-validate="'required'" :error-messages="errors.collect('password')"
                        label="Password" data-vv-name="password" required></v-text-field>

                        <div class="text-xs-center">
                            <v-btn large color="primary" @click="submit">register</v-btn>
                        </div>

                        <div class="text-xs-center">
                            <router-link to="/login">Login</router-link>
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

		name: "Register",
		
		components: { },

		data() {
			return {
                firstName: '',
                lastName: '',
                email: '',
                password: '',
                dictionary: {
                    attributes: {
                        email: 'E-mail Address'
                    },
                    custom: {
                        firstName: {
                            required: () => 'First Name can not be empty',
                            max: 'The name field may not be greater than 10 characters'
                        },
                        firstName: {
                            required: () => 'Last Name can not be empty',
                            max: 'The name field may not be greater than 10 characters'
                        },
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
                        let user = {
                            "firstName": this.firstName,
                            "lastName": this.lastName,
                            "username": this.email,
                            "password": this.password
                        }

                        const requestOptions = {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify(user)
                        };
                        let url = window.location.protocol + '//' + window.location.hostname + ':4000/users/register';
                        return fetch(url, requestOptions).then((res)=>{
                            console.log(res);
                            if(res.status == 200){
                                this.$router.push({path: '/login'})
                            }
                        });
                    }
                });
                
            }
		}
	};
</script>

<style>

</style>