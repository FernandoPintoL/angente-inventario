web: php artisan serve --host=0.0.0.0 --port=$PORT
worker: php artisan queue:work --tries=3 --timeout=180 --sleep=3
scheduler: while true; do php artisan schedule:run --verbose --no-interaction & sleep 60; done
