import { useState } from "react";

const PHASES = [
  { name: "Foundation", weeks: [1,2,3,4], color: "#4A90D9", accent: "#7BB3E8", desc: "Build movement patterns & base conditioning" },
  { name: "Development", weeks: [5,6,7,8], color: "#E8743B", accent: "#F0A070", desc: "Increase intensity & volume" },
  { name: "Peak", weeks: [9,10,11,12], color: "#C0392B", accent: "#E05A4A", desc: "Max effort & performance testing" },
];

const getPhase = (week) => PHASES.find(p => p.weeks.includes(week));

// Strength day templates by phase
const STRENGTH_TEMPLATES = {
  // Day A = Lower Power, Day B = Upper Push, Day C = Lower Hypertrophy, Day D = Upper Pull
  foundation: {
    A: {
      label: "Lower — Power Focus",
      exercises: [
        { name: "Power Clean", sets: 4, reps: "3", notes: "Start light — focus on form. Drop from power position." },
        { name: "Back Squat", sets: 4, reps: "6", notes: "Controlled descent (3s), explosive drive up." },
        { name: "Romanian Deadlift", sets: 3, reps: "8", notes: "Hip hinge, soft knee bend, bar drags the shins." },
        { name: "Walking Lunge", sets: 3, reps: "10 each", notes: "Dumbbell loaded. Upright torso." },
        { name: "Standing Calf Raise", sets: 3, reps: "15", notes: "Full ROM, pause at top." },
        { name: "Plank", sets: 3, reps: "45s", notes: "Neutral spine. Squeeze glutes." },
      ]
    },
    B: {
      label: "Upper — Push Focus",
      exercises: [
        { name: "Barbell Bench Press", sets: 4, reps: "6", notes: "Retract scapula, bar to sternum, controlled." },
        { name: "Overhead Press (OHP)", sets: 4, reps: "6", notes: "Brace core, press vertical, lock out overhead." },
        { name: "Incline Dumbbell Press", sets: 3, reps: "10", notes: "30-45° incline, elbows at 45° to torso." },
        { name: "Tricep Pushdown (Cable)", sets: 3, reps: "12", notes: "Elbows pinned, full extension." },
        { name: "EZ-Bar Skull Crusher", sets: 3, reps: "10", notes: "Lower to forehead, extend fully." },
      ]
    },
    C: {
      label: "Lower — Hypertrophy",
      exercises: [
        { name: "Conventional Deadlift", sets: 4, reps: "5", notes: "Brace hard, bar over mid-foot. Hinge, don't squat." },
        { name: "Front Squat", sets: 3, reps: "8", notes: "Elbows high, upright torso. Clean grip or cross-arm." },
        { name: "Bulgarian Split Squat", sets: 3, reps: "10 each", notes: "Rear foot elevated. Knee tracking over toes." },
        { name: "Leg Curl (Machine)", sets: 3, reps: "12", notes: "Controlled eccentric — 3 seconds down." },
        { name: "Hip Thrust (Barbell)", sets: 3, reps: "12", notes: "Drive through heels, full hip extension at top." },
        { name: "Ab Wheel Rollout", sets: 3, reps: "10", notes: "Slow rollout, engage core before returning." },
      ]
    },
    D: {
      label: "Upper — Pull Focus",
      exercises: [
        { name: "Barbell Row (Pendlay)", sets: 4, reps: "6", notes: "Bar from floor each rep, horizontal torso, explode up." },
        { name: "Pull-Up / Weighted Pull-Up", sets: 4, reps: "6-8", notes: "Full dead hang start. Add weight when 8 reps easy." },
        { name: "Seated Cable Row", sets: 3, reps: "10", notes: "Drive elbows back, pause at chest." },
        { name: "Barbell Curl", sets: 3, reps: "10", notes: "No body swing. Supinate fully at top." },
        { name: "Hammer Curl", sets: 3, reps: "12", notes: "Neutral grip, slow eccentric." },
        { name: "Face Pull (Cable)", sets: 3, reps: "15", notes: "External rotation at end range. Rear delt focus." },
        { name: "Dumbbell Lateral Raise", sets: 3, reps: "12", notes: "Slight forward lean, lead with elbows. Pairs with face pulls for complete shoulder health." },
      ]
    },
  },
  development: {
    A: {
      label: "Lower — Power Focus",
      exercises: [
        { name: "Power Clean", sets: 5, reps: "3", notes: "Add 5–10 lbs from Phase 1. Crisp pull, fast elbows." },
        { name: "Back Squat", sets: 5, reps: "5", notes: "10 lbs heavier than Phase 1 best. Brace hard." },
        { name: "Romanian Deadlift", sets: 4, reps: "8", notes: "Heavier loading. Stretch hamstrings fully." },
        { name: "Lateral Lunge", sets: 3, reps: "10 each", notes: "Push hips back, stay low, adductor stretch." },
        { name: "Seated Calf Raise", sets: 4, reps: "15", notes: "Targets soleus. Long pause at bottom." },
        { name: "Hanging Leg Raise", sets: 3, reps: "12", notes: "No swing. Tuck knees, then progress to straight leg." },
      ]
    },
    B: {
      label: "Upper — Push Focus",
      exercises: [
        { name: "Barbell Bench Press", sets: 5, reps: "5", notes: "5 lbs heavier than Phase 1." },
        { name: "Push Press", sets: 4, reps: "5", notes: "Leg drive to initiate, lock out overhead. More load than strict OHP." },
        { name: "Cable Chest Fly", sets: 3, reps: "12", notes: "Slight bend in elbow, wide arc, squeeze at center." },
        { name: "Arnold Press", sets: 3, reps: "10", notes: "Rotate palms throughout motion. Full ROM." },
        { name: "Close-Grip Bench Press", sets: 3, reps: "10", notes: "Elbows in, tricep emphasis." },
        { name: "Overhead Tricep Extension", sets: 3, reps: "12", notes: "Dumbbell or EZ bar. Keep elbows close." },
      ]
    },
    C: {
      label: "Lower — Hypertrophy",
      exercises: [
        { name: "Deadlift (Heavy)", sets: 5, reps: "4", notes: "Working toward Phase 3 max. Chalk up." },
        { name: "Pause Squat", sets: 3, reps: "6", notes: "2-second pause in hole. No bounce." },
        { name: "Single-Leg RDL", sets: 3, reps: "10 each", notes: "Dumbbell, balance focus, hinge deep." },
        { name: "Leg Press", sets: 4, reps: "12", notes: "High foot placement for posterior chain." },
        { name: "Nordic Hamstring Curl", sets: 3, reps: "6-8", notes: "Anchor feet. Lower slowly, push up with hands." },
        { name: "Cable Crunch", sets: 3, reps: "15", notes: "Round spine, elbows to knees." },
      ]
    },
    D: {
      label: "Upper — Pull Focus",
      exercises: [
        { name: "Barbell Row", sets: 5, reps: "5", notes: "5–10 lbs heavier than Phase 1." },
        { name: "Weighted Pull-Up", sets: 4, reps: "5-6", notes: "Add 10–25 lbs via belt." },
        { name: "Single-Arm Dumbbell Row", sets: 3, reps: "10 each", notes: "Brace on bench, full stretch at bottom." },
        { name: "Incline Dumbbell Curl", sets: 3, reps: "10", notes: "Full stretch at bottom, excellent bicep activation." },
        { name: "Reverse Curl", sets: 3, reps: "12", notes: "Overhand grip, brachialis and brachioradialis." },
        { name: "Rear Delt Fly", sets: 3, reps: "15", notes: "Dumbbell or cable, lead with elbows wide." },
        { name: "Dumbbell Lateral Raise", sets: 3, reps: "12", notes: "Fresh deltoids here — go heavier than Phase 1. Lead with elbows, slight forward lean." },
      ]
    },
  },
  peak: {
    A: {
      label: "Lower — Max Power",
      exercises: [
        { name: "Power Clean", sets: 5, reps: "2", notes: "Max effort singles/doubles. Reset each rep." },
        { name: "Back Squat", sets: 5, reps: "3", notes: "Working toward 3RM. 90% effort each set." },
        { name: "Romanian Deadlift", sets: 4, reps: "6", notes: "Heavy. 4-second eccentric." },
        { name: "Jump Squat (Bodyweight)", sets: 3, reps: "8", notes: "Max height, soft landing. Activate CNS." },
        { name: "Standing Calf Raise (Heavy)", sets: 4, reps: "12", notes: "Add load progressively." },
        { name: "L-Sit Hold", sets: 3, reps: "20s", notes: "Parallel bars or rings. Progress from tuck." },
      ]
    },
    B: {
      label: "Upper — Max Push",
      exercises: [
        { name: "Barbell Bench Press", sets: 5, reps: "3", notes: "Working toward 3RM. Full warm-up. Spot up." },
        { name: "Push Press (Heavy)", sets: 4, reps: "3", notes: "Max load. Solid brace." },
        { name: "Weighted Dip", sets: 3, reps: "8", notes: "Add weight. Forward lean for chest, upright for tris." },
        { name: "Landmine Press", sets: 3, reps: "8 each", notes: "Unilateral shoulder stability and strength." },
        { name: "Tricep Pushdown (Heavy Drop Set)", sets: 3, reps: "8+8", notes: "Heavy 8, drop 30%, burn out 8 more." },
      ]
    },
    C: {
      label: "Lower — Max Posterior",
      exercises: [
        { name: "Deadlift (Max Effort)", sets: 5, reps: "2-3", notes: "Working toward 1-3RM. Perfect setup every time." },
        { name: "Tempo Squat (4-0-1)", sets: 3, reps: "5", notes: "4s down, no pause, 1s up. Loaded." },
        { name: "Glute-Ham Raise", sets: 3, reps: "8", notes: "Loaded if possible. Powerful hip extension." },
        { name: "Trap Bar Deadlift", sets: 3, reps: "6", notes: "Variation for quad/posterior mix." },
        { name: "Leg Curl (Heavy)", sets: 4, reps: "8", notes: "2-second pause at peak contraction." },
        { name: "Dragon Flag", sets: 3, reps: "6", notes: "Controlled negative. Full body tension." },
      ]
    },
    D: {
      label: "Upper — Max Pull",
      exercises: [
        { name: "Barbell Row (Heavy)", sets: 5, reps: "4", notes: "Heaviest of the program. Controlled, no bounce." },
        { name: "Weighted Pull-Up (3RM attempt)", sets: 4, reps: "3-4", notes: "Max added load." },
        { name: "Chest-Supported Row", sets: 3, reps: "10", notes: "Strict form. Full stretch and contraction." },
        { name: "EZ-Bar Curl (Heavy)", sets: 4, reps: "6", notes: "Heavier than previous phases." },
        { name: "Zottman Curl", sets: 3, reps: "10", notes: "Curl up supinated, rotate to pronated on descent." },
        { name: "Cable Lateral Raise", sets: 3, reps: "15", notes: "Constant tension on delts. Superset with Band Pull-Apart for a complete shoulder finisher." },
        { name: "Band Pull-Apart", sets: 4, reps: "20", notes: "Shoulder health. Fast reps, arms straight." },
      ]
    },
  }
};

