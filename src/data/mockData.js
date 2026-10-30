import { supabase } from '../lib/supabaseClient'

// ---------------------------------------------------------------------------
// JAMB subject combination rules
// ---------------------------------------------------------------------------
// Every stream has:
//  - compulsory: subjects every candidate in that stream must sit (always
//    includes "english")
//  - electivePool: subjects the candidate can choose from to fill the
//    remaining slots
//  - electiveCount: how many subjects must be picked from electivePool
// compulsory.length + electiveCount is always 4, matching JAMB's 4-subject
// UTME combination.
// ---------------------------------------------------------------------------

export const subjectMeta = {
  english: { name: 'Use of English', short: 'English', color: 'blue' },
  aptitude_test: { name: 'Aptitude Test', short: 'Aptitude', color: 'violet' },
  mathematics: { name: 'Mathematics', short: 'Maths', color: 'indigo' },
  physics: { name: 'Physics', short: 'Physics', color: 'sky' },
  chemistry: { name: 'Chemistry', short: 'Chemistry', color: 'green' },
  biology: { name: 'Biology', short: 'Biology', color: 'emerald' },
  literature: { name: 'Literature-in-English', short: 'Literature', color: 'rose' },
  government: { name: 'Government', short: 'Government', color: 'amber' },
  crs: { name: 'Christian Religious Studies', short: 'CRS', color: 'purple' },
  history: { name: 'History', short: 'History', color: 'fuchsia' },
  economics: { name: 'Economics', short: 'Economics', color: 'teal' },
  commerce: { name: 'Commerce', short: 'Commerce', color: 'orange' },
  accounts: { name: 'Financial Accounting', short: 'Accounts', color: 'cyan' },
  chm101: { name: 'CHM 101 — General Chemistry I', short: 'CHM 101', color: 'slate' },
  chm102: { name: 'CHM 102 — General Chemistry II', short: 'CHM 102', color: 'slate' },
}

export const streams = [
  {
    id: 'science',
    name: 'Science',
    tagline: 'Engineering, medicine & pure sciences',
    icon: 'FlaskConical',
    compulsory: ['english', 'physics', 'chemistry'],
    electivePool: ['mathematics', 'biology'],
    electiveCount: 1,
  },
  {
    id: 'arts',
    name: 'Arts',
    tagline: 'Humanities, law & mass communication',
    icon: 'Landmark',
    compulsory: ['english'],
    electivePool: ['literature', 'government', 'crs', 'history'],
    electiveCount: 3,
  },
  {
    id: 'commercial',
    name: 'Commercial',
    tagline: 'Business, accounting & economics',
    icon: 'Briefcase',
    compulsory: ['english', 'mathematics'],
    electivePool: ['economics', 'commerce', 'accounts'],
    electiveCount: 2,
  },
]

// ---------------------------------------------------------------------------
// Post UTME subject combination rules
// ---------------------------------------------------------------------------
// OAU's own Post UTME screening test replaces the JAMB "Use of English" paper
// with a single general Aptitude Test (verbal reasoning, quantitative
// reasoning, and general knowledge) that every candidate sits regardless of
// field of study. Everything else about the combination (field-specific
// electives) stays the same as JAMB, so this is just `streams` with
// "english" swapped for "aptitude_test" in each field's compulsory list.
// ---------------------------------------------------------------------------

export const postUtmeStreams = streams.map((stream) => ({
  ...stream,
  compulsory: stream.compulsory.map((id) => (id === 'english' ? 'aptitude_test' : id)),
}))

export const targetScores = ['180+', '200+', '250+', '300+', '350+']
// ---------------------------------------------------------------------------
// Exam types — JAMB / Post UTME / OAU Courses
// ---------------------------------------------------------------------------
// JAMB and Post UTME both use the same "field of study -> 4 subject combo"
// shape, so they both read from a `streams`-shaped array — JAMB from
// `streams`, Post UTME from `postUtmeStreams` (Aptitude Test instead of
// Use of English). OAU Courses is different: it only offers the Science
// field of study, and instead of a subject combo the student picks one
// specific course code to practice (e.g. CHM 101).

export const examTypes = [
  { id: 'jamb', name: 'JAMB', blurb: 'UTME — 4 subjects, English compulsory' },
  { id: 'post_utme', name: 'Post UTME', blurb: "OAU's own screening test — Aptitude Test + electives" },
  { id: 'oau', name: 'OAU Courses', blurb: 'Practice by specific course code' },
]

// Field-of-study options per exam type. OAU Courses only offers Science.
export const oauFieldsOfStudy = [
  { id: 'science', name: 'Science', tagline: 'OAU 100-level science courses', icon: 'FlaskConical' },
]

export const fieldsOfStudyByExamType = {
  jamb: streams,
  post_utme: postUtmeStreams,
  oau: oauFieldsOfStudy,
}

// OAU courses, grouped by field of study. Add more here as they're ready —
// nothing else needs to change for a new course to show up in the picker.
export const oauCourses = [
  { id: 'chm101', code: 'CHM 101', title: 'General Chemistry I', fieldOfStudy: 'science' },
  { id: 'chm102', code: 'CHM 102', title: 'General Chemistry II', fieldOfStudy: 'science' },
]

export function oauCoursesFor(fieldOfStudyId) {
  return oauCourses.filter((c) => c.fieldOfStudy === fieldOfStudyId)
}
// Question counts per sitting. JAMB: 60 for Use of English, 40 for every
// other subject. Post UTME: 10 per subject (including the Aptitude Test,
// which is drawn at random from its larger 50-question bank).
export function subjectQuestionCount(subjectId, examType = 'jamb') {
  if (examType === 'post_utme') return 10
  return subjectId === 'english' ? 60 : 40
}

// All subjects a stream can present (used by Study Mode's subject picker)
export function streamSubjectIds(stream) {
  return [...stream.compulsory, ...stream.electivePool]
}

// ---------------------------------------------------------------------------
// Question-bank generation helpers
// ---------------------------------------------------------------------------

function safeDistractors(correct) {
  const offsets = [2, -2, 3, -3, 5, -5, 4, -4, 6, -6, 7, -7]
  const out = []
  for (const off of offsets) {
    const v = correct + off
    if (v > 0 && v !== correct && !out.includes(v)) out.push(v)
    if (out.length === 3) break
  }
  return out
}

function numericMCQ(id, instruction, prompt, correct, explanation, position, unit = '') {
  const format = (n) => `${n}${unit}`
  const options = safeDistractors(correct).map(format)
  options.splice(position, 0, format(correct))
  return { id, instruction, prompt, options, answer: position, explanation }
}

// Builds one MCQ per [term, description] pair, using nearby pairs (cyclically)
// as distractors so every question is guaranteed 3 unique wrong answers.
function factBank(prefix, instruction, pairs, promptFn, explanationFn) {
  return pairs.map(([term, def], i) => {
    const distractors = [1, 2, 3].map((o) => pairs[(i + o) % pairs.length][1])
    const position = i % 4
    const options = [...distractors]
    options.splice(position, 0, def)
    return {
      id: `${prefix}-${i + 1}`,
      instruction,
      prompt: promptFn(term),
      options,
      answer: position,
      explanation: explanationFn(term, def),
    }
  })
}

// Like factBank, but for direct [question, answer] pairs (no "Which of the
// following best describes..." wrapper) — used for the Aptitude Test's
// general knowledge section.
function qaBank(prefix, instruction, pairs) {
  return pairs.map(([question, answer], i) => {
    const distractors = [1, 2, 3].map((o) => pairs[(i + o) % pairs.length][1])
    const position = i % 4
    const options = [...distractors]
    options.splice(position, 0, answer)
    return {
      id: `${prefix}-${i + 1}`,
      instruction,
      prompt: question,
      options,
      answer: position,
      explanation: `${answer} is correct.`,
    }
  })
}

const describePrompt = (t) => `Which of the following best describes "${t}"?`
const describeExplanation = (t, d) => `"${t}" refers to: ${d}.`

// ---------------------------------------------------------------------------
// Use of English — 60 questions (vocabulary, antonyms, idioms, grammar)
// ---------------------------------------------------------------------------

const synonymPairs = [
  ['diligent', 'hardworking'], ['abundant', 'plentiful'], ['meticulous', 'careful'],
  ['reluctant', 'unwilling'], ['candid', 'honest'], ['ambiguous', 'unclear'],
  ['benevolent', 'kind'], ['concise', 'brief'], ['deteriorate', 'worsen'],
  ['eloquent', 'articulate'], ['frugal', 'thrifty'], ['hostile', 'unfriendly'],
  ['immense', 'huge'], ['jubilant', 'joyful'], ['lethargic', 'sluggish'],
  ['meager', 'scanty'], ['notorious', 'infamous'], ['obstinate', 'stubborn'],
  ['plausible', 'believable'], ['tranquil', 'peaceful'],
]

