import React from 'react';
import { Box } from "@chakra-ui/react"; 
import Hero from '../components/home/Hero';
import Tools from '../components/home/Tools';
import CourseResume from '../components/home/CourseResume';
import ChallengesPractice from '../components/home/ChallengesPractice';
import Actuality from '../components/home/Actuality';

const Home = () => {
    return (
        <Box as="main" w="100%" overflowX="hidden">
            <Hero />
            <Tools />
            <CourseResume />
            <ChallengesPractice />
            <Actuality />
        </Box>
    );
};

export default Home;