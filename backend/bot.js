const { OpenAI } = require("openai");
require('dotenv').config();

// Inicializando o cliente OpenAI com a chave da API
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // A chave da API é carregada do arquivo .env
});

// Função para gerar a resposta com base na mensagem do usuário
async function generateResponse(userMessage) {
  try {
    // Enviando a mensagem para o GPT-3.5
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo", // Usando o modelo GPT-3.5
      messages: [
        { role: "system", content: "Você é um assistente amigável e inteligente." }, // Contexto básico do chatbot
        { role: "user", content: userMessage }, // A mensagem que o usuário envia
      ],
    });

    // Retornando a resposta gerada pelo modelo
    return response.choices[0].message.content;
  } catch (error) {
    console.error("Erro ao gerar resposta:", error);
    return "Desculpe, houve um problema ao processar sua mensagem.";
  }
}

module.exports = { generateResponse };
