<?php

// routes\web.php

use Illuminate\Support\Facades\Route;

use Illuminate\Support\Facades\Response;
use Illuminate\Support\Facades\File;

use Illuminate\Http\Request;

use Illuminate\Support\Facades\Config;
use Illuminate\Support\Carbon;

use Illuminate\Support\Facades\Log;

use Symfony\Component\HttpFoundation\Cookie;


// Configurable flag to enable/disable authentication
$API_secure = true;
// $API_secure = false;

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
            'position' => 'admin',

        ],
        [
            'email' => 'uat@gmail.com',
            'password' => 'q',
            'id' => 2,
            'name' => 'User Test',
            'role' => 'testuser',
            'group' => 'operations',
            'organization' => 'test organization',
            'position' => 'testuser',
        ],
        [
            'email' => 'maricar@chuckgulledge.com',
            'password' => 'Password123',
            'id' => 2,
            'name' => 'Maricar Aquino',
            'role' => 'superadmin',
            'group' => 'operations',
            'organization' => 'maricar organization',
            'position' => 'superadmin',
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
                'position' => $matchedUser['position'],
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

// ref: frontend\src\components\2.one-page-strategic-plan\onePageStrategicPlan.jsx

Route::get('/api/v1/one-page-strategic-plan/strategic-drivers', function (Request $request) use ($API_secure) {

    if ($API_secure) {
        if (!$request->session()->get('logged_in')) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }
        $user = $request->session()->get('user');
    }

    $organization = $request->query('organization');

    // Mock data for multiple organizations
    $data = [
        'Chuck Gulledge Advisors, LLC' => [
            [
                'id' => 1,
                'title' => 'Solution Innovation',
                'description' => 'Focuses on productization, technology, and data integration to create repeatable, scalable solutions that deliver on the brand promise.',
                'kpi' => 'Launch 2 scalable products',
                'status' => 'Tracking',
            ],
            [
                'id' => 2,
                'title' => 'Talent Leadership',
                'description' => 'Centers on elite coach acquisition and building a high-performance culture, ensuring the team can execute the innovative solutions.',
                'kpi' => 'Hire 5 elite coaches',
                'status' => 'Behind',
            ],
            [
                'id' => 3,
                'title' => 'Exceptional Delivery',
                'description' => 'Emphasizes structured processes and achieving 10/10 ratings, turning the talent and solutions into concrete results.',
                'kpi' => 'Achieve 90% 10/10 ratings',
                'status' => 'At Risk',
            ],
            [
                'id' => 4,
                'title' => 'Market Dominance',
                'description' => 'Leverages strategic alliances and builds a referral engine to expand reach, which then cycles back to reinforce the brand promise.',
                'kpi' => 'Grow referral traffic by 30%',
                'status' => 'Paused',
            ],
        ],

        'Collins Credit Union' => [
            [
                'id' => 1,
                'title' => 'Customer Centricity',
                'description' => 'Building an exceptional customer experience through tailored solutions and responsive service.',
                'kpi' => 'Increase customer satisfaction by 20%',
                'status' => 'Tracking',
            ],
            [
                'id' => 2,
                'title' => 'Operational Excellence',
                'description' => 'Streamline operations and reduce costs while maintaining quality.',
                'kpi' => 'Reduce operational costs by 10%',
                'status' => 'On Track',
            ],
            [
                'id' => 3,
                'title' => 'Digital Transformation',
                'description' => 'Implement new technologies to drive efficiency and innovation.',
                'kpi' => 'Migrate 70% of systems to cloud',
                'status' => 'At Risk',
            ],
            [
                'id' => 4,
                'title' => 'Market Expansion',
                'description' => 'Entering new markets and increasing market share.',
                'kpi' => 'Expand into 3 new markets',
                'status' => 'Behind',
            ],
        ],

        'Test Skeleton Loading' => [
            [
                'id' => 1,
                'title' => '-',
                'description' => '-',
                'kpi' => '-',
                'status' => '-',
            ],
            [
                'id' => 2,
                'title' => '-',
                'description' => '-',
                'kpi' => '-',
                'status' => '-',
            ],
            [
                'id' => 3,
                'title' => '-',
                'description' => '-',
                'kpi' => '-',
                'status' => '-',
            ],
            [
                'id' => 4,
                'title' => '-',
                'description' => '-',
                'kpi' => '-',
                'status' => '-',
            ],
        ],

    ];

    // Return data for the requested organization or empty array
    return response()->json($data[$organization] ?? []);
});


// ref: frontend\src\components\2.one-page-strategic-plan\onePageStrategicPlan.jsx

Route::get('/api/v1/one-page-strategic-plan/foundations', function (Request $request) use ($API_secure) {
    if ($API_secure) {
        if (!$request->session()->get('logged_in')) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }
        $user = $request->session()->get('user');
    }

    $data = [
        'Chuck Gulledge Advisors, LLC' => [
            [
                'id' => 1,
                'title' => 'Our Aspiration',
                'content' => '"To be renowned as the premier coaching organization that transforms how companies achieve their optimal exits."',
            ],
            [
                'id' => 2,
                'title' => 'Our Purpose / Mission',
                'content' => "Our purpose is:\n\nDevelop transformative coaching methodologies and frameworks.\nDeliver extraordinary, measurable results for our clients.\n\nOur organizational culture is designed so all team members win.",
            ],
            [
                'id' => 3,
                'title' => 'Brand Promise',
                'content' => '',
            ],
            [
                'id' => 4,
                'title' => 'Profit Per X',
                'content' => '',
            ],
            [
                'id' => 5,
                'title' => 'BHAG',
                'content' => '$100 Billion in Exit Value',
            ],
            [
                'id' => 6,
                'title' => '3HAG',
                'content' => '$7Mil in Revenue by 2027',
            ],
        ],
        'Collins Credit Union' => [
            [
                'id' => 1,
                'title' => 'Our Aspiration',
                'content' => '"To be a trusted partner driving financial wellness and community growth."',
            ],
            [
                'id' => 2,
                'title' => 'Our Purpose / Mission',
                'content' => "Empower members with innovative financial solutions.\nFoster a culture of inclusion and service excellence.",
            ],
            [
                'id' => 3,
                'title' => 'Brand Promise',
                'content' => 'Reliable, Friendly, Innovative.',
            ],
            [
                'id' => 4,
                'title' => 'Profit Per X',
                'content' => 'Maximize member value through sustainable growth.',
            ],
            [
                'id' => 5,
                'title' => 'BHAG',
                'content' => '$50 Million in Community Investments',
            ],
            [
                'id' => 6,
                'title' => '3HAG',
                'content' => '$12Mil in Revenue by 2028',
            ],
        ],
        'Test Skeleton Loading' => [
            [
                'id' => 1,
                'title' => '-',
                'content' => '-',
            ],
            [
                'id' => 2,
                'title' => '-',
                'content' => "-",
            ],
            [
                'id' => 3,
                'title' => '-',
                'content' => '-',
            ],
            [
                'id' => 4,
                'title' => '-',
                'content' => '-',
            ],
            [
                'id' => 5,
                'title' => '-',
                'content' => '-',
            ],
            [
                'id' => 6,
                'title' => '-',
                'content' => '-',
            ],
        ],
    ];

    $organization = $request->query('organization');

    if ($organization && isset($data[$organization])) {
        return response()->json($data[$organization]);
    }

    return response()->json(['message' => 'Organization not found or no organization provided.'], 404);
});


