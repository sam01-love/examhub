import { NewsItem } from '../types';

export const NEWS_ITEMS: NewsItem[] = [
  {
    id: 'news-1',
    title: 'OAU Post-UTME Screening Guidelines & Cut-Off Marks Released',
    examCategory: 'POST_UTME',
    date: 'August 10, 2026',
    author: 'OAU Admissions Board',
    summary: 'Obafemi Awolowo University (OAU) has announced official Post-UTME CBT screening dates, registration prerequisites, and departmental aggregate score requirements.',
    fullContent: `
### Obafemi Awolowo University, Ile-Ife (Great Ife) Post-UTME Notice

The management of Obafemi Awolowo University (OAU), Ile-Ife, wishes to inform all candidates who chose OAU as their First Choice in the recent JAMB UTME examination and scored 200 and above that registration for the Computer-Based Screening Test (CBT) is officially open.

#### Key Highlights & Format
* **CBT Test Duration**: 30 minutes for 40 questions.
* **Subjects Covered**: 3 Core Subjects according to candidate JAMB combination + General Aptitude/Current Affairs.
* **Venue**: OAU e-Testing Centre, High Tech Building, Main Campus, Ile-Ife.
* **Calculators**: On-screen CBT calculator provided.

#### Preparation Tip from OAU Tech Unit
Candidates are advised to practice standard 30-minute CBT simulations to build speed and accuracy. Questions test core speed, accuracy, and depth of conceptual understanding.
`,
    source: 'OAU Official Portal (oauife.edu.ng)',
    tag: 'OAU Special',
    isImportant: true,
    readTime: '3 min read',
  },
  {
    id: 'news-2',
    title: 'JAMB Syllabus & UTME Exam Registration Updates',
    examCategory: 'JAMB',
    date: 'August 08, 2026',
    author: 'JAMB Registrar',
    summary: 'JAMB issues updated subject syllabus and mandatory novel recommendations for Use of English candidates.',
    fullContent: `
### Joint Admissions and Matriculation Board (JAMB) Official Update

JAMB has released the official syllabus for candidates preparing for the upcoming Unified Tertiary Matriculation Examination (UTME).

#### Key Highlights
* **Mandatory Novel**: Candidates are to read the prescribed English literary text.
* **4-Subject Structure**: Candidates must select Use of English as compulsory, along with 3 relevant subjects for their chosen field of study.
* **Biometric Verification**: Ensure your NIN details match your JAMB profile exactly to avoid registration hitches.
`,
    source: 'JAMB Official Press Bulletin',
    tag: 'JAMB UTME',
    isImportant: true,
    readTime: '2 min read',
  },
  {
    id: 'news-3',
    title: 'WAEC SSCE Results Release & Timetable Guidelines',
    examCategory: 'WAEC',
    date: 'August 05, 2026',
    author: 'WAEC National Office',
    summary: 'WAEC announces official release of May/June SSCE results along with digitized original certificate downloads.',
    fullContent: `
### West African Examinations Council (WAEC) Bulletin

The West African Examinations Council has concluded the grading of candidate scripts across all 36 states and the Federal Capital Territory.

#### Digitized Credentials
Candidates can now check their results using the official result checker pin and download their digital certificates via the WAEC e-certificate portal.
`,
    source: 'WAEC Direct Portal',
    tag: 'WAEC SSCE',
    isImportant: false,
    readTime: '2 min read',
  },
];
