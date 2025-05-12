import { jsPDF } from "jspdf";
import "svg2pdf.js";

function calculateCurveLength(coordinates) {
  let length = 0;
  for (let i = 1; i < coordinates.length; i++) {
    const dx = coordinates[i].x - coordinates[i - 1].x;
    const dy = coordinates[i].y - coordinates[i - 1].y;
    length += Math.hypot(dx, dy);
  }
  return length;
}

export function coneDevelopment({
  a, // Major Axis A
  b, // Minor Axix B
  height, // Total Height of The Cone
  partHeight, // Height of the cone to be drawn
  developmentAngle, // Sector angle
  segments = 128, // number of line segments
}) {
  const coordinates = [];
  const sectorDivider = 4;
  const ratio = (height - partHeight) / height;

  for (let index = 0; index < segments; index++) {
    const ellipseAngleSegment = ((index / segments) * 2 * Math.PI) / sectorDivider;
    const developmentAngleSegment =
      ((index / segments) * developmentAngle) / sectorDivider;
    const slant = Math.hypot(
      height,
      Math.hypot(a * Math.cos(ellipseAngleSegment), b * Math.sin(ellipseAngleSegment))
    );
    coordinates.push({
      slant: slant,
      x: slant * Math.cos(developmentAngleSegment),
      y: slant * Math.sin(developmentAngleSegment),
    });
  }

  for (let index = segments; index > 0; index--) {
    const ellipseAngleSegment = ((index / segments) * 2 * Math.PI) / sectorDivider;
    const developmentAngleSegment =
      ((index / segments) * developmentAngle) / sectorDivider;
    const slant = Math.hypot(
      height,
      Math.hypot(a * Math.cos(ellipseAngleSegment), b * Math.sin(ellipseAngleSegment))
    );

    const partSlant = slant * ratio;
    // const partSlant = slant - 55;
    coordinates.push({
      slant: partSlant,
      x: partSlant * Math.cos(developmentAngleSegment),
      y: partSlant * Math.sin(developmentAngleSegment),
    });
  }

  coordinates.push(coordinates[0]);

  const middle = (coordinates.length - 1) / 2;
  coordinates[middle - 1] = { ...coordinates[middle - 1], isOnFold: true };
  coordinates[middle] = {
    ...coordinates[middle],
    isOnFold: true,
  };

  const alignedPoints = alignShape(coordinates);
  return alignedPoints;
}

export function alignShape(points) {
  const minX = Math.min(...points.map((p) => p.x));
  const minY = Math.min(...points.map((p) => p.y));

  const alignedPoints = points.map((point) => ({
    ...point,
    x: point.x - minX,
    y: point.y - minY,
  }));

  return alignedPoints;
}

export function rotatePoints(points, radians) {
  return points.map((point) => {
    const { x, y } = point;
    const rotatedX = x * Math.cos(radians) - y * Math.sin(radians);
    const rotatedY = x * Math.sin(radians) + y * Math.cos(radians);
    return { x: rotatedX, y: rotatedY };
  });
}

export function centerAlignShape(shape, width, height) {
  // Find the bounding box of the shape
  const minX = Math.min(...shape.map((p) => p.x));
  const minY = Math.min(...shape.map((p) => p.y));
  const maxX = Math.max(...shape.map((p) => p.x));
  const maxY = Math.max(...shape.map((p) => p.y));

  // Calculate the shape's dimensions
  const shapeWidth = maxX - minX;
  const shapeHeight = maxY - minY;

  // Calculate offsets to center the shape
  const offsetX = (width - shapeWidth) / 2 - minX;
  const offsetY = (height - shapeHeight) / 2 - minY;

  // Align the shape to the center
  const centeredShape = shape.map((point) => ({
    ...point,
    x: point.x + offsetX,
    y: point.y + offsetY,
  }));

  return centeredShape;
}

