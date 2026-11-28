const fs = require('fs');
const path = require('path');
const vm = require('vm');

const ROOT = path.resolve(__dirname, '..');
const DOMAIN = 'https://physicsprasanth.vercel.app';
const TODAY = '2026-11-28';
const ADSENSE_CLIENT = 'ca-pub-6928817668817115';
const WHATSAPP_URL = 'https://whatsapp.com/channel/0029Vb81ejl35fM0U1ujrP2y';

// Load data/catalogue.js safely
const catSrc = fs.readFileSync(path.join(ROOT, 'data', 'catalogue.js'), 'utf8');
const ctx = { window: {} };
vm.runInNewContext(catSrc, ctx);
const catalogue = ctx.window.PHYSICS_CATALOGUE;

const SIMS = [
  {
    id: 'projectile',
    title: 'Projectile Motion & Ballistics Simulation',
    shortName: 'Projectile Motion',
    level: 'Class XI Physics',
    chapter: 'Motion in a Plane (Kinematics)',
    chapterRef: '11-04',
    summary: 'Explore parabolic projectile trajectories, launch angle optimization (45 degrees for max horizontal range), air drag effects, horizontal and vertical velocity components, and time of flight.',
    formulas: [
      'R = \\frac{u^2 \\sin 2\\theta}{g}',
      'H_{\\max} = \\frac{u^2 \\sin^2\\theta}{2g}',
      'T = \\frac{2u \\sin\\theta}{g}',
      'y = x\\tan\\theta - \\frac{gx^2}{2u^2\\cos^2\\theta}'
    ],
    variables: ['Initial speed (u)', 'Launch angle (theta)', 'Gravitational acceleration (g)', 'Air resistance / drag'],
    examFocus: 'Frequently tested in CBSE Class 11 Kinematics (3-5 marks): prove trajectory of a projectile is a parabola and derive range at complementary angles (theta and 90-theta).',
    faqs: [
      ['At what launch angle is horizontal range maximum?', 'At 45 degrees (when air drag is ignored and launch/landing heights are equal), because sin(2 * 45) = 1.'],
      ['Does horizontal velocity change during ideal projectile motion?', 'No. Since gravity acts vertically downward, horizontal acceleration ax = 0 and vx = u cos(theta) remains constant.']
    ],
    related: ['circular', 'fric', 'orbit']
  },
  {
    id: 'pendulum',
    title: 'Double Pendulum & Chaos Dynamics Simulation',
    shortName: 'Double Pendulum',
    level: 'Class XI Physics',
    chapter: 'Oscillations & Rotational Dynamics',
    chapterRef: '11-14',
    summary: 'Visualize deterministic chaos in a coupled two-bob pendulum system. Adjust bob masses, rod lengths, and release angles to see extreme sensitivity to initial conditions and conservation of mechanical energy.',
    formulas: [
      'E = K_1 + K_2 + U_1 + U_2 = \\text{constant}',
      'U = -(m_1+m_2)gL_1\\cos\\theta_1 - m_2 gL_2\\cos\\theta_2',
      'T_{\\text{small}} = 2\\pi\\sqrt{\\frac{L}{g}}'
    ],
    variables: ['Arm lengths L1, L2', 'Bob masses m1, m2', 'Initial angles theta1, theta2', 'Gravity & damping'],
    examFocus: 'Strengthens understanding of coupled constraints, kinetic vs potential energy exchange, and non-linear mechanics beyond small-angle SHM approximations.',
    faqs: [
      ['Why is a double pendulum chaotic?', 'Its equations of motion are strongly coupled and non-linear, so tiny differences in initial angle grow exponentially over time.'],
      ['Is total energy conserved without damping?', 'Yes. Without air resistance or pivot friction, kinetic energy and gravitational potential energy sum to a fixed constant.']
    ],
    related: ['shm', 'wave', 'orbit']
  },
  {
    id: 'orbit',
    title: 'Orbital Mechanics & N-Body Gravity Simulation',
    shortName: 'Orbital Mechanics',
    level: 'Class XI Physics',
    chapter: 'Gravitation',
    chapterRef: '11-08',
    summary: 'Interactive N-body gravitational sandbox. Click and drag to launch satellites with custom velocity vectors, compare circular vs elliptical orbits, verify Kepler laws, and test escape velocity.',
    formulas: [
      'F = \\frac{GMm}{r^2}',
      'v_o = \\sqrt{\\frac{GM}{r}}',
      'v_e = \\sqrt{\\frac{2GM}{r}} = \\sqrt{2}\\,v_o',
      'T^2 = \\frac{4\\pi^2}{GM} r^3'
    ],
    variables: ['Central body mass M', 'Launch speed & direction', 'Orbital radius r', 'Angular momentum'],
    examFocus: 'Core CBSE Class 11 Gravitation (3-5 marks): derive orbital velocity, escape velocity relation ve = sqrt(2) * vo, and Kepler third law of periods.',
    faqs: [
      ['How is escape velocity related to low-orbit speed?', 'Escape velocity is sqrt(2) times the circular orbital speed at the same radius: ve = sqrt(2) * vo.'],
      ['Why do planets sweep equal areas in equal times?', 'Because central gravitational force produces zero torque, conserving angular momentum L = mvr.']
    ],
    related: ['circular', 'projectile', 'rutherford']
  },
  {
    id: 'optics',
    title: 'Wave & Ray Optics: Refraction & Snell Law Simulation',
    shortName: 'Wave & Optics Refraction',
    level: 'Class XII Physics',
    chapter: 'Ray Optics & Optical Instruments',
    chapterRef: '12-09',
    summary: 'Investigate refraction across optical media, measure angles of incidence and refraction, verify Snell Law, and discover the Critical Angle and Total Internal Reflection (TIR).',
    formulas: [
      'n_1 \\sin i = n_2 \\sin r',
      '\\sin i_c = \\frac{n_{\\text{rarer}}}{n_{\\text{denser}}}',
      'v = \\frac{c}{n}'
    ],
    variables: ['Incident angle (i)', 'Refractive index n1', 'Refractive index n2', 'Critical angle threshold'],
    examFocus: 'High-weightage CBSE Class 12 Ray Optics topic (8-9 marks unit): Total Internal Reflection conditions, optical fibers, and apparent depth.',
    faqs: [
      ['What are the two essential conditions for Total Internal Reflection?', 'Light must travel from a denser to a rarer medium, and the angle of incidence must exceed the critical angle ic.'],
      ['Which property of light stays constant during refraction?', 'Frequency remains unchanged across boundaries while wavelength and speed change by factor 1/n.']
    ],
    related: ['huygens', 'lens', 'ydse']
  },
  {
    id: 'electro',
    title: 'Electrostatics: Coulomb Electric Field & Dipole Simulation',
    shortName: 'Electrostatics Field',
    level: 'Class XII Physics',
    chapter: 'Electric Charges and Fields',
    chapterRef: '12-01',
    summary: 'Visualize electric field vectors and superposition from positive and negative charges. Adjust charges q1 and q2 to form an electric dipole, null points, and map field intensity.',
    formulas: [
      'F = \\frac{1}{4\\pi\\varepsilon_0}\\frac{|q_1 q_2|}{r^2}',
      '\\vec{E} = \\frac{1}{4\\pi\\varepsilon_0}\\frac{q}{r^2}\\hat{r}',
      'E_{\\text{axial}} = \\frac{1}{4\\pi\\varepsilon_0}\\frac{2p}{r^3},\\quad E_{\\text{eq}} = \\frac{1}{4\\pi\\varepsilon_0}\\frac{p}{r^3}'
    ],
    variables: ['Charge q1 magnitude & sign', 'Charge q2 magnitude & sign', 'Separation distance', 'Test field probing'],
    examFocus: 'CBSE Class 12 Chapter 1 guaranteed derivation (3-5 marks): electric field on axial and equatorial line of an electric dipole and Coulomb vector form.',
    faqs: [
      ['Why do two electric field lines never intersect?', 'If they crossed, the net electric field at the point of intersection would have two different directions, which is physically impossible.'],
      ['What is the ratio of axial to equatorial field at equal large distance?', 'For r >> a, E(axial) = 2 * E(equatorial) and their directions are antiparallel.']
    ],
    related: ['rutherford', 'circuit', 'magnet']
  },
  {
    id: 'circuit',
    title: 'Current Electricity: Series & Parallel DC Circuit Lab',
    shortName: 'DC Circuit Lab',
    level: 'Class XII Physics',
    chapter: 'Current Electricity',
    chapterRef: '12-03',
    summary: 'Analyze resistor combinations in series and parallel with live branch currents, potential drops, equivalent resistance Req, and battery current readings.',
    formulas: [
      'R_{\\text{series}} = R_1 + R_2 + \\dots',
      '\\frac{1}{R_{\\text{parallel}}} = \\frac{1}{R_1} + \\frac{1}{R_2} + \\dots',
      'I = \\frac{V}{R_{\\text{eq}}}'
    ],
    variables: ['Source voltage V', 'Resistor values R1, R2, R3', 'Series vs Parallel topology'],
    examFocus: 'Essential for CBSE Class 12 Current Electricity (7-8 marks), Kirchhoff rules numericals, and Wheatstone bridge setups.',
    faqs: [
      ['Which stays constant across parallel resistors: current or voltage?', 'Potential difference (voltage) across every parallel branch is the same, while current divides inversely with resistance.'],
      ['Why does adding a parallel resistor decrease total resistance?', 'It opens an extra conducting path for charge flow, increasing total current for the same voltage.']
    ],
    related: ['ohms', 'lcr', 'galv']
  },
  {
    id: 'magnet',
    title: 'Magnetic Lorentz Force & Cyclotron Simulation',
    shortName: 'Magnetic Lorentz Force',
    level: 'Class XII Physics',
    chapter: 'Moving Charges and Magnetism',
    chapterRef: '12-04',
    summary: 'Observe a charged particle q moving perpendicular to a uniform magnetic field B. Vary charge, velocity, mass, and magnetic field to inspect cyclotron radius and circular orbits.',
    formulas: [
      '\\vec{F} = q(\\vec{v} \\times \\vec{B}) = qvB\\sin\\theta',
      'r = \\frac{mv}{qB}',
      'T = \\frac{2\\pi m}{qB},\\quad f_c = \\frac{qB}{2\\pi m}'
    ],
    variables: ['Particle speed v', 'Magnetic field B', 'Charge-to-mass ratio q/m', 'Preset: Tight Cyclotron'],
    examFocus: 'Classic CBSE Class 12 & NEET/JEE problem: prove that cyclotron time period T = 2*pi*m/(qB) is independent of particle speed and radius.',
    faqs: [
      ['Does a magnetic field change the kinetic energy of a moving charge?', 'No. Since magnetic force F = q(v x B) is always perpendicular to velocity v, work done is zero and speed stays constant.'],
      ['What path does a charge follow if it enters B at an oblique angle?', 'It follows a helical path whose pitch equals v*cos(theta) * T.']
    ],
    related: ['galv', 'emi', 'acgen']
  },
  {
    id: 'lens',
    title: 'Ray Optics: Mirrors & Thin Lenses Interactive Lab',
    shortName: 'Mirrors & Lenses',
    level: 'Class XII Physics',
    chapter: 'Ray Optics & Optical Instruments',
    chapterRef: '12-09',
    summary: 'Simulate all 6 CBSE object positions for Concave Mirrors, Convex Mirrors, Convex Lenses, and Concave Lenses with principal rays, focal points, real/virtual images, and magnification.',
    formulas: [
      '\\frac{1}{f} = \\frac{1}{v} + \\frac{1}{u} \\quad (\\text{Mirror})',
      '\\frac{1}{f} = \\frac{1}{v} - \\frac{1}{u} \\quad (\\text{Thin Lens})',
      '\\frac{1}{f} = (\\mu - 1)\\left(\\frac{1}{R_1} - \\frac{1}{R_2}\\right)',
      'm = \\frac{h_i}{h_o} = \\frac{v}{u} \\;(\\text{lens}) = -\\frac{v}{u} \\;(\\text{mirror})'
    ],
    variables: ['Optical device type', 'Object distance u', 'Focal length f', 'Screen placement'],
    examFocus: 'Highest-weightage chapter in Class 12 (8-9 marks): Lens Maker Formula, sign convention ray diagrams, and compound optical instruments.',
    faqs: [
      ['When does a convex lens form a virtual magnified image?', 'When the object is placed between the optical center O and principal focus F1 (used in a simple magnifying glass).'],
      ['Can a concave mirror ever form a diminished image?', 'Yes, whenever the object is placed beyond the center of curvature C (or at infinity).']
    ],
    related: ['optics', 'huygens', 'ydse']
  },
  {
    id: 'ydse',
    title: "Young's Double-Slit Experiment (YDSE) Simulation",
    shortName: 'Double-Slit YDSE',
    level: 'Class XII Physics',
    chapter: 'Wave Optics',
    chapterRef: '12-10',
    summary: 'Interactive Young double-slit interference lab with live propagating light waves and wavefronts, movable slits and screen, variable wavelength lambda, slit separation d, and screen distance D.',
    formulas: [
      '\\beta = \\frac{\\lambda D}{d}',
      '\\Delta x = d\\sin\\theta \\approx \\frac{y d}{D}',
      'I = 4 I_0 \\cos^2\\left(\\frac{\\phi}{2}\\right)'
    ],
    variables: ['Wavelength (lambda)', 'Slit spacing (d)', 'Screen distance (D)', 'Live wavefront visibility'],
    examFocus: 'Top CBSE Class 12 Wave Optics question (5-6 marks): derive fringe width beta = lambda*D/d and explain effect of changing d, D, or immersing setup in water.',
    faqs: [
      ['What happens to fringe width if slit separation d increases?', 'Since beta = lambda*D/d, increasing slit spacing d makes interference fringes narrower (closer together).'],
      ['What happens if the YDSE apparatus is immersed in water?', 'Wavelength decreases to lambda/mu, so fringe width shrinks to beta/mu.']
    ],
    related: ['huygens', 'optics', 'photo']
  },
  {
    id: 'emi',
    title: "Electromagnetic Induction: Faraday & Lenz's Law Lab",
    shortName: 'EMI Faraday & Lenz',
    level: 'Class XII Physics',
    chapter: 'Electromagnetic Induction',
    chapterRef: '12-06',
    summary: 'Drag a bar magnet through a solenoid coil and observe real-time magnetic flux changes, induced EMF spikes, induced current direction opposing motion (Lenz Law), and galvanometer deflection.',
    formulas: [
      '\\Phi_B = \\vec{B} \\cdot \\vec{A} = BA\\cos\\theta',
      '\\varepsilon = -N\\frac{d\\Phi_B}{dt}',
      '\\varepsilon_{\\text{motional}} = B l v'
    ],
    variables: ['Magnet speed & position', 'Coil turns N', 'Field strength B', 'Flux vs EMF waveform'],
    examFocus: 'Core CBSE Class 12 EMI concept (4-5 marks): Lenz law as a consequence of conservation of energy and polarity prediction questions.',
    faqs: [
      ['How does Lenz Law obey Conservation of Energy?', 'The induced current opposes the magnet motion, requiring mechanical work to push the magnet—this mechanical work converts into electrical energy.'],
      ['When is induced EMF zero even in a strong magnetic field?', 'When the magnetic flux linked with the coil is constant (dPhi/dt = 0).']
    ],
    related: ['acgen', 'lcr', 'magnet']
  },
  {
    id: 'photo',
    title: 'Photoelectric Effect Simulation — Dual Nature of Light',
    shortName: 'Photoelectric Effect',
    level: 'Class XII Physics',
    chapter: 'Dual Nature of Radiation and Matter',
    chapterRef: '12-11',
    summary: 'Interactive evacuated quartz tube lab with emitter/collector plates, ammeter, light frequency slider, intensity slider, target metal work function selector, and stopping potential control.',
    formulas: [
      'K_{\\max} = h\\nu - \\phi_0 = e V_0',
      '\\phi_0 = h\\nu_0 = \\frac{hc}{\\lambda_0}',
      '\\lambda_{\\text{de Broglie}} = \\frac{h}{p} = \\frac{h}{\\sqrt{2meV}}'
    ],
    variables: ['Incident frequency (nu) & color', 'Light intensity', 'Target cathode metal', 'Collector accelerating/retarding voltage V'],
    examFocus: 'Guaranteed CBSE Class 12 graphs & reasoning (4 marks): effect of intensity vs frequency on photocurrent and stopping potential V0.',
    faqs: [
      ['Does increasing light intensity increase maximum kinetic energy of photoelectrons?', 'No. Intensity increases photon count (increasing saturation current), while maximum kinetic energy depends strictly on frequency and work function.'],
      ['What is threshold frequency nu0?', 'The minimum frequency of incident radiation required to eject electrons from a given metal surface (below nu0, zero emission occurs regardless of intensity).']
    ],
    related: ['ydse', 'rutherford', 'optics']
  },
  {
    id: 'shm',
    title: 'Simple Harmonic Motion (SHM) Spring-Mass Simulation',
    shortName: 'SHM Oscillations',
    level: 'Class XI Physics',
    chapter: 'Oscillations',
    chapterRef: '11-14',
    summary: 'Drag and release a spring-mass oscillator to study restoring force F = -kx, displacement-velocity-acceleration phase relations, and continuous conversion between kinetic and elastic potential energy.',
    formulas: [
      'F = -kx,\\quad a = -\\omega^2 x',
      'T = 2\\pi\\sqrt{\\frac{m}{k}}',
      'K = \\frac{1}{2}k(A^2 - x^2),\\quad U = \\frac{1}{2}kx^2,\\quad E = \\frac{1}{2}kA^2'
    ],
    variables: ['Spring constant k', 'Block mass m', 'Amplitude A', 'Damping ratio'],
    examFocus: 'Key CBSE Class 11 & NEET/JEE concept: energy graphs vs displacement x and phase difference pi/2 between x and v, and pi between x and a.',
    faqs: [
      ['At what position is kinetic energy equal to potential energy in SHM?', 'When x = +/- A / sqrt(2), K = U = (1/4)kA^2.'],
      ['Where is acceleration maximum during SHM?', 'At the extreme ends x = +/- A, where restoring force is maximum and velocity is momentarily zero.']
    ],
    related: ['pendulum', 'wave', 'col']
  },
  {
    id: 'fric',
    title: 'Friction on an Inclined Plane Simulation',
    shortName: 'Friction Incline',
    level: 'Class XI Physics',
    chapter: 'Laws of Motion',
    chapterRef: '11-05',
    summary: 'Visualize normal reaction, mg sin(theta), mg cos(theta), static friction fs, and kinetic friction fk on a tilted ramp. Raise the incline angle until the block crosses the angle of repose and slips.',
    formulas: [
      'N = mg\\cos\\theta',
      'f_{s,\\max} = \\mu_s N,\\quad \\tan\\theta_{\\text{repose}} = \\mu_s',
      'a = g(\\sin\\theta - \\mu_k\\cos\\theta)'
    ],
    variables: ['Incline angle (theta)', 'Static coefficient (mu_s)', 'Kinetic coefficient (mu_k)', 'Block mass m'],
    examFocus: 'Essential Class 11 Free Body Diagram skill: distinguish self-adjusting static friction from constant kinetic friction.',
    faqs: [
      ['What is the Angle of Repose?', 'The minimum incline angle at which a body placed on the incline just begins to slide down; mathematically tan(theta) = mu_s.'],
      ['Why is kinetic friction slightly less than limiting static friction?', 'Once sliding starts, surface asperities have less time to interlock cold-welded junctions compared to rest.']
    ],
    related: ['circular', 'col', 'projectile']
  },
  {
    id: 'col',
    title: '1D Elastic & Inelastic Collisions Simulation',
    shortName: '1D Collisions',
    level: 'Class XI Physics',
    chapter: 'Work, Energy and Power',
    chapterRef: '11-06',
    summary: 'Simulate head-on collisions between two blocks. Vary masses m1, m2, initial velocities u1, u2, and coefficient of restitution e (from perfectly inelastic e=0 to perfectly elastic e=1).',
    formulas: [
      'm_1 u_1 + m_2 u_2 = m_1 v_1 + m_2 v_2',
      'e = \\frac{v_2 - v_1}{u_1 - u_2}',
      '\\Delta K = \\frac{1}{2}\\frac{m_1 m_2}{m_1 + m_2}(u_1 - u_2)^2(1 - e^2)'
    ],
    variables: ['Masses m1 and m2', 'Initial velocities u1, u2', 'Coefficient of restitution e'],
    examFocus: 'Frequently asked in JEE Main & NEET: compute fractional kinetic energy loss and special cases when m1 = m2 during elastic impact.',
    faqs: [
      ['What happens when two equal masses collide head-on elastically?', 'They exchange their velocities completely (v1 = u2 and v2 = u1).'],
      ['Is linear momentum conserved in an inelastic collision?', 'Yes, provided zero external net force acts on the two-body system during the collision—even though kinetic energy is lost.']
    ],
    related: ['fric', 'shm', 'projectile']
  },
  {
    id: 'wave',
    title: 'Standing Waves & String Harmonics Simulation',
    shortName: 'Standing Waves',
    level: 'Class XI Physics',
    chapter: 'Waves',
    chapterRef: '11-15',
    summary: 'Observe transverse stationary waves on a stretched string fixed at both ends. Adjust tension, linear mass density, and harmonic mode n to identify nodes and antinodes.',
    formulas: [
      'v = \\sqrt{\\frac{T}{\\mu}}',
      'f_n = \\frac{n}{2L}\\sqrt{\\frac{T}{\\mu}} = n f_1',
      'y(x,t) = 2A\\sin(kx)\\cos(\\omega t)'
    ],
    variables: ['String tension T', 'Harmonic number n', 'Length L', 'Linear density mu'],
    examFocus: 'CBSE Class 11 Waves derivation & Sonometer practical: show distance between two consecutive nodes is lambda/2 and all harmonics (1, 2, 3...) exist.',
    faqs: [
      ['What is the distance between a node and the adjacent antinode?', 'Exactly one-quarter of a wavelength (lambda / 4).'],
      ['How does string frequency change if tension is quadrupled?', 'Since f is proportional to sqrt(T), quadrupling tension doubles the frequency.']
    ],
    related: ['shm', 'ydse', 'huygens']
  },
  {
    id: 'ohms',
    title: "Ohm's Law & Electrical Power Simulation",
    shortName: "Ohm's Law Lab",
    level: 'Class XII Physics',
    chapter: 'Current Electricity',
    chapterRef: '12-03',
    summary: 'Interactive Ohm Law circuit with variable DC voltage, load resistance, current flow, and bulb glow scaling dynamically with dissipated electrical power P = VI.',
    formulas: [
      'V = I R',
      'P = V I = I^2 R = \\frac{V^2}{R}',
      'R = \\rho\\frac{L}{A}'
    ],
    variables: ['Applied voltage V', 'Resistor value R', 'Power output & current'],
    examFocus: 'Foundation for CBSE Class 12 Current Electricity practicals and non-ohmic vs ohmic V-I characteristic curves.',
    faqs: [
      ['What does the slope of a V-vs-I graph represent?', 'Resistance R = Delta V / Delta I for an ohmic conductor at constant temperature.'],
      ['Why is Ohm Law not universal?', 'Devices like p-n junction diodes and transistors have non-linear V-I curves and violate proportionality.']
    ],
    related: ['circuit', 'lcr', 'galv']
  },
  {
    id: 'circular',
    title: 'Circular Motion, Bending of Cyclist & Banked Road Simulation',
    shortName: 'Circular Motion & Banking',
    level: 'Class XI Physics',
    chapter: 'Laws of Motion (Circular Dynamics)',
    chapterRef: '11-05',
    summary: 'Switch between Bending of Cyclist, Car on Level Road, and Car on Banked Road. Vary speed, turn radius, road friction, and banking angle to test centripetal force and skidding limits.',
    formulas: [
      '\\tan\\theta = \\frac{v^2}{rg} \\quad (\\text{Cyclist / Ideal Banked})',
      'v_{\\text{level, max}} = \\sqrt{\\mu_s r g}',
      'v_{\\text{banked, max}} = \\sqrt{rg\\frac{\\mu_s + \\tan\\theta}{1 - \\mu_s\\tan\\theta}}'
    ],
    variables: ['Vehicle speed v', 'Turn radius r', 'Road friction mu_s', 'Banking angle theta'],
    examFocus: 'Classic CBSE Class 11 Laws of Motion derivation (3-5 marks): derive maximum safe speed on a banked circular road with friction.',
    faqs: [
      ['Why does a cyclist lean inward while taking a curved turn?', 'Leaning tilts the normal reaction force so its horizontal component N sin(theta) supplies the needed centripetal force mv^2/r.'],
      ['Why are highway curves banked?', 'Banking supplies centripetal force via normal reaction so vehicles can turn safely without relying solely on tire friction.']
    ],
    related: ['fric', 'orbit', 'projectile']
  },
  {
    id: 'galv',
    title: 'Moving Coil Galvanometer (MCG) Simulation',
    shortName: 'Moving Coil Galvanometer',
    level: 'Class XII Physics',
    chapter: 'Moving Charges and Magnetism',
    chapterRef: '12-04',
    summary: 'Inspect a pivoted rectangular coil inside concave radial magnetic poles with hairspring restoring torque, current sensitivity, and eddy-current dead-beat damping.',
    formulas: [
      '\\tau_{\\text{deflecting}} = N I A B',
      'N I A B = k \\theta \\implies I = \\left(\\frac{k}{NAB}\\right)\\theta',
      'I_s = \\frac{\\theta}{I} = \\frac{NAB}{k},\\quad V_s = \\frac{NAB}{kR}'
    ],
    variables: ['Coil current I', 'Turns N & area A', 'Radial B-field', 'Eddy damping toggle'],
    examFocus: 'Top CBSE Class 12 Magnetism 5-mark question: principle of MCG, role of radial magnetic field and soft iron core, plus conversion to ammeter/voltmeter.',
    faqs: [
      ['Why do galvanometers use concave magnetic poles and a soft-iron core?', 'They create a radial magnetic field so the coil plane stays parallel to B at every angle, keeping sin(theta) = 1 and deflection proportional to current.'],
      ['How is a galvanometer converted into an ammeter?', 'By connecting a low-resistance shunt S in parallel with the galvanometer coil.']
    ],
    related: ['magnet', 'emi', 'acgen']
  },
  {
    id: 'acgen',
    title: 'AC Generator & Alternating EMF Simulation',
    shortName: 'AC Generator',
    level: 'Class XII Physics',
    chapter: 'Electromagnetic Induction & Alternating Current',
    chapterRef: '12-06',
    summary: 'Interactive rotating armature coil in a uniform magnetic field with split/slip rings and synchronized flux Phi(t) and EMF e(t) waveforms showing an exact 90-degree phase shift.',
    formulas: [
      '\\Phi_B(t) = N B A \\cos(\\omega t)',
      'e(t) = -\\frac{d\\Phi_B}{dt} = N B A \\omega \\sin(\\omega t) = e_0 \\sin(\\omega t)',
      'e_0 = N B A \\omega = 2\\pi f N B A'
    ],
    variables: ['Angular speed omega', 'Coil turns N & area A', 'Magnetic field B', 'Armature orientation'],
    examFocus: 'Standard CBSE Class 12 5-mark question: labeled diagram, working principle, derivation of e = e0 sin(omega*t), and slip-ring commutator function.',
    faqs: [
      ['When is induced EMF maximum in an AC generator?', 'When the plane of the coil is parallel to the magnetic field (magnetic flux Phi is zero, but its rate of change dPhi/dt is maximum).'],
      ['What is the phase difference between magnetic flux and induced EMF?', 'Exactly 90 degrees (pi/2 radians): flux varies as cos(omega*t) while EMF varies as sin(omega*t).']
    ],
    related: ['emi', 'lcr', 'galv']
  },
  {
    id: 'lcr',
    title: 'Series LCR Resonance & Phasor Diagram Simulation',
    shortName: 'LCR Series Resonance',
    level: 'Class XII Physics',
    chapter: 'Alternating Current',
    chapterRef: '12-07',
    summary: 'Adjust source angular frequency omega, inductance L, capacitance C, and resistance R to hit electrical resonance, observe rotating phasors VR, VL, VC, impedance triangle, and Q-factor.',
    formulas: [
      'Z = \\sqrt{R^2 + (X_L - X_C)^2},\\quad X_L = \\omega L,\\; X_C = \\frac{1}{\\omega C}',
      '\\omega_r = \\frac{1}{\\sqrt{LC}},\\quad f_r = \\frac{1}{2\\pi\\sqrt{LC}}',
      'Q = \\frac{\\omega_r L}{R} = \\frac{1}{R}\\sqrt{\\frac{L}{C}}'
    ],
    variables: ['AC angular frequency omega', 'Inductance L', 'Capacitance C', 'Resistance R'],
    examFocus: 'Repeated CBSE Class 12 AC 5-mark derivation: impedance triangle via phasor diagram, resonance condition XL = XC, and power factor cos(phi) = R/Z.',
    faqs: [
      ['What is the power factor of a series LCR circuit at resonance?', 'At resonance XL = XC so Z = R and phase angle phi = 0, giving maximum power factor cos(phi) = 1.'],
      ['How does decreasing resistance R affect resonance sharpness?', 'Lower R raises peak current and increases Quality Factor Q = (1/R)sqrt(L/C), making the resonance curve sharper.']
    ],
    related: ['acgen', 'emi', 'circuit']
  },
  {
    id: 'huygens',
    title: "Huygens' Principle: Wavefronts & Snell Law Simulation",
    shortName: "Huygens' Principle",
    level: 'Class XII Physics',
    chapter: 'Wave Optics',
    chapterRef: '12-10',
    summary: 'Watch secondary wavelets expand from a plane wavefront crossing a medium boundary to visually construct reflected and refracted wavefronts and prove Snell Law.',
    formulas: [
      '\\frac{\\sin i}{\\sin r} = \\frac{v_1}{v_2} = \\frac{n_2}{n_1}',
      '\\angle i = \\angle r \\;(\\text{Reflection})'
    ],
    variables: ['Incident wavefront angle i', 'Medium speeds v1, v2', 'Wavelet envelope toggle', 'Reflection vs Refraction'],
    examFocus: 'Repeated CBSE Class 12 Wave Optics 3-mark derivation: prove laws of reflection and Snell law of refraction using Huygens wavefront construction.',
    faqs: [
      ['What is the shape of a wavefront from a distant star or point source at large distance?', 'Plane wavefront (whereas nearby point sources form spherical wavefronts, and line slits form cylindrical wavefronts).'],
      ['Why is the angle between rays and wavefronts always 90 degrees?', 'Rays indicate direction of energy propagation perpendicular to surfaces of constant phase (wavefronts).']
    ],
    related: ['ydse', 'optics', 'wave']
  },
  {
    id: 'rutherford',
    title: 'Rutherford Alpha-Scattering & Nuclear Model Simulation',
    shortName: 'Rutherford Scattering',
    level: 'Class XII Physics',
    chapter: 'Atoms',
    chapterRef: '12-12',
    summary: 'Fire energetic alpha particles toward a heavy gold nucleus across varying impact parameters b. Observe hyperbolic Coulomb repulsion trajectories, deflection angle theta, and head-on backscattering.',
    formulas: [
      'b = \\frac{1}{4\\pi\\varepsilon_0}\\frac{Z e^2 \\cot(\\theta/2)}{E_k}',
      'r_0 = \\frac{1}{4\\pi\\varepsilon_0}\\frac{2 Z e^2}{E_k} \\quad (\\text{Distance of closest approach})'
    ],
    variables: ['Impact parameter b', 'Alpha kinetic energy Ek', 'Target atomic number Z'],
    examFocus: 'Core CBSE Class 12 Atoms 3-mark topic: explain why most alpha particles pass undeflected while a few rebound at 180 degrees, and calculate distance of closest approach r0.',
    faqs: [
      ['What happens when impact parameter b approaches zero?', 'The alpha particle undergoes a head-on collision and rebounds back at scattering angle theta = 180 degrees at the distance of closest approach r0.'],
      ['Why did Rutherford conclude the atom is mostly empty space?', 'Because over 99.8% of alpha particles passed straight through the thin gold foil with minimal deflection.']
    ],
    related: ['electro', 'photo', 'orbit']
  }
];

