import axios from 'axios';

export async function sendEmail(email: string, subject: string, body: string) {
    try {
        const response = await axios.post('http://localhost:3004/emails', {
            to: email,
            subject: subject,
            text: body
        }, {
            headers: {
                'Content-Type': 'application/json'
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error sending email:', error);
        throw error;
    }
}
