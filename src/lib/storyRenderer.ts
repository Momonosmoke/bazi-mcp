import type { Domain } from './inferencePolicy.js';

export type DomainScore = { domain: Domain; score: number };

export type StoryBlueprint = {
  question: string;
  seedDomains: Domain[];
  linkedDomains: Domain[];
  narrativeOrder: Domain[];
  guidance: string[];
};

export type StoryRenderInput = {
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
    relatedDomains: DomainScore[];
    note?: string;
  };
  storyBlueprint?: StoryBlueprint;
};

export type StoryRenderOutput = {
  title: string;
  narrative: string;
  sections: {
    bucTranhHienTai: string;
    nutThatChinh: string;
    dienTienSapToi: string;
    huongMoThucTe: string;
  };
};

const DOMAIN_LABELS: Record<Domain, string> = {
  phu_the: 'Phu the',
  thien_di: 'Thien di',
  quan_loc: 'Quan loc',
  phuc_duc: 'Phuc duc',
  phu_mau: 'Phu mau',
  huynh_de: 'Huynh de',
  menh: 'Menh',
  dien_trach: 'Dien trach',
  no_boc: 'No boc',
  tat_ach: 'Tat ach',
  tai_bach: 'Tai bach',
  tu_tuc: 'Tu tuc',
};

const domainListText = (domains: Domain[]) => domains.map((domain) => DOMAIN_LABELS[domain]).join(', ');

const normalizeConfidence = (value: number) => {
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

export const renderNarrative = (input: StoryRenderInput): StoryRenderOutput => {
  const {
    userQuestion,
    chartHighlights = [],
    validatedPast = [],
    currentContext = [],
    futureOutlook = [],
    crossDomainInsights,
    storyBlueprint,
  } = input;

  const focusDomains = crossDomainInsights?.focusDomains ?? storyBlueprint?.seedDomains ?? [];
  const relatedDomains = crossDomainInsights?.relatedDomains ?? [];
  const seedDomains = storyBlueprint?.seedDomains ?? focusDomains;
  const linkedDomains = storyBlueprint?.linkedDomains ?? relatedDomains.map((item) => item.domain);
  const narrativeOrder = storyBlueprint?.narrativeOrder ?? [...seedDomains, ...linkedDomains];

  const title = 'Ban giai dap theo mach truyen';

  const bucTranhHienTai = [
    `Cau hoi ban dang quan tam la: "${userQuestion}".`,
    focusDomains.length > 0
      ? `Khi mo la so, trong tam hien tai dang nam o cac cung ${domainListText(focusDomains)}.`
      : 'Hien tai du lieu chua du de xac dinh ro cung trong tam, nen can bo sung xac minh.',
    currentContext.length > 0 ? `Boi canh thuc te gan day: ${currentContext.join('; ')}.` : '',
  ]
    .filter(Boolean)
    .join(' ');

  const topLinked = relatedDomains.slice(0, 4);
  const linkedText =
    topLinked.length > 0
      ? topLinked.map((item) => `${DOMAIN_LABELS[item.domain]} (${normalizeConfidence(item.score).toFixed(2)})`).join(', ')
      : linkedDomains.length > 0
        ? domainListText(linkedDomains)
        : 'chua co';

  const nutThatChinh = [
    seedDomains.length > 0
      ? `Nut that cot loi nam o viec cac cung ${domainListText(seedDomains)} dang tac dong qua lai rat manh.`
      : 'Nut that cot loi chua du net vi thieu du lieu xac thuc.',
    `Lien ket cheo can uu tien theo doi: ${linkedText}.`,
    chartHighlights.length > 0 ? `Bang chung tu la so: ${chartHighlights.join('; ')}.` : '',
    validatedPast.length > 0 ? `Du lieu qua khu da xac thuc: ${validatedPast.join('; ')}.` : '',
  ]
    .filter(Boolean)
    .join(' ');

  const futureLine =
    futureOutlook.length > 0
      ? futureOutlook
          .map((item) => {
            const confidenceText = `${Math.round(normalizeConfidence(item.confidence) * 100)}%`;
            return `${item.scenario}: neu ${item.condition} thi ${item.outlook} (do tin cay ${confidenceText}).`;
          })
          .join(' ')
      : 'Trong ngan han, xu huong se di theo kich ban phu thuoc vao cach ban xu ly cac nut that lien ket o tren.';

  const dienTienSapToi = [
    narrativeOrder.length > 0 ? `Mach dien tien uu tien doc theo thu tu: ${domainListText(narrativeOrder)}.` : '',
    futureLine,
  ]
    .filter(Boolean)
    .join(' ');

  const actionLine =
    futureOutlook.length > 0
      ? futureOutlook
          .map((item) => `Voi kich ban "${item.scenario}", buoc thuc te nen lam: ${item.action}.`)
          .join(' ')
      : 'Buoc tiep theo la bo sung them du lieu hien tai va qua khu de nang do chac chan truoc khi ket luan cuoi.';

  const huongMoThucTe = [
    actionLine,
    'Tom lai, hay xu ly van de theo chuoi nguyen nhan-ket qua giua cac cung, khong tach roi tung muc.',
  ].join(' ');

  const narrative = [bucTranhHienTai, nutThatChinh, dienTienSapToi, huongMoThucTe].join('\n\n');

  return {
    title,
    narrative,
    sections: {
      bucTranhHienTai,
      nutThatChinh,
      dienTienSapToi,
      huongMoThucTe,
    },
  };
};
