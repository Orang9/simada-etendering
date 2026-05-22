<?php

use App\Http\Controllers\PaketPengadaanController;
use App\Http\Controllers\DokumenController;
use App\Http\Controllers\PenawaranController;
use App\Http\Controllers\EvaluasiPenawaranController;
use App\Http\Controllers\PemenangTenderController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\ReportController;
use App\Models\Pengguna;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Route;


Route::post('/login', function (Request $request) {
    $user = Pengguna::where('email', $request->email)->first();

    if (!$user || !Hash::check($request->password, $user->password)) {
        return response()->json(['message' => 'Invalid credentials'], 401);
    }

    return response()->json([
        'message' => 'Authenticated',
        'token' => $user->pengguna_id,
        'pengguna' => [
            'pengguna_id' => $user->pengguna_id,
            'nama' => $user->nama,
            'email' => $user->email,
            'role' => optional($user->role)->nama_role,
        ],
    ]);
});

Route::middleware(['simple.auth'])->group(function () {
    Route::get('/admin/test', function () {
        return response()->json(['message' => 'Admin route accessed']);
    })->middleware('role:Admin');

    Route::get('/pokja/test', function () {
        return response()->json(['message' => 'Pokja route accessed']);
    })->middleware('role:Pokja');

    Route::get('/vendor/test', function () {
        return response()->json(['message' => 'Vendor route accessed']);
    })->middleware('role:Penyedia');

    Route::post('/logout', function () {
        return response()->json(['message' => 'Logged out']);
    });

    Route::middleware(['role:Admin,Pokja,Penyedia'])->group(function () {
        Route::get('/penawaran', [PenawaranController::class, 'index']);
        Route::get('/penawaran/{id}', [PenawaranController::class, 'show']);
        
        Route::get('/evaluasi', [EvaluasiPenawaranController::class, 'index']);
        Route::get('/evaluasi/{id}', [EvaluasiPenawaranController::class, 'show']);
        
        Route::get('/pemenang-tender', [PemenangTenderController::class, 'index']);
        Route::get('/pemenang-tender/{id}', [PemenangTenderController::class, 'show']);

        Route::get('/paket-pengadaan', [PaketPengadaanController::class, 'index']);
        Route::get('/paket-pengadaan/{id}', [PaketPengadaanController::class, 'show']);

        Route::get('/paket-pengadaan/{id}/dokumen', [DokumenController::class, 'index']);

        Route::get('/laporan/pemenang', [ReportController::class, 'pemenang']);
    });

    Route::middleware(['role:Admin,Penyedia'])->group(function () {
        Route::post('/vendor/paket-pengadaan/{paket_id}/penawaran', [PenawaranController::class, 'store']);
    });

    Route::middleware(['role:Admin,Pokja'])->group(function () {
        Route::post('/admin/paket-pengadaan', [PaketPengadaanController::class, 'store']);
        Route::put('/admin/paket-pengadaan/{id}', [PaketPengadaanController::class, 'update']);
        Route::delete('/admin/paket-pengadaan/{id}', [PaketPengadaanController::class, 'destroy']);
        Route::patch('/admin/paket-pengadaan/{id}/open', [PaketPengadaanController::class, 'publish']);

        Route::post('/admin/paket-pengadaan/{paket_id}/dokumen', [DokumenController::class, 'store']);
        Route::delete('/admin/dokumen/{dokumen_id}', [DokumenController::class, 'destroy']);

        Route::post('/admin/evaluasi', [EvaluasiPenawaranController::class, 'store']);
        Route::put('/admin/evaluasi/{id}', [EvaluasiPenawaranController::class, 'update']);

        Route::post('/admin/pemenang-tender', [PemenangTenderController::class, 'store']);

            Route::get('/laporan/paket', [ReportController::class, 'paket']);
            Route::get('/laporan/penawaran', [ReportController::class, 'penawaran']);
            Route::get('/laporan/evaluasi', [ReportController::class, 'evaluasi']);
    });

    Route::get('/dashboard', [DashboardController::class, 'index']);
});

Route::get('/public/test', function () {
    return response()->json(['message' => 'Public route accessed']);
});


