const copingTips = [
    "Take a 5-minute walk to clear your mind.",
    "Try journaling how you feel right now.",
    "Listen to your favorite calming song.",
    "Drink some water and stretch a little.",
    "Text a friend and just say hi—it can help.",
  ];
  
  const getRandomTip = () => {
    return copingTips[Math.floor(Math.random() * copingTips.length)];
  };
  
  // Function to generate responses based on sentiment
  const generateResponse = (userInput, sentiment) => {
    if (sentiment === "negative") {
      if (userInput.toLowerCase().includes("exam")) {
        return "I'm really sorry to hear that. Failing an exam can feel overwhelming, but it doesn't define your worth. You're stronger than you think.";
      }
      return `I'm sensing you're going through something tough. Here's something that might help: ${getRandomTip()}`;
    }
  
    if (sentiment === "positive") {
      return "I'm glad to hear that! Keep up the good energy 🌟";
    }
  
    // Neutral sentiment
    const neutralResponses = [
      "I'm here if you want to talk more.",
      "Would you like to share more about what's on your mind?",
      "I'm listening—go ahead if you feel like talking.",
    ];
    return neutralResponses[Math.floor(Math.random() * neutralResponses.length)];
  };
  