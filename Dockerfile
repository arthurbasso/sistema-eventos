FROM php:8.3-fpm-alpine

# Install Composer
COPY --from=composer:latest /usr/bin/composer /usr/local/bin/composer

COPY events-api /var/www/html
WORKDIR /var/www/html

RUN ["composer", "install"]