const CHAPTER_TO_SIM = {
  '12-01': 'electro',
  '12-03': 'circuit',
  '12-04': 'galv',
  '12-06': 'acgen',
  '12-07': 'lcr',
  '12-09': 'lens',
  '12-10': 'ydse',
  '12-11': 'photo',
  '12-12': 'rutherford',
  '11-04': 'projectile',
  '11-05': 'circular',
  '11-06': 'col',
  '11-08': 'orbit',
  '11-10': 'hydraulics',
  '11-14': 'shm',
  '11-15': 'wave'
};

const TOP_10_DERIVATIONS = [
  { num: 1, title: 'Electric Field Intensity on Axial and Equatorial Line of an Electric Dipole', chapter: 'Electric Charges and Fields (Ch 1)', marks: '3–5 Marks', sim: 'electro', formula: 'E_{\\text{axial}} = \\frac{1}{4\\pi\\varepsilon_0}\\frac{2p}{r^3},\\quad E_{\\text{eq}} = \\frac{1}{4\\pi\\varepsilon_0}\\frac{p}{r^3}', points: ['Draw labeled dipole length 2a and distance r from center.', 'Resolve E1 and E2 vector directions explicitly.', 'Apply short-dipole condition r >> a; verify E(axial) = 2 * E(equatorial).'] },
  { num: 2, title: 'Capacitance of a Parallel Plate Capacitor (With & Without Dielectric Slab)', chapter: 'Electrostatic Potential & Capacitance (Ch 2)', marks: '3 Marks', sim: null, formula: 'C = \\frac{\\varepsilon_0 A}{d - t(1 - 1/K)}', points: ['Start from field E0 = sigma / epsilon0 in air gap and E = E0 / K inside dielectric.', 'Write potential V = E0(d - t) + (E0/K)t and substitute sigma = Q/A.'] },
  { num: 3, title: 'Relation Between Drift Velocity and Electric Current', chapter: 'Current Electricity (Ch 3)', marks: '2–3 Marks', sim: 'ohms', formula: 'I = n e A v_d,\\quad v_d = \\frac{e E \\tau}{m}', points: ['Derive electron acceleration a = -eE/m and average over relaxation time tau.', 'Compute total charge crossing cross-section A in interval dt.'] },
  { num: 4, title: 'Magnetic Field on the Axis of a Circular Current Loop (Biot-Savart Law)', chapter: 'Moving Charges and Magnetism (Ch 4)', marks: '3–5 Marks', sim: 'galv', formula: 'B = \\frac{\\mu_0 I R^2}{2(R^2 + x^2)^{3/2}}', points: ['Resolve elemental dB into axial and perpendicular components.', 'State explicitly why radial components cancel in diametrically opposite pairs.'] },
  { num: 5, title: 'Force Between Two Parallel Current-Carrying Conductors & Definition of 1 Ampere', chapter: 'Moving Charges and Magnetism (Ch 4)', marks: '3 Marks', sim: 'magnet', formula: '\\frac{F}{L} = \\frac{\\mu_0 I_1 I_2}{2\\pi d}', points: ['Like currents attract, unlike currents repel.', 'Always state the official SI definition of 1 Ampere at the conclusion.'] },
  { num: 6, title: 'Impedance and Resonance in a Series LCR Circuit (Phasor Method)', chapter: 'Alternating Current (Ch 7)', marks: '3–5 Marks', sim: 'lcr', formula: 'Z = \\sqrt{R^2 + (X_L - X_C)^2},\\quad \\omega_r = \\frac{1}{\\sqrt{LC}}', points: ['Sketch the phasor diagram with VR along I, VL leading by 90°, VC lagging by 90°.', 'Equate XL = XC for resonance and sketch the resonance current curve.'] },
  { num: 7, title: "Refraction at a Spherical Surface & Lens Maker's Formula", chapter: 'Ray Optics & Optical Instruments (Ch 9)', marks: '5 Marks', sim: 'lens', formula: '\\frac{1}{f} = (\\mu - 1)\\left(\\frac{1}{R_1} - \\frac{1}{R_2}\\right)', points: ['Apply New Cartesian sign convention explicitly before step 1.', 'Add refraction equations for first and second spherical surfaces using thin lens assumption.'] },
  { num: 8, title: 'Refraction Through a Prism & Angle of Minimum Deviation', chapter: 'Ray Optics & Optical Instruments (Ch 9)', marks: '3 Marks', sim: 'optics', formula: '\\mu = \\frac{\\sin\\left(\\frac{A + D_m}{2}\\right)}{\\sin\\left(\\frac{A}{2}\\right)}', points: ['Prove i + e = A + delta and r1 + r2 = A from geometry.', 'Set i = e and r1 = r2 = A/2 at minimum deviation delta = Dm.'] },
  { num: 9, title: "Proof of Laws of Reflection and Refraction Using Huygens' Principle", chapter: 'Wave Optics (Ch 10)', marks: '3 Marks', sim: 'huygens', formula: '\\frac{\\sin i}{\\sin r} = \\frac{v_1}{v_2} = \\frac{n_2}{n_1}', points: ['Draw secondary wavelet arcs cleanly with wavefronts perpendicular to rays.', 'Mark wavefront travel distances v1*t and v2*t carefully.'] },
  { num: 10, title: "Bohr's Quantization Condition & Radius of nth Orbit of Hydrogen Atom", chapter: 'Atoms (Ch 12)', marks: '3 Marks', sim: 'rutherford', formula: 'r_n = \\frac{\\varepsilon_0 h^2 n^2}{\\pi m Z e^2} \\propto n^2', points: ['Equate electrostatic attraction to centripetal force mv^2/r.', 'Substitute mvr = nh/(2*pi) and verify rn proportional to n^2.'] }
];

