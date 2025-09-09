## AI Chat App built by itskishankumar

Built using **NextJS** (React) outputting a close to pure SPA, ShadCN for the UI components and Zustand for global state.

### Functional features-
1. Ability to switch between text generation and image generation models
2. Full streaming response for the text model
3. Dynamic title generation for chats based on initial message/prompt
4. Ability to upload an image to both the text and image models
5. Full client side persistence of messages, chats and latest model type selected
6. Responsive UI/UX, built for mobile and tabs too
7. Sidebar showing list of previous chats and ability to switch to any

### Code/Implementation -
1. Client side state stored in our own format, enabling fully generic data transformation layer found in transformer.js, allowing plug and play and of any LLM model and their API
2. Minimal re-renderings through a well designed component tree, state management and state updates (React compiler was not used)
3. Usage of indexDB (via DexieJS) to store large amounts of chat and message data, including images as base64 strings
4. All generation logic contained in useChat.jsx hook, enabling reuse anywhere (for ex, using it with a voice based input and then feeding the prompt to it)
5. Usage of minimal bare bones api wherever possible (i.e useState), and usage of something more complex (ex Zustand) only when and where required

### Enhancements -
1. Custom markdown parsing, as currently we're displaying the raw text that the LLM generates
2. Sanitising the LLM output before appending it to the DOM
3. Ability to delete chats
4. Ability to modify a previous message, resetting conversation from that point
5. Ability to auto select a text/image generation model based on users prompt
6. Ability to move out of a chat after submitting a prompt, and coming back to it later (Currently, we're relying on a useEffect based on UI state to update our persistent storage. Ideally, this order should've been reversed. LLM -> Persistent storage -> UI State)
7. Make the useChat hook generic of the Gemini API. Currently, I've hardcoded the useChat hook with gemini api, defeating the purpose of generic transformers.
8. DexieJS automatically sorts the chats based on id, hence the latest chat doesn't show up on the top on the sidebar
9. Reduce CLS on initial load
10. Add a background to CTA buttons like the Sidebar trigger and Delete button on uploading an image, as they can look invisible due to low contrast

### Known bugs - 
1. Clicking on "New Chat" button after generating a new chat doesn't cause a redirect
2. Auto scrolling to bottom upon clicking on a chat doesn't work intermittently

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, obtain a Gemini API Key from https://aistudio.google.com/apikey and set it to the env variable NEXT_PUBLIC_GEMINI_API_KEY

Then, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.