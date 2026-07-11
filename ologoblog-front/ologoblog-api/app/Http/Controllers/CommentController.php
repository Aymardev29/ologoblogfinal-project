<?php

namespace App\Http\Controllers;

use App\Models\Comment;
use Illuminate\Http\Request;

class CommentController extends Controller
{
    // Enregistrer un nouveau commentaire
    public function store(Request $request)
    {
        $request->validate([
            'content' => 'required|string',
            'article_id' => 'required|exists:articles,id',
            'user_id' => 'required|exists:users,id',
        ]);

        $comment = Comment::create([
            'content' => $request->content,
            'article_id' => $request->article_id,
            'user_id' => $request->user_id, // Plus tard on pourra utiliser auth()->id() si connecté
        ]);

        // On renvoie le commentaire avec les infos de l'utilisateur qui l'a écrit
        return response()->json($comment->load('user'), 21);
    }
}