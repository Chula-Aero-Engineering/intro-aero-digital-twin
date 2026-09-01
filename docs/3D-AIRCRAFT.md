# Semester Aircraft Asset

The app uses one instructor-owned aircraft throughout the semester. Students do not edit Blender or Three.js files.

## Runtime asset

- Editable Blender source: `assets/blender/course-aircraft.blend`
- Browser export: `public/models/course-aircraft.glb`
- Reproducible build script: `scripts/build-course-aircraft.py`
- Renderer and fallback: `src/core/visualization/AircraftViewport.jsx`

The GLB is deliberately small enough for classroom Wi-Fi and iPads. It is a stylized introductory teaching aircraft, not CAD geometry and not evidence for aerodynamic or structural conclusions.

## Coordinate frame and named parts

The course frame is `+x forward, +y right wing, +z up`. Named meshes include the fuselage, cowling, canopy, left/right wings, ailerons, horizontal tail, elevators, vertical tail, rudder, propeller, and landing gear. A hidden CG marker is retained in the Blender source for later instructor visualization work.

This structure lets a future instructor-core lesson animate or highlight a named part while keeping student modules data-only. For example, a control lesson may map a student-calculated elevator angle to `Elevator_Left` and `Elevator_Right`; that lesson must be planned separately and must not rewrite student physics.

## Rebuilding after an instructor edit

Open the `.blend` file and export glTF Binary to `public/models/course-aircraft.glb`, or run Blender in the repository root:

```bash
blender --background --python scripts/build-course-aircraft.py
```

The script saves both the `.blend` source and the GLB. Blender is an instructor authoring dependency only; it is not an npm dependency and students do not need it.

If the GLB is missing or cannot load, the core renderer displays its procedural aircraft fallback so analyses and plots remain usable.
