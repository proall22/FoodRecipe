import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    Image,
    StyleSheet,
    ActivityIndicator,
  } from "react-native";
  import React, { useEffect, useState } from "react";
  import AsyncStorage from "@react-native-async-storage/async-storage";
  import { useNavigation } from "@react-navigation/native";
  import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
  } from "react-native-responsive-screen";
  
  export default function MyRecipeScreen() {
    const navigation = useNavigation();
    const [recipes, setrecipes] = useState([]);
    const [loading, setLoading] = useState(true);
  
    useEffect(() => {
      const fetchrecipes = async () => {
        try {
          const storedRecipes = await AsyncStorage.getItem("customrecipes");
          if (storedRecipes) {
            const parsedRecipes = JSON.parse(storedRecipes);
            setrecipes(parsedRecipes);
          }
        } catch (error) {
          console.error("Error fetching custom recipes:", error);
        } finally {
          setLoading(false);
        }
      };
  
      fetchrecipes();
    }, []);
  
    const handleAddrecipe = () => {
      navigation.navigate("RecipesFormScreen", {
        recipeToEdit: null,
        recipeIndex: null,
        onrecipeEdited: () => {
          // Optional: refresh list after edit/add
          // You can call fetchrecipes() again here if needed
        },
      });
    };
  
    const handlerecipeClick = (recipe) => {
      navigation.navigate("CustomRecipesScreen", { recipe });
    };
  
    const deleterecipe = async (index) => {
      try {
        const updatedrecipes = [...recipes];
        updatedrecipes.splice(index, 1);
        await AsyncStorage.setItem("customrecipes", JSON.stringify(updatedrecipes));
        setrecipes(updatedrecipes);
      } catch (error) {
        console.error("Error deleting recipe:", error);
      }
    };
  
    const editrecipe = (recipe, index) => {
      navigation.navigate("RecipesFormScreen", {
        recipeToEdit: recipe,
        recipeIndex: index,
        onrecipeEdited: () => {
          // Optional: refresh list after edit
          // You can call fetchrecipes() again here if needed
        },
      });
    };
  
    return (
      <View style={styles.container}>
        {/* Back Button */}
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backButtonText}>Back</Text>
        </TouchableOpacity>
  
        <TouchableOpacity onPress={handleAddrecipe} style={styles.addButton}>
          <Text style={styles.addButtonText}>Add New Recipe</Text>
        </TouchableOpacity>
  
        {loading ? (
          <ActivityIndicator size="large" color="#f59e0b" style={{ marginTop: hp(20) }} />
        ) : (
          <ScrollView contentContainerStyle={styles.scrollContainer}>
            {recipes.length === 0 ? (
              <Text style={styles.norecipesText}>No recipes added yet.</Text>
            ) : (
              recipes.map((recipe, index) => (
                <View key={index} style={styles.recipeCard} testID="recipeCard">
                  <TouchableOpacity
                    testID="handlerecipeBtn"
                    onPress={() => handlerecipeClick(recipe)}
                  >
                    {recipe.image && (
                      <Image
                        source={{ uri: recipe.image }}
                        style={styles.recipeImage}
                        resizeMode="cover"
                      />
                    )}
  
                    <Text style={styles.recipeTitle}>{recipe.title}</Text>
  
                    <Text style={styles.recipeDescription} testID="recipeDescp">
                      {recipe.description && recipe.description.length > 50
                        ? `${recipe.description.substring(0, 50)}…`
                        : recipe.description || "No description available"}
                    </Text>
                  </TouchableOpacity>
  
                  {/* Edit and Delete Buttons */}
                  <View style={styles.actionButtonsContainer} testID="editDeleteButtons">
                    <TouchableOpacity
                      style={styles.editButton}
                      onPress={() => editrecipe(recipe, index)}
                    >
                      <Text style={styles.editButtonText}>Edit</Text>
                    </TouchableOpacity>
  
                    <TouchableOpacity
                      style={styles.deleteButton}
                      onPress={() => deleterecipe(index)}
                    >
                      <Text style={styles.deleteButtonText}>Delete</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ))
            )}
          </ScrollView>
        )}
      </View>
    );
  }
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: wp(4),
      backgroundColor: "#F9FAFB",
    },
    backButton: {
      marginBottom: hp(1.5),
      alignSelf: "flex-start",
    },
    backButtonText: {
      fontSize: hp(2.2),
      color: "#4F75FF",
      fontWeight: "600",
    },
    addButton: {
      backgroundColor: "#4F75FF",
      paddingVertical: hp(1.5),
      paddingHorizontal: wp(6),
      alignItems: "center",
      borderRadius: 8,
      marginBottom: hp(2.5),
      alignSelf: "center",
    },
    addButtonText: {
      color: "#fff",
      fontWeight: "600",
      fontSize: hp(2.2),
    },
    scrollContainer: {
      paddingBottom: hp(10),
    },
    norecipesText: {
      textAlign: "center",
      fontSize: hp(2.2),
      color: "#6B7280",
      marginTop: hp(20),
    },
    recipeCard: {
      backgroundColor: "#fff",
      padding: wp(4),
      borderRadius: 12,
      marginBottom: hp(2.5),
      shadowColor: "#000",
      shadowOpacity: 0.1,
      shadowRadius: 6,
      shadowOffset: { width: 0, height: 3 },
      elevation: 4,
    },
    recipeImage: {
      width: "100%",
      height: hp(22),
      borderRadius: 10,
      marginBottom: hp(1.5),
    },
    recipeTitle: {
      fontSize: hp(2.3),
      fontWeight: "700",
      color: "#111827",
      marginBottom: hp(0.8),
    },
    recipeDescription: {
      fontSize: hp(1.85),
      color: "#6B7280",
      lineHeight: hp(2.6),
      marginBottom: hp(1.8),
    },
    actionButtonsContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginTop: hp(1),
    },
    editButton: {
      backgroundColor: "#34D399",
      paddingVertical: hp(1.2),
      paddingHorizontal: wp(6),
      borderRadius: 8,
      flex: 1,
      marginRight: wp(2),
      alignItems: "center",
    },
    editButtonText: {
      color: "#fff",
      fontWeight: "600",
      fontSize: hp(1.9),
    },
    deleteButton: {
      backgroundColor: "#EF4444",
      paddingVertical: hp(1.2),
      paddingHorizontal: wp(6),
      borderRadius: 8,
      flex: 1,
      marginLeft: wp(2),
      alignItems: "center",
    },
    deleteButtonText: {
      color: "#fff",
      fontWeight: "600",
      fontSize: hp(1.9),
    },
  });