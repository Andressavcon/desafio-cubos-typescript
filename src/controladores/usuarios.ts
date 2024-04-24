import { Request, Response } from 'express';
import { knex } from '../bancodedados/conexao';
import { Usuario } from '../tipos/Usuario';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const senhaJwt = process.env.JWT_PASSWORD as string;

const usuarioLogado = async (req: Request) => {
  const { authorization } = req.headers;

  const [, token] = authorization!.split(' ');

  const { id } = jwt.verify(token, senhaJwt) as { id: number };

  const usuario = await knex<Usuario>('usuarios').where({ id }).first();
  const { senha, ...dadosUsuario } = usuario!;

  return dadosUsuario;
};

export const cadastrarUsuario = async (req: Request, res: Response) => {
  const { nome, email, senha } = req.body;

  try {
    const usuarioExistente = await knex<Usuario>('usuarios')
      .where({ email: email })
      .first();

    if (usuarioExistente) {
      return res
        .status(400)
        .json({ mensagem: 'O email informado já está em uso.' });
    }

    const senhaCriptografada = await bcrypt.hash(senha, 10);

    const usuario = await knex<Usuario>('usuarios')
      .insert({
        nome,
        email,
        senha: senhaCriptografada,
      })
      .returning('*');

    const { senha: _, ...usuarioCadastrado } = usuario[0];

    return res.status(201).json(usuarioCadastrado);
  } catch {
    return res.status(500).json({ mensagem: 'Erro interno do servidor.' });
  }
};

export const obterPerfil = async (req: Request, res: Response) => {
  const usuario = await usuarioLogado(req);

  return res.json(usuario);
};

export const atualizarPerfil = async (req: Request, res: Response) => {
  const usuario = await usuarioLogado(req);
  const { nome, email, senha } = req.body;
  try {
    const usuarioExistente = await knex<Usuario>('usuarios')
      .where({ email: email })
      .first();

    if (usuarioExistente && email !== usuario.email) {
      return res
        .status(400)
        .json({ mensagem: 'O email informado já está em uso.' });
    }

    const senhaCriptografada = await bcrypt.hash(senha, 10);

    await knex<Usuario>('usuarios')
      .where({ id: usuario.id })
      .update({ nome, email, senha: senhaCriptografada });

    return res.status(204).send();
  } catch {
    return res.status(500).json({ mensagem: 'Erro interno do servidor.' });
  }
};
