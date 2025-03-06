import { useEffect, useRef } from "react";
import * as THREE from "three";
import * as CANNON from "cannon-es";
import { useFrame } from "@react-three/fiber";

const latheSegments = 20;
const headRadius = 85;

export default function HatMesh({ params }) {
  const hatRef = useRef();

  useEffect(() => {
    const timer = setTimeout(() => {
      initCannon();

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

  const crownSegments = 3;
  const headSegments = 3;
  const brimSegments = 8;
  const crossSegments = crownSegments + headSegments + brimSegments;

  const points = [];

  points.push(
    ...curve0.getPoints(crownSegments).slice(0, -1),
    ...curve1.getPoints(headSegments).slice(0, -1),
    ...curve2.getPoints(brimSegments)
  );

  // CANNON >>>

  const world = new CANNON.World({ gravity: new CANNON.Vec3(0, -params.cannonGravity, 0) });
  const timeStep = 1 / 60;
  const particleShape = new CANNON.Particle();
  const particles = {};
  const particleBodies = [];

  const headBody = new CANNON.Body({
    mass: 0,
    shape: new CANNON.Sphere(headRadius + 10),
    position: new CANNON.Vec3(0, -headRadius - 10, 0),
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
          console.log("asdf");
          connect(particles[`${x} ${y}`], particles[`${latheSegments} ${y}`], y);
        }
      }
    }

    function connect(bodyA, bodyB, y, lockForce = params.fabricStiffness) {
      let adjustedLockForce = lockForce;
      if (y < crownSegments + 1) {
        adjustedLockForce *= 20;
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
        position={[0, params.headHeight, -25]}
        rotation={[-0.3, Math.PI, 0]}
        castShadow
        receiveShadow
      >
        <latheGeometry args={[points, latheSegments]} scale={[params.headRatio, 3, 0]} />
        <meshStandardMaterial
          color={"orange"}
          flatShading={true}
          side={THREE.DoubleSide}
          // wireframe={true}
        />
      </mesh>
    </>
  );
}
