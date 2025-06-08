import { baseHedgehogSchema, hedgehogSchema, newHedgehogSchema } from './hedgehog';

describe('baseHedgehogSchema', () => {
    it('validates a correct base hedgehog', () => {
        const result = baseHedgehogSchema.safeParse({
            id: 1,
            name: "Simo Siili"
        });
        expect(result.success).toBe(true);
    });

    it('fails if name contains special characters', () => {
        const result = baseHedgehogSchema.safeParse({
            id: 1,
            name: "cat /etc/passwd"
        });
        expect(result.success).toBe(false);
        expect(result.error?.errors[0].message).toMatch(/Only letters and spaces/);
    });

    it('fails if name is too long', () => {
        const result = baseHedgehogSchema.safeParse({
            id: 1,
            name: "A".repeat(33)
        });
        expect(result.success).toBe(false);
    });
});

describe('hedgehogSchema', () => {
    it('validates a full valid hedgehog', () => {
        const result = hedgehogSchema.safeParse({
            id: 2,
            name: "Sonic",
            age: 10,
            sex: "male",
            coordinates: [61.721332038988294, 23.731457256202372]
        });
        expect(result.success).toBe(true);
    });

    it('fails with invalid age', () => {
        const result = hedgehogSchema.safeParse({
            id: 2,
            name: "Siiri",
            age: 120,
            sex: "female",
            coordinates: [61, 23]
        });
        expect(result.success).toBe(false);
    });

    it('fails with invalid coordinates', () => {
        const result = hedgehogSchema.safeParse({
            id: 3,
            name: "Teppo",
            age: 15,
            sex: "unknown",
            coordinates: [300, 91]
        });
        expect(result.success).toBe(false);
    });

    it('fails with invalid sex', () => {
        const result = hedgehogSchema.safeParse({
            id: 4,
            name: "Simo",
            age: 8,
            sex: "other",
            coordinates: [60, 24]
        });
        expect(result.success).toBe(false);
    });

    it('fails if extra field is added', () => {
        const result = hedgehogSchema.safeParse({
            id: 4,
            name: "Simo Siili",
            age: 8,
            sex: "male",
            coordinates: [60, 24],
            attack: "cat /etc/passwd"
        });
        expect(result.success).toBe(false);
    });
});

describe('newHedgehogSchema', () => {
    it('validates new hedgehog without id', () => {
        const result = newHedgehogSchema.safeParse({
            name: "Simo Siili",
            age: 5,
            sex: "male",
            coordinates: [61, 23]
        });
        expect(result.success).toBe(true);
    });

    it('fails if id is present in new hedgehog', () => {
        const result = newHedgehogSchema.safeParse({
            id: 123,
            name: "Simo Siili",
            age: 4,
            sex: "female",
            coordinates: [24, 60]
        });
        expect(result.success).toBe(false); // because id should not be present
    });
});