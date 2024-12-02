<?php

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE');
header('Access-Control-Allow-Headers: Content-Type');

use Psr\Container\ContainerInterface;
use Slim\Factory\AppFactory;
use App\Services\EventService;
use App\Controller\EventController;

require __DIR__ . '/../vendor/autoload.php';

$container = new \DI\Container();
AppFactory::setContainer($container);

$container->set(EventService::class, function (ContainerInterface $container) {
    return new EventService();
});

$container->set(EventController::class, function (ContainerInterface $container) {
    return new EventController($container->get(EventService::class));
});

$app = AppFactory::create();

$app->get('/events', [EventController::class, 'getAll']);
$app->get('/events/{id}', [EventController::class, 'getById']);
$app->post('/events', [EventController::class, 'create']);
$app->put('/events/{id}', [EventController::class, 'update']);
$app->delete('/events/{id}', [EventController::class, 'delete']);
$app->post('/events/{id}/finish', [EventController::class, 'finishEvent']);

$app->get('/registrations', [EventController::class, 'getAllRegistrations']);
$app->get('/registrations/{id}', [EventController::class, 'getRegistrationById']);
$app->get('/registrations/user/{id}', [EventController::class, 'getRegistrationsByUserId']);
$app->get('/registrations/event/{id}', [EventController::class, 'getRegistrationsByEventId']);
$app->post('/registrations', [EventController::class, 'createRegistration']);
$app->delete('/registrations/{id}', [EventController::class, 'deleteRegistration']);
$app->put('/checkin/{id}', [EventController::class, 'registerPresence']);
$app->put('/cancel/{id}', [EventController::class, 'cancelRegistration']);

$app->run();
