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

use Illuminate\Support\Facades\Session;
use Illuminate\Support\Facades\Hash;
use App\Models\AuthUser;
use App\Models\Organization;
use App\Models\OpspLayoutSetting;
use App\Models\OpspStrategicDriver;
use App\Models\OpspFoundation;
use App\Models\OpspThreeyearOutlook;
use App\Models\OpspPlayingtowinStrategy;
use App\Models\OpspCoreCapability;
use App\Models\OpspFourDecision;
use App\Models\OpspConstraintsTracker;
use App\Models\Flywheel;
use App\Models\ScoreboardAnnualpriority;
use App\Models\ScoreboardCompanyTractionCard;
use App\Models\ScoreboardProjectProgressCard;
use App\Models\GccMetric;
use App\Models\GccRevenueGrowth;
use App\Models\CompanyTractionAnnualPriority;
use App\Models\CompanyTractionCompanyTraction;
use App\Models\DepartmentTractionAnnualPriority;
use App\Models\DepartmentTractionCompanyTraction;
use App\Models\WhoWhatWhen;
use App\Models\ThirteenWeekSprint;
use App\Models\SessionDatesMonthlySessionsTracker;
use App\Models\SessionDatesQuarterlySessions;
use App\Models\SessionDatesMonthlySessions;
use App\Models\CoachingChecklistPanel;
use App\Models\CoachingAlignmentCurrentFocus;
use App\Models\CoachingAlignmentCurrentBusinessPulse;
use App\Models\CoachingAlignmentWhatsNext;
use App\Models\CoachingAlignmentCoachingGoal;
use App\Models\ToolsIssue;
use App\Models\ToolsVictory;
use App\Models\ToolsBigIdea;
use App\Models\ToolsProductEvaluationGrid;
use App\Models\DocumentVault;
use App\Models\MembersDepartment;
use App\Models\MembersDirectory;
use App\Models\Notification;
use App\Models\MessagingMessage;
use App\Models\MessagingLeftConversation;
use App\Models\AdminPanelCompany;
use App\Models\CompanyTractionActivityLog;
use App\Models\DepartmentTractionActivityLog;
use App\Models\CompanyTractionAnnualPrioritiesCollection;
use App\Models\DepartmentTractionAnnualPrioritiesCollection;





use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;


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



// Route::post('/api/login', function (Request $request) {
//     $email = $request->input('email');
//     $password = $request->input('password');

//     // 🔐 Hardcoded users
//     $users = [
//         [
//             'email' => 'kay@gmail.com',
//             'password' => 'password123',
//             'id' => 1,
//             'name' => 'Kay Dee',
//             'role' => 'admin',
//             'group' => 'executive',
//             'organization' => 'kay organizations',
//             'position' => 'admin',

//         ],
//         [
//             'email' => 'uat@gmail.com',
//             'password' => 'q',
//             'id' => 2,
//             'name' => 'User Test',
//             'role' => 'testuser',
//             'group' => 'operations',
//             'organization' => 'test organization',
//             'position' => 'testuser',
//         ],
//         [
//             'email' => 'maricar@chuckgulledge.com',
//             'password' => 'Password123',
//             'id' => 2,
//             'name' => 'Maricar Aquino',
//             'role' => 'superadmin',
//             'group' => 'operations',
//             'organization' => 'maricar organization',
//             'position' => 'superadmin',
//         ],
//     ];

//     // 🔍 Find matching user
//     $matchedUser = collect($users)->first(function ($user) use ($email, $password) {
//         return $user['email'] === $email && $user['password'] === $password;
//     });

//     if ($matchedUser) {
//         // Save in session
//         $request->session()->put('logged_in', true);
//         $request->session()->put('user', $matchedUser);

//         // Regenerate session ID for security
//         $request->session()->regenerate();

//         return response()->json([
//             'status' => 'success',
//             'session_id' => $request->session()->getId(),
//             'user' => [
//                 'fullname' => $matchedUser['name'],
//                 'email' => $matchedUser['email'],
//                 'role' => $matchedUser['role'],
//                 'group' => $matchedUser['group'],
//                 'organization' => $matchedUser['organization'],
//                 'position' => $matchedUser['position'],
//             ],
//         ]);
//     }

//     return response()->json([
//         'status' => 'error',
//         'message' => 'Invalid credentials',
//     ], 401);
// });

// // ref: frontend\src\pages\login\Login.jsx
// Route::get('/api/v1/company-options', function (Request $request) use ($API_secure)  {
    
//     if ($API_secure) {
//         if (!$request->session()->get('logged_in')) {
//             return response()->json(['message' => 'Unauthorized'], 401);
//         }
//         $user = $request->session()->get('user');
//     }

//     // return response()->json([
//     //     'Chuck Gulledge Advisors, LLC', 
//     //     'Collins Credit Union', 
//     //     'IH MVCU', 
//     //     'Ironclad',
//     //     'Seneca', 
//     //     'Texans Credit Union', 
//     //     'Kolb Grading'
//     // ]);

//     return response()->json([
//         'Chuck Gulledge Advisors, LLC', 
//         'Collins Credit Union', 
//         'Test Skeleton Loading'
//     ]);
// });


// //ref: frontend\src\components\document-vault\documentVault.jsx
// Route::post('/api/v1/organization-uid', function (Request $request) use ($API_secure) {
//     if ($API_secure) {
//         if (!$request->session()->get('logged_in')) {
//             return response()->json(['message' => 'Unauthorized'], 401);
//         }
//     }

//     $organization = $request->input('organization');

//     $map = [
//         'Chuck Gulledge Advisors, LLC' => [
//             'uid' => '4uvvjdwVWJRBopUMhifaLxoA9jm6MCvDzkBhOm5p',
//         ],
//         'Collins Credit Union' => [
//             'uid' => '4uvvjdwVWJRBopUMhifaLxoA9jm6MCvDzkBhOm5x',
//         ],
//         'Test Skeleton Loading' => [
//             'uid' => '4uvvjdwVWJRBopUMhifaLxoA9jm6MCvDzkBhOm5z',
//         ],
//     ];

//     if (!array_key_exists($organization, $map)) {
//         return response()->json([
//             'message' => 'Organization not found',
//         ], 404);
//     }

//     return response()->json([
//         $organization => $map[$organization],
//     ]);
// });



// ref: 
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
            'organization' => 'kay organizations',
            'position' => 'admin',
        ],
        // [
        //     'email' => 'uat@gmail.com',
        //     'password' => 'q',
        //     'id' => 2,
        //     'name' => 'User Test',
        //     'role' => 'testuser',
        //     'group' => 'operations',
        //     'organization' => 'test organization',
        //     'position' => 'testuser',
        // ],
        // [
        //     'email' => 'maricar@chuckgulledge.com',
        //     'password' => 'Password123',
        //     'id' => 3,
        //     'name' => 'Maricar Aquino',
        //     'role' => 'superadmin',
        //     'group' => 'operations',
        //     'organization' => 'maricar organization',
        //     'position' => 'superadmin',
        // ],
    ];

    // 🔍 Check hardcoded users first
    $matchedUser = collect($users)->first(function ($user) use ($email, $password) {
        return $user['email'] === $email && $user['password'] === $password;
    });

    // 🔍 If not found in hardcoded list, check database
    if (!$matchedUser) {
        $dbUser = AuthUser::where('email', $email)->first();

        if ($dbUser && Hash::check($password, $dbUser->passwordHash)) {
            $matchedUser = [
                'id' => $dbUser->id,
                'name' => $dbUser->firstName . ' ' . $dbUser->lastName,
                'email' => $dbUser->email,
                'role' => $dbUser->role,
                'group' => $dbUser->group,
                'organization' => $dbUser->organization,
                'position' => $dbUser->position,
            ];
        }
    }

    // ✅ If user found (either hardcoded or DB)
    if ($matchedUser) {
        $request->session()->put('logged_in', true);
        $request->session()->put('user', $matchedUser);
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

    // ❌ If not found
    return response()->json([
        'status' => 'error',
        'message' => 'Invalid credentials',
    ], 401);
});

// ref: frontend\src\pages\login\Login.jsx
Route::get('/api/v1/company-options', function (Request $request) use ($API_secure) {
    if ($API_secure) {
        if (!$request->session()->get('logged_in')) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }
    }

    // Fetch all organization names from the database
    $organizationNames = Organization::pluck('organizationName');

    if ($organizationNames->isEmpty()) {
        return response()->json(['message' => 'No organizations found'], 404);
    }

    return response()->json($organizationNames);
});


// ref: frontend\src\components\document-vault\documentVault.jsx
Route::post('/api/v1/organization-uid', function (Request $request) use ($API_secure) {
    if ($API_secure) {
        if (!$request->session()->get('logged_in')) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }
    }

    $organizationName = $request->input('organization');

    if (!$organizationName) {
        return response()->json(['message' => 'Organization name is required'], 422);
    }

    $organization = Organization::where('organizationName', $organizationName)->first();

    if (!$organization) {
        return response()->json([
            'message' => 'No organization uid found',
        ], 404);
    }

    return response()->json([
        $organization->organizationName => [
            'uid' => $organization->u_id,
        ],
    ]);
});



//
    // Route::post('/api/create-user', function (Request $request) {
    //     // ✅ Check if email already exists in the auth table
    //     $existingUser = AuthUser::where('email', $request->input('email'))->first();

    //     if ($existingUser) {
    //         return response()->json([
    //             'status' => 'error',
    //             'message' => 'Email already exists',
    //         ], 409); // 409 Conflict
    //     }

    //     // ✅ Validate other fields (no need to check for unique email again)
    //     $validator = Validator::make($request->all(), [
    //         'firstName' => 'required|string',
    //         'lastName' => 'required|string',
    //         'email' => 'required|email',
    //         'password' => 'required|string|min:6',
    //         'role' => 'required|string',
    //     ]);

    //     if ($validator->fails()) {
    //         return response()->json([
    //             'status' => 'error',
    //             'errors' => $validator->errors(),
    //         ], 422);
    //     }

    //     // ✅ Generate u_id (UUID or custom string)
    //     $u_id = (string) Str::uuid();

    //     // ✅ Create the user
    //     $user = AuthUser::create([
    //         'u_id' => $u_id,
    //         'firstName' => $request->input('firstName'),
    //         'lastName' => $request->input('lastName'),
    //         'email' => $request->input('email'),
    //         'organization' => $request->input('organization'),
    //         'passwordHash' => Hash::make($request->input('password')),
    //         'role' => $request->input('role'),
    //         'group' => $request->input('group'),
    //         'position' => $request->input('position'),
    //         'status' => 'inactive',
    //     ]);

    //     return response()->json([
    //         'status' => 'success',
    //         'message' => 'User created successfully',
    //         'user' => $user,
    //     ]);
    // });



Route::post('/api/create-user', function (Request $request) {
    // ✅ Check if email already exists in the auth table
    $existingUser = AuthUser::where('email', $request->input('email'))->first();

    if ($existingUser) {
        return response()->json([
            'status' => 'error',
            'message' => 'Email already exists',
        ], 409); // 409 Conflict
    }

    // ✅ Validate other fields (no need to check for unique email again)
    $validator = Validator::make($request->all(), [
        'firstName' => 'required|string',
        'lastName' => 'required|string',
        'email' => 'required|email',
        'password' => 'required|string|min:6',
        'role' => 'required|string',
    ]);

    if ($validator->fails()) {
        return response()->json([
            'status' => 'error',
            'errors' => $validator->errors(),
        ], 422);
    }

    // ✅ Generate u_id (UUID or custom string)
    $u_id = (string) Str::uuid();

    // ✅ Create the user
    $user = AuthUser::create([
        'u_id' => $u_id,
        'firstName' => $request->input('firstName'),
        'lastName' => $request->input('lastName'),
        'email' => $request->input('email'),
        'organization' => $request->input('organization'),
        'passwordHash' => Hash::make($request->input('password')),
        'role' => $request->input('role'),
        'group' => $request->input('group'),
        'position' => $request->input('position'),
        'status' => 'inactive',
    ]);

    return response()->json([
        'status' => 'success',
        'message' => 'User created successfully',
        'user' => $user,
    ]);
});


// Route::post('/api/create-user', function (Request $request) {
//     // ✅ Check if email already exists in the auth table
//     $existingUser = AuthUser::where('email', $request->input('email'))->first();

//     if ($existingUser) {
//         return response()->json([
//             'status' => 'error',
//             'message' => 'Email already exists',
//         ], 409); // 409 Conflict
//     }

//     // ✅ Validate other fields (no need to check for unique email again)
//     $validator = Validator::make($request->all(), [
//         'firstName' => 'required|string',
//         'lastName' => 'required|string',
//         'email' => 'required|email',
//         'password' => 'required|string|min:6',
//         'role' => 'required|string',
//     ]);

//     if ($validator->fails()) {
//         return response()->json([
//             'status' => 'error',
//             'errors' => $validator->errors(),
//         ], 422);
//     }

//     // ✅ Generate u_id (UUID or custom string)
//     $u_id = (string) Str::uuid();

//     return response()->json([
//         'status' => 'success',
//         'message' => 'User created successfully',
//         // 'user' => $user,
//     ]);
// });


Route::post('/api/create-organization', function (Request $request) {
    $validator = Validator::make($request->all(), [
        'name' => 'required|string|max:255',
        'industry' => 'nullable|string|max:255',
        'size' => 'nullable|string|max:255',
        'location' => 'nullable|string|max:255',
    ]);

    if ($validator->fails()) {
        return response()->json([
            'status' => 'error',
            'errors' => $validator->errors()
        ], 422);
    }

    // 🔍 Check if organization already exists
    $existing = Organization::where('organizationName', $request->input('name'))->first();
    if ($existing) {
        return response()->json([
            'status' => 'error',
            'message' => 'Organization is already present'
        ], 409); // 409 Conflict
    }

    // ✅ Create the organization
    $organization = Organization::create([
        'organizationName' => $request->input('name'),
        'industry' => $request->input('industry'),
        'size' => $request->input('size'),
        'location' => $request->input('location'),
        'token' => Str::random(40),
        'status' => null,
        'owner' => null,
    ]);

    return response()->json([
        'status' => 'success',
        'message' => 'Organization created successfully',
        'organization' => $organization
    ]);
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


// Route::post('/api/file-upload/{path}', function (Request $request, $path) {
//     if (!$request->hasFile('file')) {
//         return response()->json(['error' => 'No file uploaded'], 400);
//     }

//     $file = $request->file('file');

//     $storedPath = $file->storeAs("public/{$path}", $file->getClientOriginalName());

//     return response()->json([
//         'message' => 'File uploaded successfully',
//         'path' => $storedPath,
//     ]);
// })->where('path', '.*');


Route::post('/api/file-upload/{path}', function (Request $request, $path) {
    if (!$request->hasFile('file')) {
        return response()->json(['error' => 'No file uploaded'], 400);
    }

    $file = $request->file('file');

    // Save directly into storage/app/public/{path}
    $fileName = $file->getClientOriginalName();
    $targetPath = storage_path("app/public/{$path}");

    // Ensure the directory exists
    if (!File::exists($targetPath)) {
        File::makeDirectory($targetPath, 0755, true);
    }

    $file->move($targetPath, $fileName);

    return response()->json([
        'message' => 'File uploaded successfully',
        'path' => "storage/app/public/{$path}/{$fileName}",
    ]);
})->where('path', '.*');



// ref: frontend\src\components\14.document-vault\1.DocumentVaultTable\DocumentVaultTable.jsx
Route::post('/api/v1/file-upload/document-vault/{uid}/{projectName}', function (Request $request, $uid, $projectName) {
    if (!$request->hasFile('file')) {
        return response()->json(['error' => 'No file uploaded'], 400);
    }

    $file = $request->file('file');

    // // Sanitize uid and projectName
    // $safeUid = Str::slug($uid, '');
    // $safeProjectName = Str::slug($projectName, '-');

    // Keep UID as-is (UUID with dashes)
    $safeUid = $uid;

    // Sanitize projectName
    // $safeProjectName = Str::slug($projectName, '-');
    $safeProjectName = Str::slug($projectName, '-'); // initial slug
    $safeProjectName = preg_replace('/[^a-z0-9-]+/', '-', $safeProjectName); // replace anything else not a-z, 0-9, or dash with dash
    $safeProjectName = trim($safeProjectName, '-');


    // Match the working pattern: uid first, then projectName
    $relativeDirectory = "document-vault/{$safeUid}/{$safeProjectName}";
    $storagePath = storage_path("app/public/{$relativeDirectory}");

    if (!File::exists($storagePath)) {
        File::makeDirectory($storagePath, 0755, true);
    }

    $fileName = $file->getClientOriginalName();

    Storage::disk('public')->putFileAs($relativeDirectory, $file, $fileName);

    return response()->json([
        'message' => 'File uploaded successfully',
        'path' => "storage/{$relativeDirectory}/{$fileName}",
    ]);
});


// ref: frontend\src\components\11.coaching-checklist\2.CollapsiblePanels\CollapsiblePanels.jsx
Route::post('/api/file-upload/coaching-checklist/{uid}/{formattedText}', function (Request $request, $uid, $formattedText) {
    if (!$request->hasFile('file')) {
        return response()->json(['error' => 'No file uploaded'], 400);
    }

    $file = $request->file('file');

    // ✅ Sanitize both parts
    $safeUid = Str::slug($uid, '');
    $safeFormattedText = Str::slug($formattedText, '-');

    // ✅ Build directory path
    $relativeDirectory = "coaching-checklist/{$safeUid}/{$safeFormattedText}";
    $storagePath = storage_path("app/public/{$relativeDirectory}");

    if (!File::exists($storagePath)) {
        File::makeDirectory($storagePath, 0755, true);
    }

    $fileName = $file->getClientOriginalName();
    // $file->move($storagePath, $fileName);
    Storage::disk('public')->putFileAs($relativeDirectory, $file, $fileName);

    return response()->json([
        'message' => 'File uploaded successfully',
        'path' => "storage/{$relativeDirectory}/{$fileName}",
    ]);
});




//  ref: frontend\src\components\9.session-dates\2.QuarterlySessions\QuarterlySessions.jsx
Route::post('/api/v1/session-dates/quarterly-sessions/upload-file/{organizationName}/{field}/{sessionId}', function (
    Request $request,
    $organizationName,
    $field,
    $sessionId
) use ($API_secure) {
    if ($API_secure) {
        if (!$request->session()->get('logged_in')) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }
    }

    if (!$request->hasFile('file')) {
        return response()->json(['message' => 'No file uploaded'], 400);
    }

    // 🔐 Sanitize inputs
    $safeOrgName = Str::slug($organizationName, '-');
    $field = preg_replace('/[^a-zA-Z0-9_-]/', '', $field);
    $sessionId = intval($sessionId);

    $file = $request->file('file');
    $allowed = ['pdf', 'docx', 'doc', 'xlsx', 'xls', 'txt'];
    $ext = strtolower($file->getClientOriginalExtension());

    if (!in_array($ext, $allowed)) {
        return response()->json(['message' => 'Invalid file type'], 400);
    }

    // 🔍 Get record by organization name
    $record = SessionDatesQuarterlySessions::where('organizationName', 'like', "%{$organizationName}%")->first();

    if (!$record) {
        return response()->json(['message' => 'Organization not found'], 404);
    }

    $u_id = $record->u_id;
    $randomDir = Str::random(6);
    $relativePath = "session-dates/quarterly-sessions/{$u_id}/{$field}/{$randomDir}";
    $storagePath = storage_path("app/public/{$relativePath}");

    if (!File::exists($storagePath)) {
        File::makeDirectory($storagePath, 0755, true);
    }

    $filename = $file->getClientOriginalName();
    Storage::disk('public')->putFileAs($relativePath, $file, $filename);
    $filePath = "/api/storage/{$relativePath}/{$filename}";

    // 🔄 Update session record's agenda or recap
    $data = $record->sessionDatesQuarterlySessionsData;
    $updated = false;

    foreach ($data as &$session) {
        if ((int) $session['id'] === $sessionId) {
            $session[$field] = [
                'name' => $filename,
                'url' => $filePath,
            ];
            $updated = true;
            break;
        }
    }

    if ($updated) {
        $record->sessionDatesQuarterlySessionsData = $data;
        $record->save();
    }

    return response()->json([
        'status' => 'success',
        'message' => 'File uploaded successfully',
        'filename' => $filename,
        'path' => $filePath,
    ]);
});



// ref: frontend\src\components\9.session-dates\3.MonthlySessions\MonthlySessions.jsx
Route::post('/api/v1/session-dates/monthly-sessions/upload-file/{organizationName}/{field}/{sessionId}', function (
    Request $request,
    $organizationName,
    $field,
    $sessionId
) use ($API_secure) {
    if ($API_secure) {
        if (!$request->session()->get('logged_in')) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }
    }

    if (!$request->hasFile('file')) {
        return response()->json(['message' => 'No file uploaded'], 400);
    }

    // 🔐 Sanitize inputs
    $safeOrgName = Str::slug($organizationName, '-');
    $field = preg_replace('/[^a-zA-Z0-9_-]/', '', $field);
    $sessionId = intval($sessionId);

    $file = $request->file('file');
    $allowed = ['pdf', 'docx', 'doc', 'xlsx', 'xls', 'txt'];
    $ext = strtolower($file->getClientOriginalExtension());

    if (!in_array($ext, $allowed)) {
        return response()->json(['message' => 'Invalid file type'], 400);
    }

    // 🔍 Get record by organization name
    $record = SessionDatesMonthlySessions::where('organizationName', 'like', "%{$organizationName}%")->first();

    if (!$record) {
        return response()->json(['message' => 'Organization not found'], 404);
    }

    $u_id = $record->u_id;
    $randomDir = Str::random(6);
    $relativePath = "session-dates/monthly-sessions/{$u_id}/{$field}/{$randomDir}";
    $storagePath = storage_path("app/public/{$relativePath}");

    if (!File::exists($storagePath)) {
        File::makeDirectory($storagePath, 0755, true);
    }

    $filename = $file->getClientOriginalName();
    Storage::disk('public')->putFileAs($relativePath, $file, $filename);
    $filePath = "/api/storage/{$relativePath}/{$filename}";

    // 🔄 Update session record's agenda or recap
    $data = $record->sessionDatesMonthlySessionsData;
    $updated = false;

    foreach ($data as &$session) {
        if ((int) $session['id'] === $sessionId) {
            $session[$field] = [
                'name' => $filename,
                'url' => $filePath,
            ];
            $updated = true;
            break;
        }
    }

    if ($updated) {
        $record->sessionDatesMonthlySessionsData = $data;
        $record->save();
    }

    return response()->json([
        'status' => 'success',
        'message' => 'File uploaded successfully',
        'filename' => $filename,
        'path' => $filePath,
    ]);
});

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

//
    // // ref: frontend\src\components\2.one-page-strategic-plan\onePageStrategicPlan.jsx
    // Route::get('/api/v1/one-page-strategic-plan/strategic-drivers', function (Request $request) use ($API_secure) {

    //     if ($API_secure) {
    //         if (!$request->session()->get('logged_in')) {
    //             return response()->json(['message' => 'Unauthorized'], 401);
    //         }
    //         $user = $request->session()->get('user');
    //     }

    //     $organization = $request->query('organization');

    //     // Mock data for multiple organizations
    //     $data = [
    //         'Chuck Gulledge Advisors, LLC' => [
    //             [
    //                 'id' => 1,
    //                 'title' => 'Solution Innovation',
    //                 'description' => 'Focuses on productization, technology, and data integration to create repeatable, scalable solutions that deliver on the brand promise.',
    //                 'kpi' => 'Launch 2 scalable products',
    //                 'status' => 'Tracking',
    //             ],
    //             [
    //                 'id' => 2,
    //                 'title' => 'Talent Leadership',
    //                 'description' => 'Centers on elite coach acquisition and building a high-performance culture, ensuring the team can execute the innovative solutions.',
    //                 'kpi' => 'Hire 5 elite coaches',
    //                 'status' => 'Behind',
    //             ],
    //             [
    //                 'id' => 3,
    //                 'title' => 'Exceptional Delivery',
    //                 'description' => 'Emphasizes structured processes and achieving 10/10 ratings, turning the talent and solutions into concrete results.',
    //                 'kpi' => 'Achieve 90% 10/10 ratings',
    //                 'status' => 'At Risk',
    //             ],
    //             [
    //                 'id' => 4,
    //                 'title' => 'Market Dominance',
    //                 'description' => 'Leverages strategic alliances and builds a referral engine to expand reach, which then cycles back to reinforce the brand promise.',
    //                 'kpi' => 'Grow referral traffic by 30%',
    //                 'status' => 'Paused',
    //             ],
    //         ],

    //         'Collins Credit Union' => [
    //             [
    //                 'id' => 1,
    //                 'title' => 'Customer Centricity',
    //                 'description' => 'Building an exceptional customer experience through tailored solutions and responsive service.',
    //                 'kpi' => 'Increase customer satisfaction by 20%',
    //                 'status' => 'Tracking',
    //             ],
    //             [
    //                 'id' => 2,
    //                 'title' => 'Operational Excellence',
    //                 'description' => 'Streamline operations and reduce costs while maintaining quality.',
    //                 'kpi' => 'Reduce operational costs by 10%',
    //                 'status' => 'On Track',
    //             ],
    //             [
    //                 'id' => 3,
    //                 'title' => 'Digital Transformation',
    //                 'description' => 'Implement new technologies to drive efficiency and innovation.',
    //                 'kpi' => 'Migrate 70% of systems to cloud',
    //                 'status' => 'At Risk',
    //             ],
    //             [
    //                 'id' => 4,
    //                 'title' => 'Market Expansion',
    //                 'description' => 'Entering new markets and increasing market share.',
    //                 'kpi' => 'Expand into 3 new markets',
    //                 'status' => 'Behind',
    //             ],
    //         ],

    //         'Test Skeleton Loading' => [
    //             [
    //                 'id' => 1,
    //                 'title' => '-',
    //                 'description' => '-',
    //                 'kpi' => '-',
    //                 'status' => '-',
    //             ],
    //             [
    //                 'id' => 2,
    //                 'title' => '-',
    //                 'description' => '-',
    //                 'kpi' => '-',
    //                 'status' => '-',
    //             ],
    //             [
    //                 'id' => 3,
    //                 'title' => '-',
    //                 'description' => '-',
    //                 'kpi' => '-',
    //                 'status' => '-',
    //             ],
    //             [
    //                 'id' => 4,
    //                 'title' => '-',
    //                 'description' => '-',
    //                 'kpi' => '-',
    //                 'status' => '-',
    //             ],
    //         ],

    //     ];

    //     // Return data for the requested organization or empty array
    //     return response()->json($data[$organization] ?? []);
    // });

// ref: frontend\src\components\2.one-page-strategic-plan\onePageStrategicPlan.jsx
Route::get('/api/v1/one-page-strategic-plan/strategic-drivers', function (Request $request) use ($API_secure) {
    if ($API_secure) {
        if (!$request->session()->get('logged_in')) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }
    }

    $organization = $request->query('organization');

    if (!$organization) {
        return response()->json([], 400); // return empty if no org provided
    }

    $record = OpspStrategicDriver::where('organizationName', $organization)->first();

    // Return just the data (or empty array) like your mock structure
    return response()->json($record?->strategicDriversData ?? []);
});

// ref: // frontend\src\components\one-page-strategic-plan\1.StrategicDriversTable\StrategicDriversTable.jsx
Route::post('/api/v1/one-page-strategic-plan/strategic-drivers/update', function (Request $request) use ($API_secure) {
    if ($API_secure && !$request->session()->get('logged_in')) {
        return response()->json(['message' => 'Unauthorized'], 401);
    }

    $organization = $request->input('organization');
    $strategicDriversData = $request->input('strategicDriversData', []); // default to empty array

    // ✅ Reindex items to make sure every item has an 'id'
    $strategicDriversData = array_map(function ($driver, $index) {
        $driver['id'] = $index + 1;
        return $driver;
    }, $strategicDriversData, array_keys($strategicDriversData));

    $record = OpspStrategicDriver::where('organizationName', $organization)->first();

    if (!$record) {
        return response()->json(['status' => 'error', 'message' => 'Organization not found'], 404);
    }

    $record->strategicDriversData = $strategicDriversData;
    $record->save();

    return response()->json(['status' => 'success', 'message' => 'Strategic Drivers updated successfully']);
});


// Route::post('/api/v1/one-page-strategic-plan/strategic-drivers/update', function (Request $request) use ($API_secure) {
//     if ($API_secure) {
//         if (!$request->session()->get('logged_in')) {
//             return response()->json(['message' => 'Unauthorized'], 401);
//         }
//     }

//     $validated = $request->validate([
//         'organization' => 'required|string',
//         'strategicDriversData' => 'required|array',
//     ]);

//     $organization = $validated['organization'];
//     $strategicDriversData = $validated['strategicDriversData'];

//     // ✅ Reindex items to make sure every item has an 'id'
//     $strategicDriversData = array_map(function ($driver, $index) {
//         $driver['id'] = $index + 1;
//         return $driver;
//     }, $strategicDriversData, array_keys($strategicDriversData));

//     $record = OpspStrategicDriver::where('organizationName', $organization)->first();

//     if (!$record) {
//         return response()->json(['status' => 'error', 'message' => 'Organization not found'], 404);
//     }

//     $record->strategicDriversData = $strategicDriversData;
//     $record->save();

//     return response()->json(['status' => 'success', 'message' => 'Strategic Drivers updated successfully']);
// });

//
    // // ref: frontend\src\components\2.one-page-strategic-plan\onePageStrategicPlan.jsx
    // Route::get('/api/v1/one-page-strategic-plan/foundations', function (Request $request) use ($API_secure) {
    //     if ($API_secure) {
    //         if (!$request->session()->get('logged_in')) {
    //             return response()->json(['message' => 'Unauthorized'], 401);
    //         }
    //         $user = $request->session()->get('user');
    //     }

    //     $data = [
    //         'Chuck Gulledge Advisors, LLC' => [
    //             [
    //                 'id' => 1,
    //                 'title' => 'Our Aspiration',
    //                 'content' => '"To be renowned as the premier coaching organization that transforms how companies achieve their optimal exits."',
    //             ],
    //             [
    //                 'id' => 2,
    //                 'title' => 'Our Purpose / Mission',
    //                 'content' => "Our purpose is:\n\nDevelop transformative coaching methodologies and frameworks.\nDeliver extraordinary, measurable results for our clients.\n\nOur organizational culture is designed so all team members win.",
    //             ],
    //             [
    //                 'id' => 3,
    //                 'title' => 'Brand Promise',
    //                 'content' => '',
    //             ],
    //             [
    //                 'id' => 4,
    //                 'title' => 'Profit Per X',
    //                 'content' => '',
    //             ],
    //             [
    //                 'id' => 5,
    //                 'title' => 'BHAG',
    //                 'content' => '$100 Billion in Exit Value',
    //             ],
    //             [
    //                 'id' => 6,
    //                 'title' => '3HAG',
    //                 'content' => '$7Mil in Revenue by 2027',
    //             ],
    //         ],
    //         'Collins Credit Union' => [
    //             [
    //                 'id' => 1,
    //                 'title' => 'Our Aspiration',
    //                 'content' => '"To be a trusted partner driving financial wellness and community growth."',
    //             ],
    //             [
    //                 'id' => 2,
    //                 'title' => 'Our Purpose / Mission',
    //                 'content' => "Empower members with innovative financial solutions.\nFoster a culture of inclusion and service excellence.",
    //             ],
    //             [
    //                 'id' => 3,
    //                 'title' => 'Brand Promise',
    //                 'content' => 'Reliable, Friendly, Innovative.',
    //             ],
    //             [
    //                 'id' => 4,
    //                 'title' => 'Profit Per X',
    //                 'content' => 'Maximize member value through sustainable growth.',
    //             ],
    //             [
    //                 'id' => 5,
    //                 'title' => 'BHAG',
    //                 'content' => '$50 Million in Community Investments',
    //             ],
    //             [
    //                 'id' => 6,
    //                 'title' => '3HAG',
    //                 'content' => '$12Mil in Revenue by 2028',
    //             ],
    //         ],
    //         'Test Skeleton Loading' => [
    //             [
    //                 'id' => 1,
    //                 'title' => '-',
    //                 'content' => '-',
    //             ],
    //             [
    //                 'id' => 2,
    //                 'title' => '-',
    //                 'content' => "-",
    //             ],
    //             [
    //                 'id' => 3,
    //                 'title' => '-',
    //                 'content' => '-',
    //             ],
    //             [
    //                 'id' => 4,
    //                 'title' => '-',
    //                 'content' => '-',
    //             ],
    //             [
    //                 'id' => 5,
    //                 'title' => '-',
    //                 'content' => '-',
    //             ],
    //             [
    //                 'id' => 6,
    //                 'title' => '-',
    //                 'content' => '-',
    //             ],
    //         ],
    //     ];

    //     $organization = $request->query('organization');

    //     if ($organization && isset($data[$organization])) {
    //         return response()->json($data[$organization]);
    //     }

    //     return response()->json(['message' => 'Organization not found or no organization provided.'], 404);
    // });
// ref: frontend\src\components\2.one-page-strategic-plan\onePageStrategicPlan.jsx
Route::get('/api/v1/one-page-strategic-plan/foundations', function (Request $request) use ($API_secure) {
    if ($API_secure) {
        if (!$request->session()->get('logged_in')) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }
    }

    $organization = $request->query('organization');

    if (!$organization) {
        return response()->json(['message' => 'Organization query parameter is required.'], 400);
    }

    $record = OpspFoundation::where('organizationName', $organization)->first();

    if (!$record || !$record->foundationsData) {
        return response()->json(['message' => 'Foundations data not found for the given organization.'], 404);
    }

    return response()->json($record->foundationsData);
});
    
// ref: // frontend/src/components/one-page-strategic-plan/2.FoundationsSection/FoundationsSection.jsx
Route::post('/api/v1/one-page-strategic-plan/foundations/update', function (Request $request) use ($API_secure) {
    if ($API_secure) {
        if (!$request->session()->get('logged_in')) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }
    }

    $organization = $request->input('organization');
    $foundationsData = $request->input('foundationsData', []); // default to empty array if missing

    if (!$organization) {
        return response()->json(['status' => 'error', 'message' => 'Missing required organization field'], 400);
    }

    $record = OpspFoundation::where('organizationName', $organization)->first();

    if (!$record) {
        return response()->json(['status' => 'error', 'message' => 'Organization not found'], 404);
    }

    $record->foundationsData = $foundationsData;
    $record->save();

    return response()->json(['status' => 'success', 'message' => 'Foundations data updated successfully']);
});


// Route::post('/api/v1/one-page-strategic-plan/foundations/update', function (Request $request) use ($API_secure) {
//     if ($API_secure) {
//         if (!$request->session()->get('logged_in')) {
//             return response()->json(['message' => 'Unauthorized'], 401);
//         }
//     }

//     $validated = $request->validate([
//         'organization' => 'required|string',
//         'foundationsData' => 'required|array',
//     ]);

//     $organization = $validated['organization'];
//     $foundationsData = $validated['foundationsData'];

//     $record = OpspFoundation::where('organizationName', $organization)->first();

//     if (!$record) {
//         return response()->json(['status' => 'error', 'message' => 'Organization not found'], 404);
//     }

//     $record->foundationsData = $foundationsData;
//     $record->save();

//     return response()->json(['status' => 'success', 'message' => 'Foundations data updated successfully']);
// });

// ref: frontend/src/components/one-page-strategic-plan/2.FoundationsSection/FoundationsSection.jsx
Route::post('/api/v1/one-page-strategic-plan/foundations/add', function (Request $request) use ($API_secure) {
    if ($API_secure) {
        if (!$request->session()->get('logged_in')) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }
    }

    $validated = $request->validate([
        'organization' => 'required|string',
        'newFoundation' => 'required|array',
    ]);

    $organization = $validated['organization'];
    $newFoundation = $validated['newFoundation'];

    // Find the record
    $record = OpspFoundation::where('organizationName', $organization)->first();

    if (!$record) {
        return response()->json(['message' => 'Organization not found'], 404);
    }

    // Decode current data or start with empty array
    $data = $record->foundationsData ?? [];
    $data = is_string($data) ? json_decode($data, true) : $data;

    // Assign new ID
    $newFoundation['id'] = count($data) + 1;

    // Append new item
    $data[] = $newFoundation;

    $record->foundationsData = $data;
    $record->save();

    return response()->json([
        'status' => 'success',
        'message' => 'New foundation added successfully',
        'updatedData' => $data
    ]);
});

//
    // // ref: frontend\src\components\2.one-page-strategic-plan\onePageStrategicPlan.jsx
    // Route::get('/api/v1/one-page-strategic-plan/three-year-outlook', function (Request $request) use ($API_secure) {
    //     if ($API_secure) {
    //         if (!$request->session()->get('logged_in')) {
    //             return response()->json(['message' => 'Unauthorized'], 401);
    //         }

    //         $user = $request->session()->get('user');
    //     }

    //     $organization = $request->query('organization');  // <-- get from query params

    //     $data = [
    //         'Chuck Gulledge Advisors, LLC' => [
    //             [
    //                 'id' => 1,
    //                 'year' => '2026',
    //                 'value' => '1.0 Revenue of $4 Million',
    //             ],
    //             [
    //                 'id' => 2,
    //                 'year' => '2027',
    //                 'value' => '2.0 Revenue of $7 Million',
    //             ],
    //             [
    //                 'id' => 3,
    //                 'year' => '2028',
    //                 'value' => '3.0 Revenue of $9 Million',
    //             ],
    //         ],

    //         'Collins Credit Union' => [
    //             [
    //                 'id' => 1,
    //                 'year' => '2029',
    //                 'value' => '4.0 Revenue of $10 Million',
    //             ],
    //             [
    //                 'id' => 2,
    //                 'year' => '2030',
    //                 'value' => '5.0 Revenue of $11 Million',
    //             ],
    //             [
    //                 'id' => 3,
    //                 'year' => '2031',
    //                 'value' => '6.0 Revenue of $12 Million',
    //             ],
    //         ],

    //         'Test Skeleton Loading' => [
    //             [
    //                 'id' => 1,
    //                 'year' => '-',
    //                 'value' => '-',
    //             ],
    //             [
    //                 'id' => 2,
    //                 'year' => '-',
    //                 'value' => '-',
    //             ],
    //             [
    //                 'id' => 3,
    //                 'year' => '-',
    //                 'value' => '-',
    //             ],
    //         ],
        
    //     ];

    //     return response()->json([
    //         $organization => $data[$organization] ?? [],
    //     ]);
    // });

// ref: frontend\src\components\2.one-page-strategic-plan\onePageStrategicPlan.jsx
Route::get('/api/v1/one-page-strategic-plan/three-year-outlook', function (Request $request) use ($API_secure) {
    // 🔐 Secure session check
    if ($API_secure && !$request->session()->get('logged_in')) {
        return response()->json(['message' => 'Unauthorized'], 401);
    }

    // 🏢 Validate organization query parameter
    $organization = $request->query('organization');
    if (!$organization) {
        return response()->json(['message' => 'Organization query parameter is required.'], 400);
    }

    // 📦 Fetch from DB
    $record = OpspThreeyearOutlook::where('organizationName', $organization)->first();
    if (!$record || !$record->threeyearOutlookData) {
        return response()->json([$organization => []]); // Always return keyed response
    }

    // 🧹 Handle JSON stored with extra quotes
    $rawData = $record->threeyearOutlookData;
    $decodedData = is_string($rawData) ? json_decode($rawData, true) : $rawData;

    if (!is_array($decodedData)) {
        return response()->json(['message' => 'Invalid data format in threeyearOutlookData.'], 500);
    }

    // ✅ Return in the shape expected by frontend
    return response()->json([
        $organization => $decodedData,
    ]);
});


