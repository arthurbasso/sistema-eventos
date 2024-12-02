<script>
import eventsApi from '@/api/events.api';
import EmailsApi from '@/api/emails.api';
import usersApi from '@/api/users.api';

export default {
  name: 'Events',

  data: () => ({
    loading: false,
    events: [],
    headers: [
      { title: 'ID', value: 'id' },
      { title: 'Nome', value: 'name' },
      { title: 'Ações', value: 'actions', sortable: false },
    ],
    dialog: false,
    selectedEvent: null,
    user: null,
  }),

  async created() {
    await this.fetchEvents();
    await this.fetchUser(); 
  },

  methods: {
    async fetchEvents() {
      try {
        this.loading = true;
        let events = await eventsApi.getEvents();
        this.events = events.data;
      } catch (error) {
        console.error(error);
      } finally {
        this.loading = false;
      }
    },

    async fetchUser() {
      try {
        let user = await usersApi.getUser(6);
        this.user = user.data;
      } catch (error) {
        console.error('Erro ao buscar o usuário:', error);
      }
    },

    async inscrever(event) {
      const userId = 6;
      const registrationData = {
        event_id: event.id,
        user_id: userId,
        status: 'registered'
      };

      try {
        this.loading = true;
        await eventsApi.createRegistration(registrationData);
        alert('Inscrição realizada com sucesso!');

        if (this.user && this.user.email) {
          await EmailsApi.sendEmail({
            to: this.user.email, 
            subject: "Inscrição realizada com sucesso",
            text: `A inscrição para o evento ${event.name} foi realizada com sucesso.`
          });
          alert('E-mail de confirmação enviado!');
        } else {
          console.error('E-mail do usuário não encontrado');
        }

        this.dialog = false;
      } catch (error) {
        console.error('Erro ao se inscrever:', error);
        alert('Erro ao tentar se inscrever, tente novamente!');
      } finally {
        this.loading = false;
      }
    },

    showDetails(event) {
      this.selectedEvent = event;
      this.dialog = true;
    },
  },
};
</script>

<template>
  <v-app>
    <v-layout>
      <app-drawer />
      <v-main>
        <v-container>
          <v-data-table-virtual
            :loading="loading"
            class="rounded"
            :headers="headers"
            :items="events"
            item-key="name"
          >
            <template #item.actions="{ item }">
              <v-btn 
                @click="showDetails(item)" 
                color="primary" 
                icon 
                rounded 
                class="custom-button"
              >
                <v-icon>mdi-plus</v-icon>
              </v-btn>
            </template>
          </v-data-table-virtual>
        </v-container>

        <v-dialog v-model="dialog" max-width="600px">
          <v-card>
            <v-card-title>
              <span class="headline">{{ selectedEvent?.name }}</span>
            </v-card-title>
            <v-card-text>
              <div><strong>Descrição:</strong> {{ selectedEvent?.description }}</div>
              <div><strong>Data:</strong> {{ selectedEvent?.date }}</div>
              <div><strong>Participantes:</strong> {{ selectedEvent?.participants }}</div>
            </v-card-text>
            <v-card-actions>
              <v-btn @click="inscrever(selectedEvent)" color="primary">Inscrever-se</v-btn>
              <v-btn @click="dialog = false" color="secondary">Fechar</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-main>
    </v-layout>
  </v-app>
</template>

<style scoped>
.custom-button {
  border-radius: 10px;
  padding: 10px;
  min-width: 40px;
}
</style>