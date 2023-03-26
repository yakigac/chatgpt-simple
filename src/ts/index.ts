import "../scss/styles.scss";

// APIキーを保持する変数
let apiKey: string | null = null;

// 会話を保持する配列
const conversation: Array<{ role: string; content: string }> = [];

document.addEventListener("DOMContentLoaded", () => {
  const apiKeyForm = document.getElementById("apiKeyForm") as HTMLFormElement;
  const apiKeyInput = document.getElementById(
    "apiKeyInput"
  ) as HTMLInputElement;
  const messageForm = document.getElementById("messageForm") as HTMLFormElement;
  const input = document.getElementById("messageInput") as HTMLInputElement;
  const responseContainer = document.getElementById(
    "responseContainer"
  ) as HTMLDivElement;

  // APIキーのフォームの送信イベント
  apiKeyForm.addEventListener("submit", (event) => {
    event.preventDefault();
    apiKey = apiKeyInput.value;
    if (!apiKey) {
      return; // メッセージが空の場合、何もせずに処理を終了する
    }
    apiKeyForm.style.display = "none";
    messageForm.style.display = "flex";
  });

  // メッセージのフォームの送信イベント
  messageForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const message = input.value.trim(); // メッセージ入力欄の値を取得し、前後の空白を削除
    if (!message) {
      return; // メッセージが空の場合、何もせずに処理を終了する
    }

    // ユーザーのメッセージを表示
    input.value = ""; // メッセージ入力欄を空にする
    const userMessage = document.createElement("p");
    userMessage.textContent = message;

    if (conversation.length === 0) {
      responseContainer.style.display = "flex";
    }
    responseContainer.appendChild(userMessage);

    // 会話にユーザーのメッセージを追加
    conversation.push({ role: "user", content: message });

    if (apiKey && message) {
      const response = await fetch(
        "https://api.openai.com/v1/chat/completions",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${apiKey}`,
          },
          body: JSON.stringify({
            model: "gpt-3.5-turbo",
            messages: conversation,
          }),
        }
      );

      if (response.ok) {
        const data = await response.json();
        const generatedMessage = data.choices[0].message.content.trim();

        // GPTの応答メッセージを表示
        const gptMessage = document.createElement("p");
        gptMessage.textContent = generatedMessage;
        responseContainer.appendChild(gptMessage);

        // 会話にGPTの応答メッセージを追加
        conversation.push({ role: "assistant", content: generatedMessage });
      } else {
        console.error("Error calling ChatGPT API:", response);
      }
    }
  });
});
