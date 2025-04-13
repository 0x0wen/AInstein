// src/components/ChatInterface.tsx (Example file path)

import { useState, useRef, useEffect, useCallback } from 'react';
import {
  SendHorizontal,
  Plus,
  Video,
  BookOpen,
  BrainCircuit,
  BarChart3,
  Loader2, // For loading indicators
  X, // For close button
  Paperclip, // For attach file button
} from 'lucide-react';
import { Button } from '@/components/ui/button'; // Adjust path as needed
import { Input } from '@/components/ui/input'; // Adjust path as needed
import { VideoPlayer } from './VideoPlayer'; // Adjust path as needed
import { QuizComponent } from './QuizComponent'; // Adjust path as needed
import { FlashcardComponent } from './FlashCardComponent'; // Adjust path as needed
import type { StudyKit } from '@/dummy'; // Adjust path and ensure StudyKit type includes 'id'
import { fetchEventSource } from '@microsoft/fetch-event-source';
import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm'

// Define the structure for different message types in the chat
type MessageType =
  | { type: 'text'; content: string; sender: 'user' | 'assistant'; id?: string } // Added optional id
  | {
      type: 'video';
      content: { id: string; title: string; duration: string };
      sender: 'assistant' | 'user';
      id?: string;
    }
  | {
      type: 'quiz';
      content: { id: string; title: string; questions: number };
      sender: 'assistant';
      id?: string;
    }
  | {
      type: 'flashcards';
      content: { id: string; title: string; cards: number };
      sender: 'assistant';
      id?: string;
    }
  | {
      type: 'progress';
      content: {
        overall: number;
        topics: { name: string; progress: number }[];
      };
      sender: 'assistant';
      id?: string;
    }
  | {
      type: 'error';
      content: string;
      sender: 'assistant' | 'user';
      id?: string;
    }; // Error message type

// Props for the ChatInterface component
interface ChatInterfaceProps {
  studyKit: StudyKit & { _id: string }; // Ensure studyKit object includes its ID
  conversationId: string; // Keep if needed for other backend interactions
}

