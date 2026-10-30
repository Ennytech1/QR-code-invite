const testCrypto = require('./crypto.test');
const testLock = require('./lock.test');
const testApi = require('./api.test');
const testConcurrencyAndStress = require('./concurrency_stress.test');
const testAdversarialForgeryAndReplay = require('./adversarial_forgery_replay.test');

async function runAll() {
  console.log('====================================================');
  console.log('🚀 QRINVITE INSTITUTIONAL ENGINE - FULL TEST HARNESS');
  console.log('====================================================\n');

  try {
    await testCrypto();
    await testLock();
    await testApi();
    await testConcurrencyAndStress();
    await testAdversarialForgeryAndReplay();

    console.log('====================================================');
    console.log('🎉 ALL BACKEND & CRYPTOGRAPHIC TEST SUITES PASSED (0 FAILURES)');
    console.log('====================================================\n');
    process.exit(0);
  } catch (err) {
    console.error('❌ Test execution encountered unhandled error:', err);
    process.exit(1);
  }
}

runAll();