const antonymPairs = [
  ['scarce', 'abundant'], ['genuine', 'fake'], ['courageous', 'cowardly'],
  ['generous', 'stingy'], ['optimistic', 'pessimistic'], ['permanent', 'temporary'],
  ['voluntary', 'compulsory'], ['ancient', 'modern'], ['victory', 'defeat'],
  ['expand', 'contract'], ['praise', 'criticize'], ['increase', 'decrease'],
  ['include', 'exclude'], ['major', 'minor'], ['arrival', 'departure'],
]

const idiomPairs = [
  ['let the cat out of the bag', 'reveal a secret accidentally'],
  ['break the ice', 'ease tension in a social situation'],
  ['once in a blue moon', 'very rarely'],
  ['cost an arm and a leg', 'be very expensive'],
  ['hit the nail on the head', 'be exactly right'],
  ['under the weather', 'feeling slightly ill'],
  ['burn the midnight oil', 'work late into the night'],
  ['a piece of cake', 'something very easy'],
  ['bite the bullet', 'endure a painful situation bravely'],
  ['beat around the bush', 'avoid speaking directly'],
  ['call it a day', 'stop working for the day'],
  ['add fuel to the fire', 'make a bad situation worse'],
  ['jump on the bandwagon', 'join a popular trend'],
  ['keep an eye on', 'watch carefully'],
  ['spill the beans', 'reveal a secret'],
]

const grammarQuestions = [
  { id: 'eng-gram-1', instruction: 'Grammar', prompt: 'Neither the students nor the teacher ___ aware of the change.', options: ['were', 'was', 'are', 'have been'], answer: 1, explanation: 'With "neither...nor", the verb agrees with the nearer subject — "the teacher" is singular, so "was" is correct.' },
  { id: 'eng-gram-2', instruction: 'Grammar', prompt: 'She is married ___ a civil engineer.', options: ['with', 'to', 'by', 'for'], answer: 1, explanation: 'The correct preposition is "to": "married to".' },
  { id: 'eng-gram-3', instruction: 'Grammar', prompt: 'By this time next year, she ___ from university.', options: ['will graduate', 'will have graduated', 'has graduated', 'graduates'], answer: 1, explanation: 'A completed action before a future point uses the future perfect tense: "will have graduated".' },
  { id: 'eng-gram-4', instruction: 'Grammar', prompt: 'Each of the candidates ___ given a number.', options: ['were', 'was', 'are', 'have been'], answer: 1, explanation: '"Each" is singular, so it takes a singular verb, "was".' },
  { id: 'eng-gram-5', instruction: 'Grammar', prompt: 'He is the ___ of the two brothers.', options: ['taller', 'tall', 'tallest', 'more tall'], answer: 0, explanation: 'When comparing exactly two things, the comparative form ("taller") is used, not the superlative.' },
  { id: 'eng-gram-6', instruction: 'Grammar', prompt: 'I look forward ___ hearing from you.', options: ['for', 'to', 'at', 'with'], answer: 1, explanation: '"Look forward to" is followed by a gerund, so "to" is correct.' },
  { id: 'eng-gram-7', instruction: 'Grammar', prompt: 'If I ___ you, I would apologise.', options: ['am', 'was', 'were', 'be'], answer: 2, explanation: 'In hypothetical conditionals, "were" is used for all subjects: "If I were you".' },
  { id: 'eng-gram-8', instruction: 'Grammar', prompt: 'The committee ___ divided on the issue.', options: ['is', 'are', 'was', 'has'], answer: 1, explanation: 'When a collective noun is treated as individuals with differing opinions, a plural verb, "are", is used.' },
  { id: 'eng-gram-9', instruction: 'Grammar', prompt: 'She has been living here ___ 2015.', options: ['for', 'since', 'from', 'during'], answer: 1, explanation: '"Since" is used with a specific starting point in time, such as a year.' },
  { id: 'eng-gram-10', instruction: 'Grammar', prompt: 'Choose the correctly spelt word.', options: ['Occassion', 'Occasion', 'Ocassion', 'Occation'], answer: 1, explanation: '"Occasion" is spelt with a double "c" and a single "s".' },
]

export const englishQuestions = [
  ...factBank('eng-syn', 'Vocabulary — synonyms', synonymPairs, (t) => `Choose the word nearest in meaning to "${t}".`, (t, d) => `"${t}" is closest in meaning to "${d}".`),
  ...factBank('eng-ant', 'Vocabulary — antonyms', antonymPairs, (t) => `Choose the word most opposite in meaning to "${t}".`, (t, d) => `The opposite of "${t}" is "${d}".`),
  ...factBank('eng-idiom', 'Idioms', idiomPairs, (t) => `What is the meaning of the idiom "${t}"?`, (t, d) => `The idiom "${t}" means: ${d}.`),
  ...grammarQuestions,
]

// ---------------------------------------------------------------------------
// Mathematics — 40 questions, generated from 8 numeric templates
// ---------------------------------------------------------------------------

function buildMathematicsQuestions() {
  const qs = []
  let pos = 0
  const next = () => pos++ % 4

    ;['1011', '10110', '11001', '101101', '111010'].forEach((bin, i) => {
      const val = parseInt(bin, 2)
      qs.push(numericMCQ(`math-1-${i + 1}`, 'Number bases', `Convert ${bin}₂ to base 10.`, val, `${bin}₂ = ${val} in base 10, found by summing the place values of each 1-bit.`, next()))
    })

    ;[[3, 4, 5], [2, 5, 4], [4, 3, 2], [5, 2, 1], [3, 3, 2]].forEach(([a, b, c], i) => {
      const exp = a + b - c
      const val = Math.pow(2, exp)
      qs.push(numericMCQ(`math-2-${i + 1}`, 'Indices', `Simplify: (2^${a} × 2^${b}) ÷ 2^${c}`, val, `2^${a} × 2^${b} ÷ 2^${c} = 2^(${a}+${b}-${c}) = 2^${exp} = ${val}.`, next()))
    })

    ;[[15, 200], [20, 180], [25, 80], [10, 250], [30, 90]].forEach(([p, n], i) => {
      const val = (p / 100) * n
      qs.push(numericMCQ(`math-3-${i + 1}`, 'Percentages', `What is ${p}% of ${n}?`, val, `${p}% of ${n} = (${p}/100) × ${n} = ${val}.`, next()))
    })

    ;[[1000, 5, 2], [2000, 4, 3], [1500, 6, 2], [5000, 2, 3], [2500, 8, 1]].forEach(([p, r, t], i) => {
      const val = (p * r * t) / 100
      qs.push(numericMCQ(`math-4-${i + 1}`, 'Simple interest', `Find the simple interest on ₦${p} at ${r}% per annum for ${t} years.`, val, `Simple interest = (P × R × T) / 100 = (${p} × ${r} × ${t}) / 100 = ${val}.`, next()))
    })

    ;[[2, 3, 8], [5, 5, 12], [1, 2, 15], [4, 6, 9], [3, 4, 10]].forEach(([a, d, n], i) => {
      const val = a + (n - 1) * d
      qs.push(numericMCQ(`math-5-${i + 1}`, 'Sequences and series', `Find the ${n}th term of the arithmetic progression with first term ${a} and common difference ${d}.`, val, `Tₙ = a + (n−1)d = ${a} + (${n}−1)×${d} = ${val}.`, next()))
    })

    ;[[12, 5], [9, 6], [14, 3], [11, 7], [16, 2]].forEach(([l, w], i) => {
      const val = l * w
      qs.push(numericMCQ(`math-6-${i + 1}`, 'Mensuration', `Find the area of a rectangle with length ${l} cm and width ${w} cm.`, val, `Area = length × width = ${l} × ${w} = ${val} cm².`, next(), ' cm²'))
    })

    ;[[7, 1], [10, 2], [12, 4], [9, 3], [14, 2]].forEach(([s, d], i) => {
      const x = (s + d) / 2
      const y = (s - d) / 2
      const val = x * y
      qs.push(numericMCQ(`math-7-${i + 1}`, 'Simultaneous equations', `If x + y = ${s} and x − y = ${d}, find the value of xy.`, val, `Adding the equations gives x = ${x}, and y = ${y}, so xy = ${val}.`, next()))
    })

    ;[[-7, 12], [-9, 20], [-5, 6], [-11, 30], [-6, 8]].forEach(([b, c], i) => {
      const val = -b
      qs.push(numericMCQ(`math-8-${i + 1}`, 'Quadratic equations', `Find the sum of the roots of x² + (${b})x + ${c} = 0.`, val, `For x² + bx + c = 0, the sum of roots = −b = −(${b}) = ${val}.`, next()))
    })

  return qs
}

