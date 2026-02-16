export function fizzBuzzFlexible(n = 100, conditions = { 3: 'fizz', 5: 'buzz' }) {
    const result = [];
    for (let i = 1; i <= n; i++) {
        let output = '';
        for (const key in conditions) {
            if (i % Number(key) === 0) output += conditions[key];
        }
        result.push(output || i.toString());
    }
    return result;
}
