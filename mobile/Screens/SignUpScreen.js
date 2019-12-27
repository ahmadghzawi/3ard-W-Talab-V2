import React, { Component } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  AsyncStorage
} from "react-native";
import axios from "axios";
import { vh } from "react-native-expo-viewport-units";

export default class SignUp extends Component {
  state = {
    name: "",
    email: "",
    password: "",
    phoneNumber: "",
    resID : null,
    resEmail : null,
    resPhoneNumber : null,
    resName : null,
  };
  signUpHandler = (event, name) => {
    const regexEmail = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/;
    const regexPassword = /^[0-9a-zA-Z]{8,}$/;
    const regexName = /^[a-zA-Z]{3,}$/;
    const regexPhone = /^[0-9]{10,}$/;
    if (name === "name") {
      this.state.name = event;
      if (regexName.test(event)) {
        this.setState({
          name: event
        });
      }
    } else if (name === "email") {
      this.state.email = event;
      if (regexEmail.test(event)) {
        this.setState({
          email: event
        });
      }
    } else if (name === "password") {
      this.state.password = event;
      if (regexPassword.test(event)) {
        this.setState({
          [name]: event
        });
      }
    } else if (name === "phoneNumber") {
      this.state.phoneNumber = event;
      if (regexPhone.test(event)) {
        this.setState({
          [name]: event
        });
      }
    }
  };

  submitHandler = () => {
    if (
      this.state.name != "" &&
      this.state.email != "" &&
      this.state.password != ""
    ) {
      // axios.post('http://192.168.86.33:9002/users/API/new', {
      axios
        .post("https://ardwtalabapp.herokuapp.com/users/API/new", {
          name: this.state.name,
          email: this.state.email,
          password: this.state.password,
          phoneNumber: this.state.phoneNumber
        })
        .then( response => {
          this.setState({
            resID : response.data._id,
            resEmail : response.data.email,
            resPhoneNumber : response.data.phoneNumber,
            resName : response.data.name,
          })
          // await AsyncStorage.setItem("userId", response.data._id);
          // await AsyncStorage.setItem("phoneNumber", response.data.phoneNumber);
          // await AsyncStorage.setItem("username", response.data.name);
          // await AsyncStorage.setItem("email", response.data.email);
        })
        .catch(error => {
          alert(error.message);
        })
        .then(async ()=>{
          await AsyncStorage.setItem("userId", this.state.resID);
          await AsyncStorage.setItem("phoneNumber", this.state.resPhoneNumber);
          await AsyncStorage.setItem("username", this.state.resName);
          await AsyncStorage.setItem("email", this.state.resEmail);
          this.props.isVisibleHandler(false, true);
        })
    }
  };
  render() {
    return (
      <ScrollView>
        <View style={styles.container}>
          <View
            style={{ flexDirection: "row", justifyContent: "space-between" }}
          >
            <Text style={{ fontSize: 27, marginLeft: 20, marginTop: 5 }}>
              Registration
            </Text>
            <TouchableOpacity
              style={styles.backButton}
              onPress={this.props.isVisibleHandler.bind(this, false, false)}
            >
              <Text style={{ color: "#4280c8", fontWeight: "400" }}>
                Cancel
              </Text>
            </TouchableOpacity>
          </View>
          <View style={styles.bodyContent}>
            <TextInput
              style={styles.input}
              placeholder="  Full name"
              placeholderTextColor='darkgrey'
              textContentType="name"
              onChangeText={event => this.signUpHandler(event, "name")}
            ></TextInput>
            <TextInput
              style={styles.input}
              placeholder="  Email Address"
              placeholderTextColor='darkgrey'
              textContentType="emailAddress"
              onChangeText={event => this.signUpHandler(event, "email")}
            ></TextInput>
            <TextInput
              style={styles.input}
              placeholder="  Password"
              placeholderTextColor='darkgrey'
              textContentType="password"
              secureTextEntry={true}
              onChangeText={event => this.signUpHandler(event, "password")}
            ></TextInput>
            <TextInput
              style={styles.input}
              placeholder="  Phone number"
              placeholderTextColor='darkgrey'
              textContentType="telephoneNumber"
              keyboardType="number-pad"
              onChangeText={event => this.signUpHandler(event, "phoneNumber")}
            ></TextInput>
            <TouchableOpacity
              style={styles.buttonContainer}
              onPress={this.submitHandler}
            >
              <Text style={{ color: "white", fontWeight: "bold"}}>Register</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    flex: 1,
    borderRadius: 20,
    marginTop: 40
  },
  bodyContent: {
    flex: 1,
    alignItems: "center"
  },
  backButton: {
    height: 30,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    margin: 10,
    width: 50,
    borderRadius: 10,
    backgroundColor: "#cbdcf0"
  },
  input: {
    lineHeight: 10,
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "gray",
    width: "90%",
    height: 50,
    borderRadius: 15,
    marginTop: vh(3)
  },
  buttonContainer: {
    marginTop: vh(8),
    height: 40,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
    width: "90%",
    borderRadius: 10,
    backgroundColor: "#00BFFF"
  }
});
