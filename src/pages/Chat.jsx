import { useState, useEffect, useRef } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useSettings } from "../contexts/SettingsContext";
import { openRouterService } from "../services/openRouter";
import { chatService } from "../services/chatService";
import { datasetService } from "../services/datasetService";
import ConfirmationModal from "../components/ConfirmationModal";
import TemporaryChatWarning from "../components/TemporaryChatWarning";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import {
  Send,
  Bot,
  User,
  Loader,
  Database,
  X,
  ChevronDown,
  Plus,
  Trash2,
  Copy,
  Check,
  AlertTriangle,
} from "lucide-react";
import toast from "react-hot-toast";
import "prismjs/themes/prism-tomorrow.css";

const Chat = () => {
  const { chatId } = useParams();
  const { user } = useAuth();
  const {
    isChatHistoryEnabled,
    updateSetting,
    isLoading: settingsLoading,
  } = useSettings();
  const navigate = useNavigate();
  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);
  const chatSelectorRef = useRef(null);

  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [currentChat, setCurrentChat] = useState(null);
  const [datasets, setDatasets] = useState([]);
  const [selectedDataset, setSelectedDataset] = useState(null);
  const [showDatasetSelector, setShowDatasetSelector] = useState(false);
  const [showChatSelector, setShowChatSelector] = useState(false);
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [initialLoading, setInitialLoading] = useState(true);
  const [streamingMessage, setStreamingMessage] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    chatId: null,
    chatTitle: "",
  });
  const [copiedMessageId, setCopiedMessageId] = useState(null);
  const [showMarkdownTips, setShowMarkdownTips] = useState(false);
  const [showTemporaryWarning, setShowTemporaryWarning] = useState(false);
  const [isTemporaryMode, setIsTemporaryMode] = useState(false);
  const [datasetLoading, setDatasetLoading] = useState(false);
  const [chatSwitchLoading, setChatSwitchLoading] = useState(false);

  useEffect(() => {
    if (!settingsLoading) {
      const initializeChat = async () => {
        setInitialLoading(true);
        try {
          await Promise.all([loadDatasets(), loadRecentChats()]);

          if (chatId) {
            await loadChat(chatId);
          } else {
            createNewChat();
          }

          // Check if we need to show temporary warning
          if (
            !isChatHistoryEnabled &&
            !isTemporaryMode &&
            messages.length === 0
          ) {
            setShowTemporaryWarning(true);
          }
        } catch (error) {
          console.error("Error initializing chat:", error);
          toast.error("Failed to initialize chat");
        } finally {
          setInitialLoading(false);
          setLoading(false);
        }
      };

      initializeChat();
    }
  }, [chatId, user, settingsLoading, isChatHistoryEnabled]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    adjustTextareaHeight();
  }, [input]);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        chatSelectorRef.current &&
        !chatSelectorRef.current.contains(event.target)
      ) {
        setShowChatSelector(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const adjustTextareaHeight = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height =
        Math.min(textareaRef.current.scrollHeight, 120) + "px";
    }
  };

  const loadDatasets = async () => {
    if (!user) return;
    try {
      const userDatasets = await datasetService.getUserDatasets(user.$id);
      setDatasets(userDatasets);
    } catch (error) {
      console.error("Error loading datasets:", error);
      if (!initialLoading) {
        toast.error("Failed to load datasets");
      }
    }
  };

  const loadRecentChats = async () => {
    if (!user) return;
    try {
      const userChats = await chatService.getUserChats(user.$id);
      setChats(userChats);
    } catch (error) {
      console.error("Error loading chats:", error);
      if (!initialLoading) {
        toast.error("Failed to load chats");
      }
    }
  };

  const loadChat = async (id) => {
    if (!user) return;
    try {
      const chat = await chatService.getChat(id);
      const messages = await chatService.getChatMessages(id);

      setCurrentChat(chat);
      setMessages(
        messages.map((msg) => ({
          id: msg.$id,
          role: msg.role,
          content: msg.content,
          timestamp: msg.created_at,
        }))
      );
      setSelectedDataset(chat.dataset_id || null);
    } catch (error) {
      console.error("Error loading chat:", error);
      toast.error("Chat not found");
      navigate("/chat");
    }
  };

  const createNewChat = () => {
    setCurrentChat(null);
    setMessages([]);
    setSelectedDataset(null);
  };

  const saveChat = async (updatedMessages, chatTitle = null) => {
    if (!user) return;

    try {
      let chat = currentChat;

      // If no current chat, create a new one
      if (!chat) {
        const title =
          chatTitle ||
          updatedMessages[0]?.content?.substring(0, 50) + "..." ||
          "New Chat";
        chat = await chatService.createChat(user.$id, title, selectedDataset);
        setCurrentChat(chat);
        // Remove automatic navigation - only navigate when user explicitly selects chats
        // navigate(`/chat/${chat.$id}`, { replace: true });
      } else if (chatTitle && chat.title !== chatTitle) {
        // Update chat title if provided
        await chatService.updateChat(chat.$id, { title: chatTitle });
      }

      // No need to save messages here as they're saved individually in handleSubmit
      await loadRecentChats(); // Refresh the chat list
    } catch (error) {
      console.error("Error saving chat:", error);
      toast.error("Failed to save chat");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading || !user) return;

    // Check if chat history is disabled and show warning
    if (!isChatHistoryEnabled && !isTemporaryMode) {
      setShowTemporaryWarning(true);
      return;
    }

    const userInput = input.trim();
    setInput("");
    setIsLoading(true);

    try {
      let chat = currentChat;

      // Only create/save chat if history is enabled
      if (isChatHistoryEnabled) {
        // Create or ensure chat exists
        if (!chat) {
          const title = userInput.substring(0, 50) + "...";
          chat = await chatService.createChat(user.$id, title, selectedDataset);
          setCurrentChat(chat);
          // Don't navigate immediately - let the message flow complete first
          // navigate(`/chat/${chat.$id}`, { replace: true });
        }
      }

      // Add user message immediately to UI (optimistic update)
      const tempUserMessage = {
        id: `temp-user-${Date.now()}`,
        role: "user",
        content: userInput,
        timestamp: new Date().toISOString(),
        isTemp: true,
      };
      setMessages((prev) => [...prev, tempUserMessage]);

      // Create user message in database only if history is enabled
      let userMessage = null;
      if (isChatHistoryEnabled && chat) {
        userMessage = await chatService.createMessage(
          chat.$id,
          user.$id,
          "user",
          userInput
        );

        // Replace temp message with saved message
        const userMsgForState = {
          id: userMessage.$id,
          role: "user",
          content: userInput,
          timestamp: userMessage.created_at,
        };
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === tempUserMessage.id ? userMsgForState : msg
          )
        );
      }

      // Start streaming assistant response
      setIsStreaming(true);
      setStreamingMessage("");

      // Add placeholder for assistant message
      const tempAssistantMessage = {
        id: `temp-assistant-${Date.now()}`,
        role: "assistant",
        content: "",
        timestamp: new Date().toISOString(),
        isStreaming: true,
      };
      setMessages((prev) => [...prev, tempAssistantMessage]);

      // Get selected dataset content
      const selectedDatasetContent = selectedDataset
        ? datasets.find((d) => d.$id === selectedDataset)?.content
        : null;

      // Prepare messages for AI
      let aiMessages;
      if (isChatHistoryEnabled && chat) {
        // Get all messages from database to ensure consistency
        const allMessages = await chatService.getChatMessages(chat.$id);
        aiMessages = allMessages.map((msg) => ({
          role: msg.role,
          content: msg.content,
        }));
      } else {
        // Use only current session messages for temporary mode
        const currentMessages = messages.filter(
          (msg) => !msg.id.startsWith("temp-")
        );
        aiMessages = [
          ...currentMessages,
          { role: "user", content: userInput },
        ].map((msg) => ({
          role: msg.role,
          content: msg.content,
        }));
      }

      // Get AI response
      const response = await openRouterService.sendMessage(
        aiMessages,
        selectedDatasetContent
      );

      // Set isLoading to false now that we have the response and are starting to stream
      setIsLoading(false);

      // Stream the response word by word
      let fullResponse = "";
      if (response && typeof response === "string") {
        const words = response.split(" ");
        for (let i = 0; i < words.length; i++) {
          const wordToAdd = i === 0 ? words[i] : " " + words[i];
          fullResponse += wordToAdd;

          // Update streaming message
          setMessages((prev) =>
            prev.map((msg) =>
              msg.id === tempAssistantMessage.id
                ? { ...msg, content: fullResponse }
                : msg
            )
          );

          // Add delay for streaming effect
          await new Promise((resolve) => setTimeout(resolve, 50));
        }
      }

      setIsStreaming(false);

      // Create AI message in database only if history is enabled
      if (isChatHistoryEnabled && chat) {
        const aiMessage = await chatService.createMessage(
          chat.$id,
          user.$id,
          "assistant",
          fullResponse,
          "gpt-3.5-turbo"
        );

        // Replace temp message with saved message
        const aiMsgForState = {
          id: aiMessage.$id,
          role: "assistant",
          content: fullResponse,
          timestamp: aiMessage.created_at,
        };
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === tempAssistantMessage.id ? aiMsgForState : msg
          )
        );

        await loadRecentChats(); // Refresh chat list to include the new chat
        
        // Do NOT navigate automatically - let user stay on current URL
        // Navigation should only happen when user explicitly selects a chat
      } else {
        // In temporary mode, just update the temp message with final content
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === tempAssistantMessage.id
              ? {
                  ...msg,
                  content: fullResponse,
                  isStreaming: false,
                  id: `assistant-${Date.now()}`,
                }
              : msg
          )
        );
      }

    } catch (error) {
      console.error("Error sending message:", error);
      toast.error("Failed to send message. Please try again.");

      // Remove failed messages on error
      setMessages((prev) => prev.filter((msg) => !msg.id.startsWith("temp-")));

      setIsStreaming(false);
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };
  const selectDataset = async (datasetId) => {
    setDatasetLoading(true);
    try {
      setSelectedDataset(datasetId);
      setShowDatasetSelector(false);

      // Update current chat with selected dataset
      if (currentChat) {
        await chatService.updateChat(currentChat.$id, {
          dataset_id: datasetId,
        });
        setCurrentChat((prev) => ({ ...prev, dataset_id: datasetId }));
      }

      const datasetName = datasets.find((d) => d.$id === datasetId)?.name;
      toast.success(`Dataset "${datasetName}" selected`);
    } catch (error) {
      console.error("Error updating chat dataset:", error);
      toast.error("Failed to select dataset");
    } finally {
      setDatasetLoading(false);
    }
  };

  const clearDataset = async () => {
    setDatasetLoading(true);
    try {
      setSelectedDataset(null);

      // Update current chat to remove dataset
      if (currentChat) {
        await chatService.updateChat(currentChat.$id, { dataset_id: null });
        setCurrentChat((prev) => ({ ...prev, dataset_id: null }));
      }

      toast.success("Dataset cleared");
    } catch (error) {
      console.error("Error clearing chat dataset:", error);
      toast.error("Failed to clear dataset");
    } finally {
      setDatasetLoading(false);
    }
  };

  const deleteChat = async (chatIdToDelete) => {
    if (!user) return;

    try {
      await chatService.deleteChat(chatIdToDelete);
      await loadRecentChats(); // Refresh chat list

      // If we're currently viewing the deleted chat, navigate to new chat
      if (chatId === chatIdToDelete) {
        navigate("/chat");
      }

      toast.success("Chat deleted successfully");
    } catch (error) {
      console.error("Error deleting chat:", error);
      toast.error("Failed to delete chat");
    }
  };

  const handleChatSelection = async (selectedChatId) => {
    setChatSwitchLoading(true);
    try {
      setShowChatSelector(false);
      if (selectedChatId === "new") {
        navigate("/chat");
      } else {
        navigate(`/chat/${selectedChatId}`);
      }
    } finally {
      // Reset loading after navigation
      setTimeout(() => setChatSwitchLoading(false), 500);
    }
  };

  const formatChatTitle = (chat) => {
    if (!chat) return "New Chat";

    if (chat.title && chat.title.trim()) {
      return chat.title.length > 30
        ? chat.title.substring(0, 30) + "..."
        : chat.title;
    }
    return "Untitled Chat";
  };

  const copyToClipboard = async (text, messageId) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedMessageId(messageId);
      toast.success("Copied to clipboard");
      setTimeout(() => setCopiedMessageId(null), 2000);
    } catch (err) {
      toast.error("Failed to copy");
    }
  };

  const CustomCode = ({ node, inline, className, children, ...props }) => {
    const match = /language-(\w+)/.exec(className || "");
    const language = match ? match[1] : "";

    if (inline) {
      return (
        <code
          className="bg-gray-700 text-gray-100 px-1 py-0.5 rounded text-sm font-mono"
          {...props}
        >
          {children}
        </code>
      );
    }

    return (
      <div className="relative group">
        <div className="flex items-center justify-between bg-gray-800 px-4 py-2 rounded-t-lg">
          <span className="text-xs text-gray-400 font-medium">
            {language || "Code"}
          </span>
          <button
            onClick={() =>
              copyToClipboard(
                String(children).replace(/\n$/, ""),
                `code-${Date.now()}`
              )
            }
            className="opacity-0 group-hover:opacity-100 transition-opacity text-gray-400 hover:text-white"
          >
            <Copy size={14} />
          </button>
        </div>
        <pre className="bg-gray-900 text-gray-100 p-4 rounded-b-lg overflow-x-auto text-sm">
          <code className={className} {...props}>
            {children}
          </code>
        </pre>
      </div>
    );
  };

  const markdownComponents = {
    code: CustomCode,
    pre: ({ children }) => <div className="my-2">{children}</div>,
    p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
    h1: ({ children }) => (
      <h1 className="text-2xl font-bold mb-3 text-white">{children}</h1>
    ),
    h2: ({ children }) => (
      <h2 className="text-xl font-bold mb-2 text-white">{children}</h2>
    ),
    h3: ({ children }) => (
      <h3 className="text-lg font-bold mb-2 text-white">{children}</h3>
    ),
    h4: ({ children }) => (
      <h4 className="text-base font-bold mb-1 text-white">{children}</h4>
    ),
    ul: ({ children }) => (
      <ul className="list-disc list-inside mb-2 space-y-1">{children}</ul>
    ),
    ol: ({ children }) => (
      <ol className="list-decimal list-inside mb-2 space-y-1">{children}</ol>
    ),
    li: ({ children }) => <li className="mb-1">{children}</li>,
    blockquote: ({ children }) => (
      <blockquote className="border-l-4 border-gray-600 pl-4 my-2 italic text-gray-300 bg-gray-800/30 py-2 rounded-r">
        {children}
      </blockquote>
    ),
    table: ({ children }) => (
      <div className="overflow-x-auto my-2">
        <table className="min-w-full border border-gray-600">{children}</table>
      </div>
    ),
    th: ({ children }) => (
      <th className="border border-gray-600 px-3 py-2 bg-gray-800 font-medium text-left">
        {children}
      </th>
    ),
    td: ({ children }) => (
      <td className="border border-gray-600 px-3 py-2">{children}</td>
    ),
    a: ({ children, href }) => (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-400 hover:text-blue-300 underline"
      >
        {children}
      </a>
    ),
    img: ({ src, alt }) => (
      <img
        src={src}
        alt={alt}
        className="max-w-full h-auto rounded-lg border border-gray-700 my-2"
        loading="lazy"
      />
    ),
    strong: ({ children }) => (
      <strong className="font-bold text-white">{children}</strong>
    ),
    em: ({ children }) => <em className="italic">{children}</em>,
    hr: () => <hr className="border-gray-600 my-4" />,
  };

  const handleEnableChatHistory = async () => {
    try {
      await updateSetting("chat_history_enabled", true);
      setShowTemporaryWarning(false);
      setIsTemporaryMode(false);
      toast.success(
        "Chat history enabled! Your conversations will now be saved."
      );
    } catch (error) {
      toast.error("Failed to enable chat history");
    }
  };

  const handleProceedTemporary = () => {
    setShowTemporaryWarning(false);
    setIsTemporaryMode(true);
    toast.success("Continuing in temporary mode");
  };

  if (initialLoading || settingsLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen max-h-screen">
      {/* Chat Header */}
      <div className="border-b border-gray-800 bg-black/50 backdrop-blur-sm sticky top-0 z-10 flex-shrink-0">
        <div className="container mx-auto px-4 py-4">
          {/* Temporary Mode Warning Banner */}
          {!isChatHistoryEnabled && isTemporaryMode && (
            <div className="bg-yellow-600/20 border border-yellow-500/30 rounded-lg p-3 mb-4 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <AlertTriangle className="text-yellow-400" size={16} />
                <span className="text-yellow-200 text-sm">
                  Temporary Mode: Your conversation will not be saved
                  permanently
                </span>
              </div>
              <button
                onClick={handleEnableChatHistory}
                className="text-yellow-200 hover:text-white text-sm underline"
              >
                Enable History
              </button>
            </div>
          )}

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {/* Chat Selector Dropdown */}
              <div className="relative" ref={chatSelectorRef}>
                <button
                  onClick={() => setShowChatSelector(!showChatSelector)}
                  className="flex items-center space-x-2 bg-gray-800 hover:bg-gray-700 px-3 py-2 rounded-lg transition-colors"
                >
                  <h1 className="text-xl font-semibold">
                    {currentChat?.title || "New Chat"}
                  </h1>
                  {chats.length > 0 && (
                    <ChevronDown
                      size={16}
                      className={`transform transition-transform ${
                        showChatSelector ? "rotate-180" : ""
                      }`}
                    />
                  )}
                </button>

                {/* Chat Dropdown */}
                {showChatSelector && chats.length > 0 && (
                  <div className="absolute top-full left-0 mt-2 w-80 bg-gray-900 border border-gray-700 rounded-lg shadow-lg z-20">
                    <div className="p-2">
                      <div className="mb-2">
                        <button
                          onClick={() => handleChatSelection("new")}
                          className={`w-full text-left p-3 rounded-md transition-colors flex items-center space-x-3 ${
                            !chatId
                              ? "bg-blue-500/20 text-blue-400"
                              : "hover:bg-gray-800"
                          }`}
                        >
                          <Plus size={16} />
                          <span className="font-medium">New Chat</span>
                        </button>
                      </div>

                      <div className="border-t border-gray-700 pt-2">
                        <p className="text-xs text-gray-500 font-medium mb-2 px-3">
                          Recent Chats
                        </p>
                        <div className="space-y-1 max-h-64 overflow-y-auto">
                          {chats.slice(0, 10).map((chat) => (
                            <div
                              key={chat.$id}
                              className={`flex items-center justify-between p-3 rounded-md transition-colors ${
                                chatId === chat.$id
                                  ? "bg-blue-500/20 text-blue-400"
                                  : "hover:bg-gray-800"
                              }`}
                            >
                              <button
                                onClick={() => handleChatSelection(chat.$id)}
                                className="flex-1 text-left"
                              >
                                <div className="flex items-center justify-between">
                                  <div className="flex-1">
                                    <div className="font-medium truncate">
                                      {formatChatTitle(chat)}
                                    </div>
                                    <div className="text-xs text-gray-400 mt-1">
                                      {new Date(
                                        chat.updated_at || chat.created_at
                                      ).toLocaleDateString()}
                                    </div>
                                  </div>
                                  {chat.dataset_id && (
                                    <div className="ml-2">
                                      <Database
                                        size={12}
                                        className="text-blue-400"
                                      />
                                    </div>
                                  )}
                                </div>
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setDeleteModal({
                                    isOpen: true,
                                    chatId: chat.$id,
                                    chatTitle: chat.title,
                                  });
                                }}
                                className="ml-2 p-1 text-gray-400 hover:text-red-400 transition-colors"
                                title="Delete chat"
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {selectedDataset && (
                <div className="flex items-center space-x-2 bg-blue-500/20 text-blue-400 px-3 py-1 rounded-full text-sm">
                  <Database size={14} />
                  <span>
                    {datasets.find((d) => d.$id === selectedDataset)?.name}
                  </span>{" "}
                  <button
                    onClick={clearDataset}
                    className="hover:text-blue-300 disabled:opacity-50"
                    disabled={datasetLoading}
                  >
                    {datasetLoading ? (
                      <Loader size={14} className="animate-spin" />
                    ) : (
                      <X size={14} />
                    )}
                  </button>
                </div>
              )}
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setShowDatasetSelector(!showDatasetSelector)}
                className="btn btn-secondary btn-sm"
                disabled={datasetLoading}
              >
                {datasetLoading ? (
                  <Loader size={16} className="animate-spin" />
                ) : (
                  <Database size={16} />
                )}
                {selectedDataset ? "Change Dataset" : "Select Dataset"}
              </button>
            </div>
          </div>

          {/* Dataset Selector */}
          {showDatasetSelector && (
            <div className="mt-4 card max-w-md">
              <h3 className="font-medium mb-3">Select Dataset</h3>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                <button
                  onClick={() => {
                    setSelectedDataset(null);
                    setShowDatasetSelector(false);
                  }}
                  className={`w-full text-left p-2 rounded-md transition-colors ${
                    !selectedDataset
                      ? "bg-blue-500/20 text-blue-400"
                      : "hover:bg-gray-700"
                  }`}
                >
                  No Dataset (General AI)
                </button>
                {datasets.map((dataset) => (
                  <button
                    key={dataset.$id}
                    onClick={() => selectDataset(dataset.$id)}
                    className={`w-full text-left p-2 rounded-md transition-colors disabled:opacity-50 ${
                      selectedDataset === dataset.$id
                        ? "bg-blue-500/20 text-blue-400"
                        : "hover:bg-gray-700"
                    }`}
                    disabled={datasetLoading}
                  >
                    <div className="font-medium">{dataset.name}</div>
                    <div className="text-xs text-gray-400">
                      {new Date(dataset.created_at).toLocaleDateString()}
                    </div>
                  </button>
                ))}
              </div>
              {datasets.length === 0 && (
                <p className="text-gray-400 text-sm text-center py-4">
                  No datasets available. Upload datasets from your dashboard.
                </p>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto min-h-0 custom-scrollbar">
        <div className="h-full px-4 py-6 pb-8">
          {messages.length === 0 ? (
            <div className="text-center py-12">
              <Bot size={64} className="text-gray-600 mx-auto mb-4" />
              <h2 className="text-2xl font-semibold mb-2">
                Start a Conversation
              </h2>
              <p className="text-gray-400 mb-6">
                {selectedDataset
                  ? `Ask questions about your "${
                      datasets.find((d) => d.$id === selectedDataset)?.name
                    }" dataset`
                  : "Ask me anything! I'm here to help."}
              </p>
              {datasets.length > 0 && !selectedDataset && (
                <button
                  onClick={() => setShowDatasetSelector(true)}
                  className="btn btn-primary"
                >
                  <Database size={16} />
                  Select a Dataset
                </button>
              )}
            </div>
          ) : (
            <div className="space-y-6 max-w-4xl mx-auto pb-6">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex items-start space-x-4 ${
                    message.role === "user"
                      ? "flex-row-reverse space-x-reverse"
                      : ""
                  }`}
                >
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                      message.role === "user" ? "bg-blue-500" : "bg-gray-700"
                    }`}
                  >
                    {message.role === "user" ? (
                      <User size={16} className="text-white" />
                    ) : (
                      <Bot size={16} className="text-white" />
                    )}
                  </div>
                  <div
                    className={`flex-1 min-w-0 ${
                      message.role === "user" ? "text-right" : ""
                    }`}
                  >
                    <div
                      className={`relative group inline-block p-4 rounded-lg max-w-3xl ${
                        message.role === "user"
                          ? "bg-blue-600 text-white"
                          : "bg-gray-800 text-gray-100"
                      }`}
                    >
                      {message.role === "assistant" ? (
                        <div className="prose prose-invert max-w-none">
                          <ReactMarkdown
                            remarkPlugins={[remarkGfm]}
                            rehypePlugins={[rehypeHighlight]}
                            components={markdownComponents}
                          >
                            {message.content}
                          </ReactMarkdown>
                          {message.isStreaming && (
                            <span className="animate-pulse">|</span>
                          )}
                        </div>
                      ) : (
                        <div className="whitespace-pre-wrap">
                          {message.content}
                          {message.isStreaming && (
                            <span className="animate-pulse">|</span>
                          )}
                        </div>
                      )}

                      {/* Copy button for assistant messages */}
                      {message.role === "assistant" && message.content && (
                        <button
                          onClick={() =>
                            copyToClipboard(message.content, message.id)
                          }
                          className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity p-1 text-gray-400 hover:text-white bg-gray-700 hover:bg-gray-600 rounded"
                          title="Copy message"
                        >
                          {copiedMessageId === message.id ? (
                            <Check size={14} className="text-green-400" />
                          ) : (
                            <Copy size={14} />
                          )}
                        </button>
                      )}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      {new Date(message.timestamp).toLocaleTimeString()}
                    </div>
                  </div>
                </div>
              ))}
              {isLoading && !isStreaming && (
                <div className="flex items-start space-x-4 pb-6">
                  <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center flex-shrink-0">
                    <Bot size={16} className="text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="inline-block p-4 rounded-lg bg-gray-800">
                      <div className="flex items-center space-x-2">
                        <Loader size={16} className="animate-spin" />
                        <span>Thinking...</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} className="pb-4" />
            </div>
          )}
        </div>
      </div>

      {/* Input */}
      <div className="border-t border-gray-800 bg-black/50 backdrop-blur-sm flex-shrink-0">
        <div className="px-4 py-6">
          {/* Markdown Tips */}
          {showMarkdownTips && (
            <div className="max-w-4xl mx-auto mb-4 p-3 bg-gray-800/50 border border-gray-700 rounded-lg text-sm">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium text-blue-400">
                  Markdown Formatting Tips
                </span>
                <button
                  onClick={() => setShowMarkdownTips(false)}
                  className="text-gray-400 hover:text-white"
                >
                  <X size={14} />
                </button>
              </div>
              <div className="grid grid-cols-2 gap-4 text-gray-300">
                <div>
                  <div>
                    <code>**bold**</code> → <strong>bold</strong>
                  </div>
                  <div>
                    <code>*italic*</code> → <em>italic</em>
                  </div>
                  <div>
                    <code>`code`</code> →{" "}
                    <code className="bg-gray-700 px-1 rounded">code</code>
                  </div>
                </div>
                <div>
                  <div>
                    <code># Heading</code> → Heading
                  </div>
                  <div>
                    <code>- List item</code> → • List item
                  </div>
                  <div>
                    <code>[link](url)</code> →{" "}
                    <span className="text-blue-400">link</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="max-w-4xl mx-auto">
            <div className="flex items-end space-x-4">
              <div className="flex-1 relative">
                <textarea
                  ref={textareaRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  onFocus={() =>
                    !showMarkdownTips &&
                    setTimeout(() => setShowMarkdownTips(true), 1000)
                  }
                  placeholder="Type your message... (Markdown supported)"
                  className="input textarea resize-none custom-scrollbar pr-10"
                  rows={1}
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowMarkdownTips(!showMarkdownTips)}
                  className="absolute right-2 top-3 text-gray-400 hover:text-white transition-colors"
                  title="Markdown formatting tips"
                >
                  <span className="text-xs font-mono">MD</span>
                </button>
              </div>
              <button
                type="submit"
                disabled={!input.trim() || isLoading}
                className="btn btn-primary"
              >
                <Send size={16} />
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={deleteModal.isOpen}
        onClose={() =>
          setDeleteModal({ isOpen: false, chatId: null, chatTitle: "" })
        }
        onConfirm={() => {
          deleteChat(deleteModal.chatId);
          setDeleteModal({ isOpen: false, chatId: null, chatTitle: "" });
        }}
        title="Delete Chat"
        message={`Are you sure you want to delete "${deleteModal.chatTitle}"? This action cannot be undone.`}
        type="danger"
      />

      {/* Temporary Chat Warning Modal */}
      <TemporaryChatWarning
        isOpen={showTemporaryWarning}
        onClose={() => setShowTemporaryWarning(false)}
        onProceed={handleProceedTemporary}
        onEnableHistory={handleEnableChatHistory}
      />
    </div>
  );
};

export default Chat;
