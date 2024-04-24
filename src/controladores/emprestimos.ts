import { Request, Response, response } from 'express';
import { knex } from '../bancodedados/conexao';
import { Aluno } from '../tipos/Aluno';
import { Usuario } from '../tipos/Usuario';
import { Livro } from '../tipos/Livro';

export const emprestarLivro = async (req: Request, res: Response) => {
  const { aluno_id, livro_id } = req.body;

  try {
    const livro = await knex<Livro>('livros')
      .where({ id: Number(livro_id) })
      .first();

    if (!livro) {
      return res.status(404).json({ mensagem: 'Livro não encontrado.' });
    }

    const aluno = await knex<Aluno>('alunos')
      .where({ id: Number(aluno_id) })
      .first();

    if (!aluno) {
      return res.status(404).json({ mensagem: 'Aluno não encontrado.' });
    }

    const livroEmprestado = await knex('emprestimos')
      .where({
        livro_id: Number(livro_id),
        devolvido: false,
      })
      .first();

    if (livroEmprestado) {
      return res.status(400).json({
        mensagem: 'O livro informado está emprestado para outro aluno.',
      });
    }

    const emprestimo = await knex('emprestimos')
      .insert({ aluno_id, livro_id })
      .returning('*');

    return res.status(201).json(emprestimo[0]);
  } catch {
    return res.status(500).json({ mensagem: 'Erro interno do servidor.' });
  }
};

export const devolverLivro = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const emprestimo = await knex('emprestimos')
      .where({
        id: Number(id),
      })
      .first();
    if (!emprestimo) {
      return res.status(404).json({
        mensagem: 'O eprestimo não existe.',
      });
    }

    if (emprestimo.devolvido) {
      return res.status(400).json({
        mensagem: 'O livro ja foi devolvido anteriormente.',
      });
    }
    await knex('emprestimos')
      .where({ id: Number(id) })
      .update({ devolvido: true });

    return res.status(204).send();
  } catch {
    return res.status(500).json({ mensagem: 'Erro interno do servidor.' });
  }
};

export const listarEmprestimos = async (req: Request, res: Response) => {
  try {
    const dados = await knex('emprestimos')
      .leftJoin('alunos', 'emprestimos.aluno_id', 'alunos.id')
      .leftJoin('livros', 'emprestimos.livro_id', 'livros.id')
      .select(
        'emprestimos.*',
        'alunos.nome as aluno_nome',
        'alunos.email as aluno_email',
        'livros.titulo as livro_titulo',
        'livros.autor as livro_autor',
        'livros.descricao as livro_descricao'
      );

    const emprestimos = dados.map((emprestimo) => {
      return {
        id: emprestimo.id,
        devolvido: emprestimo.devolvido,
        aluno: {
          id: emprestimo.aluno_id,
          nome: emprestimo.aluno_nome,
          email: emprestimo.aluno_email,
        },
        livro: {
          id: emprestimo.livro_id,
          titulo: emprestimo.livro_titulo,
          autor: emprestimo.livro_autor,
          descricao: emprestimo.livro_descricao,
        },
      };
    });

    return res.json(emprestimos);
  } catch {
    return res.status(500).json({ mensagem: 'Erro interno do servidor.' });
  }
};

export const obterEmprestimo = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    let emprestimo = await knex('emprestimos')
      .leftJoin('alunos', 'emprestimos.aluno_id', 'alunos.id')
      .leftJoin('livros', 'emprestimos.livro_id', 'livros.id')
      .select(
        'emprestimos.*',
        'alunos.nome as aluno_nome',
        'alunos.email as aluno_email',
        'livros.titulo as livro_titulo',
        'livros.autor as livro_autor',
        'livros.descricao as livro_descricao'
      )
      .where('emprestimos.id', Number(id))
      .first();

    if (!emprestimo) {
      return res.status(404).json({ mensagem: 'O emprestimo não encontrado' });
    }

    emprestimo = {
      id: emprestimo.id,
      devolvido: emprestimo.devolvido,
      aluno: {
        id: emprestimo.aluno_id,
        nome: emprestimo.aluno_nome,
        email: emprestimo.aluno_email,
      },
      livro: {
        id: emprestimo.livro_id,
        titulo: emprestimo.livro_titulo,
        autor: emprestimo.livro_autor,
        descricao: emprestimo.livro_descricao,
      },
    };

    return res.json(emprestimo);
  } catch {
    return res.status(500).json({ mensagem: 'Erro interno do servidor.' });
  }
};