// ref: frontend\src\components\2.one-page-strategic-plan\onePageStrategicPlan.jsx
Route::get('/api/v1/one-page-strategic-plan/three-year-outlook', function (Request $request) use ($API_secure) {
    if ($API_secure) {
        if (!$request->session()->get('logged_in')) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }

        $user = $request->session()->get('user');
    }

    $organization = $request->query('organization');  // <-- get from query params

    $data = [
        'Chuck Gulledge Advisors, LLC' => [
            [
                'id' => 1,
                'year' => '2026',
                'value' => '1.0 Revenue of $4 Million',
            ],
            [
                'id' => 2,
                'year' => '2027',
                'value' => '2.0 Revenue of $7 Million',
            ],
            [
                'id' => 3,
                'year' => '2028',
                'value' => '3.0 Revenue of $9 Million',
            ],
        ],

        'Collins Credit Union' => [
            [
                'id' => 1,
                'year' => '2029',
                'value' => '4.0 Revenue of $10 Million',
            ],
            [
                'id' => 2,
                'year' => '2030',
                'value' => '5.0 Revenue of $11 Million',
            ],
            [
                'id' => 3,
                'year' => '2031',
                'value' => '6.0 Revenue of $12 Million',
            ],
        ],

        'Test Skeleton Loading' => [
            [
                'id' => 1,
                'year' => '-',
                'value' => '-',
            ],
            [
                'id' => 2,
                'year' => '-',
                'value' => '-',
            ],
            [
                'id' => 3,
                'year' => '-',
                'value' => '-',
            ],
        ],
      
    ];

    return response()->json([
        $organization => $data[$organization] ?? [],
    ]);
});


// ref: frontend\src\components\2.one-page-strategic-plan\onePageStrategicPlan.jsx
Route::get('/api/v1/one-page-strategic-plan/playing-to-win', function (Request $request) use ($API_secure) {
    if ($API_secure) {
        if (!$request->session()->get('logged_in')) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }

        $user = $request->session()->get('user');
    }

    $organization = $request->query('organization');  // <-- get from query params

    $data = [
        'Chuck Gulledge Advisors, LLC' => [
            [
                'id' => 1,
                'title' => '2026',
                'value' => '1.0 Revenue of $4 Million',
            ],
            [
                'id' => 2,
                'title' => '2027',
                'value' => '2.0 Revenue of $7 Million',
            ],
            [
                'id' => 3,
                'title' => '2028',
                'value' => '3.0 Revenue of $9 Million',
            ],
        ],

        'Collins Credit Union' => [
            [
                'id' => 1,
                'title' => '2029',
                'value' => '4.0 Revenue of $10 Million',
            ],
            [
                'id' => 2,
                'title' => '2030',
                'value' => '5.0 Revenue of $11 Million',
            ],
            [
                'id' => 3,
                'title' => '2031',
                'value' => '6.0 Revenue of $12 Million',
            ],
        ],

        'Test Skeleton Loading' => [
            [
                'id' => 1,
                'title' => '-',
                'value' => '-',
            ],
            [
                'id' => 2,
                'title' => '-',
                'value' => '-',
            ],
            [
                'id' => 3,
                'title' => '-',
                'value' => '-',
            ],
        ],
      
    ];

    return response()->json([
        $organization => $data[$organization] ?? [],
    ]);
});

// ref: frontend\src\components\2.one-page-strategic-plan\onePageStrategicPlan.jsx
Route::get('/api/v1/one-page-strategic-plan/core-capabilities', function (Request $request) use ($API_secure) {
    if ($API_secure && !$request->session()->get('logged_in')) {
        return response()->json(['message' => 'Unauthorized'], 401);
    }

    $organization = $request->query('organization');

    $data = [
        'Chuck Gulledge Advisors, LLC' => [
            ['id' => 1, 'description' => 'Leadership Training', 'orig' => '✓', 'q1' => 'x', 'q2' => 'x', 'q3' => 'x', 'q4' => 'x'],
            ['id' => 2, 'description' => 'Technology Stack', 'orig' => 'x', 'q1' => '✓', 'q2' => 'x', 'q3' => 'x', 'q4' => 'x'],
        ],
        'Collins Credit Union' => [
            ['id' => 1, 'description' => 'Customer Loyalty', 'orig' => '✓', 'q1' => '✓', 'q2' => 'x', 'q3' => 'x', 'q4' => 'x'],
        ],
        'Test Skeleton Loading' => [
            ['id' => 1, 'description' => '-', 'orig' => '-', 'q1' => '-', 'q2' => '-', 'q3' => '-', 'q4' => '-'],
        ],
    ];

    return response()->json([
        $organization => $data[$organization] ?? [],
    ]);
});

// ref: frontend\src\components\2.one-page-strategic-plan\onePageStrategicPlan.jsx
Route::get('/api/v1/one-page-strategic-plan/four-decisions', function (Request $request) use ($API_secure) {
    if ($API_secure && !$request->session()->get('logged_in')) {
        return response()->json(['message' => 'Unauthorized'], 401);
    }

    $organization = $request->query('organization');

    $data = [
        'Chuck Gulledge Advisors, LLC' => [
            ['id' => 1, 'description' => 'Budget Allocation', 'orig' => 'x', 'q1' => 'x', 'q2' => '✓', 'q3' => 'x', 'q4' => '✓'],
            ['id' => 2, 'description' => 'Product Launch', 'orig' => '✓', 'q1' => '✓', 'q2' => 'x', 'q3' => '✓', 'q4' => 'x'],
            ['id' => 3, 'description' => 'Market Research', 'orig' => 'x', 'q1' => 'x', 'q2' => 'x', 'q3' => '✓', 'q4' => '✓'],
            ['id' => 4, 'description' => 'Customer Feedback', 'orig' => '✓', 'q1' => '✓', 'q2' => 'x', 'q3' => 'x', 'q4' => '✓'],
            ['id' => 5, 'description' => 'Team Collaboration', 'orig' => 'x', 'q1' => 'x', 'q2' => '✓', 'q3' => 'x', 'q4' => 'x'],
            ['id' => 6, 'description' => 'Sales Strategy', 'orig' => '✓', 'q1' => 'x', 'q2' => 'x', 'q3' => '✓', 'q4' => '✓'],
            ['id' => 7, 'description' => 'Quality Control', 'orig' => 'x', 'q1' => '✓', 'q2' => '✓', 'q3' => 'x', 'q4' => 'x'],
            ['id' => 8, 'description' => 'Employee Engagement', 'orig' => '✓', 'q1' => '✓', 'q2' => 'x', 'q3' => '✓', 'q4' => 'x'],
        ],
        'Test Skeleton Loading' => [
            ['id' => 1, 'description' => '-', 'orig' => '-', 'q1' => '-', 'q2' => '-', 'q3' => '-', 'q4' => '-'],
            ['id' => 2, 'description' => '-', 'orig' => '-', 'q1' => '-', 'q2' => '-', 'q3' => '-', 'q4' => '-'],
            ['id' => 3, 'description' => '-', 'orig' => '-', 'q1' => '-', 'q2' => '-', 'q3' => '-', 'q4' => '-'],
            ['id' => 4, 'description' => '-', 'orig' => '-', 'q1' => '-', 'q2' => '-', 'q3' => '-', 'q4' => '-'],
            ['id' => 5, 'description' => '-', 'orig' => '-', 'q1' => '-', 'q2' => '-', 'q3' => '-', 'q4' => '-'],
            ['id' => 6, 'description' => '-', 'orig' => '-', 'q1' => '-', 'q2' => '-', 'q3' => '-', 'q4' => '-'],
            ['id' => 7, 'description' => '-', 'orig' => '-', 'q1' => '-', 'q2' => '-', 'q3' => '-', 'q4' => '-'],
            ['id' => 8, 'description' => '-', 'orig' => '-', 'q1' => '-', 'q2' => '-', 'q3' => '-', 'q4' => '-'],
        ],
    ];

    return response()->json([
        $organization => $data[$organization] ?? [],
    ]);
});

