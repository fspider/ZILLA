<template>
    <v-layout>
		<v-navigation-drawer v-if="normalNav" class="nav-normal" v-model="drawer" fixed app :mini-variant="miniVariant">
			<LeftNav :isOpen="miniVariant" :firstName="firstName" :lastName="lastName" />
		</v-navigation-drawer>

		<v-navigation-drawer v-if="mobileNav" class="nav-mobile" v-model="miniVariant" fixed app>
			<LeftNav :isOpen="miniVariant"/>
		</v-navigation-drawer>
		
		<v-toolbar app fixed color="secondary" dark>
			<v-toolbar-side-icon @click.stop="toggleDrawer"></v-toolbar-side-icon>

			<v-spacer></v-spacer>

			<v-menu :nudge-width="100">
          		<v-btn slot="activator" flat>
					{{selectedLang}}
					<v-icon>keyboard_arrow_down</v-icon>
				</v-btn>

				<v-list>
					<v-list-tile @click="changeLang('eng')">
						<v-list-tile-title>Eng</v-list-tile-title>
					</v-list-tile>

					<v-list-tile @click="changeLang('ru')">
						<v-list-tile-title>Ru</v-list-tile-title>
					</v-list-tile>
				</v-list>
			</v-menu>

			<v-toolbar-items>
				<v-btn flat @click.stop="logoutUser">{{ $t('nav.logout') }}</v-btn>
			</v-toolbar-items>

		</v-toolbar>

		<v-content>
			<router-view/>
		</v-content>
		
    </v-layout>
</template>

<script>
	import LeftNav from "../../components/LeftNav";

	export default {
		name: "Layout",

		components: { LeftNav },
		
		data () {
			let user = JSON.parse(localStorage.user);
			return {
				drawer: true,
				miniVariant: false,
				selectedLang: 'Eng',
				normalNav: true,
				mobileNav: false,
				firstName: user.firstName,
				lastName:user.lastName
			}
		},
		
		mounted() {
			window.addEventListener("resize", this.onResize);
			this.widthWatcher();
		},

		destroyed() {
			window.removeEventListener("resize", this.onResize);
		},

		methods: {
			changeLang(lang) {
				this.selectedLang = lang;
				this.$i18n.locale = lang;
			},

			toggleDrawer() {
				this.drawer = true;
				this.miniVariant = !this.miniVariant;
			},

			onResize() {
				if (!this.drawer) {
					this.miniVariant = true;
				}

				this.drawer = true;
				this.widthWatcher();
			},

			widthWatcher(){
				if(window.innerWidth - 17 < 768){
					this.normalNav = false;
					this.mobileNav = true;
				}else{
					this.normalNav = true;
					this.mobileNav = false;
				}
			},

			logoutUser() {
				localStorage.removeItem('user');
				this.$router.push({path: '/login'});
			}
		}
	};
</script>

<style>
	.nav-mobile{
		z-index: 1100;
	}

	.top-bar{
		z-index: 200;
	}
	
	@media(max-width: 768px){
		.v-content{
			padding-left: 0!important;
		}
	}
</style>