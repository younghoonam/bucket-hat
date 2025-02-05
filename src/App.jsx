import { Canvas } from "@react-three/fiber";
import { useRef, useState } from "react";
import ThreeCircles from "./ThreeCircles";
import "./App.css";
import { OrbitControls } from "@react-three/drei";
import LineChart from "./LineChart";
import PatternDrawings from "./PatternDrawing";
import Parameter from "./Parameter";
import Header from "./Header";
import HatMesh from "./HatMesh";
import Cloth from "./Cloth";

export default function App() {
  const exportButtonRef = useRef(null);
  const [measurements, setMeasurements] = useState(
    calculateHatMeasurements({
      headHeight: 80,
      headCircumference: 580,
      brimWidth: 55,
      brimAngle: 30,
      seamAllowance: 10,
    })
  );

  function handleMeasurementChange(event) {
    const { name, value } = event.target;

    // Parse numeric value and update state
    const updatedValue = parseFloat(value);
    const updatedMeasurements = {
      ...measurements,
      [name]: updatedValue,
    };

    setMeasurements(calculateHatMeasurements(updatedMeasurements));
  }

  return (
    <>
      <Header />
      <main>
        <aside className="panel">
          <h1 className="title">Bucket Hat</h1>
          <span className="subtitle">Pattern Generator</span>
          <div className="ui-container">
            <Parameter
              min={500}
              max={650}
              defaultValue={measurements.headCircumference}
              onChange={handleMeasurementChange}
              id={"head-circumference"}
              name={"headCircumference"}
              label={"Head Circumference"}
              marks={[
                { value: 500, label: "500" },
                { value: 525, label: "525" },
                { value: 550, label: "550" },
                { value: 575, label: "575" },
                { value: 600, label: "600" },
                { value: 625, label: "625" },
                { value: 650, label: "650" },
              ]}
              ticks={31}
              tooltipText={
                "Measure the distance around your head at the widest point, typically just above your eyebrows and ears. This will ensure the hat fits comfortably."
              }
            />
            <Parameter
              min={70}
              max={90}
              defaultValue={measurements.headHeight}
              onChange={handleMeasurementChange}
              id={"head-height"}
              name={"headHeight"}
              label={"Height"}
              marks={[
                { value: 70, label: "70" },
                { value: 75, label: "75" },
                { value: 80, label: "80" },
                { value: 85, label: "85" },
                { value: 90, label: "90" },
              ]}
              ticks={21}
              tooltipText={
                "Measure the vertical distance from the top of your head (crown) to the point where you want the brim of the hat to sit."
              }
            />
            <Parameter
              min={30}
              max={120}
              defaultValue={measurements.brimWidth}
              onChange={handleMeasurementChange}
              id={"brim-width"}
              name={"brimWidth"}
              label={"Brim Width"}
              marks={[
                { value: 30, label: "30" },
                { value: 60, label: "60" },
                { value: 90, label: "90" },
                { value: 120, label: "120" },
              ]}
              ticks={46}
              tooltipText={
                "Decide how wide you want the brim to be. This is the distance from the edge of the brim to where it meets the crown."
              }
            />
            <Parameter
              min={1}
              max={80}
              defaultValue={measurements.brimAngle}
              onChange={handleMeasurementChange}
              id={"brim-angle"}
              name={"brimAngle"}
              label={"Brim Angle"}
              marks={[
                { value: 1, label: "0" },
                { value: 20, label: "20" },
                { value: 40, label: "40" },
                { value: 60, label: "60" },
                { value: 80, label: "80" },
              ]}
              ticks={41}
              tooltipText={
                "Adjust the tilt of the brim. A larger angle creates a more flared look, while a smaller angle keeps it flatter."
              }
            />
            <Parameter
              min={0}
              max={20}
              defaultValue={measurements.seamAllowance}
              onChange={handleMeasurementChange}
              id={"seam-allowance"}
              name={"seamAllowance"}
              label={"Seam Allowance"}
              marks={[
                { value: 0, label: "0" },
                { value: 5, label: "5" },
                { value: 10, label: "10" },
                { value: 15, label: "15" },
                { value: 20, label: "20" },
              ]}
              ticks={21}
              tooltipText={
                "Add extra fabric to the edges of your pattern for sewing. This ensures durability and a proper fit after stitching."
              }
            />
          </div>
        </aside>
        <div className="graphic-container">
          <PatternDrawings
            measurements={measurements}
            exportButton={exportButtonRef}
          />
          <Canvas camera={{ position: [0, 500, 500], fov: 30 }}>
            <OrbitControls enableZoom={false} />
            {/* <ThreeCircles props={measurements} /> */}
            <HatMesh measurements={measurements} />
            {/* <Cloth /> */}
            <ambientLight />
          </Canvas>
          <button ref={exportButtonRef} id="export-button">
            Export to PDF
          </button>
        </div>
      </main>
      {/* <footer>
      </footer> */}
    </>
  );
}

