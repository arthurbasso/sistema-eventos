<template>
    <v-dialog v-model="value" max-width="500px">
      <v-card>
        <v-card-title>
          <span class="headline">Acessar Certificado</span>
        </v-card-title>
        <v-card-text>
          Deseja acessar o certificado para o evento "{{ event.name }}"?
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn color="blue darken-1" text @click="value = false">
            Cancelar
          </v-btn>
          <v-btn
            v-if="certificateExists"
            color="green darken-1"
            text
            @click="openCertificate"
          >
            Abrir Certificado
          </v-btn>
          <v-btn
            v-if="!certificateExists"
            color="blue darken-1"
            text
            @click="generateCertificate"
          >
            Gerar Certificado
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </template>  
  
  <script>
import { jsPDF } from 'jspdf';
import certificatesApi from '@/api/certificates.api';
import usersApi from '@/api/users.api';

export default {
  name: 'GenerateCertificate',

  props: {
    modelValue: {
      type: Boolean,
      default: false
    },
    event: {
      type: Object,
      required: true
    },
    userId: {
      type: Number,
      required: true
    }
  },

  emits: ['update:modelValue'],

  data() {
    return {
      certificateExists: false
    };
  },

  computed: {
    value: {
      get() {
        return this.modelValue;
      },
      set(value) {
        this.$emit('update:modelValue', value);
      }
    }
  },

  methods: {
    async checkCertificateExistence() {
      try {
        const response = await certificatesApi.getCertificateByUserIdAndEventId(this.userId, this.event.id);
        if (response.data) {
          this.certificateExists = true;
        } else {
          this.certificateExists = false;
        }
      } catch (error) {
        console.error('Erro ao verificar a existência do certificado:', error);
        this.certificateExists = false;
      }
    },

    async generateCertificate() {
      try {
        const userResponse = await usersApi.getUser(this.userId);
        const user = userResponse.data;

        if (!user) {
          throw new Error('Usuário não encontrado.');
        }

        await certificatesApi.createCertificate({
          user_id: this.userId,
          event_id: this.event.id,
          date: this.event.date
        });

        this.certificateExists = true;

        this.value = false;
      } catch (error) {
        console.error('Erro ao gerar o certificado:', error);
        alert('Erro ao gerar o certificado. Tente novamente.');
      }
    },

    async openCertificate() {
      try {
        const response = await certificatesApi.getCertificateByUserIdAndEventId(this.userId, this.event.id);
        const certificate = response.data;

        const userResponse = await usersApi.getUser(this.userId);
        const user = userResponse.data;

        if (!certificate) {
          throw new Error('Certificado não encontrado.');
        }

        const pdf = new jsPDF();
        const margin = 15;
        const pageWidth = pdf.internal.pageSize.width;
        const textWidth = pageWidth - 2 * margin;

        pdf.setFontSize(16);
        pdf.text('Certificado de Participação', pageWidth / 2, 30, { align: 'center' });

        let content = this.event.cert_template_id;
        content = content.replace('{{user_name}}', user.name);
        content = content.replace('{{event_name}}', this.event.name);
        content = content.replace('{{event_date}}', this.event.date);

        pdf.setFontSize(12);
        const lines = pdf.splitTextToSize(content, textWidth);

        let yPosition = 60;
        lines.forEach((line) => {
          if (yPosition + 10 > pdf.internal.pageSize.height) {
            pdf.addPage();
            yPosition = 15;
          }
          pdf.text(line, margin, yPosition);
          yPosition += 10;
        });

        pdf.setFontSize(12);
        pdf.text('Emitido por: Eventovates', margin, yPosition + 10);
        pdf.text(`Data de Emissão: ${new Date().toLocaleDateString()}`, margin, yPosition + 20);
        pdf.text(`Token de autenticação: ${certificate.auth_token}`, margin, yPosition + 30);
        pdf.text(`Link para autenticar certificado: http://localhost:5174/validadecertificate`, margin, yPosition + 40);

        const pdfBlob = pdf.output('blob')
        const pdfUrl = URL.createObjectURL(pdfBlob)
        window.open(pdfUrl, '_blank')

        this.value = false;
      } catch (error) {
        console.error('Erro ao abrir o certificado:', error);
        alert('Erro ao abrir o certificado. Tente novamente.');
      }
    }
  },

  watch: {
    value(newVal) {
      if (newVal) {
        this.checkCertificateExistence();
      }
    }
  }
};
</script>