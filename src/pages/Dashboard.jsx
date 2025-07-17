import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { chatService } from "../services/chatService";
import { datasetService } from "../services/datasetService";
import {
  MessageSquare,
  Plus,
  Database,
  BarChart3,
  Settings,
  Upload,
  Trash2,
} from "lucide-react";
import toast from "react-hot-toast";

const Dashboard = () => {
  const { user } = useAuth();
  const [chats, setChats] = useState([]);
  const [datasets, setDatasets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDataset, setSelectedDataset] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      fetchData();
    }
  }, [user]);

  const fetchData = async () => {
    if (!user) return;

    try {
      const [userChats, userDatasets] = await Promise.all([
        chatService.getUserChats(user.$id),
        datasetService.getUserDatasets(user.$id),
      ]);

      setChats(userChats);
      setDatasets(userDatasets);
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  const handleDatasetUpload = async (event) => {
    const file = event.target.files[0];
    if (!file || !user) return;

    if (file.type !== "text/plain" && !file.name.endsWith(".txt")) {
      toast.error("Please upload a .txt file");
      return;
    }

    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const content = e.target.result;
        const name = file.name.replace(".txt", "");

        await datasetService.createDataset(user.$id, name, content, "txt");
        await fetchData(); // Refresh data
        toast.success("Dataset uploaded successfully!");
      } catch (error) {
        console.error("Error uploading dataset:", error);
        toast.error("Failed to upload dataset");
      }
    };
    reader.readAsText(file);
  };

  const deleteDataset = async (datasetId) => {
    if (!user) return;

    try {
      await datasetService.deleteDataset(datasetId);
      await fetchData(); // Refresh data
      toast.success("Dataset deleted successfully");
    } catch (error) {
      console.error("Error deleting dataset:", error);
      toast.error("Failed to delete dataset");
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Welcome back, {user?.name}!</h1>
        <p className="text-gray-400">
          Manage your chats, datasets, and AI preferences.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Total Chats</p>
              <p className="text-2xl font-bold">{chats.length}</p>
            </div>
            <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center">
              <MessageSquare className="text-white" size={24} />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Custom Datasets</p>
              <p className="text-2xl font-bold">{datasets.length}</p>
            </div>
            <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center">
              <Database className="text-white" size={24} />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Messages Sent</p>
              <p className="text-2xl font-bold">
                {chats.reduce(
                  (acc, chat) => acc + (chat.messages?.length || 0),
                  0
                )}
              </p>
            </div>
            <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center">
              <BarChart3 className="text-white" size={24} />
            </div>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Recent Chats */}
        <div className="card">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold">Recent Chats</h2>
            <Link to="/chat" className="btn btn-primary btn-sm">
              <Plus size={16} />
              New Chat
            </Link>
          </div>

          {chats.length > 0 ? (
            <div className="space-y-3">
              {chats.slice(0, 5).map((chat) => (
                <Link
                  key={chat.$id}
                  to={`/chat/${chat.$id}`}
                  className="block p-3 rounded-lg border border-gray-700 hover:border-gray-600 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium truncate">
                        {chat.title || "Untitled Chat"}
                      </p>
                      <p className="text-sm text-gray-400">
                        {new Date(chat.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <MessageSquare size={16} className="text-gray-400" />
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <MessageSquare size={48} className="text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400">
                No chats yet. Start your first conversation!
              </p>
              <Link to="/chat" className="btn btn-primary mt-4">
                Start Chatting
              </Link>
            </div>
          )}
        </div>

        {/* Custom Datasets */}
        <div className="card">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold">Custom Datasets</h2>
            <label className="btn btn-primary btn-sm cursor-pointer">
              <Upload size={16} />
              Upload Dataset
              <input
                type="file"
                className="hidden"
                accept=".txt"
                onChange={handleDatasetUpload}
              />
            </label>
          </div>

          {datasets.length > 0 ? (
            <div className="space-y-3">
              {datasets.map((dataset) => (
                <div
                  key={dataset.$id}
                  className={`p-3 rounded-lg border transition-colors cursor-pointer ${
                    selectedDataset === dataset.$id
                      ? "border-blue-500 bg-blue-500/10"
                      : "border-gray-700 hover:border-gray-600"
                  }`}
                  onClick={() =>
                    setSelectedDataset(
                      selectedDataset === dataset.$id ? null : dataset.$id
                    )
                  }
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <p className="font-medium">{dataset.name}</p>
                      <p className="text-sm text-gray-400">
                        {formatFileSize(dataset.size)} •{" "}
                        {new Date(dataset.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteDataset(dataset.$id);
                      }}
                      className="text-red-400 hover:text-red-300 p-1"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Database size={48} className="text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400">No custom datasets yet.</p>
              <p className="text-sm text-gray-500 mb-4">
                Upload text files to train your AI on custom data.
              </p>
              <label className="btn btn-primary cursor-pointer">
                <Upload size={16} />
                Upload Your First Dataset
                <input
                  type="file"
                  className="hidden"
                  accept=".txt"
                  onChange={handleDatasetUpload}
                />
              </label>
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid md:grid-cols-2 gap-6 mt-8">
        <Link
          to="/chat"
          className="card p-6 block hover:bg-gray-800/50 transition-colors"
        >
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center">
              <MessageSquare className="text-white" size={24} />
            </div>
            <div>
              <h3 className="font-semibold">Start New Chat</h3>
              <p className="text-gray-400 text-sm">
                Begin a conversation with your AI assistant
              </p>
            </div>
          </div>
        </Link>

        <Link
          to="/settings"
          className="card p-6 block hover:bg-gray-800/50 transition-colors"
        >
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gray-600 rounded-lg flex items-center justify-center">
              <Settings className="text-white" size={24} />
            </div>
            <div>
              <h3 className="font-semibold">Settings</h3>
              <p className="text-gray-400 text-sm">
                Customize your AI preferences
              </p>
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default Dashboard;
