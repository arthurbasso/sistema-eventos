<script>
import eventsApi from '@/api/events.api';

export default {
  name: 'CancelRegistration',

  props: {
    modelValue: {
      type: Boolean,
      default: false
    },

    registration: {
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
    }
  },

  methods: {
    async cancelRegistration() {
      try {
        await eventsApi.cancelRegistration(this.registration)
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
        <span class="headline">Cancelar inscrição</span>
      </v-card-title>
      <v-card-text>
        Tem certeza que deseja cancelar a inscrição no evento {{ eventDelete.name }}?
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
          @click="cancelRegistration"
        >
          Deletar
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
