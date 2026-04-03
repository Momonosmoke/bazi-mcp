import assert from 'node:assert/strict';
import test from 'node:test';
import { decideInferenceAction } from './inferencePolicy.js';

test('infer domains from question and return story blueprint', () => {
  const result = decideInferenceAction({
    round: 1,
    totalQuestionsAsked: 0,
    userQuestion: 'Chuyen tinh cam va su nghiep cua em sap toi ra sao?',
    claims: [{ claimId: 'c1', confidence: 0.52, evidenceFromChart: true }],
    candidateQuestions: [],
  });

  assert.equal(result.action, 'abstain');
  assert.equal(result.actionVi, 'tam_dung');
  assert.ok(result.crossDomainInsights.focusDomains.includes('phu_the'));
  assert.ok(result.crossDomainInsights.focusDomains.includes('quan_loc'));
  assert.equal(result.storyBlueprint.question, 'Chuyen tinh cam va su nghiep cua em sap toi ra sao?');
  assert.ok(result.storyBlueprint.seedDomains.includes('phu_the'));
  assert.ok(result.storyBlueprint.seedDomains.includes('quan_loc'));
});

test('prioritize question with linked domains when confidence gain is similar', () => {
  const result = decideInferenceAction({
    round: 1,
    totalQuestionsAsked: 0,
    userQuestion: 'Tinh cam co bi anh huong bo me khong?',
    claims: [{ claimId: 'c1', confidence: 0.6, evidenceFromChart: true, domains: ['phu_the'] }],
    candidateQuestions: [
      {
        questionId: 'q_unrelated',
        questionText: 'Cong viec co doi moi khong?',
        claimIds: ['c1'],
        expectedConfidenceGain: 0.2,
        scope: 'present',
        domains: ['quan_loc'],
      },
      {
        questionId: 'q_linked',
        questionText: 'Gia dinh hai ben tac dong den quyet dinh tinh cam khong?',
        claimIds: ['c1'],
        expectedConfidenceGain: 0.19,
        scope: 'present',
        domains: ['phu_mau'],
      },
    ],
  });

  assert.equal(result.action, 'ask');
  assert.equal(result.selectedQuestions[0]?.questionId, 'q_linked');
  assert.ok(result.crossDomainInsights.focusDomains.includes('phu_mau'));
});
