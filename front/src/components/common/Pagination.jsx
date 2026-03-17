import React from "react";
import { Flex, Button, Text } from "@chakra-ui/react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

const Pagination = ({ currentPage, totalItems, itemsPerPage, onPageChange }) => {
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  // S'il n'y a qu'une seule page, on n'affiche pas la pagination
  if (totalPages <= 1) return null;

  return (
    <Flex justify="center" align="center" gap={4} mt={12}>
      <Button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        variant="outline"
        borderColor="brand.brun"
        color="brand.brun"
        _hover={{ bg: "brand.rouge", color: "white", borderColor: "brand.rouge" }}
      >
        <FiChevronLeft size={20} />
      </Button>

      <Text fontWeight="bold" color="brand.gris">
        Page {currentPage} sur {totalPages}
      </Text>

      <Button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        variant="outline"
        borderColor="brand.brun"
        color="brand.brun"
        _hover={{ bg: "brand.rouge", color: "white", borderColor: "brand.rouge" }}
      >
        <FiChevronRight size={20} />
      </Button>
    </Flex>
  );
};

export default Pagination;