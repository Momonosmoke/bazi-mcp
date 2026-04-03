import { EightChar, LunarHour } from 'tyme4ts';
import { buildBazi } from './lib/bazi.js';
import { getConsultationProtocol as getConsultationProtocolLib } from './lib/consultationProtocol.js';
import { formatSolarTime, getSolarTime } from './lib/date.js';
import { decideInferenceAction } from './lib/inferencePolicy.js';
import type { Domain } from './lib/inferencePolicy.js';
import { renderNarrative } from './lib/storyRenderer.js';

export { getChineseCalendar } from './lib/chineseCalendar.js';

export const getBaziDetail = async (data: { lunarDatetime?; solarDatetime?; gender?; eightCharProviderSect? }) => {
  const { lunarDatetime, solarDatetime, gender, eightCharProviderSect } = data;
  if (!lunarDatetime && !solarDatetime) {
    throw new Error('solarDatetime和lunarDatetime必须传且只传其中一个。');
  }
  let lunarHour: LunarHour;
  if (lunarDatetime) {
    const date = new Date(lunarDatetime);
    lunarHour = LunarHour.fromYmdHms(
      date.getFullYear(),
      date.getMonth() + 1,
      date.getDate(),
      date.getHours(),
      date.getMinutes(),
      date.getSeconds(),
    );
  } else {
    const solarTime = getSolarTime(solarDatetime!);
    lunarHour = solarTime.getLunarHour();
  }
  return buildBazi({ lunarHour, gender: gender as 0 | 1, eightCharProviderSect: eightCharProviderSect as 1 | 2 });
};

export const getSolarTimes = async ({ bazi }) => {
  const [year, month, day, hour] = bazi.split(' ');
  const solarTimes = new EightChar(year, month, day, hour).getSolarTimes(1700, new Date().getFullYear());
  const result = solarTimes.map((time) => formatSolarTime(time));
  return result;
};

export const getInferenceDecision = async (data: {
  round: number;
  totalQuestionsAsked: number;
  userQuestion?: string;
  askedPastQuestions?: number;
  askedPresentQuestions?: number;
  pastValidationScore?: number;
  presentStateClarity?: number;
  claims: Array<{
    claimId: string;
    confidence: number;
    evidenceFromChart: boolean;
    domains?: Domain[];
  }>;
  targetClaimIds?: string[];
  crossLinks?: Array<{
    sourceDomain: Domain;
    targetDomain: Domain;
    weight: number;
    reason?: string;
  }>;
  candidateQuestions?: Array<{
    questionId: string;
    questionText: string;
    claimIds: string[];
    expectedConfidenceGain: number;
    scope?: 'past' | 'present';
    domains?: Domain[];
  }>;
}) => {
  return decideInferenceAction(data);
};

export const getConsultationProtocol = async () => {
  return getConsultationProtocolLib();
};

export const getRenderedNarrative = async (data: {
  userQuestion: string;
  chartHighlights?: string[];
  validatedPast?: string[];
  currentContext?: string[];
  futureOutlook?: Array<{
    scenario: string;
    condition: string;
    outlook: string;
    confidence: number;
    action: string;
  }>;
  crossDomainInsights?: {
    focusDomains: Domain[];
    relatedDomains: Array<{ domain: Domain; score: number }>;
    note?: string;
  };
  storyBlueprint?: {
    question: string;
    seedDomains: Domain[];
    linkedDomains: Domain[];
    narrativeOrder: Domain[];
    guidance: string[];
  };
}) => {
  return renderNarrative(data);
};
