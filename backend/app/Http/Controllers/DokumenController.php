<?php

namespace App\Http\Controllers;

use App\Models\Dokumen;
use App\Models\PaketPengadaan;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Http\JsonResponse;

class DokumenController extends Controller
{
    /**
     * List documents for a paket.
     * Admin/Pokja see all, others only if paket is published.
     */
    public function index(Request $request, $paket_id)
    {
        $paket = PaketPengadaan::where('paket_id', $paket_id)->first();

        if (!$paket) {
            return response()->json(['error' => 'Paket not found'], 404);
        }

        $user = $request->user();
        if (!$user && $request->bearerToken()) {
            $user = \App\Models\Pengguna::find($request->bearerToken());
        }

        $role = optional($user?->role)->nama_role;

        if (in_array($role, ['Admin', 'Pokja'])) {
            return response()->json(
                Dokumen::where('paket_id', $paket_id)->get()
            );
        }

        if ($paket->status !== 'open') {
            return response()->json(['error' => 'Forbidden'], 403);
        }

        return response()->json(
            Dokumen::where('paket_id', $paket_id)->get()
        );
    }

    /**
     * Upload a new document (admin only).
     */
    public function store(Request $request, $paket_id): JsonResponse
    {
        // Validation
        // Validate input
        $paket = PaketPengadaan::find($paket_id);
        if (! $paket) {
            return response()->json(['error' => 'Paket not found'], 404);
        }
        $validator = Validator::make($request->all(), [
            'nama_file' => 'required|string',
            'jenis_dokumen' => 'required|string',
            'tanggal_upload' => 'sometimes|date',
        ]);
        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }
        $data = $validator->validated();
        $data['paket_id'] = $paket_id;
        if (empty($data['tanggal_upload'])) {
            $data['tanggal_upload'] = now()->toDateString();
        }
        $doc = Dokumen::create($data);
        return response()->json($doc, 201);
    }

    /**
     * Delete a document (admin only).
     */
    public function destroy($dokumen_id): JsonResponse
    {
        $doc = Dokumen::find($dokumen_id);
        if (! $doc) {
            return response()->json(['error' => 'Document not found'], 404);
        }
        $doc->delete();
        return response()->json(['message' => 'Deleted'], 200);
    }
}
?>
