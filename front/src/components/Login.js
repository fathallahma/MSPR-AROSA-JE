import React, { useState } from "react";
import PropTypes from "prop-types";
import { Text, View, Image, TextInput, TouchableOpacity } from "react-native";
import Status from "../utils/status";
import Port from "../utils/portServer";
import { useDispatch } from "react-redux";
import { connectUser } from "../store/store";
import axios from "axios";
import styles from "../styles/loginStyle";

export default function Login({ navigation }) {

  const dispatch = useDispatch();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState(null);
  const [showPassword, setShowPassword] = useState(false);

  axios.defaults.baseURL = Port.LOCALHOST_WEB;

  const loginSuccess = (email, password) => {

    axios.post("/login", { email, password })
      .then((response) => {

        if (response.data.status === Status.INVALID_EMAIL_OR_PASSWORD) {
          setErrorMessage("Email ou mot de passe invalide");
        } else if (response.data.status === Status.SUCCESS_AUTHENTIFICATION_USER) {
          
          const { user } = response.data;

          dispatch(connectUser({
            firstName: user.firstName,
            lastName: user.lastName,
            token: user.token,
          }));

          if (user.role == "ROLE_USER"){
            navigation.navigate("Home");
            setErrorMessage(null);

          }else if (user.role == "ROLE_ADMINISTRATOR"){
            navigation.navigate("HomeAdmin");
            setErrorMessage(null);
          }
        }
      })
      .catch((error) => {
        console.log(error.response);
      });
  };

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };
  
  const login = async () => {
    await loginSuccess(email, password);
  };

  return (
    <View style={styles.container}>
      <Image source={require("../assets/arosa-je.png")} style={styles.logo} />

      <View style={styles.inputView}>
        <TextInput
          style={styles.TextInput}
          placeholder="Adresse email"
          placeholderTextColor="#003f5c"
          onChangeText={(email) => setEmail(email)}
        />
      </View>

      <View style={styles.inputView}>
        <TextInput
          style={styles.TextInput}
          placeholder="Mot de passe"
          placeholderTextColor="#003f5c"
          secureTextEntry={!showPassword}
          onChangeText={(password) => setPassword(password)}
        />
        <TouchableOpacity onPress={toggleShowPassword} style={styles.showPasswordButton}>
          <Text style={styles.showPasswordButtonText}>
            {showPassword ? "Cacher" : "Afficher"}
          </Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={styles.mdpBtn}
        onPress={() => navigation.navigate("ForgetPassword")}
      >
        <Text style={styles.loginText}>Mot de passe oublié</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.loginBtn}
        onPress={login}
      >
        <Text style={styles.loginText}>Connexion</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.signUpBtn}
        onPress={() => navigation.navigate("Signup")}
      >
        <Text style={styles.loginText}>Vous n&apos;avez pas de compte?</Text>
      </TouchableOpacity>

      {errorMessage && <Text style={styles.errorStyle}>{errorMessage}</Text>}
    </View>
  );
}

Login.propTypes = {
  navigation: PropTypes.object.isRequired,
};