// ref: frontend\src\components\2.one-page-strategic-plan\onePageStrategicPlan.jsx
Route::get('/api/v1/one-page-strategic-plan/constraints-tracker', function (Request $request) use ($API_secure) {
    if ($API_secure && !$request->session()->get('logged_in')) {
        return response()->json(['message' => 'Unauthorized'], 401);
    }

    $organization = $request->query('organization');

    $data = [
        'Chuck Gulledge Advisors, LLC' => [
            ['id' => 1, 'constraintTitle' => 'Leadership Training', 'description' => 'Pending', 'owner' => 'John Doe', 'actions' => 'In Progress', 'status' => 'Not Started'],
            ['id' => 2, 'constraintTitle' => 'Technology Stack', 'description' => 'Completed', 'owner' => 'Alice Smith', 'actions' => 'Ongoing', 'status' => 'Active'],
            ['id' => 3, 'constraintTitle' => 'Budget Allocation', 'description' => 'Reviewed', 'owner' => 'Sarah Lee', 'actions' => 'Scheduled', 'status' => 'Not Started'],
            ['id' => 4, 'constraintTitle' => 'Customer Feedback', 'description' => 'Pending', 'owner' => 'Mark Johnson', 'actions' => 'Completed', 'status' => 'Active'],
            ['id' => 5, 'constraintTitle' => 'Product Launch', 'description' => 'Approved', 'owner' => 'Linda Green', 'actions' => 'In Progress', 'status' => 'Active'],
            ['id' => 6, 'constraintTitle' => 'Team Collaboration', 'description' => 'In Progress', 'owner' => 'Emma Brown', 'actions' => 'Scheduled', 'status' => 'Not Started'],
            ['id' => 7, 'constraintTitle' => 'Market Research', 'description' => 'Completed', 'owner' => 'David White', 'actions' => 'Pending', 'status' => 'Inactive'],
        ],
        'Test Skeleton Loading' => [
            ['id' => 1, 'constraintTitle' => '-', 'description' => '-', 'owner' => '-', 'actions' => '-', 'status' => '-'],
            ['id' => 2, 'constraintTitle' => '-', 'description' => '-', 'owner' => '-', 'actions' => '-', 'status' => '-'],
            ['id' => 3, 'constraintTitle' => '-', 'description' => '-', 'owner' => '-', 'actions' => '-', 'status' => '-'],
            ['id' => 4, 'constraintTitle' => '-', 'description' => '-', 'owner' => '-', 'actions' => '-', 'status' => '-'],
            ['id' => 5, 'constraintTitle' => '-', 'description' => '-', 'owner' => '-', 'actions' => '-', 'status' => '-'],
            ['id' => 6, 'constraintTitle' => '-', 'description' => '-', 'owner' => '-', 'actions' => '-', 'status' => '-'],
            ['id' => 7, 'constraintTitle' => '-', 'description' => '-', 'owner' => '-', 'actions' => '-', 'status' => '-'],
        ],
    ];

    return response()->json([
        $organization => $data[$organization] ?? [],
    ]);
});


// ref: frontend\src\components\4.scoreboard\Scoreboard.jsx
Route::get('/api/v1/scoreboard/annual-priorities', function (Request $request) use ($API_secure) {
    if ($API_secure) {
        if (!$request->session()->get('logged_in')) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }
        $user = $request->session()->get('user');
    }

    $organization = $request->query('organization');

    $data = [
        'Chuck Gulledge Advisors, LLC' => [
            'average' => 64.28,
            'members' => [
                ['name' => 'Maricar Aquino', 'score' => 100],
                ['name' => 'Chuck Gulledge', 'score' => 71],
                ['name' => '', 'score' => 22],
            ],
        ],

        'Collins Credit Union' => [
            'average' => 75.45,
            'members' => [
                ['name' => 'John Smith', 'score' => 80],
                ['name' => 'Jane Doe', 'score' => 90],
                ['name' => 'Emily Davis', 'score' => 56],
            ],
        ],

        'Test Skeleton Loading' => [
            'average' => 0,
            'members' => [
                ['name' => '-', 'score' => 0],
                ['name' => '-', 'score' => 0],
                ['name' => '-', 'score' => 0],
            ],
        ],
    ];

    return response()->json($data[$organization] ?? ['average' => 0, 'members' => []]);
});

// ref: frontend\src\components\4.scoreboard\Scoreboard.jsx
Route::get('/api/v1/scoreboard/company-traction-cards', function (Request $request) use ($API_secure) {
    if ($API_secure) {
        if (!$request->session()->get('logged_in')) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }
        $user = $request->session()->get('user');
    }

    $organization = $request->query('organization');

    $data = [
        'Chuck Gulledge Advisors, LLC' => [
            ['label' => 'Q1', 'percent' => 100],
            ['label' => 'Q2', 'percent' => 93],
            ['label' => 'Q3', 'percent' => 5],
            ['label' => 'Q4', 'percent' => 0],
        ],
        'Collins Credit Union' => [
            ['label' => 'Q1', 'percent' => 85],
            ['label' => 'Q2', 'percent' => 75],
            ['label' => 'Q3', 'percent' => 55],
            ['label' => 'Q4', 'percent' => 60],
        ],
        'Test Skeleton Loading' => [
            ['label' => 'Q1', 'percent' => 0],
            ['label' => 'Q2', 'percent' => 0],
            ['label' => 'Q3', 'percent' => 0],
            ['label' => 'Q4', 'percent' => 0],
        ],
    ];

    return response()->json($data[$organization] ?? []);
});


Route::get('/api/v1/scoreboard/project-progress', function (Request $request) use ($API_secure) {
    if ($API_secure) {
        if (!$request->session()->get('logged_in')) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }
    }

    $organization = $request->query('organization');

    // 🧪 Sample data for multiple orgs
    $data = [
        'Chuck Gulledge Advisors, LLC' => [
            'completed' => 10,
            'total' => 36,
        ],
        'Collins Credit Union' => [
            'completed' => 28,
            'total' => 30,
        ],
        'Test Skeleton Loading' => [
            'completed' => 0,
            'total' => 0,
        ],
    ];

    return response()->json($data[$organization] ?? ['completed' => 0, 'total' => 0]);
});


