<template>
  <v-app>
    <v-layout>
      <app-drawer />
      <v-main>
        <v-container>
          <v-data-table-virtual
            :loading="loading"
            class="rounded"
            :headers="headers"
            :items="registrationsWithDetails"
            item-key="id"
          >
            <template #item.actions="{ item }">
              <v-btn
                :style="{ width: '200px' }"
                :disabled="item.status === 'canceled'"
                :color="item.status === 'registered' ? 'red' : item.status === 'canceled' ? 'grey' : 'primary'"
                @click="item.status === 'registered' ? cancelRegistration(item) : generatePdf(item)"
              >
                {{ item.status === 'registered' ? 'Cancelar Inscrição' : item.status === 'canceled' ? 'Inscrição Cancelada' : hasCertificate(item) ? 'Acessar Certificado' : 'Sem Certificado' }}
              </v-btn>
            </template>

            <template #item.status="{ item }">
              <v-chip
                :color="item.status === 'registered' ? 'blue' : item.status === 'canceled' ? 'red' : 'green'"
                text-color="white"
              >
                {{ item.status === 'registered' ? 'Inscrito' : item.status === 'checked-in' ? 'Compareceu' : item.status === 'canceled' ? 'Cancelou' : item.status }}
              </v-chip>
            </template>

            <template #item.name="{ item }">
              {{ item.event_name }}
            </template>

            <template #item.date="{ item }">
              {{ item.date }}
            </template>
          </v-data-table-virtual>
        </v-container>
      </v-main>
    </v-layout>
  </v-app>
</template>


  <script>
  import { ref, onMounted } from 'vue'
  import EventsApi from '@/api/events.api'
  import CertificatesApi from '@/api/certificates.api'
  import EmailsApi from '@/api/emails.api'
  import UsersApi from '@/api/users.api'
  import jsPDF from 'jspdf'

  export default {
    name: 'Events',

    data() {
      return {
        loading: false,
        events: [],
        registrations: [],
        certificates: [],
        headers: [
          { title: 'ID', value: 'id' },
          { title: 'Nome do Evento', value: 'event_name' },
          { title: 'Status', value: 'status', sortable: false },
          { title: 'Data', value: 'date' },
          { title: 'Ações', value: 'actions', sortable: false },
        ],
        registrationsWithDetails: [],
      }
    },

    async created() {
      await this.fetchRegistrations()
    },

    methods: {
      async fetchUserData(userId) {
        try {
          const response = await UsersApi.getUser(userId)
          this.user = response.data
        } catch (error) {
          console.error('Erro ao buscar dados do usuário:', error)
        }
      },

      async fetchRegistrations() {
        try {
          this.loading = true
          const userId = 6
          await this.fetchUserData(userId)
          const registrationsResponse = await EventsApi.getRegistrationsByUserId(userId)
          this.registrations = registrationsResponse.data
          await this.fetchEventsAndCertificates()
        } catch (error) {
          console.error('Erro ao buscar registros:', error)
        } finally {
          this.loading = false
        }
      },

      async fetchEventsAndCertificates() {
        try {
          const eventsResponse = await EventsApi.getEvents()
          this.events = eventsResponse.data

          const certificatesResponse = await CertificatesApi.getCertificates()
          this.certificates = certificatesResponse.data

          this.updateRegistrationsWithDetails()
        } catch (error) {
          console.error('Erro ao buscar eventos e certificados:', error)
        }
      },

      updateRegistrationsWithDetails() {
        this.registrationsWithDetails = this.registrations.map((registration) => {
          const event = this.events.find((event) => event.id === registration.event_id)
          if (!event) return null;
          return {
            ...registration,
            event_name: event ? event.name : 'Evento não encontrado',
            date: event ? event.date : 'Data não disponível',
          }
        })
        .filter((registration) => registration !== null);
      },

      async cancelRegistration(item) {
        try {
            this.loading = true;
            await EventsApi.cancelRegistration(item.id);
            item.status = 'canceled';

            const userEmail = this.user.email;

            await EmailsApi.sendEmail({
                to: userEmail,
                subject: "Inscrição cancelada",
                text: `A inscrição para o evento ${item.event_name} foi cancelada.`
            });
        } catch (error) {
            console.error('Erro ao cancelar inscrição ou enviar e-mail:', error);
        } finally {
            this.loading = false;
        }
    },

      hasCertificate(item) {
        const certificate = this.certificates.find(
          (cert) => cert.user_id === item.user_id && cert.event_id === item.event_id
        )
        return certificate ? true : false
      },

      generatePdf(item) {
        const certificate = this.certificates.find(
          (cert) => cert.user_id === item.user_id && cert.event_id === item.event_id
        )
        if (certificate) {
          const event = this.events.find((event) => event.id === item.event_id)
          const pdf = new jsPDF()
          const margin = 15
          const pageWidth = pdf.internal.pageSize.width
          const textWidth = pageWidth - 2 * margin

          pdf.setFontSize(16)
          pdf.text('Certificado de Participação', pageWidth / 2, 30, { align: 'center' })
          pdf.setFontSize(12)

          let content = event.template
          content = content.replace('{{user_name}}', this.user.name)
          content = content.replace('{{event_name}}', event.name)
          content = content.replace('{{event_date}}', item.date)
          content = content.replace('{{auth_token}}', certificate.auth_token)

          pdf.setTextColor(0, 0, 0)
          const lines = pdf.splitTextToSize(content, textWidth)

          let yPosition = 60
          lines.forEach((line) => {
            if (yPosition + 10 > pdf.internal.pageSize.height) {
              pdf.addPage()
              yPosition = 15
            }
            pdf.text(line, margin, yPosition, { maxWidth: textWidth })
            yPosition += 10
          })

          pdf.setFontSize(12)
          pdf.text('Emitido por: Unieventos', margin, yPosition + 10)
          pdf.text(`Data de Emissão: ${certificate.date}`, margin, yPosition + 20)
          pdf.text(`Token de autenticação: ${certificate.auth_token}`, margin, yPosition + 30)

          const pdfBlob = pdf.output('blob')
          const pdfUrl = URL.createObjectURL(pdfBlob)
          window.open(pdfUrl, '_blank')
        }
      },
    },
  }
  </script>

  <style scoped>
  .rounded {
    border-radius: 10px;
  }
  </style>
