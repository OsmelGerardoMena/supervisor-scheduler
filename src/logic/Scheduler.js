/**
 * Status Codes
 * S = Subida (1 day)
 * I = Induccion (1-5 days)
 * P = Perforacion
 * B = Bajada (1 day)
 * D = Descanso
 */

export const STATUS = {
    S: 'S',
    I: 'I',
    P: 'P',
    B: 'B',
    D: 'D',
    HOME: 'H'
};

class FillingAgent {
    constructor(id, config) {
        this.id = id;
        this.inductionDuration = parseInt(config.inductionDays);
        this.minRest = 1;

        // State
        this.state = STATUS.HOME;
        this.daysInState = 0;
        this.inducted = false;
    }

    getStatus() {
        return this.state === STATUS.HOME ? STATUS.D : this.state;
    }

    tick(needP, excessP) {
        this.daysInState++;
        let next = this.state;

        switch (this.state) {
            case STATUS.HOME:
            case STATUS.D:
                if (needP) {
                    next = STATUS.S;
                    this.daysInState = 0;
                } else {
                    next = STATUS.D;
                }
                break;

            case STATUS.S:
                if (!this.inducted && this.inductionDuration > 0) {
                    next = STATUS.I;
                    this.daysInState = 0;
                    this.inducted = true;
                } else {
                    next = STATUS.P;
                    this.daysInState = 0;
                }
                break;

            case STATUS.I:
                if (this.daysInState >= this.inductionDuration) {
                    next = STATUS.P;
                    this.daysInState = 0;
                }
                break;

            case STATUS.P:
                if (excessP) {
                    next = STATUS.B;
                    this.daysInState = 0;
                }
                break;

            case STATUS.B:
                next = STATUS.D;
                this.daysInState = 0;
                break;
        }

        this.state = next;
        return this.getStatus();
    }
}

export class Scheduler {
    constructor(config) {
        this.config = config;
        this.workDays = parseInt(config.workDays);
        this.restDays = parseInt(config.restDays);
        this.inductionDays = parseInt(config.inductionDays);
        this.totalDays = parseInt(config.totalDays) || 90;
    }

    generate() {
        const s1 = this.generateS1();
        const s2Arr = [];
        const s3Arr = [];

        // Agents
        const a2 = new FillingAgent('S2', this.config);
        a2.state = STATUS.S;
        const a3 = new FillingAgent('S3', this.config);

        // Simulation
        for (let day = 0; day < this.totalDays; day++) {
            s2Arr[day] = a2.getStatus();
            s3Arr[day] = a3.getStatus();

            if (day + 1 >= this.totalDays) break;

            // Lead Times: S->...->P.
            // Using Lead = I + 2 (Lead 7 for I=5).
            // Trigger Day X -> Arrive Morning X+7 (P).
            // Target 14 -> Trigger 7. Arrive 14P.
            const lead2 = 1 + (a2.inducted ? 0 : this.inductionDays) + 1;
            const lead3 = 1 + (a3.inducted ? 0 : this.inductionDays) + 1;

            let demandForA2 = this.isGapProjected(day, lead2, s1, a2, a3);
            let demandForA3 = this.isGapProjected(day, lead3, s1, a3, a2);

            let s2Excess = this.checkExcess(day + 1, s1, a2, a3);
            let s3Excess = this.checkExcess(day + 1, s1, a3, a2);

            if (s2Excess && s3Excess) {
                if (a2.state === STATUS.P && a3.state === STATUS.P) {
                    if (a2.daysInState >= a3.daysInState) {
                        s3Excess = false;
                    } else {
                        s2Excess = false;
                    }
                }
            }

            if (day >= 6 && day <= 9) {
                // Debug logs removed
            }

            a2.tick(demandForA2, s2Excess);
            a3.tick(demandForA3, s3Excess);
        }

        return { s1, s2: s2Arr, s3: s3Arr, errors: this.validate(s1, s2Arr, s3Arr) };
    }

