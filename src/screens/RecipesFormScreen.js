import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet } from "react-native";
import React, { useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

export default function RecipesFormScreen({ route, navigation }) {
  const { recipeToEdit, recipeIndex, onrecipeEdited } = route.params || {};

  const [title, setTitle] = useState(recipeToEdit ? recipeToEdit.title : "");
  const [image, setImage] = useState(recipeToEdit ? recipeToEdit.image : "");
  const [description, setDescription] = useState(
    recipeToEdit ? recipeToEdit.description : ""
  );

  const saverecipe = async () => {
    if (!title.trim() || !image.trim() || !description.trim()) {
      // You could add an alert here in a real app
      console.warn("Please fill in all fields");
      return;
    }

    try {
      // Create the new/updated recipe object
      const newRecipe = {
        title: title.trim(),
        image: image.trim(),
        description: description.trim(),
        // You can add createdAt or id if needed in the future
      };

      // Get existing recipes from AsyncStorage
      const existingRecipesJson = await AsyncStorage.getItem("customrecipes");
      let recipes = existingRecipesJson ? JSON.parse(existingRecipesJson) : [];

      if (recipeToEdit && typeof recipeIndex === "number") {
        // Editing an existing recipe
        recipes[recipeIndex] = newRecipe;
        // Optional: call callback if provided (useful if parent needs to refresh)
        if (onrecipeEdited) {
          onrecipeEdited();
        }
      } else {
        // Adding a new recipe
        recipes.push(newRecipe);
      }

      // Save updated list back to AsyncStorage
      await AsyncStorage.setItem("customrecipes", JSON.stringify(recipes));

      // Navigate back after successful save
      navigation.goBack();
    } catch (error) {
      console.error("Error saving recipe:", error);
      // In a real app, show an alert to the user
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Title"
        value={title}
        onChangeText={setTitle}
        style={styles.input}
      />
      <TextInput
        placeholder="Image URL"
        value={image}
        onChangeText={setImage}
        style={styles.input}
      />
      {image ? (
        <Image source={{ uri: image }} style={styles.image} />
      ) : (
        <Text style={styles.imagePlaceholder}>Upload Image URL</Text>
      )}
      <TextInput
        placeholder="Description"
        value={description}
        onChangeText={setDescription}
        multiline={true}
        numberOfLines={4}
        style={[styles.input, { height: hp(20), textAlignVertical: "top" }]}
      />
      <TouchableOpacity onPress={saverecipe} style={styles.saveButton}>
        <Text style={styles.saveButtonText}>Save recipe</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: wp(4),
  },
  input: {
    marginTop: hp(4),
    borderWidth: 1,
    borderColor: "#ddd",
    padding: wp(3),
    marginVertical: hp(1),
    borderRadius: 8,
    fontSize: hp(2),
  },
  image: {
    width: "100%",
    height: hp(30),
    marginVertical: hp(2),
    borderRadius: 12,
    resizeMode: "cover",
  },
  imagePlaceholder: {
    height: hp(20),
    justifyContent: "center",
    alignItems: "center",
    marginVertical: hp(2),
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 12,
    textAlign: "center",
    fontSize: hp(2),
    color: "#888",
  },
  saveButton: {
    backgroundColor: "#4F75FF",
    padding: hp(2),
    alignItems: "center",
    borderRadius: 8,
    marginTop: hp(3),
  },
  saveButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: hp(2.2),
  },
});