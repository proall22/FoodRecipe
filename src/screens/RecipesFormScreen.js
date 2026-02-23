import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    Image,
    StyleSheet,
    ScrollView,
    KeyboardAvoidingView,
    Platform,
  } from "react-native";
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
        console.warn("Please fill in all fields");
        return;
      }
  
      try {
        const newRecipe = {
          title: title.trim(),
          image: image.trim(),
          description: description.trim(),
        };
  
        const existing = await AsyncStorage.getItem("customrecipes");
        let recipes = existing ? JSON.parse(existing) : [];
  
        if (recipeToEdit && typeof recipeIndex === "number") {
          recipes[recipeIndex] = newRecipe;
          if (onrecipeEdited) onrecipeEdited();
        } else {
          recipes.push(newRecipe);
        }
  
        await AsyncStorage.setItem("customrecipes", JSON.stringify(recipes));
        navigation.goBack();
      } catch (error) {
        console.error("Error saving recipe:", error);
      }
    };
  
    return (
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
        keyboardVerticalOffset={Platform.OS === "ios" ? 80 : 20}
      >
        <ScrollView
          style={styles.container}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <TextInput
            placeholder="Title"
            value={title}
            onChangeText={setTitle}
            style={styles.input}
            returnKeyType="next"
          />
  
          <TextInput
            placeholder="Image URL[](https://...)"
            value={image}
            onChangeText={setImage}
            style={styles.input}
            autoCapitalize="none"
            autoCorrect={false}
            keyboardType="url"
            returnKeyType="next"
          />
  
          {image ? (
            <Image
              source={{ uri: image }}
              style={styles.image}
              resizeMode="cover"
            />
          ) : (
            <View style={styles.imagePlaceholderContainer}>
              <Text style={styles.imagePlaceholder}>Image preview will appear here</Text>
            </View>
          )}
  
          <TextInput
            placeholder="Description"
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={6}
            style={[styles.input, styles.descriptionInput]}
            textAlignVertical="top"
          />
  
          <TouchableOpacity onPress={saverecipe} style={styles.saveButton}>
            <Text style={styles.saveButtonText}>Save Recipe</Text>
          </TouchableOpacity>
  
          {/* Extra bottom padding so button isn't hidden under home indicator */}
          <View style={{ height: hp(10) }} />
        </ScrollView>
      </KeyboardAvoidingView>
    );
  }
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "#fff",
    },
    scrollContent: {
      padding: wp(5),
      paddingBottom: hp(15), // important – gives space at bottom
    },
    input: {
      borderWidth: 1,
      borderColor: "#d1d5db",
      borderRadius: 10,
      padding: wp(3.5),
      marginVertical: hp(1.2),
      fontSize: hp(2.1),
      backgroundColor: "#f9fafb",
    },
    descriptionInput: {
      height: hp(18),           // ← reduced from 20 → more space for button
      textAlignVertical: "top",
    },
    image: {
      width: "100%",
      height: hp(28),           // ← slightly reduced from 30
      borderRadius: 12,
      marginVertical: hp(2),
      backgroundColor: "#f3f4f6",
    },
    imagePlaceholderContainer: {
      height: hp(20),
      borderWidth: 1,
      borderColor: "#d1d5db",
      borderRadius: 12,
      marginVertical: hp(2),
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "#f3f4f6",
    },
    imagePlaceholder: {
      color: "#9ca3af",
      fontSize: hp(2),
    },
    saveButton: {
      backgroundColor: "#4F75FF",
      paddingVertical: hp(2.2),
      borderRadius: 12,
      alignItems: "center",
      marginTop: hp(3),
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.15,
      shadowRadius: 6,
      elevation: 4,
    },
    saveButtonText: {
      color: "#fff",
      fontSize: hp(2.3),
      fontWeight: "700",
    },
  });