const express = require('express');
const CORS = require('cors');
const bodyParser = require('body-parser');
const { generateResponse } = require('./bot'); 

const app = express();
const port = 3000;


// app.use(CORS({ origin: 'http://localhost:3000' })); //  Configuração do CORS para permitir requisições apenas de um frontend específico
app.use(CORS());
app.use(bodyParser.json());

app.post('/chat', async (req, res) => {
  const userMessage = req.body.message;

  // Verificar se a mensagem é vazia ou apenas espaços em branco
  if (!userMessage || !userMessage.trim()) {
    return res.status(400).json({ error: 'Mensagem não pode ser vazia!' });
  }

  try {
    const botResponse = await generateResponse(userMessage);

    if (!botResponse) {
      return res.json({ message: 'Desculpe, não consegui entender sua mensagem. Pode reformular?' });
    }

    res.json({ message: botResponse });
  } catch (error) {
    console.error('Erro ao processar a mensagem:', error);
    res.status(500).json({ error: `Erro ao processar a mensagem: ${error.message}` });
  }
});

app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});
