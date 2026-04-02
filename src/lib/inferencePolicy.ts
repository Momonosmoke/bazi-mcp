export const CONFIDENCE_THRESHOLD = 0.8;
export const MAX_ROUNDS = 2;
export const MAX_QUESTIONS_PER_ROUND = 3;
export const MAX_TOTAL_QUESTIONS = 6;

export type Domain = 'tai_chinh' | 'to_tien' | 'bo_me' | 'vo_chong' | 'con_cai' | 'su_nghiep' | 'suc_khoe';

export type CrossLink = {
  sourceDomain: Domain;
  targetDomain: Domain;
  weight: number;
  reason?: string;
};

export type Claim = {
  claimId: string;
  confidence: number;
  evidenceFromChart: boolean;
  domains?: Domain[];
};

export type QuestionScope = 'past' | 'present';

export type CandidateQuestion = {
  questionId: string;
  questionText: string;
  claimIds: string[];
  expectedConfidenceGain: number;
  scope?: QuestionScope;
  domains?: Domain[];
};

export type PolicyInput = {
  round: number;
  totalQuestionsAsked: number;
  askedPastQuestions?: number;
  askedPresentQuestions?: number;
  pastValidationScore?: number;
  presentStateClarity?: number;
  claims: Claim[];
  targetClaimIds?: string[];
  crossLinks?: CrossLink[];
  candidateQuestions?: CandidateQuestion[];
};

export type QuestionMix = {
  strategy: 'past_heavy' | 'balanced' | 'present_heavy';
  strategyVi: 'uu_tien_qua_khu' | 'can_bang' | 'uu_tien_hien_tai';
  scores: {
    pastValidationScore: number;
    presentStateClarity: number;
  };
  targetTotals: {
    past: number;
    present: number;
  };
  remainingTargets: {
    past: number;
    present: number;
  };
  suggestedThisRound: {
    past: number;
    present: number;
  };
};

export type PolicyOutput = {
  action: 'conclude' | 'ask' | 'abstain';
  actionVi: 'ket_luan' | 'hoi_them' | 'tam_dung';
  threshold: number;
  unresolvedClaimIds: string[];
  concludedClaimIds: string[];
  selectedQuestions: CandidateQuestion[];
  crossDomainInsights: {
    focusDomains: Domain[];
    relatedDomains: Array<{ domain: Domain; score: number }>;
    note: string;
  };
  questionMix: QuestionMix;
  reason: string;
  limits: {
    maxRounds: number;
    maxQuestionsPerRound: number;
    maxTotalQuestions: number;
  };
};

const clampConfidence = (value: number) => {
  if (Number.isNaN(value)) {
    return 0;
  }
  if (value < 0) {
    return 0;
  }
  if (value > 1) {
    return 1;
  }
  return value;
};

const normalizeWeight = (value: number) => {
  if (Number.isNaN(value)) {
    return 0;
  }
  if (value < 0) {
    return 0;
  }
  if (value > 1) {
    return 1;
  }
  return value;
};

const getMixPlan = (pastValidationScore: number) => {
  if (pastValidationScore < 0.6) {
    return {
      strategy: 'past_heavy' as const,
      targetTotals: { past: 4, present: 2 },
    };
  }
  if (pastValidationScore < 0.8) {
    return {
      strategy: 'balanced' as const,
      targetTotals: { past: 3, present: 3 },
    };
  }
  return {
    strategy: 'present_heavy' as const,
    targetTotals: { past: 2, present: 4 },
  };
};

const getStrategyVi = (strategy: QuestionMix['strategy']): QuestionMix['strategyVi'] => {
  if (strategy === 'past_heavy') {
    return 'uu_tien_qua_khu';
  }
  if (strategy === 'present_heavy') {
    return 'uu_tien_hien_tai';
  }
  return 'can_bang';
};

const getActionVi = (action: PolicyOutput['action']): PolicyOutput['actionVi'] => {
  if (action === 'conclude') {
    return 'ket_luan';
  }
  if (action === 'ask') {
    return 'hoi_them';
  }
  return 'tam_dung';
};

