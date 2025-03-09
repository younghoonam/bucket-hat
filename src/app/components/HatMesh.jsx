import { useEffect, useRef } from "react";
import * as THREE from "three";
import * as CANNON from "cannon-es";
import { useFrame } from "@react-three/fiber";
import { useTexture } from "@react-three/drei";

const latheSegments = 20;
const headRadius = 92;
const crownSegments = 3;
const headSegments = 3;
const brimSegments = 8;
const crossSegments = crownSegments + headSegments + brimSegments;

export default function HatMesh({ params }) {
  const hatRef = useRef();

  useEffect(() => {
    const timer = setTimeout(() => {
      initCannon();
      // updateUv();
      return () => clearTimeout(timer);
    }, 300);
  }, [params]);

  const point0 = new THREE.Vector2(0, 0);
  const point1 = new THREE.Vector2(params.crownA, 0);
  const point2 = new THREE.Vector2(params.headA, -params.headHeight);
  const point3 = new THREE.Vector2(params.brimA, -1 * (params.headHeight + params.brimOffset));

  const curve0 = new THREE.LineCurve(point0, point1);
  const curve1 = new THREE.LineCurve(point1, point2);
  const curve2 = new THREE.LineCurve(point2, point3);

  const points = [];

  points.push(
    ...curve0.getPoints(crownSegments).slice(0, -1),
    ...curve1.getPoints(headSegments).slice(0, -1),
    ...curve2.getPoints(brimSegments)
  );

  // UV
  function updateUv() {
    // Create the LatheGeometry
    const geometry = hatRef.current.geometry;

    // Extract positions from geometry
    const posAttr = geometry.attributes.position;
    const positions = posAttr.array;
    const vertexCount = posAttr.count;

    // Compute min/max Y for normalization
    let minY = Infinity,
      maxY = -Infinity;
    for (let i = 1; i < positions.length; i += 3) {
      const y = positions[i];
      if (y < minY) minY = y;
      if (y > maxY) maxY = y;
    }

    // Compute UVs
    const uvs = new Float32Array(vertexCount * 2);
    for (let i = 0; i < vertexCount; i++) {
      const x = positions[i * 3];
      const z = positions[i * 3 + 2];
      const y = positions[i * 3 + 1];

      // Compute the angle around the Y-axis (theta)
      const angle = Math.atan2(z, x);
      const u = (angle + Math.PI) / (2 * Math.PI); // Normalize to [0,1]

      // Normalize Y to [0,1] for V coordinate
      const v = (y - minY) / (maxY - minY);

      uvs[i * 2] = u;
      uvs[i * 2 + 1] = v;
    }

    // Assign the new UVs
    geometry.setAttribute("uv", new THREE.BufferAttribute(uvs, 2));
  }

  // CANNON >>>
  const world = new CANNON.World({ gravity: new CANNON.Vec3(0, -params.cannonGravity, 0) });
  const timeStep = 1 / 60;
  const particleShape = new CANNON.Particle();
  const particles = {};
  const particleBodies = [];

  const headBody = new CANNON.Body({
    mass: 0,
    shape: new CANNON.Sphere(headRadius),
    position: new CANNON.Vec3(0, -headRadius, 0),
  });
  world.addBody(headBody);

  function initCannon() {
    for (let x = 0; x < latheSegments + 1; x++) {
      for (let y = 0; y < crossSegments + 1; y++) {
        const key = `${x} ${y}`;

        const vertexIndex = y + x * (crossSegments + 1);
        const vertexPosition = hatRef.current.geometry.getAttribute("position");

        const xPos = vertexPosition.getX(vertexIndex);
        const yPos = vertexPosition.getY(vertexIndex);
        const zPos = vertexPosition.getZ(vertexIndex);

        const particleBody = new CANNON.Body({
          mass: params.fabricWeight,
          shape: particleShape,
          position: new CANNON.Vec3(xPos, yPos, zPos),
        });

        particles[key] = particleBody;
        world.addBody(particleBody);
        particleBodies.push(particleBody);
      }
    }

    for (let x = latheSegments; x >= 0; x--) {
      for (let y = crossSegments; y >= 0; y--) {
        const key = `${x} ${y}`;

        // connect to vertical partical
        if (y - 1 >= 0) {
          connect(particles[`${x} ${y}`], particles[`${x} ${y - 1}`], y);
        }

        // connect to horizontal
        if (x - 1 >= 0) {
          connect(particles[`${x} ${y}`], particles[`${x - 1} ${y}`], y);
        } else {
          connect(particles[`${x} ${y}`], particles[`${latheSegments} ${y}`], y);
        }
      }
    }

    function connect(bodyA, bodyB, y, lockForce = params.fabricStiffness) {
      let adjustedLockForce = lockForce;
      if (y < crownSegments + 1) {
        const easingInput = 1 - y / crownSegments;
        const easingOutput = 1 - Math.pow(1 - easingInput, 5);

        adjustedLockForce *= 5 + easingOutput * 20;
      }
      const lockConstraint = new CANNON.LockConstraint(bodyA, bodyB, {
        maxForce: adjustedLockForce,
      });
      const distanceConstraint = new CANNON.DistanceConstraint(bodyA, bodyB);
      world.addConstraint(lockConstraint);
      world.addConstraint(distanceConstraint);
    }
  }

  function updateVertices() {
    if (!hatRef.current) return;
    const geometry = hatRef.current.geometry;
    const posArray = geometry.getAttribute("position");

    particleBodies.forEach((particle, index) => {
      const x = particle.position.x;
      const y = particle.position.y;
      const z = particle.position.z;

      if (index % (crossSegments + 1) == 0) {
        posArray.setXYZ(
          index,
          particleBodies[0].position.x,
          particleBodies[0].position.y,
          particleBodies[0].position.z
        );
      } else {
        posArray.setXYZ(index, x, y, z);
      }
    });

    posArray.needsUpdate = true;
    geometry.computeVertexNormals();
  }

  useFrame(() => {
    if (params.simulation) {
      world.step(timeStep);
    }

    updateVertices();
  });

  return (
    <>
      <mesh
        ref={hatRef}
        position={[0, 75, -20]}
        scale={[params.headRatio, 1, 1]}
        rotation={[-0.3, Math.PI, 0]}
      >
        <latheGeometry args={[points, latheSegments]} />
        <meshStandardMaterial color={"orange"} flatShading={true} side={THREE.DoubleSide} />
      </mesh>
      {/* <mesh>
        <sphereGeometry args={[headRadius]} />
        <meshStandardMaterial />
      </mesh> */}
    </>
  );
}
