"use client";

// Libraries
import { Canvas } from "@react-three/fiber";
import { useEffect, useRef, useState } from "react";
import { OrbitControls, useGLTF } from "@react-three/drei";

// Styles
import "@/styles/App.css";
import "@/styles/Header.css";

// Components
import PatternDrawings from "@/app/components/PatternDrawing";
import Parameter from "@/app/components/Parameters/Slider/Slider";
import Header from "@/app/components/Header";
import HatMesh from "@/app/components/HatMesh";
import ExportButton from "./components/ExportButton/ExportButton";

// Utils
import { hatMeasurements } from "@/utils/hatMeasurements";
import { useResponsiveScroll } from "@/hooks/useResponsiveScroll";
import ControlPanel from "@/app/components/ControlPanel";
import HeadModel from "./components/HeadModel";
import Footer from "./components/Footer/Footer";
import Head from "next/head";

export default function Home() {
  const exportButtonRef = useRef(null);
  const exportContainerRef = useRef();
  const graphicContainer = useRef(null);
  const configuratorRef = useRef(null);
  const canvasRef = useRef(null);

  useResponsiveScroll(graphicContainer, exportContainerRef, configuratorRef);

  const [params, setParams] = useState(
    hatMeasurements({
      headHeight: 80,
      headCircumference: 580,
      brimWidth: 55,
      brimAngle: 30,
      headRatio: 0.99,
      seamAllowance: 15,
      fabricStiffness: 9.11,
      fabricWeight: 11.22,
      cannonGravity: 90,
      simulation: true,
      headModel: false,
      isMillimeter: true,
      paperSize: "a4",
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
      let updatedValue;
      if (name == "paperSize") {
        updatedValue = value;
      } else {
        updatedValue = parseFloat(value);
      }
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
        headHeight: 75,
        headCircumference: 580,
        brimWidth: 45,
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
            <Canvas
              ref={canvasRef}
              camera={{ position: [650, -300, 430], fov: 28, near: 100, far: 5000 }}
            >
              <OrbitControls />
              <directionalLight position={[1, 1, 1]} />
              <directionalLight position={[1, -0.5, 0]} />
              <HatMesh params={params} />
              <ambientLight />
              {params.headModel ? <HeadModel props={{ scale: [2000, 2000, 2000] }} /> : null}
            </Canvas>
            <ExportButton
              containerRef={exportContainerRef}
              exportButtonRef={exportButtonRef}
              onChange={handleMeasurementChange}
            />
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
      <Footer />
    </>
  );
}
