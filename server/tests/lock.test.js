const assert = require('assert');
const lockService = require('../services/lockService');

async function testLock() {
  console.log('🧪 Testing Concurrency Mutex Service...\n');
  let passed = 0;
  let failed = 0;

  try {
    const testTicketId = 'tkt_concurrency_test_' + Date.now();

    // 1. First lock acquisition
    console.log('  1. Acquiring lock on ticket...');
    const lock1 = await lockService.acquireLock(testTicketId, 'gate_north_1', 2);
    assert.strictEqual(lock1, true, 'First lock attempt must succeed');
    console.log('  ✅ Lock acquired successfully.');
    passed++;

    // 2. Mutual exclusion (simultaneous second attempt must fail)
    console.log('  2. Attempting second simultaneous lock...');
    const lock2 = await lockService.acquireLock(testTicketId, 'gate_south_2', 2);
    assert.strictEqual(lock2, false, 'Simultaneous lock attempt on same ticket must fail');
    console.log('  ✅ Mutual exclusion verified (rejected simultaneous lock).');
    passed++;

    // 3. Lock release
    console.log('  3. Releasing lock...');
    await lockService.releaseLock(testTicketId);
    const lock3 = await lockService.acquireLock(testTicketId, 'gate_south_2', 2);
    assert.strictEqual(lock3, true, 'Lock must be acquirable after release');
    console.log('  ✅ Lock released and re-acquired successfully.');
    passed++;

    // Cleanup
    await lockService.releaseLock(testTicketId);

  } catch (err) {
    console.error('  ❌ Lock Test Failure:', err);
    failed++;
  }

  console.log(`\nLock Tests: ${passed} Passed, ${failed} Failed\n`);
  if (failed > 0) process.exit(1);
}

if (require.main === module) {
  testLock();
}

module.exports = testLock;