// --- The Chat Interface Component ---
export function ChatInterface({
  studyKit,
  conversationId,
}: ChatInterfaceProps) {
  // --- State Variables ---
  const [messages, setMessages] = useState<MessageType[]>([{ type: 'text', content: '# Advanced Markdown Example\n\n' +
    'This example includes:\n\n' +
    '- **Bold text** and *italic text*\n' +
    '- [Links](https://example.com)\n' +
    '- Tables (via remark-gfm)\n\n' +
    '| Header 1 | Header 2 |\n' +
    '| -------- | -------- |\n' +
    '| Cell 1   | Cell 2   |\n' +
    '| Cell 3   | Cell 4   |\n\n' +
    '```javascript\n' +
    '// Code with syntax highlighting\n' +
    'function hello() {\n' +
    '  console.log("Hello, world!");\n' +
    '}\n' +
    '```\n\n' +
    '> This is a blockquote\n\n' +
    '~~Strikethrough text~~', sender: 'assistant' },{ type: 'text', content: '# Hello', sender: 'assistant' },{ type: 'text', content: '# Hello', sender: 'assistant' }]); // Stores all chat messages
  const [inputValue, setInputValue] = useState(''); // Current value of the text input
  const [activeContent, setActiveContent] = useState<{
    // State for the right-side panel (video, quiz, etc.)
    type: string;
    id: string;
    title?: string; // Optionally store title for the panel header
  } | null>(null);
  const [isLoadingHistory, setIsLoadingHistory] = useState(true); // Loading state for initial history fetch
  const [isAssistantResponding, setIsAssistantResponding] = useState(false); // True while waiting for SSE response
  const [isUploading, setIsUploading] = useState(false); // True during file upload

  // --- Refs ---
  const messagesEndRef = useRef<HTMLDivElement>(null); // Ref to scroll to the bottom of messages
  const fileInputRef = useRef<HTMLInputElement>(null); // Ref for the hidden file input element
  const abortControllerRef = useRef<AbortController | null>(null); // Ref to manage SSE connection cancellation

  const { data: historyData, isLoading: isConversationLoading } = useQuery<
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    any[],
    Error
  >({
    queryKey: [],
    queryFn: async () => {
      return await api.get(`/history/${conversationId}`).then((res) => {
        console.log(res.data);
        return res.data;
      });
    },
  });

  // --- 1. Fetch Chat History ---
  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  const fetchHistory = useCallback(async () => {
    console.log('Fetching history for StudyKit ID:', conversationId);
    setIsLoadingHistory(true);
    // setMessages([]); // Clear messages before fetching new history

    try {
      console.log('History data received:', historyData);

      // --- Map API History Response to Frontend MessageType ---
      // !!! IMPORTANT !!!: You MUST adjust this mapping based on the actual structure
      //                    returned by your '/history' endpoint (ChatResponseSchema).
      // biome-ignore lint/style/noNonNullAssertion: <explanation>
      if (historyData !== undefined) {
        const formattedMessages: MessageType[] = historyData
          .map((msg): MessageType => {
            const messageId =
              msg._id || msg.id || `hist-${Date.now()}-${Math.random()}`; // Get or generate an ID

            // --- Example Mapping Logic (ADJUST AS NEEDED) ---
            if (msg.role === 'user' || msg.sender === 'user') {
              // Assuming user message content is in msg.content[0].text
              const textContent =
                Array.isArray(msg.content) && msg.content[0]?.type === 'text'
                  ? msg.content[0].text
                  : typeof msg.content === 'string'
                    ? msg.content
                    : ''; // Adjust based on actual structure

              return {
                id: messageId,
                type: 'text',
                content: textContent || '(empty message)',
                sender: 'user',
              };
            }
            // Assuming assistant message content is in msg.content[0].text
            const textContent =
              Array.isArray(msg.content) && msg.content[0]?.type === 'text'
                ? msg.content[0].text
                : typeof msg.content === 'string'
                  ? msg.content
                  : ''; // Adjust based on actual structure

            // TODO: Add logic here if your history *can* contain structured messages (video/quiz).
            // This requires the backend to store type information in history.
            // For now, defaulting all assistant history messages to 'text'.
            // if (msg.messageType === 'video' && msg.structuredContent) {
            //   return { type: 'video', content: msg.structuredContent, sender: 'assistant', id: messageId };
            // }
            return {
              id: messageId,
              type: 'text',
              content: textContent || '(empty message)',
              sender: 'assistant',
            };
          })
          .filter(Boolean); // Filter out any potential null/undefined from complex mapping

        setMessages(formattedMessages);
      }
    } catch (error) {
      console.error('Error fetching chat history:', error);
      setMessages([
        {
          id: `err-${Date.now()}`,
          type: 'error',
          content: `Failed to load chat history. ${error instanceof Error ? error.message : 'Please try reloading.'}`,
          sender: 'assistant',
        },
      ]);
    } finally {
      setIsLoadingHistory(false);
    }
  }, [conversationId]); // Dependencies for useCallback

  // Effect to fetch history when component mounts or dependencies change
  useEffect(() => {
    if (conversationId) {
      fetchHistory();
    }
  }, [fetchHistory, conversationId]); // Ensure studyKit.id is stable or included

  // Effect to automatically scroll down when new messages are added
  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Effect to cleanup any ongoing SSE connection when the component unmounts
  useEffect(() => {
    return () => {
      abortControllerRef.current?.abort();
    };
  }, []);

  // --- 2. Handle File Upload ---
  const handleFileSelect = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append('file', file); // Key ('file') must match backend expectation

    const url = `http://localhost:3000/api/upload/${conversationId}`;
    console.log(`Uploading file to: ${url}`);

    try {
      const response = await fetch(url, {
        method: 'POST',
        body: formData,
        credentials: 'include', // Include cookies for session management
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          `Upload failed: ${response.status} ${result.message || 'Server error'}`,
        );
      }

      console.log('Upload successful:', result);
      // Add a confirmation message to the chat
      setMessages((prev) => [
        ...prev,
        {
          id: `upload-${result.resourceId || Date.now()}`,
          type: 'text',
          sender: 'assistant', // Or a 'system' type if you prefer
          content: `Successfully uploaded "${result.filename || file.name}". It can now be used for context.`,
        },
      ]);
    } catch (error) {
      console.error('File upload error:', error);
      setMessages((prev) => [
        ...prev,
        {
          id: `err-upload-${Date.now()}`,
          type: 'error',
          sender: 'assistant',
          content: `File upload failed. ${error instanceof Error ? error.message : 'Please try again.'}`,
        },
      ]);
    } finally {
      setIsUploading(false);
      // Reset file input to allow selecting the same file again
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  // Function to programmatically click the hidden file input
  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  // --- 3. Send Message and Handle SSE Stream ---
  const handleSendMessage = async () => {
    const messageContent = inputValue.trim();
    // Prevent sending empty messages or while busy
    if (!messageContent || isAssistantResponding || isUploading) return;

    // Abort any existing SSE connection before starting a new one
    abortControllerRef.current?.abort();
    const newAbortController = new AbortController();
    abortControllerRef.current = newAbortController;

    // Add user message to state immediately for responsiveness
    const userMessage: MessageType = {
      id: `user-${Date.now()}`,
      type: 'text',
      content: messageContent,
      sender: 'user',
    };
    setMessages((prev) => [...prev, userMessage]);
    setInputValue(''); // Clear input field
    setIsAssistantResponding(true); // Set loading state

    // Prepare request payload for the backend
    // Adjust payload according to your ChatRequestSchema
    const payload = {
      content: messageContent,
      // conversationId: conversationId, // Include if needed by backend
    };

    // Add a placeholder message for the assistant's response
    // This placeholder will be updated by SSE events
    const assistantMessageId = `assist-${Date.now()}`;
    setMessages((prev) => [
      ...prev,
      {
        type: 'text', // Start as text
        content: '', // Initially empty
        sender: 'assistant',
        id: assistantMessageId, // Assign an ID to find and update it
      },
    ]);

    const url = `http://localhost:3000/api/chat/${conversationId}`; // Adjust URL as needed
    console.log(`Sending message to: ${url}`);

    try {
      await fetchEventSource(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'text/event-stream',
        },
        body: JSON.stringify(payload),
        signal: newAbortController.signal, // Pass the abort signal
        credentials: 'include', // Include cookies for session management

        // Called when the connection is opened
        // biome-ignore lint/suspicious/noExplicitAny: <explanation>
        onopen: async (response: any) => {
          console.log('SSE connection opened.');
          if (
            !response.ok ||
            !response.headers.get('content-type')?.includes('text/event-stream')
          ) {
            const errorText = await response
              .text()
              .catch(() => 'Failed to get error details');
            console.error(
              'SSE connection failed on open:',
              response.status,
              errorText,
            );

            // Update the placeholder message with an error
            setMessages((prev) =>
              prev.map((msg) =>
                msg.id === assistantMessageId
                  ? {
                      ...msg,
                      type: 'error',
                      content: `Failed to start stream: ${response.status} ${errorText || response.statusText}`,
                    }
                  : msg,
              ),
            );
            setIsAssistantResponding(false); // Clear loading state
            throw new Error(`SSE connection failed: ${response.status}`); // Stop fetchEventSource
          }
        },

        // Called for each message received from the stream
        // biome-ignore lint/suspicious/noExplicitAny: <explanation>
        onmessage: (event: any) => {
          console.debug('SSE Event:', event.event, 'Data:', event.data);
          if (event.event === 'message_complete') {
            return;
          }
          try {
            // --- Process Incoming SSE Events ---
            const data = JSON.parse(event.data);

            setMessages((prevMessages) => {
              // Find the index of the message we need to update
              const targetIndex = prevMessages.findIndex(
                (msg) => msg.id === assistantMessageId,
              );
              if (targetIndex === -1) {
                console.error(
                  'Assistant message placeholder not found for ID:',
                  assistantMessageId,
                );
                return prevMessages; // Should not happen
              }
              const targetMsg = prevMessages[targetIndex];

              // --- Handle 'message_delta' (Partial Text Update) ---
              if (
                event.event === 'message_delta' &&
                typeof data.text === 'string'
              ) {
                const updatedContent =
                  (targetMsg.type === 'text' ? targetMsg.content : '') +
                  data.text;
                const updatedMsg = {
                  ...targetMsg,
                  type: 'text' as const,
                  content: updatedContent,
                };
                return [
                  ...prevMessages.slice(0, targetIndex),
                  updatedMsg,
                  ...prevMessages.slice(targetIndex + 1),
                ];
              }
              // --- Handle 'message_complete' (Final Message) ---
              // !!! IMPORTANT !!!: Assume 'data.message' contains the final, structured message
              //                    object matching one of the `MessageType` variants. Adjust if needed.
              if (event.event === 'message_complete' && data.message) {
                console.log('Received message_complete:', data.message);
                // Ensure the completed message has the correct ID and sender
                const finalMessage: MessageType = {
                  ...data.message,
                  id: assistantMessageId,
                  sender: 'assistant' as const,
                };
                // Activate content panel if it's a video/quiz/etc.
                if (
                  ['video', 'quiz', 'flashcards'].includes(finalMessage.type)
                ) {
                  setActiveContent({
                    type: finalMessage.type,
                    id: finalMessage.content.id,
                    title: finalMessage.content.title, // Store title for panel header
                  });
                }
                return [
                  ...prevMessages.slice(0, targetIndex),
                  finalMessage, // Replace placeholder with the complete message
                  ...prevMessages.slice(targetIndex + 1),
                ];
              }
              // --- Handle 'tool_call' (Optional) ---
              // Example: Briefly update text to indicate thinking
              if (event.event === 'tool_call') {
                console.log('Received tool_call:', data);
                const updatedContent = `${targetMsg.type === 'text' ? targetMsg.content : ''}\n*(Processing...)*`;
                const updatedMsg = {
                  ...targetMsg,
                  type: 'text' as const,
                  content: updatedContent,
                };
                return [
                  ...prevMessages.slice(0, targetIndex),
                  updatedMsg,
                  ...prevMessages.slice(targetIndex + 1),
                ];
              }
              // --- Handle 'error' event from backend ---
              if (event.event === 'error' && data.message) {
                console.error(
                  'Received error event from backend:',
                  data.message,
                );
                const updatedMsg = {
                  ...targetMsg,
                  type: 'error' as const,
                  content: `Assistant error: ${data.message}`,
                };
                return [
                  ...prevMessages.slice(0, targetIndex),
                  updatedMsg,
                  ...prevMessages.slice(targetIndex + 1),
                ];
              }

              // If event is not handled, return previous state
              return prevMessages;
            });
          } catch (e) {
            console.error(
              'Error parsing SSE data or updating state:',
              e,
              'Raw data:',
              event.data,
            );
            // Optionally update the placeholder with a parsing error message
            setMessages((prev) =>
              prev.map((msg) =>
                msg.id === assistantMessageId && msg.type !== 'error' // Avoid overwriting existing errors
                  ? {
                      ...msg,
                      type: 'error',
                      content: `Error processing message: ${e instanceof Error ? e.message : 'Unknown format'}`,
                    }
                  : msg,
              ),
            );
          }
        },

        // Called when the stream encounters an error
        // biome-ignore lint/suspicious/noExplicitAny: <explanation>
        onerror: (err: any) => {
          console.error('SSE Error:', err);
          setMessages((prev) =>
            prev.map((msg) =>
              msg.id === assistantMessageId && msg.type !== 'error'
                ? {
                    ...msg,
                    type: 'error',
                    content: `Connection error: ${err.message || 'Failed to receive response'}`,
                  }
                : msg,
            ),
          );
          setIsAssistantResponding(false); // Clear loading state
          abortControllerRef.current = null;
          // IMPORTANT: Throw error to stop fetchEventSource from retrying if it's fatal
          if (err instanceof Error && err.name === 'AbortError') {
            // Don't throw if it was intentionally aborted
            return;
          }
          throw err; // Propagate other errors
        },

        // Called when the stream is closed by the server
        onclose: () => {
          console.log('SSE Connection closed by server.');
          setIsAssistantResponding(false); // Clear loading state
          abortControllerRef.current = null;
          // Optional: You might want to check if the last message was fully completed
          // or if it ended abruptly (e.g., check if the last received message was 'message_complete')
        },
      });
    } catch (error) {
      // This catch block handles errors thrown from onerror or initial setup errors
      console.error('Failed to send message or process SSE stream:', error);
      if (error instanceof Error && error.name !== 'AbortError') {
        // Ensure loading state is cleared if an error prevented the stream from closing normally
        setIsAssistantResponding(false);
        // Make sure an error message is shown if one wasn't already set by onerror/onopen
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === assistantMessageId && msg.type !== 'error'
              ? {
                  ...msg,
                  type: 'error',
                  content: `Failed to connect: ${error.message}`,
                }
              : msg,
          ),
        );
      }
    }
  };

  // --- 4. Render Individual Messages ---
  const renderMessage = (message: MessageType, index: number) => {
    const isLastMessage = index === messages.length - 1;

    switch (message.type) {
      case 'text':
        return (
          <div
            key={message.id || index}
            className={`p-3 md:p-4 rounded-lg max-w-[85%] md:max-w-[80%] ${
              message.sender === 'user'
                ? 'bg-primary text-primary-foreground ml-auto' // User message: Blue, right-aligned
                : 'bg-muted text-foreground mr-auto' // Assistant message: Grey, left-aligned
            } whitespace-pre-wrap break-words`} // Ensure text wraps
          >
            <div className="markdown-body">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {message.content}
            </ReactMarkdown>
            </div>
            {/* Show subtle loading dots if this is the last message, it's from assistant, and still responding */}
            {message.sender === 'assistant' &&
              isAssistantResponding &&
              isLastMessage &&
              message.content === '' && (
                <span className="inline-block ml-1 animate-pulse">...</span>
              )}
          </div>
        );

      // Render structured messages (Video, Quiz, Flashcards, Progress)
      // These usually appear as cards from the assistant
      case 'video':
      case 'quiz':
      case 'flashcards':
      case 'progress':
        return (
          <div
            key={message.id || index}
            className="bg-muted p-3 md:p-4 rounded-lg mr-auto max-w-[85%] md:max-w-[80%]"
          >
            <div className="flex items-start gap-3">
              {/* Icon based on type */}
              {message.type === 'video' && (
                <Video
                  className="mt-1 flex-shrink-0 text-muted-foreground"
                  size={20}
                />
              )}
              {message.type === 'quiz' && (
                <BrainCircuit
                  className="mt-1 flex-shrink-0 text-muted-foreground"
                  size={20}
                />
              )}
              {message.type === 'flashcards' && (
                <BookOpen
                  className="mt-1 flex-shrink-0 text-muted-foreground"
                  size={20}
                />
              )}
              {message.type === 'progress' && (
                <BarChart3
                  className="mt-1 flex-shrink-0 text-muted-foreground"
                  size={20}
                />
              )}

              {/* Content Area */}
              <div className="flex-grow min-w-0">
                {/* Render specific card content based on type */}
                {message.type === 'video' && (
                  <>
                    <p className="text-sm mb-2 text-foreground">
                      Here's a video about {message.content.title}:
                    </p>
                    <div className="bg-card rounded-lg overflow-hidden border">
                      <div className="p-3 border-b flex justify-between items-center">
                        <h3 className="font-medium text-sm text-card-foreground">
                          {message.content.title}
                        </h3>
                        <span className="text-xs text-muted-foreground">
                          {message.content.duration}
                        </span>
                      </div>
                      <div className="aspect-video bg-secondary flex items-center justify-center">
                        <Button
                          size="sm"
                          onClick={() =>
                            setActiveContent({
                              type: 'video',
                              id: message.content.id,
                              title: message.content.title,
                            })
                          }
                        >
                          Watch Video
                        </Button>
                      </div>
                    </div>
                  </>
                )}
                {message.type === 'quiz' && (
                  <>
                    <p className="text-sm mb-2 text-foreground">
                      I've prepared a quiz on{' '}
                      {message.content.title.toLowerCase()} for you:
                    </p>
                    <div className="bg-card rounded-lg overflow-hidden border">
                      <div className="p-3 border-b">
                        <h3 className="font-medium text-sm text-card-foreground">
                          {message.content.title}
                        </h3>
                        <p className="text-xs text-muted-foreground">
                          {message.content.questions} questions
                        </p>
                      </div>
                      <div className="p-4 flex justify-center">
                        <Button
                          size="sm"
                          onClick={() =>
                            setActiveContent({
                              type: 'quiz',
                              id: message.content.id,
                              title: message.content.title,
                            })
                          }
                        >
                          Start Quiz
                        </Button>
                      </div>
                    </div>
                  </>
                )}
                {message.type === 'flashcards' && (
                  <>
                    <p className="text-sm mb-2 text-foreground">
                      Here are some flashcards for{' '}
                      {message.content.title.toLowerCase()}:
                    </p>
                    <div className="bg-card rounded-lg overflow-hidden border">
                      <div className="p-3 border-b">
                        <h3 className="font-medium text-sm text-card-foreground">
                          {message.content.title}
                        </h3>
                        <p className="text-xs text-muted-foreground">
                          {message.content.cards} cards
                        </p>
                      </div>
                      <div className="p-4 flex justify-center">
                        <Button
                          size="sm"
                          onClick={() =>
                            setActiveContent({
                              type: 'flashcards',
                              id: message.content.id,
                              title: message.content.title,
                            })
                          }
                        >
                          Study Flashcards
                        </Button>
                      </div>
                    </div>
                  </>
                )}
                {message.type === 'progress' && (
                  <>
                    <p className="text-sm mb-2 text-foreground">
                      Here's your current progress in {studyKit.name}:
                    </p>
                    <div className="bg-card rounded-lg border p-4">
                      <div className="mb-4">
                        <div className="flex justify-between mb-1">
                          <span className="text-sm font-medium text-card-foreground">
                            Overall Progress
                          </span>
                          <span className="text-sm font-medium text-card-foreground">
                            {message.content.overall}%
                          </span>
                        </div>
                        <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                          <div
                            className="h-full bg-primary rounded-full"
                            style={{ width: `${message.content.overall}%` }}
                          />
                        </div>
                      </div>
                      <div className="space-y-3">
                        {message.content.topics.map((topic, i) => (
                          // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
                          <div key={i}>
                            <div className="flex justify-between mb-1">
                              <span className="text-xs text-muted-foreground">
                                {topic.name}
                              </span>
                              <span className="text-xs text-muted-foreground">
                                {topic.progress}%
                              </span>
                            </div>
                            <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
                              <div
                                className="h-full bg-primary/70 rounded-full"
                                style={{ width: `${topic.progress}%` }}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        );

      // Render Error messages
      case 'error':
        return (
          <div
            key={message.id || index}
            className="p-3 md:p-4 rounded-lg bg-destructive/10 text-destructive mr-auto max-w-[85%] md:max-w-[80%]"
          >
            <span className="font-medium">Error:</span> {message.content}
          </div>
        );

      default:
        // Should not happen if MessageType is exhaustive
        console.warn('Unknown message type:', message);
        return null;
    }
  };

  // --- 5. Main Component JSX ---
  return (
    <div className="flex h-full w-full bg-background text-foreground">
      {/* --- Left Side: Chat Area --- */}
      <div
        className={`flex-1 flex flex-col h-full transition-all duration-300 ease-in-out ${
          activeContent ? 'hidden md:flex md:w-1/2 lg:w-3/5' : 'flex w-full' // Adjust widths as needed
        }`}
      >
        {/* Message List Area */}
        <div className="flex-1 overflow-y-auto p-3 md:p-4">
          {isLoadingHistory ? (
            <div className="flex justify-center items-center h-full">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
              <span className="ml-2 text-muted-foreground">
                Loading History...
              </span>
            </div>
          ) : messages.length === 0 ? (
            // Welcome Message when chat is empty
            <div className="h-full flex flex-col items-center justify-center text-center px-4">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <BookOpen className="h-6 w-6 text-primary" />
              </div>
              <h2 className="text-xl md:text-2xl font-semibold text-foreground mb-2">
                Welcome to {studyKit.name}
              </h2>
              <p className="text-muted-foreground max-w-md mb-6 text-sm md:text-base">
                Ask me anything about {studyKit.name.toLowerCase()}. You can
                request explanations, videos, quizzes, or flashcards. Use the{' '}
                <Paperclip size={16} className="inline -mt-1 mx-0.5" /> button
                to upload files for context.
              </p>
            </div>
          ) : (
            // Render the list of messages
            <div className="max-w-4xl mx-auto space-y-3 md:space-y-4 pb-4">
              {messages.map((message, index) => renderMessage(message, index))}
              <div ref={messagesEndRef} /> {/* Element to scroll to */}
            </div>
          )}
        </div>

        {/* Input Area at the bottom */}
        <div className="border-t p-3 md:p-4 bg-background sticky bottom-0">
          <div className="max-w-4xl mx-auto flex gap-2 items-center">
            {/* Hidden File Input for Upload */}
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileSelect}
              className="hidden"
              accept=".pdf,.txt,.md,.docx,.pptx" // Optional: Specify acceptable file types
            />
            {/* Upload Button */}
            <Button
              variant="outline"
              size="icon"
              className="shrink-0"
              onClick={triggerFileInput}
              disabled={isUploading || isAssistantResponding}
              title="Upload File (.pdf, .txt, .docx, etc.)" // Tooltip
            >
              {isUploading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <Paperclip size={20} />
              )}
            </Button>
            {/* Text Input and Send Button Container */}
            <div className="flex-1 relative">
              <Input
                placeholder="Ask anything or request resources..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    // Send on Enter (not Shift+Enter)
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
                className="pr-12 text-base" // Space for the button, adjust text size if needed
                disabled={
                  isAssistantResponding || isUploading || isLoadingHistory
                }
              />
              {/* Send Button */}
              <Button
                onClick={handleSendMessage}
                size="icon"
                className="shrink-0 absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8" // Position inside input
                disabled={
                  !inputValue.trim() ||
                  isAssistantResponding ||
                  isUploading ||
                  isLoadingHistory
                }
                title="Send Message (Enter)" // Tooltip
              >
                {isAssistantResponding ? (
                  <Loader2 className="h-5 w-5 animate-spin" /> // Loading spinner when sending
                ) : (
                  <SendHorizontal size={20} /> // Send icon
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>{' '}
      {/* End Chat Area */}
      {/* --- Right Side: Active Content Area (Video/Quiz/Flashcards) --- */}
      {activeContent && (
        <div
          className={
            'flex-1 md:w-1/2 lg:w-2/5 border-l bg-muted/30 flex flex-col h-full transition-all duration-300 ease-in-out animate-in slide-in-from-right-full md:slide-in-from-right-0'
          }
        >
          {/* Panel Header */}
          <div className="p-3 border-b flex justify-between items-center flex-shrink-0 bg-background">
            <h3 className="font-medium text-base text-foreground truncate pr-2">
              {/* Display title from active content state */}
              {activeContent.title ||
                activeContent.type.charAt(0).toUpperCase() +
                  activeContent.type.slice(1)}
            </h3>
            {/* Close Button */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setActiveContent(null)}
              className="text-muted-foreground hover:text-foreground h-8 w-8"
              title="Close Panel" // Tooltip
            >
              <X size={20} />
            </Button>
          </div>
          {/* Panel Content Area */}
          <div className="flex-1 overflow-auto p-2 md:p-4">
            {/* Render the component based on active content type */}
            {activeContent.type === 'video' && (
              <VideoPlayer videoId={activeContent.id} /> // Ensure VideoPlayer accepts videoId
            )}
            {activeContent.type === 'quiz' && (
              <QuizComponent quizId={activeContent.id} /> // Ensure QuizComponent accepts quizId
            )}
            {activeContent.type === 'flashcards' && (
              <FlashcardComponent deckId={activeContent.id} /> // Ensure FlashcardComponent accepts deckId
            )}
          </div>
        </div>
      )}{' '}
      {/* End Active Content Area */}
    </div> // End Main Flex Container
  );
}
