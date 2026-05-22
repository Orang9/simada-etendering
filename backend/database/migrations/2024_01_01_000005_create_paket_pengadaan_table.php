<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('paketpengadaan', function (Blueprint $table) {
            $table->id('paket_id');
            $table->string('nama_paket', 200);
            $table->string('status', 50);
            $table->unsignedBigInteger('opd_id');
            $table->unsignedBigInteger('metode_id');

            $table->foreign('opd_id')
                  ->references('opd_id')
                  ->on('OPD')
                  ->onDelete('cascade');

            $table->foreign('metode_id')
                  ->references('metode_id')
                  ->on('MetodePengadaan')
                  ->onDelete('cascade');

            $table->timestamps();
        });
    }
    public function down(): void {
        Schema::dropIfExists('paketpengadaan');
    }
};
