const express = require('express');

const server = express();

server.use(express.json());

const projects = [];

/* MIDDLEWARE
Crie um middleware que será utilizado em todas rotas que recebem o ID do projeto
nos parâmetros da URL que verifica se o projeto com aquele ID existe. Se não 
existir retorne um erro, caso contrário permita a requisição continuar normalmente;
*/
function checkID(req,res,next){
  const {id} = req.params.id;
  var project;

  for (var i = 0; i < projects.length; i++){
    if (projects[i].id == id){
      project = projects[i];
    }
  }

  if (!project){
    return res.status(400).json({error: 'id não existe'})
  }
  return next();
}

/* MIDDLEWARE
Crie um middleware global chamado em todas requisições que imprime (console.log)
uma contagem de quantas requisições foram feitas na aplicação até então;
*/
function contReq(req,res,next){
  console.count();
  return next();
}

/* ROTA PARA ADICIONAR UM PROJETO
POST /projects: A rota deve receber id e title dentro do corpo e cadastrar um 
novo projeto dentro de um array no seguinte formato: 
{ id: "1", title: "Novo projeto", tasks: [] }; 
Certifique-se de enviar tanto o ID quanto o título do projeto no formato string
com aspas duplas.
*/
server.post('/projects',contReq,(req,res)=>{
  const {id, title} = req.body;
  
  const project = {
    id,
    title,
    task: []
  };

  projects.push(project);
  
  return res.json(projects);
});

/* ROTA PARA LISTAR OS PROJETOS E TAREFAS
GET /projects: Rota que lista todos projetos e suas tarefas;
*/
server.get('/projects',contReq,(req,res)=>{
  return res.json(projects);
});

/* ROTA PARA ALTERAR UM PROJETO
PUT /projects/:id: A rota deve alterar apenas o título do projeto com o id 
presente nos parâmetros da rota;
*/
server.put('/projects/:id',checkID,contReq,(req,res)=>{
  const {id} = req.params;
  const {title} = req.body;

  for (var i = 0; i < projects.length; i++){
    if (projects[i].id == id){
      projects[i].title = title;
    }
  }

  return res.json(projects);
});

/* ROTA PARA DELETAR UM PROJETO
DELETE /projects/:id: A rota deve deletar o projeto com o id presente nos 
parâmetros da rota;
*/
server.delete('/projects/:id',checkID,contReq,(req,res)=>{
  const {id} = req.params;

  for (var i = 0; i < projects.length; i++){
    if (projects[i].id == id){
      projects.splice(i,1);
    }
  }

  return res.send();
});

/* ROTA PARA ADICIONAR TAREFA EM UM PROJETO
POST /projects/:id/tasks: A rota deve receber um campo title e armazenar uma 
nova tarefa no array de tarefas de um projeto específico escolhido através do id
presente nos parâmetros da rota;
*/
server.post('/projects/:id/tasks',checkID,contReq,(req,res)=>{
  const {id} = req.params;
  const {title} = req.body;

  for (var i = 0; i < projects.length; i++){
    if (projects[i].id == id){
      projects[i].task = title;
    }
  }

  return res.json(projects);
});

server.listen(3000);
