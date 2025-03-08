// Libraries
import * as d3 from "d3";
import { useRef, useEffect, useState, useMemo } from "react";
import { jsPDF } from "jspdf";
import "svg2pdf.js";

// Utils
import * as PatternUtils from "@/utils/patternUtils.js";
import exportPatternsToPdf from "@/utils/exportPdf.js";

const PREVIEW_PATTERN_CONFIG = {
  patternMargin: 20,
  segments: 128,
};

export default function PatternDrawings({ params, exportButton }) {
  // Refs and States
  const svgRef = useRef(null);
  const containerRef = useRef(null);
  // const [svgDimensions, setSvgDimensions] = useState({ width: 0, height: 0 });

  let crown, crownSeamAllowance, brimSeamAllowance, brim, head, headSeamAllowance;

  const headMeasurements = {
    a: params.headA,
    b: params.headB,
    height: params.headConeHeight,
    partHeight: params.headHeight,
    developmentAngle: params.headConeDevAngle,
    segments: PREVIEW_PATTERN_CONFIG.segments,
  };

  const brimMeasurements = {
    a: params.brimA,
    b: params.brimB,
    height: params.brimConeHeight,
    partHeight: params.brimOffset,
    developmentAngle: params.brimConeDevAngle,
    segments: PREVIEW_PATTERN_CONFIG.segments,
  };

  // Line generator function
  const lineGenerator = useMemo(
    () =>
      d3
        .line()
        .x((d) => d.x)
        .y((d) => d.y),
    []
  );

  useEffect(() => {
    d3.selectAll("#pattern-svg > *").remove();
    drawSvg();

    // Only add event listener if exportButton exists
    if (exportButton?.current) {
      exportButton.current.addEventListener("click", handleExport);

      return () => {
        exportButton.current.removeEventListener("click", handleExport);
      };
    }
  }, [params, exportButton]);

  // Select the SVG element
  function drawSvg() {
    const svg = d3.select(svgRef.current).attr("width", "100%").attr("height", "100%");

    crown = PatternUtils.ellipse(params.crownA, params.crownB);
    crownSeamAllowance = PatternUtils.seamAllowance(crown, params.seamAllowance);
    crown = PatternUtils.translate(
      crown,
      PREVIEW_PATTERN_CONFIG.patternMargin,
      PREVIEW_PATTERN_CONFIG.patternMargin
    );
    crownSeamAllowance = PatternUtils.translate(
      crownSeamAllowance,
      PREVIEW_PATTERN_CONFIG.patternMargin,
      PREVIEW_PATTERN_CONFIG.patternMargin
    );

    brim = PatternUtils.coneDevelopment(brimMeasurements);
    brimSeamAllowance = PatternUtils.seamAllowance(brim, params.seamAllowance);

    brim = PatternUtils.translate(
      brim,
      PatternUtils.getBoundingBox(crownSeamAllowance).maxX + PREVIEW_PATTERN_CONFIG.patternMargin,
      PREVIEW_PATTERN_CONFIG.patternMargin
    );
    brimSeamAllowance = PatternUtils.translate(
      brimSeamAllowance,
      PatternUtils.getBoundingBox(crownSeamAllowance).maxX + PREVIEW_PATTERN_CONFIG.patternMargin,
      PREVIEW_PATTERN_CONFIG.patternMargin
    );

    head = PatternUtils.coneDevelopment(headMeasurements);
    headSeamAllowance = PatternUtils.seamAllowance(head, params.seamAllowance);

    head = PatternUtils.translate(
      head,
      PatternUtils.getBoundingBox(brimSeamAllowance).maxX + PREVIEW_PATTERN_CONFIG.patternMargin,
      PREVIEW_PATTERN_CONFIG.patternMargin
    );
    headSeamAllowance = PatternUtils.translate(
      headSeamAllowance,
      PatternUtils.getBoundingBox(brimSeamAllowance).maxX + PREVIEW_PATTERN_CONFIG.patternMargin,
      PREVIEW_PATTERN_CONFIG.patternMargin
    );

    const formLines = [];
    formLines.push(brim, head, crown);

    const cuttingLines = [];
    cuttingLines.push(brimSeamAllowance, headSeamAllowance, crownSeamAllowance);

    formLines.forEach((shape) => {
      svg
        .append("path")
        .datum(shape)
        .attr("d", lineGenerator)
        .style("fill", "none") // No fill color
        .style("stroke", "gray") // Stroke color
        .style("stroke-width", 0.5); // Stroke thickness
    });

    cuttingLines.forEach((shape) => {
      svg
        .append("path")
        .datum(shape)
        .attr("d", lineGenerator)
        .style("fill", "none") // No fill color
        .style("stroke", "black") // Stroke color
        .style("stroke-width", 1); // Stroke thickness
    });
  }

  async function handleExport() {
    exportPatternsToPdf(
      params.paperSize,
      [crownSeamAllowance],
      [headSeamAllowance],
      [brimSeamAllowance],
      params
    );
  }

  return (
    <div ref={containerRef} className="pattern-drawing" id="pattern-drawing">
      <svg ref={svgRef} id="pattern-svg"></svg>
    </div>
  );
}
