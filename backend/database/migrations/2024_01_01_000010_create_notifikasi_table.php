<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('notifikasi', function (Blueprint $table) {
            $table->id('notifikasi_id');
            $table->unsignedBigInteger('pengguna_id');
            $table->text('pesan');
            $table->dateTime('tanggal_kirim');
            $table->string('jenis_notifikasi', 100);

            $table->foreign('pengguna_id')
                  ->references('pengguna_id')
                  ->on('Pengguna')
                  ->onDelete('cascade');

            $table->timestamps();
        });
    }
    public function down(): void {
        Schema::dropIfExists('notifikasi');
    }
};
