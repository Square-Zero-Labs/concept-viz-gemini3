import { GoogleGenAI, Type, Schema } from "@google/genai";
import { VisualizationResponse } from "../types";

// Ensure API key is available
if (!process.env.API_KEY) {
  console.error("Missing API_KEY environment variable.");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

const responseSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    html: {
      type: Type.STRING,
      description: "The complete, self-contained HTML5 code (including CSS and JS) to render the interactive visualization. It should use D3.js (via CDN) or HTML5 Canvas. The CSS should be embedded in <style> tags and JS in <script> tags. Do not use external CSS files.",
    },
    explanation: {
      type: Type.STRING,
      description: "A concise, 2-3 sentence explanation of the concept being visualized, written for a general audience.",
    },
    title: {
      type: Type.STRING,
      description: "A short, catchy title for the visualization.",
    }
  },
  required: ["html", "explanation", "title"],
};

export const generateVisualization = async (concept: string): Promise<VisualizationResponse> => {
  try {
    const model = "gemini-3-pro-preview"; 
    
    const prompt = `
      You are an expert frontend engineer and data visualization specialist inspired by the style of 3Blue1Brown.
      Create an interactive web visualization to explain the concept: "${concept}".
      
      Requirements:
      1. Technical Stack: Use vanilla HTML5, CSS3, and JavaScript. 
      2. Libraries: You MAY use D3.js (version 7 via https://d3js.org/d3.v7.min.js) or HTML5 Canvas API.
      3. Interactivity: The visualization MUST be highly interactive. Users should be able to drag elements, change parameters via sliders (styled elegantly), or click to trigger animations.
      4. Aesthetics (CRITICAL):
         - Style: Dark mode, mathematical elegance, minimalist.
         - Background: Transparent or #0f172a (Slate 900). 
         - Colors: Use specific high-contrast "neon pastel" colors against the dark background: Cyan (#22d3ee), Yellow (#facc15), Pink (#f472b6), Purple (#c084fc).
         - Typography: Sans-serif, clean, white text.
      5. Layout & Readability (CRITICAL):
         - The visualization MUST NOT have text or UI controls overlapping the main graphical elements.
         - Place internal controls (sliders, buttons) in a semi-transparent floating panel in the TOP-LEFT or TOP-RIGHT corner. 
         - **Do NOT** place controls at the bottom of the screen, as this area is reserved for the hosting application's UI.
         - Ensure labels are positioned dynamically or have sufficient offset to avoid overlapping lines or shapes.
         - The main animation/visualization should be centered and have ample padding from the edges.
      6. Code Structure: Return a SINGLE string containing the full HTML file structure (<!DOCTYPE html>...</html>).
      7. Content: Ensure the visualization intuitively explains "${concept}" through motion. Focus on the "Aha!" moment.
      
      Important: Ensure the generated HTML body has 'margin: 0', 'overflow: hidden', and 'background-color: transparent' (or #0f172a) so it blends seamlessly.
    `;

    const response = await ai.models.generateContent({
      model,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: responseSchema,
        thinkingConfig: { thinkingBudget: 2048 },
      },
    });

    if (response.text) {
      const data = JSON.parse(response.text) as VisualizationResponse;
      return data;
    } else {
      throw new Error("No response text generated");
    }
  } catch (error) {
    console.error("Error generating visualization:", error);
    throw error;
  }
};