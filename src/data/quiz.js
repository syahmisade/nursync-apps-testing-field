export const quizCategories = [
  { id: "pharmacology", label: "Pharmacology", icon: "💊", count: 8 },
  { id: "fundamentals", label: "Fundamentals", icon: "📋", count: 6 },
  { id: "medsurg", label: "Med-Surgical", icon: "🏥", count: 6 },
  { id: "maternal", label: "Maternal & Child", icon: "👶", count: 5 },
  { id: "infection", label: "Infection Control", icon: "🦠", count: 5 },
  { id: "calculations", label: "Calculations", icon: "🔢", count: 5 },
];

export const quizQuestions = [
  // Pharmacology
  {
    id: 1,
    category: "pharmacology",
    question: "A patient is prescribed paracetamol 1g QDS. What is the maximum daily dose for an adult, and what is the primary concern with overdose?",
    options: [
      "2g/day — Renal failure",
      "4g/day — Hepatotoxicity",
      "6g/day — Cardiac arrhythmia",
      "8g/day — Neurotoxicity"
    ],
    correctIndex: 1,
    explanation: "The maximum adult dose of paracetamol is 4g per day (1g QDS). Overdose primarily causes hepatotoxicity due to accumulation of the toxic metabolite NAPQI, which depletes glutathione stores in the liver. N-acetylcysteine (NAC) is the antidote.",
    reference: "BNF 85, MOH Formulary (sample)"
  },
  {
    id: 2,
    category: "pharmacology",
    question: "Which of the following is a known serious adverse effect of long-term morphine use that requires regular prophylaxis?",
    options: [
      "Hyperglycaemia",
      "Constipation",
      "Tachycardia",
      "Hyperthyroidism"
    ],
    correctIndex: 1,
    explanation: "Opioid-induced constipation (OIC) is an expected and consistent side effect of morphine and other opioids. Unlike other side effects (e.g., nausea, sedation), tolerance to constipation does NOT develop. Laxatives (e.g., senna, lactulose) should be prescribed prophylactically for all patients on regular opioids.",
    reference: "BNF 85, Palliative Care Guidelines (sample)"
  },
  {
    id: 3,
    category: "pharmacology",
    question: "A patient on warfarin is started on a broad-spectrum antibiotic. The nurse should anticipate which effect?",
    options: [
      "Decreased warfarin effect",
      "Increased warfarin effect with bleeding risk",
      "No significant interaction",
      "Increased warfarin metabolism"
    ],
    correctIndex: 1,
    explanation: "Many antibiotics can increase warfarin's anticoagulant effect. Mechanisms include: inhibition of gut flora that produce Vitamin K, inhibition of CYP enzymes that metabolise warfarin. INR should be closely monitored when antibiotics are initiated, changed, or stopped in patients on warfarin.",
    reference: "BNF 85 (sample)"
  },
  {
    id: 4,
    category: "pharmacology",
    question: "Salbutamol (Ventolin) inhaler causes which of the following side effects at high doses?",
    options: [
      "Hyperkalaemia",
      "Bradycardia",
      "Hypokalaemia",
      "Hyponatraemia"
    ],
    correctIndex: 2,
    explanation: "High-dose salbutamol (especially via nebulisation) can cause hypokalaemia by stimulating beta-2 receptors on skeletal muscle, driving potassium intracellularly. This is especially important in asthma attacks, where hypoxia and corticosteroids also contribute to low potassium. Monitor serum K+ in severe asthma.",
    reference: "BNF 85, MOH CPG Asthma (sample)"
  },
  {
    id: 5,
    category: "pharmacology",
    question: "Before administering metformin for a contrast CT scan patient, what is the nurse's priority action?",
    options: [
      "Administer metformin as usual — it is safe with contrast",
      "Hold metformin 48 hours before and after the procedure",
      "Double the dose to ensure effectiveness",
      "Switch to insulin temporarily with no specific hold required"
    ],
    correctIndex: 1,
    explanation: "Iodinated contrast agents can cause acute kidney injury, which reduces metformin excretion and increases the risk of lactic acidosis. Current guidelines recommend holding metformin 48 hours before (if eGFR < 60) and 48 hours after contrast administration. Renal function should be rechecked before resuming.",
    reference: "MOH Malaysia CPG Diabetes (sample), RCR Guidelines"
  },
  {
    id: 6,
    category: "pharmacology",
    question: "A patient reports muscle aches and weakness after being started on atorvastatin. What should the nurse do?",
    options: [
      "Reassure the patient it is normal — no action needed",
      "Document and report to prescriber — may indicate myopathy",
      "Ask patient to take the medication with more water",
      "Double the dose to reduce muscle ache faster"
    ],
    correctIndex: 1,
    explanation: "Muscle ache (myalgia) is a recognised adverse effect of statins. In rare cases, it can progress to rhabdomyolysis — a serious muscle breakdown that causes myoglobinuria and acute kidney injury. Unexplained muscle pain, weakness, or tenderness should be reported to the prescriber. CK levels may need to be checked.",
    reference: "BNF 85, MOH CPG Dyslipidaemia (sample)"
  },
  {
    id: 7,
    category: "pharmacology",
    question: "Which drug class is used as the first antidote for benzodiazepine overdose?",
    options: [
      "Naloxone",
      "Flumazenil",
      "N-acetylcysteine",
      "Atropine"
    ],
    correctIndex: 1,
    explanation: "Flumazenil is a competitive benzodiazepine antagonist used to reverse benzodiazepine-induced sedation. However, it has a SHORT half-life compared to benzodiazepines, so repeated dosing or infusion may be required. It is CONTRAINDICATED in patients with chronic benzodiazepine dependence due to seizure risk.",
    reference: "BNF 85 (sample)"
  },
  {
    id: 8,
    category: "pharmacology",
    question: "The 'Five Rights' of medication administration include: Right patient, Right drug, Right dose, Right route, and:",
    options: [
      "Right prescriber",
      "Right time",
      "Right ward",
      "Right colour of tablet"
    ],
    correctIndex: 1,
    explanation: "The classic '5 Rights' of medication administration are: Right Patient, Right Drug, Right Dose, Right Route, and Right Time. Some institutions extend this to 7-9 Rights, adding: Right documentation, Right reason, Right response, and Right to refuse.",
    reference: "Fundamentals of Nursing (Potter & Perry, sample)"
  },
  // Fundamentals
  {
    id: 9,
    category: "fundamentals",
    question: "According to Maslow's Hierarchy of Needs, which level of need must be addressed FIRST?",
    options: [
      "Safety and security",
      "Love and belonging",
      "Physiological needs",
      "Self-esteem"
    ],
    correctIndex: 2,
    explanation: "Maslow's Hierarchy of Needs prioritises physiological needs first (air, water, food, shelter, sleep, warmth). In nursing, this means ensuring a patient can breathe, is adequately hydrated, and free from immediate physical distress before addressing higher-level psychosocial needs.",
    reference: "Fundamentals of Nursing (Potter & Perry, sample)"
  },
  {
    id: 10,
    category: "fundamentals",
    question: "When documenting nursing care, which principle is MOST important?",
    options: [
      "Use abbreviations to save time",
      "Document only unusual events",
      "Record care promptly, accurately, and objectively",
      "Use pencil in case corrections are needed"
    ],
    correctIndex: 2,
    explanation: "Nursing documentation must be: timely (as soon as care is delivered), accurate (correct facts), objective (factual, not interpretive), and complete. Never document in pencil. Abbreviations should be standardised. Incomplete documentation can have legal and clinical consequences.",
    reference: "Fundamentals of Nursing (Potter & Perry, sample)"
  },
  {
    id: 11,
    category: "fundamentals",
    question: "A patient expresses anxiety before a procedure. Which nursing response is MOST therapeutic?",
    options: [
      "'Don't worry, everything will be fine.'",
      "'I understand you're anxious. Can you tell me more about your concerns?'",
      "'Other patients don't feel this way about the procedure.'",
      "'Just try to relax — it will be over quickly.'"
    ],
    correctIndex: 1,
    explanation: "Therapeutic communication involves acknowledging the patient's feelings and encouraging them to express themselves. Dismissive responses ('don't worry') close conversation. Comparisons to other patients are inappropriate. Open-ended questions and active listening are foundational therapeutic communication skills.",
    reference: "Fundamentals of Nursing (Potter & Perry, sample)"
  },
  {
    id: 12,
    category: "fundamentals",
    question: "Which position is MOST appropriate for a patient experiencing respiratory distress?",
    options: [
      "Supine (flat)",
      "Left lateral",
      "High Fowler's (60-90°)",
      "Trendelenburg (head down)"
    ],
    correctIndex: 2,
    explanation: "High Fowler's position (60–90° head elevation) maximises lung expansion by reducing pressure of abdominal contents on the diaphragm. It is the standard first-line positioning for patients with dyspnoea or respiratory distress. Trendelenburg is used for shock (except in respiratory compromise).",
    reference: "Fundamentals of Nursing (sample)"
  },
  {
    id: 13,
    category: "fundamentals",
    question: "The nurse notes that a patient's urine output is 200 mL over the past 8 hours. How should this be interpreted?",
    options: [
      "Normal — 200 mL is within acceptable range",
      "Oliguria — urine output is below acceptable minimum",
      "Polyuria — urine output is too high",
      "Anuria — total absence of urine"
    ],
    correctIndex: 1,
    explanation: "Normal urine output is approximately 0.5–1 mL/kg/hour (or >30 mL/hour for an average adult). 200 mL in 8 hours = 25 mL/hour, which is below 30 mL/hour. This constitutes oliguria and should be escalated. Causes include dehydration, acute kidney injury, or haemodynamic compromise.",
    reference: "Fundamentals of Nursing (sample)"
  },
  {
    id: 14,
    category: "fundamentals",
    question: "What does SBAR stand for in clinical communication?",
    options: [
      "Safety, Background, Assessment, Referral",
      "Situation, Background, Assessment, Recommendation",
      "Status, Brief, Action, Response",
      "Symptom, Background, Aim, Report"
    ],
    correctIndex: 1,
    explanation: "SBAR (Situation, Background, Assessment, Recommendation) is a standardised communication framework used during handovers, escalations, and referrals in healthcare. It ensures structured, concise, and clear communication between healthcare providers to reduce miscommunication and improve patient safety.",
    reference: "MOH Malaysia Patient Safety Guidelines (sample), IHI SBAR Tool"
  },
  // Med-Surgical
  {
    id: 15,
    category: "medsurg",
    question: "A post-operative patient's SpO2 is 88% on room air. What is the nurse's PRIORITY action?",
    options: [
      "Document and continue monitoring",
      "Administer supplemental oxygen and escalate to medical team",
      "Encourage the patient to cough",
      "Recheck SpO2 in 30 minutes"
    ],
    correctIndex: 1,
    explanation: "SpO2 below 94% is considered hypoxia and requires prompt intervention. The nurse should: (1) Apply supplemental oxygen, (2) Escalate to the medical team using SBAR, (3) Position patient in Fowler's position, (4) Continuously reassess response. SpO2 of 88% is a medical emergency requiring immediate action.",
    reference: "MOH Malaysia NEWS2 Protocol (sample), BTS Oxygen Therapy Guidelines"
  },
  {
    id: 16,
    category: "medsurg",
    question: "When is it safe to remove a peripheral IV cannula?",
    options: [
      "Only when the doctor orders removal",
      "When signs of phlebitis, infiltration, infection, or when no longer needed",
      "After 24 hours regardless of condition",
      "Only when the site is visibly swollen"
    ],
    correctIndex: 1,
    explanation: "A peripheral IV cannula should be removed when: (1) There are signs of phlebitis (VIP score ≥2), infiltration, or infection, (2) It is no longer clinically indicated, (3) As per hospital policy (usually 72–96 hours), or (4) Patient requests removal. Do not wait for visible complications to develop.",
    reference: "INS Infusion Standards (sample), Hospital IV Policy"
  },
  {
    id: 17,
    category: "medsurg",
    question: "A patient with Type 2 Diabetes has a blood glucose of 2.8 mmol/L and is conscious. What should the nurse do FIRST?",
    options: [
      "Administer IV 50% dextrose immediately",
      "Give 15–20g fast-acting carbohydrate orally (e.g., fruit juice, glucose tablets)",
      "Call doctor before doing anything",
      "Recheck blood glucose in 1 hour"
    ],
    correctIndex: 1,
    explanation: "This is mild-moderate hypoglycaemia (< 4.0 mmol/L) in a conscious patient. The '15-15 Rule' applies: give 15g of fast-acting carbohydrate orally, recheck in 15 minutes. If still < 4 mmol/L, repeat. Once recovered, give a longer-acting carbohydrate snack. IV dextrose is for severe/unconscious hypoglycaemia.",
    reference: "MOH Malaysia CPG Diabetes (sample), Diabetes Malaysia Guidelines"
  },
  {
    id: 18,
    category: "medsurg",
    question: "Which early warning sign indicates possible sepsis in a post-operative patient?",
    options: [
      "Blood pressure 130/80 mmHg",
      "Heart rate 112 bpm, temperature 38.5°C, increased respiratory rate",
      "SpO2 97% on room air",
      "Blood glucose 6.2 mmol/L"
    ],
    correctIndex: 1,
    explanation: "Sepsis warning signs include the SIRS criteria: fever (>38°C or <36°C), tachycardia (>90 bpm), tachypnoea (>20/min), and leucocytosis/leucopenia. The Sepsis 6 (hourly bundle): Give O2, take blood cultures, give IV antibiotics, IV fluids, measure urine output, check lactate. Escalate immediately using SBAR.",
    reference: "Surviving Sepsis Campaign (sample), MOH Sepsis Guidelines"
  },
  {
    id: 19,
    category: "medsurg",
    question: "In a patient with acute MI, which position and intervention is the nurse's immediate priority?",
    options: [
      "Prone, IV access, reassure patient",
      "Semi-recumbent (45°), call for help, attach monitoring, IV access",
      "Flat, wait for doctor, restrict fluids",
      "Left lateral, give oral aspirin only, monitor"
    ],
    correctIndex: 1,
    explanation: "Acute MI management mnemonic: MONA — Morphine (pain relief), Oxygen (if SpO2 < 94%), Nitrate (sublingual GTN if BP allows), Aspirin (300mg loading dose). Position semi-recumbent. Attach cardiac monitor, obtain 12-lead ECG, establish IV access, and escalate immediately. Every minute counts in MI.",
    reference: "MOH Malaysia CPG STEMI (sample), ESC Acute Coronary Syndromes Guidelines"
  },
  {
    id: 20,
    category: "medsurg",
    question: "What is the correct sequence for the Glasgow Coma Scale (GCS) assessment?",
    options: [
      "Eyes, Verbal, Motor (E+V+M)",
      "Motor, Eyes, Verbal (M+E+V)",
      "Verbal, Motor, Pupils (V+M+P)",
      "Consciousness, Response, Movement (C+R+M)"
    ],
    correctIndex: 0,
    explanation: "GCS = Eye opening (E, max 4) + Verbal response (V, max 5) + Motor response (M, max 6). Total = 3–15. Score 13–15: mild, 9–12: moderate, ≤8: severe (typically requires airway protection). Always document each component separately (e.g., E3V4M5 = GCS 12). Report any sudden drop to medical team.",
    reference: "Teasdale & Jennett GCS Scale (sample)"
  },
  // Maternal & Child
  {
    id: 21,
    category: "maternal",
    question: "During the FIRST stage of labour, what is the nurse's priority assessment?",
    options: [
      "Maternal weight and dietary intake",
      "Frequency, duration, and strength of contractions, and foetal heart rate",
      "Social support and birth plan documentation",
      "Temperature and urinalysis only"
    ],
    correctIndex: 1,
    explanation: "During the first stage of labour, the nurse must: (1) Monitor contractions (frequency, duration, strength), (2) Assess foetal heart rate (FHR) via cardiotocography (CTG) or Doppler — normal FHR 110–160 bpm, (3) Cervical dilation progress, (4) Maternal vital signs and wellbeing. Any FHR abnormality requires immediate escalation.",
    reference: "MOH Malaysia Labour Management Guidelines (sample)"
  },
  {
    id: 22,
    category: "maternal",
    question: "What is the APGAR score, and when is it assessed?",
    options: [
      "A tool to assess pain in neonates — at 2 and 5 minutes",
      "A neonatal assessment tool (Appearance, Pulse, Grimace, Activity, Respiration) — at 1 and 5 minutes",
      "A maternal bleeding score — at delivery and 30 minutes",
      "A foetal wellbeing score — at 20 and 40 weeks gestation"
    ],
    correctIndex: 1,
    explanation: "APGAR assesses: Appearance (skin colour), Pulse (heart rate), Grimace (reflex irritability), Activity (muscle tone), Respiration. Each scored 0–2. Total: 7–10 (good), 4–6 (moderate — requires stimulation), 0–3 (poor — requires immediate resuscitation). Assessed at 1 and 5 minutes of life.",
    reference: "MOH Malaysia Newborn Care Guidelines (sample)"
  },
  {
    id: 23,
    category: "maternal",
    question: "What is the recommended exclusive breastfeeding duration according to WHO guidelines?",
    options: [
      "1 month",
      "3 months",
      "6 months",
      "12 months"
    ],
    correctIndex: 2,
    explanation: "WHO recommends exclusive breastfeeding for the first 6 months of life, followed by continued breastfeeding alongside appropriate complementary foods up to 2 years or beyond. Benefits include: passive immunity transfer, optimal nutrition, bonding, reduced SIDS risk, and reduced maternal cancer risk.",
    reference: "WHO Breastfeeding Guidelines (sample), MOH Malaysia BF Policy"
  },
  {
    id: 24,
    category: "maternal",
    question: "A breastfeeding mother asks when the first developmental milestone of 'head control' typically occurs in healthy infants.",
    options: [
      "By 1 month",
      "By 3–4 months",
      "By 9 months",
      "By 12 months"
    ],
    correctIndex: 1,
    explanation: "Developmental milestones (approximate): 3–4 months: head control when pulled to sit. 6 months: sits with support. 9 months: sits independently. 12 months: pulls to stand, first words. These are guides — developmental surveillance should use validated tools. Significant delays require paediatric referral.",
    reference: "Nelson Textbook of Paediatrics (sample)"
  },
  {
    id: 25,
    category: "maternal",
    question: "What is the normal respiratory rate range for a term newborn (0–28 days)?",
    options: [
      "12–20 breaths/minute",
      "20–30 breaths/minute",
      "40–60 breaths/minute",
      "60–80 breaths/minute"
    ],
    correctIndex: 2,
    explanation: "Normal neonatal respiratory rate is 40–60 breaths/minute. Unlike adults, infants are obligate nose breathers and have higher metabolic demands. Tachypnoea (>60/min) suggests respiratory distress. Signs of neonatal respiratory distress: nasal flaring, intercostal/subcostal recession, grunting, cyanosis — require immediate assessment.",
    reference: "MOH Malaysia Newborn Care Guidelines (sample)"
  },
  // Infection Control
  {
    id: 26,
    category: "infection",
    question: "Which type of personal protective equipment (PPE) is required when caring for a patient on droplet precautions?",
    options: [
      "N95 respirator only",
      "Surgical mask, gloves, and apron within 1 metre of patient",
      "Full face shield and gown only",
      "Gloves only for all patient contact"
    ],
    correctIndex: 1,
    explanation: "DROPLET precautions (pathogens >5 microns — e.g., influenza, COVID-19 non-aerosol, bacterial meningitis): surgical mask (within 1m), gloves, apron, eye protection if splash risk. AIRBORNE precautions (< 5 microns — e.g., TB, measles, chickenpox): N95 respirator, negative pressure room, full PPE.",
    reference: "MOH Malaysia IPC Guidelines (sample), WHO Standard Precautions"
  },
  {
    id: 27,
    category: "infection",
    question: "A nurse is inserting a urinary catheter. This procedure requires which level of sterility?",
    options: [
      "Clean technique",
      "Aseptic Non-Touch Technique (ANTT)",
      "Standard hand hygiene only",
      "Surgical sterile technique (scrubbed)"
    ],
    correctIndex: 1,
    explanation: "Urethral catheterisation requires ANTT (Aseptic Non-Touch Technique) — sterile gloves, sterile field, non-touch of key parts. The urinary tract is normally sterile; CAUTI (catheter-associated UTI) is a major preventable HAI. Surgical sterile technique is used for procedures in operating theatres.",
    reference: "MOH Malaysia IPC Policy (sample), NICE Catheter Care Guidelines"
  },
  {
    id: 28,
    category: "infection",
    question: "Healthcare-Associated Infections (HAIs) are MOST effectively prevented by which single intervention?",
    options: [
      "Routine antibiotic prophylaxis",
      "Effective hand hygiene",
      "Wearing gloves for all activities",
      "Daily patient bathing with chlorhexidine"
    ],
    correctIndex: 1,
    explanation: "The single most effective measure to prevent HAIs is hand hygiene — specifically the WHO 6-step technique and Five Moments. Gloves do not replace hand hygiene. Antibiotics contribute to resistance if overused. Hand hygiene compliance audits are a core IPC quality indicator in all hospitals.",
    reference: "WHO Five Moments for Hand Hygiene (sample)"
  },
  {
    id: 29,
    category: "infection",
    question: "When should a nurse change gloves during patient care?",
    options: [
      "After every hour of patient care",
      "Between tasks on the same patient if moving from contaminated to clean site",
      "Gloves can be used throughout an entire shift if undamaged",
      "Only when visibly soiled"
    ],
    correctIndex: 1,
    explanation: "Gloves must be changed: (1) Between patients, (2) Between tasks on the same patient if moving from dirty site to clean site (e.g., perineal care → IV care), (3) When torn or visibly contaminated. Hand hygiene must be performed after removing gloves. Gloves are single-use only.",
    reference: "WHO Standard Precautions (sample), MOH IPC Policy"
  },
  {
    id: 30,
    category: "infection",
    question: "Which isolation room type is required for a patient with confirmed pulmonary tuberculosis (TB)?",
    options: [
      "Contact precaution room (standard side room)",
      "Airborne isolation room (negative pressure room)",
      "Droplet precaution room with curtain",
      "No isolation required if patient is on treatment"
    ],
    correctIndex: 1,
    explanation: "TB is transmitted via the airborne route (droplet nuclei < 5 microns). Requires: NEGATIVE PRESSURE room (air exhausted outside), N95 respirator for all entering, patient to wear surgical mask when outside room. Staff fit-testing for N95 required. Maintain isolation until sputum AFB is negative × 3.",
    reference: "MOH Malaysia TB Control Programme (sample), CDC TB Isolation Guidelines"
  },
  // Calculations
  {
    id: 31,
    category: "calculations",
    question: "A patient weighs 70 kg. The ordered dose is 5 mg/kg of a drug. What total dose should be administered?",
    options: [
      "250 mg",
      "350 mg",
      "175 mg",
      "400 mg"
    ],
    correctIndex: 1,
    explanation: "Dose = Weight × Dose per kg = 70 kg × 5 mg/kg = 350 mg. Always double-check weight-based calculations. For paediatric patients, weight should be measured on the day of dosing. Round to a practical dose as per product guidance. Always have a second nurse verify high-risk dose calculations.",
    reference: "Drug Calculation for Nurses (Hutton, sample)"
  },
  {
    id: 32,
    category: "calculations",
    question: "An IV infusion of 500 mL is ordered over 4 hours using a standard giving set (20 drops/mL). What is the correct drip rate?",
    options: [
      "25 drops/min",
      "42 drops/min",
      "60 drops/min",
      "35 drops/min"
    ],
    correctIndex: 1,
    explanation: "Formula: Drip rate = (Volume × Drop factor) ÷ Time (in minutes) = (500 × 20) ÷ (4 × 60) = 10,000 ÷ 240 = 41.67 ≈ 42 drops/min. Always use the correct drop factor for the giving set: Standard = 20 drops/mL; Blood set = 15 drops/mL; Microdrip = 60 drops/mL. Double-check calculation before setting.",
    reference: "Drug Calculation for Nurses (sample)"
  },
  {
    id: 33,
    category: "calculations",
    question: "A patient's 24-hour fluid intake is 2400 mL and output is 1800 mL. What is the fluid balance?",
    options: [
      "-600 mL (negative balance)",
      "+600 mL (positive balance)",
      "0 mL (neutral balance)",
      "-1200 mL (negative balance)"
    ],
    correctIndex: 1,
    explanation: "Fluid balance = Intake − Output = 2400 − 1800 = +600 mL (positive balance). A significantly positive balance may indicate fluid overload (oedema, heart failure risk). A negative balance may indicate dehydration. Accurate fluid balance charting includes: IV fluids, oral intake, urine, drains, stool, vomit, and insensible losses.",
    reference: "Fundamentals of Nursing (sample)"
  },
  {
    id: 34,
    category: "calculations",
    question: "A child weighs 20 kg. The safe dose range of a drug is 10–15 mg/kg/day in 3 divided doses. What is the correct dose per administration?",
    options: [
      "50–75 mg per dose",
      "200–300 mg per dose",
      "66–100 mg per dose",
      "150–200 mg per dose"
    ],
    correctIndex: 2,
    explanation: "Total daily dose = Weight × dose range = 20 kg × (10–15 mg/kg) = 200–300 mg/day. Per dose (TDS) = Total daily ÷ 3 = 200÷3 to 300÷3 = 66.7–100 mg per dose. Always verify paediatric doses with a pharmacist, BNFc, or paediatric formulary. Never round up beyond the maximum dose.",
    reference: "BNFc (sample), Paediatric Drug Calculations"
  },
  {
    id: 35,
    category: "calculations",
    question: "BMI is calculated as: weight (kg) ÷ height (m)². A patient weighs 80 kg and is 1.6 m tall. What is their BMI?",
    options: [
      "25 kg/m²",
      "31.25 kg/m²",
      "40 kg/m²",
      "20 kg/m²"
    ],
    correctIndex: 1,
    explanation: "BMI = 80 ÷ (1.6 × 1.6) = 80 ÷ 2.56 = 31.25 kg/m². Classification: <18.5 = Underweight, 18.5–24.9 = Normal, 25–29.9 = Overweight, 30–34.9 = Obese Class I, 35–39.9 = Obese Class II, ≥40 = Morbidly Obese. For Asian populations, overweight threshold is often ≥23 kg/m².",
    reference: "WHO BMI Classification (sample)"
  }
];