// ref: frontend\src\components\5.growth-command-center\growthCommandCenter.jsx
Route::get('/api/v1/growth-command-center/metrics', function (Request $request) {
    $organization = $request->query('organization');

    $data = [
        'Chuck Gulledge Advisors, LLC' => [
            [
                'title' => 'Checks Processed',
                'percent' => 30,
                'annualGoal' => 20000,
                'current' => 18888,
                'monthlyData' => [
                    ['month' => 'Jan', 'goal' => 1500, 'current' => 1300, 'progress' => 87],
                    ['month' => 'Feb', 'goal' => 1500, 'current' => 1700, 'progress' => 113],
                    ['month' => 'Mar', 'goal' => 1800, 'current' => 2000, 'progress' => 111],
                    ['month' => 'Apr', 'goal' => 1700, 'current' => 1600, 'progress' => 94],
                    ['month' => 'May', 'goal' => 1600, 'current' => 1650, 'progress' => 103],
                    ['month' => 'Jun', 'goal' => 1700, 'current' => 1850, 'progress' => 109],
                    ['month' => 'Jul', 'goal' => 1700, 'current' => 1700, 'progress' => 100],
                    ['month' => 'Aug', 'goal' => 1600, 'current' => 1600, 'progress' => 100],
                    ['month' => 'Sep', 'goal' => 1800, 'current' => 1700, 'progress' => 94],
                    ['month' => 'Oct', 'goal' => 1600, 'current' => 1700, 'progress' => 106],
                    ['month' => 'Nov', 'goal' => 1400, 'current' => 1388, 'progress' => 99],
                    ['month' => 'Dec', 'goal' => 1500, 'current' => 1800, 'progress' => 120],
                ],
                'quarterlyData' => [
                    ['quarter' => 'Q1', 'goal' => 4800, 'current' => 5000, 'progress' => 104],
                    ['quarter' => 'Q2', 'goal' => 5000, 'current' => 5100, 'progress' => 102],
                    ['quarter' => 'Q3', 'goal' => 5100, 'current' => 5000, 'progress' => 98],
                    ['quarter' => 'Q4', 'goal' => 4500, 'current' => 4788, 'progress' => 106],
                ],
            ],
            [
                'title' => 'Number of Customers',
                'percent' => 50,
                'annualGoal' => 1000,
                'current' => 500,
                'monthlyData' => [
                    ['month' => 'Jan', 'goal' => 80, 'current' => 40, 'progress' => 50],
                    ['month' => 'Feb', 'goal' => 90, 'current' => 50, 'progress' => 56],
                    ['month' => 'Mar', 'goal' => 100, 'current' => 60, 'progress' => 60],
                    ['month' => 'Apr', 'goal' => 90, 'current' => 70, 'progress' => 78],
                    ['month' => 'May', 'goal' => 90, 'current' => 80, 'progress' => 89],
                    ['month' => 'Jun', 'goal' => 80, 'current' => 60, 'progress' => 75],
                    ['month' => 'Jul', 'goal' => 90, 'current' => 70, 'progress' => 78],
                    ['month' => 'Aug', 'goal' => 90, 'current' => 70, 'progress' => 78],
                    ['month' => 'Sep', 'goal' => 100, 'current' => 0, 'progress' => 0],
                    ['month' => 'Oct', 'goal' => 90, 'current' => 0, 'progress' => 0],
                    ['month' => 'Nov', 'goal' => 60, 'current' => 0, 'progress' => 0],
                    ['month' => 'Dec', 'goal' => 60, 'current' => 0, 'progress' => 0],
                ],
                'quarterlyData' => [
                    ['quarter' => 'Q1', 'goal' => 270, 'current' => 150, 'progress' => 56],
                    ['quarter' => 'Q2', 'goal' => 260, 'current' => 210, 'progress' => 81],
                    ['quarter' => 'Q3', 'goal' => 280, 'current' => 140, 'progress' => 50],
                    ['quarter' => 'Q4', 'goal' => 210, 'current' => 0, 'progress' => 0],
                ],
            ],
            [
                'title' => 'Profit per X',
                'percent' => 89,
                'annualGoal' => 120000,
                'current' => 106800,
                'monthlyData' => [
                    ['month' => 'Jan', 'goal' => 10000, 'current' => 9000, 'progress' => 90],
                    ['month' => 'Feb', 'goal' => 10000, 'current' => 9600, 'progress' => 96],
                    ['month' => 'Mar', 'goal' => 10000, 'current' => 9700, 'progress' => 97],
                    ['month' => 'Apr', 'goal' => 10000, 'current' => 8800, 'progress' => 88],
                    ['month' => 'May', 'goal' => 10000, 'current' => 9200, 'progress' => 92],
                    ['month' => 'Jun', 'goal' => 10000, 'current' => 9100, 'progress' => 91],
                    ['month' => 'Jul', 'goal' => 10000, 'current' => 10000, 'progress' => 100],
                    ['month' => 'Aug', 'goal' => 10000, 'current' => 9500, 'progress' => 95],
                    ['month' => 'Sep', 'goal' => 10000, 'current' => 9500, 'progress' => 95],
                    ['month' => 'Oct', 'goal' => 10000, 'current' => 10000, 'progress' => 100],
                    ['month' => 'Nov', 'goal' => 10000, 'current' => 10000, 'progress' => 100],
                    ['month' => 'Dec', 'goal' => 10000, 'current' => 10000, 'progress' => 100],
                ],
                'quarterlyData' => [
                    ['quarter' => 'Q1', 'goal' => 30000, 'current' => 28300, 'progress' => 94],
                    ['quarter' => 'Q2', 'goal' => 30000, 'current' => 27100, 'progress' => 90],
                    ['quarter' => 'Q3', 'goal' => 30000, 'current' => 29000, 'progress' => 97],
                    ['quarter' => 'Q4', 'goal' => 30000, 'current' => 22400, 'progress' => 75],
                ],
            ],
        ],

        'Collins Credit Union' => [
            [
                'title' => 'Checks Processed',
                'percent' => 65,
                'annualGoal' => 24000,
                'current' => 15600,
                'monthlyData' => [
                    ['month' => 'Jan', 'goal' => 2000, 'current' => 1800, 'progress' => 90],
                    ['month' => 'Feb', 'goal' => 2000, 'current' => 1900, 'progress' => 95],
                    ['month' => 'Mar', 'goal' => 2000, 'current' => 2000, 'progress' => 100],
                    ['month' => 'Apr', 'goal' => 2000, 'current' => 1900, 'progress' => 95],
                    ['month' => 'May', 'goal' => 2000, 'current' => 2000, 'progress' => 100],
                    ['month' => 'Jun', 'goal' => 2000, 'current' => 1900, 'progress' => 95],
                    ['month' => 'Jul', 'goal' => 2000, 'current' => 1600, 'progress' => 80],
                    ['month' => 'Aug', 'goal' => 2000, 'current' => 1500, 'progress' => 75],
                    ['month' => 'Sep', 'goal' => 2000, 'current' => 1500, 'progress' => 75],
                    ['month' => 'Oct', 'goal' => 2000, 'current' => 1600, 'progress' => 80],
                    ['month' => 'Nov', 'goal' => 2000, 'current' => 1500, 'progress' => 75],
                    ['month' => 'Dec', 'goal' => 2000, 'current' => 1500, 'progress' => 75],
                ],
                'quarterlyData' => [
                    ['quarter' => 'Q1', 'goal' => 6000, 'current' => 5700, 'progress' => 95],
                    ['quarter' => 'Q2', 'goal' => 6000, 'current' => 5800, 'progress' => 97],
                    ['quarter' => 'Q3', 'goal' => 6000, 'current' => 4600, 'progress' => 76],
                    ['quarter' => 'Q4', 'goal' => 6000, 'current' => 5500, 'progress' => 91],
                ],
            ],
            [
                'title' => 'Number of Customers',
                'percent' => 40,
                'annualGoal' => 800,
                'current' => 320,
                'monthlyData' => [
                    ['month' => 'Jan', 'goal' => 70, 'current' => 50, 'progress' => 71],
                    ['month' => 'Feb', 'goal' => 70, 'current' => 55, 'progress' => 79],
                    ['month' => 'Mar', 'goal' => 70, 'current' => 60, 'progress' => 86],
                    ['month' => 'Apr', 'goal' => 70, 'current' => 60, 'progress' => 86],
                    ['month' => 'May', 'goal' => 70, 'current' => 65, 'progress' => 93],
                    ['month' => 'Jun', 'goal' => 70, 'current' => 60, 'progress' => 86],
                    ['month' => 'Jul', 'goal' => 70, 'current' => 50, 'progress' => 71],
                    ['month' => 'Aug', 'goal' => 70, 'current' => 40, 'progress' => 57],
                    ['month' => 'Sep', 'goal' => 70, 'current' => 30, 'progress' => 43],
                    ['month' => 'Oct', 'goal' => 70, 'current' => 30, 'progress' => 43],
                    ['month' => 'Nov', 'goal' => 70, 'current' => 30, 'progress' => 43],
                    ['month' => 'Dec', 'goal' => 70, 'current' => 30, 'progress' => 43],
                ],
                'quarterlyData' => [
                    ['quarter' => 'Q1', 'goal' => 210, 'current' => 165, 'progress' => 79],
                    ['quarter' => 'Q2', 'goal' => 210, 'current' => 190, 'progress' => 90],
                    ['quarter' => 'Q3', 'goal' => 210, 'current' => 120, 'progress' => 57],
                    ['quarter' => 'Q4', 'goal' => 210, 'current' => 105, 'progress' => 50],
                ],
            ],
            [
                'title' => 'Profit per X',
                'percent' => 75,
                'annualGoal' => 100000,
                'current' => 75000,
                'monthlyData' => [
                    ['month' => 'Jan', 'goal' => 8000, 'current' => 7000, 'progress' => 88],
                    ['month' => 'Feb', 'goal' => 8000, 'current' => 7500, 'progress' => 94],
                    ['month' => 'Mar', 'goal' => 8000, 'current' => 8000, 'progress' => 100],
                    ['month' => 'Apr', 'goal' => 8000, 'current' => 7500, 'progress' => 94],
                    ['month' => 'May', 'goal' => 8000, 'current' => 7800, 'progress' => 98],
                    ['month' => 'Jun', 'goal' => 8000, 'current' => 7700, 'progress' => 96],
                    ['month' => 'Jul', 'goal' => 8000, 'current' => 6000, 'progress' => 75],
                    ['month' => 'Aug', 'goal' => 8000, 'current' => 5500, 'progress' => 69],
                    ['month' => 'Sep', 'goal' => 8000, 'current' => 5000, 'progress' => 63],
                    ['month' => 'Oct', 'goal' => 8000, 'current' => 5000, 'progress' => 63],
                    ['month' => 'Nov', 'goal' => 8000, 'current' => 5000, 'progress' => 63],
                    ['month' => 'Dec', 'goal' => 8000, 'current' => 5000, 'progress' => 63],
                ],
                'quarterlyData' => [
                    ['quarter' => 'Q1', 'goal' => 24000, 'current' => 22500, 'progress' => 94],
                    ['quarter' => 'Q2', 'goal' => 24000, 'current' => 23000, 'progress' => 96],
                    ['quarter' => 'Q3', 'goal' => 24000, 'current' => 16500, 'progress' => 69],
                    ['quarter' => 'Q4', 'goal' => 24000, 'current' => 13000, 'progress' => 54],
                ],
            ],
        ],

    
        'Test Skeleton Loading' => [
            [
                'title' => '0',
                'percent' => 0,
                'annualGoal' => 0,
                'current' => 0,
                'monthlyData' => [
                    ['month' => 'Jan', 'goal' => 0, 'current' => 0, 'progress' => 0],
                    ['month' => 'Feb', 'goal' => 0, 'current' => 0, 'progress' => 0],
                    ['month' => 'Mar', 'goal' => 0, 'current' => 0, 'progress' => 0],
                    ['month' => 'Apr', 'goal' => 0, 'current' => 0, 'progress' => 0],
                    ['month' => 'May', 'goal' => 0, 'current' => 0, 'progress' => 0],
                    ['month' => 'Jun', 'goal' => 0, 'current' => 0, 'progress' => 0],
                    ['month' => 'Jul', 'goal' => 0, 'current' => 0, 'progress' => 0],
                    ['month' => 'Aug', 'goal' => 0, 'current' => 0, 'progress' => 0],
                    ['month' => 'Sep', 'goal' => 0, 'current' => 0, 'progress' => 0],
                    ['month' => 'Oct', 'goal' => 0, 'current' => 0, 'progress' => 0],
                    ['month' => 'Nov', 'goal' => 0, 'current' => 0, 'progress' => 0],
                    ['month' => 'Dec', 'goal' => 0, 'current' => 0, 'progress' => 0],
                ],
                'quarterlyData' => [
                    ['quarter' => 'Q1', 'goal' => 0, 'current' => 0, 'progress' => 0],
                    ['quarter' => 'Q2', 'goal' => 0, 'current' => 0, 'progress' => 0],
                    ['quarter' => 'Q3', 'goal' => 0, 'current' => 0, 'progress' => 0],
                    ['quarter' => 'Q4', 'goal' => 0, 'current' => 0, 'progress' => 0],
                ],
            ],
            // Clone for 2nd and 3rd cards
            [
                'title' => '0',
                'percent' => 0,
                'annualGoal' => 0,
                'current' => 0,
                'monthlyData' => [
                    ['month' => 'Jan', 'goal' => 0, 'current' => 0, 'progress' => 0],
                    ['month' => 'Feb', 'goal' => 0, 'current' => 0, 'progress' => 0],
                    ['month' => 'Mar', 'goal' => 0, 'current' => 0, 'progress' => 0],
                    ['month' => 'Apr', 'goal' => 0, 'current' => 0, 'progress' => 0],
                    ['month' => 'May', 'goal' => 0, 'current' => 0, 'progress' => 0],
                    ['month' => 'Jun', 'goal' => 0, 'current' => 0, 'progress' => 0],
                    ['month' => 'Jul', 'goal' => 0, 'current' => 0, 'progress' => 0],
                    ['month' => 'Aug', 'goal' => 0, 'current' => 0, 'progress' => 0],
                    ['month' => 'Sep', 'goal' => 0, 'current' => 0, 'progress' => 0],
                    ['month' => 'Oct', 'goal' => 0, 'current' => 0, 'progress' => 0],
                    ['month' => 'Nov', 'goal' => 0, 'current' => 0, 'progress' => 0],
                    ['month' => 'Dec', 'goal' => 0, 'current' => 0, 'progress' => 0],
                ],
                'quarterlyData' => [
                    ['quarter' => 'Q1', 'goal' => 0, 'current' => 0, 'progress' => 0],
                    ['quarter' => 'Q2', 'goal' => 0, 'current' => 0, 'progress' => 0],
                    ['quarter' => 'Q3', 'goal' => 0, 'current' => 0, 'progress' => 0],
                    ['quarter' => 'Q4', 'goal' => 0, 'current' => 0, 'progress' => 0],
                ],
            ],
            [
                'title' => '0',
                'percent' => 0,
                'annualGoal' => 0,
                'current' => 0,
                'monthlyData' => [
                    ['month' => 'Jan', 'goal' => 0, 'current' => 0, 'progress' => 0],
                    ['month' => 'Feb', 'goal' => 0, 'current' => 0, 'progress' => 0],
                    ['month' => 'Mar', 'goal' => 0, 'current' => 0, 'progress' => 0],
                    ['month' => 'Apr', 'goal' => 0, 'current' => 0, 'progress' => 0],
                    ['month' => 'May', 'goal' => 0, 'current' => 0, 'progress' => 0],
                    ['month' => 'Jun', 'goal' => 0, 'current' => 0, 'progress' => 0],
                    ['month' => 'Jul', 'goal' => 0, 'current' => 0, 'progress' => 0],
                    ['month' => 'Aug', 'goal' => 0, 'current' => 0, 'progress' => 0],
                    ['month' => 'Sep', 'goal' => 0, 'current' => 0, 'progress' => 0],
                    ['month' => 'Oct', 'goal' => 0, 'current' => 0, 'progress' => 0],
                    ['month' => 'Nov', 'goal' => 0, 'current' => 0, 'progress' => 0],
                    ['month' => 'Dec', 'goal' => 0, 'current' => 0, 'progress' => 0],
                ],
                'quarterlyData' => [
                    ['quarter' => 'Q1', 'goal' => 0, 'current' => 0, 'progress' => 0],
                    ['quarter' => 'Q2', 'goal' => 0, 'current' => 0, 'progress' => 0],
                    ['quarter' => 'Q3', 'goal' => 0, 'current' => 0, 'progress' => 0],
                    ['quarter' => 'Q4', 'goal' => 0, 'current' => 0, 'progress' => 0],
                ],
            ],
        ],


    ];
    
    return response()->json([
        $organization => $data[$organization] ?? [],
    ]);
});

