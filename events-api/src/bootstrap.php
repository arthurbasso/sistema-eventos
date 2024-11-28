<?php

use DI\Container;
use DI\ContainerBuilder;
use Slim\App;
use Slim\Factory\AppFactory;

require __DIR__ . '/../vendor/autoload.php';
require __DIR__ . '/Controller/EventController.php';
require __DIR__ . '/Services/EventService.php';

$containerBuilder = new ContainerBuilder();
$container = $containerBuilder->build();
AppFactory::setContainer($container);

$container->set('db', function () {
    $db = new SQLite3(__DIR__ . '/../../database.db');
    return $db;
});
