import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { knex } from '../bancodedados/conexao';
import { Usuario } from '../tipos/Usuario';

const senhaJwt = process.env.JWT_PASSWORD as string;

export const login = async (req: Request, res: Response) => {
  const { email, senha } = req.body;

  try {
    const usuario = await knex<Usuario>('usuarios').where({ email }).first();

    if (!usuario) {
      return res.status(400).json({ mensagem: 'E-mail ou senha inválida.' });
    }

    const senhaCorreta = await bcrypt.compare(senha, usuario.senha);

    if (!senhaCorreta) {
      return res.status(400).json({ mensagem: 'E-mail ou senha inválida.' });
    }

    const token = jwt.sign({ id: usuario.id }, senhaJwt, { expiresIn: '8h' });

    const { senha: _, ...dadosUsuario } = usuario;

    return res.json({
      usuario: dadosUsuario,
      token,
    });
  } catch {
    return res.status(500).json({ mensagem: 'Erro interno do servidor.' });
  }
};
