import uploadOnCloudinary from "../config/cloudinary.js";
import geminiResponse from "../gemini.js";
import User from "../models/user.model.js";
import moment from "moment";

export const getCurrentUser = async (req, res) => {
  try {
    const userId = req.userId;
    const user = await User.findById(userId).select("-password");
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }
    return res.status(200).json(user);
  } catch (error) {
    console.error("❌ getCurrentUser error:", error);
    return res.status(500).json({ message: "User error while fetching current user" });
  }
};


export const updateAssistant = async (req, res) => {
  try {
    const { assistantName, imageUrl } = req.body;
    let assistantImage;

    if (req.file) {
      assistantImage = await uploadOnCloudinary(req.file.path);
    } else {
      assistantImage = imageUrl;
    }

    const user = await User.findByIdAndUpdate(
      req.userId,
      { assistantName, assistantImage },
      { new: true }
    ).select("-password");

    return res.status(200).json(user);
  } catch (error) {
    console.error("❌ updateAssistant error:", error);
    return res.status(400).json({ message: "Update assistant error" });
  }
};


export const asktoAssistant = async (req, res) => {
  try {
    const { command } = req.body;
    if (!command) {
      return res.status(400).json({ response: "Command is required" });
    }

    const user = await User.findById(req.userId);
    user.history.push(command)
    user.save()
    const userName = user?.name || "User";
    const assistantImage = user?.assistantImage || null;
    const assistantName = user?.assistantName || "Assistant";

    const result = await geminiResponse(command, assistantName, userName);
   

    const jsonMatch = result.match(/{[\s\S]*}/);
    if (!jsonMatch || jsonMatch.length === 0) {
      return res.status(400).json({ response: "Sorry, I cannot understand the response." });
    }

    let gemResult;
    try {
      gemResult = JSON.parse(jsonMatch[0]);
      console.log(gemResult)
    } catch (err) {
      console.error("❌ JSON parse error:", err.message);
      return res.status(400).json({ response: "Response is not a valid JSON." });
    }

    const { type, userInput, response: gemResp } = gemResult;

    switch (type) {
      case "get-date":
        return res.json({
          type,
          userInput,
          response: `Current date is ${moment().format("YYYY-MM-DD")}`,
        });
      case "get-time":
        return res.json({
          type,
          userInput,
          response: `Current time is ${moment().format("hh:mm A")}`,
        });
      case "get-day":
        return res.json({
          type,
          userInput,
          response: `Today is ${moment().format("dddd")}`,
        });
      case "get-month":
        return res.json({
          type,
          userInput,
          response: `This month is ${moment().format("MMMM")}`,
        });

      case "google-search":
      case "youtube-search":
      case "youtube-play":
      case "general":
      case "calculate-open":
      case "facebook-open":
      case "wether-show":
      case "instagram-open":
        return res.json({
          type,
          userInput,
          response: gemResp,
        });

      default:
        return res.status(400).json({ response: "I did not understand that command." });
    }

  } catch (error) {
    console.error("❌ asktoAssistant error:", error);
    return res.status(500).json({ response: "ask assistant error" });
  }
};
