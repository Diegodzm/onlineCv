# TODO: Solar System Simulation Updates

## Tasks
- [x] Modify planets to orbit the sun in elliptical paths
  - Update initPlanets to set orbital parameters (semi-major axis, eccentricity, angle, angular speed)
  - Change updatePlanets to calculate positions using orbital mechanics
- [x] Add asteroid with fiery trail
  - Create initAsteroid function
  - Add asteroid object with random position, direction, and speed
  - Implement drawAsteroid with trail effect
  - Update drawSpaceScene to include asteroid
  - Add asteroid movement in animation loop
- [x] Test the simulation for smooth orbits and asteroid movement