const MOBILITY_SESSIONS = [
  {
    label: "Full Body Flow",
    duration: "45–60 min",
    focus: "Global mobility reset",
    routine: [
      {
        name: "Diaphragmatic Breathing",
        duration: "3 min",
        whyItMatters: "Most people breathe shallowly into their chest all week, especially under load. Diaphragmatic breathing resets your nervous system from sympathetic (fight-or-flight) to parasympathetic (rest and recover). It's the single best way to start a mobility session.",
        howTo: "Lie flat on your back, knees bent, feet flat on the floor. Place one hand on your chest and one on your belly. Inhale slowly through your nose for 4 seconds — your belly hand should rise while your chest hand stays mostly still. Exhale slowly through your mouth for 6 seconds. If your chest rises first, you're chest-breathing. Focus on pushing the belly out like you're inflating a balloon.",
        feel: "You should feel your lower back relax into the floor more with each exhale. If you feel lightheaded, slow down — you may be over-breathing."
      },
      {
        name: "Thoracic Foam Roll",
        duration: "3 min",
        whyItMatters: "Your thoracic spine (mid and upper back) gets compressed and rounded from lifting, sitting, and cycling. Tight T-spine kills your bench press lockout, your overhead press, and your ability to stay upright in a squat. This is one of the highest-ROI things you can do before or after training.",
        howTo: "Place the foam roller horizontally across your mid-back (just below your shoulder blades). Cross your arms over your chest or interlace your hands behind your head. Let your weight sink over the roller for 5–10 seconds at each position. Then shift the roller slightly up toward your neck and repeat. Work from the bottom of your shoulder blades up to the base of your neck — about 4–5 positions total. Never roll your lower back (lumbar spine). That area needs stability, not mobility.",
        feel: "You'll likely hear or feel small pops — that's normal and fine. You're looking for a gentle extension, not a cracking contest. Sore spots mean tight spots; slow down there."
      },
      {
        name: "Hip 90/90 Stretch",
        duration: "2 min each side",
        whyItMatters: "The 90/90 position is arguably the most important hip stretch for anyone doing squats, deadlifts, and power cleans. It simultaneously works hip external rotation (the front leg) and internal rotation (the rear leg) — two ranges of motion that are almost always limited in lifters.",
        howTo: "Sit on the floor and position both legs at 90-degree angles — front leg with the shin parallel to your body in front of you, rear leg with the shin pointing behind you. Both knees are bent at 90°. Sit as tall as possible. You can use your hands on the floor for balance at first. Slowly hinge forward over your front shin, keeping your chest up. Hold for 30 seconds, then sit back up. After the forward lean, try rotating your torso to face your rear leg and repeat. Switch sides.",
        feel: "You'll feel a deep stretch in the outer hip and glute of your front leg. It may feel awkward or slightly uncomfortable — that's normal. It should not be sharp or painful. Many people can barely get into the position at first; that's okay."
      },
      {
        name: "World's Greatest Stretch",
        duration: "8 reps each side",
        whyItMatters: "This is called the world's greatest stretch for good reason — it hits hip flexors, hamstrings, thoracic rotation, and shoulder mobility all in one flowing movement. It's essentially a full-body primer in a single exercise.",
        howTo: "Start in a push-up position. Step your right foot forward to the outside of your right hand so you're in a low lunge. Your left leg stays extended behind you. From here: (1) Drop your right elbow to the floor beside your right foot and hold 2 seconds. (2) Push back up and rotate your right arm up toward the ceiling, following your hand with your eyes and rotating through your thoracic spine. (3) Return to push-up position and repeat on the other side. Move slowly and breathe through each position.",
        feel: "You'll feel a stretch through your hip flexor (rear leg), inner groin (front leg), and upper back (rotation). This is dynamic — don't rush it, but don't freeze in each position either."
      },
      {
        name: "Downward Dog → Cobra Flow",
        duration: "10 slow reps",
        whyItMatters: "This two-position flow decompresses the entire spine — Downward Dog stretches the posterior chain (hamstrings, calves, lats, and lower back), while Cobra extends the lumbar spine and opens the hip flexors and chest. Together they create a full spinal wave.",
        howTo: "Start on hands and knees. Push your hips up and back into Downward Dog — hips high, heels reaching toward the floor, arms straight, head between your arms. Pedal your feet a few times (alternately bending each knee) to warm the calves. Then slowly lower your hips toward the floor into Cobra — let your hips sink, press your hands into the floor, and lift your chest. Keep your elbows slightly soft (not fully locked). Look slightly forward or up. Hold each end position for 2–3 seconds before flowing to the other.",
        feel: "Downward Dog: stretch behind the knees and through the armpits. Cobra: stretch across the front of your hips and belly. Your lower back will feel extension — this is good, but back off if you feel any sharp discomfort."
      },
      {
        name: "Pigeon Pose",
        duration: "2 min each side",
        whyItMatters: "Pigeon Pose is the gold standard for opening the piriformis and deep external rotators of the hip — the muscles that get brutally tight from heavy squatting, deadlifting, and sitting. Tight piriformis is also a common contributor to sciatic nerve irritation.",
        howTo: "From Downward Dog (or all fours), bring your right knee forward and place it behind your right wrist. Your right foot comes toward your left wrist — the more parallel your shin is to the front of your mat, the more intense the stretch (beginners: let the foot come close to your hip). Extend your left leg straight back. Slowly lower your hips toward the floor. You can stay upright on your hands or fold your upper body forward onto your forearms or the floor. Hold completely still. Breathe. After 2 minutes, switch sides.",
        feel: "Deep ache in the outer hip/glute of the bent front leg. This one can be intense. Don't force it — gravity does the work over time. Never push into sharp or shooting pain."
      },
      {
        name: "Standing Hamstring Flow",
        duration: "5 reps each side",
        whyItMatters: "Tight hamstrings are the enemy of good deadlift form and squat depth. This dynamic flow (not a static hold) teaches your nervous system that hamstring length is safe to use, which is important — your body often isn't limited by muscle length, but by the nervous system's willingness to let you go there.",
        howTo: "Stand tall. Extend one leg forward, resting your heel on a low surface (step, bench, or just the floor). Keep that leg straight. Hinge forward from your hips — not your waist — keeping your lower back flat. Reach your hands toward your toes. Hold the bottom position for 5 seconds, feeling the stretch behind your knee and up into your glute. Slowly return upright. Repeat 5 times per side before switching.",
        feel: "Pull behind the knee and in the lower belly of the hamstring. If you feel it more in your lower back than your leg, you're rounding — reset and hinge from the hips."
      },
      {
        name: "Ankle Circles + Calf Stretch",
        duration: "2 min total",
        whyItMatters: "Ankle mobility is one of the most overlooked limiters in squatting. If your ankles can't dorsiflex (toes toward shin), your heels come up in the squat, your knees cave, and your lower back rounds. Cyclists also accumulate enormous calf tightness from the repetitive pedaling motion.",
        howTo: "Ankle Circles: Stand on one foot (hold a wall if needed). Lift the other foot slightly and slowly draw large circles with your toes — 10 clockwise, 10 counterclockwise. Switch feet. Calf Stretch: Face a wall, step one foot back about 2–3 feet. Keep the back heel flat on the floor and press the back knee straight. Lean your body toward the wall. Hold 30 seconds (this hits the gastrocnemius — the big upper calf muscle). Then slightly bend the back knee and hold another 30 seconds (this hits the soleus — the deeper lower calf). Switch sides.",
        feel: "Circles: gentle mobilization. Calf stretch: significant pull up the back of the lower leg. The bent-knee version is often tighter and more important for squatters."
      },
      {
        name: "Child's Pose + Lat Stretch",
        duration: "2 min",
        whyItMatters: "Child's Pose decompresses the lumbar spine after a hard week of loading. Adding the lateral reach turns it into a lat stretch — the lats (latissimus dorsi) connect from your upper arm all the way to your lower back and pelvis, so tight lats can actually restrict your squat and overhead press simultaneously.",
        howTo: "Kneel on the floor and sit your hips back toward your heels. Extend both arms forward on the floor, forehead down. Breathe and let your lower back widen and relax. After 30 seconds, walk both hands to the right and hold — you'll feel the left side of your torso and armpit open up. Breathe 5 deep breaths into that left side. Walk hands back to center, then to the left. Return to center to finish.",
        feel: "Lower back release in center position. A pulling stretch through the side of your ribcage and armpit in the lateral position."
      },
    ]
  },
  {
    label: "Lower Body Deep Work",
    duration: "45–60 min",
    focus: "Hips, hamstrings, adductors, ankles",
    routine: [
      {
        name: "Supine Hip Flexor Stretch",
        duration: "2 min each side",
        whyItMatters: "The hip flexors (primarily the iliopsoas) run from your lumbar vertebrae through your pelvis and attach to your femur. When they're chronically tight — from sitting, cycling, and heavy squatting — they pull your pelvis into an anterior tilt, compressing your lower back and limiting your squat depth. This is the most basic hip flexor release.",
        howTo: "Lie flat on your back on the floor. Pull your right knee to your chest with both hands, keeping your left leg extended fully on the floor. The key is the extended leg — that's the hip flexor getting stretched. Press the back of your left knee into the floor as hard as you can while pulling the right knee in. Hold for 2 minutes. You should feel the stretch deep in the front of your left hip, not in your lower back.",
        feel: "A deep pull at the crease of the hip on the extended leg side. If you feel it in your lower back, tuck your pelvis slightly (flatten your lower back against the floor)."
      },
      {
        name: "Couch Stretch",
        duration: "2 min each side",
        whyItMatters: "This is the most effective hip flexor and quad stretch in existence, and it's particularly important for cyclists. Your rectus femoris (one of your four quad muscles) crosses both the knee and the hip — meaning regular quad stretches that only bend the knee don't fully stretch it. The Couch Stretch does both simultaneously.",
        howTo: "Face away from a wall or couch. Kneel and place your right shin vertically up the wall behind you (toes pointing up, knee on the floor right at the base of the wall). Bring your left foot forward into a lunge position. Your right knee should be at the base of the wall and your right shin flat against it. Now, slowly squeeze your right glute and tuck your pelvis under (posteriorly tilt). You should feel an intense stretch in the front of your right hip and thigh. Beginners: stay in the lunge, hands on the floor. Advanced: bring your torso upright. Hold 2 minutes.",
        feel: "Intense pull through the front of the thigh and into the hip. This is one of the most uncomfortable stretches in the program — that's usually a sign you need it most."
      },
      {
        name: "Deep Squat Hold",
        duration: "3 min total",
        whyItMatters: "The deep squat is a fundamental human resting position that most Western adults have lost. Holding it builds ankle dorsiflexion, hip external rotation, and groin length simultaneously — all of which directly improve your back squat and clean. Time spent in the bottom of a squat is essentially free squat training.",
        howTo: "Stand with feet shoulder-width apart, toes turned out about 30 degrees. Lower yourself into the bottom of a squat as deep as you can go. If your heels come off the floor, place a small weight plate or folded towel under them for now. Hold onto a doorframe or squat rack upright with both hands if needed. Once in position, use your elbows to gently push your knees outward. Try to sit as tall as possible — chest up, not hunched over. Breathe and hold for the full 3 minutes. It doesn't have to be continuous; stand if you need a break.",
        feel: "Stretch in the groin, hips, ankles, and lower back. Your body may fight this position at first. That's exactly why you're doing it."
      },
      {
        name: "Frog Stretch",
        duration: "2 min",
        whyItMatters: "The adductors (inner thigh/groin muscles) are chronically tight in powerlifters and anyone who does heavy squatting. Tight adductors limit squat depth and cause knees to cave inward under load. The frog stretch is one of the best adductor openers available.",
        howTo: "Start on hands and knees on a mat. Walk your knees out as wide as is comfortable, keeping your feet in line with your knees (ankles turned outward to match). Lower your forearms to the floor in front of you. Your feet should be flexed (not pointed). Now slowly shift your hips back toward your heels, feeling the inner thighs stretch. You can gently rock forward and back to explore the range. Stay for the full 2 minutes.",
        feel: "A wide, spreading stretch through the inner thighs and groin. Go to the point of significant but tolerable discomfort — not pain. If your hips won't go low, put a folded blanket under your chest."
      },
      {
        name: "Seated Forward Fold",
        duration: "2 min",
        whyItMatters: "Tight hamstrings restrict your ability to hinge from the hip with a neutral spine — which is the foundation of every deadlift and RDL you'll ever do. This stretch also decompresses the lumbar spine and stretches the entire posterior chain from calves to lower back.",
        howTo: "Sit on the floor with both legs extended straight in front of you, feet together. Sit up as tall as possible — do not let your lower back round just to sit. Flex your feet (toes toward you). Now hinge forward from your hips — imagine trying to bring your belly button to your thighs, not your forehead to your knees. Keep your spine as long as possible. Reach your hands toward your feet but don't force it. Hold where you feel the stretch. If your hamstrings are very tight, place a folded blanket under your hips to tilt your pelvis forward.",
        feel: "Pull behind both thighs, behind the knees, and through the calves. If your lower back is doing all the rounding and you feel nothing in your legs, you're doing it wrong — reset and focus on the hip hinge."
      },
      {
        name: "Lying Glute Stretch (Figure-4)",
        duration: "2 min each side",
        whyItMatters: "The piriformis and gluteus medius get hammered by heavy squats and deadlifts. When these deep glute muscles tighten, they compress the sciatic nerve and restrict hip rotation — both of which will show up as nagging lower back or hip pain if left unaddressed. This is the supine version of Pigeon Pose and is more accessible for beginners.",
        howTo: "Lie on your back, knees bent, feet flat on the floor. Cross your right ankle over your left knee so your right shin is roughly horizontal — this creates the figure-4 shape. Flex your right foot (toes toward your shin — this protects the knee joint). Now either stay here if you already feel the stretch, or reach through the gap between your legs with both hands and pull your left thigh toward your chest. Hold for 2 minutes. Switch sides.",
        feel: "Deep stretch in the outer hip and glute of the crossed leg (right side in the example above). The more you pull the thigh in, the more intense it gets."
      },
      {
        name: "Standing Adductor Stretch",
        duration: "90s each side",
        whyItMatters: "This targets the long adductors (inner thigh muscles that run from the pelvis to the knee) from a standing position, which is more functional and often more accessible than floor-based adductor work. It also provides a stretch through the hip joint itself.",
        howTo: "Stand with your feet much wider than shoulder width — about twice shoulder-width or more. Keep both feet pointing forward (not turned out). Shift your weight to the right, bending your right knee and sending your hips back and to the right, like a lateral lunge. Keep your left leg completely straight. Your left foot stays flat on the floor throughout. Hold at the deepest comfortable point. You can place your hands on your right knee for support. Hold 90 seconds, then shift to the left.",
        feel: "A long stretching sensation from your left inner thigh up into the groin on the straight leg side. If you feel it in your left knee, make sure your left foot is pointing straight forward and not rotated inward."
      },
      {
        name: "Ankle Dorsiflexion Drill",
        duration: "2 min each side",
        whyItMatters: "Dorsiflexion is the ability to bring your toes toward your shin. It's the single most important ankle movement for squat mechanics. Limited dorsiflexion forces your heels up or your torso forward in the squat — both of which shift stress to the lower back. This drill both tests and trains ankle mobility.",
        howTo: "Stand facing a wall, barefoot. Place your right foot about 4 inches from the wall. Try to touch your right knee to the wall while keeping your heel flat on the floor. If you can do it easily, move your foot farther back until you find your limit. Mark the distance. Do 10 controlled reps, tapping your knee to the wall each time. Then hold your knee against the wall (or as close as possible) for 30 seconds. Switch sides. Over weeks, you should be able to get your foot farther from the wall.",
        feel: "Tightness in the front of the ankle and Achilles tendon as the knee tracks forward. If you hear clicking or feel pinching at the front of the ankle, that may be ankle impingement — don't force the range."
      },
      {
        name: "Foam Roll IT Band + Glutes",
        duration: "3 min total",
        whyItMatters: "The IT band (iliotibial band) is a thick strip of connective tissue running down the outside of your thigh from hip to knee. It gets aggravated by cycling and heavy squatting. Foam rolling doesn't actually 'release' the IT band (it's too dense to deform), but it does reduce neural tension and soreness in the surrounding tissue, particularly the TFL muscle at the top.",
        howTo: "IT Band: Lie on your side with the foam roller under your right hip, right leg extended. Stack your left foot in front for balance. Slowly roll from just below the hip down toward the knee, stopping on any tender spots for 5–10 seconds. Avoid rolling directly over the knee joint. 90 seconds per side. Glutes: Sit on the foam roller with it under your right glute. Cross your right ankle over your left knee. Lean into the right glute and slowly roll around, finding tender spots and pausing on them. 45 seconds per side.",
        feel: "IT band rolling is notoriously uncomfortable, especially the first few weeks. That discomfort is a signal, not a reason to stop — just go slowly. The glute rolling should feel like productive pressure, not sharp pain."
      },
    ]
  },
  {
    label: "Upper Body & Thoracic Release",
    duration: "45–60 min",
    focus: "Shoulders, pecs, thoracic spine, lats",
    routine: [
      {
        name: "Lacrosse Ball Pec Release",
        duration: "2 min each side",
        whyItMatters: "The pectoralis minor is a small muscle that sits under your chest and attaches to the coracoid process (a bony knob on the front of your shoulder). When it's tight — which it always is in heavy benchers — it rounds the shoulder forward, restricts overhead pressing, and is a leading cause of shoulder impingement. A foam roller can't reach it; a lacrosse ball can.",
        howTo: "Place a lacrosse ball (a tennis ball works too) between your chest and a wall or doorframe. Position it in the meaty area just inside your shoulder, below your collarbone — not on the collarbone itself. Lean your bodyweight into the ball and slowly move your arm up, out, and around to create movement across the muscle while it's compressed. When you find a tender spot, hold pressure there for 10–15 seconds while taking slow breaths. Work the area for 2 minutes per side.",
        feel: "Deep, often sharp pressure in the front of the chest near the shoulder. This area is usually very sensitive if you bench press regularly. That sensitivity is a sign of chronic tightness."
      },
      {
        name: "Thread the Needle",
        duration: "90s each side",
        whyItMatters: "Thoracic rotation is the rotational movement of your mid-back. You need it for the punch-through in a power clean, the bar path in a bench press, and simply for healthy shoulder mechanics. Most lifters have very limited T-spine rotation because their upper backs are stiff from years of loading without mobility work.",
        howTo: "Start on your hands and knees (quadruped position), wrists under shoulders, knees under hips. Place your left hand behind your head with your elbow pointing out. This is your rotating arm. Slowly rotate your left elbow down toward the floor, threading it under your right arm as far as possible. Let your left shoulder and head follow. Your right arm stays planted. Hold at the bottom for 2–3 seconds, feeling the rotation. Slowly return to start and repeat. Do 5–8 reps, then switch sides and hold the best range for 90 seconds.",
        feel: "A twisting sensation through the mid-back. Your head should naturally rotate — let it. If you feel it only in your neck or lower back, you're compensating; try to isolate the movement to your upper back."
      },
      {
        name: "Wall Angels",
        duration: "3 sets × 10 reps",
        whyItMatters: "Wall Angels are both a diagnostic tool and a corrective exercise. If you can't keep your arms, elbows, and wrists against the wall while moving them overhead, you have a combination of thoracic kyphosis (rounded upper back), tight lats, tight pecs, and/or poor scapular control — all of which limit your bench press and overhead press. They're harder than they look.",
        howTo: "Stand with your back against a wall, feet a few inches out from the base. Press your lower back, upper back, and the back of your head into the wall — all three contact points. Bring both arms up with elbows at 90 degrees, backs of hands against the wall (like a field goal post position). Slowly slide your arms up the wall, trying to maintain all contact points. Press your hands overhead and back down. If your lower back arches off the wall or your elbows lose contact, you've hit your limit — work within that range.",
        feel: "Burning in the serratus anterior (side of the ribcage), shoulder blades, and back of the shoulders. It may feel impossible to keep everything against the wall at first — that's exactly why you're doing it."
      },
      {
        name: "Doorway Chest Stretch",
        duration: "2 min",
        whyItMatters: "Heavy benching and pressing creates chronic pectoral tightness that rounds your shoulders forward over time. This stretch directly opens the chest and anterior shoulder. Doing it at three different arm heights targets all portions of the pec — the sternal (lower), middle, and clavicular (upper) fibers.",
        howTo: "Stand in a doorway. Place your right forearm vertically against the door frame, elbow at 90 degrees, upper arm parallel to the floor. Step your right foot through the doorway and gently rotate your torso away from your right arm until you feel a stretch across your chest. Hold 30 seconds. Now raise your arm so your elbow is above your shoulder (about 120 degrees) and repeat — this targets the lower chest fibers. Then lower the arm so it's below shoulder height and repeat — targets upper fibers. 30 seconds per position. Switch sides.",
        feel: "A pulling stretch across the front of the chest and into the front of the shoulder. If you feel it more in the shoulder than the chest, back off the intensity slightly — too much stress on the shoulder joint."
      },
      {
        name: "Overhead Lat Stretch",
        duration: "2 min each side",
        whyItMatters: "The lats are the largest muscles in the back, and they're almost always tight in anyone who rows and pulls heavily. Because they attach to the humerus (upper arm), tight lats actively prevent you from fully raising your arms overhead — which limits your OHP lockout, your power clean catch position, and contributes to lumbar hyperextension in overhead movements.",
        howTo: "Stand facing a squat rack upright, pull-up bar, or sturdy door edge. Grip it at about shoulder height with your right hand. Take a step back and lean your bodyweight away, letting your arm extend overhead and your right side stretch long. To intensify: slightly bend your knees and shift your hips to the left, which creates a lateral stretch that pulls all the way from your armpit down to your hip. Hold and breathe — try to inhale into the stretched side of your ribcage. 2 minutes per side.",
        feel: "A deep stretch from the armpit down through the side of the torso. You may also feel it near your lower back. This is especially intense after rowing and pull-up days."
      },
      {
        name: "Posterior Shoulder Stretch",
        duration: "90s each side",
        whyItMatters: "The posterior shoulder capsule and rear deltoid tighten significantly with heavy rowing, pulling, and bench pressing. Posterior capsule tightness is one of the most common causes of shoulder discomfort in lifters because it forces the humeral head to migrate forward in the socket during pressing.",
        howTo: "Stand tall. Bring your right arm straight across your chest at shoulder height. Use your left hand to cup the right elbow (not the wrist) and gently press the right arm closer to your body. Keep your right shoulder down — don't let it shrug up to your ear. Hold for 90 seconds. You can also do this lying on your side if you want a more passive version. Switch sides.",
        feel: "A stretch in the back of the right shoulder and into the rear deltoid. If you feel it at the front of the shoulder or inside the joint, ease off — you may be compressing rather than stretching."
      },
      {
        name: "Sleeper Stretch",
        duration: "2 min each side",
        whyItMatters: "This stretch specifically targets internal rotation of the shoulder — the ability to rotate your upper arm inward. Bench pressers and overhead athletes almost universally lose internal rotation range over time. Reduced internal rotation leads to impingement, labral stress, and eventually injury. This stretch directly addresses that.",
        howTo: "Lie on your right side on the floor. Extend your right arm out to your side at shoulder height, elbow bent at 90 degrees, forearm pointing up toward the ceiling. Slowly use your left hand to press your right forearm toward the floor (rotating your shoulder internally). Only go as far as your shoulder allows before your body starts to rotate. Hold at the end range. This is a gentle stretch — no forcing. If you have any shoulder pain, consult a physio before doing this one.",
        feel: "A stretch in the back and outside of the shoulder on the side you're lying on. The range of motion may be very limited at first — that's fine. Small improvements over weeks add up."
      },
      {
        name: "Neck Mobility Circuit",
        duration: "3 min",
        whyItMatters: "The neck accumulates tension from heavy back squats (bar on the traps), heavy deadlifts (head position under load), and cycling (looking up while hunched over the bars). Gentle neck mobility reduces this accumulated tension and helps prevent the chronic upper trap tightness that contributes to headaches and shoulder stiffness.",
        howTo: "Sit or stand tall. Move through the following, 5 slow reps each: (1) Chin to chest and back — nod slowly, feel the back of the neck stretch. (2) Ear to shoulder — lateral tilt left and right, keeping your opposite shoulder down. (3) Look left and right — pure rotation, chin stays level. (4) Diagonal: bring your right ear toward your right knee, stretching the left side of the neck. Switch. Never force any position. No rapid movements. Breathe throughout.",
        feel: "Gentle pulling in the neck muscles. This should feel relieving, not straining. If you feel numbness, tingling, or shooting pain into your arm, stop immediately — that can indicate nerve irritation."
      },
      {
        name: "Thoracic Extension over Foam Roller",
        duration: "3 min",
        whyItMatters: "This is the spine-extension complement to the foam rolling you did in Session 1. Where Session 1 addressed stiffness by rolling along the spine, this exercise uses gravity to actively extend (arch back over) each segment of the thoracic spine. It's a powerful antidote to the forward flexion pattern of deadlifting, rowing, and cycling.",
        howTo: "Sit in front of a foam roller placed on the floor. Lower your mid-back onto the roller (start just below the shoulder blades). Support your head with your interlaced hands behind your neck. Allow your upper body to drape back over the roller — let gravity do the work. Take 3–5 slow breaths in this position. Then shift the roller one position up (toward your neck) and repeat. Work from the bottom of the shoulder blades up to the base of the neck — 4 to 5 positions total. Spend extra time on the segments that feel most restricted.",
        feel: "A satisfying backward arch through the upper and mid-back. Some people feel or hear pops — that's fine. Do not force this aggressively or bounce on the roller."
      },
    ]
  },
  {
    label: "Power & Athletic Recovery",
    duration: "45–60 min",
    focus: "Recovery for power athletes — posterior chain + CNS reset",
    routine: [
      {
        name: "Box Breathing",
        duration: "5 min",
        whyItMatters: "After a week of heavy training, your nervous system is in a chronic state of activation. Box breathing (used by Navy SEALs and elite athletes) directly activates the parasympathetic nervous system, lowering cortisol, reducing heart rate, and priming your body for recovery. Five minutes here has measurable physiological effects — it's not just relaxation theater.",
        howTo: "Sit or lie comfortably. Breathe in through your nose for exactly 4 seconds. Hold your breath for 4 seconds. Exhale through your mouth for 4 seconds. Hold empty for 4 seconds. That's one cycle. Repeat continuously for 5 minutes. Set a timer and commit to it — your mind will wander, especially early in the program. When it does, return focus to counting the breath. As you get comfortable, you can extend each phase to 5 or 6 seconds.",
        feel: "Within 2–3 minutes your heart rate will visibly slow and your muscles will begin to release tension. You may feel slightly lightheaded in the first session — that's normal. It passes within a few cycles."
      },
      {
        name: "Supine Thoracic Rotation",
        duration: "2 min each side",
        whyItMatters: "This is a gentler, more passive version of thoracic rotation than Thread the Needle. Done lying on your side, gravity assists the rotation, allowing the thoracic spine to open up without any muscular effort required. It's particularly effective for recovery sessions because the nervous system stays calm.",
        howTo: "Lie on your left side on the floor in a fetal position — hips and knees stacked, bent at roughly 90 degrees. Extend both arms straight out in front of you at shoulder height, palms together. Keep your hips stacked and pinned to the floor (don't let them rotate — use a pillow between your knees if needed). Slowly take your right arm up and over your body, rotating your upper torso to the right. Let the arm fall toward the floor on the right side if it can. Turn your head to follow the moving arm. Hold where the arm settles naturally. Breathe — your chest should expand on each inhale, deepening the rotation. Hold 2 minutes. Switch sides.",
        feel: "A twisting stretch through the mid-back and chest. Your arm may not get close to the floor at first. That's fine — gravity will improve this over weeks."
      },
      {
        name: "90/90 Hip Capsule Stretch",
        duration: "2 min each side",
        whyItMatters: "The hip capsule is the connective tissue surrounding the hip joint itself. Unlike muscles, which respond to simple stretching, the capsule requires sustained, low-load positional work to improve. The 90/90 position is the most efficient way to simultaneously address external rotation (front leg) and internal rotation (rear leg) of the hip capsule. This is advanced hip work — it's what makes the difference between general flexibility and actual hip joint health.",
        howTo: "Sit in a 90/90 position (same as Session 1 — front shin parallel to your body, rear shin pointing behind you, both knees at 90°). For external rotation work: lean forward over your front shin, holding 30 seconds. For internal rotation work: this is the harder part — try to rotate your torso toward your rear leg and lean toward that shin instead. Your pelvis will resist this strongly at first. Use your hands on the floor for balance. Alternate between these two positions for 2 minutes per side.",
        feel: "Significant resistance and discomfort, particularly in the internal rotation direction. Internal rotation is almost always the more restricted direction and the more important one to develop."
      },
      {
        name: "Prone Press-Up (Cobra)",
        duration: "10 reps",
        whyItMatters: "After a week of hip hinging under heavy load (deadlifts, RDLs, power cleans), the lumbar spine needs active decompression. The Prone Press-Up creates lumbar extension, which is the opposite movement pattern of everything you did in the gym. It also opens the hip flexors and anterior core.",
        howTo: "Lie face down on the floor, hands placed flat beside your chest (like the top of a push-up position). Your legs are straight, tops of the feet on the floor. Slowly press your upper body up by straightening your arms, while keeping your hips on the floor. Let your lower back passively extend — don't actively squeeze your glutes or try to lift your hips. Look forward or slightly up. Hold the top for 3 seconds. Slowly lower back down. Repeat 10 times.",
        feel: "A gentle compression-turned-extension sensation in the lower back. This should feel relieving after deadlift days. If you feel sharp pain in your lower back (as opposed to pressure or mild ache), stop — you may have a disc issue that needs professional assessment."
      },
      {
        name: "Glute Foam Roll",
        duration: "2 min each side",
        whyItMatters: "The gluteus medius (side of the hip) and piriformis (deep under the glute) are ground zero for hip tightness in lifters. These muscles are essential for squat stability and hip rotation in the power clean. Foam rolling them improves blood flow and reduces the neural tension that makes them feel 'locked up' between sessions.",
        howTo: "Sit on a foam roller with it under your right glute. Cross your right ankle over your left knee — this shifts your weight into the outer glute and piriformis area. Place your hands on the floor behind you for support. Slowly tilt your weight to the right and explore the area by rolling slightly forward and back, side to side. When you hit a spot that's noticeably tender, stop and hold there — don't roll over it repeatedly. Apply steady pressure for 10–15 seconds, take a breath, and let it release before moving on. Spend 2 minutes per side.",
        feel: "Often very tender, especially after squat and deadlift days. You're looking for a 'productive pain' — a deep ache that diminishes as you hold, not a sharp or shooting sensation."
      },
      {
        name: "Hamstring PNF Stretch",
        duration: "3 rounds, 2 min each side",
        whyItMatters: "PNF stands for Proprioceptive Neuromuscular Facilitation. It is scientifically the most effective stretching technique for improving range of motion — more effective than static or dynamic stretching alone. It works by using a muscle contraction to 'trick' the nervous system into allowing more range. Expect meaningful improvements in hamstring length within 2–3 sessions.",
        howTo: "Lie on your back. Bring your right leg up, keeping it as straight as possible. Hold behind the thigh with both hands (or use a towel around the foot). This is your baseline stretch — note how high the leg goes. Now: push your heel toward the ceiling (contract the hamstring) against the resistance of your own hands for 6 seconds. This is an isometric contraction — your leg shouldn't actually move. After 6 seconds, relax completely. Immediately (in the 2 seconds of relaxation) pull the leg slightly further than your original position. Hold this new range for 30 seconds. Repeat the contract-relax-stretch cycle 3 times before switching sides.",
        feel: "During the contraction: significant effort in the hamstring with no movement. Immediately after releasing: a window of dramatically improved range that you need to capitalize on quickly. This 'post-contraction' relaxation is the mechanism that makes PNF work."
      },
      {
        name: "Hip Flexor Lunge Flow",
        duration: "10 reps each side",
        whyItMatters: "Unlike the Couch Stretch (which is static and intense), this is a dynamic hip flexor flow — it moves through the range repeatedly, teaching your body to use the mobility rather than just passively possess it. Dynamic mobility work is how range of motion transfers to your actual lifting patterns.",
        howTo: "Step your right foot forward into a low lunge, right knee over right ankle, left knee on the floor. From this position: (1) Sink your hips forward and down, feeling the hip flexor of the left leg stretch. (2) Then shift your hips back over the left knee, straightening the right leg and reaching toward the right foot — this reverses into a hamstring stretch. (3) Return to the forward lunge position and add a thoracic rotation — bring your right arm up toward the ceiling, rotating your chest open to the right. (4) Return to start. That's one rep. 10 per side.",
        feel: "Alternating stretches in the hip flexor, hamstring, and a spinal rotation — your body is moving through multiple ranges in a coordinated pattern. This one should feel almost like a flow sequence rather than a stretch."
      },
      {
        name: "Calf & Achilles Wall Stretch",
        duration: "2 min each side",
        whyItMatters: "The calf has two distinct muscles that require two different stretches. The gastrocnemius (upper calf) crosses the knee, so it's stretched with a straight leg. The soleus (lower calf) does not cross the knee, so it's only stretched when the knee is bent. Cyclists almost always have extreme soleus tightness from the sustained knee-bent pedaling position. Both stretches are necessary.",
        howTo: "Face a wall. Step your right foot back about 2–3 feet. Gastrocnemius stretch: Keep the right leg completely straight, heel flat on the floor. Press your right heel into the floor and lean your body toward the wall. Hold 60 seconds. Soleus stretch: From the same position, bend your right knee slightly while keeping the right heel flat on the floor. The bend shifts the stretch deeper into the lower calf and Achilles tendon. Hold 60 seconds. Switch sides.",
        feel: "Straight leg: pull high up the calf. Bent knee: stretch lower, near the Achilles tendon insertion at the heel. If the bent-knee version is much tighter than the straight-leg version, your soleus is very restricted — this matters a lot for your squat."
      },
      {
        name: "Supine Spinal Twist",
        duration: "2 min each side",
        whyItMatters: "The spinal twist decompresses vertebral joints along the entire length of the spine, provides a gentle stretch to the piriformis and IT band, and gives a thoracic rotation stretch in a fully relaxed position. It's the ideal way to end a mobility session — it leaves the spine feeling long and decompressed.",
        howTo: "Lie on your back, legs extended. Pull your right knee to your chest. Now use your left hand to guide the right knee across your body to the left, letting it fall toward the floor. Your right arm extends straight out to the right, palm up. Turn your head to look toward your right hand. Both shoulders should remain on or near the floor — if your right shoulder lifts significantly, you have good thoracic rotation work ahead of you. Hold for 2 minutes, breathing deeply. Each exhale, let the knee sink a little closer to the floor. Switch sides.",
        feel: "A wringing sensation through the entire spine, a stretch in the outer hip of the crossed leg, and a chest/shoulder opener on the extended arm side. This is the single most relaxing stretch in the program — most people feel an immediate sense of spinal relief."
      },
    ]
  },
];

