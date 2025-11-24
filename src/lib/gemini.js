export const callGemini = async (prompt, systemContext = "") => {
  // In a real production app, proxy this through a secure backend to hide the key
  const apiKey = ""; // Use environment variable in production
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`;
  
  const fullPrompt = `${systemContext}\n\nUser Query: ${prompt}`;

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: fullPrompt }] }]
      })
    });

    if (!response.ok) throw new Error('AI Service Busy');
    const data = await response.json();
    return data.candidates?.[0]?.content?.parts?.[0]?.text || "I couldn't generate a response.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Our AI service is currently experiencing high traffic. Please try again later.";
  }
};