const buildCrossDomainInsights = (claims: Claim[], crossLinks: CrossLink[]) => {
  const focusDomainSet = new Set<Domain>();
  for (const claim of claims) {
    for (const domain of claim.domains ?? []) {
      focusDomainSet.add(domain);
    }
  }
  const focusDomains = Array.from(focusDomainSet);

  const relatedMap = new Map<Domain, number>();
  for (const link of crossLinks) {
    if (!focusDomainSet.has(link.sourceDomain) || focusDomainSet.has(link.targetDomain)) {
      continue;
    }
    const weight = normalizeWeight(link.weight);
    relatedMap.set(link.targetDomain, (relatedMap.get(link.targetDomain) ?? 0) + weight);
  }

  const relatedDomains = Array.from(relatedMap.entries())
    .map(([domain, score]) => ({ domain, score }))
    .sort((a, b) => b.score - a.score || a.domain.localeCompare(b.domain));

  if (focusDomains.length === 0) {
    return {
      focusDomains,
      relatedDomains,
      note: 'Chưa có dữ liệu miền liên kết chéo để ưu tiên.',
    };
  }

  return {
    focusDomains,
    relatedDomains,
    note: 'Đang ưu tiên câu hỏi có liên kết chéo giữa các mảng liên quan để tăng độ chính xác.',
  };
};

const buildEmptyQuestionMix = (
  pastValidationScore: number,
  presentStateClarity: number,
  strategy: 'past_heavy' | 'balanced' | 'present_heavy',
  targetTotals: { past: number; present: number },
): QuestionMix => ({
  strategy,
  strategyVi: getStrategyVi(strategy),
  scores: {
    pastValidationScore,
    presentStateClarity,
  },
  targetTotals,
  remainingTargets: {
    past: 0,
    present: 0,
  },
  suggestedThisRound: {
    past: 0,
    present: 0,
  },
});

const pickQuestions = (
  questions: CandidateQuestion[],
  count: number,
): { selected: CandidateQuestion[] } => {
  return { selected: questions.slice(0, count) };
};

