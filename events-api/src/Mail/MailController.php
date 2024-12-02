<?php

namespace App\Mail;

use GuzzleHttp\Client;

class MailController
{
    protected $client;

    public function send($userId, $title, $body)
    {
        $client = new Client();

        $response = $client->request('GET', "http://users-api:3001/users/{$userId}");
        $user = json_decode($response->getBody(), true);

        $emailData = [
            'to' => $user['email'],
            'subject' => $title,
            'text' => $body
        ];

        $client->request('POST', 'http://emails-api:3004/emails', [
            'json' => $emailData
        ]);
    }
}
