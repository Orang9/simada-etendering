<?php

namespace App\Http\Controllers;

use App\Models\PaketPengadaan;
use App\Models\Opd;
use App\Models\MetodePengadaan;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Http\JsonResponse;

class PaketPengadaanController extends Controller
{
    /**
     * List all published paket pengadaan.
     */
    public function index(): JsonResponse
    {
        $pakets = PaketPengadaan::where('status', 'open')->get();
        return response()->json($pakets);
    }

    /**
     * Show a single paket pengadaan (any status if authenticated, otherwise only published).
     */
    public function show($id, Request $request): JsonResponse
    {
        $query = PaketPengadaan::where('paket_id', $id);
        if (! $request->user()) {
            $query->where('status', 'open');
        }
        $paket = $query->first();
        if (! $paket) {
            return response()->json(['error' => 'Not found'], 404);
        }
        return response()->json($paket);
    }

    /**
     * Create a new paket pengadaan (Admin/Pokja only).
     */
    public function store(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'nama_paket' => 'required|string',
            'status' => 'required|string',
            'opd_id' => 'required|exists:opd,opd_id',
            'metode_id' => 'required|exists:metodepengadaan,metode_id',
        ]);
        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }
        $paket = PaketPengadaan::create($validator->validated());
        return response()->json($paket, 201);
    }

    /**
     * Update an existing paket pengadaan (Admin/Pokja only).
     */
    public function update(Request $request, $id): JsonResponse
    {
        $paket = PaketPengadaan::find($id);
        if (! $paket) {
            return response()->json(['error' => 'Not found'], 404);
        }
        $validator = Validator::make($request->all(), [
            'nama_paket' => 'sometimes|required|string',
            'status' => 'sometimes|required|string',
            'opd_id' => 'sometimes|required|exists:opd,opd_id',
            'metode_id' => 'sometimes|required|exists:metodepengadaan,metode_id',
        ]);
        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }
        $paket->update($validator->validated());
        return response()->json($paket);
    }

    /**
     * Delete a paket pengadaan (Admin/Pokja only).
     */
    public function destroy($id): JsonResponse
    {
        $paket = PaketPengadaan::find($id);
        if (! $paket) {
            return response()->json(['error' => 'Not found'], 404);
        }
        $paket->delete();
        return response()->json(['message' => 'Deleted'], 200);
    }

    /**
     * Publish a paket pengadaan (Admin/Pokja only).
     */
    public function publish($id): JsonResponse
    {
        $paket = PaketPengadaan::find($id);
        if (! $paket) {
            return response()->json(['error' => 'Not found'], 404);
        }
        $paket->status = 'open';
        $paket->save();
        return response()->json($paket);
    }
}
