function hatMeasurements(params) {
  // used properties

  const crownMultiplier = 0.9;

  // Helper function to convert degrees to radians
  const degreesToRad = (degrees) => degrees * (Math.PI / 180);

  // Common calculations
  const headRadius = params.headCircumference / (2 * Math.PI);
  const headA = Math.sqrt((2 * Math.pow(headRadius, 2)) / (1 + Math.pow(params.headRatio, 2)));
  const headB = headA * params.headRatio;
  const headConeHeight = params.headHeight / (1 - params.headRatio);
  const brimAngleRad = degreesToRad(params.brimAngle);
  const brimOffset = params.brimWidth * Math.cos(Math.PI / 2 - brimAngleRad);
  const brimRadius = params.brimWidth * Math.sin(Math.PI / 2 - brimAngleRad) + headRadius;
  const brimA = headA + params.brimWidth * Math.cos(brimAngleRad);
  const brimB = headB + params.brimWidth * Math.cos(brimAngleRad);
  const crownA = headA * crownMultiplier;
  const crownB = headB * crownMultiplier;
  const crownRadius = headRadius * crownMultiplier;
  const crownDiameter = (params.headCircumference / Math.PI) * crownMultiplier;
  const crownCircumference = params.headCircumference * crownMultiplier;

  const headConeSlantA = Math.hypot(headA, headConeHeight);
  const headConeSlantB = Math.hypot(headB, headConeHeight);
  const headConeDevAngleA = (2 * Math.PI * headA) / headConeSlantA;
  const headConeDevAngleB = (2 * Math.PI * headB) / headConeSlantB;
  const headConeAngleDiff = headConeDevAngleA - headConeDevAngleB;
  const headConeDevAngle = headConeDevAngleA - headConeAngleDiff * (headB / headA);

  // Brim cone height calculation
  const brimConeHeight = (brimA * params.brimWidth * Math.sin(brimAngleRad)) / (brimA - headA);
  const brimConeSlantA = Math.hypot(brimA, brimConeHeight);
  const brimConeSlantB = Math.hypot(brimB, brimConeHeight);
  const brimConeDevAngleA = (2 * Math.PI * brimA) / brimConeSlantA;
  const brimConeDevAngleB = (2 * Math.PI * brimB) / brimConeSlantB;
  const angleDiff = brimConeDevAngleA - brimConeDevAngleB;
  const brimConeDevAngle = brimConeDevAngleA - angleDiff * (brimB / brimA);

  return {
    ...params,

    headA,
    headB,
    headConeHeight,
    headConeDevAngle,

    headRadius,
    headDiameter: 2 * headRadius,
    brimA,
    brimB,

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
  };
}

export { hatMeasurements };