export const mathematicsQuestions = buildMathematicsQuestions()

// ---------------------------------------------------------------------------
// Physics — 40 questions, generated from 8 numeric templates
// ---------------------------------------------------------------------------

function buildPhysicsQuestions() {
  const qs = []
  let pos = 0
  const next = () => pos++ % 4

    ;[[2, 5], [3, 4], [5, 6], [4, 10], [6, 3]].forEach(([i0, r], i) => {
      const val = i0 * r
      qs.push(numericMCQ(`phy-1-${i + 1}`, "Ohm's law", `A current of ${i0} A flows through a resistor of ${r} Ω. Find the voltage across it.`, val, `By Ohm's law, V = IR = ${i0} × ${r} = ${val} V.`, next(), ' V'))
    })

    ;[[5, 2], [10, 3], [4, 5], [8, 4], [6, 6]].forEach(([m, a], i) => {
      const val = m * a
      qs.push(numericMCQ(`phy-2-${i + 1}`, "Newton's second law", `A resultant force acts on a body of mass ${m} kg, giving it an acceleration of ${a} m/s². Find the force.`, val, `F = ma = ${m} × ${a} = ${val} N.`, next(), ' N'))
    })

    ;[[50, 2], [20, 3], [80, 1], [25, 3], [12, 6]].forEach(([f, l], i) => {
      const val = f * l
      qs.push(numericMCQ(`phy-3-${i + 1}`, 'Waves', `A wave has a frequency of ${f} Hz and a wavelength of ${l} m. Find its speed.`, val, `Speed = frequency × wavelength = ${f} × ${l} = ${val} m/s.`, next(), ' m/s'))
    })

    ;[[20, 4], [30, 5], [24, 6], [36, 4], [45, 9]].forEach(([m, v], i) => {
      const val = m / v
      qs.push(numericMCQ(`phy-4-${i + 1}`, 'Density', `A substance has a mass of ${m} g and a volume of ${v} cm³. Find its density.`, val, `Density = mass/volume = ${m}/${v} = ${val} g/cm³.`, next(), ' g/cm³'))
    })

    ;[[2, 3], [4, 2], [2, 5], [5, 2], [4, 3]].forEach(([m, v], i) => {
      const val = 0.5 * m * v * v
      qs.push(numericMCQ(`phy-5-${i + 1}`, 'Kinetic energy', `Find the kinetic energy of a ${m} kg object moving at ${v} m/s.`, val, `KE = ½mv² = ½ × ${m} × ${v}² = ${val} J.`, next(), ' J'))
    })

    ;[[4, 6], [3, 8], [5, 10], [8, 5], [6, 11]].forEach(([r1, r2], i) => {
      const val = r1 + r2
      qs.push(numericMCQ(`phy-6-${i + 1}`, 'Series circuits', `Two resistors of ${r1} Ω and ${r2} Ω are connected in series. Find the total resistance.`, val, `In series, total resistance = ${r1} + ${r2} = ${val} Ω.`, next(), ' Ω'))
    })

    ;[[10, 5], [20, 3], [15, 5], [8, 6], [12, 7]].forEach(([f, d], i) => {
      const val = f * d
      qs.push(numericMCQ(`phy-7-${i + 1}`, 'Work done', `Find the work done when a force of ${f} N moves an object through a distance of ${d} m.`, val, `Work = force × distance = ${f} × ${d} = ${val} J.`, next(), ' J'))
    })

    ;[[100, 5], [200, 4], [150, 5], [240, 6], [90, 9]].forEach(([w, t], i) => {
      const val = w / t
      qs.push(numericMCQ(`phy-8-${i + 1}`, 'Power', `A machine does ${w} J of work in ${t} seconds. Find its power.`, val, `Power = work/time = ${w}/${t} = ${val} W.`, next(), ' W'))
    })

  return qs
}

export const physicsQuestions = buildPhysicsQuestions()

// ---------------------------------------------------------------------------
// Chemistry — 40 questions (30 element symbols + 10 numeric)
// ---------------------------------------------------------------------------

const elementPairs = [
  ['Hydrogen', 'H'], ['Helium', 'He'], ['Lithium', 'Li'], ['Carbon', 'C'], ['Nitrogen', 'N'],
  ['Oxygen', 'O'], ['Sodium', 'Na'], ['Magnesium', 'Mg'], ['Aluminium', 'Al'], ['Silicon', 'Si'],
  ['Phosphorus', 'P'], ['Sulphur', 'S'], ['Chlorine', 'Cl'], ['Potassium', 'K'], ['Calcium', 'Ca'],
  ['Iron', 'Fe'], ['Copper', 'Cu'], ['Zinc', 'Zn'], ['Silver', 'Ag'], ['Tin', 'Sn'],
  ['Iodine', 'I'], ['Barium', 'Ba'], ['Gold', 'Au'], ['Mercury', 'Hg'], ['Lead', 'Pb'],
  ['Neon', 'Ne'], ['Argon', 'Ar'], ['Bromine', 'Br'], ['Manganese', 'Mn'], ['Nickel', 'Ni'],
]

function buildChemistryQuestions() {
  const elementQs = factBank(
    'chem-elem',
    'Periodic table',
    elementPairs,
    (t) => `What is the chemical symbol for ${t}?`,
    (t, d) => `The chemical symbol for ${t} is ${d}.`
  )

  const numericQs = []
  let pos = 0
  const next = () => pos++ % 4

    ;[[90, 18], [80, 40], [132, 44], [58, 58], [54, 18]].forEach(([mass, molar], i) => {
      const val = mass / molar
      numericQs.push(numericMCQ(`chem-num-1-${i + 1}`, 'Moles', `A sample has a mass of ${mass} g and a molar mass of ${molar} g/mol. How many moles does it contain?`, val, `Moles = mass / molar mass = ${mass}/${molar} = ${val} mol.`, next(), ' mol'))
    })

    ;[[2, 10, 4], [3, 12, 6], [4, 8, 2], [5, 10, 2], [6, 9, 3]].forEach(([p1, v1, p2], i) => {
      const val = (p1 * v1) / p2
      numericQs.push(numericMCQ(`chem-num-2-${i + 1}`, "Boyle's law", `A gas at ${p1} atm occupies ${v1} L. Find its volume when the pressure changes to ${p2} atm at constant temperature.`, val, `By Boyle's law, P₁V₁ = P₂V₂, so V₂ = (${p1}×${v1})/${p2} = ${val} L.`, next(), ' L'))
    })

  return [...elementQs, ...numericQs]
}

export const chemistryQuestions = buildChemistryQuestions()

// ---------------------------------------------------------------------------
// Concept-based subjects — 40 term/fact questions each
// ---------------------------------------------------------------------------

