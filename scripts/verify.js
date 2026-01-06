import { Scheduler, STATUS } from '../src/logic/Scheduler.js';

const scenarios = [
    { id: 1, name: "14x7, Ind 5", config: { workDays: 14, restDays: 7, inductionDays: 5, totalDays: 40 } },
    { id: 2, name: "21x7, Ind 3", config: { workDays: 21, restDays: 7, inductionDays: 3, totalDays: 60 } },
    { id: 3, name: "10x5, Ind 2", config: { workDays: 10, restDays: 5, inductionDays: 2, totalDays: 30 } },
    { id: 4, name: "14x6, Ind 4", config: { workDays: 14, restDays: 6, inductionDays: 4, totalDays: 40 } },
    { id: 5, name: "7x7, Ind 1", config: { workDays: 7, restDays: 7, inductionDays: 1, totalDays: 30 } },
];

console.log("=== RUNNING VERIFICATION ===");

scenarios.forEach(scenario => {
    console.log(`\nTesting ${scenario.name}...`);
    const scheduler = new Scheduler(scenario.config);
    const result = scheduler.generate();

    if (!result.s2[0] && !result.s2[10]) {
        console.log("FAILED to generate S2/S3 (No valid solution found)");
        return;
    }

    // Check Error Count
    const errorCount = result.errors.length;
    console.log(`Errors found: ${errorCount}`);
    if (errorCount > 0) {
        console.log("First 3 errors:", result.errors.slice(0, 3));
    } else {
        console.log("SUCCESS: No errors.");
    }

    // Detailed Day 15 Check for Case 1
    if (scenario.id === 1) {
        console.log("Day 15 Status:");
        console.log(`S1: ${result.s1[15]}`);
        console.log(`S2: ${result.s2[15]}`);
        console.log(`S3: ${result.s3[15]}`);
    }
});
