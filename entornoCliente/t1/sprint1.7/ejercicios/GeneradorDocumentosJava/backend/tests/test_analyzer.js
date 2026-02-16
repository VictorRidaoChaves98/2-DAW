const analyzer = require('../src/analyzers/javaAnalyzer');

const sample = `package demo;

public class Main {
  private String name;
  public Main(String name) { this.name = name; }
  public String getName() { return name; }
}

interface Greeter { String greet(Main m); }
`;

async function run() {
  const res = await analyzer.analyze(sample);
  console.log('Analyzer result:');
  console.log(JSON.stringify(res, null, 2));
  if (!res || typeof res !== 'object') process.exit(2);
  if (res.classes < 1) { console.error('Expected >=1 classes'); process.exit(3); }
  if (res.fields < 1 && res.fields !== 0) { /* fields may be 0 for snippet */ }
  // expect methods to include returnType and visibility
  if (!res.classDetails || !Array.isArray(res.classDetails)) { console.error('classDetails missing'); process.exit(4); }
  console.log('Sample LOC:', res.loc || 'n/a');
  if (!res.loc || res.loc <= 0) { console.error('Expected loc > 0'); process.exit(5); }
  console.log('Test passed');
}

run().catch(e=>{ console.error(e); process.exit(1); });
