import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { datasetService } from '../services/datasetService';
import { Database, Trash2, Search, Download, Plus, FileText, Code } from 'lucide-react';
import toast from 'react-hot-toast';

const Datasets = () => {
  const { user } = useAuth();
  const [datasets, setDatasets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [datasetContent, setDatasetContent] = useState('');
  const [datasetName, setDatasetName] = useState('');
  const [datasetType, setDatasetType] = useState('json');

  useEffect(() => {
    if (user) {
      fetchData();
    }
  }, [user]);

  const fetchData = async () => {
    if (!user) return;
    
    try {
      const userDatasets = await datasetService.getUserDatasets(user.$id);
      setDatasets(userDatasets);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Failed to load datasets');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateDataset = async () => {
    if (!datasetName.trim() || !datasetContent.trim() || !user) {
      toast.error('Please provide both name and content for the dataset');
      return;
    }

    try {
      await datasetService.createDataset(user.$id, datasetName, datasetContent, datasetType);
      await fetchData(); // Refresh data
      
      // Reset form
      setDatasetName('');
      setDatasetContent('');
      setDatasetType('json');
      setShowCreateForm(false);
      
      toast.success('Dataset created successfully!');
    } catch (error) {
      console.error('Error creating dataset:', error);
      toast.error('Failed to create dataset');
    }
  };

  const handleDeleteDataset = async (id) => {
    if (!user) return;
    
    try {
      await datasetService.deleteDataset(id);
      await fetchData(); // Refresh data
      toast.success('Dataset deleted successfully');
    } catch (error) {
      console.error('Error deleting dataset:', error);
      toast.error('Failed to delete dataset');
    }
  };

  const handleDownloadDataset = (dataset) => {
    const blob = new Blob([dataset.content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${dataset.name}.${dataset.format}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success('Dataset downloaded');
  };

  const filteredDatasets = datasets.filter(dataset =>
    dataset.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
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
      {/* Page Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Datasets</h1>
          <p className="text-gray-400">Manage your custom datasets for AI training</p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setShowCreateForm(true)}
            className="btn btn-primary"
          >
            <Plus size={16} />
            Create Dataset
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
        <input
          type="text"
          placeholder="Search datasets..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="input pl-10 w-full max-w-md"
        />
      </div>

      {/* Datasets Grid */}
      {filteredDatasets.length === 0 ? (
        <div className="text-center py-12">
          <Database size={64} className="text-gray-600 mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">No datasets found</h2>
          <p className="text-gray-400 mb-6">
            {searchTerm ? 'No datasets match your search criteria.' : 'Create your first dataset to get started.'}
          </p>
          <button
            onClick={() => setShowCreateForm(true)}
            className="btn btn-primary"
          >
            <Plus size={16} />
            Create Dataset
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDatasets.map((dataset) => (
            <div
              key={dataset.$id}
              className="bg-gray-800/50 border border-gray-700 rounded-lg p-6 hover:border-gray-600 transition-colors"
            >
              {/* Dataset Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  {dataset.format === 'json' ? (
                    <Code className="h-8 w-8 text-blue-400" />
                  ) : (
                    <FileText className="h-8 w-8 text-green-400" />
                  )}
                  <div>
                    <h3 className="font-semibold text-white truncate">{dataset.name}</h3>
                    <p className="text-sm text-gray-400 capitalize">{dataset.format} file</p>
                  </div>
                </div>
              </div>

              {/* Dataset Info */}
              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Size:</span>
                  <span className="text-white">{formatFileSize(dataset.size)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Created:</span>
                  <span className="text-white">{formatDate(dataset.created_at)}</span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <button
                  onClick={() => handleDownloadDataset(dataset)}
                  className="flex-1 flex items-center justify-center px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-sm"
                >
                  <Download className="h-4 w-4 mr-1" />
                  Download
                </button>
                <button
                  onClick={() => handleDeleteDataset(dataset.$id)}
                  className="flex items-center justify-center px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors text-sm"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create Dataset Modal */}
      {showCreateForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-gray-900 rounded-lg p-6 w-full max-w-2xl max-h-[80vh] overflow-y-auto">
            <h2 className="text-xl font-semibold mb-4">Create New Dataset</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Dataset Name</label>
                <input
                  type="text"
                  value={datasetName}
                  onChange={(e) => setDatasetName(e.target.value)}
                  placeholder="Enter dataset name..."
                  className="input w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Dataset Type</label>
                <select
                  value={datasetType}
                  onChange={(e) => setDatasetType(e.target.value)}
                  className="input w-full"
                >
                  <option value="json">JSON</option>
                  <option value="txt">Plain Text</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Dataset Content</label>
                <textarea
                  value={datasetContent}
                  onChange={(e) => setDatasetContent(e.target.value)}
                  placeholder={datasetType === 'json' ? 'Enter JSON data...' : 'Enter text data...'}
                  className="input w-full h-48 resize-none"
                />
              </div>
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={handleCreateDataset}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
              >
                Create Dataset
              </button>
              <button
                onClick={() => setShowCreateForm(false)}
                className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Datasets;