// ref: frontend\src\components\2.one-page-strategic-plan\3.ThreeYearOutlook\ThreeYearOutlook.jsx
Route::post('/api/v1/one-page-strategic-plan/three-year-outlook/update', function (Request $request) use ($API_secure) {
    // 🔐 Optional session auth
    if ($API_secure && !$request->session()->get('logged_in')) {
        return response()->json(['message' => 'Unauthorized'], 401);
    }

    // Skip validation entirely
    $organization = $request->input('organization');
    $outlooks = $request->input('outlooks');

    // Optional: fallback if null
    if (!$organization) {
        return response()->json(['message' => 'Missing organization'], 422);
    }
    if ($outlooks === null) {
        $outlooks = [];
    }

    // 📦 Fetch or create record
    $record = OpspThreeyearOutlook::firstOrNew([
        'organizationName' => $organization,
    ]);

    // 💾 Save updated data as JSON (even if empty array)
    $record->threeyearOutlookData = json_encode($outlooks);
    $record->save();

    return response()->json([
        'message' => 'Three Year Outlook updated successfully.',
        'data' => $outlooks,
    ]);
});


// ref: frontend\src\components\2.one-page-strategic-plan\3.ThreeYearOutlook\ThreeYearOutlook.jsx
// Route::post('/api/v1/one-page-strategic-plan/three-year-outlook/add', function (Request $request) use ($API_secure) {
//     // 🔐 Secure session check
//     if ($API_secure && !$request->session()->get('logged_in')) {
//         return response()->json(['message' => 'Unauthorized'], 401);
//     }

//     $validated = $request->validate([
//         'organization' => 'required|string',
//         'newItem' => 'required|array',
//         'newItem.id' => 'required|integer',
//         'newItem.year' => 'required|string',
//         'newItem.value' => 'required|string',
//     ]);

//     $organization = $validated['organization'];
//     $newItem = $validated['newItem'];

//     $record = OpspThreeyearOutlook::where('organizationName', $organization)->first();

//     if (!$record) {
//         return response()->json(['message' => 'Organization not found.'], 404);
//     }

//     // Get current outlook data as array (already casted by the model)
//     $data = $record->threeyearOutlookData ?? [];
//     $data[] = $newItem;

//     $record->threeyearOutlookData = $data; // Auto JSON by cast
//     $record->save();

//     return response()->json([
//         'message' => 'New outlook added successfully.',
//         'data' => $newItem,
//     ]);
// });

// ref: frontend\src\components\2.one-page-strategic-plan\3.ThreeYearOutlook\ThreeYearOutlook.jsx
Route::post('/api/v1/one-page-strategic-plan/three-year-outlook/add', function (Request $request) use ($API_secure) {
    // 🔐 Secure session check
    if ($API_secure && !$request->session()->get('logged_in')) {
        return response()->json(['message' => 'Unauthorized'], 401);
    }

    $validated = $request->validate([
        'organization' => 'required|string',
        'newItem' => 'required|array',
        'newItem.id' => 'required|integer',
        'newItem.year' => 'required|string',
        'newItem.value' => 'required|string',
    ]);

    $organization = $validated['organization'];
    $newItem = $validated['newItem'];

    $record = OpspThreeyearOutlook::where('organizationName', $organization)->first();

    if (!$record) {
        return response()->json(['message' => 'Organization not found.'], 404);
    }

    // 🛡️ Ensure data is always treated as array (even if null or malformed)
    $data = is_array($record->threeyearOutlookData) ? $record->threeyearOutlookData : [];

    // ➕ Add the new item
    $data[] = $newItem;

    // 💾 Save updated array (automatically JSON-encoded by Laravel)
    $record->threeyearOutlookData = $data;
    $record->save();

    return response()->json([
        'message' => 'New outlook added successfully.',
        'data' => $newItem,
    ]);
});



//
    // ref: frontend\src\components\2.one-page-strategic-plan\onePageStrategicPlan.jsx
    // Route::get('/api/v1/one-page-strategic-plan/playing-to-win', function (Request $request) use ($API_secure) {
    //     if ($API_secure) {
    //         if (!$request->session()->get('logged_in')) {
    //             return response()->json(['message' => 'Unauthorized'], 401);
    //         }

    //         $user = $request->session()->get('user');
    //     }

    //     $organization = $request->query('organization');  // <-- get from query params

    //     $data = [
    //         'Chuck Gulledge Advisors, LLC' => [
    //             [
    //                 'id' => 1,
    //                 'title' => '2026',
    //                 'value' => '1.0 Revenue of $4 Million',
    //             ],
    //             [
    //                 'id' => 2,
    //                 'title' => '2027',
    //                 'value' => '2.0 Revenue of $7 Million',
    //             ],
    //             [
    //                 'id' => 3,
    //                 'title' => '2028',
    //                 'value' => '3.0 Revenue of $9 Million',
    //             ],
    //         ],

    //         'Collins Credit Union' => [
    //             [
    //                 'id' => 1,
    //                 'title' => '2029',
    //                 'value' => '4.0 Revenue of $10 Million',
    //             ],
    //             [
    //                 'id' => 2,
    //                 'title' => '2030',
    //                 'value' => '5.0 Revenue of $11 Million',
    //             ],
    //             [
    //                 'id' => 3,
    //                 'title' => '2031',
    //                 'value' => '6.0 Revenue of $12 Million',
    //             ],
    //         ],

    //         'Test Skeleton Loading' => [
    //             [
    //                 'id' => 1,
    //                 'title' => '-',
    //                 'value' => '-',
    //             ],
    //             [
    //                 'id' => 2,
    //                 'title' => '-',
    //                 'value' => '-',
    //             ],
    //             [
    //                 'id' => 3,
    //                 'title' => '-',
    //                 'value' => '-',
    //             ],
    //         ],
        
    //     ];

    //     return response()->json([
    //         $organization => $data[$organization] ?? [],
    //     ]);
    // });

// ref: frontend\src\components\2.one-page-strategic-plan\onePageStrategicPlan.jsx
Route::get('/api/v1/one-page-strategic-plan/playing-to-win', function (Request $request) use ($API_secure) {
    // 🔐 Secure session check
    if ($API_secure && !$request->session()->get('logged_in')) {
        return response()->json(['message' => 'Unauthorized'], 401);
    }

    // 🏢 Validate organization query parameter
    $organization = $request->query('organization');
    if (!$organization) {
        return response()->json(['message' => 'Organization query parameter is required.'], 400);
    }

    // 📦 Fetch from DB
    $record = OpspPlayingtowinStrategy::where('organizationName', $organization)->first();
    if (!$record || !$record->playingToWinStrategyData) {
        return response()->json([$organization => []]); // Always return keyed response
    }

    // 🧹 Handle JSON stored with extra quotes
    $rawData = $record->playingToWinStrategyData;
    $decodedData = is_string($rawData) ? json_decode($rawData, true) : $rawData;

    if (!is_array($decodedData)) {
        return response()->json(['message' => 'Invalid data format in playingToWinStrategyData.'], 500);
    }

    // ✅ Return in the shape expected by frontend
    return response()->json([
        $organization => $decodedData,
    ]);
});

// ref: frontend\src\components\one-page-strategic-plan\4.PlayingToWin\PlayingToWin.jsx
Route::post('/api/v1/one-page-strategic-plan/playing-to-win/update', function (Request $request) use ($API_secure) {
    if ($API_secure) {
        if (!$request->session()->get('logged_in')) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }
    }

    $organization = $request->input('organization');
    $newData = $request->input('playingToWinStrategyData');

    if (!$organization) {
        return response()->json(['message' => 'Missing organization.'], 422);
    }

    $record = OpspPlayingtowinStrategy::where('organizationName', $organization)->first();

    if (!$record) {
        return response()->json(['message' => 'Organization not found.'], 404);
    }

    $record->playingToWinStrategyData = $newData;
    $record->save();

    return response()->json([
        'message' => 'playingToWinStrategyData updated successfully.',
        'data' => $newData
    ]);
});


// ref: frontend\src\components\one-page-strategic-plan\4.PlayingToWin\PlayingToWin.jsx
Route::post('/api/v1/one-page-strategic-plan/playing-to-win/add', function (Request $request) use ($API_secure) {
    if ($API_secure) {
        if (!$request->session()->get('logged_in')) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }
    }

    $validated = $request->validate([
        'organization' => 'required|string',
        'newItem' => 'required|array',
        'newItem.id' => 'required|integer',
        'newItem.title' => 'required|string',
        'newItem.value' => 'required|string',
    ]);

    $organization = $validated['organization'];
    $newItem = $validated['newItem'];

    $record = OpspPlayingtowinStrategy::where('organizationName', $organization)->first();

    if (!$record) {
        return response()->json(['message' => 'Organization not found.'], 404);
    }

    $data = $record->playingToWinStrategyData ?? [];
    $data[] = $newItem;

    $record->playingToWinStrategyData = $data;
    $record->save();

    return response()->json([
        'message' => 'New item added to playingToWinStrategyData.',
        'newItem' => $newItem,
    ]);
});

//
    // ref: frontend\src\components\2.one-page-strategic-plan\onePageStrategicPlan.jsx
    // Route::get('/api/v1/one-page-strategic-plan/core-capabilities', function (Request $request) use ($API_secure) {
    //     if ($API_secure && !$request->session()->get('logged_in')) {
    //         return response()->json(['message' => 'Unauthorized'], 401);
    //     }

    //     $organization = $request->query('organization');

    //     $data = [
    //         'Chuck Gulledge Advisors, LLC' => [
    //             ['id' => 1, 'description' => 'Leadership Training', 'orig' => '✓', 'q1' => 'x', 'q2' => 'x', 'q3' => 'x', 'q4' => 'x'],
    //             ['id' => 2, 'description' => 'Technology Stack', 'orig' => 'x', 'q1' => '✓', 'q2' => 'x', 'q3' => 'x', 'q4' => 'x'],
    //         ],
    //         'Collins Credit Union' => [
    //             ['id' => 1, 'description' => 'Customer Loyalty', 'orig' => '✓', 'q1' => '✓', 'q2' => 'x', 'q3' => 'x', 'q4' => 'x'],
    //         ],
    //         'Test Skeleton Loading' => [
    //             ['id' => 1, 'description' => '-', 'orig' => '-', 'q1' => '-', 'q2' => '-', 'q3' => '-', 'q4' => '-'],
    //         ],
    //     ];

    //     return response()->json([
    //         $organization => $data[$organization] ?? [],
    //     ]);
    // });


// ref: frontend\src\components\2.one-page-strategic-plan\onePageStrategicPlan.jsx
Route::get('/api/v1/one-page-strategic-plan/core-capabilities', function (Request $request) use ($API_secure) {
    if ($API_secure && !$request->session()->get('logged_in')) {
        return response()->json(['message' => 'Unauthorized'], 401);
    }

    $organization = $request->query('organization');

    if (!$organization) {
        return response()->json(['message' => 'Organization is required'], 400);
    }

    $record = OpspCoreCapability::where('organizationName', $organization)->first();

    if (!$record) {
        return response()->json([$organization => []]); // return empty array if not found
    }

    return response()->json([
        $organization => $record->coreCapabilitiesData ?? [],
    ]);
});

// ref: frontend\src\components\2.one-page-strategic-plan\5.CoreCapabilities\CoreCapabilities.jsx
Route::post('/api/v1/one-page-strategic-plan/core-capabilities/update', function (Request $request) use ($API_secure) {
    if ($API_secure && !$request->session()->get('logged_in')) {
        return response()->json(['message' => 'Unauthorized'], 401);
    }

    $organization = $request->input('organization');
    $coreCapabilities = $request->input('coreCapabilities', []); // default to empty array if missing

    if (!$organization) {
        return response()->json(['message' => 'Missing required organization field'], 400);
    }

    $record = OpspCoreCapability::where('organizationName', $organization)->first();

    if (!$record) {
        return response()->json(['message' => 'Organization not found'], 404);
    }

    $record->coreCapabilitiesData = $coreCapabilities;
    $record->save();

    return response()->json(['message' => 'Core Capabilities updated successfully']);
});


// ref: rontend\src\components\2.one-page-strategic-plan\5.CoreCapabilities\CoreCapabilities.jsx
Route::post('/api/v1/one-page-strategic-plan/core-capabilities/add', function (Request $request) use ($API_secure) {
    if ($API_secure && !$request->session()->get('logged_in')) {
        return response()->json(['message' => 'Unauthorized'], 401);
    }

    $organization = $request->input('organization');
    $newCapability = $request->input('newCapability');

    if (!$organization || !$newCapability) {
        return response()->json(['message' => 'Missing required fields'], 400);
    }

    $record = OpspCoreCapability::where('organizationName', $organization)->first();

    if (!$record) {
        return response()->json(['message' => 'Organization not found'], 404);
    }

    $existingData = $record->coreCapabilitiesData ?? [];

    // Ensure it's an array
    if (!is_array($existingData)) {
        $existingData = [];
    }

    // Determine next ID based on highest current ID
    $maxId = collect($existingData)->max('id') ?? 0;
    $newCapability['id'] = $maxId + 1;

    $updatedData = [...$existingData, $newCapability];

    $record->coreCapabilitiesData = $updatedData;
    $record->save();

    return response()->json([
        'message' => 'Core Capability added successfully',
        'newItem' => $newCapability,
        'updatedData' => $updatedData,
    ]);
});

//
    // ref: frontend\src\components\2.one-page-strategic-plan\onePageStrategicPlan.jsx
    // Route::get('/api/v1/one-page-strategic-plan/four-decisions', function (Request $request) use ($API_secure) {
    //     if ($API_secure && !$request->session()->get('logged_in')) {
    //         return response()->json(['message' => 'Unauthorized'], 401);
    //     }

    //     $organization = $request->query('organization');

    //     $data = [
    //         'Chuck Gulledge Advisors, LLC' => [
    //             ['id' => 1, 'description' => 'Budget Allocation', 'orig' => 'x', 'q1' => 'x', 'q2' => '✓', 'q3' => 'x', 'q4' => '✓'],
    //             ['id' => 2, 'description' => 'Product Launch', 'orig' => '✓', 'q1' => '✓', 'q2' => 'x', 'q3' => '✓', 'q4' => 'x'],
    //             ['id' => 3, 'description' => 'Market Research', 'orig' => 'x', 'q1' => 'x', 'q2' => 'x', 'q3' => '✓', 'q4' => '✓'],
    //             ['id' => 4, 'description' => 'Customer Feedback', 'orig' => '✓', 'q1' => '✓', 'q2' => 'x', 'q3' => 'x', 'q4' => '✓'],
    //             ['id' => 5, 'description' => 'Team Collaboration', 'orig' => 'x', 'q1' => 'x', 'q2' => '✓', 'q3' => 'x', 'q4' => 'x'],
    //             ['id' => 6, 'description' => 'Sales Strategy', 'orig' => '✓', 'q1' => 'x', 'q2' => 'x', 'q3' => '✓', 'q4' => '✓'],
    //             ['id' => 7, 'description' => 'Quality Control', 'orig' => 'x', 'q1' => '✓', 'q2' => '✓', 'q3' => 'x', 'q4' => 'x'],
    //             ['id' => 8, 'description' => 'Employee Engagement', 'orig' => '✓', 'q1' => '✓', 'q2' => 'x', 'q3' => '✓', 'q4' => 'x'],
    //         ],

    //         'Collins Credit Union' => [
    //             ['id' => 1, 'description' => '-', 'orig' => '-', 'q1' => '-', 'q2' => '-', 'q3' => '-', 'q4' => '-'],
    //             ['id' => 2, 'description' => '-', 'orig' => '-', 'q1' => '-', 'q2' => '-', 'q3' => '-', 'q4' => '-'],
    //             ['id' => 3, 'description' => '-', 'orig' => '-', 'q1' => '-', 'q2' => '-', 'q3' => '-', 'q4' => '-'],
    //             ['id' => 4, 'description' => '-', 'orig' => '-', 'q1' => '-', 'q2' => '-', 'q3' => '-', 'q4' => '-'],
    //             ['id' => 5, 'description' => '-', 'orig' => '-', 'q1' => '-', 'q2' => '-', 'q3' => '-', 'q4' => '-'],
    //             ['id' => 6, 'description' => '-', 'orig' => '-', 'q1' => '-', 'q2' => '-', 'q3' => '-', 'q4' => '-'],
    //             ['id' => 7, 'description' => '-', 'orig' => '-', 'q1' => '-', 'q2' => '-', 'q3' => '-', 'q4' => '-'],
    //             ['id' => 8, 'description' => '-', 'orig' => '-', 'q1' => '-', 'q2' => '-', 'q3' => '-', 'q4' => '-'],
    //         ],

    //         'Test Skeleton Loading' => [
    //             ['id' => 1, 'description' => '-', 'orig' => '-', 'q1' => '-', 'q2' => '-', 'q3' => '-', 'q4' => '-'],
    //             ['id' => 2, 'description' => '-', 'orig' => '-', 'q1' => '-', 'q2' => '-', 'q3' => '-', 'q4' => '-'],
    //             ['id' => 3, 'description' => '-', 'orig' => '-', 'q1' => '-', 'q2' => '-', 'q3' => '-', 'q4' => '-'],
    //             ['id' => 4, 'description' => '-', 'orig' => '-', 'q1' => '-', 'q2' => '-', 'q3' => '-', 'q4' => '-'],
    //             ['id' => 5, 'description' => '-', 'orig' => '-', 'q1' => '-', 'q2' => '-', 'q3' => '-', 'q4' => '-'],
    //             ['id' => 6, 'description' => '-', 'orig' => '-', 'q1' => '-', 'q2' => '-', 'q3' => '-', 'q4' => '-'],
    //             ['id' => 7, 'description' => '-', 'orig' => '-', 'q1' => '-', 'q2' => '-', 'q3' => '-', 'q4' => '-'],
    //             ['id' => 8, 'description' => '-', 'orig' => '-', 'q1' => '-', 'q2' => '-', 'q3' => '-', 'q4' => '-'],
    //         ],
    //     ];

    //     return response()->json([
    //         $organization => $data[$organization] ?? [],
    //     ]);
    // });


// ref: frontend\src\components\2.one-page-strategic-plan\onePageStrategicPlan.jsx
Route::get('/api/v1/one-page-strategic-plan/four-decisions', function (Request $request) use ($API_secure) {
    if ($API_secure && !$request->session()->get('logged_in')) {
        return response()->json(['message' => 'Unauthorized'], 401);
    }

    $organization = $request->query('organization');

    if (!$organization) {
        return response()->json(['message' => 'Missing organization parameter'], 400);
    }

    $record = OpspFourDecision::where('organizationName', $organization)->first();

    if (!$record) {
        return response()->json([$organization => []], 200); // return empty array if not found
    }

    return response()->json([
        $organization => $record->fourDecisionsData ?? [],
    ]);
});

// ref: frontend\src\components\2.one-page-strategic-plan\6.FourDecisions\FourDecisions.jsx
Route::post('/api/v1/one-page-strategic-plan/four-decisions/update', function (Request $request) use ($API_secure) {
    if ($API_secure && !$request->session()->get('logged_in')) {
        return response()->json(['message' => 'Unauthorized'], 401);
    }

    $organization = $request->input('organization');
    $fourDecisions = $request->input('fourDecisions', []); // default to empty array if missing

    if (!$organization) {
        return response()->json(['message' => 'Missing required organization field'], 400);
    }

    $record = OpspFourDecision::where('organizationName', $organization)->first();

    if (!$record) {
        return response()->json(['message' => 'Organization not found'], 404);
    }

    $record->fourDecisionsData = $fourDecisions;
    $record->save();

    return response()->json([
        'message' => 'Four Decisions data updated successfully',
        'updatedData' => $record->fourDecisionsData,
    ]);
});


Route::post('/api/v1/one-page-strategic-plan/four-decisions/add', function (Request $request) use ($API_secure) {
    if ($API_secure && !$request->session()->get('logged_in')) {
        return response()->json(['message' => 'Unauthorized'], 401);
    }

    $organization = $request->input('organization');
    $newItem = $request->input('newItem');

    if (!$organization || !$newItem || !is_array($newItem)) {
        return response()->json(['message' => 'Missing or invalid data'], 400);
    }

    $record = OpspFourDecision::where('organizationName', $organization)->first();

    if (!$record) {
        return response()->json(['message' => 'Organization not found'], 404);
    }

    $data = $record->fourDecisionsData ?? [];
    $data[] = $newItem; // append to the end
    $record->fourDecisionsData = $data;
    $record->save();

    return response()->json([
        'message' => 'New FourDecisions item added successfully',
        'newData' => $data,
    ]);
});

//
    // // ref: frontend\src\components\2.one-page-strategic-plan\onePageStrategicPlan.jsx
    // Route::get('/api/v1/one-page-strategic-plan/constraints-tracker', function (Request $request) use ($API_secure) {
    //     if ($API_secure && !$request->session()->get('logged_in')) {
    //         return response()->json(['message' => 'Unauthorized'], 401);
    //     }

    //     $organization = $request->query('organization');

    //     $data = [
    //         'Chuck Gulledge Advisors, LLC' => [
    //             ['id' => 1, 'constraintTitle' => 'Leadership Training', 'description' => 'Pending', 'owner' => 'John Doe', 'actions' => 'In Progress', 'status' => 'Not Started'],
    //             ['id' => 2, 'constraintTitle' => 'Technology Stack', 'description' => 'Completed', 'owner' => 'Alice Smith', 'actions' => 'Ongoing', 'status' => 'Active'],
    //             ['id' => 3, 'constraintTitle' => 'Budget Allocation', 'description' => 'Reviewed', 'owner' => 'Sarah Lee', 'actions' => 'Scheduled', 'status' => 'Not Started'],
    //             ['id' => 4, 'constraintTitle' => 'Customer Feedback', 'description' => 'Pending', 'owner' => 'Mark Johnson', 'actions' => 'Completed', 'status' => 'Active'],
    //             ['id' => 5, 'constraintTitle' => 'Product Launch', 'description' => 'Approved', 'owner' => 'Linda Green', 'actions' => 'In Progress', 'status' => 'Active'],
    //             ['id' => 6, 'constraintTitle' => 'Team Collaboration', 'description' => 'In Progress', 'owner' => 'Emma Brown', 'actions' => 'Scheduled', 'status' => 'Not Started'],
    //             ['id' => 7, 'constraintTitle' => 'Market Research', 'description' => 'Completed', 'owner' => 'David White', 'actions' => 'Pending', 'status' => 'Inactive'],
    //         ],
            
    //         'Collins Credit Union' => [
    //             ['id' => 1, 'constraintTitle' => '-', 'description' => '-', 'owner' => '-', 'actions' => '-', 'status' => '-'],
    //             ['id' => 2, 'constraintTitle' => '-', 'description' => '-', 'owner' => '-', 'actions' => '-', 'status' => '-'],
    //             ['id' => 3, 'constraintTitle' => '-', 'description' => '-', 'owner' => '-', 'actions' => '-', 'status' => '-'],
    //             ['id' => 4, 'constraintTitle' => '-', 'description' => '-', 'owner' => '-', 'actions' => '-', 'status' => '-'],
    //             ['id' => 5, 'constraintTitle' => '-', 'description' => '-', 'owner' => '-', 'actions' => '-', 'status' => '-'],
    //             ['id' => 6, 'constraintTitle' => '-', 'description' => '-', 'owner' => '-', 'actions' => '-', 'status' => '-'],
    //             ['id' => 7, 'constraintTitle' => '-', 'description' => '-', 'owner' => '-', 'actions' => '-', 'status' => '-'],
    //         ],

    //         'Test Skeleton Loading' => [
    //             ['id' => 1, 'constraintTitle' => '-', 'description' => '-', 'owner' => '-', 'actions' => '-', 'status' => '-'],
    //             ['id' => 2, 'constraintTitle' => '-', 'description' => '-', 'owner' => '-', 'actions' => '-', 'status' => '-'],
    //             ['id' => 3, 'constraintTitle' => '-', 'description' => '-', 'owner' => '-', 'actions' => '-', 'status' => '-'],
    //             ['id' => 4, 'constraintTitle' => '-', 'description' => '-', 'owner' => '-', 'actions' => '-', 'status' => '-'],
    //             ['id' => 5, 'constraintTitle' => '-', 'description' => '-', 'owner' => '-', 'actions' => '-', 'status' => '-'],
    //             ['id' => 6, 'constraintTitle' => '-', 'description' => '-', 'owner' => '-', 'actions' => '-', 'status' => '-'],
    //             ['id' => 7, 'constraintTitle' => '-', 'description' => '-', 'owner' => '-', 'actions' => '-', 'status' => '-'],
    //         ],
    //     ];

    //     return response()->json([
    //         $organization => $data[$organization] ?? [],
    //     ]);
    // });


// ref: frontend\src\components\2.one-page-strategic-plan\onePageStrategicPlan.jsx
Route::get('/api/v1/one-page-strategic-plan/constraints-tracker', function (Request $request) use ($API_secure) {
    if ($API_secure && !$request->session()->get('logged_in')) {
        return response()->json(['message' => 'Unauthorized'], 401);
    }

    $organization = $request->query('organization');

    $record = OpspConstraintsTracker::where('organizationName', $organization)->first();

    if (!$record) {
        return response()->json([
            $organization => []
        ], 200);
    }

    return response()->json([
        $organization => $record->constraintsTrackerData ?? []
    ]);
});

// ref: frontend\src\components\one-page-strategic-plan\7.ConstraintsTracker\ConstraintsTracker.jsx
Route::put('/api/v1/one-page-strategic-plan/constraints-tracker/update', function (Request $request) use ($API_secure) {
    if ($API_secure && !$request->session()->get('logged_in')) {
        return response()->json(['message' => 'Unauthorized'], 401);
    }

    $organization = $request->input('organization');
    $updatedData = $request->input('constraintsTrackerData');

    if (!$organization || !is_array($updatedData)) {
        return response()->json(['message' => 'Invalid input.'], 400);
    }

    $record = OpspConstraintsTracker::where('organizationName', $organization)->first();

    if (!$record) {
        return response()->json(['message' => 'Organization not found.'], 404);
    }

    $record->constraintsTrackerData = $updatedData;
    $record->save();

    return response()->json([
        'message' => 'Constraints Tracker data updated successfully.',
        'updatedData' => $record->constraintsTrackerData,
    ]);
});

// ref: frontend\src\components\2.one-page-strategic-plan\7.ConstraintsTracker\ConstraintsTracker.jsx
Route::post('/api/v1/one-page-strategic-plan/constraints-tracker/add', function (Request $request) use ($API_secure) {
    if ($API_secure && !$request->session()->get('logged_in')) {
        return response()->json(['message' => 'Unauthorized'], 401);
    }

    $organization = $request->input('organization');
    $newItem = $request->input('newItem');

    if (!$organization || !is_array($newItem)) {
        return response()->json(['message' => 'Invalid input.'], 400);
    }

    $record = OpspConstraintsTracker::where('organizationName', $organization)->first();

    if (!$record) {
        return response()->json(['message' => 'Organization not found.'], 404);
    }

    $existingData = $record->constraintsTrackerData ?? [];

    // Ensure it's a proper array
    if (!is_array($existingData)) {
        $existingData = json_decode($existingData, true) ?? [];
    }

    // Assign next ID
    $nextId = collect($existingData)->pluck('id')->max() + 1;
    $newItem['id'] = $nextId;

    $existingData[] = $newItem;

    $record->constraintsTrackerData = $existingData;
    $record->save();

    return response()->json([
        'message' => 'New constraint tracker item added successfully.',
        'newItem' => $newItem,
    ]);
});

// ref: frontend\src\components\3.flywheel\1.FlyWheelContent\FlyWheelContent.jsx
Route::get('/api/v1/flywheel', function (Request $request) use ($API_secure) {
    if ($API_secure && !$request->session()->get('logged_in')) {
        return response()->json(['message' => 'Unauthorized'], 401);
    }

    $organization = $request->query('organization');
    if (!$organization) {
        return response()->json(['message' => 'Organization parameter is required'], 400);
    }

    $record = Flywheel::where('organizationName', $organization)->first();
    if (!$record) {
        return response()->json(['message' => 'Record not found'], 404);
    }

    return response()->json([
        'fileLink' => $record->fileLink
    ]);
});

// ref: frontend\src\components\3.flywheel\1.FlyWheelContent\FlyWheelContent.jsx
Route::post('/api/v1/flywheel/upload', function (Request $request) {
    $organization = $request->input('organization');
    if (!$organization) {
        return response()->json(['error' => 'Organization is required'], 400);
    }

    if (!$request->hasFile('file')) {
        return response()->json(['error' => 'No file uploaded'], 400);
    }

    $record = Flywheel::where('organizationName', $organization)->first();
    if (!$record) {
        return response()->json(['error' => 'Organization not found'], 404);
    }

    $file = $request->file('file');
    $uId = $record->u_id;
    $fileName = $file->getClientOriginalName();
    $targetPath = storage_path("app/public/flywheel/{$uId}");

    if (!File::exists($targetPath)) {
        File::makeDirectory($targetPath, 0755, true);
    }

    $file->move($targetPath, $fileName);

    $fileLink = "/flywheel/{$uId}/{$fileName}";

    $record->fileLink = $fileLink;
    $record->save();

    return response()->json([
        'message' => 'File uploaded successfully',
        'fileLink' => $fileLink,
    ]);
});

//
    // // ref: frontend\src\components\4.scoreboard\Scoreboard.jsx
    // Route::get('/api/v1/scoreboard/annual-priorities', function (Request $request) use ($API_secure) {
    //     if ($API_secure) {
    //         if (!$request->session()->get('logged_in')) {
    //             return response()->json(['message' => 'Unauthorized'], 401);
    //         }
    //         $user = $request->session()->get('user');
    //     }

    //     $organization = $request->query('organization');

    //     $data = [
    //         'Chuck Gulledge Advisors, LLC' => [
    //             'average' => 64.28,
    //             'members' => [
    //                 ['name' => 'Maricar Aquino', 'score' => 100],
    //                 ['name' => 'Chuck Gulledge', 'score' => 71],
    //                 ['name' => '', 'score' => 22],
    //             ],
    //         ],

    //         'Collins Credit Union' => [
    //             'average' => 75.45,
    //             'members' => [
    //                 ['name' => 'John Smith', 'score' => 80],
    //                 ['name' => 'Jane Doe', 'score' => 90],
    //                 ['name' => 'Emily Davis', 'score' => 56],
    //             ],
    //         ],

    //         'Test Skeleton Loading' => [
    //             'average' => 0,
    //             'members' => [
    //                 ['name' => '-', 'score' => 0],
    //                 ['name' => '-', 'score' => 0],
    //                 ['name' => '-', 'score' => 0],
    //             ],
    //         ],
    //     ];

    //     return response()->json($data[$organization] ?? ['average' => 0, 'members' => []]);
    // });

// ref: frontend\src\components\4.scoreboard\Scoreboard.jsx
Route::get('/api/v1/scoreboard/annual-priorities', function (Request $request) use ($API_secure) {
    if ($API_secure) {
        if (!$request->session()->get('logged_in')) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }
        $user = $request->session()->get('user');
    }

    $organization = $request->query('organization');

    if (!$organization) {
        return response()->json(['message' => 'Organization is required'], 400);
    }

    $record = ScoreboardAnnualpriority::where('organizationName', $organization)->first();

    if (!$record) {
        return response()->json([
            'average' => 0,
            'members' => [],
        ]);
    }

    return response()->json($record->annualPrioritiesdData ?? [
        'average' => 0,
        'members' => [],
    ]);
});

//
    // // ref: frontend\src\components\4.scoreboard\Scoreboard.jsx
    // Route::get('/api/v1/scoreboard/company-traction-cards', function (Request $request) use ($API_secure) {
    //     if ($API_secure) {
    //         if (!$request->session()->get('logged_in')) {
    //             return response()->json(['message' => 'Unauthorized'], 401);
    //         }
    //         $user = $request->session()->get('user');
    //     }

    //     $organization = $request->query('organization');

    //     $data = [
    //         'Chuck Gulledge Advisors, LLC' => [
    //             ['label' => 'Q1', 'percent' => 100],
    //             ['label' => 'Q2', 'percent' => 93],
    //             ['label' => 'Q3', 'percent' => 5],
    //             ['label' => 'Q4', 'percent' => 0],
    //         ],
    //         'Collins Credit Union' => [
    //             ['label' => 'Q1', 'percent' => 85],
    //             ['label' => 'Q2', 'percent' => 75],
    //             ['label' => 'Q3', 'percent' => 55],
    //             ['label' => 'Q4', 'percent' => 60],
    //         ],
    //         'Test Skeleton Loading' => [
    //             ['label' => 'Q1', 'percent' => 0],
    //             ['label' => 'Q2', 'percent' => 0],
    //             ['label' => 'Q3', 'percent' => 0],
    //             ['label' => 'Q4', 'percent' => 0],
    //         ],
    //     ];

    //     return response()->json($data[$organization] ?? []);
    // });
// ref: frontend\src\components\4.scoreboard\Scoreboard.jsx
Route::get('/api/v1/scoreboard/company-traction-cards', function (Request $request) use ($API_secure) {
    if ($API_secure) {
        if (!$request->session()->get('logged_in')) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }
        $user = $request->session()->get('user');
    }

    $organization = $request->query('organization');

    if (!$organization) {
        return response()->json(['message' => 'Missing organization parameter'], 400);
    }

    $record = ScoreboardCompanyTractionCard::where('organizationName', $organization)->first();

    if (!$record) {
        return response()->json([], 200);
    }

    return response()->json($record->companyTractionCardData ?? []);
});

//
    // // ref: frontend\src\components\4.scoreboard\Scoreboard.jsx
    // Route::get('/api/v1/scoreboard/project-progress', function (Request $request) use ($API_secure) {
    //     if ($API_secure) {
    //         if (!$request->session()->get('logged_in')) {
    //             return response()->json(['message' => 'Unauthorized'], 401);
    //         }
    //     }

    //     $organization = $request->query('organization');

    //     // 🧪 Sample data for multiple orgs
    //     $data = [
    //         'Chuck Gulledge Advisors, LLC' => [
    //             'completed' => 10,
    //             'total' => 36,
    //         ],
    //         'Collins Credit Union' => [
    //             'completed' => 28,
    //             'total' => 30,
    //         ],
    //         'Test Skeleton Loading' => [
    //             'completed' => 0,
    //             'total' => 0,
    //         ],
    //     ];

    //     return response()->json($data[$organization] ?? ['completed' => 0, 'total' => 0]);
    // });

// ref: frontend\src\components\4.scoreboard\Scoreboard.jsx
Route::get('/api/v1/scoreboard/project-progress', function (Request $request) use ($API_secure) {
    if ($API_secure) {
        if (!$request->session()->get('logged_in')) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }
    }

    $organization = $request->query('organization');

    if (!$organization) {
        return response()->json(['message' => 'Organization name is required'], 400);
    }

    $record = ScoreboardProjectProgressCard::where('organizationName', $organization)->first();

    if (!$record) {
        return response()->json(['completed' => 0, 'total' => 0]);
    }

    return response()->json($record->projectProgressCardData ?? ['completed' => 0, 'total' => 0]);
});

