
import { GoogleGenAI, Type } from "@google/genai";
import { ProjectConfig, GeneratedFile } from "../types";

export const generateGoProject = async (config: ProjectConfig): Promise<GeneratedFile[]> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const prompt = `Generate a complete idiomatic Go project structure for the following configuration:
  - Project Name: ${config.projectName}
  - Go Module Name: ${config.moduleName}
  - Architecture: ${config.architecture}
  - Selected Features: ${config.features.join(", ")}
  
  Please provide a list of files with their relative paths and full source code content. 
  Follow the standard Go project layout (e.g., cmd/, internal/, pkg/) if the architecture is "Standard" or "Clean".
  Ensure code is idiomatic and uses recent Go features (1.21+).
  Include a go.mod file and a useful README.md.`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              path: {
                type: Type.STRING,
                description: "The relative file path including directory structure.",
              },
              content: {
                type: Type.STRING,
                description: "The full content of the file.",
              },
            },
            required: ["path", "content"],
          },
        },
      },
    });

    const jsonStr = response.text.trim();
    return JSON.parse(jsonStr) as GeneratedFile[];
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    throw new Error("Failed to generate project. Please try again.");
  }
};
