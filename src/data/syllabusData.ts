import { SyllabusTopic } from '../types';

export const SYLLABUS_DATA: SyllabusTopic[] = [
  // PHYSICS
  {
    id: 'phy-1',
    subjectId: 'physics',
    examCategory: 'JAMB',
    topicName: 'Motion & Kinematics',
    description: 'Study of distance, displacement, velocity, acceleration, equations of uniform motion, projectile motion, and circular motion.',
    frequency: 'High',
    importanceNote: 'Appears in over 5-8 questions annually in JAMB and OAU Post-UTME.',
    subtopics: [
      {
        id: 'phy-1-1',
        name: 'Equations of Motion',
        description: 'Derivation and application of v = u + at, s = ut + 0.5at², v² = u² + 2as.',
        keyPoints: ['u = initial velocity', 'a = acceleration (g = 9.8m/s² or 10m/s² under gravity)', 'Time of flight T = 2u sinθ / g'],
      },
      {
        id: 'phy-1-2',
        name: 'Projectile Motion',
        description: 'Two-dimensional motion under gravity.',
        keyPoints: ['Maximum height H = u² sin²θ / 2g', 'Horizontal Range R = u² sin(2θ) / g', 'Max range occurs at θ = 45°'],
      },
      {
        id: 'phy-1-3',
        name: 'Uniform Circular Motion',
        description: 'Motion in a circle at constant speed.',
        keyPoints: ['Centripetal acceleration a = v²/r = ω²r', 'Centripetal force F = mv²/r'],
      },
    ],
  },
  {
    id: 'phy-2',
    subjectId: 'physics',
    examCategory: 'JAMB',
    topicName: 'Work, Energy, Power & Machines',
    description: 'Work done by force, kinetic energy, potential energy, conservation of energy, mechanical advantage, velocity ratio, efficiency.',
    frequency: 'High',
    importanceNote: 'Core numerical questions in WAEC & OAU Post-UTME.',
    subtopics: [
      {
        id: 'phy-2-1',
        name: 'Energy Conservation',
        description: 'Transformation between Potential Energy (mgh) and Kinetic Energy (0.5mv²).',
        keyPoints: ['Total Mechanical Energy is constant in closed conservative systems.', 'Work = Force × distance in direction of force (W = Fd cosθ).'],
      },
      {
        id: 'phy-2-2',
        name: 'Simple Machines',
        description: 'Pulleys, inclined planes, screws, hydraulic presses, gears.',
        keyPoints: ['Mechanical Advantage (M.A) = Load / Effort', 'Velocity Ratio (V.R) = Distance moved by effort / Distance moved by load', 'Efficiency η = (M.A / V.R) × 100%'],
      },
    ],
  },
  {
    id: 'phy-3',
    subjectId: 'physics',
    examCategory: 'JAMB',
    topicName: 'Electric Fields & Current Electricity',
    description: 'Coulomb\'s Law, Ohm\'s Law, resistors in series & parallel, internal resistance, Kirchhoff\'s Laws, electrical energy & power.',
    frequency: 'High',
    importanceNote: 'High frequency in all three examinations.',
    subtopics: [
      {
        id: 'phy-3-1',
        name: 'Ohm\'s Law & Resistance Circuits',
        description: 'Relationship between voltage, current, and resistance in DC circuits.',
        keyPoints: ['V = IR', 'Series: R_total = R1 + R2 + R3', 'Parallel: 1/R_total = 1/R1 + 1/R2 + 1/R3', 'Internal Resistance: E = I(R + r)'],
      },
      {
        id: 'phy-3-2',
        name: 'Electrical Energy & Power',
        description: 'Power dissipation in resistors and heating effect of electric current.',
        keyPoints: ['Power P = IV = I²R = V²/R', 'Energy E = P × t (Joules or kWh)'],
      },
    ],
  },

  // CHEMISTRY
  {
    id: 'chem-1',
    subjectId: 'chemistry',
    examCategory: 'JAMB',
    topicName: 'Atomic Structure & Chemical Bonding',
    description: 'Subatomic particles, isotopes, electronic configuration, quantum numbers, ionic, covalent, metallic, and hydrogen bonding.',
    frequency: 'High',
    importanceNote: 'Foundational topic for organic and inorganic chemistry questions.',
    subtopics: [
      {
        id: 'chem-1-1',
        name: 'Electronic Configuration & Periodic Table',
        description: 's, p, d, f subshell filling, Hund\'s rule, Pauli exclusion principle, periodic trends.',
        keyPoints: ['Atomic number (Z) = protons', 'Mass number (A) = protons + neutrons', 'Electronegativity increases across a period, decreases down a group'],
      },
      {
        id: 'chem-1-2',
        name: 'Chemical Bonding & Intermolecular Forces',
        description: 'Electrovalent vs covalent bonds, van der Waals forces, hydrogen bonding.',
        keyPoints: ['Ionic bonds involve complete transfer of electrons.', 'Covalent bonds share electron pairs.', 'Hydrogen bonding accounts for anomaly in water boiling point.'],
      },
    ],
  },
  {
    id: 'chem-2',
    subjectId: 'chemistry',
    examCategory: 'JAMB',
    topicName: 'Stoichiometry & Chemical Calculations',
    description: 'Mole concept, Avogadro\'s number, empirical & molecular formulas, volumetric analysis (titration), molar concentration.',
    frequency: 'High',
    importanceNote: 'Requires quick calculation skills for CBT.',
    subtopics: [
      {
        id: 'chem-2-1',
        name: 'The Mole Concept',
        description: 'Calculations involving mass, molar mass, moles, and Avogadro constant (6.02 × 10²³).',
        keyPoints: ['Moles = Mass / Molar Mass', 'Volume of 1 mole of gas at s.t.p = 22.4 dm³', 'Concentration C = Moles / Volume (dm³)'],
      },
      {
        id: 'chem-2-2',
        name: 'Volumetric Analysis (Titration)',
        description: 'Acid-base neutralization calculations: C_a V_a / C_b V_b = n_a / n_b.',
        keyPoints: ['Standard solution is a solution of known concentration.', 'Indicators: Methyl orange for strong acid + weak base, Phenolphthalein for weak acid + strong base.'],
      },
    ],
  },

  // MATHEMATICS
  {
    id: 'math-1',
    subjectId: 'maths',
    examCategory: 'JAMB',
    topicName: 'Algebra & Quadratic Equations',
    description: 'Simultaneous equations, quadratic equations, factorization, completing square, quadratic formula, indices, logarithms, surds.',
    frequency: 'High',
    importanceNote: 'Over 10 questions in JAMB math depend on algebraic manipulation.',
    subtopics: [
      {
        id: 'math-1-1',
        name: 'Indices & Logarithms',
        description: 'Laws of indices and logarithmic identities.',
        keyPoints: ['a^m × a^n = a^(m+n)', 'log_a(x × y) = log_a(x) + log_a(y)', 'log_a(b) = log_c(b) / log_c(a)'],
      },
      {
        id: 'math-1-2',
        name: 'Quadratic Equations & Discriminant',
        description: 'ax² + bx + c = 0, roots sum α + β = -b/a, product αβ = c/a.',
        keyPoints: ['Discriminant Δ = b² - 4ac', 'If Δ > 0: real & distinct roots', 'If Δ = 0: real & equal roots', 'If Δ < 0: imaginary roots'],
      },
    ],
  },
  {
    id: 'math-2',
    subjectId: 'maths',
    examCategory: 'JAMB',
    topicName: 'Calculus (Differentiation & Integration)',
    description: 'Limits, first principles, power rule, product rule, quotient rule, chain rule, integration techniques, definite integrals, area under curves.',
    frequency: 'High',
    importanceNote: 'Major differentiator in OAU Post-UTME and JAMB.',
    subtopics: [
      {
        id: 'math-2-1',
        name: 'Differentiation Techniques',
        description: 'dy/dx of polynomial, trigonometric, exponential functions.',
        keyPoints: ['d/dx (x^n) = n x^(n-1)', 'd/dx (sin x) = cos x', 'd/dx (cos x) = -sin x', 'Stationary points occur when dy/dx = 0'],
      },
      {
        id: 'math-2-2',
        name: 'Integration & Area Under Curves',
        description: 'Anti-derivatives and definite integrals.',
        keyPoints: ['∫ x^n dx = (x^(n+1) / (n+1)) + C', 'Definite integral ∫_a^b f(x) dx gives area under curve between x=a and x=b.'],
      },
    ],
  },

  // USE OF ENGLISH
  {
    id: 'eng-1',
    subjectId: 'english',
    examCategory: 'JAMB',
    topicName: 'Lexis, Structure & Grammar Rules',
    description: 'Subject-verb agreement (concord), tense harmony, prepositions, idioms, phrasal verbs, figures of speech.',
    frequency: 'High',
    importanceNote: 'Accounts for 40% of JAMB Use of English paper.',
    subtopics: [
      {
        id: 'eng-1-1',
        name: 'Rules of Concord',
        description: 'Grammar rules governing agreement between subject and verb.',
        keyPoints: ['Singular subject takes singular verb.', 'Subj connected by "as well as", "together with", "along with" agrees with the FIRST subject.', 'Plural nouns of measurement take singular verbs (e.g., "Ten miles is a long distance").'],
      },
      {
        id: 'eng-1-2',
        name: 'Synonyms & Antonyms in Context',
        description: 'Identifying nearest in meaning or opposite in meaning.',
        keyPoints: ['Always read the full sentence context rather than literal dictionary definition.', 'Watch out for words with positive vs negative connotations.'],
      },
    ],
  },

  // BIOLOGY
  {
    id: 'bio-1',
    subjectId: 'biology',
    examCategory: 'JAMB',
    topicName: 'Cell Biology & Genetics',
    description: 'Cell structure and organelles, mitosis & meiosis, Mendel\'s laws of inheritance, DNA structure, genetic crosses, sex-linked traits.',
    frequency: 'High',
    importanceNote: 'High priority topic in JAMB and WAEC Biology.',
    subtopics: [
      {
        id: 'bio-1-1',
        name: 'Cell Organelles & Functions',
        description: 'Mitochondria, nucleus, ribosomes, endoplasmic reticulum, chloroplasts.',
        keyPoints: ['Mitochondria = Powerhouse of cell (ATP synthesis)', 'Ribosomes = Protein synthesis', 'Plant cells have cell wall and large central vacuole; animal cells do not.'],
      },
      {
        id: 'bio-1-2',
        name: 'Mendelian Inheritance & Crosses',
        description: 'Monohybrid and dihybrid crosses, dominant & recessive alleles, ABO blood grouping.',
        keyPoints: ['Monohybrid F2 phenotypic ratio = 3:1', 'Dihybrid F2 ratio = 9:3:3:1', 'Blood group AB exhibits codominance.'],
      },
    ],
  },

  // ECONOMICS
  {
    id: 'eco-1',
    subjectId: 'economics',
    examCategory: 'JAMB',
    topicName: 'Theory of Demand, Supply & Price Determination',
    description: 'Laws of demand and supply, shifts vs movements along curves, equilibrium price, price elasticity of demand (PED) and supply.',
    frequency: 'High',
    importanceNote: 'Primary topic in Commercial stream exams.',
    subtopics: [
      {
        id: 'eco-1-1',
        name: 'Price Elasticity of Demand (PED)',
        description: 'Measurement of responsiveness of quantity demanded to changes in price.',
        keyPoints: ['PED = % change in Q_d / % change in Price', 'If PED > 1: Elastic', 'If PED = 1: Unitary', 'If PED < 1: Inelastic'],
      },
    ],
  },

  // GOVERNMENT
  {
    id: 'gov-1',
    subjectId: 'government',
    examCategory: 'JAMB',
    topicName: 'Basic Concepts & Forms of Government',
    description: 'Sovereignty, Power, Authority, Democracy, Monarchy, Feudalism, Oligarchy, Presidential vs Parliamentary systems.',
    frequency: 'High',
    importanceNote: 'Core foundation for Arts stream candidates.',
    subtopics: [
      {
        id: 'gov-1-1',
        name: 'Presidential vs Parliamentary Systems',
        description: 'Comparison of executive and legislative relationships.',
        keyPoints: ['Presidential: Strict separation of powers, President is both Head of State & Head of Govt.', 'Parliamentary: Fusion of powers, Prime Minister is Head of Govt, cabinet chosen from parliament.'],
      },
    ],
  },
];
