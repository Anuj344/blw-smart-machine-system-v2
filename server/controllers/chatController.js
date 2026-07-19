const { GoogleGenAI } = require("@google/genai");
const Machine = require("../models/machine");

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

exports.chatWithAI = async (req, res) => {
  try {
    const { machineCode, message } = req.body;

    // Validation
   if (!machineCode) {
  return res.status(400).json({
    success: false,
    message: "Machine Code is required",
  });
}

    if (!message) {
      return res.status(400).json({
        success: false,
        message: "Message is required",
      });
    }

    // Find machine
    const machine = await Machine.findOne({
  machine_code: machineCode
});

if (!machineCode) {
  return res.status(400).json({
    success: false,
    message: "Machine Code is required",
  });
}
    // AI Prompt
    const prompt = `
You are an AI Assistant for the BLW Smart Machine System.

Your job is to answer ONLY from the machine information given below.

If the answer is not present in the machine data, reply exactly:

"Sorry, this information is not available in the BLW Machine Database."

==========================
Machine Information
==========================

Machine Name:
${machine.machine_name}

Machine Code:
${machine.machine_code}

Department:
${machine.department}

Manufacturer:
${machine.manufacturer}

Year:
${machine.year}

Operator:
${machine.operator}

Location:
${machine.location}

Status:
${machine.status}

Introduction:
${machine.introduction}

Working Principle:
${machine.working_principle}

Applications:
${machine.applications.join(", ")}

Safety Precautions:
${machine.safety.join(", ")}

Maintenance:
${machine.maintenance.join(", ")}

Main Parts:
${machine.parts.join(", ")}

==========================

User Question:
${message}
`;

    // Gemini Response
    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
    });

    res.status(200).json({
      success: true,
      machine: machine.machine_name,
      reply: response.text,
    });

  } catch (error) {
    console.error("AI Chat Error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};