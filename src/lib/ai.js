// src/analysis-service.js (or integrated directly into your component)

import { ai, model } from './gemini-client'; // Import the client you set up

/**
 * Analyzes student performance data for a given subject using the Gemini API.
 * @param {string} subjectId - The ID of the subject to analyze (e.g., "MATH-101").
 * @returns {Promise<string>} A promise that resolves to the analysis as a string.
 */
export async function studentsAnalyzer(subjectId) {
    // --- 1. Simulate Fetching Student Data ---
    // In a real application, you would call a backend API or database here
    // to get the actual student data for the subject.
    const studentData = [
        { name: "Alice", score: 92, attendance: 95 },
        { name: "Bob", score: 55, attendance: 70 },
        { name: "Charlie", score: 88, attendance: 100 },
        { name: "David", score: 71, attendance: 85 },
        // ... more data
    ];
    
    const dataString = JSON.stringify(studentData);

    // --- 2. Construct the Prompt for Gemini ---
    const prompt = `
        Analyze the following student performance data for the subject ID **${subjectId}**. 
        
        The data is an array of objects: ${dataString}.
        
        Provide a concise analysis focusing on:
        1. **Overall Performance:** Average score and distribution (e.g., how many failed, passed, excelled).
        2. **Key Findings:** Note any significant trends, like a correlation between low scores and low attendance (for Bob).
        3. **Recommendations:** Suggest 1-2 actionable recommendations for the teacher.
        
        Format the output using clear headings and bullet points.
    `;

    // --- 3. Call the Gemini API ---
    try {
        const response = await ai.models.generateContent({
            model: model,
            contents: [{ role: "user", parts: [{ text: prompt }] }],
        });

        // The response text will contain the analysis
        return response.text; 
    } catch (error) {
        console.error("Error analyzing student data with Gemini:", error);
        return "Analysis failed. Please check the API key and console for errors.";
    }
}