import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/router";
import { useAuth } from "@/Contexts/AuthContext";
import { db } from '@/Firebase/firestore';
import { 
  collection, 
  doc, 
  query, 
  where, 
  orderBy, 
  onSnapshot,
  serverTimestamp,
  getDoc,
  updateDoc,
  getDocs,
  addDoc
} from 'firebase/firestore';
import { toast } from 'react-toastify';
import { Send, Search, MoreVertical, User, Loader, MessageCircle } from 'lucide-react';
import Link from 'next/link';

function ChatPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [conversations, setConversations] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const messagesEndRef = useRef(null);

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Check if user is authenticated
  useEffect(() => {
    if (!user?.email) {
      router.push('/login');
      return;
    }
  }, [user, router]);

  // Fetch all users
  useEffect(() => {
    const fetchAllUsers = async () => {
      if (!user?.email) return;

      try {
        const usersQuery = query(collection(db, 'users'));
        const unsubscribe = onSnapshot(usersQuery, (snapshot) => {
          const usersData = snapshot.docs
            .map(doc => ({ id: doc.id, ...doc.data() }))
            .filter(userData => userData.email !== user.email);

          setAllUsers(usersData);
        });
        return unsubscribe;
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchAllUsers();
  }, [user?.email]);

  // Fetch conversations
  useEffect(() => {
    const fetchConversations = async () => {
      if (!user?.email) return;

      try {
        setLoading(true);
        
        // Get all messages where current user is sender
        const sentMessagesQuery = query(
          collection(db, 'messages'),
          where('senderEmail', '==', user.email)
        );

        // Get all messages where current user is receiver
        const receivedMessagesQuery = query(
          collection(db, 'messages'),
          where('toEmail', '==', user.email)
        );

        // Listen to both sent and received messages
        const unsubscribeSent = onSnapshot(sentMessagesQuery, async (snapshot) => {
          const sentMessages = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
          
          // Get received messages
          const receivedSnapshot = await getDocs(receivedMessagesQuery);
          const receivedMessages = receivedSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
          
          await processConversations(sentMessages, receivedMessages);
        });

        const unsubscribeReceived = onSnapshot(receivedMessagesQuery, async (snapshot) => {
          const receivedMessages = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
          
          // Get sent messages
          const sentSnapshot = await getDocs(sentMessagesQuery);
          const sentMessages = sentSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
          
          await processConversations(sentMessages, receivedMessages);
        });

        return () => {
          unsubscribeSent();
          unsubscribeReceived();
        };

        async function processConversations(sentMessages, receivedMessages) {
          // Combine all messages
          const allMessages = [...sentMessages, ...receivedMessages];
          
          // Get unique conversation partners
          const conversationPartners = new Set();
          allMessages.forEach(message => {
            if (message.senderEmail === user.email) {
              conversationPartners.add(message.toEmail);
            } else {
              conversationPartners.add(message.senderEmail);
            }
          });

          // Create conversation objects
          const conversationsData = [];
          for (const partnerEmail of conversationPartners) {
            // Get user data for this partner
            const userDoc = await getDoc(doc(db, 'users', partnerEmail));
            const userData = userDoc.exists() ? userDoc.data() : { email: partnerEmail, name: partnerEmail };
            
            // Get last message with this partner
            const partnerMessages = allMessages.filter(message => 
              (message.senderEmail === user.email && message.toEmail === partnerEmail) ||
              (message.senderEmail === partnerEmail && message.toEmail === user.email)
            );
            
            const lastMessage = partnerMessages.sort((a, b) => 
              (b.timestamp?.toDate?.() || 0) - (a.timestamp?.toDate?.() || 0)
            )[0];

            conversationsData.push({
              partnerEmail,
              partnerData: userData,
              lastMessage: lastMessage?.text || 'No messages yet',
              lastMessageTime: lastMessage?.timestamp,
              unreadCount: partnerMessages.filter(msg => 
                msg.senderEmail === partnerEmail && !msg.read
              ).length
            });
          }

          // Sort by last message time
          conversationsData.sort((a, b) => 
            (b.lastMessageTime?.toDate?.() || 0) - (a.lastMessageTime?.toDate?.() || 0)
          );

          setConversations(conversationsData);
          setLoading(false);
        }

      } catch (error) {
        console.error('Error fetching conversations:', error);
        setLoading(false);
      }
    };

    fetchConversations();
  }, [user?.email]);

  // Fetch messages for selected conversation
  useEffect(() => {
    if (!selectedConversation || !user?.email) return;

    const partnerEmail = selectedConversation.partnerEmail;
    
    // Get messages where current user is sender or receiver
    const sentMessagesQuery = query(
      collection(db, 'messages'),
      where('senderEmail', '==', user.email),
      where('toEmail', '==', partnerEmail)
    );

    const receivedMessagesQuery = query(
      collection(db, 'messages'),
      where('senderEmail', '==', partnerEmail),
      where('toEmail', '==', user.email)
    );

    // Listen to sent messages
    const unsubscribeSent = onSnapshot(sentMessagesQuery, (snapshot) => {
      const sentMessages = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      
      // Get received messages
      getDocs(receivedMessagesQuery).then((receivedSnapshot) => {
        const receivedMessages = receivedSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        
        // Combine and sort all messages
        const allMessages = [...sentMessages, ...receivedMessages].sort((a, b) => 
          (a.timestamp?.toDate?.() || 0) - (b.timestamp?.toDate?.() || 0)
        );
        
        setMessages(allMessages);
      });
    });

    // Listen to received messages
    const unsubscribeReceived = onSnapshot(receivedMessagesQuery, (snapshot) => {
      const receivedMessages = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      
      // Get sent messages
      getDocs(sentMessagesQuery).then((sentSnapshot) => {
        const sentMessages = sentSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        
        // Combine and sort all messages
        const allMessages = [...sentMessages, ...receivedMessages].sort((a, b) => 
          (a.timestamp?.toDate?.() || 0) - (b.timestamp?.toDate?.() || 0)
        );
        
        setMessages(allMessages);
      });
    });

    return () => {
      unsubscribeSent();
      unsubscribeReceived();
    };
  }, [selectedConversation, user?.email]);

  // Mark messages as read
  useEffect(() => {
    if (!selectedConversation || !user?.email || messages.length === 0) return;

    const markAsRead = async () => {
      try {
        const unreadMessages = messages.filter(
          msg => msg.senderEmail !== user.email && !msg.read
        );

        for (const message of unreadMessages) {
          await updateDoc(doc(db, 'messages', message.id), {
            read: true
          });
        }
      } catch (error) {
        console.error('Error marking messages as read:', error);
      }
    };

    markAsRead();
  }, [messages, selectedConversation, user?.email]);

  // Handle sending message
  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || !selectedConversation || !user?.email) return;

    const messageText = input.trim();
    setInput("");

    try {
      const messageData = {
        senderEmail: user.email,
        toEmail: selectedConversation.partnerEmail,
        text: messageText,
        timestamp: serverTimestamp(),
        read: false
      };

      await addDoc(collection(db, 'messages'), messageData);

    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Failed to send message');
      setInput(messageText);
    }
  };

  // Start new conversation with user
  const startNewConversation = (otherUser) => {
    if (!user?.email) return;

    // Check if conversation already exists
    const existingConversation = conversations.find(conv => conv.partnerEmail === otherUser.email);
    if (existingConversation) {
      setSelectedConversation(existingConversation);
      return;
    }

    // Create new conversation object
    const newConversation = {
      partnerEmail: otherUser.email,
      partnerData: otherUser,
      lastMessage: 'No messages yet',
      lastMessageTime: null,
      unreadCount: 0
    };

    setSelectedConversation(newConversation);
  };

  // Filter conversations and users based on search
  const filteredConversations = conversations.filter(conv => 
    conv.partnerData?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    conv.partnerData?.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredUsers = allUsers.filter(userData => 
    userData.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    userData.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!user?.email) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader className="w-8 h-8 animate-spin mx-auto mb-4" />
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex h-screen">
        {/* Sidebar */}
        <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
          {/* Header */}
          <div className="p-4 border-b border-gray-200">
            <h1 className="text-xl font-bold text-gray-800 mb-4">Messages</h1>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
          </div>

          {/* Conversation List */}
          <div className="flex-1 overflow-y-auto">
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <Loader className="w-6 h-6 animate-spin" />
              </div>
            ) : (
              <div>
                {/* Recent Conversations */}
                {filteredConversations.length > 0 && (
                  <div className="p-4">
                    <h3 className="text-sm font-semibold text-gray-500 mb-3">Recent Conversations</h3>
                    {filteredConversations.map((conversation) => (
                      <div
                        key={conversation.partnerEmail}
                        onClick={() => setSelectedConversation(conversation)}
                        className={`flex items-center space-x-3 p-3 rounded-lg cursor-pointer transition-colors ${
                          selectedConversation?.partnerEmail === conversation.partnerEmail ? 'bg-primary text-white' : 'hover:bg-gray-50'
                        }`}
                      >
                        {conversation.partnerData?.photoURL || conversation.partnerData?.img ? (
                          <img
                            src={conversation.partnerData.photoURL || conversation.partnerData.img}
                            alt={conversation.partnerData.name}
                            className="w-10 h-10 rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                            <User className="w-5 h-5 text-gray-600" />
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <h4 className="font-medium truncate">
                              {conversation.partnerData?.name || conversation.partnerData?.email}
                            </h4>
                            {conversation.unreadCount > 0 && (
                              <span className={`text-xs px-2 py-1 rounded-full ${
                                selectedConversation?.partnerEmail === conversation.partnerEmail 
                                  ? 'bg-white/20 text-white' 
                                  : 'bg-primary text-white'
                              }`}>
                                {conversation.unreadCount}
                              </span>
                            )}
                          </div>
                          <p className={`text-sm truncate ${
                            selectedConversation?.partnerEmail === conversation.partnerEmail ? 'text-white/80' : 'text-gray-500'
                          }`}>
                            {conversation.lastMessage}
                          </p>
                        </div>
                        {conversation.lastMessageTime && (
                          <span className={`text-xs ${
                            selectedConversation?.partnerEmail === conversation.partnerEmail ? 'text-white/60' : 'text-gray-400'
                          }`}>
                            {conversation.lastMessageTime.toDate?.()?.toLocaleDateString() || ''}
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {/* All Users */}
                
              </div>
            )}
          </div>
        </div>

        {/* Main Chat Area */}
        <div className="flex-1 flex flex-col">
          {selectedConversation ? (
            <>
              {/* Chat Header */}
              <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  {selectedConversation.partnerData?.photoURL || selectedConversation.partnerData?.img ? (
                    <img
                      src={selectedConversation.partnerData.photoURL || selectedConversation.partnerData.img}
                      alt={selectedConversation.partnerData.name}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                      <User className="w-5 h-5 text-gray-600" />
                    </div>
                  )}
                  <div>
                    <h2 className="font-semibold text-lg">
                      {selectedConversation.partnerData?.name || selectedConversation.partnerData?.email}
                    </h2>
                    <p className="text-sm text-gray-500">
                      {selectedConversation.partnerData?.email}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <span className="text-sm text-gray-500">Online</span>
                </div>
              </div>

              {/* Messages Area */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
                {messages.length === 0 ? (
                  <div className="text-center py-8">
                    <MessageCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-600 mb-2">Start a conversation</h3>
                    <p className="text-gray-500">Send a message to begin chatting</p>
                  </div>
                ) : (
                  messages.map((message) => {
                    const isOwnMessage = message.senderEmail === user.email;
                    const messageTime = message.timestamp?.toDate?.()?.toLocaleTimeString([], { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    }) || '';

                    return (
                      <div
                        key={message.id}
                        className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}
                      >
                        <div className={`max-w-xs lg:max-w-md ${isOwnMessage ? 'order-2' : 'order-1'}`}>
                          <div className={`rounded-2xl px-4 py-2 ${
                            isOwnMessage 
                              ? 'bg-primary text-white' 
                              : 'bg-white border border-gray-200'
                          }`}>
                            <div className="flex items-center space-x-2 mb-1">
                              {!isOwnMessage && (
                                <span className="text-xs font-medium text-gray-600">
                                  {message.senderName || message.senderEmail}
                                </span>
                              )}
                              <span className={`text-xs ${isOwnMessage ? 'text-white/80' : 'text-gray-400'}`}>
                                {messageTime}
                              </span>
                              {isOwnMessage && message.read && (
                                <span className="text-xs text-white/80">✓✓</span>
                              )}
                            </div>
                            <p className="text-sm break-words">{message.text}</p>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input Area */}
              <div className="border-t bg-white p-4">
                <form onSubmit={handleSend} className="flex items-center space-x-3">
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Type your message..."
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    maxLength={500}
                  />
                  <button
                    type="submit"
                    disabled={!input.trim()}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                      input.trim()
                        ? 'bg-primary text-white hover:bg-primary/90'
                        : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    }`}
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </form>
                <p className="text-xs text-gray-400 mt-2 text-center">
                  Press Enter to send • {input.length}/500 characters
                </p>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <MessageCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-600 mb-2">Select a conversation</h3>
                <p className="text-gray-500">Choose a user from the sidebar to start chatting</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ChatPage; 