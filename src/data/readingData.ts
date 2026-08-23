import { ReadingMaterial } from '../types';

export const READING_MATERIALS: ReadingMaterial[] = [
  {
    id: 'read-phy-1',
    subjectId: 'physics',
    topicId: 'phy-1',
    topicTitle: 'Motion & Kinematics (Equations & Projectiles)',
    introduction: 'Motion is one of the most fundamental concepts in Physics. In JAMB, WAEC, and OAU Post-UTME, mastery of linear and 2D projectile kinematics guarantees at least 4 to 6 marks.',
    contentMarkdown: `
### 1. Fundamentals of Motion
Motion occurs when a body changes its position relative to a reference frame over time.

* **Scalar Quantities**: Distance ($s$), Speed ($v$).
* **Vector Quantities**: Displacement ($\\\\vec{s}$), Velocity ($\\\\vec{v}$), Acceleration ($\\\\vec{a}$).

---

### 2. The Three Equations of Uniform Linear Motion
For a body moving with constant acceleration $a$, initial velocity $u$, final velocity $v$, displacement $s$, and time $t$:

$$v = u + at$$
$$s = ut + \\\\frac{1}{2}at^2$$
$$v^2 = u^2 + 2as$$

> **Key Rule under Gravity**: Replace $a$ with $+g$ ($+9.8\\\\text{ m/s}^2$ or $+10\\\\text{ m/s}^2$) for downward falling bodies, and $-g$ for bodies thrown vertically upward!

---

### 3. Projectile Motion
A projectile is any object launched into space and allowed to move under the influence of gravity alone.

* **Time of Flight ($T$)**: Total time in air.
  $$T = \\\\frac{2u \\\\sin\\\\theta}{g}$$
* **Maximum Height ($H$)**: Peak vertical altitude reached.
  $$H = \\\\frac{u^2 \\\\sin^2\\\\theta}{2g}$$
* **Horizontal Range ($R$)**: Total horizontal distance covered.
  $$R = \\\\frac{u^2 \\\\sin(2\\\\theta)}{g}$$
* **Maximum Range**: Occurs when launch angle $\\\\theta = 45^\\\\circ$.
`,
    defaultVideoUrl: 'https://www.youtube.com/embed/v9XNylfPj44', // Khan academy / Physics kinematics embed
    keyFormulas: [
      { name: 'Time of Flight', formula: 'T = (2u sin θ) / g', note: 'Total time object stays in air' },
      { name: 'Maximum Height', formula: 'H = (u² sin² θ) / 2g', note: 'Vertical displacement at top peak' },
      { name: 'Horizontal Range', formula: 'R = (u² sin 2θ) / g', note: 'Max horizontal distance (Peak at 45°)' },
    ],
    workedExamples: [
      {
        title: 'Example 1: Projectile Maximum Height',
        question: 'A stone is thrown at an angle of 30° to the horizontal with an initial speed of 40 m/s. Calculate the maximum height reached. [Take g = 10 m/s²]',
        solution: `Formula: H = (u² sin² θ) / (2g)
1. Calculate sin(30°) = 0.5
2. sin²(30°) = (0.5)² = 0.25
3. u² = 40² = 1600
4. H = (1600 × 0.25) / (2 × 10) = 400 / 20 = 20 meters.`,
      },
      {
        title: 'Example 2: Vertical Freefall Under Gravity',
        question: 'A ball dropped from the top of a tall building hits the ground after 4 seconds. Calculate the height of the building.',
        solution: `Since the ball is dropped, initial velocity u = 0 m/s.
Using s = ut + 0.5gt²:
s = 0(4) + 0.5(10)(4)²
s = 0.5 × 10 × 16 = 80 meters.`,
      },
    ],
    quickQuiz: [
      {
        id: 'q-read-p1',
        question: 'At what launch angle is the horizontal range of a projectile maximum?',
        options: ['30°', '45°', '60°', '90°'],
        correctIndex: 1,
        explanation: 'Range R = (u² sin 2θ) / g. sin(2θ) reaches its maximum value of 1 when 2θ = 90°, meaning θ = 45°.',
      },
      {
        id: 'q-read-p2',
        question: 'A stone thrown vertically upwards takes 3 seconds to reach its maximum height. What was its initial velocity? [g = 10 m/s²]',
        options: ['15 m/s', '30 m/s', '45 m/s', '60 m/s'],
        correctIndex: 1,
        explanation: 'At max height, v = 0. Using v = u - gt => 0 = u - 10(3) => u = 30 m/s.',
      },
    ],
  },
  {
    id: 'read-mth-1',
    subjectId: 'maths',
    topicId: 'math-1',
    topicTitle: 'Algebra & Indices Laws',
    introduction: 'Indices and algebraic laws form the foundation for solving complex equations in JAMB and WAEC. Master these simple rules to guarantee high speed in CBT exams.',
    contentMarkdown: `
### Laws of Indices
When working with powers and exponents:

1. **Multiplication Law**: $a^m \\\\times a^n = a^{m+n}$
2. **Division Law**: $a^m \\\\div a^n = a^{m-n}$
3. **Power Law**: $(a^m)^n = a^{m \\\\times n}$
4. **Zero Index Law**: $a^0 = 1$ (for $a \\\\neq 0$)
5. **Negative Index**: $a^{-n} = \\\\frac{1}{a^n}$
6. **Fractional Index**: $a^{\\\\frac{m}{n}} = (\\\\sqrt[n]{a})^m$

---

### Quadratic Equations
Standard form: $ax^2 + bx + c = 0$.

* **Quadratic Formula**:
  $$x = \\\\frac{-b \\\\pm \\\\sqrt{b^2 - 4ac}}{2a}$$
* **Sum of Roots**: $\\\\alpha + \\\\beta = -\\\\frac{b}{a}$
* **Product of Roots**: $\\\\alpha \\\\beta = \\\\frac{c}{a}$
`,
    defaultVideoUrl: 'https://www.youtube.com/embed/w8vE_x3qT14',
    keyFormulas: [
      { name: 'Quadratic Formula', formula: 'x = (-b ± √(b² - 4ac)) / 2a', note: 'Solves any quadratic equation' },
      { name: 'Sum of Roots', formula: 'α + β = -b/a', note: 'Sum of solutions' },
      { name: 'Product of Roots', formula: 'αβ = c/a', note: 'Product of solutions' },
    ],
    workedExamples: [
      {
        title: 'Example 1: Solving Exponential Equations',
        question: 'Solve for x: 3^(2x - 1) = 81',
        solution: `1. Express 81 as a power of 3: 81 = 3⁴
2. Therefore: 3^(2x - 1) = 3⁴
3. Equate exponents: 2x - 1 = 4
4. 2x = 5 => x = 2.5`,
      },
    ],
    quickQuiz: [
      {
        id: 'q-read-m1',
        question: 'Evaluate 27^(2/3).',
        options: ['3', '6', '9', '27'],
        correctIndex: 2,
        explanation: '27^(2/3) = (∛27)² = (3)² = 9.',
      },
    ],
  },
  {
    id: 'read-eng-1',
    subjectId: 'english',
    topicId: 'eng-1',
    topicTitle: 'Use of English: Rules of Concord',
    introduction: 'Grammatical concord is one of the highest tested areas in JAMB Use of English. Learn the fundamental proximity, collective noun, and mandate agreement rules.',
    contentMarkdown: `
### Key Concord Rules
1. **Rule of Proximity (Neither/Nor, Either/Or)**:
   The verb must agree in number with the subject closest to it.
   * *Example*: Neither the manager nor the **workers are** happy.
   * *Example*: Neither the workers nor the **manager is** happy.

2. **Compound Subjects with "As well as", "Together with"**:
   The verb agrees strictly with the FIRST subject!
   * *Example*: The Principal, together with all his teachers, **was** present.

3. **Plural Nouns of Measurement**:
   Quantities of distance, money, and time take SINGULAR verbs.
   * *Example*: Ten thousand Naira **is** enough.
`,
    defaultVideoUrl: 'https://www.youtube.com/embed/u_JkLz-q_eM',
    workedExamples: [
      {
        title: 'Example 1: Concord Identification',
        question: 'Choose correct option: "Every boy and girl _____ expected to report early."',
        solution: `Rule: When 'Every' or 'Each' precedes a compound subject, it requires a SINGULAR verb. Correct answer: 'is'.`,
      },
    ],
    quickQuiz: [
      {
        id: 'q-read-e1',
        question: 'Fifty miles _____ a long distance to walk in one afternoon.',
        options: ['is', 'are', 'were', 'have been'],
        correctIndex: 0,
        explanation: 'Measurements of distance take a singular verb. "Fifty miles is..."',
      },
    ],
  },
];
