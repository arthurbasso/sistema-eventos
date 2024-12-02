<?php

namespace App\Controller;

use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;
use App\Services\EventService;
use App\Mail\MailController;

class EventController
{
    protected EventService $service;

    public function __construct(EventService $eventService)
    {
        $this->service = $eventService;
    }

    public function getAll(Request $request, Response $response, $args): Response
    {
        $events = $this->service->getAll();
        $response->getBody()->write(json_encode($events));
        return $response->withHeader('Content-Type', 'application/json');
    }

    public function getById(Request $request, Response $response, array $args): Response
    {
        $event = $this->service->getById($args['id']);
        if (!$event) {
            return $response->withStatus(404, 'Event Not Found');
        }

        $response->getBody()->write(json_encode($event));
        return $response->withHeader('Content-Type', 'application/json');
    }

    public function create(Request $request, Response $response): Response
    {
        $data = json_decode(file_get_contents('php://input'), true);
        $event = $this->service->create($data);
        $response->getBody()->write(json_encode($event));
        return $response->withStatus(201)->withHeader('Content-Type', 'application/json');
    }

    public function update(Request $request, Response $response, array $args): Response
    {
        $data = json_decode(file_get_contents('php://input'), true);

        $updatedEvent = $this->service->update($args['id'], $data);

        if (!$updatedEvent) {
            return $response->withStatus(404, 'Event Not Found');
        }

        $response->getBody()->write(json_encode($updatedEvent));
        return $response->withStatus(200)->withHeader('Content-Type', 'application/json');
    }

    public function delete(Request $request, Response $response, array $args): Response
    {
        $deleted = $this->service->delete($args['id']);
        if (!$deleted) {
            return $response->withStatus(404, 'Event Not Found');
        }
        return $response->withStatus(204);
    }

    public function finishEvent(Request $request, Response $response, array $args): Response
    {
        $certificates = $this->service->finishEvent($args['id']);
        $response->getBody()->write(json_encode($certificates));
        return $response->withHeader('Content-Type', 'application/json');
    }

    public function getAllRegistrations(Request $request, Response $response, $args): Response
    {
        $events = $this->service->getAllRegistrations();
        $response->getBody()->write(json_encode($events));
        return $response->withHeader('Content-Type', 'application/json');
    }

    public function getRegistrationsByUserId(Request $request, Response $response, array $args): Response
    {
        $userId = $args['id'];
        $registrations = $this->service->getRegistrationsByUserId($userId);
        $response->getBody()->write(json_encode($registrations));
        return $response->withHeader('Content-Type', 'application/json');
    }

    public function getRegistrationsByEventId(Request $request, Response $response, array $args): Response
    {
        $eventId = $args['id'];
        $registrations = $this->service->getRegistrationsByEventId($eventId);
        $response->getBody()->write(json_encode($registrations));
        return $response->withHeader('Content-Type', 'application/json');
    }

    public function createRegistration(Request $request, Response $response): Response
    {
        try {
            $data = json_decode(file_get_contents('php://input'), true);
            $event = $this->service->createRegistration($data);
            $response->getBody()->write(json_encode($event));

            $mail = new MailController();

            $mail->send($data['user_id'], 'Registration Confirmation', 'You have been successfully registered for the event.');

            return $response->withStatus(201)->withHeader('Content-Type', 'application/json');
        } catch (\Exception $e) {
            $response->getBody()->write(json_encode(['error' => $e->getMessage()]));
            return $response->withStatus(400)->withHeader('Content-Type', 'application/json');
        }
    }

    public function deleteRegistration(Request $request, Response $response, array $args): Response
    {
        $deleted = $this->service->deleteRegistration($args['id']);
        if (!$deleted) {
            return $response->withStatus(404, 'Event Not Found');
        }
        return $response->withStatus(204);
    }

    public function registerPresence(Request $request, Response $response, array $args): Response
    {
        $data = json_decode(file_get_contents('php://input'), true);
        $updated = $this->service->registerPresence($args['id']);

        if (!$updated) {
            return $response->withStatus(404, 'Registration Not Found');
        }

        $mail = new MailController();

        $mail->send($data['user_id'], 'Check-in Confirmation', 'You have been successfully checked-in for the event.');

        $response->getBody()->write(json_encode(['status' => 'checked-in']));
        return $response->withHeader('Content-Type', 'application/json');
    }

    public function cancelRegistration(Request $request, Response $response, array $args): Response
    {
        $data = json_decode(file_get_contents('php://input'), true);
        $updated = $this->service->cancelRegistration($args['id']);

        if (!$updated) {
            return $response->withStatus(404, 'Registration Not Found');
        }

        $mail = new MailController();

        $mail->send($data['user_id'], 'Registration Canceled', 'You have successfully canceled your registration for the event.');

        $response->getBody()->write(json_encode(['status' => 'canceled']));
        return $response->withHeader('Content-Type', 'application/json');
    }
}
