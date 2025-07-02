<?php

use Illuminate\Support\Facades\Route;

use Illuminate\Support\Facades\Response;
use Illuminate\Support\Facades\File;

use Illuminate\Http\Request;

use Illuminate\Support\Facades\Config;
use Illuminate\Support\Carbon;

use Illuminate\Support\Facades\Log;

use Symfony\Component\HttpFoundation\Cookie;

Route::get('/api/me', function () {
    return response()->json([
        'auth' => Auth::check(),
        'user' => Auth::user(),
    ]);
})->middleware('web'); // or 'auth' if already logged in


Route::get('/api/sessions', function () {
    $sessionFiles = File::files(storage_path('framework/sessions'));

    $sessions = [];

    foreach ($sessionFiles as $file) {
        $id = $file->getFilename();
        $lastModified = $file->getMTime();
        $content = File::get($file->getRealPath());

        $sessions[] = [
            'session_id' => $id,
            'last_modified' => \Carbon\Carbon::createFromTimestamp($lastModified)->toDateTimeString(),
            'size' => $file->getSize(),
            // 'raw_data' => $content, // Uncomment if you want to see raw contents
        ];
    }

    return response()->json([
        'status' => 'success',
        'session_count' => count($sessions),
        'sessions' => $sessions,
    ]);
});


Route::get('/api/sessions/live', function () {
    $sessionFiles = File::files(storage_path('framework/sessions'));
    $lifetime = Config::get('session.lifetime') * 60; // Convert minutes to seconds

    $sessions = [];

    foreach ($sessionFiles as $file) {
        try {
            $id = $file->getFilename();
            $lastModified = $file->getMTime();

            // ⏰ Skip expired sessions
            if (time() - $lastModified > $lifetime) {
                continue;
            }

            $raw = File::get($file->getRealPath());
            $data = unserialize($raw);

            // ✅ Only logged-in sessions
            if (!empty($data['logged_in']) && !empty($data['user'])) {
                $user = $data['user'];

                // 🛡️ Remove password if present
                unset($user['password']);

                $sessions[] = [
                    'session_id' => $id,
                    'last_modified' => Carbon::createFromTimestamp($lastModified)->toDateTimeString(),
                    'user' => $user,
                    'size' => $file->getSize(),
                ];
            }
        } catch (\Exception $e) {
            continue;
        }
    }

    return response()->json([
        'status' => 'success',
        'session_count' => count($sessions),
        'sessions' => $sessions,
    ]);
});



Route::post('/api/login', function (Request $request) {
    $email = $request->input('email');
    $password = $request->input('password');

    // 🔐 Hardcoded users
    $users = [
        [
            'email' => 'kay@gmail.com',
            'password' => 'password123',
            'id' => 1,
            'name' => 'Kay Dee',
            'role' => 'admin',
            'group' => 'executive',
            'organization' => 'kay organization ',

        ],
        [
            'email' => 'uat@gmail.com',
            'password' => 'q',
            'id' => 2,
            'name' => 'User Test',
            'role' => 'testuser',
            'group' => 'operations',
            'organization' => 'test organization',
        ],
        [
            'email' => 'maricar@chuckgulledge.com',
            'password' => 'Password123',
            'id' => 2,
            'name' => 'Maricar Aquino',
            'role' => 'superadmin',
            'group' => 'operations',
            'organization' => 'maricar organization',
        ],
    ];

    // 🔍 Find matching user
    $matchedUser = collect($users)->first(function ($user) use ($email, $password) {
        return $user['email'] === $email && $user['password'] === $password;
    });

    if ($matchedUser) {
        // Save in session
        $request->session()->put('logged_in', true);
        $request->session()->put('user', $matchedUser);

        // Regenerate session ID for security
        $request->session()->regenerate();

        return response()->json([
            'status' => 'success',
            'session_id' => $request->session()->getId(),
            'user' => [
                'fullname' => $matchedUser['name'],
                'email' => $matchedUser['email'],
                'role' => $matchedUser['role'],
                'group' => $matchedUser['group'],
                'organization' => $matchedUser['organization'],
            ],
        ]);
    }

    return response()->json([
        'status' => 'error',
        'message' => 'Invalid credentials',
    ], 401);
});