// Each phase has wed (mid-week) and sun (weekend) sessions
const CYCLING_SESSIONS = {
  foundation: {
    wed: {
      label: "Zone 2 Base Building",
      tag: "WEDNESDAY",
      duration: "45–60 min",
      intensity: "Zone 2 (60–70% max HR)",
      sprintNote: null,
      notes: "Conversational pace — you should be able to speak in full sentences. Builds your aerobic base and fat metabolism. Flat to rolling terrain preferred. This mid-week ride sits between your two lower-body strength days, so keep intensity easy.",
      structure: "5 min easy warm-up → 40–50 min steady Zone 2 → 5 min easy cool-down"
    },
    sun: {
      label: "Zone 2 Base Building",
      tag: "SUNDAY",
      duration: "45–60 min",
      intensity: "Zone 2 (60–70% max HR)",
      sprintNote: null,
      notes: "Same Zone 2 focus as Wednesday. Your legs are fresh off Saturday's upper pull day. Flat to rolling terrain. Use this ride to build the aerobic engine that will make Phase 2 sprints more effective.",
      structure: "5 min easy warm-up → 40–50 min steady Zone 2 → 5 min easy cool-down"
    }
  },
  development: {
    wed: {
      label: "Endurance + Threshold Intervals",
      tag: "WEDNESDAY",
      duration: "60–75 min",
      intensity: "Zone 2 with 3× Zone 4 surges",
      sprintNote: null,
      notes: "Mid-week threshold work. Keep this structured but not maximal — you have deadlifts and squats on Thursday. The threshold intervals build lactate capacity on top of your aerobic base from Phase 1.",
      structure: "5 min warm-up → 20 min Zone 2 → 3× (4 min Zone 4 / 4 min Zone 2 recovery) → 15 min Zone 2 → 5 min cool-down"
    },
    sun: {
      label: "Sprint Session",
      tag: "SUNDAY · SPRINTS INTRODUCED",
      duration: "50–60 min",
      intensity: "Zone 2 warm-up + Zone 5–6 sprint efforts",
      sprintNote: "⚡ SPRINT DAY — First sprint session of the program. Legs are fresh after Saturday upper pull day.",
      notes: "Your first dedicated sprint session. Warm up thoroughly before any sprint effort — your CNS needs it. Each sprint is truly all-out: stand on the pedals, full power output. The 2-minute recovery intervals are not optional — do not shorten them. If you feel your power dropping significantly by sprint 5 or 6, cut the session there. Quality over quantity.",
      structure: "10 min easy Zone 2 warm-up → 10 min building effort (Zone 3) → 6× (20-sec all-out sprint / 2 min easy recovery) → 10 min Zone 2 cool-down"
    }
  },
  peak: {
    wed: {
      label: "Threshold + Power Intervals",
      tag: "WEDNESDAY",
      duration: "60–70 min",
      intensity: "Zone 2 + Zone 4–5 intervals",
      sprintNote: null,
      notes: "Mid-week intensity stays controlled. You're peaking on strength this phase, so Wednesday riding should be hard enough to maintain cycling fitness but not so taxing it bleeds into Thursday's max-effort deadlifts. If your legs feel heavy Thursday morning, dial this session back.",
      structure: "5 min warm-up → 15 min Zone 2 → 4× (3 min Zone 4–5 / 3 min Zone 2) → 15 min Zone 2 → cool-down"
    },
    sun: {
      label: "Extended Sprint Session",
      tag: "SUNDAY · PEAK SPRINTS",
      duration: "55–65 min",
      intensity: "Zone 2 warm-up + Zone 5–6 sprint efforts",
      sprintNote: "⚡ SPRINT DAY — Extended sprint protocol. Peak neuromuscular output on the bike.",
      notes: "Full sprint protocol — the most demanding cycling session of the program. Use 'flying sprints': spend the first 8–10 seconds building speed, then hold absolute maximum effort for 20 seconds. This mirrors the explosive CNS demand of your peak strength week. Monitor total leg fatigue across the week closely. If Monday power cleans feel flat or technique degrades, reduce to 6 sprints next week rather than cutting the lifting.",
      structure: "10 min easy Zone 2 → 10 min building (Zone 3) → 8–10× (8-sec build + 20-sec all-out / 2 min easy recovery) → 10 min Zone 2 cool-down"
    }
  }
};

