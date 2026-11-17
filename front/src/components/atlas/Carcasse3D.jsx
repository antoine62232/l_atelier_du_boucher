import React, { useEffect, useImperativeHandle, useRef, useState } from "react";
import { Box, Button, Flex, Heading, Spinner, Text } from "@chakra-ui/react";
import { FiArrowRight, FiEye, FiMinus, FiPlus, FiRotateCcw, FiX, FiZoomIn } from "react-icons/fi";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import { MeshoptDecoder } from "three/examples/jsm/libs/meshopt_decoder.module.js";
import { COULEUR_ARRIERE, COULEUR_AVANT, COUPES_BOEUF } from "../../data/coupesBoeuf";

const CENTRE = new THREE.Vector3(0, 1.25, 0);
const PISTOLET = COUPES_BOEUF.find((c) => c.type === "pistolet");
const DUREE_ZOOM = 900;

const VUES = {
  fente: { label: "Face de fente", angle: Math.PI / 2 },
  exterieur: { label: "Extérieur", angle: -Math.PI / 2 },
  profil: { label: "Profil", angle: 0 },
};

const creerUniformes = () => ({
  uMode: { value: 0 },
  uCoupeY: { value: 0 },
  uPts: { value: [new THREE.Vector2(), new THREE.Vector2(), new THREE.Vector2(), new THREE.Vector2()] },
  uCouleurAvant: { value: new THREE.Color(COULEUR_AVANT) },
  uCouleurArriere: { value: new THREE.Color(COULEUR_ARRIERE) },
  uFocus: { value: 0 },
  uFocusMix: { value: 0 },
  uMasque: { value: 0 },
});

// Largeur de la carcasse (côté rachis en z négatif, côté ventre en z positif) par tranche de hauteur.
const TRANCHES = 125;
const tranche = (y) => Math.min(TRANCHES - 1, Math.max(0, Math.floor((y / 2.5) * TRANCHES)));

const mesurerLargeurs = (racine) => {
  racine.updateMatrixWorld(true);
  const zMin = new Array(TRANCHES).fill(Infinity);
  const zMax = new Array(TRANCHES).fill(-Infinity);
  const v = new THREE.Vector3();
  racine.traverse((objet) => {
    if (!objet.isMesh) return;
    const positions = objet.geometry.attributes.position;
    for (let i = 0; i < positions.count; i += 1) {
      v.fromBufferAttribute(positions, i).applyMatrix4(objet.matrixWorld);
      const t = tranche(v.y);
      zMin[t] = Math.min(zMin[t], v.z);
      zMax[t] = Math.max(zMax[t], v.z);
    }
  });
  return { zMin, zMax };
};

const versPositionZ = (largeurs, hauteur, fraction) => {
  const t = tranche(hauteur);
  const zMin = largeurs.zMin[t];
  const zMax = largeurs.zMax[t];
  if (!Number.isFinite(zMin)) return 0;
  return zMin + fraction * (zMax - zMin);
};

// Même règle que dans le shader : ce point appartient-il à l'avant de la coupe pistolet ?
const estAvantPistolet = (pts, y, z) => {
  const [, p1, p2, p3] = pts;
  if (y < p1.x) return true;
  if (y > p3.x) return false;
  const zLigne =
    y <= p2.x
      ? THREE.MathUtils.lerp(p1.y, p2.y, THREE.MathUtils.clamp((y - p1.x) / (p2.x - p1.x), 0, 1))
      : THREE.MathUtils.lerp(p2.y, p3.y, THREE.MathUtils.clamp((y - p2.x) / (p3.x - p2.x), 0, 1));
  return z > zLigne;
};

