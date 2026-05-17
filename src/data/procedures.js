export const procedures = [
  {
    id: 1,
    title: "Blood Pressure Measurement",
    category: "Vital Signs",
    overview: "Non-invasive measurement of arterial blood pressure using a sphygmomanometer and stethoscope or automated device.",
    indications: "Routine vital sign monitoring. Hypertension assessment. Pre/post-medication administration. Perioperative monitoring.",
    equipment: ["Sphygmomanometer (aneroid/mercury/automated)", "Appropriate cuff size", "Stethoscope", "Alcohol swab", "Documentation chart"],
    steps: [
      "Explain procedure to patient. Ensure informed consent.",
      "Position patient seated or supine. Rest for 5 minutes before measurement.",
      "Select appropriate cuff size (cuff should cover 80% of upper arm circumference).",
      "Apply cuff 2–3 cm above antecubital fossa. Palpate brachial artery.",
      "Inflate cuff to 30 mmHg above estimated systolic pressure.",
      "Deflate at 2–3 mmHg/second. Note Korotkoff sounds (Phase I = systolic, Phase V = diastolic).",
      "Record reading, arm used, position, and time.",
      "Repeat after 1–2 minutes if abnormal or clinically indicated."
    ],
    precautions: "Never take BP on arm with IV line, mastectomy, AV fistula, or lymphoedema. Avoid white coat hypertension bias. Ensure patient is relaxed.",
    documentation: "Record: date, time, systolic/diastolic (mmHg), arm used, patient position, and any relevant notes.",
    references: "MOH Malaysia Nursing Practice Guidelines (sample). JNC 8 Guidelines.",
    savedByUser: false,
    isFeatured: true
  },
  {
    id: 2,
    title: "IV Cannulation",
    category: "Medication Administration",
    overview: "Insertion of a peripheral intravenous cannula for administration of fluids, medications, or blood products.",
    indications: "IV fluid therapy, IV drug administration, blood sampling, blood transfusion.",
    equipment: ["IV cannula (appropriate gauge)", "Tourniquet", "Alcohol swab/chlorhexidine", "Transparent dressing", "Extension set", "Flush syringe (0.9% NaCl)", "Gloves", "Sharps bin"],
    steps: [
      "Perform hand hygiene. Don non-sterile gloves.",
      "Explain procedure, obtain informed consent.",
      "Select vein (antecubital, forearm, dorsum of hand). Apply tourniquet 10–15 cm above site.",
      "Cleanse site with chlorhexidine/alcohol swab using circular outward motion. Allow to dry.",
      "Anchor vein with non-dominant hand. Insert cannula bevel-up at 15–30° angle.",
      "Observe flashback in chamber. Advance slightly, then advance catheter off needle.",
      "Release tourniquet. Remove needle. Connect extension set.",
      "Flush with 2–5 mL 0.9% NaCl to confirm patency.",
      "Apply transparent dressing. Label with date, time, gauge.",
      "Dispose of sharps immediately. Document."
    ],
    precautions: "Avoid areas of infection, bruising, or phlebitis. Never recap needle. Assess and document VIP score. Change cannula every 72–96 hours or as per hospital policy.",
    documentation: "Record: date/time inserted, gauge, site, who inserted, flush used, VIP score, next scheduled change.",
    references: "INS Infusion Therapy Standards of Practice (sample). Hospital Policy Reference.",
    savedByUser: false,
    isFeatured: false
  },
  {
    id: 3,
    title: "Hand Hygiene (WHO 6-Step)",
    category: "Infection Control",
    overview: "The WHO 6-step hand hygiene technique is the global standard for effective decontamination of hands to prevent healthcare-associated infections.",
    indications: "Before and after patient contact. Before aseptic procedures. After body fluid exposure. After touching patient surroundings. Before donning gloves.",
    equipment: ["Alcohol-based hand rub (ABHR) or soap and water", "Paper towels (if using soap and water)"],
    steps: [
      "Apply palmful of ABHR (or lather with soap and water).",
      "Step 1 – Palm to palm: Rub palms together.",
      "Step 2 – Interlaced fingers: Right palm over left dorsum, fingers interlaced. Repeat.",
      "Step 3 – Interlocked fingers: Palm to palm, fingers interlaced.",
      "Step 4 – Rotational rubbing: Backs of fingers on opposing palms.",
      "Step 5 – Rotational thumbs: Rotational rubbing of right thumb in left palm. Repeat.",
      "Step 6 – Fingertips: Rotational rubbing of fingertips in opposite palm.",
      "Allow hands to dry. Duration: 20–30 seconds (ABHR), 40–60 seconds (soap and water)."
    ],
    precautions: "Soap and water required when hands visibly soiled or after C. difficile contact. Keep nails short. Remove rings and wrist accessories.",
    documentation: "Document hand hygiene compliance as per ward audit protocol.",
    references: "WHO Five Moments for Hand Hygiene (sample). MOH Malaysia IPC Policy.",
    savedByUser: true,
    isFeatured: false
  },
  {
    id: 4,
    title: "Wound Dressing (Simple)",
    category: "Wound Care",
    overview: "Assessment and re-dressing of a simple wound using aseptic non-touch technique (ANTT) to promote healing and prevent infection.",
    indications: "Post-surgical wounds, traumatic lacerations, pressure injuries (Stage 1–2), chronic non-infected wounds.",
    equipment: ["Dressing trolley", "Sterile dressing pack", "Appropriate dressing material", "Irrigation solution (0.9% NaCl)", "Gloves (non-sterile + sterile)", "Tape/adhesive dressing", "Disposable apron", "Waste bag"],
    steps: [
      "Explain procedure. Ensure privacy and comfort.",
      "Perform hand hygiene. Prepare dressing trolley using ANTT.",
      "Don non-sterile gloves. Remove old dressing carefully.",
      "Assess wound: size, edges, exudate, odour, signs of infection.",
      "Remove non-sterile gloves. Perform hand hygiene. Don sterile gloves.",
      "Irrigate wound with 0.9% NaCl if indicated.",
      "Apply appropriate dressing. Secure with tape.",
      "Dispose of waste in clinical waste bag.",
      "Remove gloves and apron. Perform hand hygiene.",
      "Document wound assessment and dressing used."
    ],
    precautions: "Strict ANTT throughout. Do not touch key parts of dressing. Report signs of infection (erythema, swelling, purulent discharge, fever). ",
    documentation: "Record: wound assessment, dressing type used, date of next change, any concerns escalated.",
    references: "MOH Malaysia Wound Care Guidelines (sample). NICE Wound Management.",
    savedByUser: false,
    isFeatured: false
  },
  {
    id: 5,
    title: "Patient Fall Prevention",
    category: "Patient Safety",
    overview: "Systematic assessment and interventions to prevent patient falls in hospital settings.",
    indications: "All admitted patients. High-risk patients: elderly, post-sedation, mobility impairment, confusion, polypharmacy.",
    equipment: ["Morse Fall Scale assessment form", "Non-slip footwear (patient)", "Call bell", "Bed rail (as appropriate)", "Falls risk armband/sign"],
    steps: [
      "Conduct Morse Fall Scale assessment on admission and with each status change.",
      "Communicate risk level to patient and family.",
      "Ensure call bell within reach at all times.",
      "Keep bed at lowest position with brakes locked.",
      "Ensure lighting is adequate (especially at night).",
      "Provide non-slip footwear.",
      "Place frequently needed items within reach.",
      "For high-risk patients: apply yellow wristband, bed exit alarm.",
      "Educate patient and family on fall prevention.",
      "Document all interventions and reassess regularly."
    ],
    precautions: "Never leave high-risk patients unattended when mobilising. Use 2-person assist for very high-risk patients. Report all falls immediately.",
    documentation: "Morse Fall Scale score. Interventions implemented. Falls incident report if fall occurs.",
    references: "MOH Malaysia Patient Safety Goals (sample). JCI Fall Prevention Standards.",
    savedByUser: false,
    isFeatured: true
  },
  {
    id: 6,
    title: "Basic Life Support (BLS) — Adult",
    category: "Emergency Basics",
    overview: "A systematic approach to recognising and responding to cardiac arrest in adults. Focuses on high-quality CPR and early defibrillation.",
    indications: "Unresponsive patient with absent or abnormal breathing. Suspected cardiac arrest.",
    equipment: ["Gloves", "Pocket mask / BVM", "AED (if available)", "Call system"],
    steps: [
      "SAFETY: Ensure scene is safe for rescuer.",
      "RESPONSE: Tap shoulders, shout 'Are you okay?'",
      "CALL FOR HELP: Shout for help. Call 999/hospital emergency code. Send someone for AED.",
      "AIRWAY: Head-tilt chin-lift (jaw thrust if trauma).",
      "BREATHING: Look, listen, feel for breathing (max 10 seconds). Absent/abnormal = cardiac arrest.",
      "CIRCULATION: Start chest compressions: centre of chest, 5–6 cm depth, 100–120/min.",
      "30:2 RATIO: 30 compressions : 2 rescue breaths. Minimise interruptions.",
      "AED: Attach as soon as available. Follow prompts. Resume CPR immediately after shock.",
      "Continue until: ROSC, trained help takes over, or patient confirmed deceased."
    ],
    precautions: "High-quality CPR is priority. Allow full chest recoil. Minimise interruptions < 10 seconds. Rotate compressors every 2 minutes.",
    documentation: "Record: time of collapse, time CPR started, no. of shocks, medications given, ROSC achieved.",
    references: "AHA/ILCOR BLS Guidelines 2020 (sample). MOH Malaysia BLS Protocol.",
    savedByUser: false,
    isFeatured: false
  }
];

export const procedureCategories = ["All", "Vital Signs", "Medication Administration", "Infection Control", "Wound Care", "Patient Safety", "Emergency Basics"];