//
    // // ref: frontend\src\components\5.growth-command-center\growthCommandCenter.jsx
    // Route::get('/api/v1/growth-command-center/metrics', function (Request $request) {
    //     $organization = $request->query('organization');

    //     $data = [
    //         'Chuck Gulledge Advisors, LLC' => [
    //             [
    //                 'title' => 'Checks Processed',
    //                 'percent' => 30,
    //                 'annualGoal' => 20000,
    //                 'current' => 18888,
    //                 'monthlyData' => [
    //                     ['month' => 'Jan', 'goal' => 1500, 'current' => 1300, 'progress' => 87],
    //                     ['month' => 'Feb', 'goal' => 1500, 'current' => 1700, 'progress' => 113],
    //                     ['month' => 'Mar', 'goal' => 1800, 'current' => 2000, 'progress' => 111],
    //                     ['month' => 'Apr', 'goal' => 1700, 'current' => 1600, 'progress' => 94],
    //                     ['month' => 'May', 'goal' => 1600, 'current' => 1650, 'progress' => 103],
    //                     ['month' => 'Jun', 'goal' => 1700, 'current' => 1850, 'progress' => 109],
    //                     ['month' => 'Jul', 'goal' => 1700, 'current' => 1700, 'progress' => 100],
    //                     ['month' => 'Aug', 'goal' => 1600, 'current' => 1600, 'progress' => 100],
    //                     ['month' => 'Sep', 'goal' => 1800, 'current' => 1700, 'progress' => 94],
    //                     ['month' => 'Oct', 'goal' => 1600, 'current' => 1700, 'progress' => 106],
    //                     ['month' => 'Nov', 'goal' => 1400, 'current' => 1388, 'progress' => 99],
    //                     ['month' => 'Dec', 'goal' => 1500, 'current' => 1800, 'progress' => 120],
    //                 ],
    //                 'quarterlyData' => [
    //                     ['quarter' => 'Q1', 'goal' => 4800, 'current' => 5000, 'progress' => 104],
    //                     ['quarter' => 'Q2', 'goal' => 5000, 'current' => 5100, 'progress' => 102],
    //                     ['quarter' => 'Q3', 'goal' => 5100, 'current' => 5000, 'progress' => 98],
    //                     ['quarter' => 'Q4', 'goal' => 4500, 'current' => 4788, 'progress' => 106],
    //                 ],
    //             ],
    //             [
    //                 'title' => 'Number of Customers',
    //                 'percent' => 50,
    //                 'annualGoal' => 1000,
    //                 'current' => 500,
    //                 'monthlyData' => [
    //                     ['month' => 'Jan', 'goal' => 80, 'current' => 40, 'progress' => 50],
    //                     ['month' => 'Feb', 'goal' => 90, 'current' => 50, 'progress' => 56],
    //                     ['month' => 'Mar', 'goal' => 100, 'current' => 60, 'progress' => 60],
    //                     ['month' => 'Apr', 'goal' => 90, 'current' => 70, 'progress' => 78],
    //                     ['month' => 'May', 'goal' => 90, 'current' => 80, 'progress' => 89],
    //                     ['month' => 'Jun', 'goal' => 80, 'current' => 60, 'progress' => 75],
    //                     ['month' => 'Jul', 'goal' => 90, 'current' => 70, 'progress' => 78],
    //                     ['month' => 'Aug', 'goal' => 90, 'current' => 70, 'progress' => 78],
    //                     ['month' => 'Sep', 'goal' => 100, 'current' => 0, 'progress' => 0],
    //                     ['month' => 'Oct', 'goal' => 90, 'current' => 0, 'progress' => 0],
    //                     ['month' => 'Nov', 'goal' => 60, 'current' => 0, 'progress' => 0],
    //                     ['month' => 'Dec', 'goal' => 60, 'current' => 0, 'progress' => 0],
    //                 ],
    //                 'quarterlyData' => [
    //                     ['quarter' => 'Q1', 'goal' => 270, 'current' => 150, 'progress' => 56],
    //                     ['quarter' => 'Q2', 'goal' => 260, 'current' => 210, 'progress' => 81],
    //                     ['quarter' => 'Q3', 'goal' => 280, 'current' => 140, 'progress' => 50],
    //                     ['quarter' => 'Q4', 'goal' => 210, 'current' => 0, 'progress' => 0],
    //                 ],
    //             ],
    //             [
    //                 'title' => 'Profit per X',
    //                 'percent' => 89,
    //                 'annualGoal' => 120000,
    //                 'current' => 106800,
    //                 'monthlyData' => [
    //                     ['month' => 'Jan', 'goal' => 10000, 'current' => 9000, 'progress' => 90],
    //                     ['month' => 'Feb', 'goal' => 10000, 'current' => 9600, 'progress' => 96],
    //                     ['month' => 'Mar', 'goal' => 10000, 'current' => 9700, 'progress' => 97],
    //                     ['month' => 'Apr', 'goal' => 10000, 'current' => 8800, 'progress' => 88],
    //                     ['month' => 'May', 'goal' => 10000, 'current' => 9200, 'progress' => 92],
    //                     ['month' => 'Jun', 'goal' => 10000, 'current' => 9100, 'progress' => 91],
    //                     ['month' => 'Jul', 'goal' => 10000, 'current' => 10000, 'progress' => 100],
    //                     ['month' => 'Aug', 'goal' => 10000, 'current' => 9500, 'progress' => 95],
    //                     ['month' => 'Sep', 'goal' => 10000, 'current' => 9500, 'progress' => 95],
    //                     ['month' => 'Oct', 'goal' => 10000, 'current' => 10000, 'progress' => 100],
    //                     ['month' => 'Nov', 'goal' => 10000, 'current' => 10000, 'progress' => 100],
    //                     ['month' => 'Dec', 'goal' => 10000, 'current' => 10000, 'progress' => 100],
    //                 ],
    //                 'quarterlyData' => [
    //                     ['quarter' => 'Q1', 'goal' => 30000, 'current' => 28300, 'progress' => 94],
    //                     ['quarter' => 'Q2', 'goal' => 30000, 'current' => 27100, 'progress' => 90],
    //                     ['quarter' => 'Q3', 'goal' => 30000, 'current' => 29000, 'progress' => 97],
    //                     ['quarter' => 'Q4', 'goal' => 30000, 'current' => 22400, 'progress' => 75],
    //                 ],
    //             ],
    //         ],

    //         'Collins Credit Union' => [
    //             [
    //                 'title' => 'Checks Processed',
    //                 'percent' => 65,
    //                 'annualGoal' => 24000,
    //                 'current' => 15600,
    //                 'monthlyData' => [
    //                     ['month' => 'Jan', 'goal' => 2000, 'current' => 1800, 'progress' => 90],
    //                     ['month' => 'Feb', 'goal' => 2000, 'current' => 1900, 'progress' => 95],
    //                     ['month' => 'Mar', 'goal' => 2000, 'current' => 2000, 'progress' => 100],
    //                     ['month' => 'Apr', 'goal' => 2000, 'current' => 1900, 'progress' => 95],
    //                     ['month' => 'May', 'goal' => 2000, 'current' => 2000, 'progress' => 100],
    //                     ['month' => 'Jun', 'goal' => 2000, 'current' => 1900, 'progress' => 95],
    //                     ['month' => 'Jul', 'goal' => 2000, 'current' => 1600, 'progress' => 80],
    //                     ['month' => 'Aug', 'goal' => 2000, 'current' => 1500, 'progress' => 75],
    //                     ['month' => 'Sep', 'goal' => 2000, 'current' => 1500, 'progress' => 75],
    //                     ['month' => 'Oct', 'goal' => 2000, 'current' => 1600, 'progress' => 80],
    //                     ['month' => 'Nov', 'goal' => 2000, 'current' => 1500, 'progress' => 75],
    //                     ['month' => 'Dec', 'goal' => 2000, 'current' => 1500, 'progress' => 75],
    //                 ],
    //                 'quarterlyData' => [
    //                     ['quarter' => 'Q1', 'goal' => 6000, 'current' => 5700, 'progress' => 95],
    //                     ['quarter' => 'Q2', 'goal' => 6000, 'current' => 5800, 'progress' => 97],
    //                     ['quarter' => 'Q3', 'goal' => 6000, 'current' => 4600, 'progress' => 76],
    //                     ['quarter' => 'Q4', 'goal' => 6000, 'current' => 5500, 'progress' => 91],
    //                 ],
    //             ],
    //             [
    //                 'title' => 'Number of Customers',
    //                 'percent' => 40,
    //                 'annualGoal' => 800,
    //                 'current' => 320,
    //                 'monthlyData' => [
    //                     ['month' => 'Jan', 'goal' => 70, 'current' => 50, 'progress' => 71],
    //                     ['month' => 'Feb', 'goal' => 70, 'current' => 55, 'progress' => 79],
    //                     ['month' => 'Mar', 'goal' => 70, 'current' => 60, 'progress' => 86],
    //                     ['month' => 'Apr', 'goal' => 70, 'current' => 60, 'progress' => 86],
    //                     ['month' => 'May', 'goal' => 70, 'current' => 65, 'progress' => 93],
    //                     ['month' => 'Jun', 'goal' => 70, 'current' => 60, 'progress' => 86],
    //                     ['month' => 'Jul', 'goal' => 70, 'current' => 50, 'progress' => 71],
    //                     ['month' => 'Aug', 'goal' => 70, 'current' => 40, 'progress' => 57],
    //                     ['month' => 'Sep', 'goal' => 70, 'current' => 30, 'progress' => 43],
    //                     ['month' => 'Oct', 'goal' => 70, 'current' => 30, 'progress' => 43],
    //                     ['month' => 'Nov', 'goal' => 70, 'current' => 30, 'progress' => 43],
    //                     ['month' => 'Dec', 'goal' => 70, 'current' => 30, 'progress' => 43],
    //                 ],
    //                 'quarterlyData' => [
    //                     ['quarter' => 'Q1', 'goal' => 210, 'current' => 165, 'progress' => 79],
    //                     ['quarter' => 'Q2', 'goal' => 210, 'current' => 190, 'progress' => 90],
    //                     ['quarter' => 'Q3', 'goal' => 210, 'current' => 120, 'progress' => 57],
    //                     ['quarter' => 'Q4', 'goal' => 210, 'current' => 105, 'progress' => 50],
    //                 ],
    //             ],
    //             [
    //                 'title' => 'Profit per X',
    //                 'percent' => 75,
    //                 'annualGoal' => 100000,
    //                 'current' => 75000,
    //                 'monthlyData' => [
    //                     ['month' => 'Jan', 'goal' => 8000, 'current' => 7000, 'progress' => 88],
    //                     ['month' => 'Feb', 'goal' => 8000, 'current' => 7500, 'progress' => 94],
    //                     ['month' => 'Mar', 'goal' => 8000, 'current' => 8000, 'progress' => 100],
    //                     ['month' => 'Apr', 'goal' => 8000, 'current' => 7500, 'progress' => 94],
    //                     ['month' => 'May', 'goal' => 8000, 'current' => 7800, 'progress' => 98],
    //                     ['month' => 'Jun', 'goal' => 8000, 'current' => 7700, 'progress' => 96],
    //                     ['month' => 'Jul', 'goal' => 8000, 'current' => 6000, 'progress' => 75],
    //                     ['month' => 'Aug', 'goal' => 8000, 'current' => 5500, 'progress' => 69],
    //                     ['month' => 'Sep', 'goal' => 8000, 'current' => 5000, 'progress' => 63],
    //                     ['month' => 'Oct', 'goal' => 8000, 'current' => 5000, 'progress' => 63],
    //                     ['month' => 'Nov', 'goal' => 8000, 'current' => 5000, 'progress' => 63],
    //                     ['month' => 'Dec', 'goal' => 8000, 'current' => 5000, 'progress' => 63],
    //                 ],
    //                 'quarterlyData' => [
    //                     ['quarter' => 'Q1', 'goal' => 24000, 'current' => 22500, 'progress' => 94],
    //                     ['quarter' => 'Q2', 'goal' => 24000, 'current' => 23000, 'progress' => 96],
    //                     ['quarter' => 'Q3', 'goal' => 24000, 'current' => 16500, 'progress' => 69],
    //                     ['quarter' => 'Q4', 'goal' => 24000, 'current' => 13000, 'progress' => 54],
    //                 ],
    //             ],
    //         ],

        
    //         'Test Skeleton Loading' => [
    //             [
    //                 'title' => '0',
    //                 'percent' => 0,
    //                 'annualGoal' => 0,
    //                 'current' => 0,
    //                 'monthlyData' => [
    //                     ['month' => 'Jan', 'goal' => 0, 'current' => 0, 'progress' => 0],
    //                     ['month' => 'Feb', 'goal' => 0, 'current' => 0, 'progress' => 0],
    //                     ['month' => 'Mar', 'goal' => 0, 'current' => 0, 'progress' => 0],
    //                     ['month' => 'Apr', 'goal' => 0, 'current' => 0, 'progress' => 0],
    //                     ['month' => 'May', 'goal' => 0, 'current' => 0, 'progress' => 0],
    //                     ['month' => 'Jun', 'goal' => 0, 'current' => 0, 'progress' => 0],
    //                     ['month' => 'Jul', 'goal' => 0, 'current' => 0, 'progress' => 0],
    //                     ['month' => 'Aug', 'goal' => 0, 'current' => 0, 'progress' => 0],
    //                     ['month' => 'Sep', 'goal' => 0, 'current' => 0, 'progress' => 0],
    //                     ['month' => 'Oct', 'goal' => 0, 'current' => 0, 'progress' => 0],
    //                     ['month' => 'Nov', 'goal' => 0, 'current' => 0, 'progress' => 0],
    //                     ['month' => 'Dec', 'goal' => 0, 'current' => 0, 'progress' => 0],
    //                 ],
    //                 'quarterlyData' => [
    //                     ['quarter' => 'Q1', 'goal' => 0, 'current' => 0, 'progress' => 0],
    //                     ['quarter' => 'Q2', 'goal' => 0, 'current' => 0, 'progress' => 0],
    //                     ['quarter' => 'Q3', 'goal' => 0, 'current' => 0, 'progress' => 0],
    //                     ['quarter' => 'Q4', 'goal' => 0, 'current' => 0, 'progress' => 0],
    //                 ],
    //             ],
    //             // Clone for 2nd and 3rd cards
    //             [
    //                 'title' => '0',
    //                 'percent' => 0,
    //                 'annualGoal' => 0,
    //                 'current' => 0,
    //                 'monthlyData' => [
    //                     ['month' => 'Jan', 'goal' => 0, 'current' => 0, 'progress' => 0],
    //                     ['month' => 'Feb', 'goal' => 0, 'current' => 0, 'progress' => 0],
    //                     ['month' => 'Mar', 'goal' => 0, 'current' => 0, 'progress' => 0],
    //                     ['month' => 'Apr', 'goal' => 0, 'current' => 0, 'progress' => 0],
    //                     ['month' => 'May', 'goal' => 0, 'current' => 0, 'progress' => 0],
    //                     ['month' => 'Jun', 'goal' => 0, 'current' => 0, 'progress' => 0],
    //                     ['month' => 'Jul', 'goal' => 0, 'current' => 0, 'progress' => 0],
    //                     ['month' => 'Aug', 'goal' => 0, 'current' => 0, 'progress' => 0],
    //                     ['month' => 'Sep', 'goal' => 0, 'current' => 0, 'progress' => 0],
    //                     ['month' => 'Oct', 'goal' => 0, 'current' => 0, 'progress' => 0],
    //                     ['month' => 'Nov', 'goal' => 0, 'current' => 0, 'progress' => 0],
    //                     ['month' => 'Dec', 'goal' => 0, 'current' => 0, 'progress' => 0],
    //                 ],
    //                 'quarterlyData' => [
    //                     ['quarter' => 'Q1', 'goal' => 0, 'current' => 0, 'progress' => 0],
    //                     ['quarter' => 'Q2', 'goal' => 0, 'current' => 0, 'progress' => 0],
    //                     ['quarter' => 'Q3', 'goal' => 0, 'current' => 0, 'progress' => 0],
    //                     ['quarter' => 'Q4', 'goal' => 0, 'current' => 0, 'progress' => 0],
    //                 ],
    //             ],
    //             [
    //                 'title' => '0',
    //                 'percent' => 0,
    //                 'annualGoal' => 0,
    //                 'current' => 0,
    //                 'monthlyData' => [
    //                     ['month' => 'Jan', 'goal' => 0, 'current' => 0, 'progress' => 0],
    //                     ['month' => 'Feb', 'goal' => 0, 'current' => 0, 'progress' => 0],
    //                     ['month' => 'Mar', 'goal' => 0, 'current' => 0, 'progress' => 0],
    //                     ['month' => 'Apr', 'goal' => 0, 'current' => 0, 'progress' => 0],
    //                     ['month' => 'May', 'goal' => 0, 'current' => 0, 'progress' => 0],
    //                     ['month' => 'Jun', 'goal' => 0, 'current' => 0, 'progress' => 0],
    //                     ['month' => 'Jul', 'goal' => 0, 'current' => 0, 'progress' => 0],
    //                     ['month' => 'Aug', 'goal' => 0, 'current' => 0, 'progress' => 0],
    //                     ['month' => 'Sep', 'goal' => 0, 'current' => 0, 'progress' => 0],
    //                     ['month' => 'Oct', 'goal' => 0, 'current' => 0, 'progress' => 0],
    //                     ['month' => 'Nov', 'goal' => 0, 'current' => 0, 'progress' => 0],
    //                     ['month' => 'Dec', 'goal' => 0, 'current' => 0, 'progress' => 0],
    //                 ],
    //                 'quarterlyData' => [
    //                     ['quarter' => 'Q1', 'goal' => 0, 'current' => 0, 'progress' => 0],
    //                     ['quarter' => 'Q2', 'goal' => 0, 'current' => 0, 'progress' => 0],
    //                     ['quarter' => 'Q3', 'goal' => 0, 'current' => 0, 'progress' => 0],
    //                     ['quarter' => 'Q4', 'goal' => 0, 'current' => 0, 'progress' => 0],
    //                 ],
    //             ],
    //         ],


    //     ];
        
    //     return response()->json([
    //         $organization => $data[$organization] ?? [],
    //     ]);
    // });

// ref: frontend\src\components\5.growth-command-center\growthCommandCenter.jsx
Route::get('/api/v1/growth-command-center/metrics', function (Request $request) use ($API_secure)  {

    if ($API_secure) {
        if (!$request->session()->get('logged_in')) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }
    }

    $validator = Validator::make($request->all(), [
        'organization' => 'required|string|max:255',
    ]);

    if ($validator->fails()) {
        return response()->json(['error' => 'Invalid input'], 400);
    }

    $organization = $request->query('organization');

    $record = GccMetric::where('organizationName', $organization)->first();

    if (!$record) {
        return response()->json([$organization => []]);
    }

    return response()->json([
        $organization => $record->metricsData,
    ]);
});

//
    // ref: frontend\src\components\5.growth-command-center\growthCommandCenter.jsx
    // Route::get('/api/v1/growth-command-center/revenue-growth', function (Request $request) use ($API_secure) {

    //     if ($API_secure) {
    //         if (!$request->session()->get('logged_in')) {
    //             return response()->json(['message' => 'Unauthorized'], 401);
    //         }
    //         $user = $request->session()->get('user');
    //     }

    //     $organization = $request->query('organization');

    //     // Mock data for multiple organizations
    //     $data = [
    //         'Chuck Gulledge Advisors, LLC' => [
    //             [
    //                 'year' => '2023',
    //                 'revenueGrowth' => 5,
    //                 'cogsGrowth' => 3,
    //             ],
    //             [
    //                 'year' => '2024',
    //                 'revenueGrowth' => 12,
    //                 'cogsGrowth' => 10,
    //             ],
    //             [
    //                 'year' => '2025',
    //                 'revenueGrowth' => 9,
    //                 'cogsGrowth' => 7,
    //             ],
    //         ],

    //         'Collins Credit Union' => [
    //             [
    //                 'year' => '2023',
    //                 'revenueGrowth' => 4,
    //                 'cogsGrowth' => 2,
    //             ],
    //             [
    //                 'year' => '2024',
    //                 'revenueGrowth' => 9,
    //                 'cogsGrowth' => 7,
    //             ],
    //             [
    //                 'year' => '2025',
    //                 'revenueGrowth' => 11,
    //                 'cogsGrowth' => 8,
    //             ],
    //         ],

    //         'Test Skeleton Loading' => [
    //             [
    //                 'year' => '2023',
    //                 'revenueGrowth' => 0,
    //                 'cogsGrowth' => 0,
    //             ],
    //             [
    //                 'year' => '2024',
    //                 'revenueGrowth' => 0,
    //                 'cogsGrowth' => 0,
    //             ],
    //             [
    //                 'year' => '2025',
    //                 'revenueGrowth' => 0,
    //                 'cogsGrowth' => 0,
    //             ],
    //         ],
    //     ];

    //     return response()->json($data[$organization] ?? []);
    // });

// ref: frontend\src\components\5.growth-command-center\growthCommandCenter.jsx
Route::get('/api/v1/growth-command-center/revenue-growth', function (Request $request) use ($API_secure) {
    if ($API_secure) {
        if (!$request->session()->get('logged_in')) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }
    }

    $validator = Validator::make($request->all(), [
        'organization' => 'required|string|max:255',
    ]);

    if ($validator->fails()) {
        return response()->json(['message' => 'Invalid or missing organization parameter'], 400);
    }

    $organization = $request->query('organization');

    $record = GccRevenueGrowth::where('organizationName', $organization)->first();

    if (!$record) {
        return response()->json([]); // Frontend expects an array
    }

    // ✅ Directly return the array
    return response()->json($record->financialGrowthData);
});


// ref: frontend\src\components\5.growth-command-center\1.Metrics\ThreeMetricCards.jsx
Route::post('/api/v1/growth-command-center/gcc-metrics/update', function (Request $request) use ($API_secure) {

    if ($API_secure && !$request->session()->get('logged_in')) {
        return response()->json(['message' => 'Unauthorized'], 401);
    }

    $organization = $request->input('organizationName');
    $newMetrics = $request->input('metricsData', []);

    $record = GccMetric::where('organizationName', $organization)->first();

    if (!$record) {
        return response()->json([
            'message' => 'No record found for the given organization.',
            'data' => [],
        ]);
    }

    $record->metricsData = $newMetrics;
    $record->save();

    return response()->json([
        'message' => 'Metrics updated successfully',
        'data' => $record->metricsData,
    ]);
});


//
// // ref: frontend\src\components\6.company-traction\companyTraction.jsx
// Route::get('/api/v1/company-traction/annual-priorities', function (Request $request) use ($API_secure) {

//     if ($API_secure) {
//         if (!$request->session()->get('logged_in')) {
//             return response()->json(['message' => 'Unauthorized'], 401);
//         }
//         $user = $request->session()->get('user');
//     }

//     $organization = $request->query('organization');

//     // Mock data for multiple organizations
    // $data = [
    //     'Chuck Gulledge Advisors, LLC' => [
    //         [
    //             'id' => 1,
    //             'description' => 'Systematize Coaching Framework (now called Momentum OS).',
    //             'status' => '100.00%',
    //         ],
    //         [
    //             'id' => 2,
    //             'description' => 'Centers on elite coach acquisition and building a high-performance culture, ensuring the team can execute the innovative solutions.',
    //             'status' => '75.00%',
    //         ],
    //         [
    //             'id' => 3,
    //             'description' => 'Emphasizes structured processes and achieving 10/10 ratings, turning the talent and solutions into concrete results.',
    //             'status' => '60.00%',
    //         ],
    //         [
    //             'id' => 4,
    //             'description' => 'Leverages strategic alliances and builds a referral engine to expand reach, which then cycles back to reinforce the brand promise.',
    //             'status' => '45.00%',
    //         ],
    //     ],

    //     'Collins Credit Union' => [
    //         [
    //             'id' => 1,
    //             'description' => 'Building an exceptional customer experience through tailored solutions and responsive service.',
    //             'status' => '85.00%',
    //         ],
    //         [
    //             'id' => 2,
    //             'description' => 'Streamline operations and reduce costs while maintaining quality.',
    //             'status' => '90.00%',
    //         ],
    //         [
    //             'id' => 3,
    //             'description' => 'Implement new technologies to drive efficiency and innovation.',
    //             'status' => '60.00%',
    //         ],
    //         [
    //             'id' => 4,
    //             'description' => 'Entering new markets and increasing market share.',
    //             'status' => '50.00%',
    //         ],
    //     ],

    //     'Test Skeleton Loading' => [
    //         [
    //             'id' => 1,
    //             'description' => '-',
    //             'status' => '-',
    //         ],
    //         [
    //             'id' => 2,
    //             'description' => '-',
    //             'status' => '-',
    //         ],
    //         [
    //             'id' => 3,
    //             'description' => '-',
    //             'status' => '-',
    //         ],
    //         [
    //             'id' => 4,
    //             'description' => '-',
    //             'status' => '-',
    //         ],
    //     ],
    // ];


//     // Return data for the requested organization or empty array
//     return response()->json($data[$organization] ?? []);
// });

// ref: frontend\src\components\6.company-traction\companyTraction.jsx
Route::get('/api/v1/company-traction/annual-priorities', function (Request $request) use ($API_secure) {

    if ($API_secure) {
        if (!$request->session()->get('logged_in')) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }
        $user = $request->session()->get('user');
    }

    $organization = $request->query('organization');

    if (!$organization) {
        return response()->json(['message' => 'Missing organization parameter'], 400);
    }

    $record = CompanyTractionAnnualPriority::where('organizationName', $organization)->first();

    if (!$record) {
        return response()->json([]);
    }

    return response()->json($record->annualPrioritiesData ?? []);
});

// ref: frontend\src\components\6.company-traction\1.AnnualPriorities\AnnualPriorities.jsx
Route::post('/api/v1/company-traction/annual-priorities/update', function (Request $request) use ($API_secure) {

    if ($API_secure && !$request->session()->get('logged_in')) {
        return response()->json(['message' => 'Unauthorized'], 401);
    }

    $organization = $request->input('organizationName');
    $newData = $request->input('annualPrioritiesData', []); // Defaults to empty array if not provided

    $record = CompanyTractionAnnualPriority::where('organizationName', $organization)->first();

    if (!$record) {
        return response()->json(['message' => 'Record not found'], 404);
    }

    $record->annualPrioritiesData = $newData;
    $record->save();

    return response()->json([
        'message' => 'Annual priorities updated successfully',
        'data' => $record->annualPrioritiesData,
    ]);
});


// Route::post('/api/v1/company-traction/annual-priorities/update', function (Request $request) use ($API_secure) {

//     if ($API_secure) {
//         if (!$request->session()->get('logged_in')) {
//             return response()->json(['message' => 'Unauthorized'], 401);
//         }
//     }

//     $request->validate([
//         'organizationName' => 'required|string',
//         'annualPrioritiesData' => 'required|array',
//     ]);

//     $organization = $request->input('organizationName');
//     $newData = $request->input('annualPrioritiesData');

//     $record = CompanyTractionAnnualPriority::where('organizationName', $organization)->first();

//     if (!$record) {
//         return response()->json(['message' => 'Record not found'], 404);
//     }

//     $record->annualPrioritiesData = $newData;
//     $record->save();

//     return response()->json([
//         'message' => 'Annual priorities updated successfully',
//         'data' => $record->annualPrioritiesData,
//     ]);
// });

// ref: frontend\src\components\6.company-traction\1.AnnualPriorities\AnnualPriorities.jsx
Route::post('/api/v1/company-traction/annual-priorities/add', function (Request $request) use ($API_secure) {

    if ($API_secure) {
        if (!$request->session()->get('logged_in')) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }
    }

    $request->validate([
        'organizationName' => 'required|string',
        'newPriority' => 'required|array',
        'newPriority.description' => 'required|string',
        'newPriority.status' => 'required|string',
    ]);

    $organization = $request->input('organizationName');
    $newItem = $request->input('newPriority');

    $record = CompanyTractionAnnualPriority::where('organizationName', $organization)->first();

    if (!$record) {
        return response()->json(['message' => 'Record not found'], 404);
    }

    $currentData = $record->annualPrioritiesData ?? [];

    // Ensure it's an array
    if (!is_array($currentData)) {
        $currentData = [];
    }

    // Assign next ID
    $newId = count($currentData) + 1;
    $newItemWithId = array_merge($newItem, ['id' => $newId]);

    // Append the new item
    $updatedData = [...$currentData, $newItemWithId];

    // Save
    $record->annualPrioritiesData = $updatedData;
    $record->save();

    return response()->json([
        'status' => 'success',
        'message' => 'New annual priority added',
        'data' => $newItemWithId,
    ]);
});

// // ref: frontend\src\components\6.company-traction\companyTraction.jsx
// Route::get('/api/v1/company-traction/traction-data', function (Request $request) use ($API_secure) {
//     if ($API_secure) {
//         if (!$request->session()->get('logged_in')) {
//             return response()->json(['message' => 'Unauthorized'], 401);
//         }
//     }

//     $organization = $request->query('organization');

//     $mockData = [
//         'Chuck Gulledge Advisors, LLC' => [
//             'Q1' => [
//                 [
//                     'id' => 1,
//                     'who' => 'Maricar',
//                     'collaborator' => 'Maricar',
//                     'description' => 'Build landing page',
//                     'progress' => '5%',
//                     'annualPriority' => 'Develop lead generation systems',
//                     'dueDate' => '03-31-2025',
//                     'rank' => '1',
//                     'comment' => [
//                         [
//                             'author' => 'Maricar',
//                             'message' => 'This is a test comment.',
//                             'posted' => '26 June 2025',
//                         ],
//                         [
//                             'author' => 'John',
//                             'message' => 'Great work on this!',
//                             'posted' => '27 June 2025',
//                         ],
//                     ],
//                 ],
//             ],
//             'Q2' => [
//                 [
//                     'id' => 1,
//                     'who' => 'Maricar',
//                     'collaborator' => 'Maricar',
//                     'description' => 'Launch marketing campaign',
//                     'progress' => '0%',
//                     'annualPriority' => 'Develop lead generation systems',
//                     'dueDate' => 'Click to set date',
//                     'rank' => '2',
//                     'comment' => [
//                         [
//                             'author' => 'Maricar',
//                             'message' => 'This is a test comment.',
//                             'posted' => '26 June 2025',
//                         ],
//                     ],
//                 ],
//             ],
//             'Q3' => [],
//             'Q4' => [],
//         ],

//         'Collins Credit Union' => [
//             'Q1' => [
//                 [
//                     'id' => 1,
//                     'who' => 'Maricar',
//                     'collaborator' => 'Maricar',
//                     'description' => 'Build landing page',
//                     'progress' => '5%',
//                     'annualPriority' => 'Develop lead generation systems',
//                     'dueDate' => '03-31-2025',
//                     'rank' => '1',
//                     'comment' => [
//                         [
//                             'author' => 'Maricar',
//                             'message' => 'This is a test comment.',
//                             'posted' => '26 June 2025',
//                         ],
//                         [
//                             'author' => 'John',
//                             'message' => 'Great work on this!',
//                             'posted' => '27 June 2025',
//                         ],
//                     ],
//                 ],
//             ],
//             'Q2' => [
//                 [
//                     'id' => 1,
//                     'who' => 'Maricar',
//                     'collaborator' => 'Maricar',
//                     'description' => 'Launch marketing campaign',
//                     'progress' => '0%',
//                     'annualPriority' => 'Develop lead generation systems',
//                     'dueDate' => 'Click to set date',
//                     'rank' => '2',
//                     'comment' => [
//                         [
//                             'author' => 'Maricar',
//                             'message' => 'This is a test comment.',
//                             'posted' => '26 June 2025',
//                         ],
//                     ],
//                 ],

//                 [
//                     'id' => 2,
//                     'who' => 'Chuck',
//                     'collaborator' => 'Maricar',
//                     'description' => 'Launch marketing campaign',
//                     'progress' => '0%',
//                     'annualPriority' => 'Develop lead generation systems',
//                     'dueDate' => 'Click to set date',
//                     'rank' => '2',
//                     'comment' => [
//                         [
//                             'author' => 'Maricar',
//                             'message' => 'This is a test comment.',
//                             'posted' => '26 June 2025',
//                         ],
//                     ],
//                 ],
//             ],
//             'Q3' => [],
//             'Q4' => [],
//         ],
//         'Test Skeleton Loading' => [
//             'Q1' => [],
//             'Q2' => [],
//             'Q3' => [],
//             'Q4' => [],
//         ],
//     ];

//     return response()->json($mockData[$organization] ?? [
//         'Q1' => [],
//         'Q2' => [],
//         'Q3' => [],
//         'Q4' => [],
//     ]);
// });

// ref: frontend\src\components\6.company-traction\companyTraction.jsx
Route::get('/api/v1/company-traction/traction-data', function (Request $request) use ($API_secure) {
    if ($API_secure) {
        if (!$request->session()->get('logged_in')) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }
    }

    // ✅ Validate the input
    $validator = Validator::make($request->all(), [
        'organization' => 'required|string|max:255',
    ]);

    if ($validator->fails()) {
        return response()->json([
            'status' => 'error',
            'message' => 'Validation failed',
            'errors' => $validator->errors(),
        ], 422);
    }

    $organization = $request->query('organization');

    // 🔍 Find the record in DB
    $record = CompanyTractionCompanyTraction::where('organizationName', $organization)->first();

    // 📦 Return the data or empty structure if not found
    return response()->json($record->companyTractionData ?? [
        'Q1' => [],
        'Q2' => [],
        'Q3' => [],
        'Q4' => [],
    ]);
});

// ref: frontend\src\components\6.company-traction\2.CompanyTraction\CompanyTraction.jsx
Route::post('/api/v1/company-traction/traction-data/update', function (Request $request) use ($API_secure) {
    if ($API_secure && !$request->session()->get('logged_in')) {
        return response()->json(['message' => 'Unauthorized'], 401);
    }

    $organizationName = $request->input('organizationName');
    $companyTractionData = $request->input('companyTraction', []); // Default to empty array if not provided

    // Find the record by organizationName
    $record = CompanyTractionCompanyTraction::where('organizationName', $organizationName)->first();

    if (!$record) {
        return response()->json([
            'status' => 'error',
            'message' => "Organization '$organizationName' not found",
        ], 404);
    }

    // Update the companyTractionData column
    $record->companyTractionData = $companyTractionData;
    $record->save();

    return response()->json([
        'status' => 'success',
        'message' => 'Company Traction data updated successfully',
        'data' => $record,
    ]);
});


// Route::post('/api/v1/company-traction/traction-data/update', function (Request $request) use ($API_secure) {
//     if ($API_secure) {
//         if (!$request->session()->get('logged_in')) {
//             return response()->json(['message' => 'Unauthorized'], 401);
//         }
//     }

//     // Validate request inputs
//     $validator = Validator::make($request->all(), [
//         'organizationName' => 'required|string|max:255',
//         'companyTraction' => 'required|array', // expects JSON array/object
//     ]);

//     if ($validator->fails()) {
//         return response()->json([
//             'status' => 'error',
//             'message' => 'Validation failed',
//             'errors' => $validator->errors(),
//         ], 422);
//     }

//     $organizationName = $request->input('organizationName');
//     $companyTractionData = $request->input('companyTraction');

//     // Find the record by organizationName
//     $record = CompanyTractionCompanyTraction::where('organizationName', $organizationName)->first();

//     if (!$record) {
//         return response()->json([
//             'status' => 'error',
//             'message' => "Organization '$organizationName' not found",
//         ], 404);
//     }

//     // Update the companyTractionData column (store as JSON)
//     $record->companyTractionData = $companyTractionData;
//     $record->save();

//     return response()->json([
//         'status' => 'success',
//         'message' => 'Company Traction data updated successfully',
//         'data' => $record,
//     ]);
// });

// ref: frontend\src\components\6.company-traction\2.CompanyTraction\CompanyTraction.jsx
Route::post('/api/v1/company-traction/traction-data/add', function (Request $request) {
    // Validate request
    $validated = $request->validate([
        'organizationName' => 'required|string',
        'quarter' => 'required|string',
        'newItem' => 'required|array',
    ]);

    $organizationName = $validated['organizationName'];
    $quarter = $validated['quarter'];
    $newItem = $validated['newItem'];

    // Fetch record
    $record = CompanyTractionCompanyTraction::where('organizationName', $organizationName)->first();

    if (!$record) {
        return response()->json(['message' => 'Organization not found'], 404);
    }

    // Use existing array if already cast, or decode manually if not
    $tractionData = $record->companyTractionData ?? [];

    // Make sure the quarter key exists
    if (!isset($tractionData[$quarter]) || !is_array($tractionData[$quarter])) {
        $tractionData[$quarter] = [];
    }

    // Assign new unique ID
    $newItem['id'] = time(); // Or another server-generated ID
    $tractionData[$quarter][] = $newItem;

    // Save back to DB
    $record->companyTractionData = $tractionData;
    $record->save();

    return response()->json([
        'message' => 'New traction item added successfully',
        'data' => $newItem,
    ]);
});

// // ref: frontend\src\components\6.company-traction\companyTraction.jsx
//  Route::get('/api/v1/department-traction/traction-data', function (Request $request) use ($API_secure) {
//     if ($API_secure) {
//         if (!$request->session()->get('logged_in')) {
//             return response()->json(['message' => 'Unauthorized'], 401);
//         }
//     }

//     // ✅ Validate the request
//     $validator = Validator::make($request->all(), [
//         'organization' => 'required|string|max:255',
//     ]);

//     if ($validator->fails()) {
//         return response()->json([
//             'status' => 'error',
//             'message' => 'Validation failed',
//             'errors' => $validator->errors(),
//         ], 422);
//     }

//     $organization = $request->query('organization');

//     // ✅ Fetch record
//     $record = CompanyTractionCompanyTraction::where('organizationName', $organization)->first();

//     if (!$record) {
//         // Return empty structure if not found
//         return response()->json([
//             'Q1' => [],
//             'Q2' => [],
//             'Q3' => [],
//             'Q4' => [],
//         ]);
//     }

//     return response()->json($record->companyTractionData ?? [
//         'Q1' => [],
//         'Q2' => [],
//         'Q3' => [],
//         'Q4' => [],
//     ]);
// });

// // ref: 
// Route::post('/api/v1/department-traction/traction-data/update', function (Request $request) use ($API_secure) {
//     if ($API_secure) {
//         if (!$request->session()->get('logged_in')) {
//             return response()->json(['message' => 'Unauthorized'], 401);
//         }
//     }

//     $validator = Validator::make($request->all(), [
//         'organization' => 'required|string|max:255',
//         'companyTraction' => 'required|array',
//     ]);

//     if ($validator->fails()) {
//         return response()->json([
//             'status' => 'error',
//             'message' => 'Validation failed',
//             'errors' => $validator->errors(),
//         ], 422);
//     }

//     $organization = $request->input('organization');
//     $companyTractionData = $request->input('companyTraction');

//     $record = CompanyTractionCompanyTraction::where('organizationName', $organization)->first();

//     if (!$record) {
//         return response()->json([
//             'status' => 'error',
//             'message' => 'Organization not found.',
//         ], 404);
//     }

//     $record->companyTractionData = $companyTractionData;
//     $record->save();

//     return response()->json([
//         'status' => 'success',
//         'message' => 'Company traction data updated successfully.',
//     ]);
// });

// // ref: frontend\src\components\7.department-traction\departmentTraction.jsx
// Route::get('/api/v1/department-traction/annual-priorities', function (Request $request) use ($API_secure) {
//     if ($API_secure) {
//         if (!$request->session()->get('logged_in')) {
//             return response()->json(['message' => 'Unauthorized'], 401);
//         }
//     }

//     $organization = $request->query('organization');

//     $data = [
//         'Chuck Gulledge Advisors, LLC' => [
//             [
//                 'id' => 1,
//                 'description' => 'Department-level initiative to enhance coaching operations.',
//                 'status' => '90.00%',
//             ],
//             [
//                 'id' => 2,
//                 'description' => 'Optimize department communication strategies.',
//                 'status' => '75.00%',
//             ],
//         ],
//         'Collins Credit Union' => [
//             [
//                 'id' => 1,
//                 'description' => 'Improve internal training programs within departments.',
//                 'status' => '80.00%',
//             ],
//             [
//                 'id' => 2,
//                 'description' => 'Implement KPI dashboards for each department.',
//                 'status' => '70.00%',
//             ],
//         ],
//         'Test Skeleton Loading' => [
//             [
//                 'id' => 1,
//                 'description' => '-',
//                 'status' => '-',
//             ],
//             [
//                 'id' => 2,
//                 'description' => '-',
//                 'status' => '-',
//             ],
//         ],
//     ];

//     return response()->json($data[$organization] ?? []);
// });

// // ref:
// Route::post('/api/v1/company-traction/activity-logs', function (Request $request) use ($API_secure) {

//     if ($API_secure) {
//         if (!$request->session()->get('logged_in')) {
//             return response()->json(['message' => 'Unauthorized'], 401);
//         }
//     }

//     $organization = $request->input('organizationName');

//     if (!$organization) {
//         return response()->json(['message' => 'organizationName is required.'], 400);
//     }

//     $data = [

//         'Chuck Gulledge Advisors, LLC' => [
//             [
//                 'id' => 1,
//                 'author' => 'Maricar Aquino',
//                 'message' => 'Progress updated from % to 0% for Company Traction with description: Close target',
//                 'timestamp' => '2025-10-21T10:59:00',
//             ],
//             [
//                 'id' => 2,
//                 'author' => 'Nonyameko Hibbetts',
//                 'message' => 'Progress updated from 100% to 10% for Company Traction with description: 201 Evans Cnst',
//                 'timestamp' => '2025-10-20T14:00:00',
//             ],
//             [
//                 'id' => 3,
//                 'author' => 'Chuck Gulledge',
//                 'message' => 'Progress updated from % to 30% for Company Traction with description: Find the next project',
//                 'timestamp' => '2025-10-20T08:00:00',
//             ],
//             [
//                 'id' => 4,
//                 'author' => 'Chuck Gulledge',
//                 'message' => 'Company traction updated with description: Develop 2026 plan with Chuck and Team',
//                 'timestamp' => '2025-10-18T10:00:00',
//             ],
//             [
//                 'id' => 5,
//                 'author' => 'Nonyameko Hibbetts',
//                 'message' => 'Company traction created with description: Assist w/ Sale Closing Building E & O 2',
//                 'timestamp' => '2025-10-14T09:00:00',
//             ],
//         ],

//         'Collins Credit Union' => [
//             [
//                 'id' => 1,
//                 'author' => 'Chuck Gulledge',
//                 'message' => 'Started the Q3 financial review process.',
//                 'timestamp' => '2025-10-21T11:00:00',
//             ],
//         ],

//         'Test Skeleton Loading' => [],
//     ];

//     if (!isset($data[$organization])) {
//         return response()->json([
//             'organizationName' => $organization,
//             'activityLogs' => [],
//         ]);
//     }

//     return response()->json([
//         'organizationName' => $organization,
//         'activityLogs' => $data[$organization],
//     ]);
// });



