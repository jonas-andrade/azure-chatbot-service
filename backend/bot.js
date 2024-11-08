const { AzureOpenAI } = require('openai');
require('dotenv/config');


const endpoint = process.env["AZURE_OPENAI_ENDPOINT"];
const apiKey = process.env["AZURE_OPENAI_API_KEY"];
const apiVersion = "2024-04-01-preview";
const deployment = "gpt-35-turbo";



async function generateResponse(prompt) {
  try {
    const client = new AzureOpenAI({ endpoint, apiKey, apiVersion, deployment });

    const result = await client.completions.create({
      prompt: [prompt],
      model: deployment,
      max_tokens: 100,
      temperature: 0.7,  // Definir a aleatoriedade das respostas
      frequency_penalty: 0, 
      presence_penalty: 0,
      top_p: 1.0,
      stop: null
    });

    return result.choices[0].text.trim();
  } catch (error) {
    console.error("Erro ao gerar resposta:", error);
    throw new Error("Erro ao processar a resposta do bot.");
  }
}

module.exports = {
  generateResponse
};