// ref: frontend\src\components\5.growth-command-center\growthCommandCenter.jsx
Route::get('/api/v1/growth-command-center/revenue-growth', function (Request $request) use ($API_secure) {

    if ($API_secure) {
        if (!$request->session()->get('logged_in')) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }
        $user = $request->session()->get('user');
    }

    $organization = $request->query('organization');

    // Mock data for multiple organizations
    $data = [
        'Chuck Gulledge Advisors, LLC' => [
            [
                'year' => '2023',
                'revenueGrowth' => 5,
                'cogsGrowth' => 3,
            ],
            [
                'year' => '2024',
                'revenueGrowth' => 12,
                'cogsGrowth' => 10,
            ],
            [
                'year' => '2025',
                'revenueGrowth' => 9,
                'cogsGrowth' => 7,
            ],
        ],

        'Collins Credit Union' => [
            [
                'year' => '2023',
                'revenueGrowth' => 4,
                'cogsGrowth' => 2,
            ],
            [
                'year' => '2024',
                'revenueGrowth' => 9,
                'cogsGrowth' => 7,
            ],
            [
                'year' => '2025',
                'revenueGrowth' => 11,
                'cogsGrowth' => 8,
            ],
        ],

        'Test Skeleton Loading' => [
            [
                'year' => '2023',
                'revenueGrowth' => 0,
                'cogsGrowth' => 0,
            ],
            [
                'year' => '2024',
                'revenueGrowth' => 0,
                'cogsGrowth' => 0,
            ],
            [
                'year' => '2025',
                'revenueGrowth' => 0,
                'cogsGrowth' => 0,
            ],
        ],
    ];

    return response()->json($data[$organization] ?? []);
});


