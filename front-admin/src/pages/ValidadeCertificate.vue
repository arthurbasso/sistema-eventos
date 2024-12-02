<template>
    <v-container>
      <v-form @submit.prevent="validateCertificate">
        <v-text-field
          v-model="token"
          label="Insira o Token do Certificado"
          outlined
          required
        ></v-text-field>
        <v-btn type="submit" color="green darken-1">Validar Certificado</v-btn>
      </v-form>
      <v-alert v-if="validationResult !== null" :type="validationResult ? 'success' : 'error'">
        {{ validationResult ? 'Certificado válido!' : 'Certificado inválido!' }}
      </v-alert>
    </v-container>
  </template>
  
  <script>
  import certificatesApi from '@/api/certificates.api';
  
  export default {
    data() {
      return {
        token: '',
        validationResult: null
      };
    },
    methods: {
      async validateCertificate() {
        try {
          const certificate = await certificatesApi.validateCertificate(this.token);
  
          if (certificate) {
            this.validationResult = true;
          } else {
            this.validationResult = false;
          }
        } catch (error) {
          console.error('Erro ao validar o certificado:', error);
          this.validationResult = false;
        }
      }
    }
  };
  </script>
  