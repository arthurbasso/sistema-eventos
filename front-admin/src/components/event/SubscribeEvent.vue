<script>
import eventsApi from '@/api/events.api';
import { useUserStore } from '@/stores/user.store';
import { mapState } from 'pinia';

export default {
  name: 'SubscribeEvent',

  props: {
    modelValue: {
      type: Boolean,
      default: false
    },

    event: {
      type: Object,
      default: () => ({})
    }
  },

  emits: ['update:modelValue'],

  data: () => ({
    loading: false,
  }),

  computed: {
    ...mapState(useUserStore, ['getUserId']),

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
    modelValue(value) {
      if (value) {
        if (this.isEditing) this.fetchEvent()
      }
    }
  },

  methods: {
    async subscribe() {
      try {
        this.loading = true
        const registrationData = {
          event_id: this.event.id,
          user_id: this.getUserId,
          status: 'registered'
        }

        await eventsApi.createRegistration(registrationData)
        this.value = false
      } catch (error) {
        console.error(error)
      } finally {
        this.loading = false
      }
    }
  }
}
</script>

<template>
  <v-dialog
    v-model="value"
    max-width="500"
  >
    <v-card>
      <v-card-title>
        <span class="headline">Inscrever-se no evento</span>
      </v-card-title>
      <v-form @submit.prevent="subscribe">
        <v-card-text>
          Deseja se inscrever no evento {{ event.title }}?
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn
            :disabled="loadingEvent"
            type="submit"
            color="primary"
            :loading
          >
            Confirmar inscrição
          </v-btn>
        </v-card-actions>
      </v-form>
    </v-card>
  </v-dialog>
</template>
