import React, { useEffect, useRef, useState } from "react";
import { Box, Button, Flex, Spinner, Text } from "@chakra-ui/react";
import { FiMinus, FiPlus, FiRotateCcw } from "react-icons/fi";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import { COULEUR_ARRIERE, COULEUR_AVANT } from "../../data/coupesBoeuf";

const CENTRE = new THREE.Vector3(0, 1.25, 0);

// Uniformes partagés par toutes les matières du modèle : ils pilotent la mise en évidence d'une coupe.
const creerUniformes = () => ({
  uMode: { value: 0 },
  uCoupeY: { value: 0 },
  uLigneA: { value: new THREE.Vector2() },
  uLigneB: { value: new THREE.Vector2() },
  uCouleurAvant: { value: new THREE.Color(COULEUR_AVANT) },
  uCouleurArriere: { value: new THREE.Color(COULEUR_ARRIERE) },
});

const brancherCoupe = (matiere, uniformes) => {
  matiere.onBeforeCompile = (shader) => {
    Object.assign(shader.uniforms, uniformes);
    shader.vertexShader = shader.vertexShader
      .replace("#include <common>", "#include <common>\nvarying vec3 vPosMonde;")
      .replace(
        "#include <begin_vertex>",
        "#include <begin_vertex>\nvPosMonde = (modelMatrix * vec4(transformed, 1.0)).xyz;"
      );
    shader.fragmentShader = shader.fragmentShader
      .replace(
        "#include <common>",
        `#include <common>
varying vec3 vPosMonde;
uniform int uMode;
uniform float uCoupeY;
uniform vec2 uLigneA;
uniform vec2 uLigneB;
uniform vec3 uCouleurAvant;
uniform vec3 uCouleurArriere;
float distanceSegment(vec2 p, vec2 a, vec2 b) {
  vec2 ab = b - a;
  float t = clamp(dot(p - a, ab) / dot(ab, ab), 0.0, 1.0);
  return length(p - (a + ab * t));
}`
      )
      .replace(
        "#include <map_fragment>",
        `#include <map_fragment>
if (uMode > 0) {
  float y = vPosMonde.y;
  float z = vPosMonde.z;
  bool avant = y < uCoupeY;
  float trait = abs(y - uCoupeY);
  if (uMode == 2) {
    float k = clamp((y - uLigneA.x) / (uLigneB.x - uLigneA.x), 0.0, 1.0);
    float zLigne = mix(uLigneA.y, uLigneB.y, k);
    bool ventre = y >= uCoupeY && y <= uLigneB.x && z > zLigne;
    avant = avant || ventre;
    float traitHaut = (z <= uLigneA.y) ? abs(y - uCoupeY) : 1.0;
    float traitVentre = distanceSegment(vec2(y, z), uLigneA, uLigneB);
    float traitCuisse = (z >= uLigneB.y) ? abs(y - uLigneB.x) : 1.0;
    trait = min(traitHaut, min(traitVentre, traitCuisse));
  }
  vec3 teinte = avant ? uCouleurAvant : uCouleurArriere;
  diffuseColor.rgb = mix(diffuseColor.rgb, teinte, 0.38);
  float bord = 1.0 - smoothstep(0.012, 0.018, trait);
  float coeur = 1.0 - smoothstep(0.006, 0.009, trait);
  diffuseColor.rgb = mix(diffuseColor.rgb, vec3(0.1), bord);
  diffuseColor.rgb = mix(diffuseColor.rgb, vec3(1.0), coeur);
}`
      );
  };
  matiere.customProgramCacheKey = () => "coupe-carcasse";
  matiere.needsUpdate = true;
};

// Angle autour de l'axe vertical : la carcasse ne tourne qu'à l'horizontale.
const VUES = {
  fente: { label: "Face de fente", angle: Math.PI / 2 },
  exterieur: { label: "Extérieur", angle: -Math.PI / 2 },
  profil: { label: "Profil", angle: 0 },
};

const Carcasse3D = ({ modele = "/models/demi_carcasse_boeuf.glb", coupe = null }) => {
  const conteneurRef = useRef(null);
  const actionsRef = useRef(null);
  const uniformesRef = useRef(creerUniformes());
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
    const controles = new OrbitControls(camera, rendu.domElement);
    controles.target.copy(CENTRE);
    controles.enablePan = false;
    controles.enableDamping = true;
    controles.dampingFactor = 0.08;
    controles.rotateSpeed = 0.9;
    controles.minPolarAngle = Math.PI / 2;
    controles.maxPolarAngle = Math.PI / 2;
    controles.minDistance = 1.5;
    controles.maxDistance = 10;

    const distanceIdeale = () => {
      const vfov = THREE.MathUtils.degToRad(camera.fov);
      const hauteur = 3.1 / (2 * Math.tan(vfov / 2));
      const largeur = 1.3 / (2 * Math.tan(vfov / 2) * camera.aspect);
      return Math.max(hauteur, largeur);
    };

    let animationVue = null;
    const allerVers = (cle) => {
      animationVue = { angle: VUES[cle].angle, distance: distanceIdeale() };
    };

    const redimensionner = () => {
      const { clientWidth: w, clientHeight: h } = conteneur;
      if (!w || !h) return;
      rendu.setSize(w, h);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    };
    const observateur = new ResizeObserver(redimensionner);
    observateur.observe(conteneur);
    redimensionner();
    camera.position.set(CENTRE.x + distanceIdeale(), CENTRE.y, CENTRE.z);
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
        gltf.scene.traverse((objet) => {
          if (objet.isMesh) {
            const matieres = Array.isArray(objet.material) ? objet.material : [objet.material];
            matieres.forEach((m) => brancherCoupe(m, uniformesRef.current));
          }
        });
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
        const spherique = new THREE.Spherical().setFromVector3(camera.position.clone().sub(CENTRE));
        let ecart = animationVue.angle - spherique.theta;
        ecart = Math.atan2(Math.sin(ecart), Math.cos(ecart));
        spherique.theta += ecart * 0.15;
        spherique.radius += (animationVue.distance - spherique.radius) * 0.15;
        camera.position.copy(CENTRE).add(new THREE.Vector3().setFromSpherical(spherique));
        if (Math.abs(ecart) < 0.002 && Math.abs(animationVue.distance - spherique.radius) < 0.005) animationVue = null;
      }
      controles.update();
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

  useEffect(() => {
    const u = uniformesRef.current;
    if (!coupe) {
      u.uMode.value = 0;
      return;
    }
    u.uMode.value = coupe.type === "traitee" ? 2 : 1;
    u.uCoupeY.value = coupe.hauteur;
    if (coupe.ligneVentrale) {
      u.uLigneA.value.set(...coupe.ligneVentrale.depart);
      u.uLigneB.value.set(...coupe.ligneVentrale.arrivee);
    }
  }, [coupe]);

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
        aria-label="Demi-carcasse de bœuf en 3D. Faites-la tourner sur elle-même en la touchant ou avec la souris."
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
            Touchez la carcasse et glissez vers la gauche ou la droite pour la tourner. Pincez pour zoomer.
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
