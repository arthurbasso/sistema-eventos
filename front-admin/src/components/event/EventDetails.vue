<script>
import eventsApi from '@/api/events.api';
import dayjs from 'dayjs';

import { useUserStore } from '@/stores/user.store';
import { useAppStore } from '@/stores/app.store';
import { mapState } from 'pinia';
import usersApi from '@/api/users.api';

export default {
  name: 'EventDetails',

  props: {
    modelValue: {
      type: Boolean,
      default: false,
    },

    event: {
      type: Object,
      default: () => ({}),
    },
  },

  emits: ['update:modelValue'],

  data: () => ({
    search: '',
    eventDetails: {},
    participants: [],
    users: [],
    participantToAdd: null,
    loading: false,
    loadingParticipants: true,

    dialogAddParticipant: false,
    dayjs,

    headers: [
      { title: 'ID', value: 'id', sortable: false },
      { title: 'Nome', value: 'user.name', sortable: false },
      { title: 'Email', value: 'user.email', sortable: false },
      { title: 'Ações', value: 'actions', sortable: false, align: 'end' },
    ],
  }),

  computed: {
    ...mapState(useAppStore, ['isOffline']),
    ...mapState(useUserStore, ['isAdmin']),
    value: {
      get() {
        return this.modelValue
      },
      set(value) {
        this.$emit('update:modelValue', value)
      }
    }
  },

  watch: {
    value(value) {
      if (value) {
        this.participants = []
        this.fetchEvent()
        if (this.isAdmin) this.getParticipants()
      }
    },

    async dialogAddParticipant(value) {
      if (value) {
        let users = await usersApi.getUsers()
        this.users = users.data
      } else {
        this.participant = []
        this.getParticipants()
      }
    },
  },

  methods: {
    async fetchEvent() {
      this.eventDetails = this.event
      try {
        this.loading = true
        let response = await eventsApi.getEvent(this.event.id)

        this.eventDetails = {
          ...this.eventDetails,
          ...response.data,
        }
      } catch (error) {
        console.error(error)
      } finally {
        this.loading = false
      }
    },

    async getParticipants() {
      this.loadingParticipants = true
      this.participants = []
      try {
        let response = await eventsApi.getRegistrationsByEventId(this.event.id)
        let users = await usersApi.getUsers()

        this.participants = response.data.map(participant => {
          let user = users.data.find(user => user.id === participant.user_id)
          return {
            ...participant,
            user,
          }
        })
      } catch (error) {
        console.error(error)
      } finally {
        this.loadingParticipants = false
      }
    },

    async addParticipant() {
      try {
        await eventsApi.createRegistration({
          event_id: this.event.id,
          user_id: this.participantToAdd.id
        })

        this.dialogAddParticipant = false
        this.getParticipants()
      } catch (error) {
        console.error(error)
      }
    },

    async checkinUser(register) {
      try {
        register.loading = true
        await eventsApi.registerPresence(register.id, register.user.id)
        this.getParticipants()
      } catch (error) {
        console.error(error)
      } finally {
        register.loading = false
      }
    },

    async finishEvent() {
      try {
        await eventsApi.finishEvent(this.event.id)
        this.fetchEvent()
        this.getParticipants()
      } catch (error) {
        console.error(error)
      }
    }
  }
}
</script>

<template>
  <v-dialog
    v-model="value"
    max-width="750"
    scrollable
  >
    <v-card title="Detalhes do evento">
      <v-card-text>
        <v-row>
          <v-col>
            <v-card-title>
              {{ eventDetails.name }}
            </v-card-title>
            <v-card-subtitle>
              Data: {{ dayjs(eventDetails.date).format('DD/MM/YYYY HH:mm:ss') }}
            </v-card-subtitle>
            <v-card-subtitle v-if="eventDetails.participants">
              Limite de inscrições: {{ eventDetails.participants }}
            </v-card-subtitle>
          </v-col>
          <v-col
            v-if="isAdmin"
            class="text-right"
          >
            <v-btn
              prepend-icon="mdi-account-plus"
              variant="tonal"
              @click="dialogAddParticipant = true"
            >
              Adicionar participante
            </v-btn>

            <v-btn
              :disabled="isOffline"
              prepend-icon="mdi-check"
              class="mt-2"
              variant="tonal"
              @click="finishEvent"
            >
              Finalizar evento
            </v-btn>
          </v-col>
        </v-row>
        <v-row
          v-if="isAdmin"
        >
          <span class="text-overline pa-0">Participantes</span>
          <v-data-table-virtual
            :loading="loadingParticipants"
            :headers="headers"
            :items="participants"
            item-key="id"
          >
            <template #item.user.name="{ item }">
              {{ item?.user?.name }}
              <v-chip
                v-if="item.offline"
                class="ml-2 rounded"
                size="x-small"
                text="Offline"
              />
            </template>

            <template #item.actions="{item}">
              <v-tooltip text="Confirmar Check-in">
                <template #activator="{ props }">
                  <v-btn
                    :disabled="item.status !== 'registered'"
                    :loading="item.loading"
                    v-bind="props"
                    icon="mdi-login"
                    size="x-small"
                    elevation="0"
                    variant="tonal"
                    class="rounded"
                    @click="checkinUser(item)"
                  />
                </template>
              </v-tooltip>
            </template>
          </v-data-table-virtual>
        </v-row>
      </v-card-text>
    </v-card>
  </v-dialog>

  <v-dialog
    v-model="dialogAddParticipant"
    max-width="500"
  >
    <v-card>
      <v-card-title>
        Adicionar participante
      </v-card-title>
      <v-card-text>
        <v-row>
          <v-col>
            <v-autocomplete
              v-model="participantToAdd"
              :search="search"
              :items="users.filter(user => !user.is_admin )"
              item-title="name"
              item-value="id"
              return-object
              label="Participante"
            />
          </v-col>
        </v-row>
      </v-card-text>
      <v-card-actions>
        <v-btn
          color="primary"
          @click="addParticipant"
        >
          Adicionar
        </v-btn>
        <v-btn
          color="error"
          @click="dialogAddParticipant = false"
        >
          Cancelar
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
