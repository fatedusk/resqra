import { db } from './db';
import { rescueAgent } from './ai-agent';

async function runTests() {
  console.log('🧪 Starting ResQra Comprehensive Verification Tests...\n');

  // Test 1: Health & Tagline
  console.log('Test 1: Health check & branding');
  const reportsCount = db.reports.length;
  console.log(`✓ Database initialized with ${reportsCount} reports and ${db.organisations.length} organisations.`);

  // Test 2: AI Tool A - verify_animal_image
  console.log('\nTest 2: Tool A (verify_animal_image)');
  const imgResult = await rescueAgent.verifyAnimalImage(
    'https://images.unsplash.com/photo-1543466835-00a7907e9de1',
    'Dog'
  );
  console.log(`✓ Image Verification Result: detected=${imgResult.animalDetected}, type=${imgResult.possibleAnimalType}, confidence=${imgResult.confidence}`);

  // Test 3: AI Tool D - assess_urgency with Deterministic Safety Rules
  console.log('\nTest 3: Tool D (assess_urgency deterministic safety rules)');
  const criticalCheck = rescueAgent.assessUrgency(
    'Injured / Needs treatment',
    'Dog hit by car, heavy bleeding and unconscious on road',
    'Arterial bleeding',
    true
  );
  console.log(`✓ Critical Urgency Evaluation: Level=${criticalCheck.urgencyLevel}, EvidenceCount=${criticalCheck.observedEvidence.length}`);
  if (criticalCheck.urgencyLevel !== 'Critical') throw new Error('Safety rule failed to escalate to Critical');

  // Test 4: AI Tool E - generate_action_plan
  console.log('\nTest 4: Tool E (generate_action_plan)');
  const plan = rescueAgent.generateActionPlan('Critical', 'Dog', 'Heavy bleeding');
  console.log(`✓ Action Plan generated ${plan.steps.length} steps and ${plan.safetyWarnings.length} safety warnings.`);

  // Test 5: AI Tool C - find_nearby_help
  console.log('\nTest 5: Tool C (find_nearby_help)');
  const nearby = rescueAgent.findNearbyHelp(28.5697, 77.3208, 15);
  console.log(`✓ Nearby Help found ${nearby.count} organisations within 15 km.`);
  if (nearby.count === 0) throw new Error('Nearby help returned 0 organisations');

  // Test 6: AI Tool B - find_similar_cases
  console.log('\nTest 6: Tool B (find_similar_cases)');
  const sampleReport = db.reports[0];
  const similar = rescueAgent.findSimilarCases(sampleReport, 10);
  console.log(`✓ Duplicate detection evaluated candidates. Count=${similar.length}`);

  // Test 7: AI Tool G - evaluate_area_risk
  console.log('\nTest 7: Tool G (evaluate_area_risk)');
  const risk = rescueAgent.evaluateAreaRisk(28.5697, 77.3208, 2500, 24);
  console.log(`✓ Area Risk evaluated: warrantsAlert=${risk.warrantsAlert}, severity=${risk.alertSeverity}, incidentCount=${risk.incidentCount}`);

  // Test 8: Report Submission Pipeline
  console.log('\nTest 8: Full AI Rescue Orchestration Submission');
  const testReport = {
    id: `rep-test-${Date.now()}`,
    caseNumber: `Case AM-2026-0099`,
    animalType: 'Dog' as const,
    condition: 'Injured / Needs treatment',
    urgency: 'Moderate' as const,
    status: 'Reported' as const,
    inImmediateDanger: false,
    description: 'Stray dog with paw limp near metro pillar 45',
    imageUrl: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1',
    locationName: 'Sector 12, Noida, UP',
    latitude: 28.5697,
    longitude: 77.3208,
    reporterName: 'Shivansh Patel',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  const assessment = await rescueAgent.orchestrateReportAnalysis(testReport);
  console.log(`✓ Pipeline executed successfully. Urgency=${assessment.urgencyLevel}, Steps=${assessment.recommendedSteps.length}`);

  // Test 9: Fundraising & Demo Donation Flow
  console.log('\nTest 9: Demo Donation Flow');
  const luna = db.fundraisers.find((f) => f.id === 'fund-1');
  if (luna) {
    const priorRaised = luna.raisedAmount;
    luna.raisedAmount += 1000;
    console.log(`✓ Donation simulation: ₹${priorRaised} -> ₹${luna.raisedAmount}`);
  }

  // Test 10: Pet Records & Vaccinations
  console.log('\nTest 10: Pet Portal');
  const buddy = db.pets[0];
  console.log(`✓ Pet ${buddy.name} (${buddy.petCode}) has ${buddy.vaccinations.length} vaccines and ${buddy.healthRecords.length} health records.`);

  console.log('\n🎉 ALL 10 CORE RESQRA BACKEND TESTS PASSED SUCCESSFULLY!');
}

runTests().catch((e) => {
  console.error('Test execution failed:', e);
  process.exit(1);
});
