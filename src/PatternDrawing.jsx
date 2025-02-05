import * as d3 from "d3";
import { useRef, useEffect, useState } from "react";
import { jsPDF } from "jspdf";
import "svg2pdf.js";
import * as Pattern from "./patternGeneration.js";

export default function PatternDrawings({ measurements, exportButton }) {
  const svgRef = useRef(null);
  const containerRef = useRef(null);
  const [svgDimensions, setSvgDimensions] = useState({ width: 0, height: 0 });

  const seamAllowance = 10;
  const patternMargin = 20;

  let crown,
    crownSeamAllowance,
    brimSeamAllowance,
    brim,
    head,
    headSeamAllowance;

  const headMeasurements = {
    a: measurements.headA,
    b: measurements.headB,
    height: measurements.headConeHeight,
    partHeight: measurements.headHeight,
    developmentAngle: measurements.headConeDevAngle,
    segments: 128,
  };

  const brimMeasurements = {
    a: measurements.brimA,
    b: measurements.brimB,
    height: measurements.brimConeHeight,
    partHeight: measurements.brimOffset,
    developmentAngle: measurements.brimConeDevAngle,
    segments: 128,
  };

  d3.selectAll("#pattern-svg > *").remove();

  // Line generator function
  const line = d3
    .line()
    .x((d) => d.x)
    .y((d) => d.y);

  // Run once
  useEffect(() => {
    const containerRef = document.querySelector(".pattern-drawing");
    updateSvgDimensions();

    // Export button
    exportButton.current.addEventListener("click", handleExport);

    // Resizing
    window.addEventListener("resize", updateSvgDimensions);

    return () => {
      window.removeEventListener("resize", updateSvgDimensions);
      exportButton.current.removeEventListener("click", handleExport);
    };

    function updateSvgDimensions() {
      setSvgDimensions({
        width: containerRef.offsetWidth,
        height: containerRef.offsetHeight,
      });
    }
  }, [measurements]);

  // Run every time [measurements], [dimension of html svg element] change

  // Select the SVG element
  const svg = d3
    .select(svgRef.current)

    .attr("width", "100%")
    .attr("height", "100%");

  crown = Pattern.ellipse(measurements.crownA, measurements.crownB);
  crownSeamAllowance = Pattern.seamAllowance(crown, measurements.seamAllowance);
  crown = Pattern.translate(crown, patternMargin, patternMargin);
  crownSeamAllowance = Pattern.translate(
    crownSeamAllowance,
    patternMargin,
    patternMargin
  );

  brim = Pattern.coneDevelopment(brimMeasurements);
  brimSeamAllowance = Pattern.seamAllowance(brim, measurements.seamAllowance);

  brim = Pattern.translate(
    brim,
    Pattern.getBoundingBox(crownSeamAllowance).maxX + patternMargin,
    patternMargin
  );
  brimSeamAllowance = Pattern.translate(
    brimSeamAllowance,
    Pattern.getBoundingBox(crownSeamAllowance).maxX + patternMargin,
    patternMargin
  );

  head = Pattern.coneDevelopment(headMeasurements);
  headSeamAllowance = Pattern.seamAllowance(head, measurements.seamAllowance);

  head = Pattern.translate(
    head,
    Pattern.getBoundingBox(brimSeamAllowance).maxX + patternMargin,
    patternMargin
  );
  headSeamAllowance = Pattern.translate(
    headSeamAllowance,
    Pattern.getBoundingBox(brimSeamAllowance).maxX + patternMargin,
    patternMargin
  );

  const formLines = [];
  formLines.push(brim, head, crown);

  const cuttingLines = [];
  cuttingLines.push(brimSeamAllowance, headSeamAllowance, crownSeamAllowance);

  formLines.forEach((shape) => {
    svg
      .append("path")
      .datum(shape)
      .attr("d", line)
      .style("fill", "none") // No fill color
      .style("stroke", "gray") // Stroke color
      .style("stroke-width", 0.5); // Stroke thickness
  });

  cuttingLines.forEach((shape) => {
    svg
      .append("path")
      .datum(shape)
      .attr("d", line)
      .style("fill", "none") // No fill color
      .style("stroke", "black") // Stroke color
      .style("stroke-width", 1); // Stroke thickness
  });

  // Get the bounding box of the path
  // const boundingBox = svg.node().getBBox();
  // Set the viewBox to fit the bounding box
  // const scale = 1.5;
  // svg.attr(
  //   "viewBox",
  //   `${boundingBox.x * scale} ${boundingBox.y * scale} ${
  //     boundingBox.width * scale
  //   } ${boundingBox.height * scale}`
  // );

  async function handleExport() {
    // declaraments
    const pdf = new jsPDF();
    const paperWidth = 210;
    const paperHeight = 297;

    // patterns
    const crownPattern = Pattern.centerAlignShapes(
      [crown, crownSeamAllowance],
      paperWidth,
      paperHeight
    );

    const brimPattern = Pattern.centerAlignShapes(
      [brim, brimSeamAllowance],
      paperWidth,
      paperHeight
    );

    const headPattern = Pattern.centerAlignShapes(
      [head, headSeamAllowance],
      paperWidth,
      paperHeight
    );

    await addPage("crown", crownPattern);
    await addPage("brim", brimPattern);
    await addPage("head", headPattern);
    pdf.deletePage(1);
    pdf.save();
    // Brim
    async function addPage(text, shapes) {
      const svgElement = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "svg"
      );
      svgElement.id = "pdf-svg";
      const svg = d3
        .select(svgElement)
        .attr("width", paperWidth)
        .attr("height", paperHeight);

      pdf.addPage();

      pdf.text(text, 20, 20);

      shapes.forEach((shape) => {
        svg.append("path").datum(shape).attr("d", line).style("fill", "none");

        switch (shape.lineType) {
          case "seam":
            svg
              .style("stroke", "gray") // Stroke color
              .style("stroke-width", 0.5); // Stroke thickness
            break;
          case "seamallowance":
            svg
              .style("stroke", "black") // Stroke color
              .style("stroke-width", 1); // Stroke thickness
            break;
          default:
            svg
              .style("stroke", "black") // Stroke color
              .style("stroke-width", 1); // Stroke thickness
        }
      });

      await pdf.svg(svgElement);
    }
  }

  return (
    <div ref={containerRef} className="pattern-drawing" id="pattern-drawing">
      <svg ref={svgRef} id="pattern-svg"></svg>
    </div>
  );
}
