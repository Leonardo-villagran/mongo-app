const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();
const cors = require('cors'); // Agrega esta línea

const app = express();
const port = process.env.PORT || 5000;

const db_user = process.env.DB_USER;
const db_pass = process.env.DB_PASSWORD;
const db_name = process.env.DB_NAME;
const db_host = process.env.DB_HOST;
const db_port = process.env.DB_PORT;

app.use(cors()); // Habilita CORS

app.use(express.json());

mongoose.connect(`mongodb://${db_user}:${db_pass}@${db_host}:${db_port}/${db_name}`, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    authSource: "admin"
})
    .then(db => console.log("Db está conectado a ", db.connection.host))
    .catch(err => console.error(err));

// Definir el modelo de usuario
const User = mongoose.model('User', {
    username: String,
    email: String
});

// Ruta para agregar un nuevo usuario
app.post('/users', async (req, res) => {
    try {
        const newUser = new User({
            username: req.body.username,
            email: req.body.email
        });

        await newUser.save();

        res.status(201).json(newUser);
    } catch (error) {
        res.status(500).json({ error: 'Error al crear un nuevo usuario' });
    }
});

// Ruta para obtener los usuarios
app.get('/users', async (req, res) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener los usuarios' });
    }
});

// Ruta para eliminar usuario por ID
app.delete('/users/:id', async (req, res) => {
    try {
        const id = req.params.id;
        // Buscar el usuario por ID y eliminarlo
        const deletedUser = await User.findByIdAndDelete(id);

        if (!deletedUser) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        res.status(200).json({ message: 'Usuario eliminado correctamente' });
    } catch (error) {
        console.error('Error al eliminar usuario:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
});


// Iniciar el servidor
app.listen(port, () => {
    console.log(`Servidor Express iniciado en el puerto ${port}`);
});