    isGapProjected(currentDay, leadTime, s1, me, other) {
        if (me.state !== STATUS.HOME && me.state !== STATUS.D) return false;

        const target = currentDay + leadTime;
        if (target >= this.totalDays) return false;

        const s1P = (s1[target] === STATUS.P ? 1 : 0);

        let otherP = 0;
        if (other.state === STATUS.P) {
            otherP = 1;
        } else if (other.state === STATUS.S || other.state === STATUS.I) {
            otherP = 1;
        }

        return (s1P + otherP) < 2;
    }

    checkExcess(nextDay, s1, me, other) {
        if (nextDay >= this.totalDays) return false;
        if (me.state !== STATUS.P) return false;

        const s1P = (s1[nextDay] === STATUS.P ? 1 : 0);

        const otherWillBeP = (
            other.state === STATUS.P ||
            (other.state === STATUS.I && other.daysInState >= other.inductionDuration) ||
            (other.state === STATUS.S && other.inductionDuration === 0)
        );

        const otherP = otherWillBeP ? 1 : 0;

        const total = s1P + 1 + otherP;

        return total > 2;
    }

    generateS1() {
        const arr = [];
        let day = 0;

        const cycle1P = this.workDays - 1 - this.inductionDays;

        arr[day++] = STATUS.S;
        for (let i = 0; i < this.inductionDays; i++) arr[day++] = STATUS.I;
        for (let i = 0; i < cycle1P; i++) arr[day++] = STATUS.P;
        arr[day++] = STATUS.B;
        const rest1 = this.restDays - 2;
        for (let i = 0; i < rest1; i++) arr[day++] = STATUS.D;

        const cycle2P = this.workDays - 1;

        while (day < this.totalDays) {
            arr[day++] = STATUS.S;
            if (day >= this.totalDays) break;

            for (let i = 0; i < cycle2P && day < this.totalDays; i++) arr[day++] = STATUS.P;

            if (day >= this.totalDays) break;
            arr[day++] = STATUS.B;

            for (let i = 0; i < rest1 && day < this.totalDays; i++) arr[day++] = STATUS.D;
        }
        return arr;
    }

    validate(s1, s2, s3) {
        const errors = [];

        const checkPattern = (s, label) => {
            for (let i = 0; i < this.totalDays - 1; i++) {
                const curr = s[i];
                const next = s[i + 1];
                if (!curr || !next) continue;

                if (curr === STATUS.S && next === STATUS.S) {
                    errors.push({ day: i + 1, msg: `${label}: Subida consecutiva (S->S)` });
                }
                if (curr === STATUS.S && next === STATUS.B) {
                    errors.push({ day: i + 1, msg: `${label}: Bajada inmediata (S->B)` });
                }
                if (curr === STATUS.D && next === STATUS.S) {
                    // Correct pattern
                }
                if (curr === STATUS.P && next === STATUS.P) {
                    // Correct pattern
                }
                // Check S-D (Wait, S->I or S->P). S->D is bad?
                if (curr === STATUS.S && next === STATUS.D) {
                    errors.push({ day: i + 1, msg: `${label}: Subida a Descanso (S->D)` });
                }
            }
        };

        checkPattern(s1, 'S1');
        checkPattern(s2, 'S2');
        checkPattern(s3, 'S3');

        for (let i = 0; i < this.totalDays; i++) {
            let p = 0;
            if (s1[i] === STATUS.P) p++;
            if (s2[i] === STATUS.P) p++;
            if (s3[i] === STATUS.P) p++;

            if (p > 2) errors.push({ day: i, msg: `Exceso: ${p} perforando (Max 2)` });

            const threshold = this.inductionDays + 5;

            if (i > threshold) {
                if (p < 2) errors.push({ day: i, msg: `Falta Personal: ${p} perforando (Min 2)` });
            }
        }
        return errors;
    }
}
