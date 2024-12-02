<script>
import usersApi from '@/api/users.api';
import { useUserStore } from '@/stores/user.store';
import { mapActions } from 'pinia';

export default {
    data: () => ({
      loading: false,
      name: '',
      email: '',
      password: '',
    }),

  methods: {
    ...mapActions(useUserStore, ['setToken']),

    async login() {
      const { valid } = await this.$refs.formRegister.validate()
      if (valid) try {
        this.loading = true

        await usersApi.register({
          name: this.name,
          email: this.email,
          password: this.password,
        })

        this.$router.push('/login')

        this.$router.push('/portal/events')
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
  <v-container class="fill-height">
    <v-responsive
      class="align-centerfill-height mx-auto"
      max-width="500"
    >
      <v-row>
        <v-col>
          <v-card title="Faça login">
            <v-form
              ref="formRegister"
              @submit.prevent="login"
            >
              <v-card-text class="pb-0">
                <v-text-field
                  v-model="name"
                  :disabled="loading"
                  label="Nome"
                  :rules="[v => !!v || 'Campo obrigatório']"
                />
                <v-text-field
                  v-model="email"
                  :disabled="loading"
                  label="Email"
                  :rules="[v => !!v || 'Campo obrigatório']"
                />
                <v-text-field
                  v-model="password"
                  :disabled="loading"
                  type="password"
                  label="Senha"
                  :rules="[v => !!v || 'Campo obrigatório']"
                />
              </v-card-text>
              <v-card-actions>
                <v-spacer />
                <v-btn
                  type="submit"
                  color="primary"
                  :loading
                >
                  Login
                </v-btn>
              </v-card-actions>
            </v-form>
          </v-card>
        </v-col>
      </v-row>
    </v-responsive>
  </v-container>
</template>
