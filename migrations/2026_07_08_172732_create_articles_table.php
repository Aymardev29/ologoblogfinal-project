<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
{
    Schema::create('articles', function (Blueprint $table) {
        $table->id();
        $table->string('title');
        $table->string('slug')->unique();
        $table->longText('content'); // Contenu de l'article écrit en Markdown
        $table->string('image_cover')->nullable(); // Lien vers l'image de couverture Cloudinary
        $table->enum('status', ['Brouillon', 'Publié'])->default('Brouillon'); // Gestion du statut
        
        // Clés étrangères (Foreign Keys)
        $table->foreignId('category_id')->constrained()->onDelete('cascade');
        $table->foreignId('user_id')->constrained()->onDelete('cascade');
        $table->foreignId('dataset_id')->nullable()->constrained()->onDelete('set null');
        
        $table->timestamps();
    });
}
    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('articles');
    }
};
