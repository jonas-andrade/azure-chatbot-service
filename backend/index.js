const express = require('express');
const bodyParser = require('body-parser');
const { generateResponse } = require('./bot'); 

const app = express();
const port = 3000;

app.use(bodyParser.json());

app.post('/chat', async (req, res) => {
  const userMessage = req.body.message;

  if (!userMessage) {
    return res.status(400).json({ error: 'Mensagem não recebida!' });
  }

  try {
    const botResponse = await generateResponse(userMessage);

    res.json({ message: botResponse });
  } catch (error) {
    console.error(error); 
    res.status(500).json({ error: 'Erro ao processar a mensagem.' });
  }
});


app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});
