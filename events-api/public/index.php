<?php

header('Access-Control-Allow-Origin: *');

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

$app->add(function ($request, $handler) {
    $response = $handler->handle($request);

    return $response
        ->withHeader('Access-Control-Allow-Origin', '*')
        ->withHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
        ->withHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
});

$app->options('/{routes:.+}', function ($request, $response) {
    return $response
        ->withHeader('Access-Control-Allow-Origin', '*')
        ->withHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
        ->withHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
});

$app->addErrorMiddleware(true, true, true);

$app->get('/events', [EventController::class, 'getAll']);
$app->get('/events/{id}', [EventController::class, 'getById']);
$app->post('/events', [EventController::class, 'create']);
$app->put('/events/{id}', [EventController::class, 'update']);
$app->delete('/events/{id}', [EventController::class, 'delete']);

$app->get('/registrations', [EventController::class, 'getAllRegistrations']);
$app->get('/registrations/{id}', [EventController::class, 'getRegistrationById']);
$app->get('/registrations/user/{id}', [EventController::class, 'getRegistrationsByUserId']);
$app->get('/registrations/event/{id}', [EventController::class, 'getRegistrationsByEventId']);
$app->post('/registrations', [EventController::class, 'createRegistration']);
$app->delete('/registrations/{id}', [EventController::class, 'deleteRegistration']);
$app->put('/checkin/{id}', [EventController::class, 'registerPresence']);
$app->put('/cancel/{id}', [EventController::class, 'cancelRegistration']);

$app->run();