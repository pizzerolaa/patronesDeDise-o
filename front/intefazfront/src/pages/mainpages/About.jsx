import { useState, useEffect } from "react";
import axios from "axios";
import LoginForm from "../../componentes/LoginForm";

function About() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [role, setRole] = useState("");
  const [formFields, setFormFields] = useState([]);
  const [firebaseData, setFirebaseData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [formValues, setFormValues] = useState({});

  // Función para obtener datos del formulario según el rol
  const fetchFormFields = async (userRole) => {
    try {
      const response = await axios.get(`http://localhost:8080/form/${userRole}`);
      setFormFields(response.data);
      return response.data; // Devolvemos los campos para usarlos en fetchFirebaseData
    } catch (err) {
      console.error("Error al obtener el formulario:", err);
      return [];
    }
  };

  // Función para obtener datos de Firebase
  const fetchFirebaseData = async (fields) => {
    setLoading(true);
    try {
      const loginId = localStorage.getItem("loginId");
      const email = localStorage.getItem("userEmail");
      
      if (loginId) {
        // Intentar obtener datos de Firebase
        let firebaseResponse = null;
        try {
          const response = await axios.get(`http://localhost:8080/firebase/user/${loginId}`);
          firebaseResponse = response.data;
          setFirebaseData(firebaseResponse);
        } catch (err) {
          console.warn("No se pudieron obtener datos de Firebase:", err);
        }
        
        // Crear valores para el formulario
        const values = {};
        
        // Si tenemos campos del formulario y son del tipo esperado
        if (fields && fields.length > 0) {
          // Asignar valores a cada campo según su etiqueta
          fields.forEach(field => {
            if (field.label === "Nickname") {
              values[field.label] = loginId || "";
            } else if (field.label === "Field 1") {
              values[field.label] = email || "";
            } else if (field.label === "Field 2") {
              values[field.label] = "********"; // Contraseña por seguridad
            }
          });
        }
        
        console.log("Valores cargados:", values); // Debugging
        setFormValues(values);
      }
    } catch (err) {
      console.error("Error al obtener datos de Firebase:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleLoginSuccess = async (userRole) => {
    setIsLoggedIn(true);
    setRole(userRole);
    
    // Obtener campos de formulario según rol y luego cargar datos
    const fields = await fetchFormFields(userRole);
    await fetchFirebaseData(fields);
  };

  // Agregar un efecto para verificar si los datos se están cargando correctamente
  useEffect(() => {
    console.log("FormFields:", formFields);
    console.log("FormValues:", formValues);
  }, [formFields, formValues]);

  const handleInputChange = (e, fieldLabel) => {
    setFormValues(prev => ({
      ...prev,
      [fieldLabel]: e.target.value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Formulario enviado con valores:", formValues);
    // Aquí podrías implementar la lógica para enviar los datos
  };

  return (
    <div className="p-6 max-w-md mx-auto">
      {!isLoggedIn ? (
        <LoginForm onLoginSuccess={handleLoginSuccess} />
      ) : (
        <div>
          <h2 className="text-xl mb-4">Formulario para rol: {role}</h2>
          
          {loading ? (
            <p className="text-blue-600">Cargando datos...</p>
          ) : (
            <form className="mb-6" onSubmit={handleSubmit}>
              {formFields.map((field, index) => (
                <div key={index} className="mb-4">
                  <label className="block mb-1">{field.label}:</label>
                  <input
                    type={field.type}
                    required={field.required}
                    value={formValues[field.label] || ""}
                    onChange={(e) => handleInputChange(e, field.label)}
                    className="w-full border p-2 rounded"
                    readOnly={field.label === "Nickname" || field.label === "Field 1"} // Los datos de Firebase son de solo lectura
                  />
                </div>
              ))}
              <button 
                type="submit" 
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
              >
                Enviar
              </button>
            </form>
          )}
          
          {/* Información adicional de Firebase */}
          {firebaseData?.additionalInfo && (
            <div className="mt-4 p-3 bg-gray-100 rounded">
              <h4 className="font-medium">Información adicional:</h4>
              <p>Mensaje: {firebaseData.additionalInfo.message}</p>
              <p>Fecha: {new Date(firebaseData.additionalInfo.timestamp).toLocaleString()}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default About;