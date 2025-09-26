// frontend\src\components\0.messaging\Messaging.jsx
import React, { useMemo, useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope, faPlus, faPaperPlane } from "@fortawesome/free-solid-svg-icons";
import useChatInterfaceStore from "../../store/left-lower-content/0.messaging/1.chatInterfaceStore";
import useContactListStore from "../../store/left-lower-content/0.messaging/2.contactListStore";
import useLeftConversationsStore from "../../store/left-lower-content/0.messaging/3.leftConversationsStore";
import { useLayoutSettingsStore } from '../../store/left-lower-content/0.layout-settings/layoutSettingsStore';
import ToastNotification from '../../components/toast-notification/ToastNotification';
import useLoginStore from '../../store/loginStore';
import API_URL from '../../configs/config';
import { ENABLE_CONSOLE_LOGS } from '../../configs/config';
import "./Messaging.css"; 

// const CURRENT_USER = "Maricar Aquino";
// const TO_USER = "Maricar Aquino";

const ChatInterface = () => {
  // Fetching organization from the store using a callback
  const organization = useLayoutSettingsStore((state) => state.organization);
  const { messages, addMessage } = useChatInterfaceStore();
  const { contacts } = useContactListStore();
  const { savedContacts, addSavedContact } = useLeftConversationsStore();
  const { setMessages } = useChatInterfaceStore();
  const user = useLoginStore((state) => state.user);
  const setContacts = useContactListStore((state) => state.setContacts);
  const setSavedContacts = useLeftConversationsStore((state) => state.setSavedContacts);
  const [toastMessage, setToastMessage] = useState('');
  const [isToastVisible, setIsToastVisible] = useState(false);
  const [loading, setLoading] = useState(false); // Loading state for spinner


//   const [activeChatName, setActiveChatName] = useState(user?.fullname ?? 'Guest');
  const [activeChatName, setActiveChatName] = useState(
    savedContacts.length > 0 ? savedContacts[0].sender : ''
  );

  const [input, setInput] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedContactId, setSelectedContactId] = useState(null);


  // Handle selecting a conversation
  const handleSelectConversation = (name) => {
      setActiveChatName(name);
      console.log("📢 Selected conversation:", name);
  };

  // Function to show toast notification
  const showToast = (message) => {
    setToastMessage(message);
    setIsToastVisible(true);
    setTimeout(() => {
      setIsToastVisible(false); // Hide the toast after 5 seconds
    }, 5000); // 5 seconds
  };