const biologyPairs = [
  ['Cell', 'The basic structural and functional unit of life'],
  ['Nucleus', "The organelle that controls the cell's activities and contains DNA"],
  ['Mitochondrion', "The organelle that generates most of the cell's energy through respiration"],
  ['Ribosome', 'The organelle where protein synthesis takes place'],
  ['Cell membrane', 'The selectively permeable layer that encloses a cell'],
  ['Cell wall', 'A rigid layer that provides support to plant cells'],
  ['Chloroplast', 'The organelle where photosynthesis occurs in plants'],
  ['Photosynthesis', 'The process by which plants make food using sunlight'],
  ['Respiration', 'The process of releasing energy from food in cells'],
  ['Osmosis', 'The movement of water across a membrane from high to low concentration'],
  ['Diffusion', 'The movement of particles from a region of high to low concentration'],
  ['Homeostasis', 'The maintenance of a stable internal environment'],
  ['Genetics', 'The study of heredity and variation in organisms'],
  ['Gene', 'A unit of heredity that determines a particular trait'],
  ['Chromosome', 'A thread-like structure carrying genetic information'],
  ['DNA', 'The molecule that carries genetic instructions in living things'],
  ['Mitosis', 'Cell division producing two genetically identical daughter cells'],
  ['Meiosis', 'Cell division that produces gametes with half the chromosome number'],
  ['Ecosystem', 'A community of organisms interacting with their environment'],
  ['Food chain', 'A sequence showing the transfer of energy between organisms'],
  ['Food web', 'A network of interconnected food chains'],
  ['Producer', 'An organism that makes its own food, usually via photosynthesis'],
  ['Consumer', 'An organism that feeds on other organisms for energy'],
  ['Decomposer', 'An organism that breaks down dead matter and returns nutrients to the soil'],
  ['Habitat', 'The natural environment in which an organism lives'],
  ['Adaptation', 'A feature that helps an organism survive in its environment'],
  ['Species', 'A group of organisms that can interbreed and produce fertile offspring'],
  ['Classification', 'The grouping of organisms based on shared characteristics'],
  ['Vertebrate', 'An animal with a backbone'],
  ['Invertebrate', 'An animal without a backbone'],
  ['Enzyme', 'A protein that speeds up biochemical reactions'],
  ['Hormone', 'A chemical messenger secreted by glands into the bloodstream'],
  ['Nervous system', 'The system that coordinates responses using nerve impulses'],
  ['Circulatory system', 'The system that transports blood around the body'],
  ['Digestive system', 'The system that breaks down food for absorption'],
  ['Respiratory system', 'The system responsible for gas exchange in the body'],
  ['Excretion', 'The removal of metabolic waste products from the body'],
  ['Reproduction', 'The process by which organisms produce offspring'],
  ['Natural selection', 'The process by which better-adapted organisms survive and reproduce'],
  ['Variation', 'Differences in characteristics among individuals of a species'],
]

const literaturePairs = [
  ['Simile', 'A comparison between two unlike things using like or as'],
  ['Metaphor', 'A direct comparison stating one thing is another'],
  ['Personification', 'Giving human qualities to non-human things'],
  ['Hyperbole', 'Deliberate exaggeration for effect'],
  ['Alliteration', 'Repetition of initial consonant sounds'],
  ['Assonance', 'Repetition of vowel sounds in nearby words'],
  ['Onomatopoeia', 'A word that imitates the sound it describes'],
  ['Irony', 'A contrast between expectation and reality'],
  ['Oxymoron', 'A figure of speech combining contradictory terms'],
  ['Sonnet', 'A fourteen-line poem with a fixed rhyme scheme'],
  ['Ballad', 'A narrative poem often set to music'],
  ['Ode', 'A poem of praise addressed to a person or thing'],
  ['Elegy', 'A poem of mourning for the dead'],
  ['Epic', 'A long narrative poem about heroic deeds'],
  ['Fable', 'A short tale with animal characters teaching a moral'],
  ['Myth', 'A traditional story explaining natural phenomena or origins'],
  ['Legend', 'A traditional story regarded as historical but unverified'],
  ['Parable', 'A short story that teaches a moral or spiritual lesson'],
  ['Soliloquy', 'A speech by a character alone revealing private thoughts'],
  ['Monologue', 'A long speech by one character to others'],
  ['Dialogue', 'A conversation between two or more characters'],
  ['Aside', 'A remark a character makes to the audience unheard by others'],
  ['Protagonist', 'The main character of a story'],
  ['Antagonist', 'The character who opposes the protagonist'],
  ['Climax', 'The turning point or most intense moment of a story'],
  ['Denouement', 'The resolution at the end of a story'],
  ['Exposition', 'The introductory part that sets up a story'],
  ['Foreshadowing', 'A hint of events to come later in a story'],
  ['Flashback', 'A scene set earlier than the main story timeline'],
  ['Symbolism', 'Using an object to represent a deeper meaning'],
  ['Imagery', 'Descriptive language that appeals to the senses'],
  ['Tone', "The author's attitude toward the subject"],
  ['Mood', 'The emotional atmosphere created for the reader'],
  ['Theme', 'The central message or idea of a literary work'],
  ['Setting', 'The time and place in which a story occurs'],
  ['Plot', 'The sequence of events in a story'],
  ['Characterization', "The way an author reveals a character's traits"],
  ['Satire', 'Using humour or ridicule to criticize human vices'],
  ['Tragedy', "A serious drama ending in the downfall of the hero"],
  ['Comedy', 'A light dramatic work that is often humorous and ends happily'],
]

const governmentPairs = [
  ['Autocracy', 'Government where absolute power rests with one ruler'],
  ['Democracy', 'Government by the people, directly or through representatives'],
  ['Oligarchy', 'Government by a small group of people'],
  ['Monarchy', 'Government headed by a king or queen'],
  ['Theocracy', 'Government ruled according to religious law'],
  ['Federalism', 'A system where power is shared between central and regional governments'],
  ['Unitary state', 'A state governed as a single power with a central government'],
  ['Confederation', 'A loose union of independent states for limited purposes'],
  ['Bicameral legislature', 'A legislature with two chambers'],
  ['Unicameral legislature', 'A legislature with a single chamber'],
  ['Universal adult suffrage', 'The right of all qualified adults to vote'],
  ['Franchise', 'The right to vote in public elections'],
  ['Electoral college', 'A body of electors chosen to elect a candidate'],
  ['Separation of powers', 'Dividing government into executive, legislature and judiciary'],
  ['Checks and balances', 'A system where each arm of government limits the others'],
  ['Rule of law', 'The principle that everyone is subject to the law'],
  ['Fundamental human rights', 'Basic rights and freedoms guaranteed to all citizens'],
  ['Constitution', 'The supreme law that establishes how a state is governed'],
  ['Sovereignty', 'The supreme authority of a state to govern itself'],
  ['Citizenship', 'Legal membership of a state with rights and duties'],
  ['Cabinet', 'A body of senior ministers who advise the head of government'],
  ['Bureaucracy', 'The administrative system run by appointed officials'],
  ['Judiciary', 'The arm of government that interprets and applies the law'],
  ['Legislature', 'The arm of government that makes laws'],
  ['Executive', 'The arm of government that implements laws'],
  ['Impeachment', 'A formal process to remove an official for misconduct'],
  ['Veto', 'The power to reject a decision or proposal'],
  ['Coalition government', 'A government formed by two or more parties'],
  ['Pressure group', "An organised group that seeks to influence government policy"],
  ['Political party', 'An organisation that seeks to gain and exercise political power'],
  ['Manifesto', "A public declaration of a party's policies and aims"],
  ['Referendum', 'A direct vote by citizens on a specific issue'],
  ['Plebiscite', 'A vote by citizens to decide on a significant political question'],
  ['Devolution', 'The transfer of power from central to regional government'],
  ['Decentralisation', 'Distributing government functions away from a central authority'],
  ['Nepotism', 'Favouritism shown to relatives in appointments'],
  ["Coup d'état", 'The sudden, illegal seizure of power from a government'],
  ['Martial law', 'Temporary military rule imposed during an emergency'],
  ['Civil service', 'The body of government employees who implement policy'],
  ['Local government', 'The lowest tier of government closest to the people'],
]

