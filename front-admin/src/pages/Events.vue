<script>
import eventsApi from '@/api/events.api';

export default {
  name: 'Events',

  data: () => ({
    loading: false,
    events: [],
    headers: [
      { title: 'ID', value: 'id' },
      { title: 'Nome', value: 'name' },
      { title: 'Descrição', value: 'description' },
      { title: 'Data', value: 'date' },
      { title: 'Participantes', value: 'participants' },
      { title: 'Ações', value: 'actions', sortable: false },
    ],
  }),

  async created() {
    await this.fetchEvents()
  },

  methods: {
    async fetchEvents() {
      try {
        this.loading = true
        let events = await eventsApi.getEvents()
        this.events = events.data
      } catch (error) {
        console.error(error)
      } finally {
        this.loading = false
      }
    },
  },
}
</script>

<template>
  <v-app>
    <v-layout>
      <app-drawer />
      <v-main>
        <v-container>
          <v-data-table-virtual
            :loading
            class="rounded"
            :headers="headers"
            :items="events"
            item-key="name"
          >
            <template #item.actions>
              teste
            </template>
          </v-data-table-virtual>
        </v-container>
      </v-main>
    </v-layout>
  </v-app>
</template>
