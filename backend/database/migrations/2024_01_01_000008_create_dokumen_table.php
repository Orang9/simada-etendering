<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('dokumen', function (Blueprint $table) {
            $table->id('dokumen_id');
            $table->unsignedBigInteger('paket_id');
            $table->string('nama_file', 255);
            $table->string('jenis_dokumen', 100);
            $table->date('tanggal_upload');

            $table->foreign('paket_id')
                  ->references('paket_id')
                  ->on('PaketPengadaan')
                  ->onDelete('cascade');

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('dokumen');
    }
};
