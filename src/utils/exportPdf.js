import { jsPDF } from "jspdf";
import * as d3 from "d3";
import "svg2pdf.js";
import * as PatternUtils from "@/utils/patternUtils.js";

// Configuration constants
const PDF_CONFIG = {
  PAPER_WIDTH: 210,
  PAPER_HEIGHT: 297,
  PATTERN_CONFIG: {
    patternMargin: 20,
    segments: 128,
  },
  FONT: {
    NAME_SIZE: 45,
    CONTENT_SIZE: 12,
    FOLD_SIZE: 20,
    FAMILY: "helvetica",
  },
};

// Pattern metadata for different sections
const PATTERN_METADATA = {
  Crown: {
    title: "Crown Top",
    cuttingInstructions: ["Cut x1 For Single Sided Hat", "Cut x2 For Reversable Hat"],
  },
  Brim: {
    title: "Brim",
    cuttingInstructions: ["Cut x2 For Single Sided Hat", "Cut x4 For Reversable Hat"],
    showFoldLine: true,
  },
  Head: {
    title: "Head Band",
    cuttingInstructions: ["Cut x2 For Single Sided Hat", "Cut x4 For Reversable Hat"],
    showFoldLine: true,
  },
};

export default async function exportPatternsToPdf(
  crownPatterns = [],
  headPatterns = [],
  brimPatterns = []
) {
  // Create PDF instance
  const pdf = new jsPDF();
  pdf.setLineHeightFactor(1.35);

  // Line generator for SVG paths
  const line = d3
    .line()
    .x((d) => d.x)
    .y((d) => d.y);

  // Center align patterns
  const patterns = {
    Crown: PatternUtils.centerAlignShapes(
      crownPatterns,
      PDF_CONFIG.PAPER_WIDTH,
      PDF_CONFIG.PAPER_HEIGHT
    ),
    Brim: PatternUtils.centerAlignShapes(
      brimPatterns,
      PDF_CONFIG.PAPER_WIDTH,
      PDF_CONFIG.PAPER_HEIGHT
    ),
    Head: PatternUtils.centerAlignShapes(
      headPatterns,
      PDF_CONFIG.PAPER_WIDTH,
      PDF_CONFIG.PAPER_HEIGHT
    ),
  };

  // Process each pattern type
  for (const [type, patternShapes] of Object.entries(patterns)) {
    await addPatternPage(pdf, type, patternShapes, line);
  }

  // Remove first page and save
  pdf.deletePage(1);
  pdf.save();
}

// Create SVG for a pattern page
function createPatternSvg(shapes, line) {
  const svgElement = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svgElement.id = "pdf-svg";
  const svg = d3
    .select(svgElement)
    .attr("width", PDF_CONFIG.PAPER_WIDTH)
    .attr("height", PDF_CONFIG.PAPER_HEIGHT);

  // Render shapes with appropriate styling
  shapes.forEach((shape) => {
    const path = svg.append("path").datum(shape).attr("d", line).style("fill", "none");

    // Apply stroke based on line type
    switch (shape.lineType) {
      case "seam":
        path.style("stroke", "gray").style("stroke-width", 0.5);
        break;
      case "seamallowance":
        path.style("stroke", "red").style("stroke-width", 1);
        break;
      default:
        path.style("stroke", "black").style("stroke-width", 0.5);
    }
  });

  return svgElement;
}

// Add page with pattern information
async function addPatternPage(pdf, type, shapes, line) {
  const metadata = PATTERN_METADATA[type];
  if (!metadata) return;

  // Add new page
  pdf.addPage();

  // Set title
  pdf.setFontSize(PDF_CONFIG.FONT.NAME_SIZE);
  pdf.setFont(PDF_CONFIG.FONT.FAMILY, "bold");
  pdf.text(metadata.title, PDF_CONFIG.PAPER_WIDTH / 2, PDF_CONFIG.PAPER_HEIGHT / 2, {
    align: "center",
  });

  // Set cutting instructions
  pdf.setFontSize(PDF_CONFIG.FONT.CONTENT_SIZE);
  pdf.setFont(PDF_CONFIG.FONT.FAMILY, "normal");
  pdf.text(
    metadata.cuttingInstructions,
    PDF_CONFIG.PAPER_WIDTH / 2,
    PDF_CONFIG.PAPER_HEIGHT / 2 + PDF_CONFIG.FONT.CONTENT_SIZE / 2 + 5,
    {
      align: "center",
    }
  );

  // Add fold line for brim and head patterns
  if (metadata.showFoldLine && shapes.length > 0) {
    addFoldLine(pdf, shapes[0]);
  }

  // Create and add SVG to PDF
  const svgElement = createPatternSvg(shapes, line);
  await pdf.svg(svgElement);
}

// Add fold line annotation
function addFoldLine(pdf, shape) {
  const segments = PDF_CONFIG.PATTERN_CONFIG.segments;
  const deltaX = shape[segments - 1].x - shape[segments].x;
  const deltaY = shape[segments - 1].y - shape[segments].y;

  // Calculate angle for fold line
  const angleRadians = Math.atan2(deltaY, deltaX);
  const angleDegrees = angleRadians * (180 / Math.PI) - 92;

  pdf.setFontSize(PDF_CONFIG.FONT.FOLD_SIZE);
  pdf.setFont(PDF_CONFIG.FONT.FAMILY, "normal");
  pdf.text(" Place On Fold", shape[segments].x, shape[segments].y, {
    align: "left",
    angle: angleDegrees,
    rotationDirection: 0,
  });
}