// ref: frontend\src\components\6.company-traction\companyTraction.jsx
Route::get('/api/v1/company-traction/annual-priorities', function (Request $request) use ($API_secure) {

    if ($API_secure) {
        if (!$request->session()->get('logged_in')) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }
        $user = $request->session()->get('user');
    }

    $organization = $request->query('organization');

    // Mock data for multiple organizations
    $data = [
        'Chuck Gulledge Advisors, LLC' => [
            [
                'id' => 1,
                'description' => 'Systematize Coaching Framework (now called Momentum OS).',
                'status' => '100.00%',
            ],
            [
                'id' => 2,
                'description' => 'Centers on elite coach acquisition and building a high-performance culture, ensuring the team can execute the innovative solutions.',
                'status' => '75.00%',
            ],
            [
                'id' => 3,
                'description' => 'Emphasizes structured processes and achieving 10/10 ratings, turning the talent and solutions into concrete results.',
                'status' => '60.00%',
            ],
            [
                'id' => 4,
                'description' => 'Leverages strategic alliances and builds a referral engine to expand reach, which then cycles back to reinforce the brand promise.',
                'status' => '45.00%',
            ],
        ],

        'Collins Credit Union' => [
            [
                'id' => 1,
                'description' => 'Building an exceptional customer experience through tailored solutions and responsive service.',
                'status' => '85.00%',
            ],
            [
                'id' => 2,
                'description' => 'Streamline operations and reduce costs while maintaining quality.',
                'status' => '90.00%',
            ],
            [
                'id' => 3,
                'description' => 'Implement new technologies to drive efficiency and innovation.',
                'status' => '60.00%',
            ],
            [
                'id' => 4,
                'description' => 'Entering new markets and increasing market share.',
                'status' => '50.00%',
            ],
        ],

        'Test Skeleton Loading' => [
            [
                'id' => 1,
                'description' => '-',
                'status' => '-',
            ],
            [
                'id' => 2,
                'description' => '-',
                'status' => '-',
            ],
            [
                'id' => 3,
                'description' => '-',
                'status' => '-',
            ],
            [
                'id' => 4,
                'description' => '-',
                'status' => '-',
            ],
        ],
    ];


    // Return data for the requested organization or empty array
    return response()->json($data[$organization] ?? []);
});

// ref: frontend\src\components\6.company-traction\companyTraction.jsx
Route::get('/api/v1/company-traction/traction-data', function (Request $request) use ($API_secure) {
    if ($API_secure) {
        if (!$request->session()->get('logged_in')) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }
    }

    $organization = $request->query('organization');

    $mockData = [
        'Chuck Gulledge Advisors, LLC' => [
            'Q1' => [
                [
                    'id' => 1,
                    'who' => 'Maricar',
                    'collaborator' => 'Maricar',
                    'description' => 'Build landing page',
                    'progress' => '5%',
                    'annualPriority' => 'Develop lead generation systems',
                    'dueDate' => '03-31-2025',
                    'rank' => '1',
                    'comment' => [
                        [
                            'author' => 'Maricar',
                            'message' => 'This is a test comment.',
                            'posted' => '26 June 2025',
                        ],
                        [
                            'author' => 'John',
                            'message' => 'Great work on this!',
                            'posted' => '27 June 2025',
                        ],
                    ],
                ],
            ],
            'Q2' => [
                [
                    'id' => 1,
                    'who' => 'Maricar',
                    'collaborator' => 'Maricar',
                    'description' => 'Launch marketing campaign',
                    'progress' => '0%',
                    'annualPriority' => 'Develop lead generation systems',
                    'dueDate' => 'Click to set date',
                    'rank' => '2',
                    'comment' => [
                        [
                            'author' => 'Maricar',
                            'message' => 'This is a test comment.',
                            'posted' => '26 June 2025',
                        ],
                    ],
                ],
            ],
            'Q3' => [],
            'Q4' => [],
        ],

        'Chuck Gulledge Advisors, LLC' => [
            'Q1' => [
                [
                    'id' => 1,
                    'who' => 'Maricar',
                    'collaborator' => 'Maricar',
                    'description' => 'Build landing page',
                    'progress' => '5%',
                    'annualPriority' => 'Develop lead generation systems',
                    'dueDate' => '03-31-2025',
                    'rank' => '1',
                    'comment' => [
                        [
                            'author' => 'Maricar',
                            'message' => 'This is a test comment.',
                            'posted' => '26 June 2025',
                        ],
                        [
                            'author' => 'John',
                            'message' => 'Great work on this!',
                            'posted' => '27 June 2025',
                        ],
                    ],
                ],
            ],
            'Q2' => [
                [
                    'id' => 1,
                    'who' => 'Maricar',
                    'collaborator' => 'Maricar',
                    'description' => 'Launch marketing campaign',
                    'progress' => '0%',
                    'annualPriority' => 'Develop lead generation systems',
                    'dueDate' => 'Click to set date',
                    'rank' => '2',
                    'comment' => [
                        [
                            'author' => 'Maricar',
                            'message' => 'This is a test comment.',
                            'posted' => '26 June 2025',
                        ],
                    ],
                ],

                [
                    'id' => 2,
                    'who' => 'Chuck',
                    'collaborator' => 'Maricar',
                    'description' => 'Launch marketing campaign',
                    'progress' => '0%',
                    'annualPriority' => 'Develop lead generation systems',
                    'dueDate' => 'Click to set date',
                    'rank' => '2',
                    'comment' => [
                        [
                            'author' => 'Maricar',
                            'message' => 'This is a test comment.',
                            'posted' => '26 June 2025',
                        ],
                    ],
                ],
            ],
            'Q3' => [],
            'Q4' => [],
        ],
        'Test Skeleton Loading' => [
            'Q1' => [],
            'Q2' => [],
            'Q3' => [],
            'Q4' => [],
        ],
    ];

    return response()->json($mockData[$organization] ?? [
        'Q1' => [],
        'Q2' => [],
        'Q3' => [],
        'Q4' => [],
    ]);
});

// ref: frontend\src\components\7.department-traction\departmentTraction.jsx
Route::get('/api/v1/department-traction/annual-priorities', function (Request $request) use ($API_secure) {
    if ($API_secure) {
        if (!$request->session()->get('logged_in')) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }
    }

    $organization = $request->query('organization');

    $data = [
        'Chuck Gulledge Advisors, LLC' => [
            [
                'id' => 1,
                'description' => 'Department-level initiative to enhance coaching operations.',
                'status' => '90.00%',
            ],
            [
                'id' => 2,
                'description' => 'Optimize department communication strategies.',
                'status' => '75.00%',
            ],
        ],
        'Collins Credit Union' => [
            [
                'id' => 1,
                'description' => 'Improve internal training programs within departments.',
                'status' => '80.00%',
            ],
            [
                'id' => 2,
                'description' => 'Implement KPI dashboards for each department.',
                'status' => '70.00%',
            ],
        ],
        'Test Skeleton Loading' => [
            [
                'id' => 1,
                'description' => '-',
                'status' => '-',
            ],
            [
                'id' => 2,
                'description' => '-',
                'status' => '-',
            ],
        ],
    ];

    return response()->json($data[$organization] ?? []);
});

