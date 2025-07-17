import { useState, useEffect } from 'react';
import { CheckCircle, AlertCircle, Clock, HelpCircle, RefreshCw } from 'lucide-react';

const Status = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  
  // Mock services status data
  const [services, setServices] = useState([
    { id: 'api', name: 'API Service', status: 'operational', uptime: '99.98%' },
    { id: 'auth', name: 'Authentication Service', status: 'operational', uptime: '99.99%' },
    { id: 'db', name: 'Database Service', status: 'operational', uptime: '99.95%' },
    { id: 'storage', name: 'Storage Service', status: 'operational', uptime: '99.97%' },
    { id: 'ai', name: 'AI Models', status: 'operational', uptime: '99.90%' }
  ]);
  
  // Mock incidents data
  const [incidents, setIncidents] = useState([
    {
      id: 'inc-1',
      title: 'Scheduled Maintenance',
      status: 'scheduled',
      date: '2025-07-20T15:00:00Z',
      description: 'We will be performing scheduled maintenance on our database systems. Expected downtime is 30 minutes.',
      updates: [
        { 
          time: '2025-07-16T09:00:00Z', 
          message: 'Maintenance scheduled for July 20, 2025 at 15:00 UTC.' 
        }
      ]
    },
    {
      id: 'inc-2',
      title: 'AI Service Degradation',
      status: 'resolved',
      date: '2025-07-10T08:30:00Z',
      description: 'Some users experienced slower response times from our AI services.',
      updates: [
        { 
          time: '2025-07-10T08:30:00Z', 
          message: 'We are investigating reports of slow AI responses.' 
        },
        { 
          time: '2025-07-10T09:15:00Z', 
          message: 'The issue has been identified as increased traffic on our AI infrastructure.' 
        },
        { 
          time: '2025-07-10T10:45:00Z', 
          message: 'We have scaled up our AI services and performance has returned to normal.' 
        }
      ]
    }
  ]);

  useEffect(() => {
    // Simulate loading data
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);

  const refreshStatus = () => {
    setIsLoading(true);
    
    // Simulate refreshing data
    setTimeout(() => {
      setLastUpdated(new Date());
      setIsLoading(false);
    }, 1000);
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'operational':
        return <CheckCircle className="text-green-400" size={20} />;
      case 'degraded':
        return <AlertCircle className="text-yellow-400" size={20} />;
      case 'outage':
        return <AlertCircle className="text-red-400" size={20} />;
      case 'maintenance':
        return <Clock className="text-blue-400" size={20} />;
      default:
        return <HelpCircle className="text-gray-400" size={20} />;
    }
  };

  const getIncidentStatusBadge = (status) => {
    const styles = {
      resolved: 'bg-green-500/20 text-green-400',
      investigating: 'bg-yellow-500/20 text-yellow-400',
      identified: 'bg-blue-500/20 text-blue-400',
      monitoring: 'bg-purple-500/20 text-purple-400',
      scheduled: 'bg-gray-500/20 text-gray-400',
    };
    
    return (
      <span className={`${styles[status]} px-2 py-1 rounded text-xs font-medium`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      timeZoneName: 'short'
    });
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white py-12">
      <div className="container px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-black mb-4">
              System <span className="text-gradient">Status</span>
            </h1>
            <p className="text-gray-400 text-xl max-w-2xl mx-auto">
              Current operational status of all QueryNest services
            </p>
          </div>
          
          {/* Status Overview */}
          <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6 mb-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold">Current Status</h2>
              <button 
                onClick={refreshStatus}
                disabled={isLoading}
                className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
              >
                <RefreshCw size={16} className={isLoading ? 'animate-spin' : ''} />
                <span>Refresh</span>
              </button>
            </div>
            
            {isLoading ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin w-8 h-8 border-3 border-blue-500 border-t-transparent rounded-full"></div>
              </div>
            ) : (
              <>
                <div className="flex items-center gap-3 p-4 bg-green-500/10 border border-green-500/20 rounded-lg mb-6">
                  <CheckCircle className="text-green-400" size={24} />
                  <span className="text-lg font-medium text-green-400">All Systems Operational</span>
                </div>
                
                <div className="space-y-4">
                  {services.map((service) => (
                    <div key={service.id} className="flex justify-between items-center p-4 border-b border-gray-800 last:border-b-0">
                      <div className="flex items-center gap-3">
                        {getStatusIcon(service.status)}
                        <span className="font-medium">{service.name}</span>
                      </div>
                      <div className="text-gray-400">
                        {service.uptime} uptime
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="mt-6 text-sm text-gray-400 text-right">
                  Last updated: {lastUpdated.toLocaleTimeString()}
                </div>
              </>
            )}
          </div>
          
          {/* Scheduled Maintenance */}
          <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6 mb-8">
            <h2 className="text-xl font-bold mb-6">Scheduled Maintenance</h2>
            
            {incidents.filter(incident => incident.status === 'scheduled').length > 0 ? (
              <div className="space-y-6">
                {incidents
                  .filter(incident => incident.status === 'scheduled')
                  .map((incident) => (
                    <div key={incident.id} className="border-b border-gray-800 last:border-b-0 pb-6">
                      <div className="flex justify-between items-start mb-3">
                        <h3 className="text-lg font-medium">{incident.title}</h3>
                        {getIncidentStatusBadge(incident.status)}
                      </div>
                      <p className="text-gray-400 mb-3">{incident.description}</p>
                      <p className="text-sm text-blue-400">
                        Scheduled for {formatDate(incident.date)}
                      </p>
                    </div>
                  ))}
              </div>
            ) : (
              <p className="text-gray-400">No scheduled maintenance at this time.</p>
            )}
          </div>
          
          {/* Past Incidents */}
          <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6">
            <h2 className="text-xl font-bold mb-6">Past Incidents</h2>
            
            {incidents.filter(incident => incident.status === 'resolved').length > 0 ? (
              <div className="space-y-8">
                {incidents
                  .filter(incident => incident.status === 'resolved')
                  .map((incident) => (
                    <div key={incident.id} className="border-b border-gray-800 last:border-b-0 pb-8">
                      <div className="flex justify-between items-start mb-3">
                        <h3 className="text-lg font-medium">{incident.title}</h3>
                        {getIncidentStatusBadge(incident.status)}
                      </div>
                      <p className="text-gray-400 mb-3">{incident.description}</p>
                      <p className="text-sm text-gray-500 mb-4">
                        {formatDate(incident.date)}
                      </p>
                      
                      {/* Updates Timeline */}
                      <div className="relative pl-6 mt-6 space-y-4">
                        <div className="absolute top-0 bottom-0 left-2 w-px bg-gray-800"></div>
                        
                        {incident.updates.map((update, index) => (
                          <div key={index} className="relative">
                            <div className="absolute -left-6 top-1 w-3 h-3 rounded-full border-2 border-blue-500 bg-gray-900"></div>
                            <div className="text-sm text-gray-500 mb-1">
                              {formatDate(update.time)}
                            </div>
                            <p className="text-gray-300">{update.message}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
              </div>
            ) : (
              <p className="text-gray-400">No incidents in the last 90 days.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Status;
