<script>
import usersApi from '@/api/users.api';

import { useAppStore } from '@/stores/app.store';
import { mapState } from 'pinia';

export default {
  name: 'Users',

  data: () => ({
    loading: false,
    dialogEditUser: false,
    dialogDeleteUser: false,
    users: [],
    userEdit: 0,
    userDelete: {},
    headers: [
      { title: '#', value: 'id' },
      { title: 'Nome', value: 'name' },
      { title: 'Email', value: 'email' },
      { title: 'Ações', value: 'actions', sortable: false, align: 'end' },
    ],
  }),

  computed: {
    ...mapState(useAppStore, ['isOffline']),
  },

  watch: {
    dialogEditUser(value) {
      if (!value) {
        this.fetchUsers()
      }
    },

    dialogDeleteUser(value) {
      if (!value) {
        this.fetchUsers()
      }
    }
  },

  async created() {
    await this.fetchUsers()
  },

  methods: {
    async fetchUsers() {
      try {
        this.loading = true
        let users = await usersApi.getUsers()
        this.users = users.data
      } catch (error) {
        console.error(error)
      } finally {
        this.loading = false
      }
    },

    openEditUser(user) {
      this.userEdit = user.id
      this.dialogEditUser = true
    },

    openDeleteUser(user) {
      this.userDelete = user
      this.dialogDeleteUser = true
    },
  }
}
</script>

<template>
  <v-app>
    <v-layout>
      <app-drawer />

      <v-main>
        <v-container>
          <v-row>
            <v-col>
              <v-btn
                prepend-icon="mdi-plus"
                text="Novo usuário"
                elevation="0"
                @click="openEditUser({ id: 0 })"
              />
            </v-col>
          </v-row>
          <v-row>
            <v-col>
              <v-data-table-virtual
                :loading
                class="rounded"
                :headers="headers"
                :items="users"
                item-key="id"
                return-object
              >
                <template #item.name="{ item }">
                  {{ item.name }}
                  <v-chip
                    v-if="item.offline"
                    class="rounded ms-2"
                    size="x-small"
                  >
                    Offline
                  </v-chip>
                </template>

                <template #item.actions="{ item }">
                  <v-tooltip
                    text="Editar"
                    location="top"
                  >
                    <template #activator="{ props }">
                      <v-btn
                        v-if="!isOffline"
                        v-bind="props"
                        class="mr-2"
                        color="primary"
                        icon="mdi-pencil"
                        variant="tonal"
                        size="x-small"
                        rounded
                        @click="openEditUser(item)"
                      />
                    </template>
                  </v-tooltip>

                  <v-tooltip
                    text="Deletar"
                    location="top"
                  >
                    <template #activator="{ props }">
                      <v-btn
                        v-if="!isOffline || item.offline"
                        v-bind="props"
                        color="red"
                        icon="mdi-delete"
                        variant="tonal"
                        size="x-small"
                        rounded
                        @click="openDeleteUser(item)"
                      />
                    </template>
                  </v-tooltip>
                </template>
              </v-data-table-virtual>
            </v-col>
          </v-row>
        </v-container>
      </v-main>
    </v-layout>
  </v-app>

  <edit-user
    v-model="dialogEditUser"
    :user-id="userEdit"
  />

  <delete-user
    v-model="dialogDeleteUser"
    :user="userDelete"
  />
</template>
