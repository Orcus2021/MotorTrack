import adiva from "../assets/brands/Avida.png";
import aeon from "../assets/brands/Aeonmotor.png";
import aprilia from "../assets/brands/Aprilia.png";
import benelli from "../assets/brands/Benelli.png";
import bmw from "../assets/brands/BMW.png";
import canAm from "../assets/brands/Can-Am.png";
import cpi from "../assets/brands/CPI.png";
import eMoving from "../assets/brands/eMOVING.png";
import energica from "../assets/brands/Energica.png";
import eReady from "../assets/brands/eReady.png";
import gilera from "../assets/brands/Gilera.png";
import gogoro from "../assets/brands/Gogoro.png";
import harleyDavidson from "../assets/brands/Harley-Davidson.png";
import hartford from "../assets/brands/Hartford.png";
import honda from "../assets/brands/Honda.png";
import husqvarna from "../assets/brands/Husqvarna.png";
import indian from "../assets/brands/Indian.png";
import kawasaki from "../assets/brands/Kawasaki.png";
import kymco from "../assets/brands/Kymco.png";
import ktm from "../assets/brands/KTM.png";
import motoGuzzi from "../assets/brands/MotoGuzzi.png";
import mvaGusta from "../assets/brands/MVAgusta.png";
import peugeot from "../assets/brands/Peugeot.png";
import pgo from "../assets/brands/PGO.png";
import piaggio from "../assets/brands/Piaggio.png";
import royalEnfield from "../assets/brands/Royal-Enfield.png";
import sheLung from "../assets/brands/She-Lung.png";
import songYing from "../assets/brands/SongYing.png";
import suzuki from "../assets/brands/Suzuki.png";
import sym from "../assets/brands/SYM.png";
import triumph from "../assets/brands/Triumph.png";
import vespa from "../assets/brands/Vespa.png";
import victory from "../assets/brands/Victory.png";
import yamaha from "../assets/brands/Yamaha.png";
import zeroEngineering from "../assets/brands/ZeroEngineering.png";

const brands = new Map([
  ["adiva", { name: "Adiva", img: adiva, key: "adiva" }],
  ["aeon", { name: "Aeon", img: aeon, key: "aeon" }],
  ["aprilia", { name: "Aprilia", img: aprilia, key: "aprilia" }],
  ["benelli", { name: "Benelli", img: benelli, key: "benelli" }],
  ["bmw", { name: "BMW", img: bmw, key: "bmw" }],
  ["canAm", { name: "Can-Am", img: canAm, key: "canAm" }],
  ["cpi", { name: "CPI", img: cpi, key: "cpi" }],
  ["eMoving", { name: "eMOVING", img: eMoving, key: "eMoving" }],
  ["energica", { name: "Energica", img: energica, key: "energica" }],
  ["eReady", { name: "eReady", img: eReady, key: "eReady" }],
  ["gilera", { name: "Gilera", img: gilera, key: "gilera" }],
  ["gogoro", { name: "Gogoro", img: gogoro, key: "gogoro" }],
  [
    "harleyDavidson",
    { name: "Harley-Davidson", img: harleyDavidson, key: "harleyDavidson" },
  ],
  ["hartford", { name: "Hartford", img: hartford, key: "hartford" }],
  ["honda", { name: "Honda", img: honda, key: "honda" }],
  ["husqvarna", { name: "Husqvarna", img: husqvarna, key: "husqvarna" }],
  ["indian", { name: "Indian", img: indian, key: "indian" }],
  ["kawasaki", { name: "Kawasaki", img: kawasaki, key: "kawasaki" }],
  ["ktm", { name: "KTM", img: ktm, key: "ktm" }],
  ["kymco", { name: "Kymco", img: kymco, key: "kymco" }],
  ["motoGuzzi", { name: "MotoGuzzi", img: motoGuzzi, key: "motoGuzzi" }],
  ["mvaGusta", { name: "MVAgusta", img: mvaGusta, key: "mvaGusta" }],
  ["peugeot", { name: "Peugeot", img: peugeot, key: "peugeot" }],
  ["pgo", { name: "PGO", img: pgo, key: "pgo" }],
  ["piaggio", { name: "Piaggio", img: piaggio, key: "piaggio" }],
  [
    "royalEnfield",
    { name: "Royal-Enfield", img: royalEnfield, key: "royalEnfield" },
  ],
  ["sheLung", { name: "She-Lung", img: sheLung, key: "sheLung" }],
  ["songYing", { name: "SongYing", img: songYing, key: "songYing" }],
  ["suzuki", { name: "Suzuki", img: suzuki, key: "suzuki" }],
  ["sym", { name: "SYM", img: sym, key: "sym" }],
  ["triumph", { name: "Triumph", img: triumph, key: "triumph" }],
  ["vespa", { name: "Vespa", img: vespa, key: "vespa" }],
  ["victory", { name: "Victory", img: victory, key: "victory" }],
  ["yamaha", { name: "Yamaha", img: yamaha, key: "yamaha" }],
  [
    "zeroEngineering",
    { name: "ZeroEngineering", img: zeroEngineering, key: "zeroEngineering" },
  ],
]);
export type brandsMapType = {
  name: string;
  img: string;
  key: string;
};
export default brands;
