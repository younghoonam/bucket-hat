export default function mmToInches(mm) {
  const inches = mm / 25.4; // Convert mm to inches
  const whole = Math.floor(inches); // Get the whole number part
  const fraction = inches - whole; // Get the fractional part

  // Define closest fractions in eighths
  const eighths = [0, 1 / 8, 1 / 4, 3 / 8, 1 / 2, 5 / 8, 3 / 4, 7 / 8, 1];
  const fractionSymbols = ["", "⅛", "¼", "⅜", "½", "⅝", "¾", "⅞", ""];

  // Find the closest fraction
  let closestIndex = 0;
  let minDiff = Infinity;
  for (let i = 0; i < eighths.length; i++) {
    let diff = Math.abs(fraction - eighths[i]);
    if (diff < minDiff) {
      minDiff = diff;
      closestIndex = i;
    }
  }

  // Build the result string
  let fractionStr = fractionSymbols[closestIndex];
  let result = whole + (fractionStr ? "" + fractionStr : "");

  return result.trim();
}
