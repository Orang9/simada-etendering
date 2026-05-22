<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('evaluasipenawaran', function (Blueprint $table) {
            $table->id('evaluasi_id');
            $table->unsignedBigInteger('penawaran_id')->unique();
            $table->unsignedBigInteger('pengguna_id');
            $table->string('status_evaluasi', 50);
            $table->decimal('nilai_teknis', 5, 2)->nullable();
            $table->decimal('nilai_harga', 5, 2)->nullable();
            $table->decimal('total_nilai', 5, 2)->nullable();
            $table->text('catatan_evaluasi')->nullable();
            $table->date('tanggal_evaluasi');

            $table->foreign('penawaran_id')
                  ->references('penawaran_id')
                  ->on('Penawaran')
                  ->onDelete('cascade');

            $table->foreign('pengguna_id')
                  ->references('pengguna_id')
                  ->on('Pengguna')
                  ->onDelete('cascade');

            $table->timestamps();
        });
    }
    public function down(): void {
        Schema::dropIfExists('evaluasipenawaran');
    }
};