// Always return array for safe length check
const activeContact = savedContacts?.find(
    (c) => c.sender === activeChatName
  );
  
  const hasActiveContact = !!activeContact; // true if found

  const sendMessage = () => {
    if (!input.trim()) return;

    const newMessage = {
      sender: user?.fullname,
      receipt: activeChatName,
      content: input,
      datetime: new Date().toLocaleString(),
    };

    console.log("🚀 Sending new message:", newMessage);
    addMessage(newMessage);
    setInput("");
  };

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => {
    setSelectedContactId(null);
    setIsModalOpen(false);
  };

  // const handleAddContact = () => {
  //   const selected = contacts.find((c) => c.id === selectedContactId);
  //   if (selected) {
  //     addSavedContact({ sender: selected.name, uid: selected.u_id});
  //     console.log("📇 Selected contact to add:", selected);
  //   } else {
  //     console.log("⚠ No contact selected");
  //   }
  //   closeModal();
  // };


  const handleAddContact = () => {
    setLoading(true); // Show loading indicator

    setTimeout(async () => {
      setLoading(false); // Hide loading indicator after request

      const selected = contacts.find((c) => c.id === selectedContactId);

      if (selected) {
        ENABLE_CONSOLE_LOGS && console.log('Selected contact:', JSON.stringify(selected, null, 2));

        // Retrieve the current left conversations data
        const storedData = localStorage.getItem('leftConversationsData');

        try {
          let conversationData = [];

          if (storedData) {
            // Parse the existing leftConversationsData
            const parsedData = JSON.parse(storedData);

            // Append the new contact to the left conversations data
            conversationData = [
              ...parsedData,
              {
                id: parsedData.length + 1, // Generate new ID for the new conversation
                sender: selected.name,
                uid: selected.u_id,
              },
            ];

            ENABLE_CONSOLE_LOGS && console.log('Updated left conversations data:', conversationData);
          } else {
            // If no data in localStorage, create a new array
            conversationData = [
              {
                id: 1,
                sender: selected.name,
                uid: selected.u_id,
              },
            ];
          }

          // Save the updated data to localStorage
          localStorage.setItem('leftConversationsData', JSON.stringify(conversationData));

          // Now send the updated data to the backend
          try {
            // Fetch CSRF token
            const csrfRes = await fetch(`${API_URL}/csrf-token`, {
              credentials: 'include', // Include cookies
            });

            const { csrf_token } = await csrfRes.json();

            // Send the updated conversation data to the backend
            const response = await fetch(`${API_URL}/v1/left-conversations/add`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'X-CSRF-TOKEN': csrf_token, // Use the CSRF token in the request header
              },
              credentials: 'include', // Include cookies in the request
              body: JSON.stringify({
                fullname: selected.name, // Full name of the contact
                sender: selected.name, // Sender's name
                uid: selected.u_id, // Unique identifier
              }),
            });

            const data = await response.json();
            ENABLE_CONSOLE_LOGS && console.log('Left conversations updated response:', data);

            if (response.ok) {
              // Show success message in the toast notification
              showToast('Left conversation added successfully!');
            } else {
              // Show error message in the toast notification
              showToast('Failed to add left conversation.');
              console.error('Failed to add left conversation:', data.message || 'Unknown error');
            }
          } catch (error) {
            showToast('Error updating left conversations.');
            console.error('Error updating left conversations:', error);
          }
        } catch (err) {
          ENABLE_CONSOLE_LOGS && console.error('Error parsing leftConversationsData on save:', err);
        }
      } else {
        console.log('⚠ No contact selected');
      }

      closeModal(); // Close the modal after operation completes
    }, 1000); // Simulate delay
  };
  



  const lastMessageByContact = useMemo(() => {
    const map = {};
    for (const m of messages) {
      const parties = [m.sender, m.receipt];
      for (const person of parties) {
        if (!map[person] || m.id > map[person].id) map[person] = m;
      }
    }
    return map; // { 'Name': lastMessageObj }
  }, [messages]);

  // Fetch Messages Data
  useEffect(() => {
    if (!user?.fullname || !activeChatName) return;
  
    const fetchMessages = async () => {
      try {
        const response = await fetch(
          `${API_URL}/v1/messages?fullname=${encodeURIComponent(
            user.fullname
          )}&sender=${encodeURIComponent(activeChatName)}`,
          {
            method: 'GET',
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json',
            },
            credentials: 'include',
          }
        );
  
        const data = await response.json();
  
        if (response.ok) {
          if (Array.isArray(data)) {
            ENABLE_CONSOLE_LOGS &&
              console.log('💬 Messages for chat:', activeChatName, data);
            setMessages(data);  // data could be [] or populated
          } else {
            // If backend returns something else (e.g. object with error), clear messages
            console.warn('⚠️ Messages response not an array, resetting messages');
            setMessages([]);
          }
        } else {
          console.error('❌ Error loading messages:', data?.message);
          setMessages([]); // Clear messages on error
        }
      } catch (error) {
        console.error('❗ Fetch error:', error);
        setMessages([]); // Clear messages on fetch error
      }
    };
  
    fetchMessages();
  }, [activeChatName, user?.fullname, setMessages]);

  
  // Fecth Contact List Data
  useEffect(() => {
    const fetchContacts = async () => {

      try {
        const response = await fetch(`${API_URL}/v1/contact-list?organization=${encodeURIComponent(organization)}`, {
          method: 'GET',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          credentials: 'include',
        });
  
        const data = await response.json();
  
        if (response.ok && Array.isArray(data)) {
          ENABLE_CONSOLE_LOGS && console.log('📇 Full Contact List:', data);
          setContacts(data);
        } else {
          console.error('Failed to load contact list:', data?.message);
        }
      } catch (error) {
        console.error('Fetch error:', error);
      }
    };
  
    fetchContacts();
  }, [setContacts]);
  

  // Fetch Conversation List Data
  useEffect(() => {
    if (!user?.fullname) return;

    const fetchSavedContacts = async () => {
      try {
        const response = await fetch(
          `${API_URL}/v1/left-conversations?fullname=${encodeURIComponent(user.fullname)}`,
          {
            method: 'GET',
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json',
            },
            credentials: 'include',
          }
        );

        const data = await response.json();

        if (response.ok && Array.isArray(data)) {
          ENABLE_CONSOLE_LOGS && console.log('💬 Saved Conversations fetched:', data);
          setSavedContacts(data);
        } else {
          console.error('❌ Error loading saved contacts:', data?.message);
        }
      } catch (error) {
        console.error('❗ Fetch error:', error);
      }
    };

    fetchSavedContacts();
  }, [user?.fullname, setSavedContacts]);

  return (
    <>
    {/* <div className="flex bg-gray-100 w-[1120px] h-[540px] border border-gray-300 rounded-lg overflow-hidden"> */}
    <div className="flex bg-gray-100 w-full h-[calc(100vh-7.5rem)] border border-gray-300 rounded-lg overflow-hidden">
        {/* Left Conversations Panel */}
        <div className="w-1/4 bg-white border-r flex flex-col">
          <div className="flex justify-between items-center p-4 border-b">
            <h2 className="font-semibold">Conversations</h2>
            <button
              onClick={openModal}
              className="bg-transparent text-black rounded-full w-8 h-8 flex items-center justify-center text-lg"
              title="Add Contact"
            >
              <FontAwesomeIcon icon={faPlus} />
            </button>
          </div>

          {/* <div className="flex-1 overflow-y-auto">
            {savedContacts.map((c) => {
              const lm =
                lastMessageByContact[c.sender] ||
                lastMessageByContact[c.uid] ||
                null;
              return (
                <div
                  key={`${c.id}-${c.sender}`}
                  className="p-4 hover:bg-gray-100 cursor-pointer border-b"
                >
                  <div className="font-medium">{c.sender}</div>
                  <div className="text-sm text-gray-500 truncate">
                    {lm ? lm.content : "-"}
                  </div>
                  <div className="text-xs text-gray-400 mt-1">
                    {lm ? lm.datetime : ""}
                  </div>
                </div>
              );
            })}
            {savedContacts.length === 0 && (
              <div className="p-4 text-sm text-gray-500">No conversations</div>
            )}
          </div> */}

        <div className="flex-1 overflow-y-auto conversation-list">
            {savedContacts.map((c) => {
            const lm =
                lastMessageByContact[c.sender] ||
                lastMessageByContact[c.uid] ||
                null;
            return (
                <div
                key={`${c.id}-${c.sender}`}
                className={`p-4 hover:bg-gray-100 cursor-pointer border-b ${
                    activeChatName === c.sender ? "bg-gray-200" : ""
                }`}
                onClick={() => handleSelectConversation(c.sender)}
                >
                <div className="font-medium">{c.sender}</div>
                {/* <div className="text-sm text-gray-500 truncate">
                    {lm ? lm.content : "-"}
                </div>
                <div className="text-xs text-gray-400 mt-1">
                    {lm ? lm.datetime : ""}
                </div> */}
                </div>
            );
            })}
            {savedContacts.length === 0 && (
            <div className="p-4 text-sm text-gray-500">No conversations</div>
            )}
        </div>

        </div>

        {/* Chat Panel */}
        <div className="flex-1 flex flex-col">
          {/* Header */}
          <div className="flex items-center p-4 border-b bg-white">
            <div className="bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold">
                {activeChatName.charAt(0)}
            </div>
            <span className="ml-2 font-semibold">{activeChatName}</span>
          </div>

            {/* Messages */}
            <div className="flex-1 flex flex-col">
            {savedContacts.length === 0 ? (
                <div className="flex items-center justify-center h-full text-gray-500">
                No messages
                </div>
            ) : (
                <div className="flex-1 p-4 space-y-4 overflow-y-auto">
                {messages.map((msg) => (
                    <div
                    key={msg.id}
                    className={`flex ${
                        msg.sender === user?.fullname ? "justify-end" : "justify-start"
                    }`}
                    >
                    {msg.sender !== user?.fullname ? (
                        <div className="bg-gray-200 text-gray-900 px-3 py-2 rounded-lg max-w-xs">
                        {msg.content}
                        <div className="text-xs text-gray-500 mt-1">
                            {msg.datetime}
                        </div>
                        </div>
                    ) : (
                        <div className="bg-blue-500 text-white px-3 py-2 rounded-lg max-w-xs">
                        {msg.content}
                        <div className="text-xs text-blue-200 mt-1">
                            {msg.datetime}
                        </div>
                        </div>
                    )}
                    </div>
                ))}
                </div>
            )}
            </div>


          {/* Input */}
          <div className="p-4 border-t flex items-center bg-white">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your message..."
              disabled={!hasActiveContact}
              className={`flex-1 border rounded-lg px-3 py-2 focus:outline-none focus:ring focus:ring-blue-300 ${
                !hasActiveContact ? "bg-gray-100 cursor-not-allowed" : ""
              }`}
            />
            <button
              onClick={sendMessage}
              disabled={!hasActiveContact}
              className={`ml-2 p-3 rounded-full flex items-center justify-center ${
                !hasActiveContact
                  ? "bg-gray-300 cursor-not-allowed"
                  : "bg-blue-500 hover:bg-blue-600"
              }`}
              title={!hasActiveContact ? "No messages" : "Send"}
            >
              <FontAwesomeIcon
                icon={faPaperPlane}
                className={!hasActiveContact ? "text-gray-500" : "text-black"}
              />
            </button>
          </div>




        </div>
    
      </div>

      {/* Modal + Transparent Overlay */}
        {isModalOpen && (
        <div
            className="modal-overlay-add-contact z-40 flex items-center justify-center"
            onClick={closeModal}
        >
            <div
            className="bg-white p-6 rounded-lg shadow-lg w-96"
            onClick={(e) => e.stopPropagation()} // stops closing when clicking inside
            >
            <h2 className="text-lg font-semibold mb-4">Add Contact</h2>

            <select
                value={selectedContactId || ""}
                onChange={(e) => setSelectedContactId(Number(e.target.value))}
                className="w-full border rounded px-3 py-2 mb-4"
            >
                <option value="">-- Select a contact --</option>
                {contacts.map((contact) => (
                <option key={contact.id} value={contact.id}>
                    {contact.name}
                </option>
                ))}
            </select>

            <div className="horizontal-box">
                <button onClick={handleAddContact} className="modal-add-contact-btn">
                Add
                </button>
                <button onClick={closeModal} className="modal-close-contact-btn">
                Close
                </button>
            </div>
            </div>
        </div>
      )}

      {/* Display Toast Notification */}
      <ToastNotification
        message={toastMessage}
        isVisible={isToastVisible}
        onClose={() => setIsToastVisible(false)}
      />

    </>
  );
};

export default ChatInterface;
