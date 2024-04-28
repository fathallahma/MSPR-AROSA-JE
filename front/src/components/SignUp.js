import React, { useState } from "react";
import { View, TouchableOpacity, TextInput, Text } from "react-native";
import PropTypes from "prop-types";
import { useDispatch } from 'react-redux';
import { connectUser } from "../store/store";
import axios from "axios";
import Status from "../utils/status";
import Port from "../utils/portServer";
import StyleApp from "../styles/styleApp";
import styles from "../styles/signUpStyle";
import ViewPrivacy from "./ViewPrivacy";

axios.defaults.baseURL = Port.LOCALHOST_WEB;

const SignUp = ({ navigation }) => {

  const dispatch = useDispatch();
  
  const [state, setState] = useState({
    lastName: "",
    firstName: "",
    password: "",
    email: "",
    errorMessage: "",
    showPassword: false,
  });

  const onChangeText = (key, val) => {
    setState({ ...state, [key]: val });
  };

  const toggleShowPassword = () => {
    setState({ ...state, showPassword: !state.showPassword });
  };

  const createUser = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\w\s]).{8,20}$/;

    const user = {
      lastName: state.lastName,
      firstName: state.firstName,
      email: state.email,
      password: state.password,
    };

    if (!user.lastName || !user.firstName || !user.email || !user.password) {
      setState({ ...state, errorMessage: "Veuillez compléter tous les champs" });
      return;
    }
    if (!emailRegex.test(user.email)) {
      setState({ ...state, errorMessage: "Le format de l'email est invalide" });
      return;
    }
    if (!passwordRegex.test(user.password)) {
      setState({
        ...state,
        errorMessage: `
        Le mot de passe doit respecter les conditions suivantes :\n
          - Avoir une longueur comprise entre 8 et 20 caracteres alphanumériques (sans accents).\n 
          - Contenir au moins 1 lettre MAJUSCULE.\n
          - Contenir au moins 1 lettre minuscule.\n
          - Contenir au moins 1 chiffre.\n
          - Contenir au moins 1 caractère spécial de la liste suivante : *S@&000=#.!?+/£€%\n
        `,
      });
      return;
    }

    axios.post("/create-user", user)
      .then((response) => {
        if (response.data.status === Status.USER_ALREADY_EXISTS) {
          setState({ ...state, errorMessage: "Utilisateur déjà existant" });
        } else if (response.data.status === Status.CREATE_USER) {

          const createdUser = response.data.user;

          // Mettez à jour le store Redux avec les informations du nouvel utilisateur
          dispatch(connectUser({
            lastName: createdUser.lastName,
            firstName: createdUser.firstName,
            token: createdUser.token,
          }));

          navigation.navigate("Home");
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <View style={styles.container}>
      <View style={styles.containerSignUP}>
        <TextInput
          style={StyleApp.input}
          placeholder="Nom"
          autoCapitalize="none"
          placeholderTextColor="white"
          onChangeText={(val) => onChangeText("lastName", val)}
        />
        <TextInput
          style={StyleApp.input}
          placeholder="Prénom"
          autoCapitalize="none"
          placeholderTextColor="white"
          onChangeText={(val) => onChangeText("firstName", val)}
        />
        <TextInput
          style={StyleApp.input}
          placeholder="E-mail"
          autoCapitalize="none"
          placeholderTextColor="white"
          onChangeText={(val) => onChangeText("email", val)}
        />
        <View style={styles.inputView}>
          <TextInput
            style={StyleApp.input}
            placeholder="Mot de passe"
            secureTextEntry={!state.showPassword}
            autoCapitalize="none"
            placeholderTextColor="white"
            onChangeText={(val) => onChangeText("password", val)}
          />
          <TouchableOpacity onPress={toggleShowPassword} style={styles.showPasswordButton}>
            <Text style={styles.showPasswordButtonText}>
              {state.showPassword ? "Cacher" : "Afficher"}
            </Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity
          style={styles.signUpBtn}
          onPress={() => createUser()}
        >
          <Text style={styles.loginText}>Inscription</Text>
        </TouchableOpacity>

        {state.errorMessage ? (
          <Text style={styles.errorStyle}>{state.errorMessage}</Text>
        ) : null}
      </View>
      <View style={styles.privacyContainer}>
        <ViewPrivacy navigation={navigation} />
      </View>
    </View>
  );
};

SignUp.propTypes = {
  navigation: PropTypes.object.isRequired,
};

export default SignUp;
