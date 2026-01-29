import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
    return (
        <div>
            <h1>Bienvenue à L'Atelier du Boucher</h1>
            <p>Ceci est ma page d'accueil !</p>
            <Link to="/labo">Aller au labo</Link>
        </div>
    );
};

export default Home;