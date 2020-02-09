<template>
  	<v-layout pa-2>
		<v-flex xs12>
			<v-flex xs12>
				<v-layout pa-2>
					<v-toolbar color="accent-4">
						<v-toolbar-title>History</v-toolbar-title>
					</v-toolbar>
				</v-layout>
			</v-flex>

			<v-flex xs12>
				<v-layout px-2>
					<v-flex xs12>
						<v-data-table v-if="list" :items="list" :headers="headers" :pagination.sync="pagination" :rows-per-page-items="pagination.rowsPerPageItems" :total-items="total"
							class="elevation-1"
							ref="datatable">

							<template slot="items" slot-scope="props">
								<tr>
									<td class="text-xs-left">{{ props.item.name }}</td>
									<td class="text-xs-left">{{ props.item.owner }}</td>
									<td class="text-xs-left">{{ props.item.date | moment("DD/MM/YYYY HH:mm:ss") }}</td>
									<td class="text-xs-left2">{{ getSignedStatus(props.item.signers) + ' (' + getSignedCount(props.item.signers) + ' of ' + props.item.signers.length + ')' }}</td>
									<td class="text-xs-left"><v-btn small color="primary" @click="downloadFile(props.item.id)">Download</v-btn></td>
								</tr>
							</template>
						</v-data-table>
					</v-flex>
				</v-layout>
			</v-flex>
		</v-flex>
    </v-layout>
</template>

<script>

	export default {
		name: "Home",
		
		mounted(){
			this.get();
		},

		data () {
			return {
				singleSelect: false,
        		selected: [],
				headers: [
					{ text: 'Name', align: 'left', sortable: false, value: 'name', },
					{ text: 'Owner', sortable: false, value: 'description' },
					{ text: 'Date of creation', sortable: false, value: 'dateOfCreate' },
					{ text: 'Status', sortable: false, value: 'status' },
					{ text: '', sortable: false, value: 'actions' }
				],
				list: [],
				pagination: {
                    page: 1,
                    rowsPerPage: 15,
                    rowsPerPageItems: [5, 15, 30, 100]
				},
				total: 0
			}
		},

		methods: {
			get(){
				let user = JSON.parse(localStorage.user);

				const requestOptions = {
					method: 'POST',
					headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + user.token },
					body: JSON.stringify({owner: user.username})
				};
				let url = window.location.protocol + '//' + window.location.hostname + ':4000/file/get-files';
				return fetch(url, requestOptions).then((res)=>{
					res.json().then(files => {
						this.list = files;
					});
				});
			},
			getSignedStatus(signers){
				let status = 'not signed';

				let signedIndex = signers.findIndex(item => {
					return item.signed
				});

				if(signedIndex != -1){
					status = 'signed';
				}

				return status;
			},

			getSignedCount(signers){
				let count = 0;

				signers.map(item => {
					item.signed ? count++ : false;
				})

				return count;
			},

			downloadFile(id){
				let user = JSON.parse(localStorage.user);

				const requestOptions = {
					method: 'POST',
					headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + user.token },
					body: JSON.stringify({id: id})
				};
				let url = window.location.protocol + '//' + window.location.hostname + ':4000/file/download-file';
				return fetch(url, requestOptions).then((res)=>{
					res.json().then(file => {
						let base64 = file.file,
							formatedFile = "data:application/pdf;base64, " + file.file,
							downloadLink = document.createElement("a");

						downloadLink.href = formatedFile;
						downloadLink.download = file.name;
						downloadLink.click();
					});
				});
			}
		}
	};
</script>