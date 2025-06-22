<?php

use Illuminate\Support\Facades\Route;

use Illuminate\Support\Facades\Response;
use Illuminate\Support\Facades\File;

// Route::get('/', function () {
//     return view('welcome');
// });

Route::get('/', function () {
    $path = public_path('index.html');

    if (!File::exists($path)) {
        abort(404);
    }

    $content = File::get($path);
    return Response::make($content, 200, [
        'Content-Type' => 'text/html',
    ]);
});

// please refer here: https://medium.com/@kayydee/serving-large-files-1gb-in-laravel-efficiently-with-streaming-3a76389fb9ae
Route::get('/api/storage/{path}', function ($path) {
    $filePath = storage_path("app/public/{$path}");

    if (!File::exists($filePath)) {
        abort(404);
    }

    // Clear output buffer just in case
    if (ob_get_level()) {
        ob_end_clean();
    }

    return response()->stream(function () use ($filePath) {
        // Turn off time limits and stream file
        set_time_limit(0);
        readfile($filePath);
        flush();
    }, 200, [
        'Content-Type' => File::mimeType($filePath),
        'Content-Length' => filesize($filePath),
        'Content-Disposition' => 'inline; filename="' . basename($filePath) . '"',
        'Accept-Ranges' => 'bytes', // Optional: allow seeking/resuming
    ]);
})->where('path', '.*');


// Your API route(s)
Route::get('/api/mock-response1', function () {
    return response()->json([
        'status' => 'success',
        'message' => 'This is a mock response',
        'data' => [
            'id' => 1,
            'name' => 'Sample User',
            'email' => 'sample@example.com',
        ],
    ]);
});


// Your API route(s)
Route::get('/api/mock-response2', function () {
    return response()->json([
        'status' => 'success',
        'message' => 'This is a mock response',
        'data' => [
            'id' => 1,
            'name' => 'kay User',
            'email' => 'kay@example.com',
        ],
    ]);
});


// Your API route(s)
Route::get('/api/mock-response3', function () {
    return response()->json([
        'status' => 'success',
        'message' => 'This is a mock response',
        'data' => [
            'id' => 1,
            'name' => 'kim User',
            'email' => 'kim@example.com',
        ],
    ]);
});