const crsPairs = [
  ['The Ten Commandments', 'Laws given to Moses by God on Mount Sinai'],
  ['The Exodus', 'The departure of the Israelites from slavery in Egypt'],
  ['Genesis', 'The first book of the Bible, recording creation'],
  ["Noah's Ark", 'The vessel Noah built to survive the great flood'],
  ['The Tower of Babel', 'A tower built by people that God confused with many languages'],
  ["Abraham's covenant", "God's promise to make Abraham the father of many nations"],
  ['Joseph and his brothers', 'The story of a favoured son sold into slavery in Egypt'],
  ['The Promised Land', 'The land of Canaan God promised to the Israelites'],
  ['King David', 'A shepherd who became king and wrote many Psalms'],
  ['King Solomon', "David's son known for wisdom and building the temple"],
  ['The Prophets', "Messengers who spoke God's word to Israel"],
  ['The Nativity', 'The birth of Jesus Christ in Bethlehem'],
  ['John the Baptist', 'The prophet who baptised Jesus in the Jordan River'],
  ['The Sermon on the Mount', "Jesus' teaching that includes the Beatitudes"],
  ['The Twelve Apostles', 'The twelve men Jesus chose as his closest followers'],
  ['The Last Supper', 'The final meal Jesus shared with his disciples before his death'],
  ['Judas Iscariot', 'The disciple who betrayed Jesus'],
  ['The Crucifixion', 'The execution of Jesus on the cross'],
  ['The Resurrection', 'Jesus rising from the dead on the third day'],
  ['The Great Commission', "Jesus' instruction to spread the gospel to all nations"],
  ['The Good Samaritan', "A parable teaching love for one's neighbour"],
  ['The Prodigal Son', "A parable about a father's forgiveness for a wayward son"],
  ['The Sower', 'A parable about seeds falling on different types of soil'],
  ['Pentecost', 'The day the Holy Spirit descended on the apostles'],
  ["Paul's conversion", 'The transformation of Saul from persecutor to apostle'],
  ['The Beatitudes', 'Blessings Jesus pronounced at the start of the Sermon on the Mount'],
  ["The Lord's Prayer", 'The model prayer Jesus taught his disciples'],
  ['Adam and Eve', 'The first man and woman created by God'],
  ['Cain and Abel', 'The first sons of Adam and Eve, whose rivalry ended in murder'],
  ['The Golden Rule', "Jesus' teaching to treat others as you want to be treated"],
  ['Moses', 'The leader who received the law and led Israel out of Egypt'],
  ['The Ark of the Covenant', 'A sacred chest containing the tablets of the law'],
  ['The Fall of Jericho', "The city whose walls fell after Israelites marched around it"],
  ['Samson', 'A judge of Israel known for his great strength'],
  ['Ruth', "A Moabite woman known for her loyalty to her mother-in-law Naomi"],
  ['Job', 'A righteous man tested by great suffering who remained faithful'],
  ['Jonah', "A prophet who was swallowed by a great fish after fleeing God's call"],
  ["Daniel in the lion's den", 'A story of faith protecting Daniel from harm'],
  ['The Great Flood', "God's judgment on the earth survived by Noah's family"],
  ['Zacchaeus', 'A tax collector whose life changed after meeting Jesus'],
]

const historyPairs = [
  ['Pre-colonial era', "The period in Nigeria's history before European colonisation"],
  ['Trans-Saharan trade', 'Trade routes across the Sahara linking West Africa to North Africa'],
  ['Trans-Atlantic slave trade', 'The forced transportation of Africans to the Americas'],
  ['Berlin Conference', 'The 1884-85 meeting where European powers partitioned Africa'],
  ['Amalgamation of 1914', 'The merging of the Northern and Southern protectorates into Nigeria'],
  ['Lord Lugard', "The colonial administrator who oversaw Nigeria's amalgamation"],
  ['Indirect rule', 'A colonial policy of governing through existing local rulers'],
  ['Sokoto Caliphate', 'An Islamic state founded by Usman dan Fodio in 1809'],
  ['Oyo Empire', 'A powerful Yoruba empire that flourished in West Africa'],
  ['Benin Kingdom', 'A historic kingdom known for its bronze artworks'],
  ['Nationalism', 'A movement advocating for self-rule and independence from colonial powers'],
  ['Herbert Macaulay', 'Regarded as the father of Nigerian nationalism'],
  ['Nnamdi Azikiwe', "Nigeria's first President and a leading nationalist"],
  ['Obafemi Awolowo', 'A prominent Nigerian nationalist and premier of the Western Region'],
  ['Ahmadu Bello', 'The Premier of the Northern Region and a key independence-era leader'],
  ['Nigerian independence', 'Nigeria gained independence from Britain on 1 October 1960'],
  ['First Republic', "Nigeria's first period of civilian rule after independence, 1963-1966"],
  ['Nigerian Civil War', 'The 1967-1970 conflict between Nigeria and the secessionist Biafra'],
  ['Biafra', 'The short-lived state that seceded from Nigeria in 1967'],
  ['Yakubu Gowon', 'The Head of State during the Nigerian Civil War'],
  ['Military coup', 'The sudden, forceful overthrow of a government by the armed forces'],
  ['Murtala Mohammed', 'A military head of state known for rapid reforms in 1975-76'],
  ['Second Republic', "Nigeria's civilian government from 1979 to 1983, led by Shehu Shagari"],
  ['Structural Adjustment Programme', 'An economic reform policy adopted by Nigeria in the 1980s'],
  ['June 12 1993', "The date of Nigeria's annulled presidential election"],
  ['Sani Abacha', 'A military head of state who ruled Nigeria from 1993 to 1998'],
  ['Fourth Republic', "Nigeria's current democratic era, beginning in 1999"],
  ['Olusegun Obasanjo', "Nigeria's president who returned the country to civilian rule in 1999"],
  ['Federal Character Principle', 'A policy promoting balanced representation in government'],
  ['Warrant chiefs', 'Local leaders appointed by colonial authorities to administer indirect rule'],
  ["Aba Women's Riot", 'A 1929 protest by women against colonial taxation policies'],
  ["Zik's Press", 'Newspapers used by Nnamdi Azikiwe to promote nationalist ideas'],
  ['Richards Constitution', 'A 1946 constitution that divided Nigeria into three regions'],
  ['Macpherson Constitution', 'A 1951 constitution that introduced more Nigerian participation in government'],
  ['Lyttleton Constitution', 'A 1954 constitution that established a federal system in Nigeria'],
  ['Willink Commission', 'A commission set up to address minority fears before independence'],
  ['ECOWAS', 'A regional organisation promoting economic integration in West Africa'],
  ['Pan-Africanism', 'A movement promoting unity among African peoples and nations'],
  ['Decolonisation', 'The process by which colonies gained independence from colonial powers'],
  ['Scramble for Africa', 'The rapid colonisation of African territory by European powers in the late 1800s'],
]

const economicsPairs = [
  ['Scarcity', 'Limited resources relative to unlimited wants'],
  ['Opportunity cost', 'The value of the next best alternative forgone'],
  ['Demand', 'The quantity of a good buyers are willing to purchase at a price'],
  ['Supply', 'The quantity of a good producers are willing to sell at a price'],
  ['Equilibrium', 'The point where quantity demanded equals quantity supplied'],
  ['Elasticity of demand', 'The responsiveness of quantity demanded to a price change'],
  ['Inflation', 'A persistent rise in the general price level'],
  ['Deflation', 'A persistent fall in the general price level'],
  ['Gross Domestic Product', 'The total value of goods and services produced within a country'],
  ['Gross National Product', 'GDP plus net income earned from abroad'],
  ['Unemployment', 'The state of being without work while seeking employment'],
  ['Factors of production', 'Land, labour, capital and entrepreneurship'],
  ['Division of labour', 'Splitting a task into specialised parts among workers'],
  ['Specialisation', 'Focusing on producing a limited range of goods or services'],
  ['Monopoly', 'A market structure with a single seller controlling supply'],
  ['Oligopoly', 'A market dominated by a few large sellers'],
  ['Perfect competition', 'A market with many buyers and sellers of identical goods'],
  ['Fiscal policy', 'Government use of spending and taxation to influence the economy'],
  ['Monetary policy', 'Central bank actions to control money supply and interest rates'],
  ['Tariff', 'A tax imposed on imported goods'],
  ['Subsidy', 'Financial assistance given by government to reduce production costs'],
  ['Balance of payments', "A record of a country's transactions with the rest of the world"],
  ['Exchange rate', 'The value of one currency in terms of another'],
  ['National income', "The total income earned by a country's citizens and businesses"],
  ['Public finance', 'The management of government revenue and expenditure'],
  ['Taxation', 'The compulsory collection of money by government from individuals and firms'],
  ['Cooperative society', 'A group pooling resources for mutual economic benefit'],
  ['Capital formation', 'The process of building up a stock of capital goods'],
  ['Entrepreneur', 'A person who organises and takes the risk of production'],
  ['Utility', 'The satisfaction derived from consuming a good or service'],
  ['Law of diminishing returns', 'Adding more of one input eventually yields smaller output gains'],
  ['Mixed economy', 'An economy combining private enterprise and government control'],
  ['Capitalism', 'An economic system based on private ownership and free markets'],
  ['Socialism', 'An economic system where the state controls production and distribution'],
  ['Privatisation', 'Transferring ownership from government to private hands'],
  ['Nationalisation', 'Transferring ownership from private hands to government'],
  ['Currency', 'Money in circulation used as a medium of exchange'],
  ['Barter', 'The direct exchange of goods and services without money'],
  ['Liquidity', 'The ease with which an asset can be converted into cash'],
  ['Per capita income', 'Average income per person in a country'],
]