export function centerAlignShapes(shapes, width, height) {
  // Flatten the shapes to find the bounding box of all points
  const allPoints = shapes.flat();

  // Find the bounding box of all shapes combined
  const minX = Math.min(...allPoints.map((p) => p.x));
  const minY = Math.min(...allPoints.map((p) => p.y));
  const maxX = Math.max(...allPoints.map((p) => p.x));
  const maxY = Math.max(...allPoints.map((p) => p.y));

  // Calculate the combined dimensions of all shapes
  const totalWidth = maxX - minX;
  const totalHeight = maxY - minY;

  // Calculate offsets to center the shapes as a group
  const offsetX = (width - totalWidth) / 2 - minX;
  const offsetY = (height - totalHeight) / 2 - minY;

  // Align all shapes to the center as a group
  const centeredShapes = shapes.map((shape) =>
    shape.map((point) => ({
      ...point,
      x: point.x + offsetX,
      y: point.y + offsetY,
    }))
  );

  return centeredShapes;
}

export function alignShapes(...shapes) {
  // Flatten the arrays of points into a single array
  const allPoints = shapes.flat();

  // Find the minimum x and y values across all points
  const minX = Math.min(...allPoints.map((p) => p.x));
  const minY = Math.min(...allPoints.map((p) => p.y));

  // Align all points relative to the minimum x and y values
  const alignedShapes = shapes.map((shape) =>
    shape.map((point) => ({
      ...point,
      x: point.x - minX,
      y: point.y - minY,
    }))
  );

  return alignedShapes;
}

export function getBoundingBox(points) {
  const xs = points.map((p) => p.x);
  const ys = points.map((p) => p.y);
  return {
    minX: Math.min(...xs),
    maxX: Math.max(...xs),
    minY: Math.min(...ys),
    maxY: Math.max(...ys),
  };
}

export function translate(points, dx, dy) {
  return points.map((point) => ({
    ...point,
    x: point.x + dx,
    y: point.y + dy,
  }));
}

export function seamAllowance(points, distance) {
  const coordinates = [];
  let firstOffsetLine;
  let prevOffsetLine;

  for (let index = 0; index < points.length - 1; index++) {
    const line = getLine(points[index], points[(index + 1) % (points.length - 1)]);
    const isGoingDown = points[index].y > points[(index + 1) % (points.length - 1)].y;
    const perpSlope = perpLineSlope(line.m);

    let offsetPoint1, offsetPoint2;

    if (points[index].isOnFold && points[(index + 1) % (points.length - 1)].isOnFold) {
      offsetPoint1 = points[index];
      offsetPoint2 = points[(index + 1) % (points.length - 1)];
    } else {
      offsetPoint1 = translate(points[index], perpSlope, distance, isGoingDown);
      offsetPoint2 = translate(
        points[(index + 1) % (points.length - 1)],
        perpSlope,
        distance,
        isGoingDown
      );
    }

    const offsetLine = getLine(offsetPoint1, offsetPoint2);

    if (index === 0) {
      firstOffsetLine = offsetLine;
    } else {
      const point = intersect(prevOffsetLine, offsetLine);
      coordinates.push(point);
    }

    if (index === points.length - 2) {
      const point = intersect(prevOffsetLine, offsetLine);
      coordinates.push(point);
      const lastPoint = intersect(offsetLine, firstOffsetLine);
      coordinates.push(lastPoint);
    }

    prevOffsetLine = offsetLine;
  }

  coordinates.push(coordinates[0]);
  return coordinates;

  function getLine(point1, point2) {
    // Check if the line is vertical
    if (point1.x === point2.x) {
      return {
        vertical: true,
        m: Infinity,
        xIntercept: point1.x, // The x-coordinate where the line exists
        equation: `x = ${point1.x}`,
      };
    }

    // Calculate the slope (m)
    const m = (point2.y - point1.y) / (point2.x - point1.x);

    // Calculate the y-intercept (b)
    const b = point1.y - m * point1.x;

    // Return the slope and y-intercept
    return {
      m,
      b,
      equation: `y = ${m}x + ${b}`,
    };
  }

  function perpLineSlope(m) {
    // Handle special cases for horizontal and vertical lines
    if (m === Infinity) {
      return 0; // Vertical line becomes horizontal
    }
    if (m === 0) {
      return Infinity; // Horizontal line becomes vertical
    }

    // Rotate the slope by 90 degrees
    return -1 / m;
  }

  function translate(point, m, d, isGoingDown) {
    if (m === Infinity) {
      // If the slope is infinite (vertical line), move along the x-axis
      return { x: point.x + d, y: point.y };
    }

    if (m === 0) {
      // If the slope is zero (horizontal line), move along the y-axis
      return { x: point.x, y: point.y + d };
    }

    // Calculate the magnitude of the direction vector
    const magnitude = Math.sqrt(1 + m * m);

    // Calculate the unit vector components
    const unitX = 1 / magnitude;
    const unitY = m / magnitude;

    let x2, y2;
    // Translate the point by the distance d along the slope m
    if (isGoingDown) {
      x2 = point.x - d * unitX;
      y2 = point.y - d * unitY;
    } else {
      x2 = point.x + d * unitX;
      y2 = point.y + d * unitY;
    }

    // Return the new point after translation
    return { x: x2, y: y2 };
  }

  function intersect(line1, line2) {
    // Check if the lines are parallel
    if (line1.m === line2.m) {
      if (line1.b === line2.b) {
        return "The lines are identical and overlap infinitely.";
      } else {
        return "The lines are parallel and do not intersect.";
      }
    }

    // Calculate the x-coordinate of the intersection
    const x = (line2.b - line1.b) / (line1.m - line2.m);

    // Calculate the y-coordinate of the intersection
    const y = line1.m * x + line1.b;

    // Return the intersection point as an object
    return { x, y };
  }
}

