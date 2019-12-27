import React, { Component } from "react";
import { StyleSheet, Text, View, AsyncStorage } from "react-native";

export default class LandingScreen extends Component {
  async componentDidMount() {
    let user = await AsyncStorage.getItem("userId");
    if (user != null) {
      this.props.navigation.navigate("tabNavigator");
    } else {
      this.props.navigation.navigate("loginStack");
    }
  }

  render() {
    return null;
  }
}
