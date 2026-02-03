import React, { useState, useEffect } from "react";
import { Box, Container, Heading, Text, Flex, Spinner, Center, Link } from "@chakra-ui/react";
import { Link as RouterLink } from "react-router-dom";
import ActualityCard from "./ActualityCard";
import defaultImg from "../assets/laboCard.png"; 

const Actuality = () => {
  const [actualities, setActualities] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/actualites/all");
        if (!response.ok) throw new Error("Erreur réseau");
        const data = await response.json();
        setActualities(data);
      } catch (err) {
        console.error("Erreur de chargement des actus:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchNews();
  }, []);

  if (isLoading) {
    return (
      <Box as="section" bg="brand.beige" py="84px">
        <Center><Spinner size="xl" color="brand.rouge" /></Center>
      </Box>
    );
  }

  return (
    <Box as="section" bg="brand.beige" pb="84px">
      <Container maxW="1500px">
        
        <Box textAlign="center" mb="84px">
          <Heading 
            color="brand.rouge" 
            fontFamily="title"
            fontSize={{ base: "3xl", md: "5xl" }}
            mb={8}
          >
            L'Actualité de la Filière
          </Heading>
          <Text color="brand.gris" fontSize="md" maxW="600px" mx="auto" >
            Restez informé sur l'élevage, l'artisanat et la réglementation
          </Text>
        </Box>

        <Flex 
            justify="center" 
            align="center" 
            direction={{ base: "column", xl: "row" }} 
            gap="82px" 
            wrap={{ base: "wrap", xl: "nowrap" }}
        >
            {actualities.slice(0, 3).map((actu) => (
                <ActualityCard 
                    key={actu.idActualite} 
                    title={actu.titre} 
                    category={actu.categorie}
                    date={new Date(actu.datePublication).toLocaleDateString('fr-FR', { 
                        day: 'numeric', month: 'short', year: 'numeric' 
                    })}
                    excerpt={actu.contenu ? actu.contenu.substring(0, 60) + "..." : ""}
                    image={actu.imageActualite 
                        ? `http://localhost:3000/uploads/${actu.imageActualite}` 
                        : defaultImg
                    }
                    link={`/actu/${actu.idActualite}`}
                />
            ))}
        </Flex>

        <Box textAlign="center" mt="60px">
            <Link 
                as={RouterLink} 
                to="/actualites"
                fontFamily="title" 
                fontSize="2xl" 
                color="brand.brun" 
                fontWeight="bold"
                textDecoration="none"
                
                _hover={{ 
                    color: "brand.rouge", 
                    textDecoration: "underline" 
                }}
            >
                Voir toutes les actualités &gt;
            </Link>
        </Box>

        {!isLoading && actualities.length === 0 && (
            <Center><Text color="brand.gris">Aucune actualité disponible.</Text></Center>
        )}

      </Container>
    </Box>
  );
};

export default Actuality;