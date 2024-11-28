<?php

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

$app->addErrorMiddleware(true, true, true);

$app->get('/events', [EventController::class, 'getAll']);
$app->get('/events/{id}', [EventController::class, 'getById']);
$app->post('/events', [EventController::class, 'create']);
$app->put('/events/{id}', [EventController::class, 'update']);
$app->delete('/events/{id}', [EventController::class, 'delete']);

$app->run();