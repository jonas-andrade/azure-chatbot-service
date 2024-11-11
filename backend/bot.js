const { AzureOpenAI } = require("openai");
require("dotenv/config");

const endpoint = process.env["AZURE_OPENAI_ENDPOINT"];
const apiKey = process.env["AZURE_OPENAI_API_KEY"];
const apiVersion = process.env["APIVERSION"];
const deployment = process.env["DEPLOYMENT"];

const mrRobotPersonality = process.env["PROMPT_MR_ROBOT"];
const elliotAldersonPersonality = process.env["PROMPT_ELLIOT"];

let responseCount = 0;
let currentPersonality = elliotAldersonPersonality;
let randomMode = false;
let randomCounter = 0;

async function generateResponse(userPrompt) {
  try {
    const client = new AzureOpenAI({ endpoint, apiKey, apiVersion, deployment });

    if (!randomMode) {
      if (responseCount >= 2) {
        currentPersonality = currentPersonality === elliotAldersonPersonality ? mrRobotPersonality : elliotAldersonPersonality;
        responseCount = 0; 
      }
      responseCount++;
    } else {
      currentPersonality = Math.random() < 0.5 ? elliotAldersonPersonality : mrRobotPersonality;
      randomCounter++;
      if (randomCounter >= 1) {
        randomMode = false;
        randomCounter = 0;
        responseCount = 0;
      }
    }

    const result = await client.chat.completions.create({
      messages: [
        {
          role: "system",
          content: currentPersonality,
        },
        { role: "user", content: userPrompt },
      ],
      max_tokens: 70,
      temperature: 0.7,
      top_p: 0.9,
      frequency_penalty: 0.7,
      presence_penalty: 0.7,
      stop: ["\n"],
    });

    if (result.choices && result.choices.length > 0 && result.choices[0].message && result.choices[0].message.content) {
      let responseContent = result.choices[0].message.content.trim();
      let roleResponse = currentPersonality === mrRobotPersonality ? "Mr. Robot" : "Elliot Alderson";

      if (responseCount === 0 && !randomMode) {
        randomMode = true;
      }

      return { responseContent, roleResponse };
    } else {
      console.error("Resposta inesperada:", result);
      throw new Error("Nenhuma resposta válida foi recebida.");
    }
  } catch (error) {
    console.error("Erro ao gerar resposta:", error);
    throw new Error("Erro ao processar a resposta.");
  }
}

module.exports = { generateResponse };
