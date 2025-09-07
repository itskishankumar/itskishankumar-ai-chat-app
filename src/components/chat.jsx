import { Input } from "@/components/ui/input";
import { useChat } from "@/hooks/use-chat";

export default function Chat() {
  const { messages, sendMessage } = useChat("123", "gemini-2.5-flash");

  async function handleEnter(input) {
    await sendMessage(input);
  }

  console.log(messages);

  return (
    <div className="w-full lg:w-1/2">
      <div className="w-full bg-blue-300">
        {messages.map((message, index1) => (
          <div key={index1}>
            {message.data.map((data, index2) => (
              <div key={index2}>{data.data}</div>
            ))}
          </div>
        ))}
      </div>
      <Input placeholder="Ask me anything" onEnter={handleEnter} />
    </div>
  );
}
