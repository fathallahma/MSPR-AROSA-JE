import React, { useState } from "react";
import { View, TouchableOpacity, TextInput, Text } from 'react-native'
import axios from 'axios'
import Status from '../utils/status'
import Port from '../utils/portServer'
import StyleApp from '../styles/styleApp'
import styles from '../styles/settingsStyle';

axios.defaults.baseURL = Port.LOCALHOST_WEB

export default function SettingsAdmin({ navigation }) {
  const [emailToDelete, setEmailToDelete] = useState("");
  const [messageToDelete, setMessageToDelete] = useState("");
  const [idOfPostToDelete, setIdOfPostToDelete] = useState("");
  const [error, setError] = useState('')

  const deleteUserByAdmin = () => {
    axios.delete("/deleteUserByAdmin", { data: { email: emailToDelete } })
      .then(response => {
        if (response.data.status === Status.DELETE_USER) {
          navigation.navigate('HomeAdmin')
        }
      })
      .catch(error => {
        console.log(error)
      })
  }

  const deleteMessageByAdmin = () => {
    axios.delete("/deleteMessageByAdmin", { data: { text: messageToDelete } })
      .then(response => {
        if (response.data.status === Status.DELETE_MESSAGE) {
          navigation.navigate('Chat')
        }
      })
      .catch(error => {
        console.log(error)
      })
  }

  const deletePostByAdmin = () => {

    axios.delete("/deletePostByAdmin", { data: { id: idOfPostToDelete } })
      .then(response => {
        if (response.data.status === Status.DELETE_POST) {
          navigation.navigate('PublicationAdmin')
        }
      })
      .catch(error => {
        console.log(error)
      })
  }

  return (
    <View style={styles.container} >
      <View style={styles.containerSignUP}>
        
        <TouchableOpacity
          style={styles.deleteBtn}
          onPress={() => deleteUserByAdmin()}
        >
        <Text style={styles.loginText}>Supprimer cet utilisateur</Text>
        </TouchableOpacity>
        <TextInput
          style={StyleApp.input}
          placeholder='Un utilisateur à supprimer à travers son email'
          autoCapitalize="none"
          placeholderTextColor='white'
          onChangeText={val => setEmailToDelete(val)}
        />

        <TouchableOpacity
          style={styles.deleteBtn}
          onPress={() => deleteMessageByAdmin()}
        >
        <Text style={styles.loginText}>Supprimer ce message</Text>
        </TouchableOpacity>
        <TextInput
          style={StyleApp.input}
          placeholder='Un message à supprimer à travers son contenu'
          autoCapitalize="none"
          placeholderTextColor='white'
          onChangeText={val => setMessageToDelete(val)}
        />

        <TouchableOpacity
          style={styles.deleteBtn}
          onPress={() => deletePostByAdmin()}
        >
        <Text style={styles.loginText}>Supprimer le post pas son Id</Text>
        </TouchableOpacity>
        <TextInput
          style={StyleApp.input}
          placeholder='Id du post à supprimé'
          autoCapitalize="none"
          placeholderTextColor='white'
          onChangeText={val => setIdOfPostToDelete(val)}
        />

        {error && <Text style={styles.errorStyle}>{error}</Text>}
      </View>
    </View>
  )
}
