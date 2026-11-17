import React, { useEffect, useRef, useState } from "react";
import { Box, Button, Flex, Spinner, Text } from "@chakra-ui/react";
import { FiMinus, FiPlus, FiRotateCcw } from "react-icons/fi";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { TrackballControls } from "three/examples/jsm/controls/TrackballControls.js";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";

const CENTRE = new THREE.Vector3(0, 1.25, 0);

const VUES = {
  fente: { label: "Face de fente", direction: new THREE.Vector3(1, 0, 0) },
  exterieur: { label: "Extérieur", direction: new THREE.Vector3(-1, 0, 0) },
  profil: { label: "Profil", direction: new THREE.Vector3(0, 0, 1) },
};

const Carcasse3D = ({ modele = "/models/demi_carcasse_boeuf.glb" }) => {
  const conteneurRef = useRef(null);
  const actionsRef = useRef(null);
  const [etat, setEtat] = useState("chargement");
  const [vueActive, setVueActive] = useState("fente");

  useEffect(() => {
    const conteneur = conteneurRef.current;
    if (!conteneur) return undefined;

    const rendu = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    rendu.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    rendu.outputColorSpace = THREE.SRGBColorSpace;
    rendu.toneMapping = THREE.NeutralToneMapping;
    rendu.domElement.style.display = "block";
    rendu.domElement.style.touchAction = "none";
    conteneur.appendChild(rendu.domElement);

    const scene = new THREE.Scene();
    const pmrem = new THREE.PMREMGenerator(rendu);
    const environnement = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
    scene.environment = environnement;
    scene.environmentIntensity = 0.6;
    const lumiere = new THREE.DirectionalLight(0xffffff, 0.8);
    lumiere.position.set(2, 3, 3);
    scene.add(lumiere);

    const camera = new THREE.PerspectiveCamera(35, 1, 0.05, 50);
    const controles = new TrackballControls(camera, rendu.domElement);
    controles.rotateSpeed = 3.2;
    controles.zoomSpeed = 1.1;
    controles.noPan = true;
    controles.dynamicDampingFactor = 0.12;
    controles.minDistance = 1;
    controles.maxDistance = 10;
    controles.target.copy(CENTRE);

    const distanceIdeale = () => {
      const vfov = THREE.MathUtils.degToRad(camera.fov);
      const hauteur = 3.1 / (2 * Math.tan(vfov / 2));
      const largeur = 1.3 / (2 * Math.tan(vfov / 2) * camera.aspect);
      return Math.max(hauteur, largeur);
    };

    let animationVue = null;
    const allerVers = (cle) => {
      const fin = CENTRE.clone().add(VUES[cle].direction.clone().multiplyScalar(distanceIdeale()));
      animationVue = { depart: camera.position.clone(), upDepart: camera.up.clone(), fin, t: 0 };
    };

    const redimensionner = () => {
      const { clientWidth: w, clientHeight: h } = conteneur;
      if (!w || !h) return;
      rendu.setSize(w, h);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      controles.handleResize();
    };
    const observateur = new ResizeObserver(redimensionner);
    observateur.observe(conteneur);
    redimensionner();
    camera.position.copy(CENTRE).add(VUES.fente.direction.clone().multiplyScalar(distanceIdeale()));
    camera.lookAt(CENTRE);

    const zoomer = (facteur) => {
      const v = camera.position.clone().sub(CENTRE);
      const d = THREE.MathUtils.clamp(v.length() * facteur, controles.minDistance, controles.maxDistance);
      camera.position.copy(CENTRE).add(v.setLength(d));
    };

    actionsRef.current = { allerVers, zoomer };
    controles.addEventListener("start", () => {
      animationVue = null;
      setVueActive(null);
    });

    let annule = false;
    new GLTFLoader().load(
      modele,
      (gltf) => {
        if (annule) return;
        scene.add(gltf.scene);
        setEtat("pret");
      },
      undefined,
      () => {
        if (!annule) setEtat("erreur");
      }
    );

    rendu.setAnimationLoop(() => {
      if (animationVue) {
        animationVue.t = Math.min(animationVue.t + 0.06, 1);
        const k = 1 - Math.pow(1 - animationVue.t, 3);
        const depart = animationVue.depart.clone().sub(CENTRE);
        const fin = animationVue.fin.clone().sub(CENTRE);
        const direction = depart.clone().normalize().lerp(fin.clone().normalize(), k);
        if (direction.lengthSq() < 1e-6) direction.set(0, 0, 1);
        const rayon = THREE.MathUtils.lerp(depart.length(), fin.length(), k);
        camera.position.copy(CENTRE).add(direction.setLength(rayon));
        camera.up.copy(animationVue.upDepart).lerp(new THREE.Vector3(0, 1, 0), k).normalize();
        camera.lookAt(CENTRE);
        if (animationVue.t >= 1) animationVue = null;
      } else {
        controles.update();
      }
      rendu.render(scene, camera);
    });

    return () => {
      annule = true;
      observateur.disconnect();
      rendu.setAnimationLoop(null);
      controles.dispose();
      scene.traverse((objet) => {
        if (objet.isMesh) {
          objet.geometry.dispose();
          const matieres = Array.isArray(objet.material) ? objet.material : [objet.material];
          matieres.forEach((m) => {
            Object.values(m).forEach((valeur) => valeur && valeur.isTexture && valeur.dispose());
            m.dispose();
          });
        }
      });
      environnement.dispose();
      pmrem.dispose();
      rendu.dispose();
      conteneur.removeChild(rendu.domElement);
    };
  }, [modele]);

  const changerVue = (cle) => {
    setVueActive(cle);
    actionsRef.current?.allerVers(cle);
  };

  const styleBoutonRond = {
    w: "44px",
    h: "44px",
    minW: "44px",
    p: 0,
    rounded: "full",
    bg: "white",
    color: "brand.gris",
    boxShadow: "carte",
    _hover: { bg: "brand.beige" },
  };

  return (
    <Box
      position="relative"
      w="100%"
      h={{ base: "68vh", md: "620px" }}
      minH="420px"
      bg="brand.creme"
      borderRadius="2xl"
      boxShadow="carte"
      overflow="hidden"
    >
      <Box
        ref={conteneurRef}
        position="absolute"
        inset="0"
        cursor="grab"
        _active={{ cursor: "grabbing" }}
        role="img"
        aria-label="Demi-carcasse de bœuf en 3D. Faites-la tourner en la touchant ou avec la souris."
      />

      {etat === "chargement" && (
        <Flex position="absolute" inset="0" align="center" justify="center" direction="column" gap={3} pointerEvents="none">
          <Spinner size="lg" color="brand.rouge" />
          <Text color="gray.600" fontSize="sm">Chargement du modèle 3D…</Text>
        </Flex>
      )}

      {etat === "erreur" && (
        <Flex position="absolute" inset="0" align="center" justify="center" px={6} textAlign="center">
          <Text color="brand.gris">Le modèle 3D n'a pas pu être chargé. Vérifiez votre connexion puis rechargez la page.</Text>
        </Flex>
      )}

      {etat === "pret" && (
        <>
          <Text
            position="absolute"
            top={3}
            left={0}
            right={0}
            textAlign="center"
            fontSize="sm"
            color="gray.600"
            pointerEvents="none"
            px={4}
          >
            Touchez la carcasse et faites glisser pour la tourner. Pincez pour zoomer.
          </Text>

          <Flex position="absolute" right={3} top="50%" transform="translateY(-50%)" direction="column" gap={2}>
            <Button aria-label="Zoomer" onClick={() => actionsRef.current?.zoomer(0.8)} {...styleBoutonRond}>
              <FiPlus aria-hidden="true" />
            </Button>
            <Button aria-label="Dézoomer" onClick={() => actionsRef.current?.zoomer(1.25)} {...styleBoutonRond}>
              <FiMinus aria-hidden="true" />
            </Button>
            <Button aria-label="Revenir à la vue de départ" onClick={() => changerVue(vueActive || "fente")} {...styleBoutonRond}>
              <FiRotateCcw aria-hidden="true" />
            </Button>
          </Flex>

          <Flex
            position="absolute"
            bottom={4}
            left="50%"
            transform="translateX(-50%)"
            bg="white"
            p={1}
            rounded="full"
            boxShadow="carte"
            gap={1}
            role="group"
            aria-label="Choix de la vue"
          >
            {Object.entries(VUES).map(([cle, vue]) => (
              <Button
                key={cle}
                onClick={() => changerVue(cle)}
                aria-pressed={vueActive === cle}
                rounded="full"
                px={{ base: 3, md: 5 }}
                fontSize={{ base: "sm", md: "md" }}
                whiteSpace="nowrap"
                bg={vueActive === cle ? "brand.rouge" : "transparent"}
                color={vueActive === cle ? "white" : "brand.gris"}
                _hover={{ bg: vueActive === cle ? "brand.rougeFonce" : "brand.beige" }}
              >
                {vue.label}
              </Button>
            ))}
          </Flex>
        </>
      )}
    </Box>
  );
};

export default Carcasse3D;
