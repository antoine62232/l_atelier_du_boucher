import React, { useEffect, useImperativeHandle, useRef, useState } from "react";
import { Box, Button, Flex, Heading, Spinner, Text } from "@chakra-ui/react";
import { FiArrowLeft, FiArrowRight, FiMinus, FiPlus, FiRotateCcw, FiX } from "react-icons/fi";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import { MeshoptDecoder } from "three/examples/jsm/libs/meshopt_decoder.module.js";
import { COULEUR_ARRIERE, COULEUR_AVANT, COUPES_BOEUF } from "../../data/coupesBoeuf";
import { GLSL_CLASSER_POINT, morceauParCode, morceauParId } from "../../data/zonesBoeuf";
import {
  TRANCHES,
  estFaceExterieure,
  mesurerLargeurs,
  mesurerMorceaux,
  morceauDuPoint,
  texturerLargeurs,
  versPositionZ,
} from "./zonesModele";

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
  // Gros morceau survolé (éclairci) et gros morceau isolé (seul visible), par leur code.
  uSurvol: { value: 0 },
  uMorceau: { value: 0 },
  uMasqueMorceau: { value: 0 },
  // Largeur de la carcasse par tranche de hauteur, pour classer chaque pixel dans un gros morceau.
  uLargeurs: { value: null },
  // Couverture de gras (morceau de photo), posée sur les flancs très inclinés.
  uGrain: { value: null },
  uVentre: { value: null },
});

// Couleur de la viande sur une face de coupe (espace linéaire).
const COULEUR_COUPE = "vec3(0.30, 0.025, 0.03)";

// Sur un écran tactile, pas de survol : un premier appui désigne le morceau, un second zoome.
const ecranTactile = () => typeof window !== "undefined" && !window.matchMedia?.("(hover: hover)").matches;

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

