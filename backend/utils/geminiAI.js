const { GoogleGenerativeAI } = require('@google/generative-ai');

class GeminiAIService {
  constructor() {
    this.genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    this.model = this.genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
  }

  async summarizeProject(project, tasks) {
    try {
      const taskList = tasks.map(task => 
        `- ${task.title} (${task.column}): ${task.description}`
      ).join('\n');

      const prompt = `
        Please provide a concise summary of this project and its tasks.
        
        Project: ${project.name}
        Description: ${project.description}
        
        Tasks:
        ${taskList}
        
        Please summarize:
        1. Overall project status
        2. Key tasks and their progress
        3. Any notable patterns or insights
        
        Keep the summary brief but informative.
      `;

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      return response.text();
    } catch (error) {
      console.error('Error generating summary:', error);
      throw new Error('Failed to generate project summary');
    }
  }

  async answerQuestion(question, project, tasks) {
    try {
      const taskContext = tasks.map(task => 
        `Task: ${task.title} | Status: ${task.column} | Description: ${task.description}`
      ).join('\n');

      const prompt = `
        Context: Project Management System
        Project: ${project.name}
        Description: ${project.description}
        
        Available Tasks:
        ${taskContext}
        
        Question: ${question}
        
        Please provide a helpful answer based on the project and tasks information above.
        If the question cannot be answered with the available information, please say so.
        Be concise and practical in your response.
      `;

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      return response.text();
    } catch (error) {
      console.error('Error answering question:', error);
      throw new Error('Failed to answer question');
    }
  }
}

module.exports = new GeminiAIService();