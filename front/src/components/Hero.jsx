import React from 'react';
import { Box, Flex, Heading, Text, Button, VStack, Container, Group, Input, Icon } from "@chakra-ui/react";
import heroImage from "../assets/imageHero.png";
import { PiMagnifyingGlassThin } from "react-icons/pi";

const Hero = () => {
    return (
        <Box
            as="section"
            position="absolute"
            top="0"
            left="0"
            w="100%"
            h="100vh"
            zIndex="0"
            overflow="hidden"
        >
            <Box
                position="absolute"
                top="0"
                left="0"
                w="100%"
                h="100%"
                backgroundImage={`url(${heroImage})`}
                backgroundSize="cover"
                backgroundPosition="center"
                backgroundRepeat="no-repeat"
            >
                <Box
                    position="absolute"
                    top="0"
                    left="0"
                    w="100%"
                    h="100%"
                    bg="blackAlpha.400"
                    bgGradient="to-b"
                    gradientFrom="rgba(0, 0, 0, 0.3)"
                    gradientTo="rgba(0, 0, 0, 0.6)"
                />
            </Box>

            <Flex
            h="100%"
            justify="flex-start"
            align="center"
            pt="calc(50vh - 30px)"
            position="relative"
            px={4}
            >
                <Container maxW="1360px">
                    <VStack
                        gap={0}
                        align="center"
                        textAlign="center"
                        w="100%"
                    >
                        <Heading
                            as="h1"
                            color="white"
                            fontSize="48px"
                            fontWeight="bold"
                            fontFamily="heading"
                            lineHeight="1.2"
                            textTransform="uppercase"
                            textShadow="0px 4px 20px rgba(0, 0, 0, 0.5)"
                            mb="12px"
                        >
              L'ATLAS DE L'ARTISAN BOUCHER
            </Heading>

            <Box 
                            w="524px"           
                            maxW="100%"         
                            h="1px"             
                            bg="white"    
                            mb="24px"           
                        />

            <Text
              color="white"
              fontFamily="body"
              fontSize="16px"
              maxW="534px"
              textShadow="0px 2px 10px rgba(0,0,0,0.5)"
              mb="46px"
            >
              Plongez dans l'anatomie, maîtrisez la découpe et perfectionnez votre savoir-faire avec l'Atlas Numérique du Boucher.
            </Text>

            <Group attached>
      <Input flex="1" 
      placeholder="Rechercher une pièce, une technique, un outil..."
      _placeholder={{ color: "#AAAAAA" }}
      bg="white"
      color="brand.gris"
      width="600px"
      height="60px"
      border="none"
      borderLeftRadius="8px"
      borderRightRadius="0px"
      fontSize="16px"
      pl={6}
      // _focus={{ ring: "2px", ringColor: "brand.rouge" }}
      />
      <Button
      
      bg="brand.brun" 
      variant="outline" 
      height="60px" 
      width="60px"
      border="none"
      borderRightRadius="8px"
      borderLeftRadius="0px"
      _hover={{ bg: "brand.rouge" }}
      >
        <Icon 
            as={PiMagnifyingGlassThin} 
            color="brand.gris" 
            boxSize="2rem" 
        />
       
      </Button>
    </Group>
          </VStack>
        </Container>
      </Flex>
    </Box>
  );
};

export default Hero;