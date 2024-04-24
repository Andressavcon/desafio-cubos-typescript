import { Request, Response } from 'express';
import { knex } from '../bancodedados/conexao';
import { Livro } from '../tipos/Livro';

export const listarLivros = async (req: Request, res: Response) => {
  try {
    const livros = await knex<Livro>('livros');
    return res.json(livros);
  } catch {
    return res.status(500).json({ mensagem: 'Erro interno do servidor.' });
  }
};

export const obterLivro = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const livro = await knex<Livro>('livros')
      .where({ id: Number(id) })
      .first();

    if (!livro) {
      return res.status(404).json({ mensagem: 'Livro não encontrado.' });
    }

    return res.json(livro);
  } catch {
    return res.status(500).json({ mensagem: 'Erro interno do servidor.' });
  }
};
