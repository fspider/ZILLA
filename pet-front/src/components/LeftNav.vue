<template>
	<v-list two-line pt-0 class="pt-0">
        <div class="user">
            <img src="https://randomuser.me/api/portraits/women/81.jpg" alt="avatar">
            <span v-if="!isOpen">{{ firstName + ' ' + lastName}}</span>
        </div>

        <v-divider></v-divider>
        
        <v-list-tile to="/create">
            <v-list-tile-action>
                <v-icon>create</v-icon>
            </v-list-tile-action>
            <v-list-tile-content>
                <v-list-tile-title>{{ $t('nav.home') }}</v-list-tile-title>
            </v-list-tile-content>
        </v-list-tile>

		<v-list-tile to="/templates">
            <v-list-tile-action>
                <v-icon>assignment</v-icon>
            </v-list-tile-action>
            <v-list-tile-content>
                <v-list-tile-title>{{ $t('nav.templates') }}</v-list-tile-title>
            </v-list-tile-content>
        </v-list-tile>
        
        <v-list-tile to="/to-signing">
            <v-list-tile-action>
                <v-icon>done_all</v-icon>
            </v-list-tile-action>
            <v-list-tile-content>
                <v-list-tile-title>{{ $t('nav.toSigning') }}</v-list-tile-title>
            </v-list-tile-content>
        </v-list-tile>

		<v-list-tile to="/history">
            <v-list-tile-action>
                <v-icon>history</v-icon>
            </v-list-tile-action>
            <v-list-tile-content>
                <v-list-tile-title>{{ $t('nav.history') }}</v-list-tile-title>
            </v-list-tile-content>
        </v-list-tile>

        <v-list-tile to="/settings">
            <v-list-tile-action>
                <v-icon>settings</v-icon>
            </v-list-tile-action>
            <v-list-tile-content>
                <v-list-tile-title>{{ $t('nav.settings') }}</v-list-tile-title>
            </v-list-tile-content>
        </v-list-tile>

        <v-divider></v-divider>

        <v-list-tile to="/backups">
            <v-list-tile-action>
                <v-icon>file_copy</v-icon>
            </v-list-tile-action>
            <v-list-tile-content>
                <v-list-tile-title>{{ $t('nav.backups') }}</v-list-tile-title>
            </v-list-tile-content>
        </v-list-tile>

        <v-divider></v-divider>
    </v-list>
</template>

<script>
	export default {
		name: 'LeftNav',

		components: {},

        props: ['isOpen', 'firstName', 'lastName'],

		data() {
			return {
				
			};
		},

		methods: {

		}
	};
</script>

<style>
	.user{
		display: flex;
		justify-content: flex-start;
		align-items: center;
	}

	.user img{
		width: 50px;
        height: 50px;
        margin: 7px 15px;
        border-radius: 50%;
	}

	.user span{
		font-size: 16px;
	}
</style>