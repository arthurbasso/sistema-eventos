<?php

namespace App\Controller;

use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;
use App\Services\EventService;

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


    public function getAllRegistrations(Request $request, Response $response, $args): Response
    {
        $events = $this->service->getAllRegistrations();
        $response->getBody()->write(json_encode($events));
        return $response->withHeader('Content-Type', 'application/json');
    }

    public function getRegistrationById(Request $request, Response $response, array $args): Response
    {
        $events = $this->service->getRegistrationById();
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
        $data = json_decode(file_get_contents('php://input'), true);
        $event = $this->service->createRegistration($data);
        $response->getBody()->write(json_encode($event));
        return $response->withStatus(201)->withHeader('Content-Type', 'application/json');
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
        $updated = $this->service->registerPresence($args['id']);

        if (!$updated) {
            return $response->withStatus(404, 'Registration Not Found');
        }

        $response->getBody()->write(json_encode(['status' => 'checked-in']));
        return $response->withHeader('Content-Type', 'application/json');
    }

    public function cancelRegistration(Request $request, Response $response, array $args): Response
    {
        $updated = $this->service->cancelRegistration($args['id']);

        if (!$updated) {
            return $response->withStatus(404, 'Registration Not Found');
        }

        $response->getBody()->write(json_encode(['status' => 'canceled']));
        return $response->withHeader('Content-Type', 'application/json');
    }

}