function esc(s) {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function adsenseHead() {
  return `<meta name="google-adsense-account" content="${ADSENSE_CLIENT}">
  <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_CLIENT}" crossorigin="anonymous"></script>`;
}

function adUnit1000() {
  return `<div class="glass-card rounded-2xl p-3 border-slate-800/80 text-center">
  <div class="text-[9px] font-mono uppercase tracking-widest text-slate-500 mb-1">Advertisement</div>
  <!-- 1000 -->
  <ins class="adsbygoogle"
       style="display:block"
       data-ad-client="${ADSENSE_CLIENT}"
       data-ad-slot="5804625781"
       data-ad-format="auto"
       data-full-width-responsive="true"></ins>
  <script>
       (adsbygoogle = window.adsbygoogle || []).push({});
  </script>
</div>`;
}

function sharedHeadShell({ title, description, keywords, canonical, ogImage, jsonLd }) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${esc(title)}</title>
  <meta name="description" content="${esc(description)}">
  <meta name="keywords" content="${esc(keywords)}">
  <meta name="author" content="Prasanth Ganesan">
  <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1">
  <link rel="canonical" href="${canonical}">
  <link rel="icon" type="image/webp" href="/assets/prasanth-physics-logo.webp">
  <link rel="apple-touch-icon" href="/assets/prasanth-physics-logo.webp">
  <link rel="manifest" href="/manifest.json">
  <meta name="theme-color" content="#090d16">
  <meta property="og:type" content="article">
  <meta property="og:site_name" content="Prasanth Physics">
  <meta property="og:title" content="${esc(title)}">
  <meta property="og:description" content="${esc(description)}">
  <meta property="og:url" content="${canonical}">
  <meta property="og:image" content="${ogImage}">
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="670">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${esc(title)}">
  <meta name="twitter:description" content="${esc(description)}">
  <meta name="twitter:image" content="${ogImage}">
  ${adsenseHead()}
  <script type="application/ld+json">${JSON.stringify(jsonLd)}</script>
  <script src="https://cdn.tailwindcss.com"></script>
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.16.8/dist/katex.min.css">
  <script defer src="https://cdn.jsdelivr.net/npm/katex@0.16.8/dist/katex.min.js"></script>
  <script defer src="https://cdn.jsdelivr.net/npm/katex@0.16.8/dist/contrib/auto-render.min.js" onload="renderMathInElement(document.body,{delimiters:[{left:'$$',right:'$$',display:true},{left:'\\\\(',right:'\\\\)',display:false}]});"></script>
  <style>
    body { background: #05070d; color: #f1f5f9; font-family: Inter, system-ui, sans-serif; }
    .glass-card { background: rgba(15, 23, 42, 0.78); border: 1px solid rgba(148, 163, 184, 0.16); backdrop-filter: blur(10px); }
    .katex-display { margin: 0.4rem 0 !important; overflow-x: auto; overflow-y: hidden; }
  </style>
</head>`;
}

function siteHeader(activeTab) {
  const navCls = (tab) => tab === activeTab
    ? 'px-3 py-1.5 rounded-lg text-xs font-semibold bg-cyan-600 text-white'
    : 'px-3 py-1.5 rounded-lg text-xs font-medium text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700/60 transition';
  return `<header class="sticky top-0 z-40 border-b border-slate-800/90 bg-[#090d16]/95 backdrop-blur-md px-4 py-2.5">
  <div class="max-w-6xl mx-auto flex flex-wrap items-center justify-between gap-3">
    <a href="/" class="flex items-center gap-3 group">
      <div class="w-10 h-10 rounded-xl bg-white p-0.5 flex items-center justify-center overflow-hidden shadow-md border border-cyan-500/40">
        <img src="/assets/prasanth-physics-logo.webp" alt="Prasanth Physics Logo" class="w-full h-full object-contain group-hover:scale-105 transition-transform" />
      </div>
      <div>
        <div class="font-extrabold text-sm md:text-base tracking-tight text-white group-hover:text-cyan-300 transition-colors">PRASANTH PHYSICS</div>
        <div class="text-[10px] font-mono text-slate-400 uppercase tracking-wider">Mastery In Physics &bull; Classes XI &amp; XII</div>
      </div>
    </a>
    <nav class="flex flex-wrap items-center gap-2">
      <a href="/" class="${navCls('sims')}">22 Simulations</a>
      <a href="/labs" class="${navCls('labs')}">Lab Guides</a>
      <a href="/formulas" class="${navCls('formulas')}">Formulas &amp; Derivations</a>
      <a href="/presentations" class="${navCls('ppts')}">332 Presentations</a>
    </nav>
  </div>
</header>`;
}

function siteFooter() {
  return `<footer class="border-t border-slate-800/80 bg-[#090d16] py-8 px-4 mt-12">
  <div class="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
    <div class="flex items-center gap-3">
      <img src="/assets/prasanth-educator.jpg" alt="Prasanth Ganesan" class="w-9 h-9 rounded-full object-cover border border-cyan-500/40" />
      <div>
        <div class="font-semibold text-white">Prasanth Ganesan &mdash; Physics Educator</div>
        <div class="text-[11px] text-slate-400">Free CBSE Class XI &amp; XII Simulations, Derivations &amp; Presentations</div>
      </div>
    </div>
    <div class="flex flex-wrap items-center gap-4">
      <a href="/" class="hover:text-cyan-300">Simulations Lab</a>
      <a href="/labs" class="hover:text-cyan-300">22 Lab Guides</a>
      <a href="/formulas" class="hover:text-emerald-300">Formulas &amp; Derivations</a>
      <a href="/presentations" class="hover:text-indigo-300">Presentations</a>
      <a href="${WHATSAPP_URL}" target="_blank" rel="noopener noreferrer" class="text-emerald-400 hover:text-emerald-300 font-medium">WhatsApp Channel</a>
    </div>
  </div>
</footer>`;
}

// 1. Build labs/<id>.html (22 simulation landing pages)
const labsDir = path.join(ROOT, 'labs');
if (!fs.existsSync(labsDir)) fs.mkdirSync(labsDir, { recursive: true });

for (const sim of SIMS) {
  const canonical = `${DOMAIN}/labs/${sim.id}`;
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'LearningResource',
        name: sim.title,
        url: canonical,
        description: sim.summary,
        educationalLevel: [sim.level, 'JEE', 'NEET'],
        learningResourceType: 'Interactive Simulation Guide',
        isAccessibleForFree: true,
        author: { '@type': 'Person', name: 'Prasanth Ganesan' },
        isPartOf: { '@type': 'WebSite', name: 'Prasanth Physics', url: DOMAIN }
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Simulations Lab', item: `${DOMAIN}/` },
          { '@type': 'ListItem', position: 2, name: 'Lab Guides', item: `${DOMAIN}/labs` },
          { '@type': 'ListItem', position: 3, name: sim.shortName, item: canonical }
        ]
      },
      {
        '@type': 'FAQPage',
        mainEntity: sim.faqs.map(([q, a]) => ({
          '@type': 'Question',
          name: q,
          acceptedAnswer: { '@type': 'Answer', text: a }
        }))
      }
    ]
  };

  const relatedCards = sim.related
    .map(rid => SIMS.find(x => x.id === rid))
    .filter(Boolean)
    .map(r => `<a href="/labs/${r.id}" class="glass-card p-4 rounded-xl hover:border-cyan-500/50 transition block">
      <div class="text-[11px] font-mono text-cyan-400">${esc(r.level)}</div>
      <div class="font-bold text-sm text-white mt-0.5">${esc(r.shortName)}</div>
      <div class="text-xs text-slate-400 mt-1 line-clamp-2">${esc(r.chapter)}</div>
    </a>`).join('\n');

  const html = `${sharedHeadShell({
    title: `${sim.title} — ${sim.level} | Prasanth Physics`,
    description: `${sim.summary} Key formulas, interactive variables, and CBSE exam questions for ${sim.chapter}.`,
    keywords: `${sim.shortName} simulation, ${sim.chapter}, ${sim.level}, interactive physics lab, Prasanth Physics, NEET JEE`,
    canonical,
    ogImage: `${DOMAIN}/assets/og-simulations.jpg`,
    jsonLd
  })}
<body class="min-h-screen flex flex-col">
${siteHeader('labs')}
<main class="flex-1 max-w-5xl w-full mx-auto px-4 py-8 space-y-8">
  <nav class="text-xs text-slate-400 flex items-center gap-2 font-mono">
    <a href="/" class="hover:text-cyan-300">Home</a>
    <span>/</span>
    <a href="/labs" class="hover:text-cyan-300">Lab Guides</a>
    <span>/</span>
    <span class="text-cyan-300">${esc(sim.shortName)}</span>
  </nav>

  <section class="glass-card rounded-2xl p-6 md:p-8 border-cyan-500/25 space-y-5">
    <div class="flex flex-wrap items-center gap-2 text-xs font-mono">
      <span class="px-2.5 py-0.5 rounded-full bg-cyan-500/15 text-cyan-300 border border-cyan-500/30">${esc(sim.level)}</span>
      <span class="px-2.5 py-0.5 rounded-full bg-indigo-500/15 text-indigo-300 border border-indigo-500/30">${esc(sim.chapter)}</span>
    </div>
    <h1 class="text-2xl md:text-4xl font-extrabold text-white tracking-tight">${esc(sim.title)}</h1>
    <p class="text-slate-300 text-sm md:text-base leading-relaxed">${esc(sim.summary)}</p>
    <div class="flex flex-wrap items-center gap-3 pt-2">
      <a href="/?sim=${sim.id}" class="px-5 py-3 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-sm shadow-lg shadow-cyan-900/30 transition">
        Launch Live Interactive Simulation &rarr;
      </a>
      <a href="/formulas#ch-${sim.chapterRef}" class="px-4 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-sm border border-slate-700 transition">
        Chapter Formulas &amp; Tips
      </a>
      <a href="/presentations" class="px-4 py-3 rounded-xl bg-indigo-950/60 hover:bg-indigo-900/60 text-indigo-200 font-semibold text-sm border border-indigo-700/40 transition">
        Watch Animated Slides
      </a>
    </div>
  </section>

  <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
    <section class="glass-card rounded-2xl p-6 space-y-4">
      <h2 class="text-lg font-bold text-cyan-300">Key Formulas &amp; Equations</h2>
      <div class="space-y-3">
        ${sim.formulas.map(f => `<div class="p-3 rounded-xl bg-slate-950/80 border border-slate-800 text-slate-100">$$${f}$$</div>`).join('\n')}
      </div>
    </section>

    <section class="glass-card rounded-2xl p-6 space-y-4">
      <h2 class="text-lg font-bold text-emerald-300">Interactive Controls in This Lab</h2>
      <ul class="space-y-2 text-sm text-slate-300 list-disc list-inside">
        ${sim.variables.map(v => `<li>${esc(v)}</li>`).join('\n')}
      </ul>
      <div class="p-4 rounded-xl bg-amber-950/30 border border-amber-700/40 text-xs text-amber-200 leading-relaxed">
        <strong>CBSE / Exam Focus:</strong> ${esc(sim.examFocus)}
      </div>
    </section>
  </div>

  ${adUnit1000()}

  <section class="glass-card rounded-2xl p-6 space-y-4">
    <h2 class="text-lg font-bold text-white">Frequently Asked Conceptual &amp; Viva Questions</h2>
    <div class="space-y-4">
      ${sim.faqs.map(([q, a]) => `<div class="border-b border-slate-800/80 pb-3 last:border-b-0 last:pb-0">
        <h3 class="font-semibold text-sm text-cyan-300">${esc(q)}</h3>
        <p class="text-sm text-slate-300 mt-1">${esc(a)}</p>
      </div>`).join('\n')}
    </div>
  </section>

  <section class="space-y-3">
    <h2 class="text-base font-bold text-slate-200">Related Physics Simulations</h2>
    <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
      ${relatedCards}
    </div>
  </section>
</main>
${siteFooter()}
</body>
</html>`;

  fs.writeFileSync(path.join(labsDir, `${sim.id}.html`), html, 'utf8');
}

// 2. Build labs/index.html (22 Simulation Guides Directory)
const labsIndexHtml = `${sharedHeadShell({
  title: 'All 22 Physics Simulation Guides & Theory — Class 11 & 12 | Prasanth Physics',
  description: 'Complete directory of 22 interactive physics simulation guides with formulas, viva questions, and direct virtual lab links for CBSE Class 11, Class 12, NEET, and JEE.',
  keywords: '22 physics simulations, interactive physics lab directory, CBSE class 11 physics experiments, CBSE class 12 physics experiments, Prasanth Physics',
  canonical: `${DOMAIN}/labs`,
  ogImage: `${DOMAIN}/assets/og-simulations.jpg`,
  jsonLd: {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'All 22 Interactive Physics Simulation Guides',
    url: `${DOMAIN}/labs`,
    numberOfItems: SIMS.length
  }
})}
<body class="min-h-screen flex flex-col">
${siteHeader('labs')}
<main class="flex-1 max-w-6xl w-full mx-auto px-4 py-8 space-y-6">
  <section class="glass-card rounded-2xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
    <div>
      <h1 class="text-2xl md:text-3xl font-extrabold text-white">22 Physics Simulation Study Guides</h1>
      <p class="text-sm text-slate-300 mt-1">Explore concepts, key KaTeX formulas, and viva questions—or jump directly into any live interactive lab.</p>
    </div>
    <a href="/" class="shrink-0 px-4 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs text-center transition">Open Full Lab Workspace &rarr;</a>
  </section>

  <div class="flex flex-wrap items-center gap-2">
    <button data-lvl="all" class="lvl-btn px-3 py-1.5 rounded-lg text-xs font-semibold bg-cyan-600 text-white">All (${SIMS.length})</button>
    <button data-lvl="Class XI" class="lvl-btn px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-800 text-slate-300 hover:text-white">Class XI</button>
    <button data-lvl="Class XII" class="lvl-btn px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-800 text-slate-300 hover:text-white">Class XII</button>
    <input id="labsFilterInput" type="text" placeholder="Search topic, chapter, or concept..." class="ml-auto bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-cyan-400 w-full sm:w-64" />
  </div>

  <div id="labsGrid" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
    ${SIMS.map(s => `<article data-level="${esc(s.level)}" class="lab-card glass-card rounded-2xl p-5 flex flex-col justify-between gap-4 hover:border-cyan-500/40 transition">
      <div class="space-y-2">
        <div class="flex items-center justify-between text-[11px] font-mono">
          <span class="text-cyan-400 font-semibold">${esc(s.level)}</span>
          <span class="text-slate-400 truncate max-w-[160px]">${esc(s.chapter)}</span>
        </div>
        <h2 class="text-base font-bold text-white"><a href="/labs/${s.id}" class="hover:text-cyan-300 transition">${esc(s.shortName)}</a></h2>
        <p class="text-xs text-slate-300 leading-relaxed">${esc(s.summary)}</p>
      </div>
      <div class="flex items-center gap-2 pt-2 border-t border-slate-800/80 text-xs">
        <a href="/?sim=${s.id}" class="flex-1 py-2 rounded-lg bg-cyan-600/90 hover:bg-cyan-500 text-white font-semibold text-center transition">Launch Lab</a>
        <a href="/labs/${s.id}" class="flex-1 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium text-center border border-slate-700 transition">Read Guide</a>
      </div>
    </article>`).join('\n')}
  </div>

  ${adUnit1000()}
</main>
${siteFooter()}
<script>
  const btns = document.querySelectorAll('.lvl-btn');
  const cards = document.querySelectorAll('.lab-card');
  const search = document.getElementById('labsFilterInput');
  let curLvl = 'all';
  function applyFilters() {
    const q = (search.value || '').toLowerCase();
    cards.forEach(c => {
      const okLvl = curLvl === 'all' || c.dataset.level.includes(curLvl);
      const okTxt = !q || c.textContent.toLowerCase().includes(q);
      c.style.display = (okLvl && okTxt) ? '' : 'none';
    });
  }
  btns.forEach(b => b.addEventListener('click', () => {
    curLvl = b.dataset.lvl;
    btns.forEach(x => x.className = x === b
      ? 'lvl-btn px-3 py-1.5 rounded-lg text-xs font-semibold bg-cyan-600 text-white'
      : 'lvl-btn px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-800 text-slate-300 hover:text-white');
    applyFilters();
  }));
  search.addEventListener('input', applyFilters);
</script>
</body>
</html>`;

fs.writeFileSync(path.join(labsDir, 'index.html'), labsIndexHtml, 'utf8');

// 3. Build formulas.html (Class XI & XII Complete Formula Sheets + Top 10 Derivations Hub)
const chaptersHtml = catalogue.classes.map(cls => {
  const is12 = cls.id === 'class-12';
  return `<section class="space-y-4">
    <div class="flex items-center justify-between border-b border-slate-800 pb-2">
      <h2 class="text-xl md:text-2xl font-extrabold text-white">${esc(cls.name)} &mdash; All ${cls.chapters.length} Chapters</h2>
      <span class="text-xs font-mono px-2.5 py-1 rounded-full ${is12 ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30' : 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'}">${esc(cls.curriculum)}</span>
    </div>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      ${cls.chapters.map(ch => {
        const linkedSim = CHAPTER_TO_SIM[ch.id];
        const simHref = linkedSim === 'hydraulics' ? '/hydraulics/' : (linkedSim ? `/?sim=${linkedSim}` : null);
        return `<article id="ch-${esc(ch.id)}" data-cls="${esc(cls.id)}" class="formula-chapter glass-card rounded-2xl p-5 space-y-3 hover:border-emerald-500/40 transition">
          <div class="flex items-start justify-between gap-2">
            <div>
              <div class="text-[11px] font-mono ${is12 ? 'text-indigo-400' : 'text-cyan-400'}">${esc(cls.shortName)} &bull; Chapter ${String(ch.number).padStart(2, '0')}</div>
              <h3 class="text-base font-bold text-white">${esc(ch.title)}</h3>
            </div>
            <span class="shrink-0 text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">${esc(ch.weightage)}</span>
          </div>
          <div class="space-y-1.5 text-xs text-slate-200">
            ${(ch.formulas || []).map(f => `<div class="p-2.5 rounded-lg bg-slate-950/80 border border-slate-800/90 overflow-x-auto">$$${f}$$</div>`).join('\n')}
          </div>
          ${(ch.tips && ch.tips.length) ? `<div class="p-2.5 rounded-lg bg-amber-950/25 border border-amber-700/35 text-xs text-amber-200 space-y-1">
            ${ch.tips.map(t => `<div>${esc(t)}</div>`).join('\n')}
          </div>` : ''}
          <div class="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-800/70 text-[11px]">
            <span class="text-slate-400">${(ch.topics || []).length} animated presentation modules</span>
            <div class="flex items-center gap-2">
              ${simHref ? `<a href="${simHref}" class="px-2.5 py-1 rounded bg-cyan-600/85 hover:bg-cyan-500 text-white font-semibold transition">Run Simulation &rarr;</a>` : ''}
              <a href="/presentations" class="px-2.5 py-1 rounded bg-indigo-600/80 hover:bg-indigo-500 text-white font-semibold transition">Open Slides</a>
            </div>
          </div>
        </article>`;
      }).join('\n')}
    </div>
  </section>`;
}).join('\n');

const derivationsHtml = `<section id="top-derivations" class="space-y-4">
  <div class="glass-card rounded-2xl p-6 border-amber-500/25">
    <div class="text-xs font-mono text-amber-400 uppercase tracking-wider">High-Weightage CBSE Board Exam Capsule</div>
    <h2 class="text-xl md:text-2xl font-extrabold text-white mt-1">Top 10 Most Important CBSE Class 12 Physics Derivations</h2>
    <p class="text-sm text-slate-300 mt-1">Compiled by <strong class="text-white">Prasanth Ganesan</strong> &mdash; derivations directly account for 15&ndash;20 marks in CBSE Class 12 Board examinations. Master these 10 core proofs with scoring tips.</p>
  </div>
  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
    ${TOP_10_DERIVATIONS.map(d => `<article class="formula-chapter glass-card rounded-2xl p-5 space-y-3" data-cls="derivations">
      <div class="flex items-start justify-between gap-2">
        <div>
          <span class="text-[11px] font-mono text-amber-400 font-semibold">Derivation #${d.num} &bull; ${esc(d.chapter)}</span>
          <h3 class="text-base font-bold text-white mt-0.5">${esc(d.title)}</h3>
        </div>
        <span class="shrink-0 text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/15 text-amber-300 border border-amber-500/30">${esc(d.marks)}</span>
      </div>
      <div class="p-2.5 rounded-lg bg-slate-950/85 border border-slate-800 text-xs overflow-x-auto">$$${d.formula}$$</div>
      <ul class="text-xs text-slate-300 space-y-1 list-disc list-inside">
        ${d.points.map(p => `<li>${esc(p)}</li>`).join('\n')}
      </ul>
      ${d.sim ? `<div class="pt-1"><a href="/?sim=${d.sim}" class="inline-block text-xs font-semibold text-cyan-300 hover:text-cyan-200">Visualize in Interactive Simulation &rarr;</a></div>` : ''}
    </article>`).join('\n')}
  </div>
  <div class="glass-card rounded-2xl p-5 border-emerald-500/30 space-y-2">
    <h3 class="text-sm font-bold text-emerald-300 uppercase tracking-wider">4 Golden Rules for Board Exam Derivations</h3>
    <ol class="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs text-slate-300 list-decimal list-inside">
      <li><strong>Intro sentence first:</strong> Define every symbol cleanly before writing step 1.</li>
      <li><strong>Pencil-labeled diagrams:</strong> Accurate labeled ray/vector diagrams carry dedicated marks.</li>
      <li><strong>Box your final formula:</strong> Include its standard SI unit next to the boxed equation.</li>
      <li><strong>State special cases:</strong> Include boundary conditions like r &gg; a or &theta; = 0&deg;, 90&deg;.</li>
    </ol>
  </div>
</section>`;

const formulasPageHtml = `${sharedHeadShell({
  title: 'CBSE Class 11 & 12 Physics Formula Sheets & Top 10 Derivations | Prasanth Physics',
  description: 'Complete CBSE Class 11 and Class 12 Physics formula sheets across all 30 chapters with marks weightage, Top 10 Board Exam Derivations, and scoring tips by Prasanth Ganesan.',
  keywords: 'Class 12 physics formulas all chapters, Class 11 physics formula sheet, top 10 derivations CBSE class 12 physics, physics board exam tips, NEET JEE physics formulas, Prasanth Physics',
  canonical: `${DOMAIN}/formulas`,
  ogImage: `${DOMAIN}/assets/og-presentations.jpg`,
  jsonLd: {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Article',
        headline: 'CBSE Class 11 & 12 Physics Formula Sheets & Top 10 Derivations',
        author: { '@type': 'Person', name: 'Prasanth Ganesan' },
        publisher: { '@type': 'EducationalOrganization', name: 'Prasanth Physics', url: DOMAIN },
        dateModified: TODAY,
        url: `${DOMAIN}/formulas`
      },
      {
        '@type': 'FAQPage',
        mainEntity: [
          { '@type': 'Question', name: 'How many marks come from derivations in CBSE Class 12 Physics?', acceptedAnswer: { '@type': 'Answer', text: 'Direct derivations typically account for 15 to 20 marks in CBSE Class 12 Physics board papers, especially in Optics, Electrostatics, Magnetism, and Alternating Current.' } },
          { '@type': 'Question', name: 'Which chapters carry maximum weightage in CBSE Class 12 Physics?', acceptedAnswer: { '@type': 'Answer', text: 'Ray Optics & Optical Instruments (8-9 marks), Current Electricity (7-8 marks), Semiconductor Electronics (7 marks), and Electrostatics & Capacitance (6-8 marks each).' } }
        ]
      }
    ]
  }
})}
<body class="min-h-screen flex flex-col">
${siteHeader('formulas')}
<main class="flex-1 max-w-6xl w-full mx-auto px-4 py-8 space-y-8">
  <section class="glass-card rounded-2xl p-6 md:p-8 border-emerald-500/25 space-y-4">
    <div class="flex flex-wrap items-center gap-2 text-xs font-mono">
      <span class="px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">CBSE Class XI &amp; XII &bull; NEET &bull; JEE</span>
      <span class="px-2.5 py-0.5 rounded-full bg-indigo-500/15 text-indigo-300 border border-indigo-500/30">30 Chapters &amp; Top 10 Proofs</span>
    </div>
    <h1 class="text-2xl md:text-4xl font-extrabold text-white tracking-tight">Class XI &amp; XII Physics Formula Sheets &amp; Top Board Derivations</h1>
    <p class="text-sm md:text-base text-slate-300 leading-relaxed max-w-3xl">Curated by <strong class="text-white">Prasanth Ganesan</strong>. Rapidly revise every chapter formula, CBSE marks weightage, and must-do derivation—or jump straight into interactive simulations and animated slide decks.</p>
    <div class="flex flex-wrap items-center gap-2 pt-1">
      <button data-flt="all" class="f-btn px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-600 text-white">All Sections</button>
      <button data-flt="class-12" class="f-btn px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-800 text-slate-300 hover:text-white">Class XII (15 Chapters)</button>
      <button data-flt="class-11" class="f-btn px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-800 text-slate-300 hover:text-white">Class XI (15 Chapters)</button>
      <button data-flt="derivations" class="f-btn px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-800 text-slate-300 hover:text-white">Top 10 Derivations</button>
      <input id="searchFormulas" type="text" placeholder="Search chapter, formula, or topic..." class="ml-auto bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-emerald-400 w-full sm:w-64" />
    </div>
  </section>

  ${derivationsHtml}
  ${adUnit1000()}
  ${chaptersHtml}
  ${adUnit1000()}

  <section class="glass-card rounded-2xl p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-emerald-500/30">
    <div>
      <h2 class="text-base font-bold text-white">Join Prasanth Physics Daily Practice &amp; Updates</h2>
      <p class="text-xs text-slate-300 mt-1">Get new physics simulations, board derivations, and rapid revision updates on our official WhatsApp Channel.</p>
    </div>
    <a href="${WHATSAPP_URL}" target="_blank" rel="noopener noreferrer" class="shrink-0 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs text-center transition">Join WhatsApp Channel &rarr;</a>
  </section>