// ref: frontend\src\components\6.company-traction\companyTraction.jsx
Route::post('/api/v1/company-traction/activity-logs', function (Request $request) use ($API_secure) {

    if ($API_secure) {
        if (!$request->session()->get('logged_in')) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }
    }

    $organization = $request->input('organizationName');

    if (!$organization) {
        return response()->json(['message' => 'organizationName is required.'], 400);
    }

    $record = CompanyTractionActivityLog::where('organizationName', $organization)->first();

    if (!$record) {
        return response()->json([
            'organizationName' => $organization,
            'activityLogs' => [],
        ]);
    }

    // No json_decode since it's already cast to array in the model
    return response()->json([
        'organizationName' => $organization,
        'activityLogs' => $record->companyTractionActivityLogsData ?? [],
    ]);
});

// ref: frontend\src\components\6.company-traction\2.CompanyTraction\CompanyTraction.jsx
Route::post('/api/v1/company-traction/activity-logs/update', function (Request $request) use ($API_secure) {
    if ($API_secure) {
        if (!$request->session()->get('logged_in')) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }
    }

    $organization = $request->input('organizationName');
    $activityLogs = $request->input('activityLogData');

    if (!$organization) {
        return response()->json(['message' => 'organizationName is required.'], 400);
    }

    if (!is_array($activityLogs)) {
        return response()->json(['message' => 'activityLogData must be an array.'], 400);
    }

    // ✅ Reorder IDs sequentially before saving
    $reordered = array_map(function ($item, $index) {
        $item['id'] = $index + 1;
        return $item;
    }, $activityLogs, array_keys($activityLogs));

    // ✅ Find or create record
    $record = CompanyTractionActivityLog::firstOrNew(['organizationName' => $organization]);
    $record->companyTractionActivityLogsData = $reordered;
    $record->statusFlag = $record->statusFlag ?? null;
    $record->save();

    return response()->json([
        'message' => '✅ Company Traction Activity Logs updated successfully',
        'organizationName' => $organization,
        'savedCount' => count($reordered),
    ]);
});

// // ref: frontend\src\components\6.company-traction\companyTraction.jsx
// Route::post('/api/v1/company-traction/switch-options', function (Request $request) use ($API_secure) {
//     if ($API_secure) {
//         if (!$request->session()->get('logged_in')) {
//             return response()->json(['message' => 'Unauthorized'], 401);
//         }
//     }

//     $organization = $request->input('organizationName');

//     if (!$organization) {
//         return response()->json(['message' => 'organizationName is required.'], 400);
//     }

//     $data = [
//         'Chuck Gulledge Advisors, LLC' => ['2023', '2024', '2025', '2026'],
//         'Collins Credit Union' => ['2024', '2025'],
//         'Test Skeleton Loading' => ['2025'],
//     ];

//     return response()->json($data[$organization] ?? []);
// });


// ref: frontend\src\components\6.company-traction\companyTraction.jsx
Route::post('/api/v1/company-traction/switch-options', function (Request $request) use ($API_secure) {
    if ($API_secure && !$request->session()->get('logged_in')) {
        return response()->json(['message' => 'Unauthorized'], 401);
    }

    $organization = $request->input('organizationName');

    if (!$organization) {
        return response()->json(['message' => 'organizationName is required.'], 400);
    }

    // Fetch all distinct tags for the given organization
    $tags = CompanyTractionAnnualPrioritiesCollection::where('organizationName', $organization)
        ->pluck('tag')
        ->filter() // remove nulls
        ->unique()
        ->values()
        ->all();

    return response()->json($tags);
});

// ref: 
Route::post('/api/v1/company-traction/switch-options/add', function (Request $request) use ($API_secure) {
    if ($API_secure && !$request->session()->get('logged_in')) {
        return response()->json(['message' => 'Unauthorized'], 401);
    }

    $organization = $request->input('organizationName');
    $trimmedOption = trim($request->input('tag'));

    if (!$organization || !$trimmedOption) {
        return response()->json(['message' => 'organizationName and tag are required.'], 400);
    }

    // Check if tag already exists for this organization
    $exists = CompanyTractionAnnualPrioritiesCollection::where('organizationName', $organization)
        ->where('tag', $trimmedOption)
        ->exists();

    if ($exists) {
        return response()->json(['message' => 'Tag already exists'], 409);
    }

    // Create new record
    $record = CompanyTractionAnnualPrioritiesCollection::create([
        'u_id' => Str::uuid(), // auto-generate unique ID
        'organizationName' => $organization,
        'tag' => $trimmedOption,
        'companyTractionData' => [], // empty array
        'statusFlag' => null,
    ]);

    return response()->json(['message' => 'Tag added successfully', 'record' => $record]);
});


// ref:
Route::post('/api/v1/company-traction/switch-options/delete', function (Request $request) use ($API_secure) {
    if ($API_secure && !$request->session()->get('logged_in')) {
        return response()->json(['message' => 'Unauthorized'], 401);
    }

    $organization = $request->input('organizationName');
    $tag = trim($request->input('tag'));

    if (!$organization || !$tag) {
        return response()->json(['message' => 'organizationName and tag are required.'], 400);
    }

    // Find the record
    $record = CompanyTractionAnnualPrioritiesCollection::where('organizationName', $organization)
        ->where('tag', $tag)
        ->first();

    if (!$record) {
        return response()->json(['message' => 'Tag not found'], 404);
    }

    $record->delete();

    return response()->json(['message' => 'Tag deleted successfully']);
});

// ref:
Route::post('/api/v1/company-traction/annual-priorities/copy', function (Request $request) use ($API_secure) {

    if ($API_secure && !$request->session()->get('logged_in')) {
        return response()->json(['message' => 'Unauthorized'], 401);
    }

    $organization = $request->input('organizationName');
    $tag = $request->input('tag');

    if (!$organization || !$tag) {
        return response()->json(['message' => 'organizationName and tag are required.'], 400);
    }

    // 🔍 Find source record from company_traction_annual_priorities_collection
    $source = CompanyTractionAnnualPrioritiesCollection::where('organizationName', $organization)
        ->where('tag', $tag)
        ->first();

    if (!$source) {
        return response()->json(['message' => 'No record found for the given tag and organization.'], 404);
    }

    // 🧠 Find destination record in company_traction_annual_priorities
    $destination = CompanyTractionAnnualPriority::where('organizationName', $organization)->first();

    if (!$destination) {
        return response()->json(['message' => 'Destination record not found for this organization.'], 404);
    }

    // 📝 Copy the data
    $destination->annualPrioritiesData = $source->companyTractionData ?? [];
    $destination->save();

    return response()->json([
        'message' => 'Data copied successfully.',
        'organizationName' => $organization,
        'tag' => $tag,
        'copiedData' => $destination->annualPrioritiesData,
    ]);
});






// ref: frontend\src\components\7.department-traction\departmentTraction.jsx
Route::get('/api/v1/department-traction/annual-priorities', function (Request $request) use ($API_secure) {
    if ($API_secure) {
        if (!$request->session()->get('logged_in')) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }
    }

    // ✅ Validate the input
    $validator = Validator::make($request->all(), [
        'organization' => 'required|string|max:255',
    ]);

    if ($validator->fails()) {
        return response()->json([
            'status' => 'error',
            'message' => 'Validation failed',
            'errors' => $validator->errors(),
        ], 422);
    }

    $organization = $request->query('organization');

    // 🔍 Find the record in DB
    $record = DepartmentTractionAnnualPriority::where('organizationName', $organization)->first();

    // 📦 Return the data or default empty array if not found or null
    return response()->json($record->annualPrioritiesData ?? []);
});

// ref: frontend\src\components\7.department-traction\2.DepartmentTraction\DepartmentTraction.jsx
Route::post('/api/v1/department-traction/annual-priorities/update', function (Request $request) use ($API_secure) {
    if ($API_secure && !$request->session()->get('logged_in')) {
        return response()->json(['message' => 'Unauthorized'], 401);
    }

    $organizationName = $request->input('organizationName');
    $annualPrioritiesData = $request->input('annualPrioritiesData', []); // Default to empty array

    // Find the record by organizationName
    $record = DepartmentTractionAnnualPriority::where('organizationName', $organizationName)->first();

    if (!$record) {
        return response()->json([
            'status' => 'error',
            'message' => "Organization '$organizationName' not found",
        ], 404);
    }

    // Update the annualPrioritiesData column
    $record->annualPrioritiesData = $annualPrioritiesData;
    $record->save();

    return response()->json([
        'status' => 'success',
        'message' => 'Annual Priorities data updated successfully',
        'data' => $record,
    ]);
});


// Route::post('/api/v1/department-traction/annual-priorities/update', function (Request $request) use ($API_secure) {
//     if ($API_secure) {
//         if (!$request->session()->get('logged_in')) {
//             return response()->json(['message' => 'Unauthorized'], 401);
//         }
//     }

//     // Validate request inputs
//     $validator = Validator::make($request->all(), [
//         'organizationName' => 'required|string|max:255',
//         'annualPrioritiesData' => 'required|array', // expects JSON array
//     ]);

//     if ($validator->fails()) {
//         return response()->json([
//             'status' => 'error',
//             'message' => 'Validation failed',
//             'errors' => $validator->errors(),
//         ], 422);
//     }

//     $organizationName = $request->input('organizationName');
//     $annualPrioritiesData = $request->input('annualPrioritiesData');

//     // Find the record by organizationName
//     $record = DepartmentTractionAnnualPriority::where('organizationName', $organizationName)->first();

//     if (!$record) {
//         return response()->json([
//             'status' => 'error',
//             'message' => "Organization '$organizationName' not found",
//         ], 404);
//     }

//     // Update the annualPrioritiesData column (store as JSON)
//     $record->annualPrioritiesData = $annualPrioritiesData;
//     $record->save();

//     return response()->json([
//         'status' => 'success',
//         'message' => 'Annual Priorities data updated successfully',
//         'data' => $record,
//     ]);
// });

// ref: frontend\src\components\7.department-traction\2.DepartmentTraction\DepartmentTraction.jsx
Route::post('/api/v1/department-traction/annual-priorities/add', function (Request $request) use ($API_secure) {

    if ($API_secure) {
        if (!$request->session()->get('logged_in')) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }
    }

    $request->validate([
        'organizationName' => 'required|string',
        'newAnnualPriority' => 'required|array',
        'newAnnualPriority.description' => 'required|string',
        'newAnnualPriority.status' => 'required|string',
    ]);

    $organization = $request->input('organizationName');
    $newItem = $request->input('newAnnualPriority');

    // Find the record
    $record = DepartmentTractionAnnualPriority::where('organizationName', $organization)->first();

    if (!$record) {
        return response()->json([
            'status' => 'error',
            'message' => 'Record not found for organization',
        ], 404);
    }

    // Get existing priorities
    $currentData = $record->annualPrioritiesData;

    // If it's stored as JSON string, decode
    if (is_string($currentData)) {
        $currentData = json_decode($currentData, true);
    }

    // Fallback to array if null or invalid
    if (!is_array($currentData)) {
        $currentData = [];
    }

    // Get next ID
    $newId = collect($currentData)->pluck('id')->max();
    $newId = $newId ? $newId + 1 : 1;

    $newItemWithId = array_merge($newItem, ['id' => $newId]);

    // Append
    $updatedData = [...$currentData, $newItemWithId];

    // Save
    $record->annualPrioritiesData = $updatedData;
    $record->save();

    return response()->json([
        'status' => 'success',
        'message' => 'New department annual priority added',
        'data' => $newItemWithId,
    ]);
});

// ref: frontend\src\components\7.department-traction\departmentTraction.jsx
Route::get('/api/v1/department-traction/traction-data', function (Request $request) use ($API_secure) {
    if ($API_secure) {
        if (!$request->session()->get('logged_in')) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }
    }

    // ✅ Validate the input
    $validator = Validator::make($request->all(), [
        'organization' => 'required|string|max:255',
    ]);

    if ($validator->fails()) {
        return response()->json([
            'status' => 'error',
            'message' => 'Validation failed',
            'errors' => $validator->errors(),
        ], 422);
    }

    $organization = $request->query('organization');

    // 🔍 Find the record in DB
    $record = DepartmentTractionCompanyTraction::where('organizationName', $organization)->first();

    // 📦 Return the data or empty structure if not found
    return response()->json($record->companyTractionData ?? [
        'Q1' => [],
        'Q2' => [],
        'Q3' => [],
        'Q4' => [],
    ]);
});

// ref: frontend\src\components\7.department-traction\2.DepartmentTraction\DepartmentTraction.jsx
Route::post('/api/v1/department-traction/traction-data/update', function (Request $request) use ($API_secure) {
    if ($API_secure && !$request->session()->get('logged_in')) {
        return response()->json(['message' => 'Unauthorized'], 401);
    }

    $orgName = $request->input('organizationName');
    $tractionData = $request->input('departmentTractionData', []); // Default to empty array

    $record = DepartmentTractionCompanyTraction::where('organizationName', $orgName)->first();

    if (!$record) {
        return response()->json([
            'status' => 'error',
            'message' => "Organization '$orgName' not found",
        ], 404);
    }

    $record->companyTractionData = $tractionData;
    $record->save();

    return response()->json([
        'status' => 'success',
        'message' => 'Company traction data updated successfully',
        'data' => $record,
    ]);
});


// Route::post('/api/v1/department-traction/traction-data/update', function (Request $request) use ($API_secure) {
//     if ($API_secure) {
//         if (!$request->session()->get('logged_in')) {
//             return response()->json(['message' => 'Unauthorized'], 401);
//         }
//     }

//     $validated = $request->validate([
//         'organizationName' => 'required|string|max:255',
//         'departmentTractionData' => 'required|array',
//     ]);

//     $orgName = $validated['organizationName'];
//     $tractionData = $validated['departmentTractionData'];

//     $record = DepartmentTractionCompanyTraction::where('organizationName', $orgName)->first();

//     if (!$record) {
//         return response()->json([
//             'status' => 'error',
//             'message' => "Organization '$orgName' not found",
//         ], 404);
//     }

//     $record->companyTractionData = $tractionData;
//     $record->save();

//     return response()->json([
//         'status' => 'success',
//         'message' => 'Company traction data updated successfully',
//         'data' => $record,
//     ]);
// });

// ref: frontend\src\components\7.department-traction\2.DepartmentTraction\DepartmentTraction.jsx
Route::post('/api/v1/department-traction/traction-data/add', function (Request $request) {
    // Validate request
    $validated = $request->validate([
        'organizationName' => 'required|string',
        'quarter' => 'required|string|in:Q1,Q2,Q3,Q4',
        'newItem' => 'required|array',
    ]);

    $organizationName = $validated['organizationName'];
    $quarter = $validated['quarter'];
    $newItem = $validated['newItem'];

    // Fetch record by organizationName
    $record = DepartmentTractionCompanyTraction::where('organizationName', $organizationName)->first();

    if (!$record) {
        return response()->json([
            'message' => 'Organization not found',
        ], 404);
    }

    // Get existing companyTractionData (cast to array via model or decode manually)
    $tractionData = $record->companyTractionData ?? [];

    // Ensure it's an array
    if (!is_array($tractionData)) {
        $tractionData = ['Q1' => [], 'Q2' => [], 'Q3' => [], 'Q4' => []];
    }

    // Make sure the quarter key exists and is an array
    if (!isset($tractionData[$quarter]) || !is_array($tractionData[$quarter])) {
        $tractionData[$quarter] = [];
    }

    // Assign a new ID (using time or max ID + 1)
    $allItems = collect($tractionData)->flatten(1);
    $maxId = $allItems->max('id') ?? 0;
    $newItem['id'] = $maxId + 1;

    // Append the new item
    $tractionData[$quarter][] = $newItem;

    // Save back to DB
    $record->companyTractionData = $tractionData;
    $record->save();

    return response()->json([
        'message' => 'New traction item added successfully',
        'data' => $newItem,
    ]);
});


// ref: frontend\src\components\7.department-traction\departmentTraction.jsx
Route::post('/api/v1/department-traction/activity-logs', function (Request $request) use ($API_secure) {

    if ($API_secure) {
        if (!$request->session()->get('logged_in')) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }
    }

    $organization = $request->input('organizationName');

    if (!$organization) {
        return response()->json(['message' => 'organizationName is required.'], 400);
    }

    $record = DepartmentTractionActivityLog::where('organizationName', $organization)->first();

    if (!$record) {
        return response()->json([
            'organizationName' => $organization,
            'activityLogs' => [],
        ]);
    }

    // No json_decode needed — cast to array in model
    return response()->json([
        'organizationName' => $organization,
        'activityLogs' => $record->departmentTractionActivityLogsData ?? [],
    ]);
});

// ref: frontend\src\components\7.department-traction\2.DepartmentTraction\DepartmentTraction.jsx
Route::post('/api/v1/department-traction/activity-logs/update', function (Request $request) use ($API_secure) {
    if ($API_secure) {
        if (!$request->session()->get('logged_in')) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }
    }

    $organization = $request->input('organizationName');
    $activityLogs = $request->input('activityLogData');

    if (!$organization) {
        return response()->json(['message' => 'organizationName is required.'], 400);
    }

    if (!is_array($activityLogs)) {
        return response()->json(['message' => 'activityLogData must be an array.'], 400);
    }

    // ✅ Reorder IDs sequentially before saving
    $reordered = array_map(function ($item, $index) {
        $item['id'] = $index + 1;
        return $item;
    }, $activityLogs, array_keys($activityLogs));

    // ✅ Find or create the record
    $record = DepartmentTractionActivityLog::firstOrNew(['organizationName' => $organization]);
    $record->departmentTractionActivityLogsData = $reordered;
    $record->statusFlag = $record->statusFlag ?? null;
    $record->save();

    return response()->json([
        'message' => '✅ Department Traction Activity Logs updated successfully',
        'organizationName' => $organization,
        'savedCount' => count($reordered),
    ]);
});

// // ref:
// Route::post('/api/v1/department-traction/switch-options', function (Request $request) use ($API_secure) {
//     if ($API_secure) {
//         if (!$request->session()->get('logged_in')) {
//             return response()->json(['message' => 'Unauthorized'], 401);
//         }
//     }

//     $organization = $request->input('organizationName');

//     if (!$organization) {
//         return response()->json(['message' => 'organizationName is required.'], 400);
//     }

//     $data = [
//         'Chuck Gulledge Advisors, LLC' => ['2023', '2024', '2025', '2026'],
//         'Collins Credit Union' => ['2024', '2025'],
//         'Test Skeleton Loading' => ['2025'],
//     ];

//     return response()->json($data[$organization] ?? []);
// });



// ref: frontend\src\components\7.department-traction\departmentTraction.jsx
Route::post('/api/v1/department-traction/switch-options', function (Request $request) use ($API_secure) {
    if ($API_secure && !$request->session()->get('logged_in')) {
        return response()->json(['message' => 'Unauthorized'], 401);
    }

    $organization = $request->input('organizationName');

    if (!$organization) {
        return response()->json(['message' => 'organizationName is required.'], 400);
    }

    // Fetch all distinct tags for the given organization
    $tags = DepartmentTractionAnnualPrioritiesCollection::where('organizationName', $organization)
        ->pluck('tag')
        ->filter() // remove nulls
        ->unique()
        ->values()
        ->all();

    return response()->json($tags);
});


//ref: 
Route::post('/api/v1/department-traction/switch-options/add', function (Request $request) use ($API_secure) {
    if ($API_secure && !$request->session()->get('logged_in')) {
        return response()->json(['message' => 'Unauthorized'], 401);
    }

    $organization = $request->input('organizationName');
    $trimmedOption = trim($request->input('tag'));

    if (!$organization || !$trimmedOption) {
        return response()->json(['message' => 'organizationName and tag are required.'], 400);
    }

    // Check if tag already exists for this organization
    $exists = DepartmentTractionAnnualPrioritiesCollection::where('organizationName', $organization)
        ->where('tag', $trimmedOption)
        ->exists();

    if ($exists) {
        return response()->json(['message' => 'Tag already exists'], 409);
    }

    // Create new record
    $record = DepartmentTractionAnnualPrioritiesCollection::create([
        'u_id' => Str::uuid(), // auto-generate unique ID
        'organizationName' => $organization,
        'tag' => $trimmedOption,
        'departmentTractionData' => [], // empty array
        'statusFlag' => null,
    ]);

    return response()->json(['message' => 'Tag added successfully', 'record' => $record]);
});

// ref: 
Route::post('/api/v1/department-traction/switch-options/delete', function (Request $request) use ($API_secure) {
    if ($API_secure && !$request->session()->get('logged_in')) {
        return response()->json(['message' => 'Unauthorized'], 401);
    }

    $organization = $request->input('organizationName');
    $tag = trim($request->input('tag'));

    if (!$organization || !$tag) {
        return response()->json(['message' => 'organizationName and tag are required.'], 400);
    }

    // Find the record
    $record = DepartmentTractionAnnualPrioritiesCollection::where('organizationName', $organization)
        ->where('tag', $tag)
        ->first();

    if (!$record) {
        return response()->json(['message' => 'Tag not found'], 404);
    }

    $record->delete();

    return response()->json(['message' => 'Tag deleted successfully']);
});


// // ref: frontend\src\components\7.department-traction\departmentTraction.jsx
// Route::get('/api/v1/department-traction/traction-data', function (Request $request) use ($API_secure) {
//     if ($API_secure) {
//         if (!$request->session()->get('logged_in')) {
//             return response()->json(['message' => 'Unauthorized'], 401);
//         }
//     }

//     $organization = $request->query('organization');

//     $mockData = [
//         'Chuck Gulledge Advisors, LLC' => [
//             'Q1' => [
//                 [
//                     'id' => 1,
//                     'who' => 'Maricar',
//                     'collaborator' => 'Maricar',
//                     'description' => 'Build landing page',
//                     'progress' => '5%',
//                     'annualPriority' => 'Develop lead generation systems',
//                     'dueDate' => '03-31-2025',
//                     'rank' => '1',
//                     'comment' => [
//                         [
//                             'author' => 'Maricar',
//                             'message' => 'This is a test comment.',
//                             'posted' => '26 June 2025',
//                         ],
//                         [
//                             'author' => 'John',
//                             'message' => 'Great work on this!',
//                             'posted' => '27 June 2025',
//                         ],
//                     ],
//                 ],
//             ],
//             'Q2' => [
//                 [
//                     'id' => 1,
//                     'who' => 'Maricar',
//                     'collaborator' => 'Maricar',
//                     'description' => 'Launch marketing campaign',
//                     'progress' => '0%',
//                     'annualPriority' => 'Develop lead generation systems',
//                     'dueDate' => 'Click to set date',
//                     'rank' => '2',
//                     'comment' => [
//                         [
//                             'author' => 'Maricar',
//                             'message' => 'This is a test comment.',
//                             'posted' => '26 June 2025',
//                         ],
//                     ],
//                 ],
//             ],
//             'Q3' => [],
//             'Q4' => [],
//         ],

//         'Collins Credit Union' => [
//             'Q1' => [
//                 [
//                     'id' => 1,
//                     'who' => 'Maricar',
//                     'collaborator' => 'Maricar',
//                     'description' => 'Build landing page',
//                     'progress' => '5%',
//                     'annualPriority' => 'Develop lead generation systems',
//                     'dueDate' => '03-31-2025',
//                     'rank' => '1',
//                     'comment' => [
//                         [
//                             'author' => 'Maricar',
//                             'message' => 'This is a test comment.',
//                             'posted' => '26 June 2025',
//                         ],
//                         [
//                             'author' => 'John',
//                             'message' => 'Great work on this!',
//                             'posted' => '27 June 2025',
//                         ],
//                     ],
//                 ],
//             ],
//             'Q2' => [
//                 [
//                     'id' => 1,
//                     'who' => 'Maricar',
//                     'collaborator' => 'Maricar',
//                     'description' => 'Launch marketing campaign',
//                     'progress' => '0%',
//                     'annualPriority' => 'Develop lead generation systems',
//                     'dueDate' => 'Click to set date',
//                     'rank' => '2',
//                     'comment' => [
//                         [
//                             'author' => 'Maricar',
//                             'message' => 'This is a test comment.',
//                             'posted' => '26 June 2025',
//                         ],
//                     ],
//                 ],

//                 [
//                     'id' => 2,
//                     'who' => 'Chuck',
//                     'collaborator' => 'Maricar',
//                     'description' => 'Launch marketing campaign',
//                     'progress' => '0%',
//                     'annualPriority' => 'Develop lead generation systems',
//                     'dueDate' => 'Click to set date',
//                     'rank' => '2',
//                     'comment' => [
//                         [
//                             'author' => 'Maricar',
//                             'message' => 'This is a test comment.',
//                             'posted' => '26 June 2025',
//                         ],
//                     ],
//                 ],
//             ],
//             'Q3' => [],
//             'Q4' => [],
//         ],
//         'Test Skeleton Loading' => [
//             'Q1' => [],
//             'Q2' => [],
//             'Q3' => [],
//             'Q4' => [],
//         ],
//     ];

//     return response()->json($mockData[$organization] ?? [
//         'Q1' => [],
//         'Q2' => [],
//         'Q3' => [],
//         'Q4' => [],
//     ]);
// });

//
    // // ref: frontend\src\components\8.who-what-when\whoWhatWhen.jsx
    // Route::get('/api/v1/who-what-when', function (Request $request) use ($API_secure) {
    //     if ($API_secure) {
    //         if (!$request->session()->get('logged_in')) {
    //             return response()->json(['message' => 'Unauthorized'], 401);
    //         }
    //         $user = $request->session()->get('user');
    //     }
    //     $organization = $request->query('organization');
    //     $data = [
    //         'Chuck Gulledge Advisors, LLC' => [
    //             [
    //                 'id' => 1,
    //                 'date' => '2025-03-31',
    //                 'who' => 'Maricar',
    //                 'what' => 'Systematize Coaching Framework (now called Momentum OS).',
    //                 'deadline' => '2025-03-31',
    //                 'comments' => 'approved',
    //                 'status' => '100.00%',
    //             ],
    //             [
    //                 'id' => 2,
    //                 'date' => '2025-04-01',
    //                 'who' => 'Chuck',
    //                 'what' => 'Systematize Client Delivery.',
    //                 'deadline' => '2025-03-31',
    //                 'comments' => 'working',
    //                 'status' => '83.33%',
    //             ],
    //             [
    //                 'id' => 3,
    //                 'date' => '2025-04-02',
    //                 'who' => 'Kayven',
    //                 'what' => 'Develop online Portal for Clients with Beta completed with eDoc by March 31 (now called Momentum Hub).',
    //                 'deadline' => '2025-03-31',
    //                 'comments' => 'pending',
    //                 'status' => '0.00%',
    //             ],
    //             [
    //                 'id' => 4,
    //                 'date' => '2025-04-02',
    //                 'who' => 'John',
    //                 'what' => 'Develop lead generation systems.',
    //                 'deadline' => '2025-03-31',
    //                 'comments' => 'paused',
    //                 'status' => '50.00%',
    //             ],
    //             [
    //                 'id' => 5,
    //                 'date' => '2025-04-02',
    //                 'who' => 'Grace',
    //                 'what' => '1% Genius Version 3 Development.',
    //                 'deadline' => '2025-03-31',
    //                 'comments' => 'waiting',
    //                 'status' => '50.00%',
    //             ],
    //         ],
        
    //         'Collins Credit Union' => [
    //             [
    //                 'id' => 1,
    //                 'date' => '2025-03-31',
    //                 'who' => 'Alice',
    //                 'what' => 'Building an exceptional customer experience through tailored solutions and responsive service.',
    //                 'deadline' => '2025-06-30',
    //                 'comments' => 'progressing',
    //                 'status' => '85.00%',
    //             ],
    //             [
    //                 'id' => 2,
    //                 'date' => '2025-04-15',
    //                 'who' => 'Bob',
    //                 'what' => 'Streamline operations and reduce costs while maintaining quality.',
    //                 'deadline' => '2025-09-30',
    //                 'comments' => 'on schedule',
    //                 'status' => '90.00%',
    //             ],
    //             [
    //                 'id' => 3,
    //                 'date' => '2025-05-01',
    //                 'who' => 'Charlie',
    //                 'what' => 'Implement new technologies to drive efficiency and innovation.',
    //                 'deadline' => '2025-12-31',
    //                 'comments' => 'planning phase',
    //                 'status' => '60.00%',
    //             ],
    //             [
    //                 'id' => 4,
    //                 'date' => '2025-06-01',
    //                 'who' => 'Diana',
    //                 'what' => 'Entering new markets and increasing market share.',
    //                 'deadline' => '2025-11-30',
    //                 'comments' => 'needs review',
    //                 'status' => '50.00%',
    //             ],
    //         ],
        
    //         'Test Skeleton Loading' => [
    //             [
    //                 'id' => 1,
    //                 'date' => '-',
    //                 'who' => '-',
    //                 'what' => '-',
    //                 'deadline' => '-',
    //                 'comments' => '-',
    //                 'status' => '-',
    //             ],
    //             [
    //                 'id' => 2,
    //                 'date' => '-',
    //                 'who' => '-',
    //                 'what' => '-',
    //                 'deadline' => '-',
    //                 'comments' => '-',
    //                 'status' => '-',
    //             ],
    //             [
    //                 'id' => 3,
    //                 'date' => '-',
    //                 'who' => '-',
    //                 'what' => '-',
    //                 'deadline' => '-',
    //                 'comments' => '-',
    //                 'status' => '-',
    //             ],
    //             [
    //                 'id' => 4,
    //                 'date' => '-',
    //                 'who' => '-',
    //                 'what' => '-',
    //                 'deadline' => '-',
    //                 'comments' => '-',
    //                 'status' => '-',
    //             ],
    //             [
    //                 'id' => 5,
    //                 'date' => '-',
    //                 'who' => '-',
    //                 'what' => '-',
    //                 'deadline' => '-',
    //                 'comments' => '-',
    //                 'status' => '-',
    //             ],
    //         ],
    //     ];
    

//     return response()->json($data[$organization] ?? []);
// });

// ref: frontend\src\components\7A.thirteen-week-sprint\ThirteenWeekSprint.jsx
Route::get('/api/v1/thirteen-week-sprint', function (Request $request) use ($API_secure) {
    if ($API_secure) {
        if (!$request->session()->get('logged_in')) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }
    }

    $organization = $request->query('organization');

    if (!$organization) {
        return response()->json(['message' => 'Organization is required'], 400);
    }

    $record = ThirteenWeekSprint::where('organizationName', $organization)->first();

    if (!$record) {
        return response()->json(['message' => 'No data found for this organization'], 404);
    }

    // Assuming your model casts thirteenWeekSprintData to array already
    return response()->json($record->thirteenWeekSprintData ?? []);
});

// ref: frontend\src\components\7A.thirteen-week-sprint\1.WeeklySprintTracker\WeeklySprintTracker.jsx
Route::post('/api/v1/thirteen-week-sprint/update', function (Request $request) use ($API_secure) {
    if ($API_secure && !$request->session()->get('logged_in')) {
        return response()->json(['message' => 'Unauthorized'], 401);
    }

    $organization = $request->input('organization');
    $data = $request->input('thirteenWeekSprintData', []); // Default to empty array if missing

    $record = ThirteenWeekSprint::where('organizationName', $organization)->first();

    if (!$record) {
        return response()->json(['message' => 'No record found for this organization'], 404);
    }

    $record->thirteenWeekSprintData = $data;
    $record->save();

    return response()->json(['message' => 'ThirteenWeekSprintData updated successfully']);
});


// Route::post('/api/v1/thirteen-week-sprint/update', function (Request $request) use ($API_secure) {
//     if ($API_secure) {
//         if (!$request->session()->get('logged_in')) {
//             return response()->json(['message' => 'Unauthorized'], 401);
//         }
//     }

//     $organization = $request->input('organization');
//     $data = $request->input('thirteenWeekSprintData');

//     if (!$organization || !$data) {
//         return response()->json(['message' => 'Organization and data are required'], 400);
//     }

//     $record = ThirteenWeekSprint::where('organizationName', $organization)->first();

//     if (!$record) {
//         return response()->json(['message' => 'No record found for this organization'], 404);
//     }

//     // Save the updated weekly sprint data
//     $record->thirteenWeekSprintData = $data;
//     $record->save();

//     return response()->json(['message' => 'ThirteenWeekSprintData updated successfully']);
// });

// ref: frontend\src\components\8.who-what-when\whoWhatWhen.jsx
Route::get('/api/v1/who-what-when', function (Request $request) use ($API_secure) {
    if ($API_secure) {
        if (!$request->session()->get('logged_in')) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }
    }

    $organization = $request->query('organization');

    if (!$organization) {
        return response()->json(['message' => 'Organization is required'], 400);
    }

    $record = WhoWhatWhen::where('organizationName', $organization)->first();

    if (!$record) {
        return response()->json(['message' => 'No data found for this organization'], 404);
    }

    return response()->json($record->whoWhatWhenData ?? []);
});

// ref: frontend\src\components\8.who-what-when\1.WhoWhatWhenTable\WhoWhatWhenTable.jsx
Route::post('/api/v1/who-what-when/update', function (Request $request) use ($API_secure) {
    if ($API_secure) {
        if (!$request->session()->get('logged_in')) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }
    }

    $organization = $request->input('organization');
    $newData = $request->input('whoWhatWhenData');

    $record = WhoWhatWhen::where('organizationName', $organization)->first();

    if (!$record) {
        return response()->json(['message' => 'No record found for this organization'], 404);
    }

    $record->whoWhatWhenData = $newData;
    $record->save();

    return response()->json(['message' => 'Who-What-When data updated successfully']);
});

// ref: frontend\src\components\8.who-what-when\1.WhoWhatWhenTable\WhoWhatWhenTable.jsx
Route::post('/api/v1/who-what-when/add', function (Request $request) use ($API_secure) {
    if ($API_secure) {
        if (!$request->session()->get('logged_in')) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }
    }

    $organization = $request->input('organization');
    $newItem = $request->input('newWhoWhatWhen');

    if (!$organization || !$newItem) {
        return response()->json(['message' => 'Organization and newWhoWhatWhen are required'], 400);
    }

    $record = WhoWhatWhen::where('organizationName', $organization)->first();

    if (!$record) {
        return response()->json(['message' => 'No record found for this organization'], 404);
    }

    $currentData = $record->whoWhatWhenData ?? [];

    // Determine next ID (max existing id + 1)
    $nextId = 1;
    if (!empty($currentData)) {
        $ids = array_column($currentData, 'id');
        $nextId = max($ids) + 1;
    }

    // Assign new ID to the incoming item
    $newItem['id'] = $nextId;

    // Append new item
    $currentData[] = $newItem;

    // Save back to DB
    $record->whoWhatWhenData = $currentData;
    $record->save();

    return response()->json([
        'message' => 'New Who-What-When item added successfully',
        'newItem' => $newItem,
    ]);
});

// ref: frontend\src\components\9.session-dates\sessionDates.jsx
// Route::get('/api/v1/session-dates/monthly-sessions-tracker', function (Request $request) use ($API_secure) {
//     if ($API_secure) {
//         if (!$request->session()->get('logged_in')) {
//             return response()->json(['message' => 'Unauthorized'], 401);
//         }
//         $user = $request->session()->get('user');
//     }

//     $organization = $request->query('organization');

//     $data = [
//         'Chuck Gulledge Advisors, LLC' => [
//             ['date' => '2025-07-01', 'status' => 'done', 'details' => 'Strategy alignment'],
//             ['date' => '2025-07-15', 'status' => 'pending', 'details' => 'KPI review'],
//             ['date' => '2025-07-25', 'status' => 'new', 'details' => 'Planning'],
//             ['date' => '2025-08-05', 'status' => 'pending', 'details' => 'Forecasting'],
//         ],
//         'Collins Credit Union' => [
//             ['date' => '2025-07-03', 'status' => 'done', 'details' => 'Budget review'],
//             ['date' => '2025-07-18', 'status' => 'pending', 'details' => 'Risk assessment'],
//             ['date' => '2025-07-28', 'status' => 'new', 'details' => 'Team training'],
//             ['date' => '2025-08-07', 'status' => 'pending', 'details' => 'Customer feedback'],
//         ],
//         'Test Skeleton Loading' => [
//             ['date' => '-', 'status' => '-', 'details' => '-'],
//             ['date' => '-', 'status' => '-', 'details' => '-'],
//             ['date' => '-', 'status' => '-', 'details' => '-'],
//             ['date' => '-', 'status' => '-', 'details' => '-'],
//         ],
//     ];

//     return response()->json([
//         $organization => $data[$organization] ?? [],
//     ]);
// });

// // ref: 
// Route::get('/api/v1/session-dates/monthly-sessions-tracker', function (Request $request) use ($API_secure) {
//     if ($API_secure) {
//         if (!$request->session()->get('logged_in')) {
//             return response()->json(['message' => 'Unauthorized'], 401);
//         }
//     }

//     $organization = $request->query('organization');

//     if (!$organization) {
//         return response()->json(['message' => 'Organization is required'], 400);
//     }

//     $record = SessionDatesMonthlySessionsTracker::where('organizationName', $organization)->first();

//     return response()->json([
//         $organization => $record->sessionDatesMonthlySessionsTrackerData ?? [],
//     ]);
// });


Route::get('/api/v1/session-dates/monthly-sessions-tracker', function (Request $request) use ($API_secure) {
    if ($API_secure) {
        if (!$request->session()->get('logged_in')) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }
    }

    $organization = $request->query('organization');

    if (!$organization) {
        return response()->json(['message' => 'Organization is required'], 400);
    }

    $record = SessionDatesMonthlySessions::where('organizationName', $organization)->first();

    if (!$record) {
        return response()->json([$organization => []]);
    }

    $rawData = $record->sessionDatesMonthlySessionsData ?? [];

    // Transform the data to match tracker format
    $trackerData = collect($rawData)->map(function ($item) {
        return [
            'date' => $item['meetingDate'] ?? '-',
            'status' => $item['status'] ?? '-',
            'details' => $item['agenda']['name'] ?? '-',
        ];
    });

    return response()->json([
        $organization => $trackerData,
    ]);
});

// // ref: frontend\src\components\9.session-dates\sessionDates.jsx
// Route::get('/api/v1/session-dates/quarterly-sessions', function (Request $request) use ($API_secure) {
//     if ($API_secure) {
//         if (!$request->session()->get('logged_in')) {
//             return response()->json(['message' => 'Unauthorized'], 401);
//         }

//         $user = $request->session()->get('user');
//     }

//     $organization = $request->query('organization');

