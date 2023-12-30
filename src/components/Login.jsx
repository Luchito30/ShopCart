// Importación de módulos y componentes
import { useState } from 'react';
import PropTypes from 'prop-types';
import Swal from 'sweetalert2';

// Definición del componente Login
const Login = ({ onLogin }) => {
  // Estados locales para el nombre de usuario, la contraseña y el estado de carga
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  // Función para manejar el inicio de sesión
  const handleLogin = async () => {
    // Activar el indicador de carga
    setLoading(true);

    // Simulación de autenticación asincrónica con retardo de 1 segundo
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Datos simulados de usuarios
    const users = [
      { username: 'user1', password: 'password1' },
      { username: 'user2', password: 'password2' },
    ];

    // Verificar si las credenciales ingresadas coinciden con algún usuario
    const isValidUser = users.some((user) => user.username === username && user.password === password);

    // Desactivar el indicador de carga
    setLoading(false);

    // Mostrar un mensaje según la autenticación sea exitosa o no
    if (isValidUser) {
      // Llamar a la función proporcionada como prop para notificar el inicio de sesión exitoso
      onLogin(username);
      // Mostrar un mensaje de éxito utilizando SweetAlert2
      Swal.fire({
        icon: 'success',
        title: '¡Bienvenido!',
        text: `Inicio de sesión exitoso, ${username}!`,
      });
    } else {
      // Mostrar un mensaje de error utilizando SweetAlert2
      Swal.fire({
        icon: 'error',
        title: 'Credenciales incorrectas',
        text: 'Por favor, verifica tu nombre de usuario y contraseña.',
      });
    }
  };

  // Renderizado del componente
  return (
    <div className="d-flex gap-3" style={{ margin: '30px 0' }}>
      {/* Input para el nombre de usuario */}
      <input
        type="text"
        className="form-control mr-2"
        placeholder="Usuario"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      {/* Input para la contraseña */}
      <input
        type="password"
        className="form-control mr-2"
        placeholder="Contraseña"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      {/* Botón para iniciar sesión con manejo de carga */}
      <button className="btn btn-light" onClick={handleLogin} disabled={loading}>
        {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
      </button>
    </div>
  );
};

// Definición de los tipos de propiedades esperadas por el componente
Login.propTypes = {
  onLogin: PropTypes.func.isRequired,  // Función para notificar el inicio de sesión exitoso
};

// Exportación del componente Login
export default Login;
