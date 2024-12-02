<script>
import usersApi from '@/api/users.api';
import { mapActions } from 'pinia';
import { useUserStore } from '@/stores/user.store';

export default {
  name: 'Login',

  data: () => ({
    loading: false,
    hasError: false,
    email: '',
    password: ''
  }),

  methods: {
    ...mapActions(useUserStore, ['setToken']),
    async login() {
      const { valid } = await this.$refs.formLogin.validate()
      if (valid) try {
        this.hasError = false
        this.loading = true
        let response = await usersApi.login(this.email, this.password)
        this.setToken(response.data)

        this.$router.push('/portal/events')

      } catch (error) {
        console.error(error)
        this.hasError = true
      } finally {
        this.loading = false
      }
    },
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
              ref="formLogin"
              @submit.prevent="login"
            >
              <v-card-text class="pb-0">
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
                />
              </v-card-text>
              <v-card-actions>
                <v-btn
                  :disabled="loading"
                  @click="$router.push('/register')"
                >
                  Criar novo
                </v-btn>
                <v-spacer />
                <v-btn
                  type="submit"
                  color="primary"
                  :loading
                  variant="tonal"
                >
                  Login
                </v-btn>
              </v-card-actions>
            </v-form>
          </v-card>
          <p
            v-if="hasError"
            class="text-subtitle-1 mt-2 text-red text-center"
          >
            Usuário ou senha incorretos
          </p>
        </v-col>
      </v-row>
    </v-responsive>
  </v-container>
</template>
