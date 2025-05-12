//  Ramanujan's second approximation
function ellipseCircumference(a, b) {
  const h = Math.pow(a - b, 2) / Math.pow(a + b, 2);
  const p = Math.PI * (a + b) * (1 + (3 * h) / (10 + Math.sqrt(4 - 3 * h)));
  return p;
}

function findEllipseAxesForRatio(target, ratio, initialA = 50, tolerance = 1e-4) {
  let a = initialA;
  let b = a * ratio;
  let targetPerimeter = target;
  let difference;

  do {
    b = a * ratio;
    let perimeter = ellipseCircumference(a, b);
    difference = Math.abs(perimeter - targetPerimeter);
    a += (targetPerimeter - perimeter) * 0.1;
  } while (difference > tolerance);

  return { a, b };
}

function hatMeasurements(params) {
  // Multiplier for making crown smaller relative to the head
  const crownMultiplier = 0.9;

  // Degrees to radians
  const degreesToRad = (degrees) => degrees * (Math.PI / 180);

  /* HEAD CALCULATIONS */
  // Compute major and minor axes of the head ellipse
  const { a: headA, b: headB } = findEllipseAxesForRatio(
    params.headCircumference,
    params.headRatio
  );

  // Calculate the full height of the imaginary cone representing the head
  const headConeHeight = params.headHeight / (1 - params.headRatio);

  // Compute slant heights of the head cone for both axes
  const headConeSlantA = Math.hypot(headA, headConeHeight);
  const headConeSlantB = Math.hypot(headB, headConeHeight);

  // Aproximation for the development sector angle for the head cone
  const headConeDevAngleA = (2 * Math.PI * headA) / headConeSlantA;
  const headConeDevAngleB = (2 * Math.PI * headB) / headConeSlantB;
  const headConeDevAngle = (headConeDevAngleA + headConeDevAngleB) / 2;

  /* CROWN CALCULATIONS */
  const crownA = headA * crownMultiplier;
  const crownB = headB * crownMultiplier;

  /* BRIM CALCULATIONS */
  // Convert brim angle to radians
  const brimAngleRad = degreesToRad(params.brimAngle);

  // Compute offset caused by the brim angle
  const brimOffset = params.brimWidth * Math.cos(Math.PI / 2 - brimAngleRad);

  // Compute major and minor axes of the brim ellipse
  const brimA = headA + params.brimWidth * Math.cos(brimAngleRad);
  const brimB = headB * (brimA / headA);

  // Compute height of the brim cone
  const brimConeHeight = (brimA * params.brimWidth * Math.sin(brimAngleRad)) / (brimA - headA);

  // Compute slant heights of the brim cone for both axes
  const brimConeSlantA = Math.hypot(brimA, brimConeHeight);
  const brimConeSlantB = Math.hypot(brimB, brimConeHeight);

  // Aproximation for the development sector angle for the brim cone
  const brimConeDevAngleA = (2 * Math.PI * brimA) / brimConeSlantA;
  const brimConeDevAngleB = (2 * Math.PI * brimB) / brimConeSlantB;
  const brimConeDevAngle = (brimConeDevAngleA + brimConeDevAngleB) / 2;

  return {
    ...params,

    // Head properties
    headA,
    headB,
    headConeHeight,
    headConeDevAngle,

    // Crown properties
    crownA,
    crownB,

    // Brim properties
    brimA,
    brimB,
    brimOffset,
    brimConeHeight,
    brimConeDevAngle,
  };
}

export { hatMeasurements };
