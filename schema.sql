-- Table: exercises
CREATE TABLE IF NOT EXISTS exercises (
    id UUID PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    muscle_group VARCHAR(100) NOT NULL,
    description TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Table: routines
CREATE TABLE IF NOT EXISTS routines (
    id UUID PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    difficulty VARCHAR(20) NOT NULL CHECK (difficulty IN ('beginner', 'intermediate', 'advanced')),
    category VARCHAR(50) NOT NULL,
    estimated_duration INTEGER NOT NULL,
    target_muscle_groups JSONB NOT NULL,
    exercises JSONB NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
    is_custom BOOLEAN NOT NULL DEFAULT FALSE
);

-- Table: workout_history
CREATE TABLE IF NOT EXISTS workout_history (
    id UUID PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    date TIMESTAMP NOT NULL,
    exercises JSONB NOT NULL,
    duration INTEGER NOT NULL,
    completed BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Seed data for exercises
INSERT INTO exercises (id, name, muscle_group, description, created_at, updated_at) VALUES
    ('11111111-1111-1111-1111-111111111111', 'Push Up', 'Chest', 'A bodyweight exercise for upper body strength.', NOW(), NOW()),
    ('22222222-2222-2222-2222-222222222222', 'Squat', 'Legs', 'A lower body exercise targeting the quadriceps and glutes.', NOW(), NOW()),
    ('33333333-3333-3333-3333-333333333333', 'Pull Up', 'Back', 'An upper body exercise for back and biceps.', NOW(), NOW()),
    ('44444444-4444-4444-4444-444444444444', 'Bench Press', 'Chest', 'A compound exercise for chest, shoulders, and triceps.', NOW(), NOW()),
    ('55555555-5555-5555-5555-555555555555', 'Deadlift', 'Back', 'A compound lift for back, glutes, and hamstrings.', NOW(), NOW()),
    ('66666666-6666-6666-6666-666666666666', 'Overhead Press', 'Shoulders', 'A shoulder press for deltoids and triceps.', NOW(), NOW()),
    ('77777777-7777-7777-7777-777777777777', 'Barbell Row', 'Back', 'A rowing movement for upper and mid-back.', NOW(), NOW()),
    ('88888888-8888-8888-8888-888888888888', 'Lat Pulldown', 'Back', 'A vertical pulling exercise for lats.', NOW(), NOW()),
    ('99999999-9999-9999-9999-999999999999', 'Bicep Curl', 'Arms', 'An isolation exercise for biceps.', NOW(), NOW()),
    ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Tricep Extension', 'Arms', 'An isolation exercise for triceps.', NOW(), NOW()),
    ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'Lateral Raise', 'Shoulders', 'An isolation exercise for lateral deltoids.', NOW(), NOW()),
    ('cccccccc-cccc-cccc-cccc-cccccccccccc', 'Leg Press', 'Legs', 'A machine-based compound leg exercise.', NOW(), NOW()),
    ('dddddddd-dddd-dddd-dddd-dddddddddddd', 'Leg Curl', 'Legs', 'An isolation exercise for hamstrings.', NOW(), NOW()),
    ('eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', 'Leg Extension', 'Legs', 'An isolation exercise for quadriceps.', NOW(), NOW()),
    ('ffffffff-ffff-ffff-ffff-ffffffffffff', 'Calf Raise', 'Legs', 'An isolation exercise for calves.', NOW(), NOW()),
    ('12121212-1212-1212-1212-121212121212', 'Chest Fly', 'Chest', 'An isolation exercise for chest.', NOW(), NOW()),
    ('23232323-2323-2323-2323-232323232323', 'Incline Bench Press', 'Chest', 'A bench press variation for upper chest.', NOW(), NOW()),
    ('34343434-3434-3434-3434-343434343434', 'Decline Bench Press', 'Chest', 'A bench press variation for lower chest.', NOW(), NOW()),
    ('45454545-4545-4545-4545-454545454545', 'Hammer Curl', 'Arms', 'A bicep curl variation for brachialis.', NOW(), NOW()),
    ('56565656-5656-5656-5656-565656565656', 'Skullcrusher', 'Arms', 'A triceps extension exercise.', NOW(), NOW()),
    ('67676767-6767-6767-6767-676767676767', 'Face Pull', 'Shoulders', 'A rear delt and upper back exercise.', NOW(), NOW()),
    ('78787878-7878-7878-7878-787878787878', 'Seated Row', 'Back', 'A horizontal pulling exercise for back.', NOW(), NOW()),
    ('89898989-8989-8989-8989-898989898989', 'Chest Dip', 'Chest', 'A bodyweight dip for chest and triceps.', NOW(), NOW()),
    ('90909090-9090-9090-9090-909090909090', 'Tricep Dip', 'Arms', 'A bodyweight dip for triceps.', NOW(), NOW()),
    ('a1a1a1a1-a1a1-a1a1-a1a1-a1a1a1a1a1a1', 'Crunch', 'Abs', 'A bodyweight exercise for abdominal muscles.', NOW(), NOW()),
    ('b2b2b2b2-b2b2-b2b2-b2b2-b2b2b2b2b2b2', 'Plank', 'Abs', 'An isometric core exercise.', NOW(), NOW()),
    ('c3c3c3c3-c3c3-c3c3-c3c3-c3c3c3c3c3c3', 'Russian Twist', 'Abs', 'A rotational core exercise.', NOW(), NOW()),
    ('d4d4d4d4-d4d4-d4d4-d4d4-d4d4d4d4d4d4', 'Mountain Climber', 'Abs', 'A dynamic core and cardio exercise.', NOW(), NOW()),
    ('e5e5e5e5-e5e5-e5e5-e5e5-e5e5e5e5e5e5', 'Hip Thrust', 'Glutes', 'A glute bridge variation for glutes and hamstrings.', NOW(), NOW()),
    ('f6f6f6f6-f6f6-f6f6-f6f6-f6f6f6f6f6f6', 'Glute Bridge', 'Glutes', 'A bodyweight exercise for glutes.', NOW(), NOW()),
    ('01010101-0101-0101-0101-010101010101', 'Farmer''s Walk', 'Full Body', 'A loaded carry for grip, traps, and core.', NOW(), NOW()),
    ('02020202-0202-0202-0202-020202020202', 'Arnold Press', 'Shoulders', 'A shoulder press variation for deltoids.', NOW(), NOW()),
    ('03030303-0303-0303-0303-030303030303', 'Reverse Fly', 'Shoulders', 'A rear delt isolation exercise.', NOW(), NOW()),
    ('04040404-0404-0404-0404-040404040404', 'Cable Crossover', 'Chest', 'A cable machine chest isolation exercise.', NOW(), NOW()),
    ('05050505-0505-0505-0505-050505050505', 'Preacher Curl', 'Arms', 'A bicep curl variation using a preacher bench.', NOW(), NOW()),
    ('06060606-0606-0606-0606-060606060606', 'Concentration Curl', 'Arms', 'A strict bicep curl variation.', NOW(), NOW()),
    ('07070707-0707-0707-0707-070707070707', 'Cable Tricep Pushdown', 'Arms', 'A cable machine triceps exercise.', NOW(), NOW()),
    ('08080808-0808-0808-0808-080808080808', 'Dumbbell Kickback', 'Arms', 'A triceps isolation exercise.', NOW(), NOW()),
    ('09090909-0909-0909-0909-090909090909', 'Shrug', 'Traps', 'An isolation exercise for trapezius.', NOW(), NOW()),
    ('10101010-1010-1010-1010-101010101010', 'Good Morning', 'Lower Back', 'A hip hinge exercise for lower back and hamstrings.', NOW(), NOW()),
    ('11112222-3333-4444-5555-666677778888', 'Bulgarian Split Squat', 'Legs', 'A single-leg squat variation for quads and glutes.', NOW(), NOW()),
    ('12123334-3434-4545-5656-676778788989', 'Romanian Deadlift', 'Legs', 'A deadlift variation for hamstrings and glutes.', NOW(), NOW()),
    ('13134445-4545-5656-6767-787889899090', 'Hip Abduction', 'Glutes', 'A machine or band exercise for glute medius.', NOW(), NOW()),
    ('14145556-5656-6767-7878-899090909090', 'Hip Adduction', 'Legs', 'A machine exercise for inner thighs.', NOW(), NOW()),
    ('15156667-6767-7878-8989-909090909090', 'Step Up', 'Legs', 'A unilateral leg exercise using a bench or box.', NOW(), NOW()),
    ('16167778-7878-8989-9090-909090909090', 'Cable Row', 'Back', 'A cable machine horizontal pulling exercise.', NOW(), NOW()),
    ('17178889-8989-9090-9090-909090909090', 'Chest Press Machine', 'Chest', 'A machine-based chest press.', NOW(), NOW()),
    ('18189990-9090-9090-9090-909090909090', 'Pec Deck', 'Chest', 'A machine-based chest fly.', NOW(), NOW()),
    ('19190001-0001-0001-0001-000100010001', 'Ab Wheel Rollout', 'Abs', 'A core exercise using an ab wheel.', NOW(), NOW()),
    ('20201112-1212-2323-2323-343434343434', 'Hanging Leg Raise', 'Abs', 'A core exercise performed hanging from a bar.', NOW(), NOW())
ON CONFLICT (id) DO NOTHING; 