//     $data = [
//         'Chuck Gulledge Advisors, LLC' => [
//             [
//                 'status' => 'Completed',
//                 'quarter' => 'Q1 2025',
//                 'meetingDate' => 'January 20, 2025',
//                 'agenda' => 'Strategic Planning & KPIs',
//                 'recap' => 'Shared Q1 goals and budget updates',
//             ],
//             [
//                 'status' => 'Scheduled',
//                 'quarter' => 'Q2 2025',
//                 'meetingDate' => 'April 22, 2025',
//                 'agenda' => 'Customer Retention Plans',
//                 'recap' => 'To be added after session',
//             ],
//             [
//                 'status' => 'Pending',
//                 'quarter' => 'Q3 2025',
//                 'meetingDate' => 'July 15, 2025',
//                 'agenda' => 'New Product Launch Discussion',
//                 'recap' => 'To be added',
//             ],
//             [
//                 'status' => 'Upcoming',
//                 'quarter' => 'Q4 2025',
//                 'meetingDate' => 'October 17, 2025',
//                 'agenda' => 'Annual Review & Strategy 2026',
//                 'recap' => 'To be added',
//             ],
//         ],
//         'Collins Credit Union' => [
//             [
//                 'status' => 'Completed',
//                 'quarter' => 'Q1 2024',
//                 'meetingDate' => 'January 15, 2024',
//                 'agenda' => 'Budget Review',
//                 'recap' => 'Reviewed last year’s budget and set targets',
//             ],
//             [
//                 'status' => 'Scheduled',
//                 'quarter' => 'Q2 2024',
//                 'meetingDate' => 'April 20, 2024',
//                 'agenda' => 'Marketing Strategy',
//                 'recap' => 'Plan for Q2 marketing initiatives',
//             ],
//             [
//                 'status' => 'Pending',
//                 'quarter' => 'Q3 2024',
//                 'meetingDate' => 'July 18, 2024',
//                 'agenda' => 'Product Development Update',
//                 'recap' => 'To be added',
//             ],
//             [
//                 'status' => 'Upcoming',
//                 'quarter' => 'Q4 2024',
//                 'meetingDate' => 'October 22, 2024',
//                 'agenda' => 'Year-End Review',
//                 'recap' => 'To be added',
//             ],
//         ],
//         'Test Skeleton Loading' => [
//             [
//                 'status' => '-',
//                 'quarter' => '-',
//                 'meetingDate' => '-',
//                 'agenda' => '-',
//                 'recap' => '-',
//             ],
//             [
//                 'status' => '-',
//                 'quarter' => '-',
//                 'meetingDate' => '-',
//                 'agenda' => '-',
//                 'recap' => '-',
//             ],
//             [
//                 'status' => '-',
//                 'quarter' => '-',
//                 'meetingDate' => '-',
//                 'agenda' => '-',
//                 'recap' => '-',
//             ],
//             [
//                 'status' => '-',
//                 'quarter' => '-',
//                 'meetingDate' => '-',
//                 'agenda' => '-',
//                 'recap' => '-',
//             ],
//         ],
//     ];

//     return response()->json([
//         $organization => $data[$organization] ?? [],
//     ]);
// });

// ref: frontend\src\components\9.session-dates\sessionDates.jsx
Route::get('/api/v1/session-dates/quarterly-sessions', function (Request $request) use ($API_secure) {
    if ($API_secure) {
        if (!$request->session()->get('logged_in')) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }
    }

    $organization = $request->query('organization');

    if (!$organization) {
        return response()->json(['message' => 'Organization is required'], 400);
    }

    $record = SessionDatesQuarterlySessions::where('organizationName', $organization)->first();

    return response()->json([
        $organization => $record->sessionDatesQuarterlySessionsData ?? [],
    ]);
});


// // ref: frontend\src\components\9.session-dates\2.QuarterlySessions\QuarterlySessions.jsx
Route::post('/api/v1/session-dates/quarterly-sessions/update', function (Request $request) use ($API_secure) {
    if ($API_secure) {
        if (!$request->session()->get('logged_in')) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }
    }

    $organization = $request->input('organizationName');
    $sessions = $request->input('sessionDatesQuarterlySessionsData');

    if (!$organization || !is_array($sessions)) {
        return response()->json(['message' => 'Invalid data'], 422);
    }

    // Reorder session IDs sequentially
    foreach ($sessions as $index => &$session) {
        $session['id'] = $index + 1;
    }

    $record = SessionDatesQuarterlySessions::where('organizationName', $organization)->first();

    if (!$record) {
        return response()->json(['message' => 'Organization not found'], 404);
    }

    $record->sessionDatesQuarterlySessionsData = $sessions;
    $record->save();

    return response()->json([
        'message' => 'Session data updated successfully.',
        'data' => $record
    ]);
});


// // ref: frontend\src\components\9.session-dates\2.QuarterlySessions\QuarterlySessions.jsx
// Route::post('/api/v1/session-dates/quarterly-sessions/reset-agenda', function (Request $request) use ($API_secure) {
//     if ($API_secure) {
//         if (!$request->session()->get('logged_in')) {
//             return response()->json(['message' => 'Unauthorized'], 401);
//         }
//     }

//     $organization = $request->input('organizationName');
//     $updatedRecord = $request->input('updatedRecord'); // must include 'id'

//     if (!$organization || !is_array($updatedRecord) || !isset($updatedRecord['id'])) {
//         return response()->json(['message' => 'Invalid data'], 422);
//     }

//     $record = SessionDatesQuarterlySessions::where('organizationName', $organization)->first();

//     if (!$record) {
//         return response()->json(['message' => 'Organization not found'], 404);
//     }

//     $sessions = $record->sessionDatesQuarterlySessionsData;

//     // Replace session with updated agenda by matching ID
//     $sessions = array_map(function ($item) use ($updatedRecord) {
//         return $item['id'] === $updatedRecord['id'] ? $updatedRecord : $item;
//     }, $sessions);

//     $record->sessionDatesQuarterlySessionsData = $sessions;
//     $record->save();

//     return response()->json([
//         'status' => 'success',
//         'message' => 'Agenda reset successfully.',
//         'data' => $updatedRecord
//     ]);
// });

// ref: frontend\src\components\9.session-dates\2.QuarterlySessions\QuarterlySessions.jsx
Route::post('/api/v1/session-dates/quarterly-sessions/reset-agenda', function (Request $request) use ($API_secure) {
    if ($API_secure && !$request->session()->get('logged_in')) {
        return response()->json(['message' => 'Unauthorized'], 401);
    }

    $organization = $request->input('organizationName');
    $updatedRecord = $request->input('updatedRecord'); // Must include 'id'

    if (!$organization || !is_array($updatedRecord) || !isset($updatedRecord['id'])) {
        return response()->json(['message' => 'Invalid data'], 422);
    }

    // 🔍 Find record
    $record = SessionDatesQuarterlySessions::where('organizationName', 'like', "%{$organization}%")->first();
    if (!$record) {
        return response()->json(['message' => 'Organization not found'], 404);
    }

    $data = $record->sessionDatesQuarterlySessionsData;
    $updated = false;

    foreach ($data as &$session) {
        if ((int) $session['id'] === (int) $updatedRecord['id']) {

            // 🗑️ Delete agenda file & folder if exists
            if (!empty($session['agenda']['url'])) {
                $url = $session['agenda']['url'];

                // Match: /api/storage/session-dates/quarterly-sessions/{uid}/agenda/{random6}/filename
                $pattern = "/session-dates\/quarterly-sessions\/([^\/]+)\/agenda\/([^\/]+)/";
                if (preg_match($pattern, $url, $matches)) {
                    $uid = $matches[1];
                    $randomDir = $matches[2];
                    $relativeDir = "session-dates/quarterly-sessions/{$uid}/agenda/{$randomDir}";
                    $fullPath = storage_path("app/public/{$relativeDir}");

                    if (File::exists($fullPath)) {
                        File::deleteDirectory($fullPath);
                    }
                }
            }

            // 🔄 Reset agenda field
            $session['agenda'] = ['name' => '-', 'url' => ''];
            $updated = true;
            break;
        }
    }

    if ($updated) {
        $record->sessionDatesQuarterlySessionsData = $data;
        $record->save();
    }

    return response()->json([
        'status' => 'success',
        'message' => 'Agenda deleted and reset successfully.',
        'data' => $updatedRecord,
    ]);
});


// // ref: 
// Route::post('/api/v1/session-dates/quarterly-sessions/reset-recap', function (Request $request) use ($API_secure) {
//     if ($API_secure) {
//         if (!$request->session()->get('logged_in')) {
//             return response()->json(['message' => 'Unauthorized'], 401);
//         }
//     }

//     $organization = $request->input('organizationName');
//     $updatedRecord = $request->input('updatedRecord'); // must include 'id'

//     if (!$organization || !is_array($updatedRecord) || !isset($updatedRecord['id'])) {
//         return response()->json(['message' => 'Invalid data'], 422);
//     }

//     $record = SessionDatesQuarterlySessions::where('organizationName', $organization)->first();

//     if (!$record) {
//         return response()->json(['message' => 'Organization not found'], 404);
//     }

//     $sessions = $record->sessionDatesQuarterlySessionsData;

//     // Replace session with updated recap by matching ID
//     $sessions = array_map(function ($item) use ($updatedRecord) {
//         return $item['id'] === $updatedRecord['id'] ? $updatedRecord : $item;
//     }, $sessions);

//     $record->sessionDatesQuarterlySessionsData = $sessions;
//     $record->save();

//     return response()->json([
//         'status' => 'success',
//         'message' => 'Recap reset successfully.',
//         'data' => $updatedRecord
//     ]);
// });

// ref: 
Route::post('/api/v1/session-dates/quarterly-sessions/reset-recap', function (Request $request) use ($API_secure) {
    if ($API_secure && !$request->session()->get('logged_in')) {
        return response()->json(['message' => 'Unauthorized'], 401);
    }

    $organization = $request->input('organizationName');
    $updatedRecord = $request->input('updatedRecord'); // Must include 'id'

    if (!$organization || !is_array($updatedRecord) || !isset($updatedRecord['id'])) {
        return response()->json(['message' => 'Invalid data'], 422);
    }

    // 🔍 Find record
    $record = SessionDatesQuarterlySessions::where('organizationName', 'like', "%{$organization}%")->first();
    if (!$record) {
        return response()->json(['message' => 'Organization not found'], 404);
    }

    $data = $record->sessionDatesQuarterlySessionsData;
    $updated = false;

    foreach ($data as &$session) {
        if ((int) $session['id'] === (int) $updatedRecord['id']) {

            // 🗑️ Delete recap file & folder if exists
            if (!empty($session['recap']['url'])) {
                $url = $session['recap']['url'];

                // Match: /api/storage/session-dates/quarterly-sessions/{uid}/recap/{random6}/filename
                $pattern = "/session-dates\/quarterly-sessions\/([^\/]+)\/recap\/([^\/]+)/";
                if (preg_match($pattern, $url, $matches)) {
                    $uid = $matches[1];
                    $randomDir = $matches[2];
                    $relativeDir = "session-dates/quarterly-sessions/{$uid}/recap/{$randomDir}";
                    $fullPath = storage_path("app/public/{$relativeDir}");

                    if (File::exists($fullPath)) {
                        File::deleteDirectory($fullPath);
                    }
                }
            }

            // 🔄 Reset recap field
            $session['recap'] = ['name' => '-', 'url' => ''];
            $updated = true;
            break;
        }
    }

    if ($updated) {
        $record->sessionDatesQuarterlySessionsData = $data;
        $record->save();
    }

    return response()->json([
        'status' => 'success',
        'message' => 'Recap deleted and reset successfully.',
        'data' => $updatedRecord,
    ]);
});


 
// ref: 
// Route::get('/api/v1/session-dates/quarterly-sessions', function (Request $request) use ($API_secure) {
//     if ($API_secure) {
//         if (!$request->session()->get('logged_in')) {
//             return response()->json(['message' => 'Unauthorized'], 401);
//         }

//         $user = $request->session()->get('user');
//     }

//     $organization = $request->query('organization');

//     $data = [
//         'Chuck Gulledge Advisors, LLC' => [
//             [
//                 'id' => 1,
//                 'status' => 'Done',
//                 'quarter' => 'Q1 2025',
//                 'meetingDate' => '2025-01-20',
//                 'agenda' => [
//                     'name' => 'Strategic Planning & KPIs.pdf',
//                     'url' => 'https://example.com/agenda-q1.pdf',
//                 ],
//                 'recap' => [
//                     'name' => 'Q1 Recap Summary.pdf',
//                     'url' => 'https://example.com/recap-q1.pdf',
//                 ],
//             ],
//             [
//                 'id' => 2,
//                 'status' => 'Done',
//                 'quarter' => 'Q2 2025',
//                 'meetingDate' => '2025-04-22',
//                 'agenda' => [
//                     'name' => 'Customer Retention Plans.pdf',
//                     'url' => 'https://example.com/agenda-q2.pdf',
//                 ],
//                 'recap' => [
//                     'name' => 'Q2 Recap Summary.pdf',
//                     'url' => 'https://example.com/recap-q2.pdf',
//                 ],
//             ],
//             [
//                 'id' => 3,
//                 'status' => 'Done',
//                 'quarter' => 'Q3 2025',
//                 'meetingDate' => '2025-07-15',
//                 'agenda' => [
//                     'name' => 'New Product Launch Discussion.pdf',
//                     'url' => 'https://example.com/agenda-q3.pdf',
//                 ],
//                 'recap' => [
//                     'name' => '-',
//                     'url' => '',
//                 ],
//             ],
//             [
//                 'id' => 4,
//                 'status' => 'Done',
//                 'quarter' => 'Q4 2025',
//                 'meetingDate' => '2025-10-17',
//                 'agenda' => [
//                     'name' => 'Annual Review & Strategy 2026.pdf',
//                     'url' => 'https://example.com/agenda-q4.pdf',
//                 ],
//                 'recap' => [
//                     'name' => '-',
//                     'url' => '',
//                 ],
//             ],
//         ],
//     ];

//     return response()->json([
//         $organization => $data[$organization] ?? [],
//     ]);
// });


// // ref: frontend\src\components\9.session-dates\sessionDates.jsx
// Route::get('/api/v1/session-dates/monthly-sessions', function (Request $request) use ($API_secure) {
//     if ($API_secure) {
//         if (!$request->session()->get('logged_in')) {
//             return response()->json(['message' => 'Unauthorized'], 401);
//         }
//         $user = $request->session()->get('user');
//     }

//     $organization = $request->query('organization');

//     $data = [
//         'Chuck Gulledge Advisors, LLC' => [
//             [
//                 'status' => 'Done',
//                 'month' => 'January',
//                 'date' => '2025-01-10',
//                 'agenda' => 'Review January goals and targets',
//                 'recap' => 'All targets met. Positive team performance.',
//             ],
//             [
//                 'status' => 'Pending',
//                 'month' => 'February',
//                 'date' => '2025-02-14',
//                 'agenda' => 'Mid-Q1 Alignment & Budget Discussion',
//                 'recap' => 'To be conducted.',
//             ],
//             [
//                 'status' => 'New',
//                 'month' => 'March',
//                 'date' => '2025-03-20',
//                 'agenda' => 'Client Feedback Analysis',
//                 'recap' => 'Preparation ongoing.',
//             ],
//         ],
//         'Collins Credit Union' => [
//             [
//                 'status' => 'Done',
//                 'month' => 'April',
//                 'date' => '2024-04-05',
//                 'agenda' => 'Q1 Financial Review',
//                 'recap' => 'Reviewed finances and approved budget.',
//             ],
//             [
//                 'status' => 'Pending',
//                 'month' => 'May',
//                 'date' => '2024-05-12',
//                 'agenda' => 'Marketing Campaign Planning',
//                 'recap' => 'Plan draft under review.',
//             ],
//             [
//                 'status' => 'New',
//                 'month' => 'June',
//                 'date' => '2024-06-18',
//                 'agenda' => 'Team Building Activities',
//                 'recap' => 'To be scheduled.',
//             ],
//         ],
//         'Test Skeleton Loading' => [
//             [
//                 'status' => '-',
//                 'month' => '-',
//                 'date' => '-',
//                 'agenda' => '-',
//                 'recap' => '-',
//             ],
//             [
//                 'status' => '-',
//                 'month' => '-',
//                 'date' => '-',
//                 'agenda' => '-',
//                 'recap' => '-',
//             ],
//             [
//                 'status' => '-',
//                 'month' => '-',
//                 'date' => '-',
//                 'agenda' => '-',
//                 'recap' => '-',
//             ],
//         ],
//     ];

//     return response()->json([
//         $organization => $data[$organization] ?? [],
//     ]);
// });

// ref: frontend\src\components\9.session-dates\sessionDates.jsx
Route::get('/api/v1/session-dates/monthly-sessions', function (Request $request) use ($API_secure) {
    if ($API_secure) {
        if (!$request->session()->get('logged_in')) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }
    }

    $organization = $request->query('organization');

    if (!$organization) {
        return response()->json(['message' => 'Organization is required'], 400);
    }

    $record = SessionDatesMonthlySessions::where('organizationName', $organization)->first();

    return response()->json([
        $organization => $record->sessionDatesMonthlySessionsData ?? [],
    ]);
});


// ref: 
Route::post('/api/v1/session-dates/monthly-sessions/update', function (Request $request) use ($API_secure) {
    if ($API_secure) {
        if (!$request->session()->get('logged_in')) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }
    }

    $organization = $request->input('organizationName');
    $sessions = $request->input('sessionDatesMonthlySessionsData');

    if (!$organization || !is_array($sessions)) {
        return response()->json(['message' => 'Invalid data'], 422);
    }

    // Reorder session IDs sequentially
    foreach ($sessions as $index => &$session) {
        $session['id'] = $index + 1;
    }

    $record = SessionDatesMonthlySessions::where('organizationName', $organization)->first();

    if (!$record) {
        return response()->json(['message' => 'Organization not found'], 404);
    }

    $record->sessionDatesMonthlySessionsData = $sessions;
    $record->save();

    return response()->json([
        'message' => 'Session data updated successfully.',
        'data' => $record
    ]);
});



// // ref: 
// Route::post('/api/v1/session-dates/monthly-sessions/reset-agenda', function (Request $request) use ($API_secure) {
//     if ($API_secure) {
//         if (!$request->session()->get('logged_in')) {
//             return response()->json(['message' => 'Unauthorized'], 401);
//         }
//     }

//     $organization = $request->input('organizationName');
//     $updatedRecord = $request->input('updatedRecord'); // must include 'id'

//     if (!$organization || !is_array($updatedRecord) || !isset($updatedRecord['id'])) {
//         return response()->json(['message' => 'Invalid data'], 422);
//     }

//     $record = SessionDatesMonthlySessions::where('organizationName', $organization)->first();

//     if (!$record) {
//         return response()->json(['message' => 'Organization not found'], 404);
//     }

//     $sessions = $record->sessionDatesMonthlySessionsData;

//     // Replace session with updated agenda by matching ID
//     $sessions = array_map(function ($item) use ($updatedRecord) {
//         return $item['id'] === $updatedRecord['id'] ? $updatedRecord : $item;
//     }, $sessions);

//     $record->sessionDatesMonthlySessionsData = $sessions;
//     $record->save();

//     return response()->json([
//         'status' => 'success',
//         'message' => 'Agenda reset successfully.',
//         'data' => $updatedRecord
//     ]);
// });

// ref: frontend\src\components\9.session-dates\3.MonthlySessions\MonthlySessions.jsx
Route::post('/api/v1/session-dates/monthly-sessions/reset-agenda', function (Request $request) use ($API_secure) {
    if ($API_secure && !$request->session()->get('logged_in')) {
        return response()->json(['message' => 'Unauthorized'], 401);
    }

    $organization = $request->input('organizationName');
    $updatedRecord = $request->input('updatedRecord');

    if (!$organization || !is_array($updatedRecord) || !isset($updatedRecord['id'])) {
        return response()->json(['message' => 'Invalid data'], 422);
    }

    // 🔍 Find record
    $record = SessionDatesMonthlySessions::where('organizationName', 'like', "%{$organization}%")->first();
    if (!$record) {
        return response()->json(['message' => 'Organization not found'], 404);
    }

    $data = $record->sessionDatesMonthlySessionsData;
    $updated = false;

    foreach ($data as &$session) {
        if ((int) $session['id'] === (int) $updatedRecord['id']) {

            // 🗑️ Delete agenda file & folder if exists
            if (!empty($session['agenda']['url'])) {
                $url = $session['agenda']['url'];

                // Match: /api/storage/session-dates/monthly-sessions/{uid}/agenda/{random6}/filename
                $pattern = "/session-dates\/monthly-sessions\/([^\/]+)\/agenda\/([^\/]+)/";
                if (preg_match($pattern, $url, $matches)) {
                    $uid = $matches[1];
                    $randomDir = $matches[2];
                    $relativeDir = "session-dates/monthly-sessions/{$uid}/agenda/{$randomDir}";
                    $fullPath = storage_path("app/public/{$relativeDir}");

                    if (File::exists($fullPath)) {
                        File::deleteDirectory($fullPath);
                    }
                }
            }

            // 🔄 Reset agenda field
            $session['agenda'] = ['name' => '-', 'url' => ''];
            $updated = true;
            break;
        }
    }

    if ($updated) {
        $record->sessionDatesMonthlySessionsData = $data;
        $record->save();
    }

    return response()->json([
        'status' => 'success',
        'message' => 'Agenda deleted and reset successfully.',
        'data' => $updatedRecord,
    ]);
});


// // ref: 
// Route::post('/api/v1/session-dates/monthly-sessions/reset-recap', function (Request $request) use ($API_secure) {
//     if ($API_secure) {
//         if (!$request->session()->get('logged_in')) {
//             return response()->json(['message' => 'Unauthorized'], 401);
//         }
//     }

//     $organization = $request->input('organizationName');
//     $updatedRecord = $request->input('updatedRecord'); // must include 'id'

//     if (!$organization || !is_array($updatedRecord) || !isset($updatedRecord['id'])) {
//         return response()->json(['message' => 'Invalid data'], 422);
//     }

//     $record = SessionDatesMonthlySessions::where('organizationName', $organization)->first();

//     if (!$record) {
//         return response()->json(['message' => 'Organization not found'], 404);
//     }

//     $sessions = $record->sessionDatesMonthlySessionsData;

//     // Replace session with updated recap by matching ID
//     $sessions = array_map(function ($item) use ($updatedRecord) {
//         return $item['id'] === $updatedRecord['id'] ? $updatedRecord : $item;
//     }, $sessions);

//     $record->sessionDatesMonthlySessionsData = $sessions;
//     $record->save();

//     return response()->json([
//         'status' => 'success',
//         'message' => 'Recap reset successfully.',
//         'data' => $updatedRecord
//     ]);
// });

// ref: frontend\src\components\9.session-dates\3.MonthlySessions\MonthlySessions.jsx
Route::post('/api/v1/session-dates/monthly-sessions/reset-recap', function (Request $request) use ($API_secure) {
    if ($API_secure && !$request->session()->get('logged_in')) {
        return response()->json(['message' => 'Unauthorized'], 401);
    }

    $organization = $request->input('organizationName');
    $updatedRecord = $request->input('updatedRecord'); // Must include 'id'

    if (!$organization || !is_array($updatedRecord) || !isset($updatedRecord['id'])) {
        return response()->json(['message' => 'Invalid data'], 422);
    }

    // 🔍 Find record
    $record = SessionDatesMonthlySessions::where('organizationName', 'like', "%{$organization}%")->first();
    if (!$record) {
        return response()->json(['message' => 'Organization not found'], 404);
    }

    $data = $record->sessionDatesMonthlySessionsData;
    $updated = false;

    foreach ($data as &$session) {
        if ((int) $session['id'] === (int) $updatedRecord['id']) {

            // 🗑️ Delete recap file & folder if exists
            if (!empty($session['recap']['url'])) {
                $url = $session['recap']['url'];

                // Match: /api/storage/session-dates/monthly-sessions/{uid}/recap/{random6}/filename
                $pattern = "/session-dates\/monthly-sessions\/([^\/]+)\/recap\/([^\/]+)/";
                if (preg_match($pattern, $url, $matches)) {
                    $uid = $matches[1];
                    $randomDir = $matches[2];
                    $relativeDir = "session-dates/monthly-sessions/{$uid}/recap/{$randomDir}";
                    $fullPath = storage_path("app/public/{$relativeDir}");

                    if (File::exists($fullPath)) {
                        File::deleteDirectory($fullPath);
                    }
                }
            }

            // 🔄 Reset recap field
            $session['recap'] = ['name' => '-', 'url' => ''];
            $updated = true;
            break;
        }
    }

    if ($updated) {
        $record->sessionDatesMonthlySessionsData = $data;
        $record->save();
    }

    return response()->json([
        'status' => 'success',
        'message' => 'Recap deleted and reset successfully.',
        'data' => $updatedRecord,
    ]);
});




// ref: frontend\src\components\11.coaching-checklist\coachingChecklist.jsx
Route::get('/api/v1/coaching-checklist/project-progress', function (Request $request) use ($API_secure) {
    if ($API_secure) {
        if (!$request->session()->get('logged_in')) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }
        $user = $request->session()->get('user');
    }

    $organization = $request->query('organization');

    $mockData = [
        'Chuck Gulledge Advisors, LLC' => [
            'completedItems' => 3,
            'totalItems' => 5,
            'nextRecommendedTools' => [
                ['id' => 1, 'name' => 'SWOT Analysis Tool'],
                ['id' => 2, 'name' => 'Customer Journey Mapper'],
                ['id' => 3, 'name' => 'Competitor Benchmarking Grid'],
                ['id' => 4, 'name' => 'SMART Goals Planner'],
            ],
        ],
        'Collins Credit Union' => [
            'completedItems' => 4,
            'totalItems' => 6,
            'nextRecommendedTools' => [
                ['id' => 1, 'name' => 'KPI Dashboard'],
                ['id' => 2, 'name' => 'Process Optimization Tool'],
                ['id' => 3, 'name' => 'Employee Feedback Survey'],
            ],
        ],
        'Test Skeleton Loading' => [
            'completedItems' => 0,
            'totalItems' => 0,
            'nextRecommendedTools' => [],
        ],
    ];

    return response()->json($mockData[$organization] ?? [
        'completedItems' => 0,
        'totalItems' => 0,
        'nextRecommendedTools' => [],
    ]);
});

// ref:
// Route::get('/api/v1/coaching-checklist/panels', function (Request $request) use ($API_secure) {
//     if ($API_secure) {
//         if (!$request->session()->get('logged_in')) {
//             return response()->json(['message' => 'Unauthorized'], 401);
//         }
//         $user = $request->session()->get('user');
//     }

//     $organization = $request->query('organization');

//     $commonLink = 'https://drive.google.com/file/d/1OsPZ8-DMcW3IcYsbmy1J17iDSnp9_w0W/view?usp=sharing';
//     $uploadLink = '/file-upload/coaching-checklist/McW3IcYsbmy1J17iDSnp9';

//     $mockPanels = [
//         'Chuck Gulledge Advisors, LLC' => [
//             [
//                 'id' => 1,
//                 'title' => 'Client Onboarding',
//                 'icon' => 'faHandshake',
//                 'expanded' => false,
//                 'items' => [
//                     [
//                         'id' => '1a',
//                         'text' => 'Welcome call completed',
//                         'completed' => true,
//                         'date' => '2025-03-28',
//                         'link' => $commonLink,
//                         'uploadLink' => $uploadLink,
//                         'pdflink' => '',
//                     ],
//                     [
//                         'id' => '1b',
//                         'text' => 'Onboarding documents submitted',
//                         'completed' => false,
//                         'date' => '',
//                         'link' => $commonLink,
//                         'uploadLink' => $uploadLink,
//                         'pdflink' => '',
//                     ],
//                 ],
//             ],
//             [
//                 'id' => 2,
//                 'title' => 'Personal & Leadership Readiness',
//                 'icon' => 'faUserTie',
//                 'expanded' => false,
//                 'items' => [
//                     [
//                         'id' => '2a',
//                         'text' => 'Personal goals aligned',
//                         'completed' => true,
//                         'date' => '2025-03-29',
//                         'link' => $commonLink,
//                         'uploadLink' => $uploadLink,
//                         'pdflink' => '',
//                     ],
//                     [
//                         'id' => '2b',
//                         'text' => 'Leadership team commitment',
//                         'completed' => false,
//                         'date' => '',
//                         'link' => $commonLink,
//                         'uploadLink' => $uploadLink,
//                         'pdflink' => '',
//                     ],
//                 ],
//             ],
//             [
//                 'id' => 3,
//                 'title' => 'Strategic Clarity',
//                 'icon' => 'faBullseye',
//                 'expanded' => false,
//                 'items' => [
//                     [
//                         'id' => '3a',
//                         'text' => 'Vision and mission reviewed',
//                         'completed' => true,
//                         'date' => '2025-03-30',
//                         'link' => $commonLink,
//                         'uploadLink' => $uploadLink,
//                         'pdflink' => '',
//                     ],
//                     [
//                         'id' => '3b',
//                         'text' => 'Key strategic drivers defined',
//                         'completed' => false,
//                         'date' => '',
//                         'link' => $commonLink,
//                         'uploadLink' => $uploadLink,
//                         'pdflink' => '',
//                     ],
//                 ],
//             ],
//             [
//                 'id' => 4,
//                 'title' => 'Execution Discipline',
//                 'icon' => 'faCheckSquare',
//                 'expanded' => false,
//                 'items' => [
//                     [
//                         'id' => '4a',
//                         'text' => 'Quarterly goals set',
//                         'completed' => false,
//                         'date' => '',
//                         'link' => $commonLink,
//                         'uploadLink' => $uploadLink,
//                         'pdflink' => '',
//                     ],
//                     [
//                         'id' => '4b',
//                         'text' => 'Weekly check-ins scheduled',
//                         'completed' => true,
//                         'date' => '2025-03-31',
//                         'link' => $commonLink,
//                         'uploadLink' => $uploadLink,
//                         'pdflink' => '',
//                     ],
//                 ],
//             ],
//             [
//                 'id' => 5,
//                 'title' => 'Cash & Financial Discipline',
//                 'icon' => 'faMoneyBillWave',
//                 'expanded' => false,
//                 'items' => [
//                     [
//                         'id' => '5a',
//                         'text' => 'Cash flow projection ready',
//                         'completed' => false,
//                         'date' => '',
//                         'link' => $commonLink,
//                         'uploadLink' => $uploadLink,
//                         'pdflink' => '',
//                     ],
//                     [
//                         'id' => '5b',
//                         'text' => 'Budget aligned to goals',
//                         'completed' => true,
//                         'date' => '2025-04-01',
//                         'link' => $commonLink,
//                         'uploadLink' => $uploadLink,
//                         'pdflink' => '',
//                     ],
//                 ],
//             ],
//             [
//                 'id' => 6,
//                 'title' => 'MomentumOS Performance System',
//                 'icon' => 'faChartLine',
//                 'expanded' => false,
//                 'items' => [
//                     [
//                         'id' => '6a',
//                         'text' => 'MomentumOS dashboard set up',
//                         'completed' => true,
//                         'date' => '2025-04-02',
//                         'link' => $commonLink,
//                         'uploadLink' => $uploadLink,
//                         'pdflink' => '',
//                     ],
//                     [
//                         'id' => '6b',
//                         'text' => 'Team trained to use system',
//                         'completed' => false,
//                         'date' => '',
//                         'link' => $commonLink,
//                         'uploadLink' => $uploadLink,
//                         'pdflink' => '',
//                     ],
//                 ],
//             ],
//         ],

//         'Collins Credit Union' => [],

//         'Test Skeleton Loading' => [],
//     ];

//     return response()->json($mockPanels[$organization] ?? []);
// });


// // ref:
// Route::get('/api/v1/coaching-checklist/panels', function (Request $request) use ($API_secure) {
//     if ($API_secure) {
//         if (!$request->session()->get('logged_in')) {
//             return response()->json(['message' => 'Unauthorized'], 401);
//         }
//         $user = $request->session()->get('user');
//     }

//     $organization = $request->query('organization');

//     if (!$organization) {
//         return response()->json(['message' => 'Organization is required'], 400);
//     }

//     $record = CoachingChecklistPanel::where('organizationName', $organization)->first();

//     // Return the data wrapped with organizationName as key, or empty array if not found
//     // ✅ Return raw array (or empty array if not found)
//     return response()->json(
//         $record->coachingChecklistPanelsData ?? []
//     );
// });

// ref: frontend\src\components\11.coaching-checklist\coachingChecklist.jsx
Route::get('/api/v1/coaching-checklist/panels', function (Request $request) use ($API_secure) {
    if ($API_secure) {
        if (!$request->session()->get('logged_in')) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }
    }

    $organization = $request->query('organization');

    if (!$organization) {
        return response()->json(['message' => 'Organization is required'], 400);
    }

    $record = CoachingChecklistPanel::where('organizationName', $organization)->first();

    if (!$record || !$record->coachingChecklistPanelsData) {
        return response()->json([]);
    }

    $panelsData = $record->coachingChecklistPanelsData;
    $u_id = $record->u_id;

    $uploadLink = "/file-upload/coaching-checklist/{$u_id}";

    // 🔄 Inject dynamic uploadLink only
    foreach ($panelsData as &$panel) {
        foreach ($panel['items'] as &$item) {
            $item['uploadLink'] = $uploadLink;
        }
    }

    return response()->json($panelsData);
});




// ref: frontend\src\components\11.coaching-checklist\2.CollapsiblePanels\CollapsiblePanels.jsx
Route::post('/api/v1/coaching-checklist/panels/update', function (Request $request) use ($API_secure) {
    if ($API_secure && !$request->session()->get('logged_in')) {
        return response()->json(['message' => 'Unauthorized'], 401);
    }

    $organization = $request->input('organization');
    $panels = $request->input('panels', []); // Default to empty array if not provided

    // Find or create the record
    $record = CoachingChecklistPanel::firstOrCreate([
        'organizationName' => $organization
    ]);

    // Save panels data as JSON
    $record->coachingChecklistPanelsData = $panels;
    $record->save();

    return response()->json(['message' => 'Panels updated successfully']);
});


// Route::post('/api/v1/coaching-checklist/panels/update', function (Request $request) use ($API_secure) {
//     if ($API_secure && !$request->session()->get('logged_in')) {
//         return response()->json(['message' => 'Unauthorized'], 401);
//     }

//     $organization = $request->input('organization');
//     $panels = $request->input('panels');

//     if (!$organization || !is_array($panels)) {
//         return response()->json(['message' => 'Invalid input'], 400);
//     }

//     // Find or create the record
//     $record = CoachingChecklistPanel::firstOrCreate(
//         ['organizationName' => $organization]
//     );

//     // Save JSON panels data
//     $record->coachingChecklistPanelsData = $panels;
//     $record->save();

//     return response()->json(['message' => 'Panels updated successfully']);
// });


// ref: 
Route::post('/api/v1/coaching-checklist/update-pdflink', function (Request $request) use ($API_secure) {
    // Secure session check like WeeklySprintTracker
    if ($API_secure && !$request->session()->get('logged_in')) {
        return response()->json(['message' => 'Unauthorized'], 401);
    }

    // Validate request input
    $validated = $request->validate([
        'organization' => 'required|string',
        'panelId' => 'required|integer',
        'itemId' => 'required|string',
        'pdflink' => 'required|url',
    ]);

    // Fetch record by organizationName (not 'organization')
    $panelRecord = CoachingChecklistPanel::where('organizationName', $validated['organization'])->first();

    if (!$panelRecord) {
        return response()->json(['message' => 'Checklist not found for this organization'], 404);
    }

    // Use coachingChecklistPanelsData field (casted to array)
    $data = $panelRecord->coachingChecklistPanelsData ?? [];
    $found = false;

    // Update the specific item by panel ID and item ID
    foreach ($data as &$panel) {
        if ((int) $panel['id'] === (int) $validated['panelId']) {
            foreach ($panel['items'] as &$item) {
                if ($item['id'] === $validated['itemId']) {
                    $item['pdflink'] = $validated['pdflink'];
                    $found = true;
                    break 2;
                }
            }
        }
    }

    if (!$found) {
        return response()->json(['message' => 'Panel or item not found'], 404);
    }

    // Save updated data back to the model
    $panelRecord->coachingChecklistPanelsData = $data;
    $panelRecord->save();

    return response()->json(['message' => 'PDF link updated successfully']);
});


// // ref: frontend\src\components\12.coaching-alignment\coachingAlignment.jsx
// Route::get('/api/v1/coaching-alignment/current-focus', function (Request $request) use ($API_secure) {
//     if ($API_secure) {
//         if (!$request->session()->get('logged_in')) {
//             return response()->json(['message' => 'Unauthorized'], 401);
//         }
//     }

//     $organization = $request->query('organization');

//     $data = [
//         'Chuck Gulledge Advisors, LLC' => [
//             'focusItems' => ['Enhance leadership training', 'Streamline team communication'],
//         ],
//         'Collins Credit Union' => [
//             'focusItems' => ['Improve coaching feedback loops', 'Align department KPIs'],
//         ],
//         'Test Skeleton Loading' => [
//             'focusItems' => ['-', '-'],
//         ],
//     ];

//     return response()->json($data[$organization] ?? ['focusItems' => []]);
// });


// ref: frontend\src\components\12.coaching-alignment\coachingAlignment.jsx
Route::get('/api/v1/coaching-alignment/current-focus', function (Request $request) use ($API_secure) {
    // ✅ Secure session check
    if ($API_secure && !$request->session()->get('logged_in')) {
        return response()->json(['message' => 'Unauthorized'], 401);
    }

    // ✅ Get organization name from query
    $organization = $request->query('organization');

    if (!$organization) {
        return response()->json(['message' => 'Missing organization parameter'], 400);
    }

    // ✅ Fetch from database
    $record = CoachingAlignmentCurrentFocus::where('organizationName', $organization)->first();

    if (!$record) {
        return response()->json(['focusItems' => []]);
    }

    // ✅ Return the nested structure
    return response()->json($record->coachingAlignmentCurrentFocusData ?? ['focusItems' => []]);
});


// ref: frontend\src\components\12.coaching-alignment\1.CurrentFocus\CurrentFocus.jsx
Route::post('/api/v1/coaching-alignment/current-focus/update', function (Request $request) use ($API_secure) {
    if ($API_secure && !$request->session()->get('logged_in')) {
        return response()->json(['message' => 'Unauthorized'], 401);
    }

    $organization = $request->input('organization');
    $focusItems = $request->input('focusItems', []); // Default to empty array

    $record = CoachingAlignmentCurrentFocus::firstOrCreate([
        'organizationName' => $organization
    ]);

    $record->coachingAlignmentCurrentFocusData = [
        'focusItems' => $focusItems
    ];

    $record->save();

    return response()->json(['message' => 'Focus items updated successfully']);
});


// Route::post('/api/v1/coaching-alignment/current-focus/update', function (Request $request) use ($API_secure) {
//     if ($API_secure && !$request->session()->get('logged_in')) {
//         return response()->json(['message' => 'Unauthorized'], 401);
//     }

//     $validated = $request->validate([
//         'organization' => 'required|string',
//         'focusItems' => 'required|array',
//     ]);

//     $organization = $validated['organization'];
//     $focusItems = $validated['focusItems'];

//     $record = CoachingAlignmentCurrentFocus::firstOrCreate(
//         ['organizationName' => $organization]
//     );

//     $record->coachingAlignmentCurrentFocusData = [
//         'focusItems' => $focusItems
//     ];

//     $record->save();

//     return response()->json(['message' => 'Focus items updated successfully']);
// });


