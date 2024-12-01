<script>
import usersApi from '@/api/users.api';

export default {
  name: 'UserEdit',

  props: {
    modelValue: {
      type: Boolean,
      default: false
    },

    userId: {
      type: Number,
      default: 0
    }
  },

  emits: ['update:modelValue'],

  data: () => ({
    loading: false,
    loadingUser: false,
    user: {
      name: '',
      email: ''
    },
    headers: [
      { title: 'ID', value: 'id' },
      { title: 'Nome', value: 'name' },
      { title: 'Email', value: 'email' },
      { title: 'Ações', value: 'actions', sortable: false },
    ],
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
      return this.userId > 0
    }
  },

  watch: {
    modelValue(value) {
      if (value) {
        this.user = {
          name: '',
          email: ''
        }
        if (this.isEditing) this.fetchUser()
      }
    }
  },

  methods: {
    async fetchUser() {
      try {
        this.loadingUser = true
        let user = await usersApi.getUser(this.userId)
        this.user = user.data
        delete this.user.id
      } catch (error) {
        console.error(error)
      } finally {
        this.loadingUser = false
      }
    },

    async createUser() {
      try {
        this.loading = true
        await usersApi.createUser(this.user)
        this.value = false
      } catch (error) {
        console.error(error)
      } finally {
        this.loading = false
      }
    },

    async editUser() {
      try {
        this.loading = true
        await usersApi.updateUser(this.userId, this.user)
        this.value = false
      } catch (error) {
        console.error(error)
      } finally {
        this.loading = false
      }
    },

    saveUser() {
      if (this.isEditing) {
        this.editUser()
      } else {
        this.createUser()
      }
    }
  }
}
</script>

<template>
  <v-dialog
    v-model="value"
    max-width="500"
    @after-leave="userEdit = {}"
  >
    <v-card>
      <v-card-title>
        <span class="headline">Editar usuário</span>
      </v-card-title>
      <v-form @submit.prevent="saveUser">
        <v-card-text>
          <v-text-field
            v-model="user.name"
            :disabled="loadingUser"
            label="Nome"
          />

          <v-text-field
            v-model="user.email"
            :disabled="loadingUser"
            label="Email"
          />
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn
            :disabled="loadingUser"
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
