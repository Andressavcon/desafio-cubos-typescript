import { NextFunction, Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { knex } from '../bancodedados/conexao';
import { Usuario } from '../tipos/Usuario';

const senhaJwt = process.env.JWT_PASSWORD as string;

export const verificaLogin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { authorization } = req.headers;
  if (!authorization) {
    return res.status(401).json({ mensagem: 'Não autorizado.' });
  }

  const [, token] = authorization.split(' ');

  const { id } = jwt.verify(token, senhaJwt) as { id: number };

  try {
    const usuario = await knex<Usuario>('usuarios').where({ id }).first();

    if (!usuario) {
      return res.status(401).json({ mensagem: 'Não autorizado.' });
    }

    next();
  } catch {
    return res.status(500).json({ mensagem: 'Erro interno do servidor.' });
  }
};
