import React from 'react';
import { Box } from "@chakra-ui/react"; 
import NavBar from '../components/NavBar'; 
import Hero from '../components/Hero';
import Tools from '../components/Tools';
import CourseResume from '../components/CourseResume';

const Home = () => {
    return (
        <Box as="main" w="100%" overflowX="hidden">
            <NavBar />
            <Hero />
            <Tools />
            <CourseResume />
        </Box>
    );
};

export default Home;