import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; 

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth(); 

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [cargando, setCargando] = useState(false);

  const manejarEnvio = async (e) => {
    e.preventDefault();
    setError(null);
    setCargando(true);

    const payload = { email, password };

    try {
      const respuesta = await fetch('http://127.0.0.1:5000/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!respuesta.ok) {
        const texto = await respuesta.text();
        throw new Error(`${texto || respuesta.status}`);
      }

      const data = await respuesta.json();

      if (!data.token) {
        throw new Error('Token no recibido del servidor.');
      }

      login(data.token, email); 
      navigate('/');
    } catch (err) {
      setError(err.message);
      console.error(err);
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className='d-flex justify-content-center align-items-center'>
      <div className='card p-4 ventanabg text-center shadow login-card'>
        <h2 className='mb-3'>Iniciar sesión</h2>
        <Form
          className="d-flex flex-column align-items-center"
          onSubmit={manejarEnvio}
        >
          <Form.Group className="mb-3 w-100" controlId="formEmail">
            <Form.Label>Correo electrónico</Form.Label>
            <Form.Control
              type="email"
              name="email"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3 w-100" controlId="formPassword">
            <Form.Label>Contraseña</Form.Label>
            <Form.Control
              type="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </Form.Group>

          {error && (
            <div style={{ color: 'red', marginBottom: '1rem' }}>
              {error}
            </div>
          )}

          <div className="d-grid gap-2 w-100">
            <Button type="submit" disabled={cargando} variant="success">
              Iniciar sesión
            </Button>
            <Button variant="outline-primary" href="/registrar">
              Crear cuenta
            </Button>
          </div>
        </Form>
      </div>
    </div>
  );
}
