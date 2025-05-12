import { useState } from "react";
import axios from "axios";

function LoginForm({ onLoginSuccess }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      // Enviar datos de login a Firebase
      const response = await axios.post("http://localhost:8080/firebase/login", {
        email,
        password,
        additionalInfo: {
          message: "Login exitoso",
          timestamp: new Date().toISOString()
        }
      });

      console.log("Respuesta del servidor:", response.data);
      
      // Almacenar la información del usuario y el loginId en localStorage
      localStorage.setItem("userEmail", email);
      localStorage.setItem("loginId", response.data.loginId);
      
      // Notificar al componente padre (About.jsx)
      const role = email.includes("admin") ? "admin" : "guest";
      onLoginSuccess(role);
    } catch (err) {
      console.error("Error en el login:", err);
      if (err.message === "Network Error") {
        setError("No se pudo conectar con el servidor. Verifica que el backend esté en ejecución.");
      } else {
        setError("Error al iniciar sesión: " + (err.response?.data?.message || err.message));
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h2 className="text-xl font-bold mb-4">Iniciar Sesión</h2>
      {error && <p className="text-red-600 bg-red-100 p-2 rounded">{error}</p>}
      {loading && <p className="text-blue-600">Procesando...</p>}
      <div className="mb-4">
        <label className="block mb-1">Email:</label>
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border p-2 rounded"
          disabled={loading}
        />
      </div>
      <div className="mb-4">
        <label className="block mb-1">Contraseña:</label>
        <input
          type="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border p-2 rounded"
          disabled={loading}
        />
      </div>
      <button 
        type="submit" 
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
        disabled={loading}
      >
        {loading ? "Conectando..." : "Entrar"}
      </button>
    </form>
  );
}

export default LoginForm;