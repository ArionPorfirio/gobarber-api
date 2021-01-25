# Recuperação de Senha

**Requisitos Funcionais**

- O usuário deverá poder recuperar sua senha informando o e-mail;
- O usuário deverá receber um e-mail com instruções para a recuperação da senha;
- O usuário deverá poder redefinir sua senha;

**Requisitos Não-Funcionais**

- Utilizar o mailtrap para o envio de e-mails em desenvolvimento;
- Utilizar o Amazon SES para o envio de e-mails em produção;
- O envio de e-mails deverá acontecer em segundo plano (Background job);

**Regras de Negócio**

- O link de recuperação deve expirar em 2 hora;
- O usuário deverá preencher uma confirmação da nova senha;

# Atualização de Perfil

**Requisitos Funcionais**

- O usuário deverá poder atualizar seu nome, e-mail, e senha;

**Requisitos Não-Funcionais**

- Nenhum em específico;

**Regras de Negócio**

- O não deverá poder alterar seu e-mail para um já utilizado;
- O usuário deverá informar a senha antiga para definir a nova senha;
- O usuário deverá confirmar a nova senha;

# Painel do Prestador

**Requisitos Funcionais**

- O prestador deverá poder listar os agendamentos de um dia selecionado;
- O prestador deverá ser notificado quando novos agendamentos forem feitos;
- O prestador deverá poder visualizar as notificações que não foram lidas;

**Requisitos Não-Funcionais**

- Os agendamentos do dia de um prestador deverão ser armazenados em cache;
- As notificações de um prestador deverão ser armazenadas no MongoDB;
- As notificações de um prestador deverão ser enviadas em tempo-real utilizando o Socket.io;

**Regras de Negócio**

- A notificação deve conter o status de "lida" ou "não-lida";

# Agendamento de Serviços

**Requisitos Funcionais**

- O usuário deverá poder listar todos os prestadores de serviço;
- O usuário deverá poder listar os dias do mês com algum horário disponível de um prestador selecionado;
- O usuário deverá poder listar os horários disponíveis no dia de um prestador selecionado;
- O usuário deverá poder realizar um agendamento com o prestador selecionado;

**Requisitos Não-Funcionais**

- A listagem de prestadores deverá ser armazenada em cache;

**Regras de Negócio**

- Cada agendamento deverá durar 1h;
- Os agendamentos deverão ser feitos entre as 8hrs e 17hrs;
- Os usuários não poderão criar agendamentos em horários que já passaram;
- O usuário não deverá agendar horários consigo mesmo;