const WEEKLY_SCHEDULE = [
  { day: "Mon", type: "strength" },
  { day: "Tue", type: "strength" },
  { day: "Wed", type: "cardio" },
  { day: "Thu", type: "strength" },
  { day: "Fri", type: "mobility" },
  { day: "Sat", type: "strength" },
  { day: "Sun", type: "cardio" },
];

const STRENGTH_ORDER = ["A", "B", "C", "D"];

const getWeekData = (week) => {
  const phase = getPhase(week);
  const phaseKey = phase.name === "Foundation" ? "foundation" : phase.name === "Development" ? "development" : "peak";
  const phaseIndex = phase.weeks.indexOf(week); // 0-3 within the phase
  const mobilityIndex = phaseIndex % 4;
  const mobilitySession = MOBILITY_SESSIONS[mobilityIndex];
  const cycling = CYCLING_SESSIONS[phaseKey];

  // Progressive overload notes by week
  const overloadNote = week <= 4
    ? `Week ${week} — establish working weights. Log every set.`
    : week <= 8
    ? `Week ${week} — aim to add 5 lbs to lower body lifts, 2.5 lbs to upper body vs Phase 1.`
    : `Week ${week} — push toward 3RM efforts. Recovery is critical.`;

  return { phase, phaseKey, mobilitySession, cycling, overloadNote };
};