export async function exportToPDF(svg, filename = "export.pdf") {
  const svgElement = svg;

  if (!svgElement) {
    console.error("SVG element not found");
    return;
  }

  // Get SVG dimensions in mm from viewBox or width/height
  let svgWidth, svgHeight;

  if (svgElement.viewBox.baseVal) {
    // If viewBox is defined, use it
    svgWidth = svgElement.viewBox.baseVal.width;
    svgHeight = svgElement.viewBox.baseVal.height;
  } else {
    // Otherwise use width/height attributes
    svgWidth = svgElement.width.baseVal.value;
    svgHeight = svgElement.height.baseVal.value;
  }

  // Create a clone of the SVG to avoid modifying the original
  const svgClone = svgElement.cloneNode(true);

  // Initialize PDF document using mm as the unit
  const pdf = new jsPDF({
    orientation: svgWidth > svgHeight ? "landscape" : "portrait",
    unit: "mm", // Set units to millimeters
    format: [svgWidth, svgHeight], // Dimensions are already in mm
  });

  try {
    // Convert SVG to PDF
    // The width and height here should be in mm since we set the unit to mm
    await pdf.svg(svgClone, {
      x: 0,
      y: 0,
      width: svgWidth,
      height: svgHeight,
    });

    // Save the PDF
    pdf.save(filename);
  } catch (error) {
    console.error("Error converting SVG to PDF:", error);
  }
}

export function verifySVGDimensions(svg) {
  const svgElement = svg;
  if (!svgElement) return null;

  const dimensions = {
    width: {
      value: svgElement.width.baseVal.value,
      unit:
        svgElement.width.baseVal.unitType === SVGLength.SVG_LENGTHTYPE_MM
          ? "mm"
          : "unknown",
    },
    height: {
      value: svgElement.height.baseVal.value,
      unit:
        svgElement.height.baseVal.unitType === SVGLength.SVG_LENGTHTYPE_MM
          ? "mm"
          : "unknown",
    },
    viewBox: svgElement.viewBox.baseVal
      ? {
          width: svgElement.viewBox.baseVal.width,
          height: svgElement.viewBox.baseVal.height,
        }
      : null,
  };

  console.log("SVG Dimensions:", dimensions);
  return dimensions;
}

export function ellipse(a, b, segments = 128) {
  // [{x,y},{x,y}...]
  const coordinates = [];

  for (let index = 0; index < segments; index++) {
    const angle = (index / segments) * Math.PI * 2;
    coordinates.push({
      x: a * Math.cos(angle) + a,
      y: b * Math.sin(angle) + b,
    });
  }

  coordinates.push(coordinates[0]);

  let transformed;
  transformed = rotatePoints(coordinates, Math.PI * 0.5);
  transformed = alignShape(transformed);

  return transformed;
}

// svg
// .selectAll("circle")
// .data(circles)
// .enter()
// .append("circle")
// .attr("cx", (d) => d.x)
// .attr("cy", (d) => d.y)
// .attr("r", 2)
// .style("fill", "red"); // Circle color

// // Append the line path
// svg
// .append("path")
// .datum(crownEllipse)
// .attr("d", line)
// .style("fill", "none") // No fill color
// .style("stroke", "black") // Stroke color
// .style("stroke-width", 1); // Stroke thickness
