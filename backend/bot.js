const { TextAnalyticsClient, AzureKeyCredential } = require("@azure/ai-text-analytics");
require('dotenv').config();

const endpoint = process.env.ENDPOINT;
const apiKey = process.env.APIKEY;
const client = new TextAnalyticsClient(endpoint, new AzureKeyCredential(apiKey));

async function analyzeUserMessage(userMessage) {
  try {
    // Analisando o sentimento da mensagem
    const [result] = await client.analyzeSentiment([userMessage]);

    return result;
  } catch (error) {
    console.error("Erro ao analisar a mensagem:", error);
    return { sentiment: "erro", text: "Desculpe, houve um problema ao processar sua mensagem." };
  }
}

function generateResponse(sentiment) {
  switch (sentiment) {
    case 'positive':
      return [
        "Que ótimo que você está se sentindo bem! Como posso ajudar ainda mais?",
        "Fico feliz em saber que está positivo! Posso ajudar com algo?",
        "Isso é maravilhoso! Se precisar de algo, estarei por aqui.",
        "Que bom! Qualquer coisa, estou aqui para ajudar."
      ];

    case 'negative':
      return [
        "Sinto muito por você estar se sentindo assim. O que posso fazer para melhorar seu dia?",
        "Entendo, estou aqui para ajudar. O que posso fazer por você?",
        "Lamento que esteja passando por isso. Estou à disposição se precisar conversar.",
        "Espero que as coisas melhorem logo! Me avise se eu puder ajudar de alguma forma."
      ];

    case 'neutral':
      return [
        "Obrigado por compartilhar. Como posso ser útil para você?",
        "Entendido. O que posso fazer por você hoje?",
        "Ok! Como posso ajudar a tornar seu dia melhor?",
        "Estou aqui para ajudar! O que posso fazer por você?"
      ];

    case 'erro':
      return [
        "Desculpe, houve um problema ao processar sua mensagem. Tente novamente mais tarde.",
        "Algo deu errado. Por favor, tente de novo mais tarde.",
        "Houve um erro ao processar sua mensagem. Desculpe pela inconveniência.",
        "Desculpe! Estou tendo dificuldades em entender sua mensagem agora. Tente novamente."
      ];

    default:
      return ["Eu não consegui entender o sentimento. Pode me enviar algo mais claro?"];
  }
}

// Exportando a função que analisa o sentimento da mensagem do usuário
module.exports = { analyzeUserMessage, generateResponse };
