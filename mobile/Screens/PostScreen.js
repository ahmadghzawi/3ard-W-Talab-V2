import React, { Component } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Image,
  Dimensions
} from "react-native";
import { vw, vh } from "react-native-expo-viewport-units";
import axios from "axios";

export default class AddPost extends Component {
  state = {
    offer: null,
    pendingOffer: "", // please keep it as ""
    showOffer: false,
    userId: this.props.userId,
    ownerSellerId: this.props.post["sellerID"]
  };

  componentDidMount() {
    this.getOffer();
  }

  getOffer = () => {
    let userId = this.state.userId;
    if (this.props.post[userId] != null) {
      this.setState({ offer: this.props.post[userId].price, showOffer: true });
    }
  };

  makeOffer = pendingOffer => {
    this.setState({ pendingOffer });
  };

  submitOffer = () => {
    this.textInput.clear();
    let buyerId = this.props.userId;
    let id = this.props.post._id;
    let offer = this.state.pendingOffer;
    if (this.state.pendingOffer != "")
      axios
        .get("https://ard-w-talab-version-2.herokuapp.com/posts/API/postOffers", {
          params: {
            id,
            [buyerId]: offer
          }
        })
        .then(res => {
          this.setState({ offer, showOffer: true });
          this.props.getPosts();
        })
        .catch(err => console.log(err));
  };

  render() {
    let { offer, showOffer } = this.state;
    if (this.props.post === undefined) return null;
    let {
      name,
      postCategories,
      location,
      additionalInfo,
      imgUrl
    } = this.props.post;
    let { userId, ownerSellerId } = this.state;

    return (
      <ScrollView>
        <View style={styles.container}>
          <View
            style={{ flexDirection: "row", justifyContent: "space-between" }}
          >
            <Text style={{ fontSize: 27, marginLeft: 20, marginTop: 5 }}>
              {name}
            </Text>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => this.props.isVisible(false)}
            >
              <Text style={{ color: "#4280c8", fontWeight: "400" }}>Back</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.bodyContent}>
            <Image
              source={{ uri: imgUrl }}
              style={{ width: vw(100), height: vh(40) / 1.5 }}
            />
            <View style={styles.textContainer}>
              <Text style={styles.textWrapper}>
                <Text style={styles.text}>Location: </Text>
                {location}
              </Text>
              <Text style={styles.textWrapper}>
                <Text style={styles.text}>Category: </Text>
                {postCategories}
              </Text>
              <Text style={styles.textWrapper}>
                <Text style={styles.text}>Info: </Text>
                {additionalInfo}
              </Text>
              <View
                style={{
                  width: vw(80)
                }}
              />
            </View>
            {userId !== ownerSellerId ? (
              <View
                style={{
                  flex: 1,
                  width: "100%",
                  justifyContent: "center",
                  alignItems: "center"
                }}
              >
                <View
                  style={{
                    width: vw(80),
                    borderTopColor: "black",
                    borderTopWidth: 1,
                    paddingTop: 10
                  }}
                />
                {showOffer === false ? null : (
                  <View style={styles.textWrapper}>
                    <Text style={styles.text}>You have made an offer for </Text>
                    <Text>{offer} JOD</Text>
                  </View>
                )}
                <TextInput
                  style={styles.input}
                  placeholder="  Make an Offer"
                  placeholderTextColor='darkgrey'
                  blurOnSubmit
                  autoCapitalize="none"
                  autoCorrect={false}
                  keyboardType="number-pad"
                  onChangeText={offer => this.makeOffer(offer)}
                  ref={input => (this.textInput = input)}
                ></TextInput>

                <TouchableOpacity
                  style={styles.buttonContainer}
                  onPress={this.submitOffer}
                >
                  <Text style={{ color: "white", fontWeight: "bold" }}>
                    Make Offer!
                  </Text>
                </TouchableOpacity>
              </View>
            ) : (
              <Text style={{ color: "red", marginVertical: 25 }}>
                You've made this post!
              </Text>
            )}
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
    marginTop: 5
  },

  buttonContainer: {
    marginTop: 10,
    height: 40,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
    width: "90%",
    borderRadius: 10,
    backgroundColor: "#00BFFF"
  },

  text: {
    fontSize: 18,
    fontWeight: "bold"
  },

  textWrapper: {
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 15
  },

  textContainer: {
    flex: 1,
    fontSize: 15,
    marginTop: 20,
    marginBottom: 10
  }
});
