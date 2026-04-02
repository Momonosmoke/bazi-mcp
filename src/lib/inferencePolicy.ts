export const CONFIDENCE_THRESHOLD = 0.8;
export const MAX_ROUNDS = 2;
export const MAX_QUESTIONS_PER_ROUND = 3;
export const MAX_TOTAL_QUESTIONS = 6;

export type Domain =
  | 'phu_the'
  | 'thien_di'
  | 'quan_loc'
  | 'phuc_duc'
  | 'phu_mau'
  | 'huynh_de'
  | 'menh'
  | 'dien_trach'
  | 'no_boc'
  | 'tat_ach'
  | 'tai_bach'
  | 'tu_tuc';

export type CrossLink = {
  sourceDomain: Domain;
  targetDomain: Domain;
  weight: number;
  reason?: string;
};

export const DEFAULT_CROSS_LINKS: CrossLink[] = [
  { sourceDomain: 'phu_the', targetDomain: 'thien_di', weight: 1, reason: 'Phu the noi Thien di' },
  { sourceDomain: 'phu_the', targetDomain: 'quan_loc', weight: 1, reason: 'Phu the noi Quan loc' },
  { sourceDomain: 'phu_the', targetDomain: 'phuc_duc', weight: 1, reason: 'Phu the noi Phuc duc' },
  { sourceDomain: 'phu_the', targetDomain: 'phu_mau', weight: 1, reason: 'Phu the noi Phu mau' },
  { sourceDomain: 'huynh_de', targetDomain: 'menh', weight: 1, reason: 'Huynh de noi Menh' },
  { sourceDomain: 'huynh_de', targetDomain: 'dien_trach', weight: 1, reason: 'Huynh de noi Dien trach' },
  { sourceDomain: 'huynh_de', targetDomain: 'no_boc', weight: 1, reason: 'Huynh de noi No boc' },
  { sourceDomain: 'huynh_de', targetDomain: 'tat_ach', weight: 1, reason: 'Huynh de noi Tat ach' },
  { sourceDomain: 'menh', targetDomain: 'quan_loc', weight: 1, reason: 'Menh noi Quan loc' },
  { sourceDomain: 'menh', targetDomain: 'thien_di', weight: 1, reason: 'Menh noi Thien di' },
  { sourceDomain: 'menh', targetDomain: 'tai_bach', weight: 1, reason: 'Menh noi Tai bach' },
  { sourceDomain: 'menh', targetDomain: 'huynh_de', weight: 1, reason: 'Menh noi Huynh de' },
  { sourceDomain: 'phu_mau', targetDomain: 'no_boc', weight: 1, reason: 'Phu mau noi No boc' },
  { sourceDomain: 'phu_mau', targetDomain: 'tat_ach', weight: 1, reason: 'Phu mau noi Tat ach' },
  { sourceDomain: 'phu_mau', targetDomain: 'tu_tuc', weight: 1, reason: 'Phu mau noi Tu tuc' },
  { sourceDomain: 'phu_mau', targetDomain: 'phu_the', weight: 1, reason: 'Phu mau noi Phu the' },
  { sourceDomain: 'phuc_duc', targetDomain: 'thien_di', weight: 1, reason: 'Phuc duc noi Thien di' },
  { sourceDomain: 'phuc_duc', targetDomain: 'tai_bach', weight: 1, reason: 'Phuc duc noi Tai bach' },
  { sourceDomain: 'phuc_duc', targetDomain: 'tu_tuc', weight: 1, reason: 'Phuc duc noi Tu tuc' },
  { sourceDomain: 'phuc_duc', targetDomain: 'phu_the', weight: 1, reason: 'Phuc duc noi Phu the' },
  { sourceDomain: 'dien_trach', targetDomain: 'tat_ach', weight: 1, reason: 'Dien trach noi Tat ach' },
  { sourceDomain: 'dien_trach', targetDomain: 'tai_bach', weight: 1, reason: 'Dien trach noi Tai bach' },
  { sourceDomain: 'dien_trach', targetDomain: 'tu_tuc', weight: 1, reason: 'Dien trach noi Tu tuc' },
  { sourceDomain: 'dien_trach', targetDomain: 'huynh_de', weight: 1, reason: 'Dien trach noi Huynh de' },
  { sourceDomain: 'quan_loc', targetDomain: 'tat_ach', weight: 1, reason: 'Quan loc noi Tat ach' },
  { sourceDomain: 'quan_loc', targetDomain: 'tai_bach', weight: 1, reason: 'Quan loc noi Tai bach' },
  { sourceDomain: 'quan_loc', targetDomain: 'phu_the', weight: 1, reason: 'Quan loc noi Phu the' },
  { sourceDomain: 'quan_loc', targetDomain: 'menh', weight: 1, reason: 'Quan loc noi Menh' },
  { sourceDomain: 'no_boc', targetDomain: 'thien_di', weight: 1, reason: 'No boc noi Thien di' },
  { sourceDomain: 'no_boc', targetDomain: 'tu_tuc', weight: 1, reason: 'No boc noi Tu tuc' },
  { sourceDomain: 'no_boc', targetDomain: 'huynh_de', weight: 1, reason: 'No boc noi Huynh de' },
  { sourceDomain: 'no_boc', targetDomain: 'phu_mau', weight: 1, reason: 'No boc noi Phu mau' },
  { sourceDomain: 'thien_di', targetDomain: 'phu_the', weight: 1, reason: 'Thien di noi Phu the' },
  { sourceDomain: 'thien_di', targetDomain: 'menh', weight: 1, reason: 'Thien di noi Menh' },
  { sourceDomain: 'thien_di', targetDomain: 'phuc_duc', weight: 1, reason: 'Thien di noi Phuc duc' },
  { sourceDomain: 'thien_di', targetDomain: 'no_boc', weight: 1, reason: 'Thien di noi No boc' },
  { sourceDomain: 'tat_ach', targetDomain: 'huynh_de', weight: 1, reason: 'Tat ach noi Huynh de' },
  { sourceDomain: 'tat_ach', targetDomain: 'phu_mau', weight: 1, reason: 'Tat ach noi Phu mau' },
  { sourceDomain: 'tat_ach', targetDomain: 'dien_trach', weight: 1, reason: 'Tat ach noi Dien trach' },
  { sourceDomain: 'tat_ach', targetDomain: 'quan_loc', weight: 1, reason: 'Tat ach noi Quan loc' },
  { sourceDomain: 'tai_bach', targetDomain: 'menh', weight: 1, reason: 'Tai bach noi Menh' },
  { sourceDomain: 'tai_bach', targetDomain: 'phuc_duc', weight: 1, reason: 'Tai bach noi Phuc duc' },
  { sourceDomain: 'tai_bach', targetDomain: 'dien_trach', weight: 1, reason: 'Tai bach noi Dien trach' },
  { sourceDomain: 'tai_bach', targetDomain: 'quan_loc', weight: 1, reason: 'Tai bach noi Quan loc' },
  { sourceDomain: 'tu_tuc', targetDomain: 'phu_mau', weight: 1, reason: 'Tu tuc noi Phu mau' },
  { sourceDomain: 'tu_tuc', targetDomain: 'phuc_duc', weight: 1, reason: 'Tu tuc noi Phuc duc' },
  { sourceDomain: 'tu_tuc', targetDomain: 'dien_trach', weight: 1, reason: 'Tu tuc noi Dien trach' },
  { sourceDomain: 'tu_tuc', targetDomain: 'no_boc', weight: 1, reason: 'Tu tuc noi No boc' },
];

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
  userQuestion?: string;
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
  storyBlueprint: {
    question: string;
    seedDomains: Domain[];
    linkedDomains: Domain[];
    narrativeOrder: Domain[];
    guidance: string[];
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

const DOMAIN_KEYWORDS: Array<{ domain: Domain; keywords: string[] }> = [
  { domain: 'phu_the', keywords: ['phu the', 'vợ chồng', 'vo chong', 'hôn nhân', 'hon nhan', 'tình cảm', 'tinh cam', 'yêu', 'yeu'] },
  { domain: 'thien_di', keywords: ['thiên di', 'thien di', 'đi xa', 'di xa', 'xuất ngoại', 'xuat ngoai', 'ra ngoài', 'ra ngoai'] },
  { domain: 'quan_loc', keywords: ['quan lộc', 'quan loc', 'công việc', 'cong viec', 'sự nghiệp', 'su nghiep', 'chức vụ', 'chuc vu'] },
  { domain: 'phuc_duc', keywords: ['phúc đức', 'phuc duc', 'tổ tiên', 'to tien', 'phước', 'phuoc', 'nghiệp gia tộc', 'nghiep gia toc'] },
  { domain: 'phu_mau', keywords: ['phụ mẫu', 'phu mau', 'bố mẹ', 'bo me', 'cha mẹ', 'cha me', 'gia đình gốc', 'gia dinh goc'] },
  { domain: 'huynh_de', keywords: ['huynh đệ', 'huynh de', 'anh em', 'chị em', 'chi em', 'bạn bè thân', 'ban be than'] },
  { domain: 'menh', keywords: ['mệnh', 'menh', 'bản thân', 'ban than', 'tính cách', 'tinh cach', 'định hướng', 'dinh huong'] },
  { domain: 'dien_trach', keywords: ['điền trạch', 'dien trach', 'nhà cửa', 'nha cua', 'đất đai', 'dat dai', 'bất động sản', 'bat dong san'] },
  { domain: 'no_boc', keywords: ['nô bộc', 'no boc', 'đối tác', 'doi tac', 'đồng nghiệp', 'dong nghiep', 'mạng lưới', 'mang luoi'] },
  { domain: 'tat_ach', keywords: ['tật ách', 'tat ach', 'sức khỏe', 'suc khoe', 'bệnh', 'benh', 'tinh thần', 'tam ly'] },
  { domain: 'tai_bach', keywords: ['tài bạch', 'tai bach', 'tiền', 'tien', 'thu nhập', 'thu nhap', 'tài chính', 'tai chinh'] },
  { domain: 'tu_tuc', keywords: ['tử tức', 'tu tuc', 'con cái', 'con cai', 'thai', 'sinh con', 'nuôi dạy', 'nuoi day'] },
];

const inferDomainsFromQuestion = (question?: string): Domain[] => {
  if (!question || !question.trim()) {
    return [];
  }
  const normalized = question.toLowerCase();
  const matched: Domain[] = [];
  for (const item of DOMAIN_KEYWORDS) {
    if (item.keywords.some((keyword) => normalized.includes(keyword))) {
      matched.push(item.domain);
    }
  }
  return Array.from(new Set(matched));
};

const buildStoryBlueprint = (question: string | undefined, seedDomains: Domain[], linkedDomains: Domain[]) => {
  const narrativeOrder = Array.from(new Set([...seedDomains, ...linkedDomains]));
  return {
    question: question ?? '',
    seedDomains,
    linkedDomains,
    narrativeOrder,
    guidance: [
      'Mở câu trả lời bằng bối cảnh hiện tại gắn trực tiếp với câu hỏi của user.',
      'Nêu nút thắt cốt lõi từ cung trọng tâm, rồi chuyển mượt sang các cung liên kết.',
      'Giải thích chuỗi nguyên nhân-kết quả giữa các cung thay vì tách rời từng mục.',
      'Kết bằng kịch bản sắp tới và hành động cụ thể để user áp dụng ngay.',
    ],
  };
};

const buildStoryBlueprintFromInsights = (
  question: string | undefined,
  insights: { focusDomains: Domain[]; relatedDomains: Array<{ domain: Domain; score: number }> },
) => {
  const linkedDomains = insights.relatedDomains.map((item) => item.domain);
  return buildStoryBlueprint(question, insights.focusDomains, linkedDomains);
};

const buildCrossDomainInsights = (claims: Claim[], crossLinks: CrossLink[], seedDomains: Domain[] = []) => {
  const focusDomainSet = new Set<Domain>();
  for (const claim of claims) {
    for (const domain of claim.domains ?? []) {
      focusDomainSet.add(domain);
    }
  }
  for (const domain of seedDomains) {
    focusDomainSet.add(domain);
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
    userQuestion,
    askedPastQuestions = 0,
    askedPresentQuestions = 0,
    pastValidationScore = 0.5,
    presentStateClarity = 0.5,
    claims,
    targetClaimIds = [],
    crossLinks = [],
    candidateQuestions = [],
  } = input;
  const effectiveCrossLinks = crossLinks.length > 0 ? crossLinks : DEFAULT_CROSS_LINKS;

  const normalizedPastScore = clampConfidence(pastValidationScore);
  const normalizedPresentClarity = clampConfidence(presentStateClarity);
  const mixPlan = getMixPlan(normalizedPastScore);
  const inferredQuestionDomains = inferDomainsFromQuestion(userQuestion);

  const evidenceBackedClaims = claims
    .filter((claim) => claim.evidenceFromChart)
    .map((claim) => ({
      ...claim,
      confidence: clampConfidence(claim.confidence),
    }));

  const targetIds =
    targetClaimIds.length > 0 ? new Set(targetClaimIds) : new Set(evidenceBackedClaims.map((claim) => claim.claimId));

  const targetClaims = evidenceBackedClaims.filter((claim) => targetIds.has(claim.claimId));
  const allCrossDomainInsights = buildCrossDomainInsights(targetClaims, effectiveCrossLinks, inferredQuestionDomains);
  const allStoryBlueprint = buildStoryBlueprintFromInsights(userQuestion, allCrossDomainInsights);

  if (targetClaims.length === 0) {
    return {
      action: 'abstain',
      actionVi: getActionVi('abstain'),
      threshold: CONFIDENCE_THRESHOLD,
      unresolvedClaimIds: [],
      concludedClaimIds: [],
      selectedQuestions: [],
      crossDomainInsights: allCrossDomainInsights,
      storyBlueprint: allStoryBlueprint,
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
  const unresolvedCrossDomainInsights = buildCrossDomainInsights(
    unresolvedClaims,
    effectiveCrossLinks,
    inferredQuestionDomains,
  );
  const unresolvedStoryBlueprint = buildStoryBlueprintFromInsights(userQuestion, unresolvedCrossDomainInsights);

  if (unresolvedClaimIds.length === 0) {
    return {
      action: 'conclude',
      actionVi: getActionVi('conclude'),
      threshold: CONFIDENCE_THRESHOLD,
      unresolvedClaimIds,
      concludedClaimIds,
      selectedQuestions: [],
      crossDomainInsights: unresolvedCrossDomainInsights,
      storyBlueprint: unresolvedStoryBlueprint,
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
      storyBlueprint: unresolvedStoryBlueprint,
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
      storyBlueprint: unresolvedStoryBlueprint,
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
      storyBlueprint: unresolvedStoryBlueprint,
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
    storyBlueprint: unresolvedStoryBlueprint,
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
