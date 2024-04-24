create table if not exists usuarios (
    id serial primary key,
    nome text not null,
    email text not null,
    senha text not null
);

create table if not exists alunos (
    id serial primary key,
    nome text not null,
    email text not null
);

create table if not exists emprestimos (
    id serial primary key,
    aluno_id integer not null,
    livro_id integer not null,
    devolvido boolean default false,
    foreign key (aluno_id) references alunos (id),
    foreign key (livro_id) references livros (id)
);