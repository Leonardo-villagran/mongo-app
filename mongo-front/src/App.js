import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  const [users, setUsers] = useState([]);
  const [newUser, setNewUser] = useState({ username: '', email: '' });
  const [deleteSuccess, setDeleteSuccess] = useState(false);
  const [deletedUserName, setDeletedUserName] = useState('');

  useEffect(() => {
    axios.get('http://localhost:5000/users')
      .then(response => setUsers(response.data))
      .catch(error => console.error('Error al obtener usuarios:', error));
  }, []);

  const handleInputChange = event => {
    const { name, value } = event.target;
    setNewUser({
      ...newUser,
      [name]: value,
    });
  };

  const handleSubmit = event => {
    event.preventDefault();

    axios.post('http://localhost:5000/users', newUser)
      .then(response => {
        setUsers([...users, response.data]);
        setNewUser({ username: '', email: '' });
      })
      .catch(error => console.error('Error al agregar usuario:', error));
  };

  const handleDelete = (id, username) => {
    axios.delete(`http://localhost:5000/users/${id}`)
      .then(() => {
        const updatedUsers = users.filter(user => user._id !== id);
        setUsers(updatedUsers);

        setDeletedUserName(username);
        setDeleteSuccess(true);

        setTimeout(() => {
          setDeleteSuccess(false);
        }, 3000);
      })
      .catch(error => console.error('Error al eliminar usuario:', error));
  };

  return (
    <div className="background-dark" style={{ backgroundColor: 'black', color: 'white', minHeight: '100vh' }}>
      {deleteSuccess && (
        <div className="alert alert-success" role="alert">
          Usuario <strong>{deletedUserName}</strong> eliminado con éxito.
        </div>
      )}

      <div className="col-md-6 mx-auto">
        <div className="card mt-4" style={{ backgroundColor: '#333', color: 'white' }}>
          <div className="card-body">
            <h2 className="card-title">Agregar Usuario</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Username:</label>
                <input
                  type="text"
                  className="form-control"
                  name="username"
                  value={newUser.username}
                  onChange={handleInputChange}
                  required
                  style={{ backgroundColor: '#444', color: 'white' }}
                />
              </div>
              <div className="form-group">
                <label>Email:</label>
                <input
                  type="email"
                  className="form-control"
                  name="email"
                  value={newUser.email}
                  onChange={handleInputChange}
                  required
                  style={{ backgroundColor: '#444', color: 'white' }}
                />
              </div>
              <button type="submit" className="btn btn-primary">Agregar Usuario</button>
            </form>
          </div>
        </div>
      </div>

        <h2 className="my-4">Lista de Usuarios Registrado</h2>
      <ul className="list-unstyled">
        {users.map(user => (
          <li key={user._id} className="media mb-3" style={{ backgroundColor: '#333', padding: '10px', borderRadius: '5px' }}>
            <div className="media-body">
              <div className="row align-items-center">
                <div className="col-md-3">
                  <p className="mb-0"><strong>ID:</strong></p>
                  <p>{user._id}</p>
                </div>
                <div className="col-md-3">
                  <h5 className="mt-0">{user.username}</h5>
                </div>
                <div className="col-md-4">
                  <p className="mb-0"><strong>Email:</strong></p>
                  <p>{user.email}</p>
                </div>
                <div className="col-md-2">
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => handleDelete(user._id, user.username)} 
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
