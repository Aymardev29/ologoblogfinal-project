<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Category;
use App\Models\Dataset;
use App\Models\Article;
use Illuminate\Support\Str;

class BiologicalDataSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Création d'une catégorie Bioinformatique
        $category = Category::create([
            'name' => 'Visualisation de Données',
            'slug' => 'visualisation-de-donnees',
        ]);

        // 2. Création d'un jeu de données factice (Séquence d'ADN + Matrice au format JSON)
        $dataset = Dataset::create([
            'title' => "Analyse d'expression du gène TP53 (Cancer)",
            'data_type' => 'JSON_MATRIX',
            'content' => json_encode([
                'labels' => ['Cellules Saines', 'Tumeur Stade 1', 'Tumeur Stade 2', 'Tumeur Stade 3'],
                'expression_levels' => [12.4, 45.1, 78.8, 110.2],
                'sequence_dna' => 'ATGGCGGAGGAGCAGCCTTCGCTTCAGCCATTGGTTTCC'
            ]),
        ]);

        // 3. Création de l'article de blog associé
        Article::create([
            'title' => 'Visualiser l expression du gène TP53 avec React',
            'slug' => 'visualiser-expression-gene-tp53-avec-react',
            'content' => "# Introduction\nDans cet article, nous analysons la surexpression du gène TP53...\n\n# Visualisation\nLe graphique ci-dessous utilise les données brutes de notre API.",
            'image_cover' => 'https://res.cloudinary.com/demo/image/upload/sample.jpg',
            'status' => 'Publié',
            'category_id' => $category->id,
            'dataset_id' => $dataset->id,
        ]);
    }
}