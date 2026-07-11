import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import axios from 'axios'

function Register() {
  const navigate = useNavigate()
  
  // États du formulaire
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [passwordConfirmation, setPasswordConfirmation] = useState('')
  
  // États de gestion des retours API
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleRegister = (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    if (password !== passwordConfirmation) {
      setError('Les mots de passe ne correspondent pas.')
      setLoading(false)
      return
    }

    const data = {
      name: name,
      email: email,
      password: password,
      password_confirmation: passwordConfirmation
    }

    axios.post('http://127.0.0.1:8000/api/register', data)
      .then(response => {
        setLoading(false)
        
        // CORRECTION : On vérifie response.data et on extrait le bon token renvoyé par Laravel
        if (response.data) {
          const userToken = response.data.token || response.data.access_token

          if (userToken) {
            localStorage.setItem('token', userToken)
            localStorage.setItem('user', JSON.stringify(response.data.user))
            
            // Redirection immédiate vers l'accueil
            navigate('/')
          } else {
            setError("Le token d'authentification est manquant dans la réponse du serveur.")
          }
        }
      })
      .catch(err => {
        console.error(err)
        setLoading(false)
        
        // Récupération des messages d'erreurs précis de Laravel
        if (err.response && err.response.data) {
          if (err.response.data.errors) {
            const firstErrorList = Object.values(err.response.data.errors)[0]
            setError(firstErrorList[0])
          } else if (err.response.data.message) {
            setError(err.response.data.message)
          } else {
            setError("Erreur de serveur. Vérifie la configuration Laravel.")
          }
        } else {
          setError("Impossible de joindre le serveur API. Vérifie qu'il est bien lancé.")
        }
      })
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-sm border border-slate-100 p-8">
        
        <div className="text-center mb-8">
          <span className="text-3xl">📝</span>
          <h1 className="text-2xl font-bold text-brand mt-2">Créer un compte</h1>
          <p className="text-gray-500 text-sm mt-1">Rejoignez le laboratoire et publiez vos analyses.</p>
          <p className="text-gray-500 text-sm mt-1">(Projet Final Dclic)</p>
         </div>

        {error && (
          <div className="p-3 bg-red-50 text-red-500 rounded-lg text-sm mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nom complet</label>
            <input 
              type="text" 
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-brand"
              placeholder="Dr. Abiola IBIDOUN"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Adresse Email</label>
            <input 
              type="email" 
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-brand"
              placeholder="abiola.ia@univ.fr"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Mot de passe</label>
            <input 
              type="password" 
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-brand"
              placeholder="••••••••"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Confirmer le mot de passe</label>
            <input
              type="password" 
              required
              value={passwordConfirmation}
              onChange={(e) => setPasswordConfirmation(e.target.value)}
              className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-brand"
              placeholder="••••••••"
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-brand text-white font-medium py-2.5 rounded-lg hover:bg-orange-600 transition disabled:opacity-50"
          >
            {loading ? "Création du compte..." : "S'inscrire"}
          </button>
        </form>

        <div className="text-center mt-6 text-sm text-gray-500">
          Déjà un compte ?{' '}
          <Link to="/login" className="text-brand font-medium hover:underline">
            Se connecter
          </Link>
        </div>

      </div>
    </div>
  )
}

export default Register