export const decideInferenceAction = (input: PolicyInput): PolicyOutput => {
  const {
    round,
    totalQuestionsAsked,
    askedPastQuestions = 0,
    askedPresentQuestions = 0,
    pastValidationScore = 0.5,
    presentStateClarity = 0.5,
    claims,
    targetClaimIds = [],
    crossLinks = [],
    candidateQuestions = [],
  } = input;

  const normalizedPastScore = clampConfidence(pastValidationScore);
  const normalizedPresentClarity = clampConfidence(presentStateClarity);
  const mixPlan = getMixPlan(normalizedPastScore);

  const evidenceBackedClaims = claims
    .filter((claim) => claim.evidenceFromChart)
    .map((claim) => ({
      ...claim,
      confidence: clampConfidence(claim.confidence),
    }));

  const targetIds =
    targetClaimIds.length > 0 ? new Set(targetClaimIds) : new Set(evidenceBackedClaims.map((claim) => claim.claimId));

  const targetClaims = evidenceBackedClaims.filter((claim) => targetIds.has(claim.claimId));
  const allCrossDomainInsights = buildCrossDomainInsights(targetClaims, crossLinks);

  if (targetClaims.length === 0) {
    return {
      action: 'abstain',
      actionVi: getActionVi('abstain'),
      threshold: CONFIDENCE_THRESHOLD,
      unresolvedClaimIds: [],
      concludedClaimIds: [],
      selectedQuestions: [],
      crossDomainInsights: allCrossDomainInsights,
      questionMix: buildEmptyQuestionMix(
        normalizedPastScore,
        normalizedPresentClarity,
        mixPlan.strategy,
        mixPlan.targetTotals,
      ),
      reason: 'Chưa có giả thuyết nào đủ bằng chứng từ lá số. Tạm dừng để tránh suy diễn.',
      limits: {
        maxRounds: MAX_ROUNDS,
        maxQuestionsPerRound: MAX_QUESTIONS_PER_ROUND,
        maxTotalQuestions: MAX_TOTAL_QUESTIONS,
      },
    };
  }

  const concludedClaims = targetClaims.filter((claim) => claim.confidence >= CONFIDENCE_THRESHOLD);
  const unresolvedClaims = targetClaims.filter((claim) => claim.confidence < CONFIDENCE_THRESHOLD);
  const concludedClaimIds = concludedClaims.map((claim) => claim.claimId);
  const unresolvedClaimIds = unresolvedClaims.map((claim) => claim.claimId);
  const unresolvedCrossDomainInsights = buildCrossDomainInsights(unresolvedClaims, crossLinks);

  if (unresolvedClaimIds.length === 0) {
    return {
      action: 'conclude',
      actionVi: getActionVi('conclude'),
      threshold: CONFIDENCE_THRESHOLD,
      unresolvedClaimIds,
      concludedClaimIds,
      selectedQuestions: [],
      crossDomainInsights: unresolvedCrossDomainInsights,
      questionMix: buildEmptyQuestionMix(
        normalizedPastScore,
        normalizedPresentClarity,
        mixPlan.strategy,
        mixPlan.targetTotals,
      ),
      reason: 'Tất cả giả thuyết mục tiêu đã đạt ngưỡng tin cậy.',
      limits: {
        maxRounds: MAX_ROUNDS,
        maxQuestionsPerRound: MAX_QUESTIONS_PER_ROUND,
        maxTotalQuestions: MAX_TOTAL_QUESTIONS,
      },
    };
  }

  if (round > MAX_ROUNDS) {
    return {
      action: 'abstain',
      actionVi: getActionVi('abstain'),
      threshold: CONFIDENCE_THRESHOLD,
      unresolvedClaimIds,
      concludedClaimIds,
      selectedQuestions: [],
      crossDomainInsights: unresolvedCrossDomainInsights,
      questionMix: buildEmptyQuestionMix(
        normalizedPastScore,
        normalizedPresentClarity,
        mixPlan.strategy,
        mixPlan.targetTotals,
      ),
      reason: 'Đã vượt số vòng hỏi tối đa trước khi đạt ngưỡng tin cậy.',
      limits: {
        maxRounds: MAX_ROUNDS,
        maxQuestionsPerRound: MAX_QUESTIONS_PER_ROUND,
        maxTotalQuestions: MAX_TOTAL_QUESTIONS,
      },
    };
  }

  const remainingBudget = Math.max(0, MAX_TOTAL_QUESTIONS - Math.max(0, totalQuestionsAsked));
  if (remainingBudget === 0) {
    return {
      action: 'abstain',
      actionVi: getActionVi('abstain'),
      threshold: CONFIDENCE_THRESHOLD,
      unresolvedClaimIds,
      concludedClaimIds,
      selectedQuestions: [],
      crossDomainInsights: unresolvedCrossDomainInsights,
      questionMix: buildEmptyQuestionMix(
        normalizedPastScore,
        normalizedPresentClarity,
        mixPlan.strategy,
        mixPlan.targetTotals,
      ),
      reason: 'Đã dùng hết ngân sách câu hỏi trước khi đạt ngưỡng tin cậy.',
      limits: {
        maxRounds: MAX_ROUNDS,
        maxQuestionsPerRound: MAX_QUESTIONS_PER_ROUND,
        maxTotalQuestions: MAX_TOTAL_QUESTIONS,
      },
    };
  }

  const unresolvedSet = new Set(unresolvedClaimIds);
  const focusDomainSet = new Set(unresolvedCrossDomainInsights.focusDomains);
  const relatedDomainScore = new Map<Domain, number>();
  for (const item of unresolvedCrossDomainInsights.relatedDomains) {
    relatedDomainScore.set(item.domain, item.score);
  }

  const rankedQuestions = candidateQuestions
    .map((question) => {
      const domains = question.domains ?? [];
      const directBonus = domains.some((domain) => focusDomainSet.has(domain)) ? 0.08 : 0;
      const relatedBonus = Math.max(0, ...domains.map((domain) => (relatedDomainScore.get(domain) ?? 0) * 0.06));
      const expectedConfidenceGain = clampConfidence(question.expectedConfidenceGain);
      return {
        ...question,
        expectedConfidenceGain,
        scope: question.scope ?? 'past',
        domains,
        rankScore: expectedConfidenceGain + directBonus + relatedBonus,
      };
    })
    .filter((question) => question.claimIds.some((claimId) => unresolvedSet.has(claimId)))
    .sort((a, b) => {
      if (b.rankScore !== a.rankScore) {
        return b.rankScore - a.rankScore;
      }
      return a.questionId.localeCompare(b.questionId);
    });

  if (rankedQuestions.length === 0) {
    return {
      action: 'abstain',
      actionVi: getActionVi('abstain'),
      threshold: CONFIDENCE_THRESHOLD,
      unresolvedClaimIds,
      concludedClaimIds,
      selectedQuestions: [],
      crossDomainInsights: unresolvedCrossDomainInsights,
      questionMix: buildEmptyQuestionMix(
        normalizedPastScore,
        normalizedPresentClarity,
        mixPlan.strategy,
        mixPlan.targetTotals,
      ),
      reason: 'Không còn câu hỏi xác minh đủ giá trị để tăng độ tin cậy.',
      limits: {
        maxRounds: MAX_ROUNDS,
        maxQuestionsPerRound: MAX_QUESTIONS_PER_ROUND,
        maxTotalQuestions: MAX_TOTAL_QUESTIONS,
      },
    };
  }

  const roundSlots = Math.min(MAX_QUESTIONS_PER_ROUND, remainingBudget, rankedQuestions.length);
  const pastRemainingTarget = Math.max(0, mixPlan.targetTotals.past - Math.max(0, askedPastQuestions));
  const presentRemainingTarget = Math.max(0, mixPlan.targetTotals.present - Math.max(0, askedPresentQuestions));

  const pastCandidates = rankedQuestions.filter((question) => question.scope === 'past');
  const presentCandidates = rankedQuestions.filter((question) => question.scope === 'present');

  const pastPickCount = Math.min(roundSlots, pastRemainingTarget, pastCandidates.length);
  const presentPickCount = Math.min(roundSlots - pastPickCount, presentRemainingTarget, presentCandidates.length);

  const pastPicked = pickQuestions(pastCandidates, pastPickCount);
  const presentPicked = pickQuestions(presentCandidates, presentPickCount);

  const selectedQuestions = [...pastPicked.selected, ...presentPicked.selected];
  const selectedIds = new Set(selectedQuestions.map((question) => question.questionId));

  if (selectedQuestions.length < roundSlots) {
    const fallback = rankedQuestions
      .filter((question) => !selectedIds.has(question.questionId))
      .sort((a, b) => {
        if (b.rankScore !== a.rankScore) {
          return b.rankScore - a.rankScore;
        }
        return a.questionId.localeCompare(b.questionId);
      })
      .slice(0, roundSlots - selectedQuestions.length);
    selectedQuestions.push(...fallback);
  }

  const selectedQuestionsForOutput: CandidateQuestion[] = selectedQuestions.map((question) => ({
    questionId: question.questionId,
    questionText: question.questionText,
    claimIds: question.claimIds,
    expectedConfidenceGain: question.expectedConfidenceGain,
    scope: question.scope,
    domains: question.domains,
  }));

  const suggestedPast = selectedQuestionsForOutput.filter((question) => question.scope === 'past').length;
  const suggestedPresent = selectedQuestionsForOutput.filter((question) => question.scope === 'present').length;

  return {
    action: 'ask',
    actionVi: getActionVi('ask'),
    threshold: CONFIDENCE_THRESHOLD,
    unresolvedClaimIds,
    concludedClaimIds,
    selectedQuestions: selectedQuestionsForOutput,
    crossDomainInsights: unresolvedCrossDomainInsights,
    questionMix: {
      strategy: mixPlan.strategy,
      strategyVi: getStrategyVi(mixPlan.strategy),
      scores: {
        pastValidationScore: normalizedPastScore,
        presentStateClarity: normalizedPresentClarity,
      },
      targetTotals: {
        past: mixPlan.targetTotals.past,
        present: mixPlan.targetTotals.present,
      },
      remainingTargets: {
        past: pastRemainingTarget,
        present: presentRemainingTarget,
      },
      suggestedThisRound: {
        past: suggestedPast,
        present: suggestedPresent,
      },
    },
    reason: `Đặt ${selectedQuestions.length} câu hỏi xác minh trọng tâm theo chiến lược ${getStrategyVi(mixPlan.strategy)}.`,
    limits: {
      maxRounds: MAX_ROUNDS,
      maxQuestionsPerRound: MAX_QUESTIONS_PER_ROUND,
      maxTotalQuestions: MAX_TOTAL_QUESTIONS,
    },
  };
};
