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
            'Playing to Win Strategy' => false,
            'Core Capabilities' => false,
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