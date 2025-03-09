// Components
import Parameter from "@/app/components/Parameters/Slider/Slider";
// import ParameterToggle from "@/app/components/ParameterToggle";

// Style
import Accordion from "./Parameters/Accorion/Accordion";
import PresetSelection from "./Parameters/PresetSelection/PresetSelection";
import Toggle from "./Parameters/Toggle/Toggle";

export default function ControlPanel({ params, onMeasurementChange, setPreset }) {
  return (
    <>
      <h1 className="title">Bucket Hat</h1>
      <span className="subtitle">Pattern Generator</span>
      <div className="ui-container">
        <PresetSelection onChange={setPreset} />

        <Toggle
          label={"Units"}
          onText="mm"
          offText="inch"
          id={"isMillimeter"}
          name={"isMillimeter"}
          defaultChecked={params.isMillimeter}
          onChange={onMeasurementChange}
        />

        <Toggle
          label={"Simulation"}
          id={"simulation"}
          name={"simulation"}
          defaultChecked={params.simulation}
          onChange={onMeasurementChange}
        />
        <Toggle
          label={"Head Model"}
          id={"headModel"}
          name={"headModel"}
          defaultChecked={params.headModel}
          onChange={onMeasurementChange}
        />

        <Parameter
          min={500}
          max={650}
          defaultValue={params.headCircumference}
          onChange={onMeasurementChange}
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
          tooltipText={"Measure the length around<br/>your head at the widest point."}
          isMillimeter={params.isMillimeter}
        />
        <Parameter
          min={70}
          max={90}
          defaultValue={params.headHeight}
          onChange={onMeasurementChange}
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
            "The vertical distance from<br/>the top of your head to the point where<br/>you want the brim to start."
          }
          isMillimeter={params.isMillimeter}
        />
        <Parameter
          min={30}
          max={120}
          defaultValue={params.brimWidth}
          onChange={onMeasurementChange}
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
          tooltipText={"The width of the brim"}
          isMillimeter={params.isMillimeter}
        />
        <Parameter
          min={1}
          max={80}
          defaultValue={params.brimAngle}
          onChange={onMeasurementChange}
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
            "The tilt of the brim. A smaller<br/>angle creates a more flared look, while a<br/>larger angle brings the brim down."
          }
        />
        <Parameter
          min={0}
          max={20}
          defaultValue={params.seamAllowance}
          onChange={onMeasurementChange}
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
          isMillimeter={params.isMillimeter}
        />

        <Accordion name={"Advanced Measurements"} id={"advancedMeasurements"}>
          <Parameter
            min={0.8}
            max={0.99}
            defaultValue={params.headRatio}
            step={0.01}
            onChange={onMeasurementChange}
            id={"headRatio"}
            name={"headRatio"}
            label={"Elliptical Ratio"}
            tooltipText={"The ratio of the long<br/>and short axes of the head"}
            marks={[
              { value: 0.8, label: "0.80" },
              { value: 0.85, label: "0.85" },
              { value: 0.9, label: "0.90" },
              { value: 0.95, label: "0.95" },
              { value: 1.0, label: "1.00" },
            ]}
            ticks={21}
          />
        </Accordion>

        <Accordion name={"Simulation Options"} id={"simulationOptions"}>
          <Parameter
            min={1.0}
            max={20.0}
            step={0.01}
            defaultValue={params.fabricStiffness}
            onChange={onMeasurementChange}
            id={"fabricStiffness"}
            name={"fabricStiffness"}
            label={"Fabric Stiffness"}
            tooltipText={"The stiffness of the fabric<br/>that retains its original shape"}
            marks={[
              { value: 1.0, label: "1.0" },
              { value: 5.0, label: "5.0" },
              { value: 10.0, label: "10.0" },
              { value: 15.0, label: "15.0" },
              { value: 20.0, label: "20.0" },
            ]}
            ticks={21}
          />
          <Parameter
            min={10}
            max={14}
            step={0.01}
            defaultValue={params.fabricWeight}
            onChange={onMeasurementChange}
            id={"fabricWeight"}
            name={"fabricWeight"}
            label={"Fabric Weight"}
            tooltipText={"Adjusts the weight of the frabric"}
            marks={[
              { value: 10, label: "10" },
              { value: 11, label: "11" },
              { value: 12, label: "12" },
              { value: 13, label: "13" },
              { value: 14, label: "14" },
            ]}
            ticks={41}
          />
          <Parameter
            min={40}
            max={140}
            step={0.01}
            defaultValue={params.cannonGravity}
            onChange={onMeasurementChange}
            id={"cannonGravity"}
            name={"cannonGravity"}
            label={"Simulation Gravity"}
            tooltipText={"Sets simulation gravity"}
            marks={[
              { value: 40, label: "40" },
              { value: 65, label: "65" },
              { value: 90, label: "90" },
              { value: 115, label: "115" },
              { value: 140, label: "140" },
            ]}
            ticks={21}
          />
        </Accordion>
      </div>
    </>
  );
}