// exterieur : la matière habille la face extérieure (et non la face de fente).
const brancherCoupe = (matiere, uniformes, exterieur) => {
  // Les faces arrière ne se voient qu'à travers une coupe : elles servent de face de coupe pleine.
  matiere.side = THREE.DoubleSide;
  matiere.onBeforeCompile = (shader) => {
    Object.assign(shader.uniforms, uniformes, { uFaceExterieure: { value: exterieur } });
    shader.vertexShader = shader.vertexShader
      .replace("#include <common>", "#include <common>\nvarying vec3 vPosMonde;\nvarying vec3 vNormaleMonde;")
      .replace(
        "#include <beginnormal_vertex>",
        "#include <beginnormal_vertex>\nvNormaleMonde = normalize(mat3(modelMatrix) * objectNormal);"
      )
      .replace(
        "#include <begin_vertex>",
        "#include <begin_vertex>\nvPosMonde = (modelMatrix * vec4(transformed, 1.0)).xyz;"
      );
    shader.fragmentShader = shader.fragmentShader
      .replace(
        "#include <common>",
        `#include <common>
varying vec3 vPosMonde;
varying vec3 vNormaleMonde;
uniform sampler2D uGrain;
uniform sampler2D uVentre;
uniform int uMode;
uniform float uCoupeY;
uniform vec2 uPts[4];
uniform vec3 uCouleurAvant;
uniform vec3 uCouleurArriere;
uniform int uFocus;
uniform float uFocusMix;
uniform float uMasque;
uniform int uSurvol;
uniform int uMorceau;
uniform float uMasqueMorceau;
uniform sampler2D uLargeurs;
uniform bool uFaceExterieure;
${GLSL_CLASSER_POINT}
float distanceSegment(vec2 p, vec2 a, vec2 b) {
  vec2 ab = b - a;
  float t = clamp(dot(p - a, ab) / dot(ab, ab), 0.0, 1.0);
  return length(p - (a + ab * t));
}`
      )
      .replace(
        "#include <roughnessmap_fragment>",
        "#include <roughnessmap_fragment>\nroughnessFactor = 0.55;"
      )
      .replace(
        "#include <normal_fragment_maps>",
        "vec3 normaleSansCarte = normal;\n#include <normal_fragment_maps>\nnormal = normalize(mix(normal, normaleSansCarte, flanc));"
      )
      .replace(
        "#include <map_fragment>",
        `#include <map_fragment>
// Flancs très inclinés (dos, ventre, dessus de la cuisse) : les photos, prises de face, y sont étirées.
// On y pose un vrai morceau de la photo extérieure (couverture de gras rosée et marbrée), répété sans raccord
// visible et teinté par la couleur locale de la photo.
vec3 nMonde = normalize(vNormaleMonde) * (gl_FrontFacing ? 1.0 : -1.0);
// Uniquement sur la face extérieure : sur la face de fente, le bord est une coupe (pas de gras de couverture).
float flanc = uFaceExterieure ? smoothstep(0.7, 0.33, abs(nMonde.x)) : 0.0;
#ifdef USE_MAP
if (flanc > 0.0) {
  vec3 teinteLisse = texture(map, vMapUv, 7.0).rgb;
  float poidsY = abs(nMonde.y) / (abs(nMonde.y) + abs(nMonde.z) + 1e-4);
  vec2 cz = vPosMonde.xy * 2.2;
  vec2 cy = vPosMonde.xz * 2.2;
  vec3 motifZ = mix(texture(uGrain, cz).rgb, texture(uGrain, cz * 0.43 + vec2(0.37, 0.11)).rgb, 0.25);
  vec3 motifY = mix(texture(uGrain, cy).rgb, texture(uGrain, cy * 0.43 + vec2(0.19, 0.53)).rgb, 0.25);
  vec3 motif = mix(motifZ, motifY, poidsY);
  vec3 moyenneMotif = textureLod(uGrain, vec2(0.5), 12.0).rgb;
  vec3 couverture = motif * mix(vec3(1.0), teinteLisse / max(moyenneMotif, vec3(0.05)), 0.35);
  // Côté ventre (flanc, poitrine) : peu de gras, la viande du flanchet et de la paroi apparaît.
  // Motif tiré d'une photo de carcasse côté ventre, étiré dans le sens de la hauteur.
  vec2 cv = vec2(vPosMonde.x * 3.2, vPosMonde.y * 1.25);
  vec3 viande = mix(texture(uVentre, cv).rgb, texture(uVentre, cv * 0.47 + vec2(0.29, 0.61)).rgb, 0.4);
  float cote = smoothstep(-0.15, 0.35, nMonde.z) * (1.0 - smoothstep(0.55, 0.85, abs(nMonde.y)));
  couverture = mix(couverture, viande, cote);
  diffuseColor.rgb = mix(diffuseColor.rgb, couverture, flanc);
}
#endif
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
  // Gros morceau de ce pixel : même règle que data/zonesBoeuf.js, calculée au pixel pour des bords nets.
  float ft = y / 2.5 * ${TRANCHES}.0 - 0.5;
  int t0 = clamp(int(floor(ft)), 0, ${TRANCHES - 1});
  int t1 = min(t0 + 1, ${TRANCHES - 1});
  vec2 zl = mix(texelFetch(uLargeurs, ivec2(t0, 0), 0).rg, texelFetch(uLargeurs, ivec2(t1, 0), 0).rg, clamp(ft - float(t0), 0.0, 1.0));
  float largeur = clamp((z - zl.x) / max(zl.y - zl.x, 1e-4), 0.0, 1.0);
  int code = classerPoint(avant, y, largeur, uFaceExterieure);
  if (!gl_FrontFacing) {
    base = ${COULEUR_COUPE};
    colore = base;
  }
  if (uFocus > 0) {
    bool choisi = (uFocus == 1) == avant;
    // Partie écartée : elle s'efface en fondu par tramage (pas de transparence à trier).
    float bruit = fract(52.9829189 * fract(dot(gl_FragCoord.xy, vec2(0.06711056, 0.00583715))));
    if (!choisi && uMasque > 0.0 && bruit < uMasque) discard;
    // Gros morceau isolé : les autres morceaux s'effacent de la même façon.
    if (uMorceau > 0 && code != uMorceau && bruit < uMasqueMorceau) discard;
    float gris = dot(base, vec3(0.299, 0.587, 0.114));
    vec3 eteint = mix(colore, vec3(gris) * 0.45, 0.85);
    vec3 eclaire = gl_FrontFacing ? mix(base, teinte, 0.12) : base;
    diffuseColor.rgb = choisi ? mix(colore, eclaire, uFocusMix) : mix(colore, eteint, uFocusMix);
    // Morceau survolé : il s'éclaircit, les autres morceaux du quartier passent légèrement en retrait.
    if (choisi && uSurvol > 0) {
      diffuseColor.rgb = code == uSurvol ? mix(diffuseColor.rgb, vec3(1.0), 0.3) : diffuseColor.rgb * 0.72;
    }
  } else {
    diffuseColor.rgb = colore;
  }
  // Sur un morceau isolé, le trait de coupe n'a plus de sens.
  float visibiliteTrait = (uMorceau > 0 ? 1.0 - uMasqueMorceau : 1.0) * (gl_FrontFacing ? 1.0 : 0.0);
  float bord = (1.0 - smoothstep(0.012, 0.018, trait)) * visibiliteTrait;
  float coeur = (1.0 - smoothstep(0.006, 0.009, trait)) * visibiliteTrait;
  diffuseColor.rgb = mix(diffuseColor.rgb, vec3(0.1), bord);
  diffuseColor.rgb = mix(diffuseColor.rgb, vec3(1.0), coeur);
}`
      );
  };
  matiere.customProgramCacheKey = () => "coupe-carcasse-pixels";
  matiere.needsUpdate = true;
};

