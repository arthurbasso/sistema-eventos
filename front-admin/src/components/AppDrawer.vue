<script>
import { useAppStore } from '@/stores/app.store'
import { mapState, mapActions } from 'pinia';



export default {
  data: () => ({
    loadingOfflineMode: false,
    dialogOfflineMode: false,
  }),

  computed: {
    ...mapState(useAppStore, ['isOffline']),
  },

  methods: {
    ...mapActions(useAppStore, ['setOfflineMode']),

    logout() {
      localStorage.removeItem('token')
      this.$router.push('/login')
    },

    async changeOfflineMode() {
      this.loadingOfflineMode = true
      try {
        await this.setOfflineMode(!this.isOffline)
        this.dialogOfflineMode = false
      } catch (error) {
        console.error(error)
      } finally {
        this.loadingOfflineMode = false
      }
    }
  }
}
</script>

<template>
  <v-navigation-drawer permanent>
    <v-list
      density="compact"
      nav
    >
      <v-list-item
        prepend-icon="mdi-seat"
        title="Eventos"
        to="/events"
      />
      <v-list-item
        prepend-icon="mdi-seat"
        title="Eventos"
        to="/userEvents"
      />
      <v-list-item
        prepend-icon="mdi-account-multiple"
        title="Usuários"
        to="/users"
      />
      <v-list-item
        prepend-icon="mdi-file-certificate"
        title="Certificados"
        to="/certificates"
      />
    </v-list>
    <template #append>
      <v-list
        density="compact"
        nav
      >
        <v-list-item
          prepend-icon="mdi-connection"
          title="Modo offline"
          :base-color="isOffline ? 'primary' : ''"
          variant="tonal"
          @click="dialogOfflineMode = true"
        />

        <v-list-item
          prepend-icon="mdi-logout"
          title="Logout"
          base-color="red"
          variant="tonal"
          @click="logout()"
        />
      </v-list>
    </template>
  </v-navigation-drawer>

  <v-dialog
    v-model="dialogOfflineMode"
    max-width="600"
  >
    <v-card>
      <v-card-title>
        {{ isOffline ? 'Desabilitar' : 'Habilitar' }} modo offline
      </v-card-title>

      <v-card-text>
        <p>
          O modo offline permite que você continue utilizando o sistema mesmo sem conexão com a internet.
        </p>
        <br>
        <p>
          <strong>Atenção:</strong> as alterações realizadas no modo offline só serão sincronizadas com o servidor quando o modo offline for desabilitado.
        </p>
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn
          color="primary"
          :loading="loadingOfflineMode"
          @click="changeOfflineMode"
        >
          {{ isOffline ? 'Desabilitar' : 'Habilitar' }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