// ref: frontend\src\components\7.department-traction\departmentTraction.jsx
Route::get('/api/v1/department-traction/traction-data', function (Request $request) use ($API_secure) {
    if ($API_secure) {
        if (!$request->session()->get('logged_in')) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }
    }

    $organization = $request->query('organization');

    $mockData = [
        'Chuck Gulledge Advisors, LLC' => [
            'Q1' => [
                [
                    'id' => 1,
                    'who' => 'Maricar',
                    'collaborator' => 'Maricar',
                    'description' => 'Build landing page',
                    'progress' => '5%',
                    'annualPriority' => 'Develop lead generation systems',
                    'dueDate' => '03-31-2025',
                    'rank' => '1',
                    'comment' => [
                        [
                            'author' => 'Maricar',
                            'message' => 'This is a test comment.',
                            'posted' => '26 June 2025',
                        ],
                        [
                            'author' => 'John',
                            'message' => 'Great work on this!',
                            'posted' => '27 June 2025',
                        ],
                    ],
                ],
            ],
            'Q2' => [
                [
                    'id' => 1,
                    'who' => 'Maricar',
                    'collaborator' => 'Maricar',
                    'description' => 'Launch marketing campaign',
                    'progress' => '0%',
                    'annualPriority' => 'Develop lead generation systems',
                    'dueDate' => 'Click to set date',
                    'rank' => '2',
                    'comment' => [
                        [
                            'author' => 'Maricar',
                            'message' => 'This is a test comment.',
                            'posted' => '26 June 2025',
                        ],
                    ],
                ],
            ],
            'Q3' => [],
            'Q4' => [],
        ],

        'Chuck Gulledge Advisors, LLC' => [
            'Q1' => [
                [
                    'id' => 1,
                    'who' => 'Maricar',
                    'collaborator' => 'Maricar',
                    'description' => 'Build landing page',
                    'progress' => '5%',
                    'annualPriority' => 'Develop lead generation systems',
                    'dueDate' => '03-31-2025',
                    'rank' => '1',
                    'comment' => [
                        [
                            'author' => 'Maricar',
                            'message' => 'This is a test comment.',
                            'posted' => '26 June 2025',
                        ],
                        [
                            'author' => 'John',
                            'message' => 'Great work on this!',
                            'posted' => '27 June 2025',
                        ],
                    ],
                ],
            ],
            'Q2' => [
                [
                    'id' => 1,
                    'who' => 'Maricar',
                    'collaborator' => 'Maricar',
                    'description' => 'Launch marketing campaign',
                    'progress' => '0%',
                    'annualPriority' => 'Develop lead generation systems',
                    'dueDate' => 'Click to set date',
                    'rank' => '2',
                    'comment' => [
                        [
                            'author' => 'Maricar',
                            'message' => 'This is a test comment.',
                            'posted' => '26 June 2025',
                        ],
                    ],
                ],

                [
                    'id' => 2,
                    'who' => 'Chuck',
                    'collaborator' => 'Maricar',
                    'description' => 'Launch marketing campaign',
                    'progress' => '0%',
                    'annualPriority' => 'Develop lead generation systems',
                    'dueDate' => 'Click to set date',
                    'rank' => '2',
                    'comment' => [
                        [
                            'author' => 'Maricar',
                            'message' => 'This is a test comment.',
                            'posted' => '26 June 2025',
                        ],
                    ],
                ],
            ],
            'Q3' => [],
            'Q4' => [],
        ],
        'Test Skeleton Loading' => [
            'Q1' => [],
            'Q2' => [],
            'Q3' => [],
            'Q4' => [],
        ],
    ];

    return response()->json($mockData[$organization] ?? [
        'Q1' => [],
        'Q2' => [],
        'Q3' => [],
        'Q4' => [],
    ]);
});

// ref: frontend\src\components\8.who-what-when\whoWhatWhen.jsx
Route::get('/api/v1/who-what-when', function (Request $request) use ($API_secure) {
    if ($API_secure) {
        if (!$request->session()->get('logged_in')) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }
        $user = $request->session()->get('user');
    }

    $organization = $request->query('organization');

    $data = [
        'Chuck Gulledge Advisors, LLC' => [
            [
                'id' => 1,
                'date' => '2025-03-31',
                'who' => 'Maricar',
                'what' => 'Systematize Coaching Framework (now called Momentum OS).',
                'deadline' => '2025-03-31',
                'comments' => 'approved',
                'status' => '100.00%',
            ],
            [
                'id' => 2,
                'date' => '2025-04-01',
                'who' => 'Chuck',
                'what' => 'Systematize Client Delivery.',
                'deadline' => '2025-03-31',
                'comments' => 'working',
                'status' => '83.33%',
            ],
            [
                'id' => 3,
                'date' => '2025-04-02',
                'who' => 'Kayven',
                'what' => 'Develop online Portal for Clients with Beta completed with eDoc by March 31 (now called Momentum Hub).',
                'deadline' => '2025-03-31',
                'comments' => 'pending',
                'status' => '0.00%',
            ],
            [
                'id' => 4,
                'date' => '2025-04-02',
                'who' => 'John',
                'what' => 'Develop lead generation systems.',
                'deadline' => '2025-03-31',
                'comments' => 'paused',
                'status' => '50.00%',
            ],
            [
                'id' => 5,
                'date' => '2025-04-02',
                'who' => 'Grace',
                'what' => '1% Genius Version 3 Development.',
                'deadline' => '2025-03-31',
                'comments' => 'waiting',
                'status' => '50.00%',
            ],
        ],
    
        'Collins Credit Union' => [
            [
                'id' => 1,
                'date' => '2025-03-31',
                'who' => 'Alice',
                'what' => 'Building an exceptional customer experience through tailored solutions and responsive service.',
                'deadline' => '2025-06-30',
                'comments' => 'progressing',
                'status' => '85.00%',
            ],
            [
                'id' => 2,
                'date' => '2025-04-15',
                'who' => 'Bob',
                'what' => 'Streamline operations and reduce costs while maintaining quality.',
                'deadline' => '2025-09-30',
                'comments' => 'on schedule',
                'status' => '90.00%',
            ],
            [
                'id' => 3,
                'date' => '2025-05-01',
                'who' => 'Charlie',
                'what' => 'Implement new technologies to drive efficiency and innovation.',
                'deadline' => '2025-12-31',
                'comments' => 'planning phase',
                'status' => '60.00%',
            ],
            [
                'id' => 4,
                'date' => '2025-06-01',
                'who' => 'Diana',
                'what' => 'Entering new markets and increasing market share.',
                'deadline' => '2025-11-30',
                'comments' => 'needs review',
                'status' => '50.00%',
            ],
        ],
    
        'Test Skeleton Loading' => [
            [
                'id' => 1,
                'date' => '-',
                'who' => '-',
                'what' => '-',
                'deadline' => '-',
                'comments' => '-',
                'status' => '-',
            ],
            [
                'id' => 2,
                'date' => '-',
                'who' => '-',
                'what' => '-',
                'deadline' => '-',
                'comments' => '-',
                'status' => '-',
            ],
            [
                'id' => 3,
                'date' => '-',
                'who' => '-',
                'what' => '-',
                'deadline' => '-',
                'comments' => '-',
                'status' => '-',
            ],
            [
                'id' => 4,
                'date' => '-',
                'who' => '-',
                'what' => '-',
                'deadline' => '-',
                'comments' => '-',
                'status' => '-',
            ],
            [
                'id' => 5,
                'date' => '-',
                'who' => '-',
                'what' => '-',
                'deadline' => '-',
                'comments' => '-',
                'status' => '-',
            ],
        ],
    ];
    

    return response()->json($data[$organization] ?? []);
});


// ref: frontend\src\components\9.session-dates\sessionDates.jsx
Route::get('/api/v1/session-tracker/monthly-sessions', function (Request $request) use ($API_secure) {
    if ($API_secure) {
        if (!$request->session()->get('logged_in')) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }
        $user = $request->session()->get('user');
    }

    $organization = $request->query('organization');

    $data = [
        'Chuck Gulledge Advisors, LLC' => [
            ['date' => '2025-07-01', 'status' => 'done', 'details' => 'Strategy alignment'],
            ['date' => '2025-07-15', 'status' => 'pending', 'details' => 'KPI review'],
            ['date' => '2025-07-25', 'status' => 'new', 'details' => 'Planning'],
            ['date' => '2025-08-05', 'status' => 'pending', 'details' => 'Forecasting'],
        ],
        'Collins Credit Union' => [
            ['date' => '2025-07-03', 'status' => 'done', 'details' => 'Budget review'],
            ['date' => '2025-07-18', 'status' => 'pending', 'details' => 'Risk assessment'],
            ['date' => '2025-07-28', 'status' => 'new', 'details' => 'Team training'],
            ['date' => '2025-08-07', 'status' => 'pending', 'details' => 'Customer feedback'],
        ],
        'Test Skeleton Loading' => [
            ['date' => '-', 'status' => '-', 'details' => '-'],
            ['date' => '-', 'status' => '-', 'details' => '-'],
            ['date' => '-', 'status' => '-', 'details' => '-'],
            ['date' => '-', 'status' => '-', 'details' => '-'],
        ],
    ];

    return response()->json([
        $organization => $data[$organization] ?? [],
    ]);
});


