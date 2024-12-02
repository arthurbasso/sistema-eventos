<script>
import { useAppStore } from '@/stores/app.store'
import { mapState, mapActions } from 'pinia';

export default {
  computed: {
    ...mapState(useAppStore, ['isOffline']),
  },

  methods: {
    ...mapActions(useAppStore, ['setOfflineMode']),

    login() {
      this.$router.push('/admin')
    }
  }
}
</script>

<template>
  <v-navigation-drawer>
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
          @click="setOfflineMode(!isOffline)"
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

  <v-dialog>
    <v-card>
      <v-card-title>
        {{ isOffline ? 'Habilitar' : 'Desabilitar' }} modo offline
      </v-card-title>
      <v-card-text>
        <p>
          O modo offline permite que você continue utilizando o sistema mesmo sem conexão com a internet.
        </p>

        <p>
          <strong>Atenção:</strong> as alterações realizadas no modo offline só serão sincronizadas com o servidor quando o modo offline for desabilitado.
        </p>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>