// ref: frontend\src\components\12.coaching-alignment\1.CurrentFocus\CurrentFocus.jsx
Route::post('/api/v1/coaching-alignment/current-focus/delete-item', function (Request $request) use ($API_secure) {
    if ($API_secure && !$request->session()->get('logged_in')) {
        return response()->json(['message' => 'Unauthorized'], 401);
    }

    $validated = $request->validate([
        'organization' => 'required|string',
        'item' => 'required|string',
    ]);

    $organization = $validated['organization'];
    $itemToDelete = $validated['item'];

    $record = CoachingAlignmentCurrentFocus::where('organizationName', $organization)->first();

    if (!$record) {
        return response()->json(['message' => 'Record not found'], 404);
    }

    $data = $record->coachingAlignmentCurrentFocusData;

    if (!isset($data['focusItems']) || !is_array($data['focusItems'])) {
        return response()->json(['message' => 'Invalid data format'], 400);
    }

    $data['focusItems'] = array_filter($data['focusItems'], function ($focusItem) use ($itemToDelete) {
        return $focusItem !== $itemToDelete;
    });

    $record->coachingAlignmentCurrentFocusData = $data;
    $record->save();

    return response()->json(['message' => 'Item deleted successfully']);
});



// // ref: frontend\src\components\12.coaching-alignment\coachingAlignment.jsx
// Route::get('/api/v1/coaching-alignment/current-business-pulse', function (Request $request) use ($API_secure) {
//     if ($API_secure) {
//         if (!$request->session()->get('logged_in')) {
//             return response()->json(['message' => 'Unauthorized'], 401);
//         }
//     }

//     $organization = $request->query('organization');

//     $data = [
//         'Chuck Gulledge Advisors, LLC' => [
//             [
//                 'category' => 'Strategic Clarity',
//                 'rating' => 2,
//                 'notes' => ['Need clearer vision shared', 'Stakeholder alignment required'],
//             ],
//             [
//                 'category' => 'Execution Discipline',
//                 'rating' => 3,
//                 'notes' => ['Better task tracking', 'Set clear milestones'],
//             ],
//             [
//                 'category' => 'Leadership & Team Health',
//                 'rating' => 4,
//                 'notes' => ['Strong collaboration', 'Trust increasing'],
//             ],
//         ],
//         'Collins Credit Union' => [
//             [
//                 'category' => 'Strategic Clarity',
//                 'rating' => 1,
//                 'notes' => ['Too many initiatives'],
//             ],
//             [
//                 'category' => 'Execution Discipline',
//                 'rating' => 2,
//                 'notes' => ['Accountability needs work'],
//             ],
//             [
//                 'category' => 'Leadership & Team Health',
//                 'rating' => 'N/A',
//                 'notes' => [],
//             ],
//         ],
//         'Test Skeleton Loading' => [
//             [
//                 'category' => 'Strategic Clarity',
//                 'rating' => 'N/A',
//                 'notes' => [],
//             ],
//             [
//                 'category' => 'Execution Discipline',
//                 'rating' => 'N/A',
//                 'notes' => [],
//             ],
//             [
//                 'category' => 'Leadership & Team Health',
//                 'rating' => 'N/A',
//                 'notes' => [],
//             ],
//         ],
//     ];

//     return response()->json($data[$organization] ?? []);
// });

// ref: frontend\src\components\12.coaching-alignment\coachingAlignment.jsx
Route::get('/api/v1/coaching-alignment/current-business-pulse', function (Request $request) use ($API_secure) {
    if ($API_secure) {
        if (!$request->session()->get('logged_in')) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }
    }

    $organization = $request->query('organization');

    if (!$organization) {
        return response()->json(['message' => 'Organization name is required'], 400);
    }

    $record = CoachingAlignmentCurrentBusinessPulse::where('organizationName', $organization)->first();

    if (!$record) {
        return response()->json(['message' => 'No record found'], 404);
    }

    return response()->json($record->coachingAlignmentCurrentBusinessPulseData ?? []);
});



// ref: frontend\src\components\12.coaching-alignment\2.CurrentBusinessPulse\CurrentBusinessPulse.jsx
Route::post('/api/v1/coaching-alignment/current-business-pulse/update', function (Request $request) use ($API_secure) {
    if ($API_secure && !$request->session()->get('logged_in')) {
        return response()->json(['message' => 'Unauthorized'], 401);
    }

    $organization = $request->input('organization');
    $pulseData = $request->input('pulseData', []); // default to empty array if missing

    $record = CoachingAlignmentCurrentBusinessPulse::firstOrCreate([
        'organizationName' => $organization
    ]);

    $record->coachingAlignmentCurrentBusinessPulseData = $pulseData;
    $record->save();

    return response()->json(['message' => 'Business pulse updated successfully']);
});

// Route::post('/api/v1/coaching-alignment/current-business-pulse/update', function (Request $request) use ($API_secure) {
//     if ($API_secure && !$request->session()->get('logged_in')) {
//         return response()->json(['message' => 'Unauthorized'], 401);
//     }

//     $validated = $request->validate([
//         'organization' => 'required|string',
//         'pulseData' => 'required|array',
//     ]);

//     $organization = $validated['organization'];
//     $pulseData = $validated['pulseData'];

//     $record = CoachingAlignmentCurrentBusinessPulse::firstOrCreate(
//         ['organizationName' => $organization]
//     );

//     $record->coachingAlignmentCurrentBusinessPulseData = $pulseData;
//     $record->save();

//     return response()->json(['message' => 'Business pulse updated successfully']);
// });


// ref: frontend\src\components\12.coaching-alignment\2.CurrentBusinessPulse\CurrentBusinessPulse.jsx
Route::post('/api/v1/coaching-alignment/current-business-pulse/delete-item', function (Request $request) use ($API_secure) {
    if ($API_secure && !$request->session()->get('logged_in')) {
        return response()->json(['message' => 'Unauthorized'], 401);
    }

    $validated = $request->validate([
        'organization' => 'required|string',
        'category' => 'required|string',
    ]);

    $record = CoachingAlignmentCurrentBusinessPulse::where('organizationName', $validated['organization'])->first();

    if (!$record) {
        return response()->json(['message' => 'Record not found'], 404);
    }

    $data = $record->coachingAlignmentCurrentBusinessPulseData ?? [];

    // Filter out the item to be deleted by category
    $updatedData = array_filter($data, function ($item) use ($validated) {
        return $item['category'] !== $validated['category'];
    });

    // Reindex the array
    $record->coachingAlignmentCurrentBusinessPulseData = array_values($updatedData);
    $record->save();

    return response()->json(['message' => 'Item deleted successfully']);
});


// // ref: frontend\src\components\12.coaching-alignment\coachingAlignment.jsx
// Route::get('/api/v1/coaching-alignment/whats-next', function (Request $request) use ($API_secure) {
//     if ($API_secure) {
//         if (!$request->session()->get('logged_in')) {
//             return response()->json(['message' => 'Unauthorized'], 401);
//         }
//     }

//     $organization = $request->query('organization');

//     $data = [
//         'Chuck Gulledge Advisors, LLC' => [
//             'whatsNextItems' => ['Schedule leadership retreat', 'Finalize Q4 goals'],
//         ],
//         'Collins Credit Union' => [
//             'whatsNextItems' => ['Review coaching reports', 'Assign accountability partners'],
//         ],
//         'Test Skeleton Loading' => [
//             'whatsNextItems' => ['-', '-'],
//         ],
//     ];

//     return response()->json($data[$organization] ?? ['whatsNextItems' => []]);
// });

// ref: frontend\src\components\12.coaching-alignment\coachingAlignment.jsx
Route::get('/api/v1/coaching-alignment/whats-next', function (Request $request) use ($API_secure) {
    if ($API_secure && !$request->session()->get('logged_in')) {
        return response()->json(['message' => 'Unauthorized'], 401);
    }

    $organization = $request->query('organization');

    if (!$organization) {
        return response()->json(['message' => 'Missing organization name'], 400);
    }

    $record = CoachingAlignmentWhatsNext::where('organizationName', $organization)->first();

    if (!$record) {
        return response()->json(['whatsNextItems' => []]); // Return empty structure if not found
    }

    return response()->json($record->coachingAlignmentWhatsNextData ?? ['whatsNextItems' => []]);
});


// ref: frontend\src\components\12.coaching-alignment\3.WhatsNext\WhatsNext.jsx
Route::post('/api/v1/coaching-alignment/whats-next/update', function (Request $request) use ($API_secure) {
    if ($API_secure && !$request->session()->get('logged_in')) {
        return response()->json(['message' => 'Unauthorized'], 401);
    }

    $organization = $request->input('organization');
    $items = $request->input('whatsNextItems', []); // default to empty array if missing

    // Find or create the record
    $record = CoachingAlignmentWhatsNext::firstOrCreate(
        ['organizationName' => $organization]
    );

    // Save updated data
    $record->coachingAlignmentWhatsNextData = [
        'whatsNextItems' => $items,
    ];
    $record->save();

    return response()->json(['message' => 'WhatsNext items updated successfully']);
});


// Route::post('/api/v1/coaching-alignment/whats-next/update', function (Request $request) use ($API_secure) {
//     if ($API_secure && !$request->session()->get('logged_in')) {
//         return response()->json(['message' => 'Unauthorized'], 401);
//     }

//     $validated = $request->validate([
//         'organization' => 'required|string',
//         'whatsNextItems' => 'required|array',
//     ]);

//     $organization = $validated['organization'];
//     $items = $validated['whatsNextItems'];

//     // Find or create the record
//     $record = CoachingAlignmentWhatsNext::firstOrCreate(
//         ['organizationName' => $organization]
//     );

//     // Save updated data
//     $record->coachingAlignmentWhatsNextData = [
//         'whatsNextItems' => $items,
//     ];
//     $record->save();

//     return response()->json(['message' => 'WhatsNext items updated successfully']);
// });


// ref: frontend\src\components\12.coaching-alignment\3.WhatsNext\WhatsNext.jsx
Route::post('/api/v1/coaching-alignment/whats-next/delete-item', function (Request $request) use ($API_secure) {
    if ($API_secure && !$request->session()->get('logged_in')) {
        return response()->json(['message' => 'Unauthorized'], 401);
    }

    $validated = $request->validate([
        'organization' => 'required|string',
        'itemToDelete' => 'required|string',
    ]);

    $record = CoachingAlignmentWhatsNext::where('organizationName', $validated['organization'])->first();

    if (!$record) {
        return response()->json(['message' => 'Organization record not found'], 404);
    }

    $data = $record->coachingAlignmentWhatsNextData;

    // Check if the key exists
    if (!isset($data['whatsNextItems']) || !is_array($data['whatsNextItems'])) {
        return response()->json(['message' => 'Invalid or missing whatsNextItems'], 400);
    }

    // Remove item
    $filtered = array_values(array_filter($data['whatsNextItems'], function ($item) use ($validated) {
        return $item !== $validated['itemToDelete'];
    }));

    $data['whatsNextItems'] = $filtered;
    $record->coachingAlignmentWhatsNextData = $data;
    $record->save();

    return response()->json(['message' => 'Item deleted successfully', 'whatsNextItems' => $filtered]);
});

// // ref: frontend\src\components\12.coaching-alignment\coachingAlignment.jsx
// Route::get('/api/v1/coaching-alignment/coaching-goals', function (Request $request) use ($API_secure) {
//     if ($API_secure) {
//         if (!$request->session()->get('logged_in')) {
//             return response()->json(['message' => 'Unauthorized'], 401);
//         }
//     }

//     $organization = $request->query('organization');

//     $data = [
//         'Chuck Gulledge Advisors, LLC' => [
//             'coachingGoalsItems' => ['Build high-impact team', 'Increase client engagement', 'Develop Momentum Hub'],
//         ],
//         'Collins Credit Union' => [
//             'coachingGoalsItems' => ['Improve leadership accountability', 'Launch new performance dashboard'],
//         ],
//         'Test Skeleton Loading' => [
//             'coachingGoalsItems' => ['-', '-', '-', '-'],
//         ],
//     ];

//     return response()->json($data[$organization] ?? ['coachingGoalsItems' => []]);
// });


// ref: frontend\src\components\12.coaching-alignment\coachingAlignment.jsx
Route::get('/api/v1/coaching-alignment/coaching-goals', function (Request $request) use ($API_secure) {
    if ($API_secure && !$request->session()->get('logged_in')) {
        return response()->json(['message' => 'Unauthorized'], 401);
    }

    $organization = $request->query('organization');

    if (!$organization) {
        return response()->json(['message' => 'Missing organization parameter'], 400);
    }

    $record = CoachingAlignmentCoachingGoal::where('organizationName', $organization)->first();

    if (!$record) {
        return response()->json(['coachingGoalsItems' => []]);  // Return empty structure if not found
    }

    return response()->json($record->coachingAlignmentCoachingGoalsData ?? ['coachingGoalsItems' => []]);
});


// ref: frontend\src\components\12.coaching-alignment\4.CoachingGoals\CoachingGoals.jsx
Route::post('/api/v1/coaching-alignment/coaching-goals/update', function (Request $request) use ($API_secure) {
    if ($API_secure && !$request->session()->get('logged_in')) {
        return response()->json(['message' => 'Unauthorized'], 401);
    }

    $organization = $request->input('organization');
    $goalsItems = $request->input('coachingGoalsItems', []); // default empty array if missing

    $record = CoachingAlignmentCoachingGoal::firstOrCreate(
        ['organizationName' => $organization]
    );

    $record->coachingAlignmentCoachingGoalsData = [
        'coachingGoalsItems' => $goalsItems,
    ];

    $record->save();

    return response()->json(['message' => 'Coaching goals updated successfully']);
});

// Route::post('/api/v1/coaching-alignment/coaching-goals/update', function (Request $request) use ($API_secure) {
//     if ($API_secure && !$request->session()->get('logged_in')) {
//         return response()->json(['message' => 'Unauthorized'], 401);
//     }

//     // ✅ Validate input
//     $validated = $request->validate([
//         'organization' => 'required|string',
//         'coachingGoalsItems' => 'required|array',
//     ]);

//     // ✅ Find or create record by organizationName
//     $record = CoachingAlignmentCoachingGoal::firstOrCreate(
//         ['organizationName' => $validated['organization']]
//     );

//     // ✅ Update data
//     $record->coachingAlignmentCoachingGoalsData = [
//         'coachingGoalsItems' => $validated['coachingGoalsItems'],
//     ];

//     $record->save();

//     return response()->json(['message' => 'Coaching goals updated successfully']);
// });


// ref: frontend\src\components\12.coaching-alignment\4.CoachingGoals\CoachingGoals.jsx
Route::post('/api/v1/coaching-alignment/coaching-goals/delete-item', function (Request $request) use ($API_secure) {
    if ($API_secure && !$request->session()->get('logged_in')) {
        return response()->json(['message' => 'Unauthorized'], 401);
    }

    // ✅ Validate input
    $validated = $request->validate([
        'organization' => 'required|string',
        'itemToDelete' => 'required|string',
    ]);

    $record = CoachingAlignmentCoachingGoal::where('organizationName', $validated['organization'])->first();

    if (!$record) {
        return response()->json(['message' => 'Record not found'], 404);
    }

    $data = $record->coachingAlignmentCoachingGoalsData;

    if (!isset($data['coachingGoalsItems']) || !is_array($data['coachingGoalsItems'])) {
        return response()->json(['message' => 'Invalid data format'], 400);
    }

    // ✅ Filter out the item to delete
    $filteredItems = array_filter($data['coachingGoalsItems'], function ($item) use ($validated) {
        return $item !== $validated['itemToDelete'];
    });

    // ✅ Reindex array
    $data['coachingGoalsItems'] = array_values($filteredItems);

    // ✅ Save updated data
    $record->coachingAlignmentCoachingGoalsData = $data;
    $record->save();

    return response()->json(['message' => 'Item deleted successfully']);
});


// // ref: // frontend\src\components\13a.issues\Issues.jsx
// Route::get('/api/v1/tools/issues', function (Request $request) {
//     $organization = $request->query('organization');

//     $data = [
//         'Chuck Gulledge Advisors, LLC' => [
//             [
//                 'id' => 1,
//                 'issueName' => 'System Issue 1',
//                 'description' => 'Systematize Coaching Framework (now called Momentum OS).',
//                 'status' => '100.00%',
//                 'dateLogged' => '2025-03-31',
//                 'who' => 'Kayven',
//                 'resolution' => 'resolution here',
//                 'dateResolved' => '2025-04-02',
//             ],
//             [
//                 'id' => 2,
//                 'issueName' => 'System Issue 2',
//                 'description' => 'Systematize Client Delivery.',
//                 'status' => '83.33%',
//                 'dateLogged' => '2025-03-29',
//                 'who' => 'Kayven',
//                 'resolution' => 'resolution here 1',
//                 'dateResolved' => '2025-04-03',
//             ],
//             [
//                 'id' => 3,
//                 'issueName' => 'System Issue 2',
//                 'description' => 'Develop online Portal for Clients (Momentum Hub).',
//                 'status' => '0.00%',
//                 'dateLogged' => '2025-03-28',
//                 'who' => 'Kayven',
//                 'resolution' => 'resolution here 2',
//                 'dateResolved' => '2025-04-03',
//             ],
//             [
//                 'id' => 4,
//                 'issueName' => 'System Issue 3',
//                 'description' => 'Develop lead generation systems.',
//                 'status' => '50.00%',
//                 'dateLogged' => '2025-03-27',
//                 'who' => 'Kayven',
//                 'resolution' => 'resolution here 3',
//                 'dateResolved' => '2025-04-04',
//             ],
//             [
//                 'id' => 5,
//                 'issueName' => 'System Issue 4',
//                 'description' => '1% Genius Version 3 Development.',
//                 'status' => '50.00%',
//                 'dateLogged' => '2025-03-26',
//                 'who' => 'Kayven',
//                 'resolution' => 'resolution here 4',
//                 'dateResolved' => '2025-04-05',
//             ],
//         ],

//         'Collins Credit Union' => [
//             [
//                 'id' => 1,
//                 'issueName' => 'Login Delay Bug',
//                 'description' => 'Users experience delay when logging in via mobile app.',
//                 'status' => '70.00%',
//                 'dateLogged' => '2025-04-01',
//                 'who' => 'John Smith',
//                 'resolution' => 'Increased server cache and optimized query',
//                 'dateResolved' => '2025-04-06',
//             ],
//             [
//                 'id' => 2,
//                 'issueName' => 'Loan Processing API Timeout',
//                 'description' => 'Timeout during peak hours on loan API.',
//                 'status' => '100.00%',
//                 'dateLogged' => '2025-04-02',
//                 'who' => 'Jane Doe',
//                 'resolution' => 'Upgraded server tier and added background job queue.',
//                 'dateResolved' => '2025-04-07',
//             ],
//             [
//                 'id' => 3,
//                 'issueName' => 'UI Bug on Dashboard',
//                 'description' => 'Misaligned chart legends in the dashboard.',
//                 'status' => '100.00%',
//                 'dateLogged' => '2025-04-03',
//                 'who' => 'Emily Davis',
//                 'resolution' => 'Updated CSS and component layout.',
//                 'dateResolved' => '2025-04-08',
//             ],
//             [
//                 'id' => 4,
//                 'issueName' => 'PDF Export Not Working',
//                 'description' => 'Export to PDF fails for reports over 10 pages.',
//                 'status' => '90.00%',
//                 'dateLogged' => '2025-04-04',
//                 'who' => 'Michael Lee',
//                 'resolution' => 'Pagination fix and memory limit increased.',
//                 'dateResolved' => '2025-04-09',
//             ],
//             [
//                 'id' => 5,
//                 'issueName' => 'Delayed Notifications',
//                 'description' => 'Push notifications arriving late on Android.',
//                 'status' => '60.00%',
//                 'dateLogged' => '2025-04-05',
//                 'who' => 'Olivia Brown',
//                 'resolution' => 'Investigating Firebase token refresh issues.',
//                 'dateResolved' => '',
//             ],
//         ],

//         'Test Skeleton Loading' => [],
//     ];

//     return response()->json($data[$organization] ?? []);
// });



// ref: frontend\src\components\13a.issues\Issues.jsx
Route::get('/api/v1/tools/issues', function (Request $request) {
    $organization = $request->query('organization');

    if (!$organization) {
        return response()->json(['message' => 'Organization is required'], 400);
    }

    $record = ToolsIssue::where('organizationName', $organization)->first();

    if (!$record || !$record->toolsIssuesData) {
        return response()->json([]);
    }

    return response()->json($record->toolsIssuesData);
});


// ref: frontend\src\components\13a.issues\1.IssueTable\IssueTable.jsx
Route::post('/api/v1/tools/issues/update', function (Request $request) use ($API_secure) {
    if ($API_secure && !$request->session()->get('logged_in')) {
        return response()->json(['message' => 'Unauthorized'], 401);
    }

    $organization = $request->input('organization');
    $newData = $request->input('toolsIssuesData', []);

    if (!$organization) {
        return response()->json(['message' => 'Organization is required'], 400);
    }

    $record = ToolsIssue::where('organizationName', $organization)->first();

    if (!$record) {
        return response()->json(['message' => 'No record found for this organization'], 404);
    }

    $record->toolsIssuesData = $newData;
    $record->save();

    return response()->json(['message' => 'Tools Issues data updated successfully']);
});

// Route::post('/api/v1/tools/issues/update', function (Request $request) use ($API_secure) {
//     if ($API_secure) {
//         if (!$request->session()->get('logged_in')) {
//             return response()->json(['message' => 'Unauthorized'], 401);
//         }
//     }

//     $organization = $request->input('organization');
//     $newData = $request->input('toolsIssuesData');

//     // if (!$organization || !$newData || !is_array($newData)) {
//     //     return response()->json(['message' => 'Organization and toolsIssuesData are required and must be valid'], 400);
//     // }

//     $record = ToolsIssue::where('organizationName', $organization)->first();

//     if (!$record) {
//         return response()->json(['message' => 'No record found for this organization'], 404);
//     }

//     $record->toolsIssuesData = $newData;
//     $record->save();

//     return response()->json(['message' => 'Tools Issues data updated successfully']);
// });



// ref: frontend\src\components\13a.issues\1.IssueTable\IssueTable.jsx
Route::post('/api/v1/tools/issues/add', function (Request $request) use ($API_secure) {
    if ($API_secure && !$request->session()->get('logged_in')) {
        return response()->json(['message' => 'Unauthorized'], 401);
    }

    $validated = $request->validate([
        'organization' => 'required|string',
        'issue' => 'required|array',
        'issue.issueName' => 'required|string',
        'issue.description' => 'required|string',
        'issue.dateLogged' => 'required|date',
        'issue.who' => 'required|string',
        'issue.resolution' => 'required|string',
        'issue.dateResolved' => 'required|date',
    ]);

    $organization = $validated['organization'];
    $newIssue = $validated['issue'];

    // Find or create record
    $record = ToolsIssue::firstOrCreate(['organizationName' => $organization]);

    // Decode current data or initialize empty array
    $currentData = $record->toolsIssuesData ?? [];

    // Reindex to ensure IDs are unique and consistent
    $maxId = collect($currentData)->pluck('id')->max() ?? 0;
    $newIssue['id'] = $maxId + 1;

    // Append the new issue
    $currentData[] = $newIssue;

    // Save back to DB
    $record->toolsIssuesData = $currentData;
    $record->save();

    return response()->json([
        'message' => 'New issue added successfully.',
        'newItem' => $newIssue,
        'fullData' => $currentData,
    ]);
});



// // ref: frontend\src\components\13b.victories\Victories.jsx
// Route::get('/api/v1/tools/victories', function (Request $request) use ($API_secure) {
//     if ($API_secure) {
//         if (!$request->session()->get('logged_in')) {
//             return response()->json(['message' => 'Unauthorized'], 401);
//         }
//     }

//     $organization = $request->query('organization');

//     $data = [
//         'Chuck Gulledge Advisors, LLC' => [
//             [
//                 'id' => 1,
//                 'date' => '2025-04-02',
//                 'who' => 'Kayven',
//                 'milestones' => 'Systematize Coaching Framework (now called Momentum OS).',
//                 'notes' => 'Notes ',
//             ],
//             [
//                 'id' => 2,
//                 'date' => '2025-04-03',
//                 'who' => 'Kayven',
//                 'milestones' => 'Systematize Client Delivery.',
//                 'notes' => 'Notes 1',
//             ],
//             [
//                 'id' => 3,
//                 'date' => '2025-04-03',
//                 'who' => 'Kayven',
//                 'milestones' => 'Develop online Portal for Clients with Beta completed with eDoc by March 31 (now called Momentum Hub).',
//                 'notes' => 'Notes 2',
//             ],
//             [
//                 'id' => 4,
//                 'date' => '2025-04-04',
//                 'who' => 'Kayven',
//                 'milestones' => 'Develop lead generation systems.',
//                 'notes' => 'Notes 3',
//             ],
//             [
//                 'id' => 5,
//                 'date' => '2025-04-05',
//                 'who' => 'Kayven',
//                 'milestones' => '1% Genius Version 3 Development.',
//                 'notes' => 'Notes 4',
//             ],
//         ],

//         'Collins Credit Union' => [
//             [
//                 'id' => 1,
//                 'date' => '2025-04-06',
//                 'who' => 'John Smith',
//                 'milestones' => 'Launched AI-driven customer service chatbot.',
//                 'notes' => 'Initial rollout shows 30% reduction in support tickets.',
//             ],
//             [
//                 'id' => 2,
//                 'date' => '2025-04-07',
//                 'who' => 'Jane Doe',
//                 'milestones' => 'Completed mobile app redesign.',
//                 'notes' => 'User engagement up by 12% in first week.',
//             ],
//             [
//                 'id' => 3,
//                 'date' => '2025-04-08',
//                 'who' => 'Emily Davis',
//                 'milestones' => 'Automated loan processing system deployed.',
//                 'notes' => 'Cut processing time from 3 days to 6 hours.',
//             ],
//             [
//                 'id' => 4,
//                 'date' => '2025-04-09',
//                 'who' => 'Michael Lee',
//                 'milestones' => 'Introduced real-time fraud alerts.',
//                 'notes' => 'Detected 4 threats in pilot phase.',
//             ],
//             [
//                 'id' => 5,
//                 'date' => '2025-04-10',
//                 'who' => 'Olivia Brown',
//                 'milestones' => 'Launched new client onboarding workflow.',
//                 'notes' => 'Feedback indicates smoother experience for 95% of users.',
//             ],
//         ],

//         'Test Skeleton Loading' => [],
//     ];

//     return response()->json($data[$organization] ?? []);
// });

// ref: frontend\src\components\13b.victories\Victories.jsx
Route::get('/api/v1/tools/victories', function (Request $request) use ($API_secure) {
    if ($API_secure && !$request->session()->get('logged_in')) {
        return response()->json(['message' => 'Unauthorized'], 401);
    }

    $organization = $request->query('organization');

    if (!$organization) {
        return response()->json(['message' => 'Organization name is required'], 400);
    }

    $record = ToolsVictory::where('organizationName', $organization)->first();

    if (!$record) {
        return response()->json(['message' => 'No record found for this organization'], 404);
    }

    return response()->json($record->toolsVictoriesData ?? []);
});


// ref: frontend\src\components\13b.victories\1.VictoriesTable\VictoriesTable.jsx
Route::post('/api/v1/tools/victories/update', function (Request $request) use ($API_secure) {
    if ($API_secure && !$request->session()->get('logged_in')) {
        return response()->json(['message' => 'Unauthorized'], 401);
    }

    $organization = $request->input('organization');
    $victoriesData = $request->input('toolsVictoriesData', []); // default to empty array if missing

    if (!$organization) {
        return response()->json(['message' => 'Organization is required'], 400);
    }

    $record = ToolsVictory::where('organizationName', $organization)->first();

    if (!$record) {
        return response()->json(['message' => 'No record found for this organization'], 404);
    }

    $record->toolsVictoriesData = $victoriesData;
    $record->save();

    return response()->json([
        'message' => 'Tools Victories data updated successfully.',
        'data' => $record->toolsVictoriesData,
    ]);
});


// Route::post('/api/v1/tools/victories/update', function (Request $request) use ($API_secure) {
//     if ($API_secure && !$request->session()->get('logged_in')) {
//         return response()->json(['message' => 'Unauthorized'], 401);
//     }

//     $validated = $request->validate([
//         'organization' => 'required|string',
//         'toolsVictoriesData' => 'required|array',
//     ]);

//     $organization = $validated['organization'];
//     $victoriesData = $validated['toolsVictoriesData'];

//     $record = ToolsVictory::where('organizationName', $organization)->first();

//     if (!$record) {
//         return response()->json(['message' => 'No record found for this organization'], 404);
//     }

//     $record->toolsVictoriesData = $victoriesData;
//     $record->save();

//     return response()->json([
//         'message' => 'Tools Victories data updated successfully.',
//         'data' => $record->toolsVictoriesData,
//     ]);
// });


// ref: frontend\src\components\13b.victories\1.VictoriesTable\VictoriesTable.jsx
Route::post('/api/v1/tools/victories/add', function (Request $request) use ($API_secure) {
    if ($API_secure && !$request->session()->get('logged_in')) {
        return response()->json(['message' => 'Unauthorized'], 401);
    }

    $validated = $request->validate([
        'organization' => 'required|string',
        'victory' => 'required|array',
        'victory.date' => 'required|date',
        'victory.who' => 'required|string',
        'victory.milestones' => 'required|string',
        'victory.notes' => 'nullable|string',
    ]);

    $organization = $validated['organization'];
    $newVictory = $validated['victory'];

    // Find or create the record
    $record = ToolsVictory::firstOrCreate(['organizationName' => $organization]);

    // Get current data
    $currentData = $record->toolsVictoriesData ?? [];

    // Assign a new ID
    $maxId = collect($currentData)->pluck('id')->max() ?? 0;
    $newVictory['id'] = $maxId + 1;

    // Append new item
    $currentData[] = $newVictory;

    // Save
    $record->toolsVictoriesData = $currentData;
    $record->save();

    return response()->json([
        'message' => 'Victory added successfully.',
        'newItem' => $newVictory,
        'fullData' => $currentData,
    ]);
});


// // ref: frontend\src\components\13c.big-ideas\BigIdeas.jsx
// Route::get('/api/v1/tools/big-ideas', function (Request $request) use ($API_secure) {
//     if ($API_secure) {
//         if (!$request->session()->get('logged_in')) {
//             return response()->json(['message' => 'Unauthorized'], 401);
//         }
//     }

//     $organization = $request->query('organization');

//     $data = [
        // 'Chuck Gulledge Advisors, LLC' => [
        //     [
        //         'id' => 1,
        //         'date' => '2025-04-02',
        //         'who' => 'Kayven',
        //         'description' => 'Systematize Coaching Framework (now called Momentum OS).',
        //         'impact' => 'High',
        //         'when' => '2025-04-02',
        //         'evaluator' => 'Team A',
        //         'comments' => 'Notes',
        //     ],
        //     [
        //         'id' => 2,
        //         'date' => '2025-04-03',
        //         'who' => 'Kayven',
        //         'description' => 'Systematize Client Delivery.',
        //         'impact' => 'Medium',
        //         'when' => '2025-04-02',
        //         'evaluator' => 'Team A',
        //         'comments' => 'Notes 1',
        //     ],
        //     [
        //         'id' => 3,
        //         'date' => '2025-04-03',
        //         'who' => 'Kayven',
        //         'description' => 'Develop online Portal for Clients with Beta completed with eDoc by March 31 (now called Momentum Hub).',
        //         'impact' => 'High',
        //         'when' => '2025-04-02',
        //         'evaluator' => 'Team B',
        //         'comments' => 'Notes 2',
        //     ],
        //     [
        //         'id' => 4,
        //         'date' => '2025-04-04',
        //         'who' => 'Kayven',
        //         'description' => 'Develop lead generation systems.',
        //         'impact' => 'Medium',
        //         'when' => '2025-04-02',
        //         'evaluator' => 'Team B',
        //         'comments' => 'Notes 3',
        //     ],
        //     [
        //         'id' => 5,
        //         'date' => '2025-04-05',
        //         'who' => 'Kayven',
        //         'description' => '1% Genius Version 3 Development.',
        //         'impact' => 'High',
        //         'when' => '2025-04-02',
        //         'evaluator' => 'Team C',
        //         'comments' => 'Notes 4',
        //     ],
        // ],

//         'Collins Credit Union' => [
//             [
//                 'id' => 1,
//                 'date' => '2025-04-10',
//                 'who' => 'John Smith',
//                 'description' => 'Implement AI-powered fraud detection system.',
//                 'impact' => 'High',
//                 'when' => '2025-04-12',
//                 'evaluator' => 'Compliance Team',
//                 'comments' => 'Could significantly reduce manual work.',
//             ],
//             [
//                 'id' => 2,
//                 'date' => '2025-04-11',
//                 'who' => 'Jane Doe',
//                 'description' => 'Develop mobile-first loan application flow.',
//                 'impact' => 'Medium',
//                 'when' => '2025-04-15',
//                 'evaluator' => 'Product Team',
//                 'comments' => 'Requires UX review and integration.',
//             ],
//             [
//                 'id' => 3,
//                 'date' => '2025-04-12',
//                 'who' => 'Emily Davis',
//                 'description' => 'Launch customer rewards pilot program.',
//                 'impact' => 'High',
//                 'when' => '2025-04-20',
//                 'evaluator' => 'Marketing Team',
//                 'comments' => 'Align with Q2 marketing calendar.',
//             ],
//             [
//                 'id' => 4,
//                 'date' => '2025-04-13',
//                 'who' => 'Mark Thompson',
//                 'description' => 'Introduce automated document verification.',
//                 'impact' => 'Medium',
//                 'when' => '2025-04-18',
//                 'evaluator' => 'Operations Team',
//                 'comments' => 'Needs vendor evaluation.',
//             ],
//             [
//                 'id' => 5,
//                 'date' => '2025-04-14',
//                 'who' => 'Sarah Lee',
//                 'description' => 'Enhance chatbot with multi-language support.',
//                 'impact' => 'High',
//                 'when' => '2025-04-25',
//                 'evaluator' => 'Tech Team',
//                 'comments' => 'Customer demand in bilingual regions.',
//             ],
//         ],

//         'Test Skeleton Loading' => [],
//     ];

//     return response()->json($data[$organization] ?? []);
// });

// ref: frontend\src\components\13c.big-ideas\BigIdeas.jsx
Route::get('/api/v1/tools/big-ideas', function (Request $request) use ($API_secure) {
    if ($API_secure && !$request->session()->get('logged_in')) {
        return response()->json(['message' => 'Unauthorized'], 401);
    }

    $organization = $request->query('organization');

    if (!$organization) {
        return response()->json(['message' => 'Missing organization name'], 400);
    }

    $record = ToolsBigIdea::where('organizationName', $organization)->first();

    if (!$record) {
        return response()->json(['message' => 'No record found'], 404);
    }

    return response()->json($record->toolsBigIdeasData ?? []);
});


// ref: frontend\src\components\13c.big-ideas\1.BigIdeasTable\BigIdeasTable.jsx
Route::post('/api/v1/tools/big-ideas/update', function (Request $request) use ($API_secure) {
    if ($API_secure && !$request->session()->get('logged_in')) {
        return response()->json(['message' => 'Unauthorized'], 401);
    }

    $organization = $request->input('organization');
    $bigIdeasData = $request->input('toolsBigIdeasData', []);

    if (!$organization) {
        return response()->json(['message' => 'Organization is required'], 400);
    }

    $record = ToolsBigIdea::where('organizationName', $organization)->first();

    if (!$record) {
        return response()->json(['message' => 'No record found for this organization'], 404);
    }

    $record->toolsBigIdeasData = $bigIdeasData;
    $record->save();

    return response()->json([
        'message' => 'Tools Big Ideas data updated successfully.',
        'data' => $record->toolsBigIdeasData,
    ]);
});


// Route::post('/api/v1/tools/big-ideas/update', function (Request $request) use ($API_secure) {
//     if ($API_secure && !$request->session()->get('logged_in')) {
//         return response()->json(['message' => 'Unauthorized'], 401);
//     }

//     $validated = $request->validate([
//         'organization' => 'required|string',
//         'toolsBigIdeasData' => 'required|array',
//     ]);

//     $record = ToolsBigIdea::where('organizationName', $validated['organization'])->first();

//     if (!$record) {
//         return response()->json(['message' => 'No record found for this organization'], 404);
//     }

//     $record->toolsBigIdeasData = $validated['toolsBigIdeasData'];
//     $record->save();

//     return response()->json([
//         'message' => 'Tools Big Ideas data updated successfully.',
//         'data' => $record->toolsBigIdeasData,
//     ]);
// });

// ref: frontend\src\components\13c.big-ideas\1.BigIdeasTable\BigIdeasTable.jsx
Route::post('/api/v1/tools/big-ideas/add', function (Request $request) use ($API_secure) {
    if ($API_secure && !$request->session()->get('logged_in')) {
        return response()->json(['message' => 'Unauthorized'], 401);
    }

    $validated = $request->validate([
        'organization' => 'required|string',
        'bigIdea' => 'required|array',
        'bigIdea.date' => 'required|date',
        'bigIdea.who' => 'required|string',
        'bigIdea.description' => 'required|string',
        'bigIdea.impact' => 'required|string',
        'bigIdea.when' => 'required|date',
        'bigIdea.evaluator' => 'required|string',
        'bigIdea.comments' => 'nullable|string',
    ]);

    $organization = $validated['organization'];
    $newIdea = $validated['bigIdea'];

    // Find or create record
    $record = ToolsBigIdea::firstOrCreate(['organizationName' => $organization]);

    // Current data
    $currentData = $record->toolsBigIdeasData ?? [];

    // Assign new ID
    $maxId = collect($currentData)->pluck('id')->max() ?? 0;
    $newIdea['id'] = $maxId + 1;

    // Append
    $currentData[] = $newIdea;

    // Save
    $record->toolsBigIdeasData = $currentData;
    $record->save();

    return response()->json([
        'message' => 'Big Idea added successfully.',
        'newItem' => $newIdea,
        'fullData' => $currentData,
    ]);
});



// // ref: frontend\src\components\13d.product-evaluation-grid\ProductEvaluationGrid.jsx
// Route::get('/api/v1/tools/product-evaluation-grid', function (Request $request) use ($API_secure) {
//     if ($API_secure) {
//         if (!$request->session()->get('logged_in')) {
//             return response()->json(['message' => 'Unauthorized'], 401);
//         }
//     }

//     $organization = $request->query('organization');

