import React, { useState } from "react";
import { Box, Flex, Image } from "@chakra-ui/react";
import logoImg from "../assets/logoNavBar.webp";

const ImageAvecSecours = ({ src, alt = "", ...props }) => {
  const [srcEnErreur, setSrcEnErreur] = useState(null);

  if (!src || srcEnErreur === src) {
    return (
      <Flex
        role={alt ? "img" : undefined}
        aria-label={alt || undefined}
        aria-hidden={alt ? undefined : true}
        align="center"
        justify="center"
        bg="brand.beige"
        w={props.w || "100%"}
        h={props.h || "100%"}
        minH={props.minH}
        borderRadius={props.borderRadius}
      >
        <Box w="45%" maxW="160px" opacity={0.5}>
          <Image src={logoImg} alt="" w="100%" />
        </Box>
      </Flex>
    );
  }

  return <Image src={src} alt={alt} onError={() => setSrcEnErreur(src)} {...props} />;
};

export default ImageAvecSecours;
