const express = require('express');
const bodyParser = require('body-parser');
const { generateResponse } = require('./bot'); // Função que gera respostas com OpenAI

const app = express();
const port = 3000;

app.use(bodyParser.json());

// Endpoint para receber as mensagens dos usuários
app.post('/chat', async (req, res) => {
  const userMessage = req.body.message;

  if (!userMessage) {
    return res.status(400).json({ error: "Mensagem não recebida!" });
  }

  try {
    const botResponse = await generateResponse(userMessage);
    res.json({ message: botResponse });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao processar a mensagem." });
  }
});

// Iniciando o servidor na porta 3000
app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});