//     $data = [
//         'Chuck Gulledge Advisors, LLC' => [
//             [
//                 'id' => 1,
//                 'productName' => 'Momentum OS',
//                 'description' => 'Systematize Coaching Framework (now called Momentum OS).',
//                 'pricingPower' => 'High',
//                 'acceleratingGrowth' => 'Yes',
//                 'profitMargin' => '60%',
//                 'marketShare' => '10%',
//                 'customerSatisfaction' => 'Excellent',
//                 'innovationPotential' => 'High',
//                 'operationEfficiency' => 'Strong',
//                 'lifeCycleStage' => 'Growth',
//             ],
//             [
//                 'id' => 2,
//                 'productName' => 'Client Delivery System',
//                 'description' => 'Systematize Client Delivery.',
//                 'pricingPower' => 'Medium',
//                 'acceleratingGrowth' => 'Yes',
//                 'profitMargin' => '55%',
//                 'marketShare' => '8%',
//                 'customerSatisfaction' => 'Good',
//                 'innovationPotential' => 'Medium',
//                 'operationEfficiency' => 'Moderate',
//                 'lifeCycleStage' => 'Growth',
//             ],
//             [
//                 'id' => 3,
//                 'productName' => 'Momentum Hub',
//                 'description' => 'Online Portal for Clients (Beta completed with eDoc by March 31).',
//                 'pricingPower' => 'High',
//                 'acceleratingGrowth' => 'No',
//                 'profitMargin' => '0%',
//                 'marketShare' => '0%',
//                 'customerSatisfaction' => 'Pending',
//                 'innovationPotential' => 'High',
//                 'operationEfficiency' => 'Early',
//                 'lifeCycleStage' => 'Introduction',
//             ],
//             [
//                 'id' => 4,
//                 'productName' => 'Lead Gen System',
//                 'description' => 'Develop lead generation systems.',
//                 'pricingPower' => 'Medium',
//                 'acceleratingGrowth' => 'Yes',
//                 'profitMargin' => '50%',
//                 'marketShare' => '5%',
//                 'customerSatisfaction' => 'Average',
//                 'innovationPotential' => 'Medium',
//                 'operationEfficiency' => 'Developing',
//                 'lifeCycleStage' => 'Development',
//             ],
//             [
//                 'id' => 5,
//                 'productName' => '1% Genius v3',
//                 'description' => '1% Genius Version 3 Development.',
//                 'pricingPower' => 'High',
//                 'acceleratingGrowth' => 'Yes',
//                 'profitMargin' => '65%',
//                 'marketShare' => '12%',
//                 'customerSatisfaction' => 'Excellent',
//                 'innovationPotential' => 'Very High',
//                 'operationEfficiency' => 'Optimized',
//                 'lifeCycleStage' => 'Maturity',
//             ],
//         ],

//         'Collins Credit Union' => [
//             [
//                 'id' => 1,
//                 'productName' => 'Member Insights Platform',
//                 'description' => 'Tool for analyzing member behavior and feedback.',
//                 'pricingPower' => 'High',
//                 'acceleratingGrowth' => 'Yes',
//                 'profitMargin' => '58%',
//                 'marketShare' => '9%',
//                 'customerSatisfaction' => 'Excellent',
//                 'innovationPotential' => 'High',
//                 'operationEfficiency' => 'Optimized',
//                 'lifeCycleStage' => 'Growth',
//             ],
//             [
//                 'id' => 2,
//                 'productName' => 'Loan Automation Suite',
//                 'description' => 'Automated end-to-end loan processing system.',
//                 'pricingPower' => 'Medium',
//                 'acceleratingGrowth' => 'Yes',
//                 'profitMargin' => '62%',
//                 'marketShare' => '7%',
//                 'customerSatisfaction' => 'Good',
//                 'innovationPotential' => 'Medium',
//                 'operationEfficiency' => 'Efficient',
//                 'lifeCycleStage' => 'Maturity',
//             ],
//             [
//                 'id' => 3,
//                 'productName' => 'Digital Branch App',
//                 'description' => 'Mobile-first banking app for members.',
//                 'pricingPower' => 'High',
//                 'acceleratingGrowth' => 'No',
//                 'profitMargin' => '48%',
//                 'marketShare' => '4%',
//                 'customerSatisfaction' => 'Pending',
//                 'innovationPotential' => 'High',
//                 'operationEfficiency' => 'Developing',
//                 'lifeCycleStage' => 'Introduction',
//             ],
//             [
//                 'id' => 4,
//                 'productName' => 'Compliance Tracker',
//                 'description' => 'Tracks internal compliance metrics in real-time.',
//                 'pricingPower' => 'Medium',
//                 'acceleratingGrowth' => 'Yes',
//                 'profitMargin' => '53%',
//                 'marketShare' => '6%',
//                 'customerSatisfaction' => 'Average',
//                 'innovationPotential' => 'Medium',
//                 'operationEfficiency' => 'Strong',
//                 'lifeCycleStage' => 'Growth',
//             ],
//             [
//                 'id' => 5,
//                 'productName' => 'Virtual Advisor Bot',
//                 'description' => 'AI chatbot that assists members with inquiries.',
//                 'pricingPower' => 'High',
//                 'acceleratingGrowth' => 'Yes',
//                 'profitMargin' => '70%',
//                 'marketShare' => '11%',
//                 'customerSatisfaction' => 'Excellent',
//                 'innovationPotential' => 'Very High',
//                 'operationEfficiency' => 'Optimized',
//                 'lifeCycleStage' => 'Maturity',
//             ],
//         ],

//         'Test Skeleton Loading' => [],
//     ];

//     return response()->json($data[$organization] ?? []);
// });

// ref: frontend\src\components\13d.product-evaluation-grid\ProductEvaluationGrid.jsx
Route::get('/api/v1/tools/product-evaluation-grid', function (Request $request) use ($API_secure) {
    if ($API_secure && !$request->session()->get('logged_in')) {
        return response()->json(['message' => 'Unauthorized'], 401);
    }

    $organization = $request->query('organization');

    if (!$organization) {
        return response()->json(['message' => 'Missing organization parameter'], 400);
    }

    $record = ToolsProductEvaluationGrid::where('organizationName', $organization)->first();

    if (!$record) {
        return response()->json(['message' => 'No data found for this organization'], 404);
    }

    return response()->json($record->toolsProductEvaluationGridsData ?? []);
});


// ref: frontend\src\components\13d.product-evaluation-grid\1.ProductEvaluationGridTable\ProductEvaluationGridTable.jsx
Route::post('/api/v1/tools/product-evaluation-grid/update', function (Request $request) use ($API_secure) {
    if ($API_secure && !$request->session()->get('logged_in')) {
        return response()->json(['message' => 'Unauthorized'], 401);
    }

    $organization = $request->input('organization');
    $updatedData = $request->input('reordered', []); // default to empty array if missing

    if (!$organization) {
        return response()->json(['message' => 'Organization is required'], 400);
    }

    $record = ToolsProductEvaluationGrid::where('organizationName', $organization)->first();

    if (!$record) {
        return response()->json(['message' => 'Record not found for organization'], 404);
    }

    $record->toolsProductEvaluationGridsData = $updatedData;
    $record->save();

    return response()->json([
        'message' => 'Product Evaluation Grid updated successfully.',
        'updatedData' => $updatedData,
    ]);
});

// Route::post('/api/v1/tools/product-evaluation-grid/update', function (Request $request) use ($API_secure) {
//     if ($API_secure && !$request->session()->get('logged_in')) {
//         return response()->json(['message' => 'Unauthorized'], 401);
//     }

//     $validated = $request->validate([
//         'organization' => 'required|string',
//         'reordered' => 'required|array',
//     ]);

//     $organization = $validated['organization'];
//     $updatedData = $validated['reordered'];

//     $record = ToolsProductEvaluationGrid::where('organizationName', $organization)->first();

//     if (!$record) {
//         return response()->json(['message' => 'Record not found for organization'], 404);
//     }

//     $record->toolsProductEvaluationGridsData = $updatedData;
//     $record->save();

//     return response()->json([
//         'message' => 'Product Evaluation Grid updated successfully.',
//         'updatedData' => $updatedData,
//     ]);
// });

// ref: frontend\src\components\13d.product-evaluation-grid\1.ProductEvaluationGridTable\ProductEvaluationGridTable.jsx
Route::post('/api/v1/tools/product-evaluation-grid/add', function (Request $request) use ($API_secure) {
    if ($API_secure && !$request->session()->get('logged_in')) {
        return response()->json(['message' => 'Unauthorized'], 401);
    }

    $validated = $request->validate([
        'organization' => 'required|string',
        'entry' => 'required|array',
        'entry.productName' => 'required|string',
        'entry.description' => 'required|string',
        'entry.pricingPower' => 'required|string',
        'entry.acceleratingGrowth' => 'required|string',
        'entry.profitMargin' => 'required|string',
        'entry.marketShare' => 'required|string',
        'entry.customerSatisfaction' => 'required|string',
        'entry.innovationPotential' => 'required|string',
        'entry.operationEfficiency' => 'required|string',
        'entry.lifeCycleStage' => 'required|string',
    ]);

    $organization = $validated['organization'];
    $newEntry = $validated['entry'];

    // Find or create the record
    $record = ToolsProductEvaluationGrid::firstOrCreate(['organizationName' => $organization]);

    // Get current data
    $currentData = $record->toolsProductEvaluationGridsData ?? [];

    // Assign a new ID
    $maxId = collect($currentData)->pluck('id')->max() ?? 0;
    $newEntry['id'] = $maxId + 1;

    // Append new item
    $currentData[] = $newEntry;

    // Save
    $record->toolsProductEvaluationGridsData = $currentData;
    $record->save();

    return response()->json([
        'message' => 'Entry added successfully.',
        'newItem' => $newEntry,
        'fullData' => $currentData,
    ]);
});


// // ref: frontend\src\components\14.document-vault\documentVault.jsx
// Route::get('/api/v1/document-vault/list', function (Request $request) use ($API_secure) {
//     if ($API_secure) {
//         if (!$request->session()->get('logged_in')) {
//             return response()->json(['message' => 'Unauthorized'], 401);
//         }
//         $user = $request->session()->get('user');
//     }

//     $organization = $request->query('organization');

//     $data = [
//         'Chuck Gulledge Advisors, LLC' => [
//             [
//                 'id' => 1,
//                 'projectName' => 'Momentum OS',
//                 'date' => '2025-03-28',
//                 'link' => 'https://drive.google.com/file/d/1OsPZ8-DMcW3IcYsbmy1J17iDSnp9_w0W/view?usp=sharing',
//                 'viewLink' => 'https://drive.google.com/file/d/1OsPZ8-DMcW3IcYsbmy1J17iDSnp9_w0W/view?usp=sharing',
//                 'uploadLink' => '/file-upload/4uvvjdwVWJRBopUMhifaLxoA9jm6MCvDzkBhOm5p',
//                 'pdflink' => '/storage/4uvvjdwVWJRBopUMhifaLxoA9jm6MCvDzkBhOm5p/test.pdf',
//             ],
//             [
//                 'id' => 2,
//                 'projectName' => 'Client Delivery System',
//                 'date' => '2025-03-29',
//                 'link' => 'https://drive.google.com/file/d/1OsPZ8-DMcW3IcYsbmy1J17iDSnp9_w0W/view?usp=sharing',
//                 'viewLink' => 'https://drive.google.com/file/d/1OsPZ8-DMcW3IcYsbmy1J17iDSnp9_w0W/view?usp=sharing',
//                 'uploadLink' => '/file-upload/4uvvjdwVWJRBopUMhifaLxoA9jm6MCvDzkBhOm5p',
//                 'pdflink' => '/storage/4uvvjdwVWJRBopUMhifaLxoA9jm6MCvDzkBhOm5p/test.pdf',
//             ],
//             [
//                 'id' => 3,
//                 'projectName' => 'Momentum Hub',
//                 'date' => '2025-03-30',
//                 'link' => 'https://drive.google.com/file/d/1OsPZ8-DMcW3IcYsbmy1J17iDSnp9_w0W/view?usp=sharing',
//                 'viewLink' => 'https://drive.google.com/file/d/1OsPZ8-DMcW3IcYsbmy1J17iDSnp9_w0W/view?usp=sharing',
//                 'uploadLink' => '/file-upload/4uvvjdwVWJRBopUMhifaLxoA9jm6MCvDzkBhOm5p',
//                 'pdflink' => '/storage/4uvvjdwVWJRBopUMhifaLxoA9jm6MCvDzkBhOm5p/test.pdf',
//             ],
//             [
//                 'id' => 4,
//                 'projectName' => 'Lead Gen System',
//                 'date' => '2025-03-31',
//                 'link' => 'https://drive.google.com/file/d/1OsPZ8-DMcW3IcYsbmy1J17iDSnp9_w0W/view?usp=sharing',
//                 'viewLink' => 'https://drive.google.com/file/d/1OsPZ8-DMcW3IcYsbmy1J17iDSnp9_w0W/view?usp=sharing',
//                 'uploadLink' => '/file-upload/4uvvjdwVWJRBopUMhifaLxoA9jm6MCvDzkBhOm5p',
//                 'pdflink' => '/storage/4uvvjdwVWJRBopUMhifaLxoA9jm6MCvDzkBhOm5p/test.pdf',
//             ],
//             [
//                 'id' => 5,
//                 'projectName' => '1% Genius v3',
//                 'date' => '2025-04-01',
//                 'link' => 'https://drive.google.com/file/d/1OsPZ8-DMcW3IcYsbmy1J17iDSnp9_w0W/view?usp=sharing',
//                 'viewLink' => 'https://drive.google.com/file/d/1OsPZ8-DMcW3IcYsbmy1J17iDSnp9_w0W/view?usp=sharing',
//                 'uploadLink' => '/file-upload/4uvvjdwVWJRBopUMhifaLxoA9jm6MCvDzkBhOm5p',
//                 'pdflink' => '/storage/4uvvjdwVWJRBopUMhifaLxoA9jm6MCvDzkBhOm5p/test.pdf',
//             ],
//         ],
    
//         'Collins Credit Union' => [
//             [
//                 'id' => 1,
//                 'projectName' => 'Onboarding System Revamp',
//                 'date' => '2025-04-02',
//                 'link' => 'https://drive.google.com/file/d/2aExampleIdCCU1/view?usp=sharing',
//                 'viewLink' => 'https://drive.google.com/file/d/2aExampleIdCCU1/view?usp=sharing',
//                 'uploadLink' => '/file-upload/collins/onboarding-revamp',
//                 'pdflink' => '/storage/collins/onboarding-revamp/project.pdf',
//             ],
//             [
//                 'id' => 2,
//                 'projectName' => 'Internal Dashboard Launch',
//                 'date' => '2025-04-03',
//                 'link' => 'https://drive.google.com/file/d/2bExampleIdCCU2/view?usp=sharing',
//                 'viewLink' => 'https://drive.google.com/file/d/2bExampleIdCCU2/view?usp=sharing',
//                 'uploadLink' => '/file-upload/collins/internal-dashboard',
//                 'pdflink' => '/storage/collins/internal-dashboard/project.pdf',
//             ],
//             [
//                 'id' => 3,
//                 'projectName' => 'Customer Support Automation',
//                 'date' => '2025-04-04',
//                 'link' => 'https://drive.google.com/file/d/2cExampleIdCCU3/view?usp=sharing',
//                 'viewLink' => 'https://drive.google.com/file/d/2cExampleIdCCU3/view?usp=sharing',
//                 'uploadLink' => '/file-upload/collins/support-automation',
//                 'pdflink' => '/storage/collins/support-automation/project.pdf',
//             ],
//             [
//                 'id' => 4,
//                 'projectName' => 'Compliance Tracker 2.0',
//                 'date' => '2025-04-05',
//                 'link' => 'https://drive.google.com/file/d/2dExampleIdCCU4/view?usp=sharing',
//                 'viewLink' => 'https://drive.google.com/file/d/2dExampleIdCCU4/view?usp=sharing',
//                 'uploadLink' => '/file-upload/collins/compliance-tracker',
//                 'pdflink' => '/storage/collins/compliance-tracker/project.pdf',
//             ],
//             [
//                 'id' => 5,
//                 'projectName' => 'Mobile App Security Upgrade',
//                 'date' => '2025-04-06',
//                 'link' => 'https://drive.google.com/file/d/2eExampleIdCCU5/view?usp=sharing',
//                 'viewLink' => 'https://drive.google.com/file/d/2eExampleIdCCU5/view?usp=sharing',
//                 'uploadLink' => '/file-upload/collins/mobile-security',
//                 'pdflink' => '/storage/collins/mobile-security/project.pdf',
//             ],
//         ],
    
//         'Test Skeleton Loading' => [],
//     ];
    

//     return response()->json($data[$organization] ?? []);
// });

// ref: frontend\src\components\14.document-vault\documentVault.jsx
Route::get('/api/v1/document-vault/list', function (Request $request) use ($API_secure) {
    if ($API_secure) {
        if (!$request->session()->get('logged_in')) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }

        $user = $request->session()->get('user');
    }

    $organization = $request->query('organization');

    if (!$organization) {
        return response()->json(['message' => 'Missing organization query parameter'], 400);
    }

    $record = DocumentVault::where('organizationName', $organization)->first();

    if (!$record) {
        return response()->json([]);
    }

    return response()->json($record->documentVaultData ?? []);
});


// ref: frontend\src\components\14.document-vault\1.DocumentVaultTable\DocumentVaultTable.jsx
Route::post('/api/v1/document-vault/update', function (Request $request) use ($API_secure) {
    if ($API_secure && !$request->session()->get('logged_in')) {
        return response()->json(['message' => 'Unauthorized'], 401);
    }

    $organization = $request->input('organization');
    $newData = $request->input('documentVaultData', []); // default empty array if missing

    if (!$organization) {
        return response()->json(['message' => 'Organization is required'], 400);
    }

    $record = DocumentVault::where('organizationName', $organization)->first();

    if (!$record) {
        return response()->json(['message' => 'Record not found for organization: ' . $organization], 404);
    }

    $record->documentVaultData = $newData;
    $record->save();

    return response()->json([
        'message' => 'Document vault data updated successfully.',
        'updatedData' => $newData,
    ]);
});

// Route::post('/api/v1/document-vault/update', function (Request $request) use ($API_secure) {
//     if ($API_secure && !$request->session()->get('logged_in')) {
//         return response()->json(['message' => 'Unauthorized'], 401);
//     }

//     $validated = $request->validate([
//         'organization' => 'required|string',
//         'documentVaultData' => 'required|array',
//         'documentVaultData.*.id' => 'required|integer',
//         'documentVaultData.*.projectName' => 'required|string',
//         'documentVaultData.*.date' => 'required|date',
//         'documentVaultData.*.link' => 'nullable|string',
//         'documentVaultData.*.viewLink' => 'nullable|string',
//         'documentVaultData.*.uploadLink' => 'nullable|string',
//         'documentVaultData.*.pdflink' => 'nullable|string',
//     ]);

//     $organization = $validated['organization'];
//     $newData = $validated['documentVaultData'];

//     $record = DocumentVault::where('organizationName', $organization)->first();

//     if (!$record) {
//         return response()->json(['message' => 'Record not found for organization: ' . $organization], 404);
//     }

//     $record->documentVaultData = $newData;
//     $record->save();

//     return response()->json([
//         'message' => 'Document vault data updated successfully.',
//         'updatedData' => $newData,
//     ]);
// });


// ref: frontend\src\components\14.document-vault\1.DocumentVaultTable\DocumentVaultTable.jsx
Route::post('/api/v1/document-vault/add', function (Request $request) use ($API_secure) {
    if ($API_secure && !$request->session()->get('logged_in')) {
        return response()->json(['message' => 'Unauthorized'], 401);
    }

    $validated = $request->validate([
        'organization' => 'required|string',
        'cleanData' => 'required|array',
        'cleanData.projectName' => 'required|string',
        'cleanData.date' => 'required|date',
        'cleanData.link' => 'nullable|string',
        'cleanData.uploadLink' => 'nullable|string',
        'cleanData.pdflink' => 'nullable|string',
    ]);

    $organization = $validated['organization'];
    $cleanData = $validated['cleanData'];

    $record = DocumentVault::where('organizationName', $organization)->first();

    if (!$record) {
        return response()->json(['message' => 'Record not found.'], 404);
    }

    // Get existing data
    $existing = $record->documentVaultData ?? [];

    // Make sure it's an array
    if (!is_array($existing)) {
        $existing = [];
    }

    // Assign a new ID
    $maxId = collect($existing)->pluck('id')->max() ?? 0;
    $cleanData['id'] = $maxId + 1;

    // Append new item
    $existing[] = $cleanData;

    // Save updated data
    $record->documentVaultData = $existing;
    $record->save();

    return response()->json([
        'message' => 'Document added successfully.',
        'newItem' => $cleanData,
        'updatedData' => $existing,
    ]);
});

// ref: frontend\src\components\14.document-vault\1.DocumentVaultTable\DocumentVaultTable.jsx
Route::post('/api/v1/document-vault/update-pdflink', function (Request $request) use ($API_secure) {
    // Security check
    if ($API_secure && !$request->session()->get('logged_in')) {
        return response()->json(['message' => 'Unauthorized'], 401);
    }

    $validated = $request->validate([
        'organization' => 'required|string',
        'itemId' => 'required|integer',
        'pdflink' => 'required|string', // string instead of url for flexibility
    ]);

    $organization = $validated['organization'];
    $itemId = $validated['itemId'];
    $pdflink = $validated['pdflink'];

    $record = DocumentVault::where('organizationName', $organization)->first();

    if (!$record) {
        return response()->json(['message' => 'Record not found.'], 404);
    }

    $data = $record->documentVaultData ?? [];

    if (!is_array($data)) {
        $data = [];
    }

    $found = false;

    foreach ($data as &$item) {
        if (isset($item['id']) && $item['id'] === $itemId) {
            $item['pdflink'] = $pdflink;
            $found = true;
            break;
        }
    }

    if (!$found) {
        return response()->json(['message' => 'Item not found'], 404);
    }

    $record->documentVaultData = $data;
    $record->save();

    return response()->json(['message' => 'PDF link updated successfully']);
});


// // ref: frontend\src\components\15.members-departments\membersDepartments.jsx
// Route::get('/api/v1/members-departments', function (Request $request) use ($API_secure) {
//     if ($API_secure) {
//         if (!$request->session()->get('logged_in')) {
//             return response()->json(['message' => 'Unauthorized'], 401);
//         }
//     }

//     $organization = $request->query('organization');

//     $data = [
//         'Chuck Gulledge Advisors, LLC' => [
//             ['id' => 1, 'name' => 'Momentum OS'],
//             ['id' => 2, 'name' => 'Client Delivery System'],
//             ['id' => 3, 'name' => 'Momentum Hub'],
//             ['id' => 4, 'name' => 'Lead Gen System'],
//             ['id' => 5, 'name' => '1% Genius v3'],
//         ],
//         'Collins Credit Union' => [
//             ['id' => 1, 'name' => 'Internal Training'],
//             ['id' => 2, 'name' => 'Customer Service'],
//             ['id' => 3, 'name' => 'Compliance and Risk'],
//             ['id' => 4, 'name' => 'Financial Planning'],
//             ['id' => 5, 'name' => 'Digital Transformation'],
//         ],
//         'Test Skeleton Loading' => [
//             ['id' => 1, 'name' => '-'],
//             ['id' => 2, 'name' => '-'],
//         ],
//     ];

//     return response()->json($data[$organization] ?? []);
// });

// ref: frontend\src\components\15.members-departments\membersDepartments.jsx
Route::get('/api/v1/members-departments', function (Request $request) use ($API_secure) {
    if ($API_secure) {
        if (!$request->session()->get('logged_in')) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }
    }

    $organization = $request->query('organization');

    if (!$organization) {
        return response()->json(['message' => 'Missing organization parameter'], 400);
    }

    $record = MembersDepartment::where('organizationName', $organization)->first();

    if (!$record) {
        return response()->json([]);
    }

    return response()->json($record->membersDepartmentsData ?? []);
});


// ref: frontend\src\components\15.members-departments\1.MembersDepartmentsTable\MembersDepartmentsTable.jsx
// Route::post('/api/v1/members-departments/update', function (Request $request) use ($API_secure) {
//     if ($API_secure && !$request->session()->get('logged_in')) {
//         return response()->json(['message' => 'Unauthorized'], 401);
//     }

//     $validated = $request->validate([
//         'organizationName' => 'required|string',
//         'membersDepartmentsData' => 'required|array',
//     ]);

//     $record = MembersDepartment::where('organizationName', $validated['organizationName'])->first();

//     if (!$record) {
//         return response()->json(['message' => 'Organization not found'], 404);
//     }

//     $record->membersDepartmentsData = $validated['membersDepartmentsData'];
//     $record->save();

//     return response()->json(['message' => 'Members departments updated successfully.']);
// });

Route::post('/api/v1/members-departments/update', function (Request $request) use ($API_secure) {
    if ($API_secure && !$request->session()->get('logged_in')) {
        return response()->json(['message' => 'Unauthorized'], 401);
    }

    $organizationName = $request->input('organizationName');
    $membersDepartmentsData = $request->input('membersDepartmentsData', []); // default empty array if missing

    if (!$organizationName) {
        return response()->json(['message' => 'Organization name is required'], 400);
    }

    $record = MembersDepartment::where('organizationName', $organizationName)->first();

    if (!$record) {
        return response()->json(['message' => 'Organization not found'], 404);
    }

    $record->membersDepartmentsData = $membersDepartmentsData;
    $record->save();

    return response()->json(['message' => 'Members departments updated successfully.']);
});



// ref: frontend\src\components\15.members-departments\1.MembersDepartmentsTable\MembersDepartmentsTable.jsx
Route::post('/api/v1/members-departments/add', function (Request $request) use ($API_secure) {
    if ($API_secure) {
        if (!$request->session()->get('logged_in')) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }
    }

    $organization = $request->input('organizationName');
    $newItem = $request->input('newItem');

    if (!$organization || !is_array($newItem) || !isset($newItem['name'])) {
        return response()->json(['message' => 'Invalid input data'], 400);
    }

    $record = MembersDepartment::where('organizationName', $organization)->first();

    if (!$record) {
        return response()->json(['message' => 'Organization not found'], 404);
    }

    $existingData = $record->membersDepartmentsData ?? [];

    $nextId = collect($existingData)->max('id') + 1;

    $newItemWithId = [
        'id' => $nextId,
        'name' => $newItem['name']
    ];

    $updatedData = array_merge($existingData, [$newItemWithId]);

    $record->membersDepartmentsData = $updatedData;
    $record->save();

    return response()->json([
        'message' => 'New item added successfully',
        'newItem' => $newItemWithId
    ]);
});


// // ref: frontend\src\components\16.members-directory\membersDirectory.jsx
// Route::get('/api/v1/members-directory', function (Request $request) use ($API_secure) {
//     if ($API_secure) {
//         if (!$request->session()->get('logged_in')) {
//             return response()->json(['message' => 'Unauthorized'], 401);
//         }
//     }

//     $organization = $request->query('organization');

//     $data = [
//         'Chuck Gulledge Advisors, LLC' => [
//             [
//                 'id' => 1,
//                 'fullname' => 'Maricar Aquino',
//                 'company' => 'Chuck Gulledge Advisors, LLC',
//                 'email' => 'maricar@chuckgulledge.com',
//                 'department' => 'Admin',
//                 'memberAccess' => 'Leadership',
//                 'canLogin' => 'Yes',
//             ],
//             [
//                 'id' => 2,
//                 'fullname' => 'Chuck Gulledge',
//                 'company' => 'Chuck Gulledge Advisors, LLC',
//                 'email' => 'chuck.gulledge@gmail.com',
//                 'department' => 'Admin',
//                 'memberAccess' => 'Superadmin',
//                 'canLogin' => 'Yes',
//             ],
//         ],
//         'Collins Credit Union' => [
//             [
//                 'id' => 1,
//                 'fullname' => 'Alex Parker',
//                 'company' => 'Collins Credit Union',
//                 'email' => 'alex.parker@collinscu.com',
//                 'department' => 'Customer Service',
//                 'memberAccess' => 'Admin',
//                 'canLogin' => 'Yes',
//             ],
//             [
//                 'id' => 2,
//                 'fullname' => 'Jamie Lee',
//                 'company' => 'Collins Credit Union',
//                 'email' => 'jamie.lee@collinscu.com',
//                 'department' => 'Compliance and Risk',
//                 'memberAccess' => 'Supervisor',
//                 'canLogin' => 'No',
//             ],
//         ],
//         'Test Skeleton Loading' => [
//             [
//                 'id' => 1,
//                 'fullname' => '-',
//                 'company' => '-',
//                 'email' => '-',
//                 'department' => '-',
//                 'memberAccess' => '-',
//                 'canLogin' => '-',
//             ],

//             [
//                 'id' => 2,
//                 'fullname' => '-',
//                 'company' => '-',
//                 'email' => '-',
//                 'department' => '-',
//                 'memberAccess' => '-',
//                 'canLogin' => '-',
//             ],

//             [
//                 'id' => 3,
//                 'fullname' => '-',
//                 'company' => '-',
//                 'email' => '-',
//                 'department' => '-',
//                 'memberAccess' => '-',
//                 'canLogin' => '-',
//             ],
//         ],
//     ];

//     return response()->json($data[$organization] ?? []);
// });




// ref: frontend\src\components\16.members-directory\membersDirectory.jsx
Route::get('/api/v1/members-directory', function (Request $request) use ($API_secure) {
    if ($API_secure && !$request->session()->get('logged_in')) {
        return response()->json(['message' => 'Unauthorized'], 401);
    }

    $organization = $request->query('organization');

    if (!$organization) {
        return response()->json(['message' => 'Organization is required'], 400);
    }

    $record = MembersDirectory::where('organizationName', $organization)->first();

    if (!$record) {
        return response()->json([]);
    }

    return response()->json($record->membersDirectoryData ?? []);
});

// ref: frontend\src\components\16.members-directory\2.EmployeeTable\EmployeeTable.jsx
Route::post('/api/v1/members-directory/update', function (Request $request) use ($API_secure) {
    if ($API_secure && !$request->session()->get('logged_in')) {
        return response()->json(['message' => 'Unauthorized'], 401);
    }

    $organization = $request->input('organization');
    $membersDirectoryData = $request->input('membersDirectoryData', []); // default to empty array

    if (!$organization) {
        return response()->json(['message' => 'Missing organization'], 400);
    }

    $record = MembersDirectory::where('organizationName', $organization)->first();

    if (!$record) {
        return response()->json(['message' => 'Organization not found'], 404);
    }

    $record->membersDirectoryData = $membersDirectoryData;
    $record->save();

    return response()->json(['message' => 'Members Directory updated successfully']);
});


// Route::post('/api/v1/members-directory/update', function (Request $request) use ($API_secure) {
//     if ($API_secure && !$request->session()->get('logged_in')) {
//         return response()->json(['message' => 'Unauthorized'], 401);
//     }

//     $organization = $request->input('organization');
//     $membersDirectoryData = $request->input('membersDirectoryData');

//     if (!$organization || !$membersDirectoryData) {
//         return response()->json(['message' => 'Missing organization or data'], 400);
//     }

//     $record = MembersDirectory::where('organizationName', $organization)->first();

//     if (!$record) {
//         return response()->json(['message' => 'Organization not found'], 404);
//     }

//     $record->membersDirectoryData = $membersDirectoryData;
//     $record->save();

//     return response()->json(['message' => 'Members Directory updated successfully']);
// });


Route::post('/api/v1/members-directory/add', function (Request $request) use ($API_secure) {
    if ($API_secure && !$request->session()->get('logged_in')) {
        return response()->json(['message' => 'Unauthorized'], 401);
    }

    // Validate top-level keys first
    $validated = $request->validate([
        'organizationName' => 'required|string',
        'newItem' => 'required|array',
    ]);

    // Now validate contents of newItem
    $memberRules = [
        'fullname' => 'required|string',
        'company' => 'required|string',
        'email' => 'required|email',
        'department' => 'required|string',
        'memberAccess' => 'required|string',
        'canLogin' => 'required|string',
    ];

    Validator::make($request->input('newItem'), $memberRules)->validate();

    $organizationName = $validated['organizationName'];
    $newItem = $request->input('newItem');

    $record = MembersDirectory::where('organizationName', $organizationName)->first();

    if (!$record) {
        return response()->json(['message' => 'Organization not found'], 404);
    }

    $existing = $record->membersDirectoryData ?? [];

    $maxId = collect($existing)->pluck('id')->max() ?? 0;
    $newItem['id'] = $maxId + 1;

    $existing[] = $newItem;

    $record->membersDirectoryData = $existing;
    $record->save();

    return response()->json([
        'message' => 'New member added successfully',
        'newItem' => $newItem,
        'fullData' => $existing,
    ]);
});



// // ref: frontend\src\components\0.messaging\Messaging.jsx
// Route::get('/api/v1/messages', function (Request $request) use ($API_secure) {
//     if ($API_secure) {
//         if (!$request->session()->get('logged_in')) {
//             return response()->json(['message' => 'Unauthorized'], 401);
//         }
//     }

//     $fullname = $request->query('fullname'); // e.g., "Maricar Aquino"
//     $sender = $request->query('sender');     // e.g., "Kayven Delatado"

//     // Mock message data structured as: $messages[fullname][sender] = [ ... ]
//     $messages = [
//         'Maricar Aquino' => [
//             'Kayven Delatado' => [
//                 [
//                     'id' => 1,
//                     'sender' => 'Maricar Aquino',
//                     'receipt' => 'Kayven Delatado',
//                     'content' => 'Hey, just checking in on the latest update.',
//                     'datetime' => '2025-08-13 09:00 AM',
//                 ],
//                 [
//                     'id' => 2,
//                     'sender' => 'Kayven Delatado',
//                     'receipt' => 'Maricar Aquino',
//                     'content' => 'All good on my side, thanks for following up!',
//                     'datetime' => '2025-08-13 09:02 AM',
//                 ],
//                 [
//                     'id' => 3,
//                     'sender' => 'Maricar Aquino',
//                     'receipt' => 'Kayven Delatado',
//                     'content' => 'Great to hear! Let’s sync later this afternoon.',
//                     'datetime' => '2025-08-13 09:05 AM',
//                 ],
//                 [
//                     'id' => 4,
//                     'sender' => 'Kayven Delatado',
//                     'receipt' => 'Maricar Aquino',
//                     'content' => 'Sure thing, I’ll be free after 2 PM.',
//                     'datetime' => '2025-08-13 09:06 AM',
//                 ],
//                 [
//                     'id' => 5,
//                     'sender' => 'Maricar Aquino',
//                     'receipt' => 'Kayven Delatado',
//                     'content' => 'Perfect, I’ll send a calendar invite.',
//                     'datetime' => '2025-08-13 09:08 AM',
//                 ],
//             ],
//             'Jamie Lee' => [
//                 [
//                     'id' => 1,
//                     'sender' => 'Maricar Aquino',
//                     'receipt' => 'Jamie Lee',
//                     'content' => 'Hey Jamie, did you get the file?',
//                     'datetime' => '2025-08-13 10:00 AM',
//                 ],
//                 [
//                     'id' => 2,
//                     'sender' => 'Jamie Lee',
//                     'receipt' => 'Maricar Aquino',
//                     'content' => 'Yes! Reviewing it now.',
//                     'datetime' => '2025-08-13 10:01 AM',
//                 ],
//                 [
//                     'id' => 3,
//                     'sender' => 'Maricar Aquino',
//                     'receipt' => 'Jamie Lee',
//                     'content' => 'Cool. Let me know your thoughts.',
//                     'datetime' => '2025-08-13 10:02 AM',
//                 ],
//                 [
//                     'id' => 4,
//                     'sender' => 'Jamie Lee',
//                     'receipt' => 'Maricar Aquino',
//                     'content' => 'Looks good so far.',
//                     'datetime' => '2025-08-13 10:03 AM',
//                 ],
//                 [
//                     'id' => 5,
//                     'sender' => 'Maricar Aquino',
//                     'receipt' => 'Jamie Lee',
//                     'content' => 'Awesome!',
//                     'datetime' => '2025-08-13 10:04 AM',
//                 ],
//             ],
//             'John Santos' => [
//                 [
//                     'id' => 1,
//                     'sender' => 'Maricar Aquino',
//                     'receipt' => 'John Santos',
//                     'content' => 'John, can we reschedule?',
//                     'datetime' => '2025-08-13 11:00 AM',
//                 ],
//                 [
//                     'id' => 2,
//                     'sender' => 'John Santos',
//                     'receipt' => 'Maricar Aquino',
//                     'content' => 'Sure, no problem.',
//                     'datetime' => '2025-08-13 11:01 AM',
//                 ],
//                 [
//                     'id' => 3,
//                     'sender' => 'Maricar Aquino',
//                     'receipt' => 'John Santos',
//                     'content' => 'Thanks a lot.',
//                     'datetime' => '2025-08-13 11:02 AM',
//                 ],
//                 [
//                     'id' => 4,
//                     'sender' => 'John Santos',
//                     'receipt' => 'Maricar Aquino',
//                     'content' => 'Catch you later.',
//                     'datetime' => '2025-08-13 11:03 AM',
//                 ],
//                 [
//                     'id' => 5,
//                     'sender' => 'Maricar Aquino',
//                     'receipt' => 'John Santos',
//                     'content' => 'Bye!',
//                     'datetime' => '2025-08-13 11:04 AM',
//                 ],
//             ],
//             'Angela Reyes' => [
//                 [
//                     'id' => 1,
//                     'sender' => 'Angela Reyes',
//                     'receipt' => 'Maricar Aquino',
//                     'content' => 'Are you free to chat?',
//                     'datetime' => '2025-08-13 01:00 PM',
//                 ],
//                 [
//                     'id' => 2,
//                     'sender' => 'Maricar Aquino',
//                     'receipt' => 'Angela Reyes',
//                     'content' => 'Give me 5 mins.',
//                     'datetime' => '2025-08-13 01:01 PM',
//                 ],
//                 [
//                     'id' => 3,
//                     'sender' => 'Angela Reyes',
//                     'receipt' => 'Maricar Aquino',
//                     'content' => 'Sure!',
//                     'datetime' => '2025-08-13 01:02 PM',
//                 ],
//                 [
//                     'id' => 4,
//                     'sender' => 'Maricar Aquino',
//                     'receipt' => 'Angela Reyes',
//                     'content' => 'Ready now.',
//                     'datetime' => '2025-08-13 01:05 PM',
//                 ],
//                 [
//                     'id' => 5,
//                     'sender' => 'Angela Reyes',
//                     'receipt' => 'Maricar Aquino',
//                     'content' => 'Calling you.',
//                     'datetime' => '2025-08-13 01:06 PM',
//                 ],
//             ],
//             'Mark Villanueva' => [
//                 [
//                     'id' => 1,
//                     'sender' => 'Maricar Aquino',
//                     'receipt' => 'Mark Villanueva',
//                     'content' => 'Got your request. On it!',
//                     'datetime' => '2025-08-13 02:00 PM',
//                 ],
//                 [
//                     'id' => 2,
//                     'sender' => 'Mark Villanueva',
//                     'receipt' => 'Maricar Aquino',
//                     'content' => 'Appreciate it.',
//                     'datetime' => '2025-08-13 02:01 PM',
//                 ],
//                 [
//                     'id' => 3,
//                     'sender' => 'Maricar Aquino',
//                     'receipt' => 'Mark Villanueva',
//                     'content' => 'Will update you shortly.',
//                     'datetime' => '2025-08-13 02:02 PM',
//                 ],
//                 [
//                     'id' => 4,
//                     'sender' => 'Mark Villanueva',
//                     'receipt' => 'Maricar Aquino',
//                     'content' => '👍',
//                     'datetime' => '2025-08-13 02:03 PM',
//                 ],
//                 [
//                     'id' => 5,
//                     'sender' => 'Maricar Aquino',
//                     'receipt' => 'Mark Villanueva',
//                     'content' => 'Done!',
//                     'datetime' => '2025-08-13 02:04 PM',
//                 ],
//             ],
//         ],
//     ];

//     return response()->json(
//         $messages[$fullname][$sender] ?? []
//     );
// });



