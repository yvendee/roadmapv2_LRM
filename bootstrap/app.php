
<?php
// <!-- With ENV loader -->
use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;


// Set environment file based on presence of '.env-init-dev'
try {
    if (file_exists(__DIR__ . '/../.env-init-dev')) {
        // Tell Laravel to load this env file instead of default '.env'
        $envFile = '.env-init-dev';
    } else {
        $envFile = '.env';
    }
} catch (\Exception $e) {
    // fallback to default env file if any error occurs
    $envFile = '.env';
}

// Load environment variables from the selected file manually
$dotenv = Dotenv\Dotenv::createImmutable(dirname(__DIR__), $envFile);
$dotenv->load();

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware): void {
        //
    })
    ->withExceptions(function (Exceptions $exceptions): void {
        //
    })->create();
