import React, { useState } from "react";
import { IconButton, Spinner } from "@chakra-ui/react";
import { FiHeart } from "react-icons/fi"; // Coeur vide (non favori)
import { FaHeart } from "react-icons/fa"; // Coeur plein (favori)

// On importe tes deux services
import { toggleFavori as toggleRecetteFavori } from "../../services/RecettesService";
import { toggleFavori as toggleVideoFavori } from "../../services/RessourcesService";

const FavoriteButton = ({ itemId, type, isInitiallyFavorite = false }) => {
  // État local pour savoir si le coeur est plein ou vide
  const [isFavori, setIsFavori] = useState(isInitiallyFavorite);
  const [isLoading, setIsLoading] = useState(false);

  // Vérification de la session
  const isLoggedIn = !!localStorage.getItem("authToken");

  const handleToggle = async (e) => {
    // empêche le clic de déclencher le lien de la carte entière
    e.preventDefault(); 
    e.stopPropagation();

    if (!isLoggedIn) {
      alert("Vous devez être connecté pour ajouter un favori !");
      return;
    }

    setIsLoading(true);

    try {
      // On appelle le bon service selon la propriété "type" passée au bouton
      if (type === "recette") {
        await toggleRecetteFavori(itemId);
      } else if (type === "video") {
        await toggleVideoFavori(itemId);
      }
      
      // La requête a réussi : on inverse l'état visuel du coeur
      setIsFavori(!isFavori);
      
    } catch (error) {
      console.error(`Erreur lors de l'ajout aux favoris (${type}):`, error);
      alert("Une erreur est survenue lors de l'ajout aux favoris.");
    } finally {
      setIsLoading(false);
    }
  };

  // Si l'utilisateur n'est pas connecté, le bouton n'apparaît pas
  if (!isLoggedIn) return null;

  return (
    <IconButton
      aria-label="Ajouter aux favoris"
      onClick={handleToggle}
      disabled={isLoading}
      bg="white"
      color="brand.rouge"
      borderRadius="full"
      boxShadow="md"
      w="40px"
      h="40px"
      _hover={{ transform: "scale(1.1)", bg: "gray.50" }}
      transition="all 0.2s"
      position="absolute"
      top="12px"
      right="12px"
      zIndex="10"
    >
      {isLoading ? (
        <Spinner size="sm" color="brand.rouge" />
      ) : isFavori ? (
        <FaHeart size={20} />
      ) : (
        <FiHeart size={20} />
      )}
    </IconButton>
  );
};

export default FavoriteButton;