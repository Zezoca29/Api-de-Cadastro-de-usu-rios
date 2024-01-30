/**
 * @swagger
 * components:
 *   schemas:
 *     Usuario:
 *       type: object
 *       required:
 *         - name
 *         - email
 *         - tag
 *       properties:
 *         name:
 *           type: string
 *           description: Nome do usuário
 *         email:
 *           type: string
 *           format: email
 *           description: Endereço de e-mail do usuário
 *         tag:
 *           type: string
 *           maxLength: 24
 *           description: Tag do usuário com no máximo 24 caracteres
 */

const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  tag: {
    type: String,
    required: true,
    maxlength: 24
  }
});

const Usuario = mongoose.model('Usuario', userSchema);

module.exports = Usuario;
