import {
    View,
    Text,
    ScrollView,
    Image,
    StyleSheet,
    TouchableOpacity,
  } from "react-native";
  import React from "react";
  import { useNavigation, useRoute } from "@react-navigation/native";
  import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
  } from "react-native-responsive-screen";
  import { useDispatch, useSelector } from "react-redux";
  import { toggleFavorite } from "../redux/favoritesSlice";
  
  export default function CustomRecipesScreen() {
    const navigation = useNavigation();
    const dispatch = useDispatch();
  
    const route = useRoute();
    const { recipe } = route.params || {}; // recipe object passed from previous screen
    console.log("recipe", recipe);
  
    const favoriteRecipes = useSelector((state) => state.favorites.favoriterecipes);
    console.log("favoriteRecipes from custom", favoriteRecipes);
  
    // Check if this recipe is already favorited (compare by title or another unique field)
    // Note: Custom recipes don't have idFood or idCategory → using title as identifier
    const isFavourite = favoriteRecipes.some(
      (fav) => fav.title === recipe?.title && fav.description === recipe?.description
    );
  
    const handleToggleFavorite = () => {
      if (recipe) {
        dispatch(toggleFavorite(recipe));
      }
    };
  
    if (!recipe) {
      return (
        <View style={styles.container}>
          <Text style={styles.title}>No Recipe Details Available</Text>
        </View>
      );
    }
  
    return (
      <ScrollView
        style={styles.container}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        testID="scrollContent"
      >
        {/* Recipe Image */}
        <View style={styles.imageContainer} testID="imageContainer">
          {recipe.image && (
            <Image
              source={{ uri: recipe.image }}
              style={[
                styles.recipeImage,
                {
                  // Dynamic height based on some index logic (as per instruction)
                  // Since we don't have index here, we can use a fixed or random-like logic
                  // For simplicity, using a large height – adjust if you pass index
                  height: hp(45),
                },
              ]}
            />
          )}
        </View>
  
        {/* Top Buttons: Back + Favorite */}
        <View style={styles.topButtonsContainer} testID="topButtonsContainer">
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backButton}
          >
            <Text style={{ fontWeight: "600" }}>GoBack</Text>
          </TouchableOpacity>
  
          <TouchableOpacity
            onPress={handleToggleFavorite}
            style={styles.favoriteButton}
          >
            <Text style={{ fontSize: hp(3), color: isFavourite ? "red" : "black" }}>
              {isFavourite ? "♥" : "♡"}
            </Text>
          </TouchableOpacity>
        </View>
  
        {/* Recipe Details */}
        <View style={styles.contentContainer} testID="contentContainer">
          <Text style={styles.recipeTitle}>{recipe.title}</Text>
  
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Content</Text>
            <Text style={styles.contentText}>{recipe.description}</Text>
          </View>
        </View>
      </ScrollView>
    );
  }
  
  const styles = StyleSheet.create({
    container: {
      backgroundColor: "white",
      flex: 1,
    },
    scrollContent: {
      paddingBottom: 50,
    },
    imageContainer: {
      flexDirection: "row",
      justifyContent: "center",
    },
    recipeImage: {
      width: wp(98),
      borderRadius: 35,
      borderBottomLeftRadius: 40,
      borderBottomRightRadius: 40,
      marginTop: 4,
    },
    topButtonsContainer: {
      width: "100%",
      position: "absolute",
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingTop: hp(4),
    },
    backButton: {
      padding: 10,
      borderRadius: 50,
      marginLeft: wp(5),
      backgroundColor: "white",
      elevation: 3,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.2,
      shadowRadius: 4,
    },
    favoriteButton: {
      padding: 10,
      borderRadius: 50,
      marginRight: wp(5),
      backgroundColor: "white",
      elevation: 3,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.2,
      shadowRadius: 4,
    },
    contentContainer: {
      paddingHorizontal: wp(4),
      paddingTop: hp(10), // Give space for the absolute top buttons
    },
    recipeTitle: {
      fontSize: hp(3.4),
      fontWeight: "bold",
      color: "#4B5563",
      marginBottom: hp(2),
    },
    sectionContainer: {
      marginBottom: hp(2),
    },
    sectionTitle: {
      fontSize: hp(2.5),
      fontWeight: "bold",
      color: "#4B5563",
      marginBottom: hp(1),
    },
    contentText: {
      fontSize: hp(1.8),
      color: "#4B5563",
      lineHeight: hp(2.8),
      textAlign: "justify",
    },
    title: {
      fontSize: hp(2.8),
      textAlign: "center",
      marginTop: hp(40),
      color: "#6B7280",
    },
  });