// ref: frontend\src\components\9.session-dates\sessionDates.jsx
Route::get('/api/v1/session-dates/quarterly-sessions', function (Request $request) use ($API_secure) {
    if ($API_secure) {
        if (!$request->session()->get('logged_in')) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }

        $user = $request->session()->get('user');
    }

    $organization = $request->query('organization');

    $data = [
        'Chuck Gulledge Advisors, LLC' => [
            [
                'status' => 'Completed',
                'quarter' => 'Q1 2025',
                'meetingDate' => 'January 20, 2025',
                'agenda' => 'Strategic Planning & KPIs',
                'recap' => 'Shared Q1 goals and budget updates',
            ],
            [
                'status' => 'Scheduled',
                'quarter' => 'Q2 2025',
                'meetingDate' => 'April 22, 2025',
                'agenda' => 'Customer Retention Plans',
                'recap' => 'To be added after session',
            ],
            [
                'status' => 'Pending',
                'quarter' => 'Q3 2025',
                'meetingDate' => 'July 15, 2025',
                'agenda' => 'New Product Launch Discussion',
                'recap' => 'To be added',
            ],
            [
                'status' => 'Upcoming',
                'quarter' => 'Q4 2025',
                'meetingDate' => 'October 17, 2025',
                'agenda' => 'Annual Review & Strategy 2026',
                'recap' => 'To be added',
            ],
        ],
        'Collins Credit Union' => [
            [
                'status' => 'Completed',
                'quarter' => 'Q1 2024',
                'meetingDate' => 'January 15, 2024',
                'agenda' => 'Budget Review',
                'recap' => 'Reviewed last year’s budget and set targets',
            ],
            [
                'status' => 'Scheduled',
                'quarter' => 'Q2 2024',
                'meetingDate' => 'April 20, 2024',
                'agenda' => 'Marketing Strategy',
                'recap' => 'Plan for Q2 marketing initiatives',
            ],
            [
                'status' => 'Pending',
                'quarter' => 'Q3 2024',
                'meetingDate' => 'July 18, 2024',
                'agenda' => 'Product Development Update',
                'recap' => 'To be added',
            ],
            [
                'status' => 'Upcoming',
                'quarter' => 'Q4 2024',
                'meetingDate' => 'October 22, 2024',
                'agenda' => 'Year-End Review',
                'recap' => 'To be added',
            ],
        ],
        'Test Skeleton Loading' => [
            [
                'status' => '-',
                'quarter' => '-',
                'meetingDate' => '-',
                'agenda' => '-',
                'recap' => '-',
            ],
            [
                'status' => '-',
                'quarter' => '-',
                'meetingDate' => '-',
                'agenda' => '-',
                'recap' => '-',
            ],
            [
                'status' => '-',
                'quarter' => '-',
                'meetingDate' => '-',
                'agenda' => '-',
                'recap' => '-',
            ],
            [
                'status' => '-',
                'quarter' => '-',
                'meetingDate' => '-',
                'agenda' => '-',
                'recap' => '-',
            ],
        ],
    ];

    return response()->json([
        $organization => $data[$organization] ?? [],
    ]);
});

// ref: frontend\src\components\9.session-dates\sessionDates.jsx
Route::get('/api/v1/session-dates/monthly-sessions', function (Request $request) use ($API_secure) {
    if ($API_secure) {
        if (!$request->session()->get('logged_in')) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }
        $user = $request->session()->get('user');
    }

    $organization = $request->query('organization');

    $data = [
        'Chuck Gulledge Advisors, LLC' => [
            [
                'status' => 'Done',
                'month' => 'January',
                'date' => '2025-01-10',
                'agenda' => 'Review January goals and targets',
                'recap' => 'All targets met. Positive team performance.',
            ],
            [
                'status' => 'Pending',
                'month' => 'February',
                'date' => '2025-02-14',
                'agenda' => 'Mid-Q1 Alignment & Budget Discussion',
                'recap' => 'To be conducted.',
            ],
            [
                'status' => 'New',
                'month' => 'March',
                'date' => '2025-03-20',
                'agenda' => 'Client Feedback Analysis',
                'recap' => 'Preparation ongoing.',
            ],
        ],
        'Collins Credit Union' => [
            [
                'status' => 'Done',
                'month' => 'April',
                'date' => '2024-04-05',
                'agenda' => 'Q1 Financial Review',
                'recap' => 'Reviewed finances and approved budget.',
            ],
            [
                'status' => 'Pending',
                'month' => 'May',
                'date' => '2024-05-12',
                'agenda' => 'Marketing Campaign Planning',
                'recap' => 'Plan draft under review.',
            ],
            [
                'status' => 'New',
                'month' => 'June',
                'date' => '2024-06-18',
                'agenda' => 'Team Building Activities',
                'recap' => 'To be scheduled.',
            ],
        ],
        'Test Skeleton Loading' => [
            [
                'status' => '-',
                'month' => '-',
                'date' => '-',
                'agenda' => '-',
                'recap' => '-',
            ],
            [
                'status' => '-',
                'month' => '-',
                'date' => '-',
                'agenda' => '-',
                'recap' => '-',
            ],
            [
                'status' => '-',
                'month' => '-',
                'date' => '-',
                'agenda' => '-',
                'recap' => '-',
            ],
        ],
    ];

    return response()->json([
        $organization => $data[$organization] ?? [],
    ]);
});



// ref: frontend\src\components\company-dropdown\TopbarDropdown.jsx
// ref: frontend\src\pages\login\Login.jsx
Route::get('/api/v1/get-layout-toggles', function (Request $request) use ($API_secure) {

    if ($API_secure) {
        if (!$request->session()->get('logged_in')) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }
        $user = $request->session()->get('user');
    }

    $organization = $request->query('organization');

    // Dummy toggle data based on organization (you can replace with DB query)
    $toggles = [
        'Chuck Gulledge Advisors, LLC' => [
            'Strategic Drivers' => true,
            'Foundations' => true,
            '3 Year Outlook' => true,
            'Playing to Win Strategy' => true,
            'Core Capabilities' => true,
            '4 Decisions' => true,
            'Constraints Tracker' => true,
        ],
        'Collins Credit Union' => [
            'Strategic Drivers' => true,
            'Foundations' => true,
            '3 Year Outlook' => true,
            'Playing to Win Strategy' => true,
            'Core Capabilities' => true,
            '4 Decisions' => false,
            'Constraints Tracker' => false,
        ],
        'Test Skeleton Loading' => [
            'Strategic Drivers' => true,
            'Foundations' => true,
            '3 Year Outlook' => true,
            'Playing to Win Strategy' => true,
            'Core Capabilities' => true,
            '4 Decisions' => true,
            'Constraints Tracker' => true,
        ],
    ];

    return response()->json([
        'status' => 'success',
        'toggles' => $toggles[$organization] ?? [],
        'organization' => $organization,
        'unique_id' => uniqid(), // just example
    ]);
});





// ref: frontend\src\pages\login\Login.jsx
Route::get('/api/v1/company-options', function (Request $request) use ($API_secure)  {
    
    if ($API_secure) {
        if (!$request->session()->get('logged_in')) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }
        $user = $request->session()->get('user');
    }

    // return response()->json([
    //     'Chuck Gulledge Advisors, LLC', 
    //     'Collins Credit Union', 
    //     'IH MVCU', 
    //     'Ironclad',
    //     'Seneca', 
    //     'Texans Credit Union', 
    //     'Kolb Grading'
    // ]);

    return response()->json([
        'Chuck Gulledge Advisors, LLC', 
        'Collins Credit Union', 
        'Test Skeleton Loading'
    ]);
});



// ref: frontend\src\pages\login\Login.jsx
Route::get('/api/v1/company-traction-users', function (Request $request) use ($API_secure)  {
    
    if ($API_secure) {
        if (!$request->session()->get('logged_in')) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }
        $user = $request->session()->get('user');
    }

    return response()->json([
        'Maricar', 
        'Chuck', 
        'Arlene'
    ]);
});