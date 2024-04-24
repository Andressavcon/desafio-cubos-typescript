import { Router } from 'express';
import {
  atualizarPerfil,
  cadastrarUsuario,
  obterPerfil,
} from './controladores/usuarios';
import { login } from './controladores/login';
import { verificaLogin } from './intermediarios/autenticacao';
import { listarLivros, obterLivro } from './controladores/livros';
import {
  atualizarAluno,
  cadastrarAluno,
  excluirAluno,
  listarAlunos,
  obterAluno,
} from './controladores/alunos';
import {
  devolverLivro,
  emprestarLivro,
  listarEmprestimos,
  obterEmprestimo,
} from './controladores/emprestimos';

const rotas = Router();

rotas.post('/usuarios', cadastrarUsuario);
rotas.post('/login', login);

rotas.use(verificaLogin);

rotas.get('/usuarios', obterPerfil);
rotas.put('/usuarios', atualizarPerfil);

rotas.get('/livros', listarLivros);
rotas.get('/livros/:id', obterLivro);

rotas.get('/alunos', listarAlunos);
rotas.get('/alunos/:id', obterAluno);
rotas.post('/alunos', cadastrarAluno);
rotas.put('/alunos/:id', atualizarAluno);
rotas.delete('/alunos/:id', excluirAluno);

rotas.post('/emprestimos', emprestarLivro);
rotas.patch('/emprestimos/:id', devolverLivro);
rotas.get('/emprestimos', listarEmprestimos);
rotas.get('/emprestimos/:id', obterEmprestimo);

export default rotas;
