import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  TextInput: {
    borderRadius: 30,
    height: 50,
    flex: 1,
    padding: 5,
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
    width: "100%",
  },
  container: {
    flex: 1,
    position: 'relative'
  },
  containerSignUP: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  privacyContainer: {
    position: 'absolute',
    bottom: 0,  
    left: 0,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '5%',
    backgroundColor: 'lightgray',
  },
  
  signUpBtn: {
    width: "80%",
    borderRadius: 25,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 40,
    backgroundColor: "#66D163",
    maxWidth: 500,
  },
  deleteBtn: {
    width: "80%",
    borderRadius: 25,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 40,
    backgroundColor: "#FF3A00",
    maxWidth: 500,
  },
  loginText: {
    fontSize: "larger",
    fontWeight: "bold",
  },
  inputView: {
    backgroundColor: "#A1E79F",
    borderRadius: 30,
    width: "29%",
    height: 55,
    marginBottom: 20,
    alignItems: "center",
    flexDirection: 'row',
    marginTop: 10
    //maxWidth: 400,

  },
  errorStyle: {
    color: 'red',
    paddingTop: '2%'
  },
  showPasswordButton: {
    padding: 10,
    borderLeftWidth: 2, 
    borderLeftColor: "#8FCD8D",
    backgroundColor: "#A1E79F",
    borderTopRightRadius: 30,
    borderBottomRightRadius: 30,
  },
  showPasswordButtonText: {
    color: "#000",
    fontSize: "small",
  },
})