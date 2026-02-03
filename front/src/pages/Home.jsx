import React from 'react';
import { Box } from "@chakra-ui/react"; 
import NavBar from '../components/NavBar'; 
import Hero from '../components/home/Hero';
import Tools from '../components/home/Tools';
import CourseResume from '../components/home/CourseResume';
import ChallengesPractice from '../components/home/ChallengesPractice';
import Actuality from '../components/home/Actuality';
import Footer from '../components/Footer';

const Home = () => {
    return (
        <Box as="main" w="100%" overflowX="hidden">
            <NavBar />
            <Hero />
            <Tools />
            <CourseResume />
            <ChallengesPractice />
            <Actuality />
            <Footer />
        </Box>
    );
};

export default Home;