import React, { useState, useEffect, useRef } from "react";
import { SafeAreaView, View, Text, TextInput, TouchableOpacity, FlatList } from "react-native";
import axios from "axios";
import Icon from "react-native-vector-icons/FontAwesome";
import Port from "../utils/portServer";
import { useSelector } from "react-redux";
import styles from "../styles/chatStyle";

axios.defaults.baseURL = Port.LOCALHOST_WEB;

const ChatScreen = () => {
  const userData = useSelector((state) => state.user);
  const { token, firstName, lastName } = userData;

  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState("");
  const [messageCounter, setMessageCounter] = useState(0);
  const flatListRef = useRef();

  useEffect(() => {
    axios
      .get(`/messages`)
      .then((response) => {
        setMessages(response.data);
        scrollToBottom();
      })
      .catch((error) => {
        console.error(error);
      });
  }, [messageCounter]);

  useEffect(() => {
    if (messages.length > 0) {
      scrollToBottom();
    }
  }, [messages]);

  const handleSend = () => {
    if (inputText) {
      const message = {
        text: inputText,
        token: token,
        user: `${firstName} ${lastName}`,
      };

      axios
        .post(`/add-message`, message)
        .then((response) => {
          const createdMessage = response.data;
          setMessages((prevMessages) => {
            const updatedMessages = [...prevMessages, createdMessage];
            scrollToBottom(updatedMessages);
            return updatedMessages;
          });
          setInputText("");
          setMessageCounter((prevCounter) => prevCounter + 1);
        })
        .catch((error) => {
          console.error(error);
        });
    }
  };

  const renderItem = ({ item }) => {
    const createdAt = new Date(item.createdAt).toLocaleString("fr-FR", {
      hour: "numeric",
      minute: "numeric",
      second: "numeric",
      year: "numeric",
      month: "numeric",
      day: "numeric",
    });

    const userName = item.User
      ? `${item.User.firstName} ${item.User.lastName}`
      : "Utilisateur inconnu";

    return (
      <View style={styles.messageContainer}>
        <Text style={styles.firstName}>
          <Icon name="circle" size={15} color="#0084ff" /> {userName}
        </Text>
        <Text style={styles.text}>{item.text}</Text>
        <Text style={styles.createdAt}>{createdAt}</Text>
      </View>
    );
  };

  const scrollToBottom = (updatedMessages) => {
    flatListRef.current.scrollToEnd({ animated: true });
  };

  return (
    <View style={{ flex: 1, height: "100%", flexDirection: "column" }}>
      <View style={{ flex: 1 }}>
        <SafeAreaView style={styles.container}>
          <View style={styles.chatContainer}>
            <FlatList
              keyExtractor={(item) => item.id.toString()}
              ref={flatListRef}
              data={messages}
              renderItem={renderItem}
              inverted={false}
            />
          </View>
        </SafeAreaView>
      </View>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Ecrivez votre message ici..."
          value={inputText}
          onChangeText={setInputText}
        />
        <TouchableOpacity style={styles.sendButton} onPress={handleSend}>
          <Text style={styles.sendButtonText}>Envoyer</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ChatScreen;