const commercePairs = [
  ['Commerce', 'All activities involved in the exchange and distribution of goods'],
  ['Trade', 'The buying and selling of goods and services'],
  ['Home trade', 'Trade carried out within the boundaries of one country'],
  ['Foreign trade', 'Trade between different countries'],
  ['Entrepot trade', 'Importing goods for re-export to another country'],
  ['Retailer', 'A trader who sells goods in small quantities to final consumers'],
  ['Wholesaler', 'A trader who buys in bulk and sells to retailers'],
  ['Insurance', 'A contract providing compensation for specified losses in return for premium'],
  ['Warehousing', 'The storage of goods until they are needed'],
  ['Bill of lading', 'A document evidencing receipt of goods for shipment'],
  ['Cheque', 'A written order instructing a bank to pay a stated sum'],
  ['Promissory note', 'A written promise to pay a specified sum on demand or at a future date'],
  ['Stock exchange', 'A market where shares of public companies are traded'],
  ['Partnership', 'A business owned by two or more people sharing profits and losses'],
  ['Sole proprietorship', 'A business owned and run by one person'],
  ['Joint stock company', "A company whose capital is divided into transferable shares"],
  ['Franchise', "A licence allowing a business to trade under another's brand"],
  ['Invoice', 'A document listing goods sold and the amount owed'],
  ['Receipt', 'A document acknowledging that payment has been made'],
  ['Indemnity', 'A guarantee to compensate for loss or damage'],
  ['Premium', 'The amount paid periodically for an insurance policy'],
  ['Underwriter', 'A person or company that assesses and accepts insurance risk'],
  ['Freight', 'The cost of transporting goods'],
  ['Courier', 'A service that delivers documents or parcels quickly'],
  ['E-commerce', 'Buying and selling goods and services over the internet'],
  ['Advertising', 'Communication intended to promote the sale of goods or services'],
  ['Branding', 'Creating a distinct identity for a product or company'],
  ['Packaging', 'Wrapping or containing goods for protection and sale'],
  ['Distribution channel', 'The path goods take from producer to consumer'],
  ['Import', 'Goods brought into a country from abroad'],
  ['Export', 'Goods sent out of a country to be sold abroad'],
  ['Quota', 'A limit on the quantity of goods that can be imported'],
  ['Bank overdraft', 'Permission to withdraw more money than is in an account'],
  ['Mortgage', 'A loan secured against property'],
  ['Lease', 'A contract granting use of an asset for a period in return for payment'],
  ['Hire purchase', 'Buying goods by paying in instalments while using them'],
  ['Consignment', 'Goods sent by a supplier to an agent for sale'],
  ['Middleman', 'A person who links producers and consumers in the distribution chain'],
  ['Chamber of commerce', 'An organisation that promotes the interests of business'],
  ['Currency exchange', "Converting one country's money into another's"],
]

const accountsPairs = [
  ['Bookkeeping', 'The recording of financial transactions of a business'],
  ['Double-entry', 'Recording each transaction as both a debit and a credit'],
  ['Debit', 'An entry recording an increase in assets or expenses'],
  ['Credit', 'An entry recording an increase in liabilities, income or capital'],
  ['Ledger', 'A book containing accounts where transactions are posted'],
  ['Journal', 'A book of original entry recording transactions in order'],
  ['Trial balance', 'A list of ledger balances used to check accounting accuracy'],
  ['Balance sheet', 'A statement showing assets, liabilities and capital at a point in time'],
  ['Profit and loss account', 'A statement showing income and expenses over a period'],
  ['Assets', 'Resources owned by a business with economic value'],
  ['Liabilities', 'Amounts owed by a business to others'],
  ['Capital', "The owner's investment in a business"],
  ['Depreciation', 'The reduction in value of an asset over time'],
  ['Straight-line depreciation', "A method spreading depreciation evenly over an asset's life"],
  ['Reducing balance method', 'A depreciation method applying a fixed rate to the remaining value'],
  ['Accrual', 'Income earned or expense incurred but not yet recorded in cash'],
  ['Prepayment', 'Payment made in advance for goods or services not yet received'],
  ['Bad debt', 'A debt that is unlikely to be recovered'],
  ['Provision for doubtful debts', 'An estimated amount set aside for debts that may not be paid'],
  ['Trading account', 'A statement showing gross profit from buying and selling goods'],
  ['Gross profit', 'Revenue from sales minus the cost of goods sold'],
  ['Net profit', 'Gross profit minus operating expenses'],
  ['Capital expenditure', 'Spending on acquiring or improving long-term assets'],
  ['Revenue expenditure', 'Spending on the day-to-day running of a business'],
  ['Cash book', 'A book recording all cash and bank transactions'],
  ['Petty cash', 'A small amount of cash kept for minor expenses'],
  ['Bank reconciliation', 'Comparing a cash book with a bank statement to explain differences'],
  ['Suspense account', 'A temporary account used when a trial balance does not balance'],
  ['Working capital', 'The excess of current assets over current liabilities'],
  ['Current assets', 'Assets expected to be converted to cash within a year'],
  ['Current liabilities', 'Debts due to be paid within a year'],
  ['Fixed assets', 'Long-term assets used in running a business'],
  ['Drawings', 'Cash or goods withdrawn by the owner for personal use'],
  ['Accounting equation', 'Assets equal liabilities plus capital'],
  ['Source document', 'Original evidence of a business transaction, such as an invoice'],
  ['Control account', 'A summary account that checks the accuracy of subsidiary ledgers'],
  ['Manufacturing account', 'A statement showing the total cost of goods produced'],
  ['Partnership deed', 'A written agreement setting out the terms of a partnership'],
  ['Goodwill', "The value of a business's reputation above its net assets"],
  ['Final accounts', 'The trading account, profit and loss account and balance sheet together'],
]

export const biologyQuestions = factBank('bio', 'Biology', biologyPairs, describePrompt, describeExplanation)
export const literatureQuestions = factBank('lit', 'Literary terms', literaturePairs, describePrompt, describeExplanation)
export const governmentQuestions = factBank('gov', 'Government', governmentPairs, describePrompt, describeExplanation)
export const crsQuestions = factBank('crs', 'Christian Religious Studies', crsPairs, describePrompt, describeExplanation)
export const historyQuestions = factBank('hist', 'History', historyPairs, describePrompt, describeExplanation)
export const economicsQuestions = factBank('eco', 'Economics', economicsPairs, describePrompt, describeExplanation)
export const commerceQuestions = factBank('com', 'Commerce', commercePairs, describePrompt, describeExplanation)
export const accountsQuestions = factBank('acc', 'Financial Accounting', accountsPairs, describePrompt, describeExplanation)

// ---------------------------------------------------------------------------
// Post UTME — Aptitude Test (OAU standard form)
// ---------------------------------------------------------------------------
// OAU's Post UTME screening is one general aptitude test every candidate
// sits, regardless of field of study — unlike JAMB there is no subject-
// specific "Use of English" paper. It's built from three sections, matching
// the standard OAU Post UTME CBT format: Verbal Reasoning, Quantitative
// Reasoning, and General Knowledge/Current Affairs.
// ---------------------------------------------------------------------------