const easing = (t) => 1 - Math.pow(1 - t, 3);

const NOM_COURT = { avant: "l'avant", arriere: "l'arrière" };

/**
 * parties : { avant: { titre, description }, arriere: { titre, description } }
 * onExplorer(partie) : appelé quand l'utilisateur veut ouvrir les pièces du quartier choisi.
 * onExplorerMorceau(morceau) : idem pour un gros morceau (voir data/zonesBoeuf.js).
 * onSelection(partie) et onMorceau(idMorceau) : signalent le quartier et le morceau affichés.
 */
const Carcasse3D = ({
  ref,
  modele = "/models/demi_carcasse_boeuf_v9.glb",
  apercu = "/models/demi_carcasse_boeuf_v7_apercu.webp",
  coupe = null, parties, onExplorer, onExplorerMorceau, onSelection, onMorceau, partieInitiale = null }) => {
  const conteneurRef = useRef(null);
  const infobulleRef = useRef(null);
  const actionsRef = useRef(null);
  const uniformesRef = useRef(creerUniformes());
  const largeursRef = useRef(null);
  const coupeRef = useRef(coupe);
  // Quartier et morceau affichés, lus par les gestionnaires de la 3D.
  const niveauRef = useRef({ partie: null, morceau: 0 });
  const [etat, setEtat] = useState("chargement");
  const [vueActive, setVueActive] = useState("fente");
  const [selection, setSelection] = useState(null);
  const [morceau, setMorceau] = useState(0);
  const [designe, setDesigne] = useState(null);
  const [tactile] = useState(ecranTactile);
  const [progression, setProgression] = useState(0);

  useEffect(() => {
    const conteneur = conteneurRef.current;
    if (!conteneur) return undefined;
    const uniformes = uniformesRef.current;
    const grain = new THREE.TextureLoader().load("/models/couverture_dos_v2.webp");
    grain.wrapS = THREE.RepeatWrapping;
    grain.wrapT = THREE.RepeatWrapping;
    grain.colorSpace = THREE.SRGBColorSpace;
    uniformes.uGrain.value = grain;
    const ventre = new THREE.TextureLoader().load("/models/flanc_ventre.webp");
    ventre.wrapS = THREE.RepeatWrapping;
    ventre.wrapT = THREE.RepeatWrapping;
    ventre.colorSpace = THREE.SRGBColorSpace;
    uniformes.uVentre.value = ventre;

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
    // Seconde lumière, plus douce, pour que la face extérieure ne reste pas dans l'ombre.
    const contreJour = new THREE.DirectionalLight(0xffffff, 0.55);
    contreJour.position.set(-2.5, 2, -1);
    scene.add(contreJour);

    const camera = new THREE.PerspectiveCamera(35, 1, 0.05, 50);
    const controles = new OrbitControls(camera, rendu.domElement);
    controles.target.copy(CENTRE);
    controles.enablePan = false;
    controles.enableDamping = true;
    controles.dampingFactor = 0.08;
    controles.rotateSpeed = 0.9;
    controles.minPolarAngle = Math.PI / 2;
    controles.maxPolarAngle = Math.PI / 2;
    controles.minDistance = 0.5;
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
    let boitesMorceaux = null;
    let masqueCible = 0;
    let masqueMorceauCible = 0;
    let dernierInstant = performance.now();
    let pointsPistolet = null;

    const allerVers = (cle) => {
      masqueCible = 0;
      masqueMorceauCible = 0;
      animer({ cible: CENTRE, angle: VUES[cle].angle, distance: distanceIdeale(), focus: 0 });
    };

    // Le bas du cadre est occupé par la fiche : on cadre la boîte dans l'espace libre au-dessus.
    const cadrer = (boite, { reserveMobile, reserveBureau, marge, angle, centreSurAxe = false }) => {
      const centre = boite.getCenter(new THREE.Vector3());
      const taille = boite.getSize(new THREE.Vector3());
      const hauteurCadre = conteneur.clientHeight || 600;
      const reserve = conteneur.clientWidth < 600 ? reserveMobile : reserveBureau;
      const libre = THREE.MathUtils.clamp(1 - reserve / hauteurCadre, 0.45, 0.85);
      // Les faces les plus proches de la caméra paraissent plus grandes : on recule d'une demi-profondeur.
      const profondeur = centreSurAxe ? taille.x / 2 : Math.max(taille.z, taille.x) / 2;
      const distance = distancePour((taille.y * marge) / libre, Math.max(taille.z, taille.x) * marge * 1.1) + profondeur;
      const hauteurVisible = 2 * distance * Math.tan(THREE.MathUtils.degToRad(camera.fov) / 2);
      animer({
        cible: new THREE.Vector3(centreSurAxe ? 0 : centre.x, centre.y - (hauteurVisible * (1 - libre)) / 2, centreSurAxe ? 0 : centre.z),
        angle,
        distance,
        focus: 1,
      });
    };

    // Quartier choisi : l'autre quartier s'efface et la caméra se rapproche.
    const zoomerSur = (partie) => {
      if (!boites) return;
      masqueCible = 1;
      masqueMorceauCible = 0;
      cadrer(boites[partie], { reserveMobile: 200, reserveBureau: 170, marge: 1.1, centreSurAxe: true });
    };

    // Gros morceau choisi : seul ce morceau reste visible, vu de sa meilleure face.
    const zoomerSurMorceau = (code) => {
      const boite = boitesMorceaux?.[code];
      if (!boite) return;
      masqueCible = 1;
      masqueMorceauCible = 1;
      const vue = morceauParCode(code)?.vue;
      cadrer(boite, { reserveMobile: 250, reserveBureau: 200, marge: 1.2, angle: vue ? VUES[vue].angle : undefined });
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
    let modeleCharge = null;

    // Quartier et gros morceau sous le pointeur. Les parties effacées sont traversées.
    const cibleSousLePointeur = (event) => {
      if (!modeleCharge) return null;
      const r = rendu.domElement.getBoundingClientRect();
      pointeur.set(((event.clientX - r.left) / r.width) * 2 - 1, -((event.clientY - r.top) / r.height) * 2 + 1);
      raycaster.setFromCamera(pointeur, camera);
      const { partie: partieIsolee, morceau: morceauIsole } = niveauRef.current;
      for (const impact of raycaster.intersectObject(modeleCharge, true)) {
        const code = morceauDuPoint(
          largeursRef.current,
          (y, z) => estAvantPistolet(pointsPistolet, y, z),
          impact.point,
          impact.object.userData.faceExterieure
        );
        const partie = morceauParCode(code)?.quartier;
        if (!partie) continue;
        if (morceauIsole && code !== morceauIsole) continue;
        if (partieIsolee && partie !== partieIsolee) continue;
        return { partie, code };
      }
      return null;
    };

    const masquerInfobulle = () => {
      if (infobulleRef.current) infobulleRef.current.style.display = "none";
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
      const r = rendu.domElement.getBoundingClientRect();
      actionsRef.current?.toucher(cibleSousLePointeur(event), {
        souris: event.pointerType === "mouse",
        x: event.clientX - r.left,
        y: event.clientY - r.top,
      });
    };
    const surSurvol = (event) => {
      if (event.pointerType !== "mouse" || appui) return;
      const cible = cibleSousLePointeur(event);
      const { partie, morceau: morceauIsole } = niveauRef.current;
      rendu.domElement.style.cursor = cible && !morceauIsole ? "pointer" : "grab";
      // Survol des gros morceaux, une fois dans un quartier.
      const code = partie && !morceauIsole && cible ? cible.code : 0;
      uniformesRef.current.uSurvol.value = code;
      const infobulle = infobulleRef.current;
      if (!infobulle) return;
      if (!code) {
        masquerInfobulle();
        return;
      }
      const r = rendu.domElement.getBoundingClientRect();
      infobulle.firstChild.textContent = morceauParCode(code).nom;
      infobulle.style.display = "block";
      infobulle.style.left = `${event.clientX - r.left}px`;
      infobulle.style.top = `${event.clientY - r.top}px`;
    };
    const surSortie = () => {
      if (!niveauRef.current.morceau && !actionsRef.current?.designeActif()) uniformesRef.current.uSurvol.value = 0;
      masquerInfobulle();
    };
    rendu.domElement.addEventListener("pointerdown", surAppui);
    rendu.domElement.addEventListener("pointerup", surRelache);
    rendu.domElement.addEventListener("pointermove", surSurvol);
    rendu.domElement.addEventListener("pointerleave", surSortie);

    actionsRef.current = {
      allerVers,
      zoomer,
      zoomerSur,
      zoomerSurMorceau,
      toucher: () => {},
      designeActif: () => false,
    };
    controles.addEventListener("start", () => {
      if (animation) {
        uniformesRef.current.uFocusMix.value = animation.focusFin;
        if (animation.focusFin === 0) uniformesRef.current.uFocus.value = 0;
      }
      animation = null;
      masquerInfobulle();
      setVueActive(null);
    });

    let annule = false;
    new GLTFLoader().setMeshoptDecoder(MeshoptDecoder).load(
      modele,
      (gltf) => {
        if (annule) return;
        const largeurs = mesurerLargeurs(gltf.scene);
        largeursRef.current = largeurs;
        uniformesRef.current.uLargeurs.value = texturerLargeurs(largeurs);
        pointsPistolet = PISTOLET.trace.map(
          (p) => new THREE.Vector2(p.hauteur, versPositionZ(largeurs, p.hauteur, p.largeur))
        );
        boites = mesurerParties(gltf.scene, pointsPistolet);
        boitesMorceaux = mesurerMorceaux(gltf.scene, largeurs, (y, z) => estAvantPistolet(pointsPistolet, y, z));
        gltf.scene.traverse((objet) => {
          if (objet.isMesh) {
            objet.userData.faceExterieure = estFaceExterieure(objet);
            const matieres = Array.isArray(objet.material) ? objet.material : [objet.material];
            matieres.forEach((m) => brancherCoupe(m, uniformesRef.current, objet.userData.faceExterieure));
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

    // Fondu d'environ 0,6 s, indépendant du mouvement de caméra.
    const approcher = (valeur, cible, ecoule) =>
      Math.abs(valeur - cible) > 0.001 ? valeur + (cible - valeur) * (1 - Math.exp(-ecoule / 160)) : cible;

    rendu.setAnimationLoop(() => {
      const instant = performance.now();
      const ecoule = instant - dernierInstant;
      dernierInstant = instant;
      const u = uniformesRef.current;
      u.uMasque.value = approcher(u.uMasque.value, masqueCible, ecoule);
      u.uMasqueMorceau.value = approcher(u.uMasqueMorceau.value, masqueMorceauCible, ecoule);
      // Les autres morceaux sont revenus : on oublie le morceau isolé.
      if (masqueMorceauCible === 0 && u.uMasqueMorceau.value === 0) u.uMorceau.value = 0;
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
      rendu.domElement.removeEventListener("pointerleave", surSortie);
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
      uniformes.uLargeurs.value?.dispose();
      grain.dispose();
      ventre.dispose();
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

  const changerNiveau = (partie, code) => {
    niveauRef.current = { partie, morceau: code };
    setSelection(partie);
    setMorceau(code);
    setDesigne(null);
    onSelection?.(partie);
    onMorceau?.(code ? morceauParCode(code).id : null);
    const u = uniformesRef.current;
    u.uSurvol.value = 0;
    if (code) u.uMorceau.value = code;
    if (partie) {
      u.uFocus.value = partie === "avant" ? 1 : 2;
      appliquerAffichage(coupeRef.current, partie);
    }
  };

  // Choisir un quartier : il est isolé directement, on peut ensuite viser ses gros morceaux.
  const choisir = (partie) => {
    changerNiveau(partie, 0);
    actionsRef.current?.zoomerSur(partie);
  };

  const choisirMorceau = (code) => {
    const info = morceauParCode(code);
    if (!info) return;
    changerNiveau(info.quartier, code);
    actionsRef.current?.zoomerSurMorceau(code);
  };

  const toutVoir = () => {
    niveauRef.current = { partie: null, morceau: 0 };
    setSelection(null);
    setMorceau(0);
    setDesigne(null);
    uniformesRef.current.uSurvol.value = 0;
    onSelection?.(null);
    onMorceau?.(null);
    setVueActive("fente");
    actionsRef.current?.allerVers("fente");
  };

  // Appui ou clic sur la carcasse, selon l'endroit où l'on se trouve.
  const toucher = (cible, { souris, x, y }) => {
    const { partie, morceau: morceauIsole } = niveauRef.current;
    if (morceauIsole) return;
    if (!partie) {
      if (cible) choisir(cible.partie);
      return;
    }
    if (!cible) {
      setDesigne(null);
      uniformesRef.current.uSurvol.value = 0;
      return;
    }
    // À la souris, le survol a déjà désigné le morceau : le clic zoome.
    if (souris || designe?.code === cible.code) {
      choisirMorceau(cible.code);
      return;
    }
    // Au doigt : premier appui, le morceau s'éclaircit et son nom s'affiche.
    uniformesRef.current.uSurvol.value = cible.code;
    setDesigne({ code: cible.code, x, y });
  };

  // Survol d'un bouton de morceau sous la 3D : on éclaire le morceau correspondant.
  const survoler = (idMorceau) => {
    if (niveauRef.current.morceau) return;
    const info = idMorceau ? morceauParId(idMorceau) : null;
    uniformesRef.current.uSurvol.value = info && info.quartier === niveauRef.current.partie ? info.code : designe?.code ?? 0;
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
    choisirMorceau: (idMorceau) => choisirMorceau(morceauParId(idMorceau)?.code),
    survoler: (idMorceau) => survoler(idMorceau),
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
      actionsRef.current.toucher = toucher;
      actionsRef.current.designeActif = () => Boolean(designe);
    }
  });

  const changerVue = (cle) => {
    setVueActive(cle);
    if (selection) {
      niveauRef.current = { partie: null, morceau: 0 };
      setSelection(null);
      setMorceau(0);
      setDesigne(null);
      uniformesRef.current.uSurvol.value = 0;
      onSelection?.(null);
      onMorceau?.(null);
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

  const styleBoutonFiche = {
    rounded: "full",
    flex: { base: 1, md: "none" },
    minW: 0,
    px: { base: 3, md: 5 },
  };

  const infoPartie = selection && parties ? parties[selection] : null;
  const infoMorceau = morceau ? morceauParCode(morceau) : null;
  const infoDesigne = designe ? morceauParCode(designe.code) : null;

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
        aria-label="Demi-carcasse de bœuf en 3D. Touchez l'avant ou l'arrière pour zoomer dessus, puis un gros morceau pour le voir seul. Glissez pour la faire pivoter."
      />

      {/* Nom du morceau survolé à la souris, déplacé directement par la 3D. */}
      <Box
        ref={infobulleRef}
        display="none"
        position="absolute"
        pointerEvents="none"
        transform="translate(14px, -50%)"
        bg="white"
        boxShadow="carte"
        rounded="lg"
        px={3}
        py={2}
        zIndex={2}
        aria-hidden="true"
      >
        <Text fontWeight="bold" color="brand.rouge" fontSize="sm" whiteSpace="nowrap" />
        <Text color="gray.600" fontSize="xs" whiteSpace="nowrap">
          Cliquez pour zoomer
        </Text>
      </Box>

      {/* Au doigt : bulle du morceau désigné par un premier appui. */}
      {infoDesigne && (
        <Box
          position="absolute"
          left={`${designe.x}px`}
          top={`${designe.y}px`}
          transform={designe.y < 90 ? "translate(-50%, 18px)" : "translate(-50%, calc(-100% - 18px))"}
          maxW="70%"
          bg="white"
          boxShadow="carteSurvol"
          rounded="lg"
          px={3}
          py={2}
          zIndex={2}
          pointerEvents="none"
          textAlign="center"
          role="status"
        >
          <Text fontWeight="bold" color="brand.rouge" fontSize="sm">
            {infoDesigne.nom}
          </Text>
          <Text color="gray.600" fontSize="xs">
            Touchez encore pour zoomer
          </Text>
        </Box>
      )}

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
              key={infoMorceau ? infoMorceau.id : selection}
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
              <Flex justify="space-between" align="start" gap={2} mb={1}>
                <Box>
                  {infoMorceau && (
                    <Text fontSize="xs" fontWeight="bold" textTransform="uppercase" letterSpacing="wide" color="gray.600">
                      {infoPartie.titre}
                    </Text>
                  )}
                  <Heading as="h2" fontFamily="title" fontSize="xl" color="brand.rouge" lineHeight="1.2" pt={infoMorceau ? 0 : 1}>
                    {infoMorceau ? infoMorceau.nom : infoPartie.titre}
                  </Heading>
                </Box>
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
              <Text fontSize="sm" color="gray.700" mb={3}>
                {infoMorceau
                  ? infoMorceau.description
                  : tactile
                    ? "Touchez un morceau pour le repérer, puis touchez-le encore pour le voir seul."
                    : "Survolez un morceau pour le repérer, puis cliquez dessus pour le voir seul."}
              </Text>
              <Flex gap={2}>
                <Button
                  onClick={() => (infoMorceau ? onExplorerMorceau?.(infoMorceau) : onExplorer?.(selection))}
                  bg="brand.rouge"
                  color="white"
                  _hover={{ bg: "brand.rougeFonce" }}
                  {...styleBoutonFiche}
                >
                  Voir les pièces <FiArrowRight aria-hidden="true" />
                </Button>
                {infoMorceau && (
                  <Button
                    onClick={() => choisir(selection)}
                    variant="outline"
                    borderColor="gray.300"
                    color="brand.gris"
                    {...styleBoutonFiche}
                  >
                    <FiArrowLeft aria-hidden="true" />
                    Retour à {NOM_COURT[selection]}
                  </Button>
                )}
              </Flex>
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
