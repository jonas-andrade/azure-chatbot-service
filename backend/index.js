const express = require('express');
const bodyParser = require('body-parser');
const { analyzeUserMessage, generateResponse } = require('./bot'); // Importando as funções

const app = express();
const port = 3000;

app.use(bodyParser.json());

// Endpoint para processar a mensagem do usuário
app.post('/chat', async (req, res) => {
  const userMessage = req.body.message;

  if (!userMessage) {
    return res.status(400).json({ error: "Mensagem não recebida!" });
  }

  // Analisando o sentimento da mensagem do usuário
  const analysisResult = await analyzeUserMessage(userMessage);

  // Gerando a resposta com base no sentimento
  const botResponse = generateResponse(analysisResult.sentiment);

  // Respondendo ao usuário com uma resposta aleatória do grupo de respostas
  const randomResponse = botResponse[Math.floor(Math.random() * botResponse.length)];

  res.json({
    sentiment: analysisResult.sentiment,
    message: randomResponse,
  });
});

app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});
