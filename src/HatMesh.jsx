import * as THREE from "three";

export default function HatMesh({ measurements }) {
  const point0 = new THREE.Vector2(1, 0);
  const point1 = new THREE.Vector2(measurements.crownA, 0);
  const point2 = new THREE.Vector2(
    measurements.headA,
    -measurements.headHeight
  );
  const point3 = new THREE.Vector2(
    measurements.brimA,
    -1 * (measurements.headHeight + measurements.brimOffset)
  );

  const curve0 = new THREE.LineCurve(point0, point1);
  const curve1 = new THREE.LineCurve(point1, point2);
  const curve2 = new THREE.LineCurve(point2, point3);

  const segments = 5;

  const points = [];

  points.push(
    ...curve0.getPoints(segments).slice(0, -1),
    ...curve1.getPoints(segments).slice(0, -1),
    ...curve2.getPoints(segments)
  );

  console.log(points);

  return (
    <>
      <directionalLight position={[1, 1, 1]} />
      <mesh scale={1} position={[0, measurements.headHeight, 0]}>
        <latheGeometry args={[points, 32]} />
        <meshStandardMaterial
          color={"orange"}
          flatShading={true}
          side={THREE.DoubleSide}
          //   wireframe={true}
        />
      </mesh>
      {/* <points geometry={points} /> */}
    </>
  );
}