</main>
${siteFooter()}
<script>
  const fBtns = document.querySelectorAll('.f-btn');
  const fCards = document.querySelectorAll('.formula-chapter');
  const fSearch = document.getElementById('searchFormulas');
  let curFlt = 'all';
  function filterFormulas() {
    const q = (fSearch.value || '').toLowerCase();
    fCards.forEach(c => {
      const okCat = curFlt === 'all' || c.dataset.cls === curFlt;
      const okTxt = !q || c.textContent.toLowerCase().includes(q);
      c.style.display = (okCat && okTxt) ? '' : 'none';
    });
  }
  fBtns.forEach(b => b.addEventListener('click', () => {
    curFlt = b.dataset.flt;
    fBtns.forEach(x => x.className = x === b
      ? 'f-btn px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-600 text-white'
      : 'f-btn px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-800 text-slate-300 hover:text-white');
    filterFormulas();
  }));
  fSearch.addEventListener('input', filterFormulas);
</script>
</body>
</html>`;

fs.writeFileSync(path.join(ROOT, 'formulas.html'), formulasPageHtml, 'utf8');

// 4. Build sitemap.xml covering ALL routes
const urls = [
  { loc: `${DOMAIN}/`, priority: '1.0', freq: 'weekly' },
  { loc: `${DOMAIN}/presentations`, priority: '0.95', freq: 'weekly' },
  { loc: `${DOMAIN}/formulas`, priority: '0.95', freq: 'weekly' },
  { loc: `${DOMAIN}/labs`, priority: '0.90', freq: 'weekly' },
  { loc: `${DOMAIN}/standalone`, priority: '0.75', freq: 'monthly' },
  { loc: `${DOMAIN}/hydraulics/`, priority: '0.75', freq: 'monthly' },
  ...SIMS.map(s => ({ loc: `${DOMAIN}/labs/${s.id}`, priority: '0.85', freq: 'monthly' }))
];

const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(u => `  <url>
    <loc>${u.loc}</loc>
    <lastmod>${TODAY}</lastmod>
    <changefreq>${u.freq}</changefreq>
    <priority>${u.priority}</priority>
  </url>`).join('\n')}
</urlset>
`;

fs.writeFileSync(path.join(ROOT, 'sitemap.xml'), sitemapXml, 'utf8');
console.log(`Generated ${SIMS.length} /labs/<sim>.html pages, labs/index.html, formulas.html, and sitemap.xml (${urls.length} URLs).`);
