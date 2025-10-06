web: php -S 0.0.0.0:${PORT:-8000} -t public
worker: php artisan queue:work --tries=3 --timeout=180 --sleep=3
scheduler: while true; do php artisan schedule:run --verbose --no-interaction & sleep 60; done
