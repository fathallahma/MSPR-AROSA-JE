import React, { useState, useEffect } from "react";
import { View, TouchableOpacity, Text, Image, TextInput, Button } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { FontAwesome, Entypo } from "@expo/vector-icons";
import colors from "../styles/colors";
import axios from "axios";
import * as ImagePicker from "expo-image-picker";
import Port from "../utils/portServer";
import { useSelector } from "react-redux";
import styles from "../styles/homeStyle";

axios.defaults.baseURL = Port.LOCALHOST_WEB;

const Home = () => {

  const userData = useSelector((state) => state.user);
  const navigation = useNavigation();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);

  useEffect(() => {
    navigation.setOptions({
      title: "Fil d'actualité",
      headerLeft: () => (
        <FontAwesome
          name="search"
          size={24}
          color={colors.gray}
          style={{ marginLeft: 15 }}
        />
      ),
    });
  }, [navigation]);

  const handleChoosePhoto = async () => {
    const { granted } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!granted) {
      alert("Permission to access media library is required!");
      return;
    }
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.cancelled) {
      setImage(result.uri);
    }
  };

  const handlePost = async () => {
    if (image === null ) {
      alert("l'image manque !");
    return;
    }

    try {
        const response = await axios.post("/save-photo", {
          title,
          description,
          image,
          userName: userData.lastName,
          createdAt: new Date(),
          token: userData.token,
        });
        setTitle("");
        setDescription("");
        setImage(null);
        navigation.navigate("Publication");
      } catch (e) {
        console.error("Erreur ajout du document : ", e);
      } 

  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={() => navigation.navigate("Login")}
        style={styles.logOutButton}
      >
        <Entypo name="lock" size={24} color={colors.red} />
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => navigation.navigate("Settings")}
        style={styles.settingsButton}
      >
        <Entypo name="cog" size={24} color={colors.blue} />
      </TouchableOpacity>

      <Text style={styles.welcome}>Bienvenue {userData.firstName}</Text>

      <View style={styles.inputContainer}>
        <TextInput
          placeholder="Titre"
          style={styles.input}
          value={title}
          onChangeText={setTitle}
        />
        <TextInput
          placeholder="Description"
          style={[styles.input, { height: 80 }]}
          value={description}
          onChangeText={setDescription}
        />
        <TouchableOpacity style={styles.button} onPress={handleChoosePhoto}>
          <Text style={styles.buttonText}>Choisir une photo</Text>
        </TouchableOpacity>
        {image && <Image source={{ uri: image }} style={styles.previewImage} />}
        <Button title="Publier" onPress={handlePost} />
      </View>
      <TouchableOpacity
        onPress={() => navigation.navigate("Chat")}
        style={styles.chatButton}
      >
        <Entypo name="chat" size={24} color={colors.green} />
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => navigation.navigate("Publication")}
        style={styles.publicationButton}
      >
        <Entypo name="new-message" size={24} color={colors.green} />
      </TouchableOpacity>
    </View>
  );
};

export default Home;
