<script>
import eventsApi from '@/api/events.api';

export default {
  name: 'DeleteEvent',

  props: {
    modelValue: {
      type: Boolean,
      default: false
    },
    event: {
      type: Object,
      default: () => ({})
    },
  },

  emits: ['update:modelValue'],

  computed: {
    value: {
      get() {
        return this.modelValue
      },
      set(value) {
        this.$emit('update:modelValue', value)
      }
    },
    eventDelete() {
      return this.event
    }
  },

  methods: {
    async deleteEvent() {
      try {
        await eventsApi.deleteEvent(this.eventDelete.id)
        this.value = false
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
    max-width="500px"
  >
    <v-card>
      <v-card-title>
        <span class="headline">Deletar Evento</span>
      </v-card-title>
      <v-card-text>
        Tem certeza que deseja deletar o evento {{ eventDelete.name }}?
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn
          color="blue darken-1"
          text
          @click="value = false"
        >
          Cancelar
        </v-btn>
        <v-btn
          color="blue darken-1"
          text
          @click="deleteEvent"
        >
          Deletar
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