// ref: frontend\src\components\0.messaging\Messaging.jsx
Route::get('/api/v1/messages', function (Request $request) use ($API_secure) {
    if ($API_secure) {
        if (!$request->session()->get('logged_in')) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }
    }

    $fullname = $request->query('fullname'); 
    $sender = $request->query('sender');     

    // Validate input
    if (!$fullname || !$sender) {
        return response()->json(['message' => 'Both fullname and sender are required'], 400);
    }

    // Fetch the first record from the database based on fullname
    $messageRecord = MessagingMessage::where('fullName', $fullname)->first();

    if (!$messageRecord) {
        // No record for fullname found
        return response()->json(['message' => 'No record found for this fullName'], 404);
    }

    // messagesData is stored as JSON, decode it to array if necessary
    $messagesData = $messageRecord->messagesData;

    if (is_string($messagesData)) {
        $messagesData = json_decode($messagesData, true);
    }

    // Check if messagesData has this fullname and sender, else return empty array
    if (isset($messagesData[$fullname]) && isset($messagesData[$fullname][$sender])) {
        return response()->json($messagesData[$fullname][$sender]);
    } else {
        // Return empty array if no messages for this sender
        return response()->json([]);
    }
});



// // ref: frontend\src\components\0.messaging\Messaging.jsx
// Route::get('/api/v1/contact-list', function (Request $request) use ($API_secure) {
//     if ($API_secure) {
//         if (!$request->session()->get('logged_in')) {
//             return response()->json(['message' => 'Unauthorized'], 401);
//         }
//     }

//     // Return all contacts regardless of sender
//     $contacts = [
//         ['id' => 1, 'name' => 'Kayven Delatado'],
//         ['id' => 2, 'name' => 'Maricar Aquino'],
//         ['id' => 3, 'name' => 'John Santos'],
//         ['id' => 4, 'name' => 'Angela Reyes'],
//         ['id' => 5, 'name' => 'Mark Villanueva'],
//     ];

//     return response()->json($contacts);
// });


// ref: frontend\src\components\0.messaging\Messaging.jsx
Route::get('/api/v1/contact-list', function (Request $request) use ($API_secure) {
    if ($API_secure) {
        if (!$request->session()->get('logged_in')) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }
    }

    // Retrieve the organization from the query parameter
    $organization = $request->query('organization');

    // Fetch contacts based on the organization
    try {
        $contacts = AuthUser::where('organization', $organization)
            ->get(['id', 'u_id', 'firstName', 'lastName'])  // Get `id`, `u_id`, `firstName`, `lastName`
            ->map(function ($user, $index) {  // `$index` is the key for each iteration
                return [
                    'id' => $index + 1,  // Auto-generate a sequential ID starting from 1
                    'u_id' => $user->u_id,  // Use `u_id` from the database
                    'name' => $user->firstName . ' ' . $user->lastName,  // Combine `firstName` and `lastName`
                ];
            });

        return response()->json($contacts);

    } catch (\Exception $e) {
        // Catch any exceptions and return a 500 error with the exception message
        return response()->json(['message' => 'Error fetching contacts: ' . $e->getMessage()], 500);
    }
});



// // ref: frontend\src\components\0.messaging\Messaging.jsx
// Route::get('/api/v1/left-conversations', function (Request $request) use ($API_secure) {
//     if ($API_secure) {
//         if (!$request->session()->get('logged_in')) {
//             return response()->json(['message' => 'Unauthorized'], 401);
//         }
//     }

//     $fullname = $request->query('fullname');

//     $mockData = [
//         'Kayven Delatado' => [
//             ['id' => 1, 'sender' => 'Jamie Lee', 'uid' => 'UID-101'],
//             ['id' => 2, 'sender' => 'Maricar Aquino', 'uid' => 'UID-102'],
//             ['id' => 3, 'sender' => 'John Santos', 'uid' => 'UID-103'],
//             ['id' => 4, 'sender' => 'Angela Reyes', 'uid' => 'UID-104'],
//             ['id' => 5, 'sender' => 'Mark Villanueva', 'uid' => 'UID-105'],
//         ],
//         'Jamie Lee' => [
//             ['id' => 1, 'sender' => 'Kayven Delatado', 'uid' => 'UID-201'],
//             ['id' => 2, 'sender' => 'Mark Villanueva', 'uid' => 'UID-202'],
//             ['id' => 3, 'sender' => 'Angela Reyes', 'uid' => 'UID-203'],
//             ['id' => 4, 'sender' => 'Maricar Aquino', 'uid' => 'UID-204'],
//             ['id' => 5, 'sender' => 'John Santos', 'uid' => 'UID-205'],
//         ],
//         'Maricar Aquino' => [
//             ['id' => 1, 'sender' => 'Kayven Delatado', 'uid' => 'UID-301'],
//             ['id' => 2, 'sender' => 'Jamie Lee', 'uid' => 'UID-302'],
//             // ['id' => 3, 'sender' => 'Angela Reyes', 'uid' => 'UID-303'],
//             // ['id' => 4, 'sender' => 'John Santos', 'uid' => 'UID-304'],
//             // ['id' => 5, 'sender' => 'Mark Villanueva', 'uid' => 'UID-305'],
//         ],
//     ];

//     return response()->json($mockData[$fullname] ?? []);
// });


// ref: frontend\src\components\0.messaging\Messaging.jsx
Route::get('/api/v1/left-conversations', function (Request $request) use ($API_secure) {
    // Check if the API requires authentication
    if ($API_secure) {
        if (!$request->session()->get('logged_in')) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }
    }

    // Get the fullName from the query parameters
    $fullname = $request->query('fullname');

    // Fetch the first matching record from the messaging_left_conversations table
    try {
        $conversation = MessagingLeftConversation::where('fullName', $fullname)->first();

        // If the conversation exists, return it, otherwise return an empty array
        if ($conversation) {
            // Decode leftConversationsData from stringified JSON to an array
            $leftConversationsData = json_decode($conversation->leftConversationsData, true);

            // If leftConversationsData is not an array (e.g., it's null), ensure it's an empty array
            if (!is_array($leftConversationsData)) {
                $leftConversationsData = [];
            }

            // Only return the array as is if it is in the expected format
            return response()->json($leftConversationsData);
        } else {
            return response()->json([], 404); // No matching conversation found
        }
    } catch (\Exception $e) {
        return response()->json(['message' => 'Error fetching conversation: ' . $e->getMessage()], 500);
    }
});


// ref: 
Route::post('/api/v1/left-conversations/add', function (Request $request) use ($API_secure) {
    // Check if the API requires authentication
    if ($API_secure) {
        if (!$request->session()->get('logged_in')) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }
    }

    // Validate incoming request data
    $validated = $request->validate([
        'fullname' => 'required|string',
        'sender' => 'required|string',
        'uid' => 'required|string',
    ]);

    try {
        // Find the conversation by fullname
        $existingConversation = MessagingLeftConversation::where('fullName', $validated['fullname'])->first();

        if ($existingConversation) {
            // Check if leftConversationsData is already an array (no need to decode if it's already an array)
            $leftConversationsData = $existingConversation->leftConversationsData;

            if (is_string($leftConversationsData)) {
                $leftConversationsData = json_decode($leftConversationsData, true);
            }

            // Find the max ID from the existing conversation data
            $maxId = 0;
            foreach ($leftConversationsData as $conversation) {
                if ($conversation['id'] > $maxId) {
                    $maxId = $conversation['id'];
                }
            }

            // Increment the ID for the new conversation entry
            $newId = $maxId + 1;

            // Check if the sender already exists in the conversation
            foreach ($leftConversationsData as $conversation) {
                if ($conversation['sender'] === $validated['sender']) {
                    return response()->json([
                        'status' => 'error',
                        'message' => 'Sender already exists in the left conversations data.',
                    ], 400);
                }
            }

            // Create the new conversation entry
            $newConversation = [
                'id' => $newId,  // Use the new incremented ID
                'sender' => $validated['sender'],
                'uid' => $validated['uid'],
            ];

            // Append the new conversation to the existing data
            $leftConversationsData[] = $newConversation;

            // Update the leftConversationsData in the database
            $existingConversation->leftConversationsData = json_encode($leftConversationsData);
            $existingConversation->save();

            return response()->json([
                'status' => 'success',
                'message' => 'Left conversation added successfully!',
                'data' => $existingConversation,
            ], 200);
        } else {
            // If no conversation exists for this fullName, create a new one
            $conversation = new MessagingLeftConversation([
                'fullName' => $validated['fullname'],
                'u_id' => $validated['uid'],
                'leftConversationsData' => json_encode([
                    [
                        'id' => 1, // First conversation ID for the new fullName
                        'sender' => $validated['sender'],
                        'uid' => $validated['uid'],
                    ]
                ]),
                'statusFlag' => null, // Default statusFlag
            ]);
            $conversation->save();

            return response()->json([
                'status' => 'success',
                'message' => 'Left conversation added successfully!',
                'data' => $conversation,
            ], 200);
        }

    } catch (\Exception $e) {
        return response()->json(['message' => 'Error adding left conversation: ' . $e->getMessage()], 500);
    }
});



// Route::post('/api/v1/send-message', function (Request $request) use ($API_secure) {
//     if ($API_secure) {
//         if (!$request->session()->get('logged_in')) {
//             return response()->json(['message' => 'Unauthorized'], 401);
//         }
//     }

//     $sender = $request->input('sender');  // e.g., "Maricar Aquino"
//     $receiver = $request->input('receiver');  // e.g., "Kayven Delatado"
//     $messageContent = $request->input('message');  // The actual message content

//     // Validate input
//     if (!$sender || !$receiver || !$messageContent) {
//         return response()->json(['message' => 'Sender, receiver, and message content are required'], 400);
//     }

//     // Fetch receiver's record from the database based on receiver's full name
//     $receiverRecord = \App\Models\MessagingMessage::where('fullName', $receiver)->first();

//     // If receiver doesn't exist, create a new receiver record with a generated UUID for u_id
//     if (!$receiverRecord) {
//         $receiverRecord = new \App\Models\MessagingMessage([
//             'u_id' => Str::uuid(),  // Generate a unique UUID for the receiver
//             'fullName' => $receiver,
//             'messagesData' => [],  // Empty messagesData
//             'statusFlag' => 1, // Default status flag (can be adjusted as needed)
//         ]);
//         $receiverRecord->save(); // Save the newly created receiver record
//     }

//     // Prepare the new message for insertion
//     $newMessage = [
//         'sender' => $sender,
//         'receipt' => $receiver,
//         'content' => $messageContent,
//         'datetime' => now(),
//     ];

//     // Fetch and decode the existing messagesData for the receiver (if any)
//     $receiverMessages = $receiverRecord->messagesData ?? [];
//     if (is_string($receiverMessages)) {
//         $receiverMessages = json_decode($receiverMessages, true);
//     }

//     // If there's no entry for this sender in the receiver's messagesData, initialize the array
//     if (!isset($receiverMessages[$receiver])) {
//         $receiverMessages[$receiver] = [];
//     }

//     // Append the new message to the receiver's conversation
//     $receiverMessages[$receiver][] = $newMessage;
//     $receiverRecord->messagesData = $receiverMessages;
//     $receiverRecord->save();  // Save the updated receiver's record

//     // Fetch sender's record (create a new one if it doesn't exist)
//     $senderRecord = \App\Models\MessagingMessage::where('fullName', $sender)->first();

//     if (!$senderRecord) {
//         // Create a new record for sender if it doesn't exist
//         $senderRecord = new \App\Models\MessagingMessage([
//             'u_id' => Str::uuid(),  // Generate a unique UUID for the sender as well
//             'fullName' => $sender,
//             'messagesData' => [
//                 $receiver => [
//                     $newMessage,
//                 ]
//             ],
//             'statusFlag' => 1, // Adjust status flag as needed
//         ]);
//     } else {
//         // Add the reverse message (receiver -> sender) to the sender's messagesData
//         $senderMessages = $senderRecord->messagesData ?? [];
//         if (is_string($senderMessages)) {
//             $senderMessages = json_decode($senderMessages, true);
//         }

//         // If no entry for the receiver, initialize it
//         if (!isset($senderMessages[$receiver])) {
//             $senderMessages[$receiver] = [];
//         }

//         // Append the reverse message (sender -> receiver)
//         $senderMessages[$receiver][] = [
//             'sender' => $receiver,
//             'receipt' => $sender,
//             'content' => $messageContent,
//             'datetime' => now(),
//         ];

//         // Update sender's messagesData
//         $senderRecord->messagesData = $senderMessages;
//     }

//     // Save the sender's updated record
//     $senderRecord->save();

//     // Return the response
//     return response()->json([
//         'message' => 'Message sent successfully!',
//         'data' => [
//             'sender' => $sender,
//             'receiver' => $receiver,
//             'content' => $messageContent,
//         ]
//     ], 200);
// });


// Route::post('/api/v1/send-message', function (Request $request) use ($API_secure) {
//     if ($API_secure) {
//         if (!$request->session()->get('logged_in')) {
//             return response()->json(['message' => 'Unauthorized'], 401);
//         }
//     }

//     $sender = $request->input('sender');  // e.g., "Maricar Aquino"
//     $receiver = $request->input('receiver');  // e.g., "Kayven Delatado"
//     $messageContent = $request->input('message');  // The actual message content

//     // Validate input
//     if (!$sender || !$receiver || !$messageContent) {
//         return response()->json(['message' => 'Sender, receiver, and message content are required'], 400);
//     }

//     // Fetch receiver's record from the database based on receiver's full name
//     $receiverRecord = \App\Models\MessagingMessage::where('fullName', $receiver)->first();

//     // If receiver doesn't exist, create a new receiver record
//     if (!$receiverRecord) {
//         $receiverRecord = new \App\Models\MessagingMessage([
//             'u_id' => Str::uuid(),  // Generate a unique UUID for the receiver
//             'fullName' => $receiver,
//             'messagesData' => [],  // Empty messagesData
//             'statusFlag' => 1, // Default status flag (can be adjusted as needed)
//         ]);
//         $receiverRecord->save(); // Save the newly created receiver record
//     }

//     // Prepare the new message for insertion
//     $newMessage = [
//         'id' => now()->timestamp,  // Optionally use a unique id (like timestamp) for each message
//         'sender' => $sender,
//         'receipt' => $receiver,
//         'content' => $messageContent,
//         'datetime' => now(),
//     ];

//     // Fetch and decode the existing messagesData for the receiver (if any)
//     $receiverMessages = $receiverRecord->messagesData ?? [];
//     if (is_string($receiverMessages)) {
//         $receiverMessages = json_decode($receiverMessages, true);
//     }

//     // If the receiver doesn't have a top-level key for the sender, initialize it
//     if (!isset($receiverMessages[$receiver])) {
//         $receiverMessages[$receiver] = [];
//     }

//     // If the sender doesn't exist in the receiver's messagesData, initialize the array
//     if (!isset($receiverMessages[$receiver][$sender])) {
//         $receiverMessages[$receiver][$sender] = [];
//     }

//     // Append the new message to the receiver's conversation under the sender's key
//     $receiverMessages[$receiver][$sender][] = $newMessage;
//     $receiverRecord->messagesData = $receiverMessages;
//     $receiverRecord->save();  // Save the updated receiver's record

//     // Fetch sender's record (create a new one if it doesn't exist)
//     $senderRecord = \App\Models\MessagingMessage::where('fullName', $sender)->first();

//     if (!$senderRecord) {
//         // Create a new record for sender if it doesn't exist
//         $senderRecord = new \App\Models\MessagingMessage([
//             'u_id' => Str::uuid(),  // Generate a unique UUID for the sender
//             'fullName' => $sender,
//             'messagesData' => [
//                 $receiver => [
//                     $newMessage,
//                 ]
//             ],
//             'statusFlag' => 1, // Adjust status flag as needed
//         ]);
//     } else {
//         // Add the reverse message (receiver -> sender) to the sender's messagesData
//         $senderMessages = $senderRecord->messagesData ?? [];
//         if (is_string($senderMessages)) {
//             $senderMessages = json_decode($senderMessages, true);
//         }

//         // If no entry for the receiver, initialize it
//         if (!isset($senderMessages[$receiver])) {
//             $senderMessages[$receiver] = [];
//         }

//         // Append the reverse message (sender -> receiver)
//         $senderMessages[$receiver][] = [
//             'id' => now()->timestamp,  // Optionally use a unique id for each message
//             'sender' => $receiver,
//             'receipt' => $sender,
//             'content' => $messageContent,
//             'datetime' => now(),
//         ];

//         // Update sender's messagesData
//         $senderRecord->messagesData = $senderMessages;
//     }

//     // Save the sender's updated record
//     $senderRecord->save();

//     // Return the response
//     return response()->json([
//         'message' => 'Message sent successfully!',
//         'data' => [
//             'sender' => $sender,
//             'receiver' => $receiver,
//             'content' => $messageContent,
//         ]
//     ], 200);
// });


Route::post('/api/v1/send-message', function (Request $request) use ($API_secure) {
    if ($API_secure) {
        if (!$request->session()->get('logged_in')) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }
    }

    $sender = $request->input('sender');  // e.g., "Maricar Aquino"
    $receiver = $request->input('receiver');  // e.g., "Kayven Delatado"
    $messageContent = $request->input('message');  // The actual message content

    // Validate input
    if (!$sender || !$receiver || !$messageContent) {
        return response()->json(['message' => 'Sender, receiver, and message content are required'], 400);
    }

    // Fetch receiver's record from the database based on receiver's full name
    $receiverRecord = \App\Models\MessagingMessage::where('fullName', $receiver)->first();

    // If receiver doesn't exist, create a new receiver record
    if (!$receiverRecord) {
        $receiverRecord = new \App\Models\MessagingMessage([
            'u_id' => Str::uuid(),  // Generate a unique UUID for the receiver
            'fullName' => $receiver,
            'messagesData' => [],  // Empty messagesData
            'statusFlag' => 1, // Default status flag (can be adjusted as needed)
        ]);
        $receiverRecord->save(); // Save the newly created receiver record
    }

    // Prepare the new message for insertion
    $newMessage = [
        'id' => now()->timestamp,  // Optionally use a unique id (like timestamp) for each message
        'sender' => $sender,
        'receipt' => $receiver,
        'content' => $messageContent,
        'datetime' => now(),
    ];

    // Fetch and decode the existing messagesData for the receiver (if any)
    $receiverMessages = $receiverRecord->messagesData ?? [];
    if (is_string($receiverMessages)) {
        $receiverMessages = json_decode($receiverMessages, true);
    }

    // If the receiver doesn't have a top-level key for the sender, initialize it
    if (!isset($receiverMessages[$receiver])) {
        $receiverMessages[$receiver] = [];
    }

    // If the sender doesn't exist in the receiver's messagesData, initialize the array
    if (!isset($receiverMessages[$receiver][$sender])) {
        $receiverMessages[$receiver][$sender] = [];
    }

    // Append the new message to the receiver's conversation under the sender's key
    $receiverMessages[$receiver][$sender][] = $newMessage;
    $receiverRecord->messagesData = $receiverMessages;
    $receiverRecord->save();  // Save the updated receiver's record


// Fetch sender's record
$senderRecord = \App\Models\MessagingMessage::where('fullName', $sender)->first();

if (!$senderRecord) {
    $senderRecord = new \App\Models\MessagingMessage([
        'u_id' => Str::uuid(),
        'fullName' => $sender,
        'messagesData' => [],
        'statusFlag' => 1,
    ]);
    $senderRecord->save();
}

// Prepare new message
$newMessage = [
    'id' => now()->timestamp,
    'sender' => $sender,
    'receipt' => $receiver,
    'content' => $messageContent,
    'datetime' => now(),
];

// Decode existing sender messagesData
$senderMessages = $senderRecord->messagesData ?? [];
if (is_string($senderMessages)) {
    $senderMessages = json_decode($senderMessages, true);
}

// // Insert message under receiver key inside sender record
// if (!isset($senderMessages[$sender])) {
//     $senderMessages[$sender] = [];
// }

// // If the sender doesn't exist in the receiver's messagesData, initialize the array
// if (!isset($senderMessages[$receiver][$sender])) {
//     $senderMessages[$sender][$receiver] = [];
// }

$senderMessages[$sender][$receiver][] = $newMessage;
$senderRecord->messagesData = $senderMessages;
$senderRecord->save();



    // Return the response
    return response()->json([
        'message' => 'Message sent successfully!',
        'data' => [
            'sender' => $sender,
            'receiver' => $receiver,
            'content' => $messageContent,
        ]
    ], 200);
});



// ref: frontend\src\components\company-dropdown\TopbarDropdown.jsx
// ref: frontend\src\pages\login\Login.jsx
Route::get('/api/v1/get-layout-toggles', function (Request $request) use ($API_secure) {
    if ($API_secure) {
        if (!$request->session()->get('logged_in')) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }
    }

    $organization = $request->query('organization');

    if (!$organization) {
        return response()->json([
            'status' => 'error',
            'message' => 'Organization is required',
        ], 400);
    }

    $record = OpspLayoutSetting::where('organizationName', $organization)->first();

    if (!$record) {
        return response()->json([
            'status' => 'error',
            'message' => 'No layout settings found for this organization',
        ], 404);
    }

    $toggles = [
        'Strategic Drivers' => $record->strategicDriversStatus === 'true',
        'Foundations' => $record->FoundationsStatus === 'true',
        '3 Year Outlook' => $record->threeYearOutlookStatus === 'true',
        'Playing to Win Strategy' => $record->playingToWinStatus === 'true',
        'Core Capabilities' => $record->coreCapabilitiesStatus === 'true',
        '4 Decisions' => $record->fourDecisionsStatus === 'true',
        'Constraints Tracker' => $record->ConstraintsTrackerStatus === 'true',
    ];

    return response()->json([
        'status' => 'success',
        'toggles' => $toggles,
        'organization' => $organization,
        'unique_id' => $record->u_id,
    ]);
});


// //
//     // // ref: frontend\src\components\company-dropdown\TopbarDropdown.jsx
//     // // ref: frontend\src\pages\login\Login.jsx
//     // Route::get('/api/v1/get-layout-toggles', function (Request $request) use ($API_secure) {

//     //     if ($API_secure) {
//     //         if (!$request->session()->get('logged_in')) {
//     //             return response()->json(['message' => 'Unauthorized'], 401);
//     //         }
//     //         $user = $request->session()->get('user');
//     //     }

//     //     $organization = $request->query('organization');

//     //     // Dummy toggle data based on organization (you can replace with DB query)
//     //     $toggles = [
//     //         'Chuck Gulledge Advisors, LLC' => [
//     //             'Strategic Drivers' => true,
//     //             'Foundations' => true,
//     //             '3 Year Outlook' => true,
//     //             'Playing to Win Strategy' => true,
//     //             'Core Capabilities' => true,
//     //             '4 Decisions' => true,
//     //             'Constraints Tracker' => true,
//     //         ],
//     //         'Collins Credit Union' => [
//     //             'Strategic Drivers' => true,
//     //             'Foundations' => true,
//     //             '3 Year Outlook' => true,
//     //             'Playing to Win Strategy' => true,
//     //             'Core Capabilities' => true,
//     //             '4 Decisions' => false,
//     //             'Constraints Tracker' => false,
//     //         ],
//     //         'Test Skeleton Loading' => [
//     //             'Strategic Drivers' => true,
//     //             'Foundations' => true,
//     //             '3 Year Outlook' => true,
//     //             'Playing to Win Strategy' => true,
//     //             'Core Capabilities' => true,
//     //             '4 Decisions' => true,
//     //             'Constraints Tracker' => true,
//     //         ],
//     //     ];

//     //     return response()->json([
//     //         'status' => 'success',
//     //         'toggles' => $toggles[$organization] ?? [],
//     //         'organization' => $organization,
//     //         'unique_id' => uniqid(), // just example
//     //     ]);
//     // });


// // ref: frontend\src\components\notification-icon\NotificationButton.jsx
// Route::get('/api/v1/notifications', function (Request $request) use ($API_secure) {
//     if ($API_secure) {
//         if (!$request->session()->get('logged_in')) {
//             return response()->json(['message' => 'Unauthorized'], 401);
//         }
//     }

//     $fullname = $request->query('fullname');

//     $data = [
//         'Maricar Aquino' => [
//             ['message' => "Welcome back, Maricar!", 'notification_status' => 'unread'],
//             ['message' => "Strategy session scheduled at 3 PM.", 'notification_status' => 'unread'],
//         ],
//         'Chuck Gulledge' => [
//             ['message' => "You have a new coaching request.", 'notification_status' => 'unread'],
//             ['message' => "Reminder: Leadership webinar at 2 PM.", 'notification_status' => 'unread'],
//         ],
//         'Kayven Delatado' => [
//             ['message' => "Your password will expire soon.", 'notification_status' => 'unread'],
//             ['message' => "Team update: Weekly review posted.", 'notification_status' => 'unread'],
//         ],
//         'UAT Test' => [
//             ['message' => "Report submitted successfully.", 'notification_status' => 'unread'],
//             ['message' => "Don’t forget the meeting notes.", 'notification_status' => 'unread'],
//         ],
//         'Jamie Lee' => [
//             ['message' => "Performance review scheduled.", 'notification_status' => 'unread'],
//             ['message' => "New announcement: Office hours updated.", 'notification_status' => 'unread'],
//         ],
//     ];

//     return response()->json($data[$fullname] ?? []);
// });

// ref: frontend\src\components\notification-icon\NotificationButton.jsx
Route::get('/api/v1/notifications', function (Request $request) use ($API_secure) {
    if ($API_secure && !$request->session()->get('logged_in')) {
        return response()->json(['message' => 'Unauthorized'], 401);
    }

    // Validate 'fullname'
    $validator = Validator::make($request->all(), [
        'fullname' => ['required', 'string', 'max:100', 'regex:/^[\pL\s\.\'-]+$/u'], // allows names with letters, spaces, dots, hyphens, apostrophes
    ]);

    if ($validator->fails()) {
        return response()->json([
            'message' => 'Invalid fullname parameter',
            'errors' => $validator->errors()
        ], 400);
    }

    $fullname = $request->query('fullname');

    $notification = Notification::where('userName', $fullname)->first();

    if (!$notification) {
        return response()->json([]);
    }

    return response()->json($notification->notificationsData ?? []);
});


// ref: 
Route::post('/api/v1/notifications/mark-read', function (Request $request) use ($API_secure) {
    if ($API_secure && !$request->session()->get('logged_in')) {
        return response()->json(['message' => 'Unauthorized'], 401);
    }

    $request->validate([
        'userName' => 'required|string|max:100',
    ]);

    $userName = $request->input('userName');

    $notification = Notification::where('userName', $userName)->first();

    if (!$notification) {
        return response()->json(['message' => 'Notification record not found'], 404);
    }

    $data = $notification->notificationsData;

    if (!is_array($data)) {
        return response()->json(['message' => 'Invalid notifications data'], 400);
    }

    // Mark all as read
    $updated = array_map(function ($n) {
        $n['notification_status'] = 'read';
        return $n;
    }, $data);

    $notification->notificationsData = $updated;
    $notification->save();

    return response()->json(['message' => 'All notifications marked as read']);
});


// ref: frontend\src\pages\login\Login.jsx
Route::get('/api/v1/company-traction-users', function (Request $request) use ($API_secure) {
    if ($API_secure) {
        if (!$request->session()->get('logged_in')) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }
        $user = $request->session()->get('user');
    }

    $orgName = $request->query('organizationName');

    if (!$orgName) {
        return response()->json(['message' => 'organizationName is required'], 400);
    }

    $directory = MembersDirectory::where('organizationName', $orgName)->first();

    if (!$directory) {
        return response()->json([]); // Return empty array if not found
    }

    $firstNames = collect($directory->membersDirectoryData)
        ->map(function ($member) {
            $parts = explode(' ', trim($member['fullname']));
            return $parts[0]; // Get the first name
        });

    return response()->json($firstNames);
});


// Route::get('/api/v1/company-traction-users', function (Request $request) use ($API_secure)  {
    
//     if ($API_secure) {
//         if (!$request->session()->get('logged_in')) {
//             return response()->json(['message' => 'Unauthorized'], 401);
//         }
//         $user = $request->session()->get('user');
//     }

//     return response()->json([
//         'Maricar', 
//         'Chuck', 
//         // 'Arlene'
//     ]);
// });

// ref: frontend\src\components\layout-icon\LayoutButton.jsx
Route::post('/api/v1/update-layout-toggles', function (Request $request) use ($API_secure) {
    if ($API_secure && !$request->session()->get('logged_in')) {
        return response()->json(['message' => 'Unauthorized'], 401);
    }

    $validator = Validator::make($request->all(), [
        'organization' => 'required|string',
        'toggles' => 'required|array',
    ]);

    if ($validator->fails()) {
        return response()->json([
            'status' => 'error',
            'errors' => $validator->errors(),
        ], 422);
    }

    $organizationName = $request->input('organization');
    $toggles = $request->input('toggles');

    $record = OpspLayoutSetting::where('organizationName', $organizationName)->first();

    if (!$record) {
        return response()->json([
            'status' => 'error',
            'message' => 'Organization layout settings not found.',
        ], 404);
    }

    // Update fields
    $record->strategicDriversStatus = $toggles['Strategic Drivers'] ? 'true' : 'false';
    $record->FoundationsStatus = $toggles['Foundations'] ? 'true' : 'false';
    $record->threeYearOutlookStatus = $toggles['3 Year Outlook'] ? 'true' : 'false';
    $record->playingToWinStatus = $toggles['Playing to Win Strategy'] ? 'true' : 'false';
    $record->coreCapabilitiesStatus = $toggles['Core Capabilities'] ? 'true' : 'false';
    $record->fourDecisionsStatus = $toggles['4 Decisions'] ? 'true' : 'false';
    $record->ConstraintsTrackerStatus = $toggles['Constraints Tracker'] ? 'true' : 'false';

    $record->save();

    return response()->json([
        'status' => 'success',
        'message' => 'Layout toggles updated successfully',
    ]);
});


// ref: frontend\src\components\admin-panel\pages\Companies\Companies.jsx
Route::get('/api/v1/admin-panel/companies', function (Request $request) use ($API_secure) {
    if ($API_secure) {
        if (!$request->session()->get('logged_in')) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }
    }

    $organizations = Organization::select('organizationName')->get();

    // Map organizations to include an auto increment id starting from 1
    $companies = $organizations->map(function ($org, $index) {
        return [
            'id' => $index + 1,
            'name' => $org->organizationName,
        ];
    });

    return response()->json([
        'data' => $companies,
    ]);
});


// ref: frontend\src\components\admin-panel\pages\Companies\Companies.jsx
// Route::post('/api/v1/admin-panel/quarters', function (Request $request) {
//     $organizationName = $request->input('organizationName');

//     if (!$organizationName) {
//         return response()->json(['error' => 'organizationName is required'], 422);
//     }

//     // Optional: Validate or customize based on specific organization
//     if ($organizationName !== 'eDoc Innovation') {
//         return response()->json(['error' => 'Unauthorized organization'], 403);
//     }

//     return response()->json([
//         'name' => $organizationName,
//         'quarters' => [
//             'Q1' => ['January', 'February'],
//             'Q2' => [''],
//             'Q3' => [''],
//             'Q4' => [''],
//         ],
//     ]);
// });

// ref: frontend\src\components\admin-panel\pages\Companies\Companies.jsx
Route::post('/api/v1/admin-panel/quarters', function (Request $request) {
    $organizationName = $request->input('organizationName');

    if (!$organizationName) {
        return response()->json(['error' => 'organizationName is required'], 422);
    }

    $company = AdminPanelCompany::where('organizationName', $organizationName)->first();

    if (!$company) {
        return response()->json([
            [
                'name' => $organizationName,
                'quarters' => [
                    'Q1' => [],
                    'Q2' => [],
                    'Q3' => [],
                    'Q4' => [],
                ],
            ]
        ]);
    }

    // companiesData might be null, so fall back to empty quarters if needed
    $quarters = $company->companiesData['quarters'] ?? [
        'Q1' => [],
        'Q2' => [],
        'Q3' => [],
        'Q4' => [],
    ];

    return response()->json([
        [
            'name' => $company->organizationName,
            'quarters' => $quarters,
        ]
    ]);
});


// ref: frontend\src\components\admin-panel\pages\Companies\EditCompany.jsx
Route::post('/api/v1/admin-panel/quarters/update', function (Request $request) use ($API_secure) {
    if ($API_secure) {
        if (!$request->session()->get('logged_in')) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }
    }

    $organizationName = $request->input('organizationName');
    $quarters = $request->input('quarters', []); // default to empty array

    if (!$organizationName) {
        return response()->json(['status' => 'error', 'message' => 'Missing required organizationName field'], 400);
    }

    $record = AdminPanelCompany::where('organizationName', $organizationName)->first();

    if (!$record) {
        return response()->json(['status' => 'error', 'message' => 'Organization not found'], 404);
    }

    $record->companiesData = ['quarters' => $quarters];
    $record->save();

    return response()->json(['status' => 'success', 'message' => 'Companies data updated successfully']);
});

// ref: frontend\src\components\6.company-traction\2.CompanyTraction\CompanyTraction.jsx
// ref: frontend\src\components\7.department-traction\2.DepartmentTraction\DepartmentTraction.jsx
Route::post('/api/v1/company-traction/get-current-quarter', function (Request $request) use ($API_secure) {
    if ($API_secure) {
        if (!$request->session()->get('logged_in')) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }
    }

    $organizationName = $request->input('organizationName');

    if (!$organizationName) {
        return response()->json(['error' => 'organizationName is required'], 422);
    }

    $company = AdminPanelCompany::where('organizationName', $organizationName)->first();

    if (!$company || !isset($company->companiesData['quarters'])) {
        return response()->json(['quarter' => 'Q1']);
    }

    $monthName = Carbon::now()->format('F'); // e.g., "October"
    $quarters = $company->companiesData['quarters'];

    foreach ($quarters as $quarter => $months) {
        if (in_array($monthName, $months, true)) {
            return response()->json(['quarter' => $quarter]);
        }
    }

    return response()->json(['quarter' => 'Q1']);
});

// Route::get('/api/v1/admin-panel/users/list', function (Request $request) use ($API_secure) {
//     if ($API_secure) {
//         if (!$request->session()->get('logged_in')) {
//             return response()->json(['message' => 'Unauthorized'], 401);
//         }
//     }

//     $users = AuthUser::all();

//     $formattedUsers = $users->map(function ($user, $index) {
//         $fullName = trim($user->firstName . ' ' . $user->lastName);
//         $status = $user->status;

//         // Handle emailVerifiedAt based on status value
//         $verifiedAt = '';

//         if (!empty($status) && strpos($status, 'verified') !== false) {
//             $parts = explode(',', $status, 2);
//             $verifiedAt = isset($parts[1]) ? trim($parts[1]) : '';
//         }

//         return [
//             'id' => $index + 1,
//             'company' => $user->organization,
//             'name' => $fullName,
//             'email' => $user->email,
//             'emailVerifiedAt' => $verifiedAt,
//         ];
//     });

//     return response()->json([
//         'users' => $formattedUsers,
//     ]);
// });

// ref: frontend\src\components\admin-panel\pages\Users\Users.jsx
Route::get('/api/v1/admin-panel/users/list', function (Request $request) use ($API_secure) {
    if ($API_secure) {
        if (!$request->session()->get('logged_in')) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }
    }

    $users = AuthUser::all();

    $formattedUsers = $users->map(function ($user, $index) {
        $fullName = trim($user->firstName . ' ' . $user->lastName);
        $status = $user->status;

        $verifiedAt = '';
        if (!empty($status) && strpos($status, 'verified') !== false) {
            $parts = explode(',', $status, 2);
            $verifiedAt = isset($parts[1]) ? trim($parts[1]) : '';
        }

        return [
            'id' => $index + 1,               // Auto-generated display ID
            'u_id' => $user->u_id,            // Real user ID from DB
            'company' => $user->organization,
            'name' => $fullName,
            'email' => $user->email,
            'emailVerifiedAt' => $verifiedAt,
        ];
    });

    return response()->json([
        'users' => $formattedUsers,
    ]);
});

// ref: frontend\src\components\admin-panel\pages\Users\Users.jsx
Route::delete('/api/v1/admin-panel/users/delete', function (Request $request) use ($API_secure) {
    if ($API_secure) {
        if (!$request->session()->get('logged_in')) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }
    }

    $validated = $request->validate([
        'u_id' => 'required|string|exists:auth,u_id',
    ]);

    $user = AuthUser::where('u_id', $validated['u_id'])->first();

    if (!$user) {
        return response()->json([
            'status' => 'error',
            'message' => 'User not found.',
        ], 404);
    }

    $user->delete();

    return response()->json([
        'status' => 'success',
        'message' => 'User deleted successfully.',
    ]);
});

// ref: frontend\src\components\admin-panel\pages\Users\EditUser.jsx
Route::post('/api/v1/admin-panel/users/update', function (Request $request) use ($API_secure) {
    if ($API_secure) {
        if (!$request->session()->get('logged_in')) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }
    }

    $validated = $request->validate([
        'u_id' => 'required|string|exists:auth,u_id',
        'name' => 'required|string|max:255',
        'email' => 'required|email|max:255',
        'company' => 'required|string|max:255',
        'emailVerifiedAt' => 'nullable|string',
    ]);

    // Find user by u_id
    $user = AuthUser::where('u_id', $validated['u_id'])->first();

    if (!$user) {
        return response()->json([
            'status' => 'error',
            'message' => 'User not found.',
        ], 404);
    }

    // Split name into firstName and lastName
    $nameParts = explode(' ', $validated['name'], 2);
    $firstName = $nameParts[0] ?? '';
    $lastName = $nameParts[1] ?? '';

    // Prepare status field
    $status = '';
    if (!empty($validated['emailVerifiedAt'])) {
        $status = 'verified , ' . $validated['emailVerifiedAt'];
    }

    // Update user details
    $user->firstName = $firstName;
    $user->lastName = $lastName;
    $user->email = $validated['email'];
    $user->organization = $validated['company'];
    $user->status = $status;
    $user->save();

    return response()->json([
        'status' => 'success',
        'message' => 'User updated successfully.',
    ]);
});


// ref: frontend\src\components\admin-panel\pages\Users\NewUser.jsx
Route::post('/api/v1/admin-panel/users/create', function (Request $request) {
    // ✅ Check if email already exists in the auth table
    $existingUser = AuthUser::where('email', $request->input('email'))->first();

    if ($existingUser) {
        return response()->json([
            'status' => 'error',
            'message' => 'Email already exists',
        ], 409); // 409 Conflict
    }

    // ✅ Validate other fields (no need to check for unique email again)
    $validator = Validator::make($request->all(), [
        'firstName' => 'required|string',
        'lastName' => 'required|string',
        'email' => 'required|email',
        'password' => 'required|string|min:6',
        'role' => 'required|string',
    ]);

    if ($validator->fails()) {
        return response()->json([
            'status' => 'error',
            'errors' => $validator->errors(),
        ], 422);
    }

    // ✅ Generate u_id (UUID or custom string)
    $u_id = (string) Str::uuid();

    // ✅ Create the user
    $user = AuthUser::create([
        'u_id' => $u_id,
        'firstName' => $request->input('firstName'),
        'lastName' => $request->input('lastName'),
        'email' => $request->input('email'),
        'organization' => $request->input('organization'),
        'passwordHash' => Hash::make($request->input('password')),
        'role' => $request->input('role'),
        'group' => $request->input('group'),
        'position' => $request->input('position'),
        'status' => 'inactive',
    ]);

    return response()->json([
        'status' => 'success',
        'message' => 'User created successfully',
        'user' => $user,
    ]);
});