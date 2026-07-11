import { useNavigate, Link } from 'react-router-dom'
import axios from 'axios'

function Navbar() {
  const navigate = useNavigate()
  
  // On récupère l'utilisateur et le token depuis le localStorage
  const token = localStorage.getItem('token')
  const user = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null

  const handleLogout = () => {
    // Si on a un token, on prévient le back-end Laravel pour détruire le jeton
    if (token) {
      axios.post('http://127.0.0.1:8000/api/logout', {}, {
        headers:  'Authorization: Bearer ${token}' 
      })
      .catch(err => console.error("Erreur lors de la déconnexion back-end:", err))
    }

    // Dans tous les cas, on nettoie le localStorage et on redirige vers l'accueil
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    navigate('/login')
  }

  return (
    <nav className="bg-white border-b border-slate-100 px-6 py-4 flex justify-between items-center shadow-sm">
      <Link to="/" className="text-xl font-bold text-brand flex items-center gap-2">
        <span>🔬</span> OlogoBlog
      </Link>

      <div className="flex items-center gap-4">
        {token && user ? (
          <>
            {/* Si connecté */}
            <span className="text-sm text-gray-600 bg-slate-100 px-3 py-1.5 rounded-full font-medium">
              👨‍🔬 {user.name}
            </span>
            <Link to="/create-article" className="text-sm bg-brand text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition">
              + Écrire un article
            </Link>
            <button 
              onClick={handleLogout}
              className="text-sm text-red-500 hover:text-red-700 font-medium transition"
            >
              Déconnexion
            </button>
          </>
        ) : (
          <>
            {/* Si non connecté */}
            <Link to="/login" className="text-sm text-gray-600 hover:text-brand font-medium">
              Se connecter
            </Link>
            <Link to="/register" className="text-sm bg-brand text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition">
              S'inscrire
            </Link>
          </>
        )}
      </div>
    </nav>
  )
}

export default Navbar