<script>
import usersApi from '@/api/users.api';

export default {
  name: 'Login',

  data: () => ({
    email: '',
    password: ''
  }),

  methods: {
    async login() {
      try {
        let response = await usersApi.login(this.email, this.password)
        
      } catch (error) {
        console.error(error)
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
            <v-card-text class="pb-0">
              <v-text-field
                v-model="email"
                label="Email"
              />
              <v-text-field
                v-model="password"
                type="password"
                label="Senha"
              />
            </v-card-text>
            <v-card-actions>
              <v-spacer />
              <v-btn color="primary">
                Login
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
    </v-responsive>
  </v-container>
</template>
