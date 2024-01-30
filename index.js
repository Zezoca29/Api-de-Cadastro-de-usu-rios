const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const { swaggerSpec, swaggerUi } = require('./swagger');
const Usuario = require('./models/usuario');
const app = express();
const PORT = process.env.PORT || 3000;

mongoose.connect('mongodb+srv://Zezoka29:Nofaka12@cluster0.3dwliuh.mongodb.net/', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'Erro de conexão com o MongoDB:'));
db.once('open', () => {
  console.log('Conexão bem-sucedida com o MongoDB!');
});

const corsOptions = {
  origin: 'http://localhost:3001', // Update this with the actual origin of your frontend app
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
  optionsSuccessStatus: 204,
};

app.use(cors(corsOptions));
app.use(express.json());

/**
 * @swagger
 * tags:
 *   name: Usuários
 *   description: Operações relacionadas a usuários.
 */

/**
 * @swagger
 * /usuarios:
 *   post:
 *     summary: Cria um novo usuário.
 *     tags: [Usuários]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Usuario'
 *     responses:
 *       '201':
 *         description: Usuário criado com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Usuario'
 */

app.post('/usuarios', async (req, res) => {
  try {
    const usuario = new Usuario(req.body);
    await usuario.save();
    res.status(201).send(usuario);
  } catch (error) {
    res.status(400).send(error);
  }
});

/**
 * @swagger
 * /usuarios:
 *   get:
 *     summary: Obtém todos os usuários.
 *     tags: [Usuários]
 *     responses:
 *       '200':
 *         description: Lista de usuários.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Usuario'
 */

app.get('/usuarios', async (req, res) => {
  try {
    const usuarios = await Usuario.find();
    res.send(usuarios);
  } catch (error) {
    res.status(500).send(error);
  }
});

/**
 * @swagger
 * /usuarios/{id}:
 *   get:
 *     summary: Obtém um usuário pelo ID.
 *     tags: [Usuários]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID do usuário.
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Usuário encontrado.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Usuario'
 *       '404':
 *         description: Usuário não encontrado.
 *         content:
 *           application/json:
 *             example:
 *               mensagem: Usuário não encontrado
 */

app.get('/usuarios/:id', async (req, res) => {
  try {
    const usuario = await Usuario.findById(req.params.id);
    if (!usuario) {
      return res.status(404).send({ mensagem: 'Usuário não encontrado' });
    }
    res.send(usuario);
  } catch (error) {
    res.status(500).send(error);
  }
});

/**
 * @swagger
 * /usuarios/{id}:
 *   patch:
 *     summary: Atualiza um usuário pelo ID.
 *     tags: [Usuários]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID do usuário.
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Usuario'
 *     responses:
 *       '200':
 *         description: Usuário atualizado com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Usuario'
 *       '404':
 *         description: Usuário não encontrado.
 *         content:
 *           application/json:
 *             example:
 *               mensagem: Usuário não encontrado
 */

app.patch('/usuarios/:id', async (req, res) => {
  try {
    const usuario = await Usuario.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!usuario) {
      return res.status(404).send({ mensagem: 'Usuário não encontrado' });
    }
    res.send(usuario);
  } catch (error) {
    res.status(500).send(error);
  }
});

/**
 * @swagger
 * /usuarios/{id}:
 *   delete:
 *     summary: Deleta um usuário pelo ID.
 *     tags: [Usuários]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID do usuário.
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Usuário deletado com sucesso.
 *         content:
 *           application/json:
 *             example:
 *               mensagem: Usuário deletado com sucesso
 *       '404':
 *         description: Usuário não encontrado.
 *         content:
 *           application/json:
 *             example:
 *               mensagem: Usuário não encontrado
 */

app.delete('/usuarios/:id', async (req, res) => {
  try {
    const usuario = await Usuario.findByIdAndDelete(req.params.id);
    if (!usuario) {
      return res.status(404).send({ mensagem: 'Usuário não encontrado' });
    }
    res.send({ mensagem: 'Usuário deletado com sucesso' });
  } catch (error) {
    res.status(500).send(error);
  }
});

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, { cors: true }));

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
