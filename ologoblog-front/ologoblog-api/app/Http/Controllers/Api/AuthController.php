<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    /**
     * Inscription d'un nouvel utilisateur.
     */
    public function register(Request $request): JsonResponse
    {
        // 1. Validation stricte des données reçues depuis React
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8|confirmed',
        ]);

        // 2. Création de l'utilisateur avec son mot de passe haché
        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
        ]);

        // 3. Génération du jeton Sanctum (Bearer Token)
        $token = $user->createToken('admin-access')->plainTextToken;

        return response()->json([
            'message' => 'Inscription réussie',
            'token' => $token,
            'user' => [
                'name' => $user->name,
                'email' => $user->email
            ]
        ], 201);
    }

    /**
     * Authentifier l'administrateur et retourner un token Sanctum.
     */
    public function login(Request $request): JsonResponse
    {
        // 1. Validation des données reçues
        $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        // 2. Recherche de l'utilisateur dans la base de données
        $user = User::where('email', $request->email)->first();

        // 3. Vérification du mot de passe haché (Bcrypt)
        if (! $user || ! Hash::check($request->password, $user->password)) {
            throw ValidationException::withMessages([
                'email' => ['Les identifiants saisis sont incorrects.'],
            ]);
        }

        // 4. Génération du jeton Sanctum unique (Bearer Token)
        $token = $user->createToken('admin-access')->plainTextToken;

        return response()->json([
            'message' => 'Connexion réussie',
            'token' => $token,
            'user' => [
                'name' => $user->name,
                'email' => $user->email
            ]
        ], 200);
    }

    /**
     * Déconnexion (Révocation du jeton actuel).
     */
    public function logout(Request $request): JsonResponse
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'message' => 'Déconnexion réussie'
        ], 200);
    }
}