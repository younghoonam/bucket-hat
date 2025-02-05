import * as THREE from "three";

export function EllipseLine({
  a = 1,
  b = 1,
  segments = 64,
  color = "black",
  position = [0, 0, 0],
}) {
  const points = [];
  for (let i = 0; i <= segments; i++) {
    const angle = (i / segments) * Math.PI * 2;
    points.push(new THREE.Vector3(Math.cos(angle) * a, 0, Math.sin(angle) * b));
  }
  const geometry = new THREE.BufferGeometry().setFromPoints(points);

  return (
    <line position={position}>
      <primitive object={geometry} attach="geometry" />
      <lineBasicMaterial attach="material" color={color} />
    </line>
  );
}

export default function ThreeCircles(props) {
  const measurements = props.props;

  const ellipses = [
    {
      id: "crownEllipse",
      a: measurements.crownA,
      b: measurements.crownB,
      position: [0, measurements.headHeight, 0],
      // color: "red",
    },
    {
      id: "baseEllipse",
      a: measurements.headA,
      b: measurements.headB,
      position: [0, 0, 0],
      // color: "green",
    },
    {
      id: "brimEllipse",
      a: measurements.brimA,
      b: measurements.brimB,
      position: [0, -measurements.brimOffset, 0],
      // color: "blue",
    },
  ];

  const ellipseLines = ellipses.map((ellipse) => (
    <EllipseLine
      key={ellipse.id}
      a={ellipse.a}
      b={ellipse.b}
      position={ellipse.position}
      color={ellipse.color}
    />
  ));

  return <>{ellipseLines}</>;
}
