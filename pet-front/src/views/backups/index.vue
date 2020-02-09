<template>
  	<v-layout pa-2>
		<v-flex xs12>
			<v-flex xs12>
				<v-layout pa-2>
					<v-toolbar color="accent-4">
						<v-toolbar-title>Backups</v-toolbar-title>
					</v-toolbar>

					<v-spacer></v-spacer>

					<v-btn color="primary">Download Backup</v-btn>
				</v-layout>
			</v-flex>

			<v-flex xs12>
				<v-layout px-2>
					<v-flex xs12> 
						<v-flex xs12>  
							<v-tabs v-model="model" color="transparent" slider-color="primary">
								<v-tab href="#tab-1">
									All Documents
								</v-tab>
								<v-tab href="#tab-2">
									Templates
								</v-tab>
								<v-tab href="#tab-3">
									Sended Documents
								</v-tab>
							</v-tabs>
						</v-flex>
						<v-flex xs12>
							<v-tabs-items v-model="model">
      							<v-tab-item value="tab-1">
									<v-data-table v-if="list1" :items="list1" :headers="headers" :pagination.sync="pagination" :rows-per-page-items="pagination.rowsPerPageItems" :total-items="total"
										class="elevation-1"
										ref="datatable">

										<template slot="items" slot-scope="props">
											<tr>
												<td class="text-xs-left"><v-checkbox class="check" v-model="checkbox"></v-checkbox></td>
												<td class="text-xs-left">{{ props.item.name }}</td>
												<td class="text-xs-left">{{ props.item.description }}</td>
												<td class="text-xs-left">{{ props.item.dateOfCreate }}</td>
												<td class="text-xs-left">{{ props.item.status }}</td>
												<td class="text-xs-left2">{{ props.item.signer }}</td>
											</tr>
										</template>
									</v-data-table>
      							</v-tab-item>

								<v-tab-item value="tab-2">
									<v-data-table v-if="list2" :items="list2" :headers="headers" :pagination.sync="pagination" :rows-per-page-items="pagination.rowsPerPageItems" :total-items="total"
										class="elevation-1"
										ref="datatable">

										<template slot="items" slot-scope="props">
											<tr>
												<td class="text-xs-left"><v-checkbox class="check" v-model="checkbox"></v-checkbox></td>
												<td class="text-xs-left">{{ props.item.name }}</td>
												<td class="text-xs-left">{{ props.item.description }}</td>
												<td class="text-xs-left">{{ props.item.dateOfCreate }}</td>
												<td class="text-xs-left">{{ props.item.status }}</td>
												<td class="text-xs-left2">{{ props.item.signer }}</td>
											</tr>
										</template>
									</v-data-table>
      							</v-tab-item>

								<v-tab-item value="tab-3">
									<v-data-table v-if="list3" :items="list3" :headers="headers" :pagination.sync="pagination" :rows-per-page-items="pagination.rowsPerPageItems" :total-items="total"
										class="elevation-1"
										ref="datatable">

										<template slot="items" slot-scope="props">
											<tr>
												<td class="text-xs-left"><v-checkbox class="check" v-model="checkbox"></v-checkbox></td>
												<td class="text-xs-left">{{ props.item.name }}</td>
												<td class="text-xs-left">{{ props.item.description }}</td>
												<td class="text-xs-left">{{ props.item.dateOfCreate }}</td>
												<td class="text-xs-left">{{ props.item.status }}</td>
												<td class="text-xs-left2">{{ props.item.signer }}</td>
											</tr>
										</template>
									</v-data-table>
      							</v-tab-item>
							</v-tabs-items>
						</v-flex>
					</v-flex>
				</v-layout>
			</v-flex>
		</v-flex>
    </v-layout>
</template>

<script>

	export default {
		name: "Backups",

		data () {
			return {
				model: 'tab-2',
				singleSelect: false,
        		selected: [],
				headers: [
					{ text: '', align: 'left', sortable: false, value: 'check', },
					{ text: 'Name', align: 'left', sortable: false, value: 'name', },
					{ text: 'Description', sortable: false, value: 'description' },
					{ text: 'Date of creation', sortable: false, value: 'dateOfCreate' },
					{ text: 'Status', sortable: false, value: 'status' },
					{ text: 'Signer', sortable: false, value: 'signer' }
				],
				list1: [
					{ name: 'File name 1', description: 'File description', dateOfCreate: '01.07.2019', status: 'Signed', signer: 'Ivan Kramnyuk' },
					{ name: 'File name 2', description: 'File description', dateOfCreate: '01.07.2019', status: 'Signed', signer: 'Ivan Kramnyuk' },
					{ name: 'File name 3', description: 'File description', dateOfCreate: '01.07.2019', status: 'Signed', signer: 'Ivan Kramnyuk' },
					{ name: 'File name 4', description: 'File description', dateOfCreate: '01.07.2019', status: 'Signed', signer: 'Ivan Kramnyuk' },
					{ name: 'File name 5', description: 'File description', dateOfCreate: '01.07.2019', status: 'Signed', signer: 'Ivan Kramnyuk' },
					{ name: 'File name 6', description: 'File description', dateOfCreate: '01.07.2019', status: 'Signed', signer: 'Ivan Kramnyuk' },
					{ name: 'File name 7', description: 'File description', dateOfCreate: '01.07.2019', status: 'Signed', signer: 'Ivan Kramnyuk' },
					{ name: 'File name 8', description: 'File description', dateOfCreate: '01.07.2019', status: 'Signed', signer: 'Ivan Kramnyuk' },
				],
				list2: [
					{ name: 'File name 6', description: 'File description', dateOfCreate: '01.07.2019', status: 'Signed', signer: 'Ivan Kramnyuk' },
					{ name: 'File name 7', description: 'File description', dateOfCreate: '01.07.2019', status: 'Signed', signer: 'Ivan Kramnyuk' },
					{ name: 'File name 8', description: 'File description', dateOfCreate: '01.07.2019', status: 'Signed', signer: 'Ivan Kramnyuk' }
				],
				list3: [
					{ name: 'File name 1', description: 'File description', dateOfCreate: '01.07.2019', status: 'Signed', signer: 'Ivan Kramnyuk' },
					{ name: 'File name 2', description: 'File description', dateOfCreate: '01.07.2019', status: 'Signed', signer: 'Ivan Kramnyuk' },
					{ name: 'File name 3', description: 'File description', dateOfCreate: '01.07.2019', status: 'Signed', signer: 'Ivan Kramnyuk' },
					{ name: 'File name 4', description: 'File description', dateOfCreate: '01.07.2019', status: 'Signed', signer: 'Ivan Kramnyuk' },
					{ name: 'File name 5', description: 'File description', dateOfCreate: '01.07.2019', status: 'Signed', signer: 'Ivan Kramnyuk' }
				],
				pagination: {
                    page: 1,
                    rowsPerPage: 15,
                    rowsPerPageItems: [5, 15, 30, 100]
				},
				total: 0
			}
		},
	};
</script>

<style>
	.check .v-input__control{
		height: 24px;
	}

	.check .v-input__slot{
		margin: 0;
	}
</style>