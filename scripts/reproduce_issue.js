
import { Scheduler } from '../src/logic/Scheduler.js';

const config = {
    workDays: 14,
    restDays: 7,
    inductionDays: 5,
    totalDays: 60
};

console.log("Running Scheduler with config:", config);
const scheduler = new Scheduler(config);
const result = scheduler.generate();

const { s1, s2, s3, errors } = result;

console.log("Schedule Generated.");
// Helper to print first N days
const printSchedule = (label, arr) => {
    console.log(`${label}: ${arr.slice(0, 60).join(' ')} ...`);
};

printSchedule("S1", s1);
printSchedule("S2", s2);
printSchedule("S3", s3);

// Verify S2 segment length
let currentRun = 0;
let maxRun = 0;
for (let i = 0; i < s2.length; i++) {
    if (s2[i] === 'P') {
        currentRun++;
    } else {
        if (currentRun > maxRun) maxRun = currentRun;
        currentRun = 0;
    }
}
if (currentRun > maxRun) maxRun = currentRun;

console.log(`Max contiguous P days for S2: ${maxRun}`);

const expectedMaxP = config.workDays - 1 - config.inductionDays; // 14 - 1 - 2 = 11
if (maxRun > expectedMaxP) {
    console.error(`FAILURE: S2 exceeded max P days. Expected <= ${expectedMaxP}, Got ${maxRun}`);
} else {
    console.log(`SUCCESS: S2 respected max P days limit of ${expectedMaxP}.`);
}

// Check for coverage gaps
let gapCount = 0;
for (let i = 0; i < 40; i++) {
    let pCount = 0;
    if (s1[i] === 'P') pCount++;
    if (s2[i] === 'P') pCount++;
    if (s3[i] === 'P') pCount++;

    if (pCount < 2) {
        // Only count gaps after initial ramp up period
        if (i > 10) {
            gapCount++;
            console.log(`Gap at day ${i}: P=${pCount} (S1=${s1[i]}, S2=${s2[i]}, S3=${s3[i]})`);
        }
    }
}
console.log(`Coverage gaps found (day 10-40): ${gapCount}`);