Route::post('/api/login/one', function (Request $request) {
    $email = $request->input('email');
    $password = $request->input('password');

    // 🔐 Hardcoded credentials
    $validEmail = 'kay@gmail.com';
    $validPassword = 'password123';

    if ($email === $validEmail && $password === $validPassword) {
        // Simulated user data
        $user = [
            'id' => 1,
            'name' => 'Kay Dee',
            'email' => $email,
            'role' => 'admin',
            'group' => 'executive',
        ];

        // Save in session
        $request->session()->put('logged_in', true);
        $request->session()->put('user', $user);

        // 🔐 Optionally regenerate session ID for security
        $request->session()->regenerate();

        return response()->json([
            'status' => 'success',
            'session_id' => $request->session()->getId(), // ✅ This part is important
            'user' => [
                'email' => $user['email'],
                'role' => $user['role'],
                'group' => $user['group'],
            ],
        ]);        
    }

    return response()->json([
        'status' => 'error',
        'message' => 'Invalid credentials',
    ], 401);
});


Route::get('/api/logout', function (Request $request) {
    $request->session()->flush(); // 🔁 Clear all session data
    return response()->json([
        'status' => 'success',
        'message' => 'Logged out successfully',
    ]);
});


Route::get('/api/logout/{session_id}', function ($session_id, Request $request) {
    // Only flush if this is the current session (you can't flush other sessions!)
    if ($request->session()->getId() === $session_id) {
        $request->session()->flush();
        $request->session()->invalidate();
    }

    $path = storage_path("framework/sessions/{$session_id}");

    if (!file_exists($path)) {
        return response()->json([
            'status' => 'error',
            'message' => 'Session not found or already expired.',
        ], 404);
    }

    // Close PHP session (release lock)
    if (session_status() === PHP_SESSION_ACTIVE) {
        session_write_close();
    }

    // Delete file forcibly
    if (!unlink($path)) {
        return response()->json([
            'status' => 'error',
            'message' => 'Failed to delete session file.',
        ], 500);
    }

    return response()->json([
        'status' => 'success',
        'message' => "Session {$session_id} logged out (session file deleted).",
    ]);
});



Route::get('/api/csrf-token', function () {
    return response()->json(['csrf_token' => csrf_token()]);
});

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
            'name' => 'test User',
            'email' => 'test@example.com',
        ],
    ]);
});



// // Your API route(s)
// Route::get('/api/mock-response5', function () {
//     return response()->json([
//         'status' => 'success',
//         'message' => 'This is a mock response',
//         'data' => [
//             'id' => 1,
//             'name' => 'mock User',
//             'email' => 'mock@example.com',
//         ],
//     ]);
// });


// Your API route(s)
Route::get('/api/mock-response4', function (Request $request) {

    if (!$request->session()->get('logged_in')) {
        return response()->json(['message' => 'Unauthorized'], 401);
    }
    $user = $request->session()->get('user');

    return response()->json([
        'status' => 'success',
        'message' => 'This is a mock response',
        'data' => [
            'id' => 1,
            'name' => 'example User',
            'email' => 'example@example.com',
        ],
    ]);
});


Route::get('/api/mock-response5', function (Request $request) {
    if (!$request->session()->get('logged_in')) {
        return response()->json(['message' => 'Unauthorized'], 401);
    }
    $user = $request->session()->get('user');

    return response()->json([
        'status' => 'success',
        'message' => 'This is a mock response',
        'data' => $user,
    ]);
});

Route::get('/api/keep-alive', function (Request $request) {
    if (!$request->session()->get('logged_in')) {
        return response()->json(['message' => 'Unauthorized'], 401);
    }

    return response()->json([
        'message' => 'Session is running',
    ]);
});