const analogyQuestions = [
  { id: 'apt-ana-1', instruction: 'Verbal reasoning — analogies', prompt: 'FINGER is to HAND as LEAF is to ___?', options: ['Tree', 'Root', 'Flower', 'Branch'], answer: 0, explanation: 'A finger is a part of a hand just as a leaf is a part of a tree.' },
  { id: 'apt-ana-2', instruction: 'Verbal reasoning — analogies', prompt: 'PUPPY is to DOG as KITTEN is to ___?', options: ['Cat', 'Lion', 'Tiger', 'Fox'], answer: 0, explanation: 'A puppy is a young dog just as a kitten is a young cat.' },
  { id: 'apt-ana-3', instruction: 'Verbal reasoning — analogies', prompt: 'DOCTOR is to HOSPITAL as TEACHER is to ___?', options: ['School', 'Market', 'Court', 'Farm'], answer: 0, explanation: 'A doctor works in a hospital just as a teacher works in a school.' },
  { id: 'apt-ana-4', instruction: 'Verbal reasoning — analogies', prompt: 'PEN is to WRITE as KNIFE is to ___?', options: ['Cut', 'Draw', 'Paint', 'Measure'], answer: 0, explanation: 'A pen is used to write just as a knife is used to cut.' },
  { id: 'apt-ana-5', instruction: 'Verbal reasoning — analogies', prompt: 'FISH is to WATER as BIRD is to ___?', options: ['Air', 'Nest', 'Tree', 'Cage'], answer: 0, explanation: 'A fish lives in water just as a bird lives in (flies through) the air.' },
  { id: 'apt-ana-6', instruction: 'Verbal reasoning — analogies', prompt: 'AUTHOR is to BOOK as COMPOSER is to ___?', options: ['Music', 'Painting', 'Sculpture', 'Film'], answer: 0, explanation: 'An author creates a book just as a composer creates music.' },
  { id: 'apt-ana-7', instruction: 'Verbal reasoning — analogies', prompt: 'HOUR is to MINUTE as MINUTE is to ___?', options: ['Second', 'Day', 'Week', 'Month'], answer: 0, explanation: 'An hour is divided into minutes just as a minute is divided into seconds.' },
  { id: 'apt-ana-8', instruction: 'Verbal reasoning — analogies', prompt: 'TALL is to SHORT as FAST is to ___?', options: ['Slow', 'Quick', 'Swift', 'Rapid'], answer: 0, explanation: '"Tall" and "short" are opposites, just as "fast" and "slow" are opposites.' },
  { id: 'apt-ana-9', instruction: 'Verbal reasoning — analogies', prompt: 'TAILOR is to CLOTHES as CARPENTER is to ___?', options: ['Furniture', 'Food', 'Jewelry', 'Pottery'], answer: 0, explanation: 'A tailor makes clothes just as a carpenter makes furniture.' },
  { id: 'apt-ana-10', instruction: 'Verbal reasoning — analogies', prompt: 'CUB is to LION as CALF is to ___?', options: ['Cow', 'Goat', 'Sheep', 'Horse'], answer: 0, explanation: 'A cub is a baby lion just as a calf is a baby cow.' },
  { id: 'apt-ana-11', instruction: 'Verbal reasoning — analogies', prompt: 'THERMOMETER is to TEMPERATURE as SPEEDOMETER is to ___?', options: ['Speed', 'Distance', 'Weight', 'Pressure'], answer: 0, explanation: 'A thermometer measures temperature just as a speedometer measures speed.' },
  { id: 'apt-ana-12', instruction: 'Verbal reasoning — analogies', prompt: 'ISLAND is to WATER as OASIS is to ___?', options: ['Desert', 'Forest', 'Mountain', 'Valley'], answer: 0, explanation: 'An island is surrounded by water just as an oasis is surrounded by desert.' },
  { id: 'apt-ana-13', instruction: 'Verbal reasoning — analogies', prompt: 'NOVEL is to CHAPTERS as HOUSE is to ___?', options: ['Rooms', 'Doors', 'Windows', 'Walls'], answer: 0, explanation: 'A novel is made up of chapters just as a house is made up of rooms.' },
  { id: 'apt-ana-14', instruction: 'Verbal reasoning — analogies', prompt: 'SCULPTOR is to CHISEL as PAINTER is to ___?', options: ['Brush', 'Hammer', 'Needle', 'Saw'], answer: 0, explanation: 'A sculptor works with a chisel just as a painter works with a brush.' },
  { id: 'apt-ana-15', instruction: 'Verbal reasoning — analogies', prompt: 'WATER is to THIRST as FOOD is to ___?', options: ['Hunger', 'Health', 'Taste', 'Energy'], answer: 0, explanation: 'Water satisfies thirst just as food satisfies hunger.' },
  { id: 'apt-ana-16', instruction: 'Verbal reasoning — analogies', prompt: 'LIBRARY is to BOOKS as MUSEUM is to ___?', options: ['Artifacts', 'Letters', 'Clothes', 'Coins only'], answer: 0, explanation: 'A library houses books just as a museum houses artifacts.' },
  { id: 'apt-ana-17', instruction: 'Verbal reasoning — analogies', prompt: 'OPTIMIST is to PESSIMIST as GENEROUS is to ___?', options: ['Stingy', 'Kind', 'Wealthy', 'Honest'], answer: 0, explanation: '"Optimist" and "pessimist" are opposites, just as "generous" and "stingy" are opposites.' },
  { id: 'apt-ana-18', instruction: 'Verbal reasoning — analogies', prompt: 'BANK is to MONEY as GRANARY is to ___?', options: ['Grain', 'Water', 'Fuel', 'Clothing'], answer: 0, explanation: 'A bank stores money just as a granary stores grain.' },
  { id: 'apt-ana-19', instruction: 'Verbal reasoning — analogies', prompt: 'DOCTOR is to PATIENT as LAWYER is to ___?', options: ['Client', 'Judge', 'Witness', 'Jury'], answer: 0, explanation: 'A doctor attends to a patient just as a lawyer attends to a client.' },
  { id: 'apt-ana-20', instruction: 'Verbal reasoning — analogies', prompt: 'KEY is to LOCK as PASSWORD is to ___?', options: ['Account', 'Keyboard', 'Internet', 'Screen'], answer: 0, explanation: 'A key opens a lock just as a password opens (unlocks) an account.' },
]

function buildAptitudeQuantitative() {
  const qs = []
  let pos = 0
  const next = () => pos++ % 4

    ;[
      { prompt: '2, 4, 6, 8, ?', val: 10, exp: 'Each term increases by 2, so the next term is 8 + 2 = 10.' },
      { prompt: '3, 6, 12, 24, ?', val: 48, exp: 'Each term doubles the one before it, so the next term is 24 × 2 = 48.' },
      { prompt: '1, 4, 9, 16, ?', val: 25, exp: 'This is the sequence of perfect squares (1², 2², 3², 4², 5²), so the next term is 5² = 25.' },
      { prompt: '5, 10, 20, 40, ?', val: 80, exp: 'Each term doubles the one before it, so the next term is 40 × 2 = 80.' },
      { prompt: '2, 5, 10, 17, ?', val: 26, exp: 'The differences between terms are 3, 5, 7 (increasing by 2 each time), so the next difference is 9, giving 17 + 9 = 26.' },
    ].forEach((q, i) => {
      qs.push(numericMCQ(`apt-quant-series-${i + 1}`, 'Quantitative reasoning — number series', `Find the next number in the series: ${q.prompt}`, q.val, q.exp, next()))
    })

    ;[
      [[12, 18, 24, 30, 36]],
      [[10, 20, 30, 40, 50]],
      [[8, 12, 16, 20]],
    ].forEach(([list], i) => {
      const val = list.reduce((a, b) => a + b, 0) / list.length
      qs.push(numericMCQ(`apt-quant-avg-${i + 1}`, 'Quantitative reasoning — averages', `Find the average of ${list.join(', ')}.`, val, `Average = sum of values ÷ number of values = ${list.reduce((a, b) => a + b, 0)} ÷ ${list.length} = ${val}.`, next()))
    })

    ;[
      [60000, 2, 3],
      [50000, 1, 4],
      [90000, 2, 1],
    ].forEach(([total, a, b], i) => {
      const val = Math.round((total * b) / (a + b))
      qs.push(numericMCQ(`apt-quant-ratio-${i + 1}`, 'Quantitative reasoning — ratios', `₦${total.toLocaleString()} is shared between two people in the ratio ${a}:${b}. Find the larger share.`, val, `Larger share = (${b}/(${a}+${b})) × ${total.toLocaleString()} = ${val}.`, next()))
    })

    ;[
      [150, 3, 'speed'],
      [120, 60, 'time'],
      [45, 4, 'distance'],
    ].forEach(([a, b, kind], i) => {
      let val, prompt, exp
      if (kind === 'speed') {
        val = a / b
        prompt = `A car travels ${a} km in ${b} hours. Find its average speed.`
        exp = `Speed = distance ÷ time = ${a} ÷ ${b} = ${val} km/h.`
      } else if (kind === 'time') {
        val = a / b
        prompt = `Find the time taken to cover ${a} km at a speed of ${b} km/h.`
        exp = `Time = distance ÷ speed = ${a} ÷ ${b} = ${val} hours.`
      } else {
        val = a * b
        prompt = `Find the distance covered in ${b} hours at a speed of ${a} km/h.`
        exp = `Distance = speed × time = ${a} × ${b} = ${val} km.`
      }
      qs.push(numericMCQ(`apt-quant-sdt-${i + 1}`, 'Quantitative reasoning — speed, distance & time', prompt, val, exp, next()))
    })

    ;[
      [4, 10, 'father-son'],
      [15, 5, 'siblings'],
      [50, 30, 'sum'],
    ].forEach(([a, b, kind], i) => {
      let val, prompt, exp
      if (kind === 'father-son') {
        val = a * b
        prompt = `A father is ${a} times as old as his son. If the son is ${b} years old, how old is the father?`
        exp = `Father's age = ${a} × ${b} = ${val} years.`
      } else if (kind === 'siblings') {
        val = a + b
        prompt = `Tomiwa is ${b} years older than his sister. If his sister is ${a} years old, how old is Tomiwa?`
        exp = `Tomiwa's age = ${a} + ${b} = ${val} years.`
      } else {
        val = a - b
        prompt = `The sum of two numbers is ${a} and one of them is ${b}. Find the other number.`
        exp = `Other number = ${a} − ${b} = ${val}.`
      }
      qs.push(numericMCQ(`apt-quant-word-${i + 1}`, 'Quantitative reasoning — problem solving', prompt, val, exp, next()))
    })

    ;[
      [2000, 2500, 'profit-pct'],
      [8000, 25, 'discount-amt'],
      [60, 40, 'find-number'],
    ].forEach(([a, b, kind], i) => {
      let val, prompt, exp
      if (kind === 'profit-pct') {
        val = Math.round(((b - a) / a) * 100)
        prompt = `A trader buys an item for ₦${a.toLocaleString()} and sells it for ₦${b.toLocaleString()}. Find the percentage profit.`
        exp = `Percentage profit = ((${b} − ${a}) / ${a}) × 100 = ${val}%.`
      } else if (kind === 'discount-amt') {
        val = Math.round((b / 100) * a)
        prompt = `An item originally priced at ₦${a.toLocaleString()} is sold at a ${b}% discount. Find the discount amount.`
        exp = `Discount = (${b}/100) × ${a.toLocaleString()} = ₦${val.toLocaleString()}.`
      } else {
        val = Math.round(a / (b / 100))
        prompt = `${b}% of a number is ${a}. Find the number.`
        exp = `Number = ${a} ÷ (${b}/100) = ${val}.`
      }
      qs.push(numericMCQ(`apt-quant-pct-${i + 1}`, 'Quantitative reasoning — percentages', prompt, val, exp, next()))
    })

  return qs
}

