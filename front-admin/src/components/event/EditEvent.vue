<script>
import eventsApi from '@/api/events.api';

export default {
  name: 'EventEdit',

  props: {
    modelValue: {
      type: Boolean,
      default: false
    },

    eventId: {
      type: Number,
      default: 0
    }
  },

  emits: ['update:modelValue'],

  data: () => ({
    loading: false,
    loadingEvent: false,
    event: {
      name: '',
      email: ''
    }
  }),

  computed: {
    value: {
      get() {
        return this.modelValue
      },
      set(value) {
        this.$emit('update:modelValue', value)
      }
    },

    isEditing() {
      return this.eventId > 0
    }
  },

  watch: {
    modelValue(value) {
      if (value) {
        this.event = {
          name: '',
          email: ''
        }
        if (this.isEditing) this.fetchEvent()
      }
    }
  },

  methods: {
    async fetchEvent() {
      try {
        this.loadingEvent = true
        let event = await eventsApi.getEvent(this.eventId)
        this.event = event.data
      } catch (error) {
        console.error(error)
      } finally {
        this.loadingEvent = false
      }
    },

    async createEvent() {
      try {
        this.loading = true
        await eventsApi.createEvent(this.event)
        this.value = false
      } catch (error) {
        console.error(error)
      } finally {
        this.loading = false
      }
    },

    async editEvent() {
      try {
        this.loading = true
        await eventsApi.updateEvent(this.eventId, this.event)
        this.value = false
      } catch (error) {
        console.error(error)
      } finally {
        this.loading = false
      }
    },

    saveEvent() {
      if (this.isEditing) {
        this.editEvent()
      } else {
        this.createEvent()
      }
    }
  }
}
</script>

<template>
  <v-dialog
    v-model="value"
    max-width="500"
    @after-leave="eventEdit = {}"
  >
    <v-card>
      <v-card-title>
        <span class="headline">Editar evento</span>
      </v-card-title>
      <v-form @submit.prevent="saveEvent">
        <v-card-text>
          <v-text-field
            v-model="event.name"
            :disabled="loadingEvent"
            label="Nome"
          />

          <v-textarea
            v-model="event.description"
            :disabled="loadingEvent"
            label="Descrição"
          />

          <v-text-field
            v-model="event.date"
            type="datetime-local"
            :disabled="loadingEvent"
            label="Data"
          />

          <v-text-field
            v-model="event.participants"
            type="number"
            :disabled="loadingEvent"
            label="Limite de participantes"
            clearable
          />
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn
            :disabled="loadingEvent"
            type="submit"
            color="primary"
            :loading
          >
            Salvar
          </v-btn>
        </v-card-actions>
      </v-form>
    </v-card>
  </v-dialog>
</template>
