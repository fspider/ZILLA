<template>
    <v-navigation-drawer v-model="drawer" :mini-variant.sync="mini" hide-overlay right fixed class="legend-nav">
        <v-toolbar flat class="transparent">
            <v-list class="pa-0">
                <v-list-tile>
                    <v-list-tile-action>
                        <v-btn icon @click.stop="mini = !mini">
                            <v-icon>chevron_left</v-icon>
                        </v-btn>
                    </v-list-tile-action>

                    <v-list-tile-content>
                        <v-list-tile-title>Document Legend</v-list-tile-title>
                    </v-list-tile-content>
                </v-list-tile>
            </v-list>
        </v-toolbar>

        <v-list class="pt-0 legend-list" dense>
            <v-divider></v-divider>
            
            <v-list-tile v-for="(item, index) in data" :key="index" @click="chooseAction(index)">
                <v-list-tile-action>
                    <v-icon>{{item.icon}}</v-icon>
                </v-list-tile-action>

                <v-list-tile-content v-if="item.type != 'text' && item.type != 'signPlace'">
                    <v-list-tile-title>{{item.text}}</v-list-tile-title>
                </v-list-tile-content>

                <v-list-tile-content v-if="item.type == 'text'">
                    <v-text-field v-model="item.data" @input="changeValue('text', index)"></v-text-field>
                </v-list-tile-content>

                <v-list-tile-content v-if="item.type == 'signPlace'">
                    <v-list class="pt-0 legend-sublist" dense>
                        <v-list-tile>
                            <v-list-tile-content>
                                <v-text-field v-model="item.data.signName"></v-text-field>
                            </v-list-tile-content>
                        </v-list-tile>

                        <v-list-tile>
                            <v-list-tile-content>
                                <v-text-field v-model="item.data.signEmail"></v-text-field>
                            </v-list-tile-content>
                        </v-list-tile>

                        <v-list-tile>
                            <v-list-tile-content>
                                <v-text-field v-model="item.data.signPhone"></v-text-field>
                            </v-list-tile-content>
                        </v-list-tile>
                    </v-list>
                </v-list-tile-content>
            </v-list-tile>

            <v-divider></v-divider>

            <div class="send-container">
                <v-btn v-if="data.length" @click="sendDocument()">Send</v-btn>
            </div>
        </v-list>
    </v-navigation-drawer>
</template>

<script>
	export default {
		name: 'ToolBar',

		components: {},

        props: ['data'],
        
		data() {
			return {
				mini: true,
                drawer: true,
                documentElements: []
			};
		},

		methods: {
			chooseAction(key){
                this.$emit('chooseAction', key);
            },

            sendDocument(){
                this.$emit('sendDocument');
            },

            changeField(type, index){
                console.log(type, index, this.data);
            },

            changeValue(type, index){
                console.log(type, index);
                let updatedData = {
                    type: type,
                    index: index,
                    data: this.data[index].data
                }
                this.$emit('updateData', updatedData);
            }
		}
	};
</script>

<style>
	.legend-nav{
        top: 65px;
    }
    
    .send-container{
        display: flex;
        justify-content: center;
        padding-top: 10px;
    }

    .legend-list .v-list__tile{
        height: auto!important;
    }

    .legend-list .legend-sublist .v-list__tile{
        padding: 0;
    }

    @media(max-width: 768px){
        .legend-nav{
            top: 56px;
        }
    }
</style>