// Boîte englobante de l'avant et de l'arrière, pour cadrer le zoom.
const mesurerParties = (racine, pts) => {
  const boites = { avant: new THREE.Box3(), arriere: new THREE.Box3() };
  const v = new THREE.Vector3();
  racine.traverse((objet) => {
    if (!objet.isMesh) return;
    const positions = objet.geometry.attributes.position;
    for (let i = 0; i < positions.count; i += 3) {
      v.fromBufferAttribute(positions, i).applyMatrix4(objet.matrixWorld);
      boites[estAvantPistolet(pts, v.y, v.z) ? "avant" : "arriere"].expandByPoint(v);
    }
  });
  return boites;
};

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
uniform vec2 uPts[4];
uniform vec3 uCouleurAvant;
uniform vec3 uCouleurArriere;
uniform int uFocus;
uniform float uFocusMix;
uniform float uMasque;
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
    vec2 p = vec2(y, z);
    float zLigne = y <= uPts[2].x
      ? mix(uPts[1].y, uPts[2].y, clamp((y - uPts[1].x) / (uPts[2].x - uPts[1].x), 0.0, 1.0))
      : mix(uPts[2].y, uPts[3].y, clamp((y - uPts[2].x) / (uPts[3].x - uPts[2].x), 0.0, 1.0));
    avant = y < uPts[1].x || (y <= uPts[3].x && z > zLigne);
    trait = min(distanceSegment(p, uPts[0], uPts[1]), min(distanceSegment(p, uPts[1], uPts[2]), distanceSegment(p, uPts[2], uPts[3])));
  }
  vec3 base = diffuseColor.rgb;
  vec3 teinte = avant ? uCouleurAvant : uCouleurArriere;
  vec3 colore = mix(base, teinte, 0.38);
  if (uFocus > 0) {
    bool choisi = (uFocus == 1) == avant;
    // Partie écartée : elle s'efface en fondu par tramage (pas de transparence à trier).
    if (!choisi && uMasque > 0.0) {
      float bruit = fract(52.9829189 * fract(dot(gl_FragCoord.xy, vec2(0.06711056, 0.00583715))));
      if (bruit < uMasque) discard;
    }
    float gris = dot(base, vec3(0.299, 0.587, 0.114));
    vec3 eteint = mix(colore, vec3(gris) * 0.45, 0.85);
    vec3 eclaire = mix(base, teinte, 0.12);
    diffuseColor.rgb = choisi ? mix(colore, eclaire, uFocusMix) : mix(colore, eteint, uFocusMix);
  } else {
    diffuseColor.rgb = colore;
  }
  float bord = 1.0 - smoothstep(0.012, 0.018, trait);
  float coeur = 1.0 - smoothstep(0.006, 0.009, trait);
  diffuseColor.rgb = mix(diffuseColor.rgb, vec3(0.1), bord);
  diffuseColor.rgb = mix(diffuseColor.rgb, vec3(1.0), coeur);
}
// Faces intérieures visibles une fois l'autre quartier effacé : teinte de viande à la coupe.
if (!gl_FrontFacing) diffuseColor.rgb = vec3(0.42, 0.1, 0.11);`
      );
  };
  matiere.side = THREE.DoubleSide;
  matiere.customProgramCacheKey = () => "coupe-carcasse";
  matiere.needsUpdate = true;
};

const easing = (t) => 1 - Math.pow(1 - t, 3);

/**
 * parties : { avant: { titre, description }, arriere: { titre, description } }
 * onExplorer(partie) : appelé quand l'utilisateur veut ouvrir la partie choisie.
 */
const Carcasse3D = ({
  ref,
  modele = "/models/demi_carcasse_boeuf_v2.glb",
  apercu = "/models/demi_carcasse_boeuf_apercu.webp",
  coupe = null, parties, onExplorer, onSelection, partieInitiale = null }) => {
  const conteneurRef = useRef(null);
  const actionsRef = useRef(null);
  const uniformesRef = useRef(creerUniformes());
  const largeursRef = useRef(null);
  const coupeRef = useRef(coupe);
  const [etat, setEtat] = useState("chargement");
  const [vueActive, setVueActive] = useState("fente");
  const [selection, setSelection] = useState(null);
  const [isole, setIsole] = useState(false);
  const [progression, setProgression] = useState(0);

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
    controles.minDistance = 0.8;
    controles.maxDistance = 10;

    const distancePour = (hauteur, largeur) => {
      const vfov = THREE.MathUtils.degToRad(camera.fov);
      return Math.max(hauteur / (2 * Math.tan(vfov / 2)), largeur / (2 * Math.tan(vfov / 2) * camera.aspect));
    };
    const distanceIdeale = () => distancePour(3.1, 1.3);

    // Une animation déplace à la fois le point visé, l'angle et la distance de la caméra.
    let animation = null;
    const animer = ({ cible = controles.target, angle, distance, focus }) => {
      const depart = new THREE.Spherical().setFromVector3(camera.position.clone().sub(controles.target));
      animation = {
        debut: performance.now(),
        cibleDepart: controles.target.clone(),
        cibleFin: cible.clone(),
        angleDepart: depart.theta,
        angleFin: angle ?? depart.theta,
        distanceDepart: depart.radius,
        distanceFin: distance ?? depart.radius,
        focusDepart: uniformesRef.current.uFocusMix.value,
        focusFin: focus,
      };
    };

    let boites = null;
    let masqueCible = 0;
    let dernierInstant = performance.now();
    let pointsPistolet = null;

    const allerVers = (cle) => {
      masqueCible = 0;
      animer({ cible: CENTRE, angle: VUES[cle].angle, distance: distanceIdeale(), focus: 0 });
    };

    // Le bas du cadre est occupé par la fiche de la partie : on cadre la partie dans l'espace libre au-dessus.
    const zoomerSur = (partie, isole = false) => {
      if (!boites) return;
      masqueCible = isole ? 1 : 0;
      const boite = boites[partie];
      const centre = boite.getCenter(new THREE.Vector3());
      const taille = boite.getSize(new THREE.Vector3());
      const hauteurCadre = conteneur.clientHeight || 600;
      // Isolée, la fiche est plus courte et la partie remplit davantage l'écran.
      const reserve = isole ? (conteneur.clientWidth < 600 ? 165 : 150) : conteneur.clientWidth < 600 ? 255 : 205;
      const libre = THREE.MathUtils.clamp(1 - reserve / hauteurCadre, 0.45, 0.85);
      const marge = isole ? 1.02 : 1.1;
      const distance = distancePour((taille.y * marge) / libre, Math.max(taille.z, taille.x) * (isole ? 1.1 : 1.3));
      const hauteurVisible = 2 * distance * Math.tan(THREE.MathUtils.degToRad(camera.fov) / 2);
      animer({
        cible: new THREE.Vector3(0, centre.y - (hauteurVisible * (1 - libre)) / 2, 0),
        distance,
        focus: 1,
      });
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
      const v = camera.position.clone().sub(controles.target);
      const d = THREE.MathUtils.clamp(v.length() * facteur, controles.minDistance, controles.maxDistance);
      camera.position.copy(controles.target).add(v.setLength(d));
    };

    // Un appui bref sans glisser = un choix. Un glissement = une rotation.
    const raycaster = new THREE.Raycaster();
    const pointeur = new THREE.Vector2();
    let appui = null;
    let dernierToucher = null;
    let modeleCharge = null;

    const partieSousLePointeur = (event) => {
      if (!modeleCharge || !pointsPistolet) return null;
      const r = rendu.domElement.getBoundingClientRect();
      pointeur.set(((event.clientX - r.left) / r.width) * 2 - 1, -((event.clientY - r.top) / r.height) * 2 + 1);
      raycaster.setFromCamera(pointeur, camera);
      // Quand une partie est isolée, l'autre est invisible : on traverse ses faces.
      const focus = uniformesRef.current.uFocus.value;
      const partieIsolee = masqueCible > 0.5 && focus > 0 ? (focus === 1 ? "avant" : "arriere") : null;
      for (const impact of raycaster.intersectObject(modeleCharge, true)) {
        const partie = estAvantPistolet(pointsPistolet, impact.point.y, impact.point.z) ? "avant" : "arriere";
        if (!partieIsolee || partie === partieIsolee) return partie;
      }
      return null;
    };

    const surAppui = (event) => {
      appui = { x: event.clientX, y: event.clientY, t: performance.now() };
    };
    const surRelache = (event) => {
      if (!appui) return;
      const deplacement = Math.hypot(event.clientX - appui.x, event.clientY - appui.y);
      const duree = performance.now() - appui.t;
      appui = null;
      if (deplacement > 10 || duree > 500) return;
      const partie = partieSousLePointeur(event);
      if (!partie) return;
      // Deux appuis rapprochés sur la même partie : on l'isole.
      const maintenant = performance.now();
      const double =
        dernierToucher &&
        dernierToucher.partie === partie &&
        maintenant - dernierToucher.t < 380 &&
        Math.hypot(event.clientX - dernierToucher.x, event.clientY - dernierToucher.y) < 40;
      dernierToucher = double ? null : { partie, t: maintenant, x: event.clientX, y: event.clientY };
      if (double) actionsRef.current?.isoler(partie);
      else actionsRef.current?.choisir(partie);
    };
    const surSurvol = (event) => {
      if (event.pointerType !== "mouse" || appui) return;
      rendu.domElement.style.cursor = partieSousLePointeur(event) ? "pointer" : "grab";
    };
    rendu.domElement.addEventListener("pointerdown", surAppui);
    rendu.domElement.addEventListener("pointerup", surRelache);
    rendu.domElement.addEventListener("pointermove", surSurvol);

    actionsRef.current = {
      allerVers,
      zoomer,
      zoomerSur,
      choisir: () => {},
      isoler: () => {},
    };
    controles.addEventListener("start", () => {
      if (animation) {
        uniformesRef.current.uFocusMix.value = animation.focusFin;
        if (animation.focusFin === 0) uniformesRef.current.uFocus.value = 0;
      }
      animation = null;
      setVueActive(null);
    });

    let annule = false;
    new GLTFLoader().setMeshoptDecoder(MeshoptDecoder).load(
      modele,
      (gltf) => {
        if (annule) return;
        largeursRef.current = mesurerLargeurs(gltf.scene);
        pointsPistolet = PISTOLET.trace.map(
          (p) => new THREE.Vector2(p.hauteur, versPositionZ(largeursRef.current, p.hauteur, p.largeur))
        );
        boites = mesurerParties(gltf.scene, pointsPistolet);
        gltf.scene.traverse((objet) => {
          if (objet.isMesh) {
            const matieres = Array.isArray(objet.material) ? objet.material : [objet.material];
            matieres.forEach((m) => brancherCoupe(m, uniformesRef.current));
          }
        });
        modeleCharge = gltf.scene;
        scene.add(gltf.scene);
        setEtat("pret");
      },
      (event) => {
        if (!annule && event.total) setProgression(Math.round((event.loaded / event.total) * 100));
      },
      () => {
        if (!annule) setEtat("erreur");
      }
    );

    rendu.setAnimationLoop(() => {
      const instant = performance.now();
      const ecoule = instant - dernierInstant;
      dernierInstant = instant;
      const u = uniformesRef.current;
      if (Math.abs(u.uMasque.value - masqueCible) > 0.001) {
        // Fondu d'environ 0,6 s, indépendant du mouvement de caméra.
        u.uMasque.value += (masqueCible - u.uMasque.value) * (1 - Math.exp(-ecoule / 160));
      } else {
        u.uMasque.value = masqueCible;
      }
      if (animation) {
        const t = Math.min((performance.now() - animation.debut) / DUREE_ZOOM, 1);
        const k = easing(t);
        controles.target.lerpVectors(animation.cibleDepart, animation.cibleFin, k);
        let ecart = animation.angleFin - animation.angleDepart;
        ecart = Math.atan2(Math.sin(ecart), Math.cos(ecart));
        const spherique = new THREE.Spherical(
          THREE.MathUtils.lerp(animation.distanceDepart, animation.distanceFin, k),
          Math.PI / 2,
          animation.angleDepart + ecart * k
        );
        camera.position.copy(controles.target).add(new THREE.Vector3().setFromSpherical(spherique));
        uniformesRef.current.uFocusMix.value = THREE.MathUtils.lerp(animation.focusDepart, animation.focusFin, k);
        if (t >= 1) {
          if (animation.focusFin === 0) uniformesRef.current.uFocus.value = 0;
          animation = null;
        }
      }
      controles.update();
      rendu.render(scene, camera);
    });

    return () => {
      annule = true;
      observateur.disconnect();
      rendu.domElement.removeEventListener("pointerdown", surAppui);
      rendu.domElement.removeEventListener("pointerup", surRelache);
      rendu.domElement.removeEventListener("pointermove", surSurvol);
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

  // Affichage d'une coupe choisie dans la liste, ou de la coupe pistolet pendant un zoom sur une partie.
  const appliquerAffichage = (coupeAffichee, partie) => {
    const u = uniformesRef.current;
    const largeurs = largeursRef.current;
    const coupeEffective = partie ? PISTOLET : coupeAffichee;
    if (!coupeEffective || !largeurs) {
      u.uMode.value = 0;
      return;
    }
    if (coupeEffective.type === "pistolet") {
      u.uMode.value = 2;
      coupeEffective.trace.forEach((point, i) => {
        u.uPts.value[i].set(point.hauteur, versPositionZ(largeurs, point.hauteur, point.largeur));
      });
    } else {
      u.uMode.value = 1;
      u.uCoupeY.value = coupeEffective.hauteur;
    }
  };

  const choisir = (partie, isoler = false) => {
    setSelection(partie);
    setIsole(isoler);
    onSelection?.(partie);
    uniformesRef.current.uFocus.value = partie === "avant" ? 1 : 2;
    appliquerAffichage(coupeRef.current, partie);
    actionsRef.current?.zoomerSur(partie, isoler);
  };

  const isoler = (partie) => choisir(partie, true);

  const toutVoir = () => {
    setSelection(null);
    setIsole(false);
    onSelection?.(null);
    setVueActive("fente");
    actionsRef.current?.allerVers("fente");
  };

  // Arrivée depuis une fiche pièce (?partie=avant) : on zoome sur ce quartier dès que la 3D est prête.
  const partieInitialeAppliquee = useRef(false);
  useEffect(() => {
    if (etat !== "pret" || partieInitialeAppliquee.current || !partieInitiale) return;
    partieInitialeAppliquee.current = true;
    const minuteur = setTimeout(() => actionsRef.current?.choisir(partieInitiale), 350);
    return () => clearTimeout(minuteur);
  }, [etat, partieInitiale]);

  useImperativeHandle(ref, () => ({
    choisir: (partie) => choisir(partie),
    isoler: (partie) => isoler(partie),
    toutVoir: () => toutVoir(),
  }));

  // Choisir une autre coupe dans la liste fait sortir du zoom sur une partie.
  const coupeIdPrecedente = useRef(coupe?.id ?? null);
  useEffect(() => {
    const id = coupe?.id ?? null;
    if (id === coupeIdPrecedente.current) return;
    coupeIdPrecedente.current = id;
    if (selection) toutVoir();
  });

  useEffect(() => {
    coupeRef.current = coupe;
    if (etat !== "pret") return;
    appliquerAffichage(coupe, selection);
  });

  useEffect(() => {
    if (actionsRef.current) {
      actionsRef.current.choisir = choisir;
      actionsRef.current.isoler = isoler;
    }
  });

  const changerVue = (cle) => {
    setVueActive(cle);
    if (selection) {
      setSelection(null);
      setIsole(false);
      onSelection?.(null);
    }
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

  const infoPartie = selection && parties ? parties[selection] : null;

  return (
    <Box
      position="relative"
      w="100%"
      h={{ base: "68vh", md: "620px" }}
      minH="440px"
      bg="brand.creme"
      borderRadius="2xl"
      boxShadow="carte"
      overflow="hidden"
    >
      {/* Aperçu fixe affiché tout de suite, cadré comme la vue de départ, en attendant la 3D. */}
      {etat !== "erreur" && (
        <Box
          as="img"
          src={apercu}
          alt=""
          aria-hidden="true"
          position="absolute"
          top="0"
          left="50%"
          h="100%"
          w="auto"
          maxW="none"
          transform="translateX(-50%)"
          pointerEvents="none"
          opacity={etat === "pret" ? 0 : 1}
          transition="opacity 0.5s ease"
        />
      )}

      <Box
        ref={conteneurRef}
        position="absolute"
        inset="0"
        opacity={etat === "pret" ? 1 : 0}
        transition="opacity 0.5s ease"
        cursor="grab"
        role="img"
        aria-label="Demi-carcasse de bœuf en 3D. Touchez l'avant ou l'arrière pour zoomer dessus, glissez pour la faire pivoter."
      />

      {etat === "chargement" && (
        <Flex
          position="absolute"
          bottom={4}
          left="50%"
          transform="translateX(-50%)"
          align="center"
          gap={2}
          bg="white"
          rounded="full"
          boxShadow="carte"
          px={4}
          py={2}
          pointerEvents="none"
          role="status"
        >
          <Spinner size="sm" color="brand.rouge" />
          <Text color="brand.gris" fontSize="sm" whiteSpace="nowrap">
            Préparation de la 3D{progression > 0 ? ` ${progression} %` : "…"}
          </Text>
        </Flex>
      )}

      {etat === "erreur" && (
        <Flex position="absolute" inset="0" align="center" justify="center" px={6} textAlign="center">
          <Text color="brand.gris">Le modèle 3D n'a pas pu être chargé. Vérifiez votre connexion puis rechargez la page.</Text>
        </Flex>
      )}

      {etat === "pret" && (
        <>
          {!infoPartie && (
            <Text position="absolute" top={3} left={0} right={0} textAlign="center" fontSize="sm" color="gray.600" pointerEvents="none" px={4}>
              Touchez l'avant ou l'arrière pour zoomer dessus. Glissez pour faire pivoter.
            </Text>
          )}

          <Flex
            position="absolute"
            right={3}
            top={infoPartie ? 3 : "50%"}
            transform={infoPartie ? "none" : "translateY(-50%)"}
            direction="column"
            gap={2}
          >
            <Button aria-label="Zoomer" onClick={() => actionsRef.current?.zoomer(0.8)} {...styleBoutonRond}>
              <FiPlus aria-hidden="true" />
            </Button>
            <Button aria-label="Dézoomer" onClick={() => actionsRef.current?.zoomer(1.25)} {...styleBoutonRond}>
              <FiMinus aria-hidden="true" />
            </Button>
            <Button aria-label="Revenir à la carcasse entière" onClick={toutVoir} {...styleBoutonRond}>
              <FiRotateCcw aria-hidden="true" />
            </Button>
          </Flex>

          {infoPartie ? (
            <Box
              position="absolute"
              left={3}
              right={{ base: 3, md: "auto" }}
              maxW={{ md: "480px" }}
              bottom={3}
              bg="white"
              borderRadius="xl"
              boxShadow="carteSurvol"
              p={4}
              borderLeft="6px solid"
              borderColor={selection === "avant" ? COULEUR_AVANT : COULEUR_ARRIERE}
              aria-live="polite"
              css={{
                animation: "apparitionPartie 0.45s ease-out",
                "@keyframes apparitionPartie": {
                  from: { opacity: 0, transform: "translateY(16px)" },
                  to: { opacity: 1, transform: "translateY(0)" },
                },
              }}
            >
              <Flex justify="space-between" align="start" gap={2} mb={isole ? 3 : 1}>
                <Heading as="h2" fontFamily="title" fontSize="xl" color="brand.rouge" lineHeight="1.2" pt={1}>
                  {infoPartie.titre}
                </Heading>
                <Button
                  onClick={toutVoir}
                  aria-label="Revenir à la carcasse entière"
                  variant="ghost"
                  rounded="full"
                  w="44px"
                  h="44px"
                  minW="44px"
                  p={0}
                  mt={-2}
                  mr={-2}
                  color="brand.gris"
                >
                  <FiX aria-hidden="true" />
                </Button>
              </Flex>
              {!isole && (
                <Text fontSize="sm" color="gray.700" mb={3}>
                  {infoPartie.description}
                </Text>
              )}
              <Flex gap={2}>
                <Button
                  onClick={() => onExplorer?.(selection)}
                  bg="brand.rouge"
                  color="white"
                  rounded="full"
                  flex={{ base: 1, md: "none" }}
                  minW={0}
                  px={{ base: 3, md: 5 }}
                  _hover={{ bg: "brand.rougeFonce" }}
                >
                  Voir les pièces <FiArrowRight aria-hidden="true" />
                </Button>
                <Button
                  onClick={() => (isole ? choisir(selection) : isoler(selection))}
                  variant="outline"
                  rounded="full"
                  flex={{ base: 1, md: "none" }}
                  minW={0}
                  px={{ base: 3, md: 5 }}
                  borderColor="gray.300"
                  color="brand.gris"
                >
                  {isole ? <FiEye aria-hidden="true" /> : <FiZoomIn aria-hidden="true" />}
                  {isole ? "Tout afficher" : "Isoler"}
                </Button>
              </Flex>
              {!isole && (
                <Text fontSize="xs" color="gray.600" mt={2}>
                  Astuce : touchez deux fois la carcasse pour isoler une partie.
                </Text>
              )}
            </Box>
          ) : (
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
          )}
        </>
      )}
    </Box>
  );
};

export default Carcasse3D;