const generalKnowledgePairs = [
  ['What is the capital city of Nigeria?', 'Abuja'],
  ['What is the official currency of Nigeria?', 'Naira'],
  ['In which state is Obafemi Awolowo University (OAU) located?', 'Osun State'],
  ['What is the official language of Nigeria?', 'English'],
  ['How many states make up the Federal Republic of Nigeria?', '36'],
  ['Which river is the longest in Nigeria?', 'River Niger'],
  ['What does the acronym "ECOWAS" stand for?', 'Economic Community of West African States'],
  ['Obafemi Awolowo University was originally established under what name?', 'University of Ife'],
  ['Which continent is Nigeria located in?', 'Africa'],
  ['Which organ of the human body is primarily responsible for pumping blood?', 'The heart'],
]

export const aptitudeQuestions = [
  ...analogyQuestions,
  ...buildAptitudeQuantitative(),
  ...qaBank('apt-gk', 'General knowledge & current affairs', generalKnowledgePairs),
]

// ---------------------------------------------------------------------------
// Combined question bank
// ---------------------------------------------------------------------------

export const questionBank = {
  english: englishQuestions,
  aptitude_test: aptitudeQuestions,
  mathematics: mathematicsQuestions,
  physics: physicsQuestions,
  chemistry: chemistryQuestions,
  biology: biologyQuestions,
  literature: literatureQuestions,
  government: governmentQuestions,
  crs: crsQuestions,
  history: historyQuestions,
  economics: economicsQuestions,
  commerce: commerceQuestions,
  accounts: accountsQuestions,
}

// Returns exactly `count` questions for a subject, cycling the bank if it
// happens to be shorter than the requested count.
export function pickQuestions(subjectId, count) {
  const bank = questionBank[subjectId] || []
  if (bank.length === 0) return []
  if (bank.length >= count) return bank.slice(0, count)
  return Array.from({ length: count }, (_, i) => bank[i % bank.length])
}

// Exam years a student can choose from, newest first (2026 … 2000).
export const examYears = Array.from({ length: 2026 - 2000 + 1 }, (_, i) => 2026 - i)

const hasBuiltInBank = (subjectId, examType) =>
  examType === 'jamb' || (examType === 'post_utme' && subjectId === 'aptitude_test')

// Limits a `questions` query to one exam type. Rows saved before exam_type
// existed have exam_type = null — treat those as JAMB content so nothing
// already uploaded silently disappears.
const scopeToExamType = (query, examType) =>
  examType === 'jamb' ? query.or('exam_type.eq.jamb,exam_type.is.null') : query.eq('exam_type', examType)

// Topics available for a subject (optionally within one exam year), with how
// many questions each has. Built-in questions carry no year, so a specific
// year lists uploaded topics only.
export async function fetchTopics(subjectId, examType = 'jamb', year = null) {
  const counts = new Map()
  const add = (topic) => {
    if (topic) counts.set(topic, (counts.get(topic) ?? 0) + 1)
  }

  if (hasBuiltInBank(subjectId, examType) && !year) {
    ;(questionBank[subjectId] || []).forEach((q) => add(q.instruction))
  }

  try {
    let query = supabase.from('questions').select('instruction').eq('subject', subjectId)
    query = scopeToExamType(query, examType)
    if (year) query = query.eq('year', year)
    const { data, error } = await query.limit(2000)
    if (!error && data) data.forEach((row) => add(row.instruction))
  } catch {
    // offline / table missing — built-in topics only
  }

  return [...counts]
    .map(([topic, count]) => ({ topic, count }))
    .sort((a, b) => a.topic.localeCompare(b.topic))
}

// Loads questions for a subject and exam type. Admin-uploaded questions
// (Supabase `questions` table, filtered by both subject and exam_type) are
// ADDED to the built-in bank for JAMB, so that pool only ever grows. Post
// UTME and OAU Courses have no built-in bank for their field-specific
// elective subjects — those are 100% admin content, so an empty result
// there means "not added yet" (handled by the UI as a friendly empty state,
// not an error). The one exception is the Post UTME Aptitude Test itself,
// which does have a built-in bank (above), since every Post UTME candidate
// sits it regardless of field of study.
//
// Optional filters: `year` (an exam year — built-in questions have no year,
// so a year only returns uploaded questions) and `topics` (matched against
// each question's topic/instruction). When the student narrows the pool this
// way we return only what exists rather than repeating questions to pad it.
export async function fetchQuestions(subjectId, count, examType = 'jamb', { year = null, topics = [] } = {}) {
  const filtered = Boolean(year) || topics.length > 0

  let uploaded = []
  try {
    let query = supabase
      .from('questions')
      .select('id,instruction,prompt,options,answer,explanation')
      .eq('subject', subjectId)
    query = scopeToExamType(query, examType)
    if (year) query = query.eq('year', year)
    if (topics.length > 0) query = query.in('instruction', topics)
    const { data, error } = await query.limit(1000)
    if (!error && data) uploaded = data
  } catch {
    // offline / table missing — fall through
  }

  let builtIn = hasBuiltInBank(subjectId, examType) && !year ? questionBank[subjectId] || [] : []
  if (topics.length > 0) builtIn = builtIn.filter((q) => topics.includes(q.instruction))

  const pool = [...builtIn, ...uploaded]
  if (pool.length === 0) return []

  // Fisher-Yates shuffle (unbiased, unlike sort(() => Math.random() - 0.5)),
  // so every session draws a fresh random selection from the whole pool.
  const shuffled = [...pool]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  if (filtered) return shuffled.slice(0, count)
  if (shuffled.length >= count) return shuffled.slice(0, count)
  return Array.from({ length: count }, (_, i) => shuffled[i % shuffled.length])
}

// ---------------------------------------------------------------------------
// Dashboard / progress display data
// ---------------------------------------------------------------------------

export const pastPapers = [
  { id: 'jamb-math-2024', title: 'JAMB Mathematics — 2024', subject: 'mathematics', meta: 'Number bases, algebra, mensuration' },
  { id: 'jamb-eng-2023', title: 'JAMB Use of English — 2023', subject: 'english', meta: 'Vocabulary, grammar, idioms' },
  { id: 'jamb-phy-2022', title: 'JAMB Physics — 2022', subject: 'physics', meta: 'Mechanics, electricity, waves' },
]

// One full 4-subject combo per stream (compulsory + first N electives),
// used for the "quick start" full mock on the Mock Exams page. JAMB only —
// Post UTME uses `postUtmeStreams` the same way if a Post UTME mock is added.
export const mockExams = streams.map((stream) => ({
  id: `${stream.id}-full-mock`,
  streamId: stream.id,
  title: `${stream.name} Full Mock`,
  subjects: [...stream.compulsory, ...stream.electivePool.slice(0, stream.electiveCount)],
}))