export default function TrainingProgram() {
  const [selectedWeek, setSelectedWeek] = useState(1);
  const [activeDay, setActiveDay] = useState(null);
  const [expandedExercise, setExpandedExercise] = useState(null);
  const [view, setView] = useState("overview"); // overview | week

  const weekData = getWeekData(selectedWeek);
  const phase = weekData.phase;
  const phaseKey = weekData.phaseKey;

  // Build the actual days for the selected week
  const days = WEEKLY_SCHEDULE.map((d, i) => {
    if (d.type === "strength") {
      // Figure out which strength day this is
      const strengthDayIndex = WEEKLY_SCHEDULE.slice(0, i + 1).filter(x => x.type === "strength").length - 1;
      const template = STRENGTH_TEMPLATES[phaseKey][STRENGTH_ORDER[strengthDayIndex]];
      return { ...d, session: template, sessionType: "strength", key: STRENGTH_ORDER[strengthDayIndex] };
    } else if (d.type === "cardio") {
      const cyclingDay = d.day === "Wed" ? "wed" : "sun";
      const cyclingPhase = CYCLING_SESSIONS[weekData.phaseKey];
      return { ...d, session: cyclingPhase[cyclingDay], sessionType: "cardio" };
    } else {
      return { ...d, session: weekData.mobilitySession, sessionType: "mobility" };
    }
  });

  const typeColor = (type) => type === "strength" ? "#E8743B" : type === "cardio" ? "#4A90D9" : "#4CAF78";
  const typeBg = (type) => type === "strength" ? "rgba(232,116,59,0.12)" : type === "cardio" ? "rgba(74,144,217,0.12)" : "rgba(76,175,120,0.12)";

  return (
    <div style={{
      fontFamily: "'Georgia', 'Times New Roman', serif",
      background: "#0E0E10",
      minHeight: "100vh",
      color: "#E8E4DC",
      maxWidth: 920,
      margin: "0 auto",
      padding: "0 0 80px 0",
    }}>
      {/* Header */}
      <div style={{
        background: "linear-gradient(135deg, #1A1A1E 0%, #111114 100%)",
        borderBottom: "1px solid #2A2A2E",
        padding: "32px 32px 28px",
        position: "sticky",
        top: 0,
        zIndex: 100,
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 16 }}>
          <div>
            <div style={{ fontSize: 11, letterSpacing: 4, color: "#888", textTransform: "uppercase", fontFamily: "monospace", marginBottom: 6 }}>
              4 · 2 · 1 · METHOD
            </div>
            <h1 style={{ margin: 0, fontSize: 28, fontWeight: 700, letterSpacing: -0.5, color: "#F0EBE0" }}>
              12-Week Performance Program
            </h1>
            <div style={{ marginTop: 8, display: "flex", gap: 16, flexWrap: "wrap" }}>
              {PHASES.map(p => (
                <span key={p.name} style={{ fontSize: 12, color: p.color, fontFamily: "monospace" }}>
                  ● Wks {p.weeks[0]}–{p.weeks[3]} {p.name}
                </span>
              ))}
            </div>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <button onClick={() => setView("overview")} style={{
              padding: "8px 16px", borderRadius: 6, border: "1px solid",
              borderColor: view === "overview" ? "#E8743B" : "#333",
              background: view === "overview" ? "rgba(232,116,59,0.15)" : "transparent",
              color: view === "overview" ? "#E8743B" : "#888",
              cursor: "pointer", fontSize: 13, fontFamily: "monospace",
            }}>Overview</button>
            <button onClick={() => setView("week")} style={{
              padding: "8px 16px", borderRadius: 6, border: "1px solid",
              borderColor: view === "week" ? "#E8743B" : "#333",
              background: view === "week" ? "rgba(232,116,59,0.15)" : "transparent",
              color: view === "week" ? "#E8743B" : "#888",
              cursor: "pointer", fontSize: 13, fontFamily: "monospace",
            }}>Week Detail</button>
          </div>
        </div>
      </div>

      {/* Week Selector */}
      <div style={{ padding: "20px 32px 0", display: "flex", gap: 6, flexWrap: "wrap" }}>
        {Array.from({length: 12}, (_, i) => i + 1).map(w => {
          const p = getPhase(w);
          const isSelected = w === selectedWeek;
          return (
            <button key={w} onClick={() => { setSelectedWeek(w); setActiveDay(null); setView("week"); }} style={{
              width: 42, height: 42, borderRadius: 8, border: "1px solid",
              borderColor: isSelected ? p.color : "#2A2A2E",
              background: isSelected ? p.color + "22" : "transparent",
              color: isSelected ? p.color : "#888",
              cursor: "pointer", fontSize: 14, fontWeight: isSelected ? 700 : 400,
              fontFamily: "monospace",
              transition: "all 0.15s",
            }}>{w}</button>
          );
        })}
      </div>

      {/* Phase Banner */}
      {view === "week" && (
        <div style={{
          margin: "20px 32px 0",
          padding: "16px 20px",
          borderRadius: 10,
          background: phase.color + "15",
          border: `1px solid ${phase.color}40`,
          display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12,
        }}>
          <div>
            <div style={{ fontSize: 11, letterSpacing: 3, color: phase.color, fontFamily: "monospace", textTransform: "uppercase" }}>
              Phase {PHASES.indexOf(phase) + 1} · {phase.name}
            </div>
            <div style={{ fontSize: 14, color: "#C0B8A8", marginTop: 4 }}>{phase.desc}</div>
          </div>
          <div style={{ fontFamily: "monospace", fontSize: 12, color: "#888", maxWidth: 360, textAlign: "right" }}>
            {weekData.overloadNote}
          </div>
        </div>
      )}

      {/* OVERVIEW VIEW */}
      {view === "overview" && (
        <div style={{ padding: "28px 32px" }}>
          <div style={{ fontSize: 13, color: "#888", marginBottom: 24, lineHeight: 1.7 }}>
            This program is built on the 4-2-1 split: <span style={{ color: "#E8743B" }}>4 strength days</span>, <span style={{ color: "#4A90D9" }}>2 outdoor cycling sessions</span>, and <span style={{ color: "#4CAF78" }}>1 dedicated mobility day</span> per week — 7 days of structured training. Three phases of 4 weeks each progressively load you toward peak performance. Wednesday cycling stays aerobic throughout to protect Thursday's lower body lifting. <span style={{ color: "#FFD966" }}>⚡ Sprint work</span> is introduced on Sunday in Phase 2 and peaks in Phase 3, timed when your legs are freshest after Saturday's upper pull day.
          </div>

          {/* Weekly Schedule Card */}
          <div style={{ background: "#161618", borderRadius: 12, border: "1px solid #222", padding: "20px", marginBottom: 28 }}>
            <div style={{ fontSize: 11, letterSpacing: 3, color: "#666", fontFamily: "monospace", textTransform: "uppercase", marginBottom: 16 }}>Weekly Schedule Template</div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 8 }}>
              {WEEKLY_SCHEDULE.map(d => (
                <div key={d.day} style={{
                  background: typeBg(d.type),
                  border: `1px solid ${typeColor(d.type)}40`,
                  borderRadius: 8, padding: "12px 8px", textAlign: "center",
                }}>
                  <div style={{ fontSize: 11, color: "#666", fontFamily: "monospace", letterSpacing: 1 }}>{d.day.toUpperCase()}</div>
                  <div style={{ marginTop: 8, fontSize: 18 }}>
                    {d.type === "strength" ? "🏋️" : d.type === "cardio" ? "🚴" : "🧘"}
                  </div>
                  <div style={{ marginTop: 6, fontSize: 10, color: typeColor(d.type), fontFamily: "monospace", letterSpacing: 1 }}>
                    {d.type.toUpperCase()}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Phase breakdown */}
          {PHASES.map((p, pi) => (
            <div key={p.name} style={{ background: "#161618", borderRadius: 12, border: `1px solid ${p.color}30`, padding: "20px", marginBottom: 16 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 12 }}>
                <div>
                  <div style={{ color: p.color, fontFamily: "monospace", fontSize: 11, letterSpacing: 3, textTransform: "uppercase" }}>
                    Phase {pi + 1} · Weeks {p.weeks[0]}–{p.weeks[3]}
                  </div>
                  <div style={{ fontSize: 20, fontWeight: 700, marginTop: 4 }}>{p.name}</div>
                  <div style={{ color: "#888", fontSize: 13, marginTop: 4 }}>{p.desc}</div>
                </div>
                <button onClick={() => { setSelectedWeek(p.weeks[0]); setView("week"); }} style={{
                  padding: "8px 16px", borderRadius: 6, border: `1px solid ${p.color}60`,
                  background: p.color + "20", color: p.color, cursor: "pointer", fontSize: 12, fontFamily: "monospace",
                }}>View Week {p.weeks[0]} →</button>
              </div>
              <div style={{ marginTop: 16, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <div style={{ padding: "12px", background: "#1C1C1E", borderRadius: 8 }}>
                  <div style={{ fontSize: 11, color: "#E8743B", fontFamily: "monospace", letterSpacing: 2, marginBottom: 6 }}>STRENGTH FOCUS</div>
                  <div style={{ fontSize: 12, color: "#C0B8A8", lineHeight: 1.6 }}>
                    {pi === 0 && "Establish working weights. 4–6 rep ranges. Master movement patterns for squat, deadlift, power clean."}
                    {pi === 1 && "Load progression. 5 rep strength work. Push press replaces strict OHP. Volume increases across all lifts."}
                    {pi === 2 && "Peaking protocol. 2–3 rep maximals. Drop sets. Intensity plateaus; density increases."}
                  </div>
                </div>
                <div style={{ padding: "12px", background: "#1C1C1E", borderRadius: 8 }}>
                  <div style={{ fontSize: 11, color: "#4A90D9", fontFamily: "monospace", letterSpacing: 2, marginBottom: 6 }}>CYCLING FOCUS</div>
                  <div style={{ fontSize: 12, color: "#C0B8A8", lineHeight: 1.6 }}>
                    {pi === 0 && "Both rides Zone 2. Conversational pace, 45–60 min. Building the aerobic base that makes Phase 2 sprints effective."}
                    {pi === 1 && "Wednesday: Zone 2 + threshold intervals. Sunday: ⚡ Sprint day introduced — 6× 20-sec all-out efforts with Zone 2 warm-up."}
                    {pi === 2 && "Wednesday: Threshold + power intervals. Sunday: ⚡ Extended sprint protocol — 8–10 flying sprints at peak neuromuscular output."}
                  </div>
                </div>
              </div>
            </div>
          ))}

          {/* Progressive Overload Guide */}
          <div style={{ background: "#161618", borderRadius: 12, border: "1px solid #2A2A2E", padding: "20px", marginBottom: 16 }}>
            <div style={{ fontSize: 11, letterSpacing: 3, color: "#666", fontFamily: "monospace", textTransform: "uppercase", marginBottom: 16 }}>Progressive Overload Guidelines</div>
            {[
              { label: "Lower Body Lifts (Squat, Deadlift, RDL)", note: "Add 5–10 lbs when you complete all sets at target reps with good form." },
              { label: "Upper Body Compound (Bench, Row, OHP)", note: "Add 2.5–5 lbs when all sets complete. Microplates are your friend." },
              { label: "Power Clean", note: "Add 5 lbs max per session. Technique degrades fast with fatigue. Never sacrifice form." },
              { label: "Isolation Work (Curls, Laterals, etc.)", note: "Progress by reps first (add reps), then weight. 1–2 reps per week." },
              { label: "Cycling", note: "Increase duration by 5–10 min every 2 weeks, or add interval intensity as prescribed." },
            ].map((g, i) => (
              <div key={i} style={{ display: "flex", gap: 16, padding: "10px 0", borderBottom: i < 4 ? "1px solid #222" : "none" }}>
                <div style={{ color: "#E8743B", fontSize: 12, fontFamily: "monospace", minWidth: 280 }}>{g.label}</div>
                <div style={{ color: "#888", fontSize: 12, lineHeight: 1.6 }}>{g.note}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* WEEK DETAIL VIEW */}
      {view === "week" && (
        <div style={{ padding: "20px 32px" }}>
          {/* Day Tabs */}
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 20 }}>
            {days.map((d, i) => (
              <button key={i} onClick={() => setActiveDay(activeDay === i ? null : i)} style={{
                padding: "10px 16px", borderRadius: 8, border: "1px solid",
                borderColor: activeDay === i ? typeColor(d.type) : "#2A2A2E",
                background: activeDay === i ? typeBg(d.type) : "#161618",
                color: activeDay === i ? typeColor(d.type) : "#888",
                cursor: "pointer", fontSize: 13, fontFamily: "monospace",
                transition: "all 0.15s",
              }}>
                <span style={{ marginRight: 6 }}>{d.type === "strength" ? "🏋️" : d.session && d.session.sprintNote ? "⚡" : d.type === "cardio" ? "🚴" : "🧘"}</span>
                {d.day}
              </button>
            ))}
          </div>

          {/* All days or selected day */}
          {(activeDay === null ? days.map((_, i) => i) : [activeDay]).map(i => {
            const d = days[i];
            return (
              <div key={i} style={{
                background: "#161618",
                border: `1px solid ${typeColor(d.type)}30`,
                borderRadius: 12,
                marginBottom: 16,
                overflow: "hidden",
              }}>
                {/* Day Header */}
                <div style={{
                  padding: "16px 20px",
                  background: typeBg(d.type),
                  borderBottom: `1px solid ${typeColor(d.type)}30`,
                  display: "flex", justifyContent: "space-between", alignItems: "center",
                }}>
                  <div>
                    <div style={{ fontSize: 11, color: d.session && d.session.sprintNote ? "#FFD966" : typeColor(d.type), fontFamily: "monospace", letterSpacing: 3, textTransform: "uppercase" }}>
                      {d.session && d.session.tag ? d.session.tag : `${d.day} · ${d.type}`}
                    </div>
                    <div style={{ fontSize: 18, fontWeight: 700, marginTop: 2 }}>
                      {d.session.label}
                    </div>
                  </div>
                  {d.session.duration && (
                    <div style={{ fontFamily: "monospace", fontSize: 12, color: "#888" }}>{d.session.duration}</div>
                  )}
                </div>

                {/* Strength Session */}
                {d.sessionType === "strength" && (
                  <div style={{ padding: "16px 20px" }}>
                    <table style={{ width: "100%", borderCollapse: "collapse" }}>
                      <thead>
                        <tr style={{ borderBottom: "1px solid #222" }}>
                          {["Exercise", "Sets", "Reps", "Coaching Notes"].map(h => (
                            <th key={h} style={{ textAlign: "left", padding: "6px 12px 10px", fontSize: 10, color: "#555", fontFamily: "monospace", letterSpacing: 2, textTransform: "uppercase", fontWeight: 400 }}>{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {d.session.exercises.map((ex, ei) => (
                          <tr key={ei} style={{
                            borderBottom: "1px solid #1E1E20",
                            cursor: "pointer",
                            background: expandedExercise === `${i}-${ei}` ? "rgba(232,116,59,0.06)" : "transparent",
                          }}
                            onClick={() => setExpandedExercise(expandedExercise === `${i}-${ei}` ? null : `${i}-${ei}`)}>
                            <td style={{ padding: "12px 12px", fontSize: 14, color: "#E8E4DC", fontWeight: 500 }}>{ex.name}</td>
                            <td style={{ padding: "12px 12px", fontSize: 14, color: "#E8743B", fontFamily: "monospace" }}>{ex.sets}</td>
                            <td style={{ padding: "12px 12px", fontSize: 14, color: "#E8743B", fontFamily: "monospace" }}>{ex.reps}</td>
                            <td style={{ padding: "12px 12px", fontSize: 12, color: "#888", lineHeight: 1.5 }}>{ex.notes}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    <div style={{ marginTop: 14, padding: "10px 12px", background: "#1A1A1C", borderRadius: 6, fontSize: 12, color: "#666", fontFamily: "monospace" }}>
                      Rest: 2–3 min between compound sets · 60–90s between isolation sets
                    </div>
                  </div>
                )}

                {/* Cardio Session */}
                {d.sessionType === "cardio" && (
                  <div style={{ padding: "16px 20px" }}>
                    {d.session.sprintNote && (
                      <div style={{ marginBottom: 14, padding: "10px 14px", background: "rgba(255,200,50,0.08)", border: "1px solid rgba(255,200,50,0.3)", borderRadius: 8, fontSize: 13, color: "#FFD966", fontFamily: "monospace", letterSpacing: 0.5 }}>
                        {d.session.sprintNote}
                      </div>
                    )}
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 14 }}>
                      <div style={{ background: "#1A1A1C", borderRadius: 8, padding: "12px" }}>
                        <div style={{ fontSize: 10, color: "#4A90D9", fontFamily: "monospace", letterSpacing: 2, marginBottom: 6 }}>INTENSITY</div>
                        <div style={{ fontSize: 13, color: "#C0B8A8" }}>{d.session.intensity}</div>
                      </div>
                      <div style={{ background: "#1A1A1C", borderRadius: 8, padding: "12px" }}>
                        <div style={{ fontSize: 10, color: "#4A90D9", fontFamily: "monospace", letterSpacing: 2, marginBottom: 6 }}>DURATION</div>
                        <div style={{ fontSize: 13, color: "#C0B8A8" }}>{d.session.duration}</div>
                      </div>
                    </div>
                    <div style={{ marginBottom: 14, padding: "12px 14px", background: "#1A1C22", borderRadius: 8, borderLeft: "3px solid #4A90D9" }}>
                      <div style={{ fontSize: 10, color: "#4A90D9", fontFamily: "monospace", letterSpacing: 2, marginBottom: 6 }}>STRUCTURE</div>
                      <div style={{ fontSize: 13, color: "#C0B8A8", lineHeight: 1.7, fontFamily: "monospace" }}>{d.session.structure}</div>
                    </div>
                    <div style={{ padding: "12px 14px", background: "#1A1A1C", borderRadius: 8, fontSize: 13, color: "#888", lineHeight: 1.75 }}>
                      {d.session.notes}
                    </div>
                  </div>
                )}

                {/* Mobility Session */}
                {d.sessionType === "mobility" && (
                  <div style={{ padding: "16px 20px" }}>
                    <div style={{ marginBottom: 16, display: "flex", gap: 12, flexWrap: "wrap" }}>
                      <span style={{ padding: "4px 10px", background: "rgba(76,175,120,0.12)", borderRadius: 4, fontSize: 11, color: "#4CAF78", fontFamily: "monospace" }}>{d.session.duration}</span>
                      <span style={{ padding: "4px 10px", background: "#1A1A1C", borderRadius: 4, fontSize: 11, color: "#888", fontFamily: "monospace" }}>Focus: {d.session.focus}</span>
                    </div>
                    <div style={{ fontSize: 11, color: "#555", fontFamily: "monospace", marginBottom: 12 }}>TAP ANY STRETCH FOR FULL INSTRUCTIONS ▼</div>
                    {d.session.routine.map((item, ri) => {
                      const isOpen = expandedExercise === `mob-${i}-${ri}`;
                      return (
                        <div key={ri} style={{ borderBottom: ri < d.session.routine.length - 1 ? "1px solid #1E1E20" : "none" }}>
                          <div onClick={() => setExpandedExercise(isOpen ? null : `mob-${i}-${ri}`)} style={{ display: "flex", gap: 16, padding: "14px 0", alignItems: "flex-start", cursor: "pointer" }}>
                            <div style={{ width: 24, height: 24, borderRadius: "50%", background: isOpen ? "rgba(76,175,120,0.35)" : "rgba(76,175,120,0.2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, color: "#4CAF78", fontFamily: "monospace", flexShrink: 0, marginTop: 2 }}>{ri + 1}</div>
                            <div style={{ flex: 1 }}>
                              <div style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap", alignItems: "center" }}>
                                <div style={{ fontSize: 14, fontWeight: 600, color: isOpen ? "#7DE0A8" : "#E8E4DC" }}>{item.name}</div>
                                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                                  <div style={{ fontSize: 12, color: "#4CAF78", fontFamily: "monospace" }}>{item.duration}</div>
                                  <div style={{ fontSize: 11, color: "#555", fontFamily: "monospace" }}>{isOpen ? "▲" : "▼"}</div>
                                </div>
                              </div>
                            </div>
                          </div>
                          {isOpen && (
                            <div style={{ paddingLeft: 40, paddingBottom: 16 }}>
                              <div style={{ marginBottom: 10, padding: "12px 14px", background: "#1A2A1E", borderRadius: 8, borderLeft: "3px solid #4CAF78" }}>
                                <div style={{ fontSize: 10, color: "#4CAF78", fontFamily: "monospace", letterSpacing: 2, marginBottom: 6 }}>WHY IT MATTERS</div>
                                <div style={{ fontSize: 13, color: "#C0B8A8", lineHeight: 1.75 }}>{item.whyItMatters}</div>
                              </div>
                              <div style={{ marginBottom: 10, padding: "12px 14px", background: "#1C1C1E", borderRadius: 8, borderLeft: "3px solid #888" }}>
                                <div style={{ fontSize: 10, color: "#AAA", fontFamily: "monospace", letterSpacing: 2, marginBottom: 6 }}>HOW TO DO IT</div>
                                <div style={{ fontSize: 13, color: "#C0B8A8", lineHeight: 1.75 }}>{item.howTo}</div>
                              </div>
                              <div style={{ padding: "12px 14px", background: "#1E1C1A", borderRadius: 8, borderLeft: "3px solid #E8743B" }}>
                                <div style={{ fontSize: 10, color: "#E8743B", fontFamily: "monospace", letterSpacing: 2, marginBottom: 6 }}>WHAT YOU SHOULD FEEL</div>
                                <div style={{ fontSize: 13, color: "#C0B8A8", lineHeight: 1.75 }}>{item.feel}</div>
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Footer */}
      <div style={{ padding: "0 32px", marginTop: 8 }}>
        <div style={{ display: "flex", gap: 24, flexWrap: "wrap" }}>
          {[
            { color: "#E8743B", label: "Strength (4×/wk)" },
            { color: "#4A90D9", label: "Cycling — Wed: Endurance / Sun: Sprints (Phase 2+)" },
            { color: "#4CAF78", label: "Mobility (1×/wk)" },
          ].map(t => (
            <div key={t.label} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12, color: "#666", fontFamily: "monospace" }}>
              <div style={{ width: 8, height: 8, borderRadius: "50%", background: t.color }} />
              {t.label}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}