<template>
  	<v-layout pa-2>
		  <v-flex xs12>
			  	<v-flex xs12>
					<v-layout pa-2>
						<v-toolbar color="accent-4">
							<v-toolbar-title>Profile</v-toolbar-title>
						</v-toolbar>
					</v-layout>
				</v-flex>

				<v-flex xs12>
					<v-layout pa-2>
						<v-flex xs4>
							<v-card class="user-settings">
								<img src="https://randomuser.me/api/portraits/women/81.jpg" alt="avatar">
								<span class="title">{{firstName + ' ' + lastName}}</span>
							</v-card>
							
							<v-card class="user-form">
								<form>
									<v-text-field v-model="firstName" v-validate="'required|max:10'" :counter="10" :error-messages="errors.collect('firstName')" 
									label="First Name" data-vv-name="firstName" required ></v-text-field>
									<v-text-field v-model="lastName" v-validate="'required|max:10'" :counter="10" :error-messages="errors.collect('lastName')"
									label="Last Name" data-vv-name="lastName" required ></v-text-field>
									<v-text-field v-model="email" v-validate="'required|email'" :error-messages="errors.collect('email')"
									label="E-mail" data-vv-name="email" required ></v-text-field>
									<v-btn class="mr-4"  @click="submitUser">submit</v-btn>
    								<v-btn  @click="clearUser">clear</v-btn>
								</form>
							</v-card>
						</v-flex>
					</v-layout>
				</v-flex>
		  </v-flex>
    </v-layout>
</template>

<script>
    import Vue from 'vue'
    import VeeValidate from 'vee-validate'

    Vue.use(VeeValidate)

	export default {
		name: "Settings",
		data () {
			let user = JSON.parse(localStorage.user);
			return {
				firstName : user.firstName,
				lastName : user.lastName,
				email : user.username,
			}
		},
		methods: {
			submitUser() {
				let user = JSON.parse(localStorage.user);
				let new_user = {
					"firstName": this.firstName,
					"lastName": this.lastName,
					"username": this.email
				}
				console.log(user);
				this.$validator.validateAll().then(result => {
					if(result) {
						const requestOptions = {
                            method: 'PUT',
                            headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + user.token },
                            body: JSON.stringify(new_user)
                        };
                        let url = window.location.protocol + '//' + window.location.hostname + ':4000/users/' + user._id;
                        
                        return fetch(url, requestOptions).then(res => {
                            if(res.status == 200){
								user.firstName = this.firstName;
								user.lastName = this.lastName;
								user.username = this.email;
								localStorage.setItem('user', JSON.stringify(user));
								Vue.$toast.success("Successfully Changed!")
							} else {
								Vue.$toast.warning("Something was wrong. Try another email!")						
							}
						})
					}
				})
			},
			clearUser() {
				this.firstName = "";
				this.lastName = "";
				this.email = "";
			}
		}
	};
</script>

<style>
	.user-settings{
		display: flex;
		align-items: center;
	}

	.user-settings img{
		width: 70px;
        height: 70px;
        margin: 7px 15px;
        border-radius: 50%!important;
	}

	.user-form{
		margin-top: 8px;
	}

	.user-form form{
		padding: 10px;
	}
</style>