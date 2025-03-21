import { useState, useEffect } from 'react';
import { Hash, Menu, MessageSquare, Plus, Settings, User } from "lucide-react"

export default function Sircord() {
  const [servers, setServers] = useState([
    { id: 1, name: 'Sircord Server', icon: 'S' }
  ]);
  const [channels, setChannels] = useState([
    { id: 1, name: 'general', serverId: 1 },
    { id: 2, name: 'random', serverId: 1 },
    { id: 3, name: 'announcements', serverId: 1 },
  ]);
  const [messages, setMessages] = useState([
    { id: 1, text: 'Hello, welcome to Sircord!', user: 'User1', timestamp: 'Today at 12:34 PM', channelId: 1 },
    { id: 2, text: 'Thanks! The black and yellow theme looks great!', user: 'User2', timestamp: 'Today at 12:35 PM', channelId: 1 },
  ]);
  const [selectedServer, setSelectedServer] = useState(1);
  const [selectedChannel, setSelectedChannel] = useState(1);
  const [newMessage, setNewMessage] = useState('');
  const [user, setUser] = useState({ username: 'YourUsername', tag: '#1234' });
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  useEffect(() => {
    const serverChannels = channels.filter(c => c.serverId === selectedServer);
    if (serverChannels.length > 0 && !serverChannels.find(c => c.id === selectedChannel)) {
      setSelectedChannel(serverChannels[0].id);
    }
  }, [selectedServer, channels, selectedChannel]);

  const handleCreateServer = () => {
    const serverName = prompt('Enter server name:');
    if (serverName) {
      const newServer = {
        id: Date.now(),
        name: serverName,
        icon: serverName.charAt(0).toUpperCase(),
      };
      const newChannel = {
        id: Date.now(),
        name: 'general',
        serverId: newServer.id,
      };
      setServers(prev => [...prev, newServer]);
      setChannels(prev => [...prev, newChannel]);
      setSelectedServer(newServer.id);
      setSelectedChannel(newChannel.id);
    }
  };

  const handleCreateChannel = () => {
    const channelName = prompt('Enter channel name:');
    if (channelName) {
      const newChannel = {
        id: Date.now(),
        name: channelName,
        serverId: selectedServer,
      };
      setChannels(prev => [...prev, newChannel]);
      setSelectedChannel(newChannel.id);
    }
  };

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;
    const newMsg = {
      id: Date.now(),
      text: newMessage,
      user: user.username,
      timestamp: new Date().toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true }),
      channelId: selectedChannel,
    };
    setMessages(prev => [...prev, newMsg]);
    setNewMessage('');
  };

  return (
    <div className="flex h-screen text-white bg-black">
      {/* Server list */}
      <div className="w-16 bg-[#1a1a1a] flex flex-col items-center py-4 space-y-4">
        {servers.map(server => (
          <div
            key={server.id}
            className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-2xl cursor-pointer transition-colors ${
              selectedServer === server.id 
                ? 'bg-yellow-400 text-black' 
                : 'bg-[#2a2a2a] hover:bg-yellow-400 hover:text-black'
            }`}
            onClick={() => setSelectedServer(server.id)}
          >
            {server.icon}
          </div>
        ))}
        <div className="w-12 h-12 bg-[#2a2a2a] rounded-full flex items-center justify-center hover:bg-yellow-400 hover:text-black transition-colors cursor-pointer">
          <MessageSquare size={24} />
        </div>
        <div 
          className="w-12 h-12 bg-[#2a2a2a] rounded-full flex items-center justify-center hover:bg-yellow-400 hover:text-black transition-colors cursor-pointer"
          onClick={handleCreateServer}
        >
          <Plus size={24} />
        </div>
      </div>

      {/* Channel list */}
      <div className="w-60 bg-[#1a1a1a] p-4">
        <h2 className="text-yellow-400 font-bold mb-4 flex items-center">
          <Menu className="mr-2" /> {servers.find(s => s.id === selectedServer)?.name}
        </h2>
        <div className="space-y-2">
          {channels
            .filter(channel => channel.serverId === selectedServer)
            .map(channel => (
              <div
                key={channel.id}
                className={`flex items-center text-gray-400 hover:text-white cursor-pointer p-1 rounded ${
                  selectedChannel === channel.id ? 'bg-[#2a2a2a] text-white' : ''
                }`}
                onClick={() => setSelectedChannel(channel.id)}
              >
                <Hash size={20} className="mr-2" /> {channel.name}
              </div>
            ))}
          <div
            className="flex items-center text-gray-400 hover:text-white cursor-pointer p-1 rounded"
            onClick={handleCreateChannel}
          >
            <Plus size={20} className="mr-2" /> Create Channel
          </div>
        </div>
      </div>

      {/* Chat area */}
      <div className="flex-1 flex flex-col">
        <div className="bg-[#1a1a1a] p-4 flex items-center justify-between">
          <div className="flex items-center">
            <Hash size={24} className="mr-2 text-gray-400" />
            <h3 className="font-bold">
              {channels.find(c => c.id === selectedChannel)?.name}
            </h3>
          </div>
          <Settings size={24} className="text-gray-400 hover:text-white cursor-pointer" />
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages
            .filter(message => message.channelId === selectedChannel)
            .map(message => (
              <div key={message.id} className="flex items-start">
                <div className="w-10 h-10 rounded-full bg-yellow-400 mr-4"></div>
                <div>
                  <div className="flex items-center">
                    <span className="font-bold mr-2">{message.user}</span>
                    <span className="text-xs text-gray-400">{message.timestamp}</span>
                  </div>
                  <p>{message.text}</p>
                </div>
              </div>
            ))}
        </div>
        <div className="p-4">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder={`Message #${channels.find(c => c.id === selectedChannel)?.name || 'general'}`}
            className="w-full bg-[#2a2a2a] text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-400"
          />
        </div>
      </div>

      {/* User info */}
      <div className="w-60 bg-[#1a1a1a] p-4 flex items-center">
        <div className="w-10 h-10 rounded-full bg-yellow-400 mr-4"></div>
        <div>
          <div className="font-bold">{user.username}</div>
          <div className="text-sm text-gray-400">{user.tag}</div>
        </div>
        <User 
          size={20} 
          className="ml-auto text-gray-400 hover:text-white cursor-pointer" 
          onClick={() => setIsSettingsOpen(true)}
        />
      </div>

      {/* Settings Modal */}
      {isSettingsOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-[#1a1a1a] p-6 rounded-lg w-96">
            <h3 className="text-xl font-bold mb-4">User Settings</h3>
            <input
              type="text"
              value={user.username}
              onChange={(e) => setUser(prev => ({ ...prev, username: e.target.value }))}
              className="w-full bg-[#2a2a2a] text-white rounded px-4 py-2 mb-4"
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setIsSettingsOpen(false)}
                className="px-4 py-2 rounded hover:bg-[#2a2a2a]"
              >
                Cancel
              </button>
              <button
                onClick={() => setIsSettingsOpen(false)}
                className="bg-yellow-400 text-black px-4 py-2 rounded hover:bg-yellow-500"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
