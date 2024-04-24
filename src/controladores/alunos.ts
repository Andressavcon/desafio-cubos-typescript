import { Request, Response } from 'express';
import { knex } from '../bancodedados/conexao';
import { Aluno } from '../tipos/Aluno';

export const listarAlunos = async (req: Request, res: Response) => {
  try {
    const alunos = await knex<Aluno>('alunos');
    return res.json(alunos);
  } catch {
    return res.status(500).json({ mensagem: 'Erro interno do servidor.' });
  }
};

export const obterAluno = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const aluno = await knex<Aluno>('alunos')
      .where({ id: Number(id) })
      .first();

    if (!aluno) {
      return res.status(404).json({ mensagem: 'Aluno não encontrado.' });
    }

    return res.json(aluno);
  } catch {
    return res.status(500).json({ mensagem: 'Erro interno do servidor.' });
  }
};

export const cadastrarAluno = async (req: Request, res: Response) => {
  const { nome, email } = req.body;

  try {
    const alunoExistente = await knex<Aluno>('alunos').where({ email }).first();

    if (alunoExistente) {
      return res.status(400).json({ mensagem: 'Email ja está em uso.' });
    }

    const aluno = await knex<Aluno>('alunos')
      .insert({ nome, email })
      .returning('*');

    return res.status(201).json(aluno[0]);
  } catch {
    return res.status(500).json({ mensagem: 'Erro interno do servidor.' });
  }
};

export const atualizarAluno = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { nome, email } = req.body;

  try {
    const aluno = await knex<Aluno>('alunos')
      .where({ id: Number(id) })
      .first();
    if (!aluno) {
      return res.status(404).json({ mensagem: 'Aluno não encontrado.' });
    }
    const emailExistente = await knex<Aluno>('alunos').where({ email }).first();

    if (emailExistente && email !== aluno.email) {
      return res.status(400).json({ mensagem: 'Email ja está em uso.' });
    }

    await knex<Aluno>('alunos')
      .where({ id: Number(id) })
      .update({ nome, email });

    return res.status(204).send();
  } catch {
    return res.status(500).json({ mensagem: 'Erro interno do servidor.' });
  }
};

export const excluirAluno = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const aluno = await knex<Aluno>('alunos')
      .where({ id: Number(id) })
      .first();

    if (!aluno) {
      return res.status(404).json({ mensagem: 'Aluno não encontrado.' });
    }

    await knex('emprestimos')
      .where({ aluno_id: Number(id) })
      .del();

    await knex<Aluno>('alunos')
      .where({ id: Number(id) })
      .del();

    return res.status(204).send();
  } catch {
    return res.status(500).json({ mensagem: 'Erro interno do servidor.' });
  }
};
