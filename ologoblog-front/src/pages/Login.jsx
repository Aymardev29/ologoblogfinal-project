import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import axios from 'axios'

function Login() {
  const navigate = useNavigate()
  
  // États du formulaire
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  
  // États de gestion des retours API
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleLogin = (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const data = {
      email: email,
      password: password
    }

    axios.post('http://127.0.0.1:8000/api/login', data)
      .then(response => {
        setLoading(false)
        
        if (response.data && response.data.token) {
          // Stockage du token et des infos de l'utilisateur connecté
          localStorage.setItem('token', response.data.token)
          localStorage.setItem('user', JSON.stringify(response.data.user))
          
          // Redirection instantanée vers la page d'accueil
          navigate('/')
        } else {
          setError("Le serveur n'a pas renvoyé de jeton valide.")
        }
      })
      .catch(err => {
        console.error(err)
        setLoading(false)
        
        // Interceptions des erreurs d'identifiants de Laravel
        if (err.response && err.response.data) {
          if (err.response.data.errors) {
            const firstErrorList = Object.values(err.response.data.errors)[0]
            setError(firstErrorList[0])
          } else if (err.response.data.message) {
            setError(err.response.data.message)
          } else {
            setError("Identifiants incorrects ou erreur serveur.")
          }
        } else {
          setError("Impossible de joindre le serveur API.")
        }
      })
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-sm border border-slate-100 p-8">
        
        <div className="text-center mb-8">
          <span className="text-3xl">🔬</span>
          <h1 className="text-2xl font-bold text-brand mt-2">Connexion Espace Chercheur</h1>
          <p className="text-gray-500 text-sm mt-1">Accédez à votre laboratoire d'analyses.</p>
        </div>

        {error && (
          <div className="p-3 bg-red-50 text-red-500 rounded-lg text-sm mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Adresse Email</label>
            <input 
              type="email" 
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-brand"
              placeholder="jean.dupont@univ.fr"
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

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-brand text-white font-medium py-2.5 rounded-lg hover:bg-orange-600 transition disabled:opacity-50"
          >
            {loading ? "Vérification..." : "Se connecter"}
          </button>
        </form>

        <div className="text-center mt-6 text-sm text-gray-500">
          Pas encore de compte ?{' '}
          <Link to="/register" className="text-brand font-medium hover:underline">
            Créer un compte
          </Link>
        </div>

      </div>
    </div>
  )
}

export default Login