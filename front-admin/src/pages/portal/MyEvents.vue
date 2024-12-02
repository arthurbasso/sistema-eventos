<script>
import emailsApi from '@/api/emails.api';
import eventsApi from '@/api/events.api';

import { useAppStore } from '@/stores/app.store';
import { useUserStore } from '@/stores/user.store';
import dayjs from 'dayjs'
import { mapState } from 'pinia';

export default {
  name: 'MyEvents',

  data: () => ({
    dayjs,
    loading: false,
    dialogEditEvent: false,
    dialogDeleteEvent: false,
    dialogSubscribeEvent: false,
    events: [],
    eventEdit: 0,
    eventDelete: {},
    eventSubscribe: {},
    headers: [
      { title: 'ID', value: 'id' },
      { title: 'Nome', value: 'name' },
      { title: 'Descrição', value: 'description' },
      { title: 'Data', value: 'date' },
      { title: 'Status', value: 'status' },
      { title: 'Ações', value: 'actions', sortable: false, align: 'end' },
    ],
  }),

  computed: {
    ...mapState(useAppStore, ['isOffline']),
    ...mapState(useUserStore, ['isAdmin', 'getUserId']),
  },

  watch: {
    dialogEditEvent(value) {
      if (!value) {
        this.fetchEvents()
      }
    },

    dialogDeleteEvent(value) {
      if (!value) {
        this.fetchEvents()
      }
    }
  },

  async created() {
    await this.fetchMyEvents()
  },

  methods: {
    async fetchMyEvents() {
      try {
        this.loading = true
        let events = await eventsApi.getRegistrationsByUserId(this.getUserId)
        this.events = events.data
      } catch (error) {
        console.error(error)
      } finally {
        this.loading = false
      }
    },

    openEditEvent(event) {
      this.eventEdit = event.id
      this.dialogEditEvent = true
    },

    openDeleteEvent(event) {
      this.eventDelete = event
      this.dialogDeleteEvent = true
    },

    openSubscribeEvent(event) {
      this.eventSubscribe = event
      this.dialogSubscribeEvent = true
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
          await emailsApi.sendEmail({
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
  }
}
</script>

<template>
  <v-app>
    <v-layout>
      <app-drawer />
      <v-main>
        <v-container>
          <v-row v-if="isAdmin">
            <v-col>
              <v-btn
                prepend-icon="mdi-plus"
                text="Novo evento"
                elevation="0"
                @click="openEditEvent({ id: 0 })"
              />
            </v-col>
          </v-row>
          <v-row>
            <v-col>
              <v-data-table-virtual
                :loading
                class="rounded"
                :headers="headers"
                :items="events"
                item-key="name"
              >
                <template #item.date="{ item }">
                  {{ dayjs(item.date).format('DD/MM/YYYY HH:mm:ss') ?? 'Data não disponível' }}
                </template>

                <template #item.status="{ item }">
                  <v-chip
                    v-if="item.status === 'registered'"
                    class="rounded"
                    size="small"
                    text="Inscrito"
                  />
                  <v-chip
                    v-if="item.status === 'checked-in'"
                    color="primary"
                    class="rounded"
                    size="small"
                    text="Participou"
                  />
                  <v-chip
                    v-if="item.status === 'canceled'"
                    color="red"
                    class="rounded"
                    size="small"
                    text="Não participou"
                  />
                </template>

                <template #item.actions="{ item }">
                  <v-tooltip
                    text="Gerar certificado"
                    location="top"
                  >
                    <template #activator="{ props }">
                      <v-btn
                        v-bind="props"
                        class="mr-2"
                        color="primary"
                        icon="mdi-file-pdf-box"
                        variant="tonal"
                        size="x-small"
                        rounded
                        @click="downloadCertificate"
                      />
                    </template>
                  </v-tooltip>
                </template>
              </v-data-table-virtual>
            </v-col>
          </v-row>
        </v-container>
      </v-main>
    </v-layout>
  </v-app>

  <edit-event
    v-model="dialogEditEvent"
    :event-id="eventEdit"
  />

  <delete-event
    v-model="dialogDeleteEvent"
    :event="eventDelete"
  />

  <subscribe-event
    v-model="dialogSubscribeEvent"
    :event="eventSubscribe"
  />
</template>
