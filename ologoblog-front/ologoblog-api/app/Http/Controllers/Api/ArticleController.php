<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Article;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str; // Import nécessaire pour nettoyer le nom des fichiers si besoin

class ArticleController extends Controller
{
    /**
     * Afficher la liste des articles publiés.
     */
    public function index(): JsonResponse
    {
        $articles = Article::with(['user', 'category'])->latest()->get();
        return response()->json($articles, 200);
    }

    /**
     * Enregistrer un nouvel article.
     */
    public function store(Request $request): JsonResponse
    {
        // 1. Validation des données reçues depuis React (avec ajout du champ image)
        $validatedData = $request->validate([
            'title'       => 'required|string|max:255',
            'content'     => 'required|string',
            'category_id' => 'required|exists:categories,id',
            'user_id'     => 'required|exists:users,id',
            'image_cover'       => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048', // Max 2Mo
        ]);

        // 2. Traitement et stockage physique de l'image si elle est présente
        if ($request->hasFile('image')) {
            $file = $request->file('image');
            
            // On sécurise le nom du fichier avec un timestamp pour éviter les doublons
            $filename = time() . '_' . Str::slug($request->title) . '.' . $file->getClientOriginalExtension();
            
            // Sauvegarde dans storage/app/public/articles
            $file->storeAs('public/articles', $filename); 
            
            // On ajoute le chemin de stockage public dans les données validées à insérer
            $validatedData['image'] = 'storage/articles/' . $filename;
        }

        // 3. Création de l'article en base de données avec toutes les données validées
        $article = Article::create($validatedData);

        // 4. Retourne l'article créé avec les relations chargées
        return response()->json([
            'message' => 'Article créé avec succès !',
            'article' => $article->load(['category', 'user'])
        ], 201);
    }

    /**
     * Afficher un article spécifique.
     */
    public function show(Article $article): JsonResponse
    {
        $article->load(['category', 'user']);
        return response()->json($article, 200);
    

    // On récupère l'article en incluant ses commentaires et les auteurs des commentaires
    $article = Article::with(['category', 'comments.user'])->findOrFail($id);
    return response()->json($article);
}

}