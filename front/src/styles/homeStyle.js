import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  welcome: {
    fontSize: 30,
    fontWeight: 'bold',
    textAlign: 'center',
    margin: 20,
    color: '#444444',
  },
  inputContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 20,
    width: '90%',
    marginBottom: 20,
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 5,
  },
  input: {
    borderWidth: 0,
    backgroundColor: '#F2F2F2',
    borderRadius: 10,
    padding: 10,
    marginBottom: 20,
    fontSize: 16,
    color: '#444444',
  },
  button: {
    width: '80%',
    borderRadius: 25,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: "center",
    marginTop: 20,
    backgroundColor: '#66D163',
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.5,
    shadowRadius: 2,
    elevation: 5,
    marginBottom: 20,
  },
  buttonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 16,
    textTransform: 'uppercase',
  },
  previewImage: {
    width: '100%',
    height: 300,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    overflow: 'hidden',
    resizeMode: 'contain',
  },
  cameraButton: {
    alignSelf: "center",
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.5,
    shadowRadius: 2,
    elevation: 5,
  },
  cameraIcon: {
    fontSize: 40,
    color: '#00ADEF',
  },
  chatButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
  },
  logOutButton: {
    position: 'absolute',
    top: 10,
    right: 20,
  },
  settingsButton: {
    position: 'absolute',
    top: 10,
    right: 60,
  },
  publicationButton: {
    position: 'absolute',
    bottom: 20,
    left: 20,
  },
})