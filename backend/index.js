const express = require('express');
const CORS = require('cors');
const bodyParser = require('body-parser');
const { generateResponse } = require('./bot'); 

const app = express();
const port = process.env.PORT || 3000;

app.use(CORS());
app.use(bodyParser.json());

app.post('/chat', async (req, res) => {
  const userMessage = req.body.message;

  if (!userMessage || !userMessage.trim()) {
    return res.status(400).json({ error: 'Mensagem não pode ser vazia!' });
  }

  try {
    const botResponse = await generateResponse(userMessage);

    if (!botResponse) {
      return res.json({ message: 'Desculpe, não consegui entender sua mensagem. Pode reformular?' });
    }

    res.json({ message: botResponse.responseContent, roleResponse: botResponse.roleResponse });
  } catch (error) {
    console.error('Erro ao processar a mensagem:', error);
    res.status(500).json({ error: `Erro ao processar a mensagem: ${error.message}` });
  }
});

app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});
