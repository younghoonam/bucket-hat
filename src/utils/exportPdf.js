import { jsPDF } from "jspdf";
import * as d3 from "d3";
import "svg2pdf.js";
import * as PatternUtils from "@/utils/patternUtils.js";

// Fonts
import interRegular from "./jsPdfFonts/Inter_18pt-Regular-normal.js";
import interBold from "./jsPdfFonts/Inter_18pt-ExtraBold-bold.js";
import ebGaramondBold from "./jsPdfFonts/EBGaramond-ExtraBold-bold.js";

// Configuration constants
const PDF_CONFIG = {
  a4: { width: 210, height: 297 },
  a3: { width: 297, height: 420 },
  letter: { width: 216, height: 279 },
  legal: { width: 216, height: 356 },

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
  paperSize = "a4",
  crownPatterns = [],
  headPatterns = [],
  brimPatterns = [],
  params = {}
) {
  console.log(paperSize);
  // paper size
  const paperWidth = PDF_CONFIG[paperSize].width;
  const paperHeight = PDF_CONFIG[paperSize].height;

  // Create PDF instance
  const pdf = new jsPDF();
  pdf.setLineHeightFactor(1.35);

  // init fonts
  pdf.addFileToVFS("Inter_18pt-Regular-normal.ttf", interRegular);
  pdf.addFont("Inter_18pt-Regular-normal.ttf", "Inter", "normal");
  pdf.addFileToVFS("Inter_18pt-ExtraBold-bold.ttf", interBold);
  pdf.addFont("Inter_18pt-ExtraBold-bold.ttf", "Inter", "bold");
  pdf.addFileToVFS("EBGaramond-ExtraBold-bold.ttf", ebGaramondBold);
  pdf.addFont("EBGaramond-ExtraBold-bold.ttf", "EBGaramond", "bold");

  // Line generator for SVG paths
  const line = d3
    .line()
    .x((d) => d.x)
    .y((d) => d.y);

  // Center align patterns
  const patterns = {
    Crown: PatternUtils.centerAlignShapes(crownPatterns, paperWidth, paperHeight),
    Brim: PatternUtils.centerAlignShapes(brimPatterns, paperWidth, paperHeight),
    Head: PatternUtils.centerAlignShapes(headPatterns, paperWidth, paperHeight),
  };

  // Process each pattern type
  for (const [type, patternShapes] of Object.entries(patterns)) {
    await addPatternPage(
      pdf,
      type,
      patternShapes,
      line,
      paperSize,
      paperWidth,
      paperHeight,
      params
    );
  }

  // Remove first page and save
  pdf.deletePage(1);
  pdf.save("Patternea_BucketHat_Pattern");
}

// Create SVG for a pattern page
function createPatternSvg(shapes, line, paperWidth, paperHeight) {
  const svgElement = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svgElement.id = "pdf-svg";
  const svg = d3.select(svgElement).attr("width", paperWidth).attr("height", paperHeight);

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
async function addPatternPage(
  pdf,
  type,
  shapes,
  line,
  paperSize,
  paperWidth,
  paperHeight,
  params = {}
) {
  const metadata = PATTERN_METADATA[type];
  if (!metadata) return;

  // Add new page
  pdf.addPage(paperSize);

  // Formatting
  pdf.setFontSize(35);
  pdf.setFont("EBGaramond", "bold");
  pdf.text("Patternea", 12.7, 22);

  pdf.setFontSize(9);
  pdf.setFont("Inter", "normal");
  pdf.text(["Interactive Pattern Generator", "Bucket Hat", getFormattedDateTime()], 12.7, 30);
  pdf.text(
    [
      `Head Circumference: ${params.headCircumference}mm`,
      `Brim Width: ${params.brimWidth}mm`,
      `Head Height: ${params.headHeight}mm`,
      `Brim Angle: ${params.brimAngle}°`,
      `Seam Allowance: ${params.seamAllowance}mm`,
      `Head Ratio: ${params.headRatio}`,
    ],
    72,
    18
  );
  pdf.addImage("./patterneaQr.png", "png", 12.7, 43, 20, 20, "QR", "NONE");
  pdf.text("20mm", 18, 67);
  pdf.text("20mm", 34.5, 48, { angle: 90, rotationDirection: 0 });
  pdf.text(
    [
      `Paper Size: ${params.paperSize}`,
      "Print to 100% scale. Measure the QR code to check the print has printed to the right scale",
    ],
    150,
    18,
    { maxWidth: 38 }
  );
  pdf.text("www.patternea.com", 12.7, PDF_CONFIG[paperSize].height - 12.7);

  // Set title
  pdf.setFontSize(PDF_CONFIG.FONT.NAME_SIZE);
  pdf.setFont("Inter", "bold");
  pdf.text(metadata.title, paperWidth / 2, paperHeight / 2, {
    align: "center",
  });

  // Set cutting instructions
  pdf.setFontSize(PDF_CONFIG.FONT.CONTENT_SIZE);
  pdf.setFont("Inter", "normal");
  pdf.text(
    metadata.cuttingInstructions,
    paperWidth / 2,
    paperHeight / 2 + PDF_CONFIG.FONT.CONTENT_SIZE / 2 + 5,
    {
      align: "center",
    }
  );

  // Add fold line for brim and head patterns
  if (metadata.showFoldLine && shapes.length > 0) {
    addFoldLine(pdf, shapes[0]);
  }

  // Create and add SVG to PDF
  const svgElement = createPatternSvg(shapes, line, paperWidth, paperHeight);
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
  pdf.setFont("Inter", "normal");
  pdf.text(" Place On Fold", shape[segments].x, shape[segments].y, {
    align: "left",
    angle: angleDegrees,
    rotationDirection: 0,
  });
}

function getFormattedDateTime() {
  const now = new Date();

  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0"); // Month is 0-indexed, so add 1
  const day = String(now.getDate()).padStart(2, "0");

  const hours = String(now.getHours()).padStart(2, "0");
  const minutes = String(now.getMinutes()).padStart(2, "0");

  return `${year}.${month}.${day} - ${hours}:${minutes}`;
}