function calculateHatMeasurements({
  headHeight,
  headCircumference,
  brimWidth,
  brimAngle,
  seamAllowance,
}) {
  const headRatio = 0.95;
  const crownMultiplier = 0.9;

  // Helper function to convert degrees to radians
  const degreesToRad = (degrees) => degrees * (Math.PI / 180);

  // Common calculations
  const headRadius = headCircumference / (2 * Math.PI);
  const headA = Math.sqrt(
    (2 * Math.pow(headRadius, 2)) / (1 + Math.pow(headRatio, 2))
  );
  const headB = headA * headRatio;
  const headConeHeight = headHeight / (1 - headRatio);
  const headPieceWidth = Math.hypot();
  const brimAngleRad = degreesToRad(brimAngle);
  const brimOffset = brimWidth * Math.cos(Math.PI / 2 - brimAngleRad);
  const brimRadius =
    brimWidth * Math.sin(Math.PI / 2 - brimAngleRad) + headRadius;
  const brimA = headA + brimWidth * Math.cos(brimAngleRad);
  const brimB = headB + brimWidth * Math.cos(brimAngleRad);
  const crownA = headA * crownMultiplier;
  const crownB = headB * crownMultiplier;
  const crownRadius = headRadius * crownMultiplier;
  const crownDiameter = (headCircumference / Math.PI) * crownMultiplier;
  const crownCircumference = headCircumference * crownMultiplier;

  const headConeSlantA = Math.hypot(headA, headConeHeight);
  const headConeSlantB = Math.hypot(headB, headConeHeight);
  const headConeDevAngleA = (2 * Math.PI * headA) / headConeSlantA;
  const headConeDevAngleB = (2 * Math.PI * headB) / headConeSlantB;
  const headConeAngleDiff = headConeDevAngleA - headConeDevAngleB;
  const headConeDevAngle =
    headConeDevAngleA - headConeAngleDiff * (headB / headA);

  // Brim cone height calculation
  const brimConeHeight =
    (brimA * brimWidth * Math.sin(brimAngleRad)) / (brimA - headA);
  const brimConeSlantA = Math.hypot(brimA, brimConeHeight);
  const brimConeSlantB = Math.hypot(brimB, brimConeHeight);
  const brimConeDevAngleA = (2 * Math.PI * brimA) / brimConeSlantA;
  const brimConeDevAngleB = (2 * Math.PI * brimB) / brimConeSlantB;
  const angleDiff = brimConeDevAngleA - brimConeDevAngleB;
  const brimConeDevAngle = brimConeDevAngleA - angleDiff * (brimB / brimA);

  return {
    headRatio,
    headA,
    headB,
    headConeHeight,
    headConeDevAngle,
    headHeight,
    headCircumference,
    headRadius,
    headDiameter: 2 * headRadius,
    brimA,
    brimB,
    brimWidth,
    brimAngle,
    brimRadius,
    brimDiameter: brimRadius * 2,
    brimCircumference: brimRadius * 2 * Math.PI,
    brimOffset,
    brimConeHeight,
    brimConeDevAngle,
    crownRadius,
    crownA,
    crownB,
    crownDiameter,
    crownCircumference,
    seamAllowance,
  };
}
