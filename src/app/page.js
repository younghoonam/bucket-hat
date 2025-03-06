"use client";

// Libraries
import { Canvas } from "@react-three/fiber";
import { useEffect, useRef, useState } from "react";
import { OrbitControls, useGLTF } from "@react-three/drei";

// Styles
import "@/styles/App.css";

// Components
import PatternDrawings from "@/app/components/PatternDrawing";
import Parameter from "@/app/components/Parameters/Slider/Slider";
import Header from "@/app/components/Header";
import HatMesh from "@/app/components/HatMesh";

// Utils
import { hatMeasurements } from "@/utils/hatMeasurements";
import { useResponsiveScroll } from "@/hooks/useResponsiveScroll";
import ControlPanel from "@/app/components/ControlPanel";

export default function Home() {
  const exportButtonRef = useRef(null);
  const graphicContainer = useRef(null);
  const configuratorRef = useRef(null);

  useResponsiveScroll(graphicContainer, exportButtonRef, configuratorRef);

  const [params, setParams] = useState(
    hatMeasurements({
      headHeight: 80,
      headCircumference: 580,
      brimWidth: 55,
      brimAngle: 30,
      headRatio: 0.95,
      seamAllowance: 10,
      fabricStiffness: 8,
      fabricWeight: 12,
      cannonGravity: 90,
      simulation: true,
      headModel: false,
    })
  );

  function handleMeasurementChange(event) {
    if (event.target.type == "checkbox") {
      const { name, checked } = event.target;
      setParams((prevParams) => {
        return {
          ...prevParams,
          [name]: checked,
        };
      });
    } else {
      const { name, value } = event.target;

      // Parse numeric value and update state
      const updatedValue = parseFloat(value);
      const updatedMeasurements = {
        ...params,
        [name]: updatedValue,
      };

      setParams(hatMeasurements(updatedMeasurements));
    }
  }

  function setPreset(event) {
    const preset = event.target.value;

    const presetParams = {
      universal: {
        headHeight: 80,
        headCircumference: 580,
        brimWidth: 55,
        brimAngle: 30,
        headRatio: 0.95,
      },
      large: {
        headHeight: 90,
        headCircumference: 620,
        brimWidth: 60,
        brimAngle: 35,
        headRatio: 0.99,
      },
      small: {
        headHeight: 70,
        headCircumference: 540,
        brimWidth: 50,
        brimAngle: 25,
        headRatio: 0.9,
      },
      wideBrim: {
        headHeight: 80,
        headCircumference: 580,
        brimWidth: 80,
        brimAngle: 40,
        headRatio: 0.95,
      },
      lowBrim: {
        headHeight: 80,
        headCircumference: 580,
        brimWidth: 50,
        brimAngle: 70,
        headRatio: 0.95,
      },
    };

    if (presetParams[preset]) {
      setParams((prevParams) => {
        return hatMeasurements({
          ...prevParams, // Keep other properties unchanged
          ...presetParams[preset], // Apply preset
        });
      });
    }
  }

  return (
    <>
      <Header />
      <main>
        <div ref={configuratorRef} className="configurator">
          <div ref={graphicContainer} className="graphic-container">
            <PatternDrawings params={params} exportButton={exportButtonRef} />
            <Canvas camera={{ position: [0, 500, 500], fov: 30, far: 50000 }} shadows>
              <OrbitControls />
              <directionalLight position={[1, 1, 1]} />
              <directionalLight position={[1, -0.5, 0]} />
              <HatMesh params={params} />
              <ambientLight />
            </Canvas>
            <button ref={exportButtonRef} id="export-button">
              Export to PDF
            </button>
          </div>
          <aside className="panel">
            <ControlPanel
              params={params}
              onMeasurementChange={handleMeasurementChange}
              setPreset={setPreset}
            />
          </aside>
        </div>
      </main>
    </>
  );
}
