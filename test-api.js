#!/usr/bin/env node

/**
 * API Testing Script for Rapid Launch Agent
 * Tests all major endpoints to ensure the system is working correctly
 */

import axios from 'axios';

const API_URL = process.env.API_URL || 'http://localhost:5000/api';
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
};

let totalTests = 0;
let passedTests = 0;
let failedTests = 0;

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function logTest(name, passed, details = '') {
  totalTests++;
  if (passed) {
    passedTests++;
    log(`✓ ${name}`, 'green');
  } else {
    failedTests++;
    log(`✗ ${name}`, 'red');
  }
  if (details) {
    log(`  ${details}`, 'yellow');
  }
}

async function testHealthCheck() {
  log('\n📋 Testing Health Check...', 'blue');
  try {
    const response = await axios.get(`${API_URL}/health`);
    logTest('Health check endpoint', response.status === 200);
    logTest('Returns correct status', response.data.status === 'ok');
    logTest('Returns version info', !!response.data.version);
    log(`  Version: ${response.data.version}`, 'yellow');
  } catch (error) {
    logTest('Health check endpoint', false, error.message);
  }
}

async function testOfferAnalysis() {
  log('\n🎯 Testing Offer Analysis...', 'blue');

  const testOffer = {
    targetMarket: 'B2B SaaS founders with $100K-$1M ARR',
    pressingProblem: 'Struggling to scale marketing efforts efficiently',
    desiredOutcome: 'Predictable lead generation system',
    productDescription: 'AI-powered marketing automation platform',
    productPromise: '10X your leads in 90 days',
    proofElements: '50+ case studies, 4.8/5 rating',
    pricing: '$997/month',
    guarantee: '90-day money-back guarantee',
  };

  try {
    const response = await axios.post(`${API_URL}/analyze/offer`, testOffer, {
      timeout: 60000, // 60 seconds for AI generation
    });

    logTest('Offer analysis endpoint responds', response.status === 200);
    logTest('Returns EYO scores', !!response.data.eyoScores);

    if (response.data.eyoScores) {
      const scores = response.data.eyoScores;
      logTest('Has clarityOfOutcome score', typeof scores.clarityOfOutcome?.score === 'number');
      logTest('Has gravityOfProblem score', typeof scores.gravityOfProblem?.score === 'number');
      logTest('Has beliefInDiagnosis score', typeof scores.beliefInDiagnosis?.score === 'number');
      logTest('Has naturalFit score', typeof scores.naturalFit?.score === 'number');
      logTest('Has clearOffer score', typeof scores.clearOffer?.score === 'number');
      logTest('Has total score', typeof scores.totalScore === 'number');

      log(`  Total EYO Score: ${scores.totalScore}/50`, 'yellow');
    }

    logTest('Returns recommendations', Array.isArray(response.data.recommendations));
    if (response.data.recommendations) {
      log(`  Generated ${response.data.recommendations.length} recommendations`, 'yellow');
    }
  } catch (error) {
    if (error.code === 'ECONNREFUSED') {
      logTest('Offer analysis endpoint', false, 'Server not running. Start with: npm run dev');
    } else if (error.response?.status === 401) {
      logTest('Offer analysis endpoint', false, 'Authentication required. Set NODE_ENV=development in .env');
    } else {
      logTest('Offer analysis endpoint', false, error.message);
    }
  }
}

async function testAvatarAnalysis() {
  log('\n👤 Testing Avatar Analysis...', 'blue');

  const testAvatar = {
    demographics: {
      ageRange: '35-50',
      gender: 'All',
      location: 'Urban USA',
      incomeRange: '$100K-$200K',
      education: 'College degree',
      occupation: 'SaaS founders',
    },
    webAnalysis: {
      wants: ['Scale their business', 'More predictable revenue'],
      emotions: ['Frustrated', 'Hopeful'],
      beliefs: ['Marketing is expensive', 'Need better systems'],
      dominantEmotion: 'Frustration',
    },
    empathyMap: {
      seeing: ['Competitors growing faster'],
      hearing: ['Need to scale marketing'],
      saying: ['We need more leads'],
      thinking: ['How can we grow predictably?'],
      feeling: ['Overwhelmed by options'],
      doing: ['Testing various tools'],
    },
    goalsGrid: {
      painsAndFrustrations: ['Inconsistent lead flow'],
      fearsAndImplications: ['Falling behind competitors'],
      goalsAndDesires: ['Predictable growth'],
      dreamsAndAspirations: ['Build a category leader'],
    },
    primaryCurrency: 'Time',
    millionDollarMessage: 'I help SaaS founders achieve predictable growth without burning out',
  };

  try {
    const response = await axios.post(`${API_URL}/analyze/avatar`, testAvatar, {
      timeout: 120000, // 120 seconds for swarm analysis
    });

    logTest('Avatar analysis endpoint responds', response.status === 200);
    logTest('Returns 6 Beliefs analysis', !!response.data.beliefs);

    if (response.data.beliefs) {
      const beliefs = response.data.beliefs;
      logTest('Has outcome belief', !!beliefs.outcome);
      logTest('Has identity belief', !!beliefs.identity);
      logTest('Has problem belief', !!beliefs.problem);
      logTest('Has solution belief', !!beliefs.solution);
      logTest('Has product belief', !!beliefs.product);
      logTest('Has credibility belief', !!beliefs.credibility);
    }

    logTest('Returns enhanced WEB analysis', !!response.data.webAnalysis);
    logTest('Returns empathy map', !!response.data.empathyMap);
    logTest('Returns goals grid', !!response.data.goalsGrid);
  } catch (error) {
    if (error.code === 'ECONNREFUSED') {
      logTest('Avatar analysis endpoint', false, 'Server not running. Start with: npm run dev');
    } else if (error.response?.status === 401) {
      logTest('Avatar analysis endpoint', false, 'Authentication required. Set NODE_ENV=development in .env');
    } else {
      logTest('Avatar analysis endpoint', false, error.message);
    }
  }
}

async function testErrorHandling() {
  log('\n⚠️  Testing Error Handling...', 'blue');

  // Test 404 for non-existent endpoint
  try {
    await axios.get(`${API_URL}/nonexistent`);
    logTest('404 for non-existent endpoint', false);
  } catch (error) {
    logTest('404 for non-existent endpoint', error.response?.status === 404);
  }

  // Test validation error for offer analysis
  try {
    await axios.post(`${API_URL}/analyze/offer`, {});
    logTest('Validation error for empty offer', false);
  } catch (error) {
    logTest('Validation error for empty offer', error.response?.status === 400);
  }
}

async function runTests() {
  log('\n═══════════════════════════════════════', 'blue');
  log('  Rapid Launch Agent API Test Suite', 'blue');
  log('═══════════════════════════════════════\n', 'blue');

  await testHealthCheck();
  await testOfferAnalysis();
  await testAvatarAnalysis();
  await testErrorHandling();

  // Summary
  log('\n═══════════════════════════════════════', 'blue');
  log('  Test Summary', 'blue');
  log('═══════════════════════════════════════', 'blue');
  log(`Total Tests: ${totalTests}`);
  log(`Passed: ${passedTests}`, 'green');
  log(`Failed: ${failedTests}`, failedTests > 0 ? 'red' : 'green');
  log(`Success Rate: ${((passedTests / totalTests) * 100).toFixed(1)}%`, failedTests > 0 ? 'yellow' : 'green');
  log('═══════════════════════════════════════\n', 'blue');

  process.exit(failedTests > 0 ? 1 : 0);
}

runTests().catch((error) => {
  log(`\n❌ Test suite failed: ${error.message}`, 'red');
  process.exit(1);
});
