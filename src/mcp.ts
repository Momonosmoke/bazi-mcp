import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import z from 'zod';
import {
  getBaziDetail,
  getChineseCalendar,
  getConsultationProtocol,
  getInferenceDecision,
  getRenderedNarrative,
  getSolarTimes,
} from './index.js';

const server = new McpServer({
  name: 'Bazi',
  version: '0.0.1',
});

const domainEnum = z.enum([
  'phu_the',
  'thien_di',
  'quan_loc',
  'phuc_duc',
  'phu_mau',
  'huynh_de',
  'menh',
  'dien_trach',
  'no_boc',
  'tat_ach',
  'tai_bach',
  'tu_tuc',
]);

server.tool(
  'getBaziDetail',
  '根据时间（公历或农历）、性别来获取八字信息。solarDatetime和lunarDatetime必须传且只传其中一个。',
  {
    solarDatetime: z.string().optional().describe('用ISO时间格式表示的公历时间. 例如：`2008-03-01T13:00:00+08:00`。'),
    lunarDatetime: z.string().optional().describe('农历时间。例如农历2000年5月初五中午12点整表示为：`2000-5-5 12:00:00`。'),

    gender: z.number().describe('传0表示女性，传1表示男性。'),
    eightCharProviderSect: z
      .number()
      .default(2)
      .describe('早晚子时配置。传1表示23:00-23:59日干支为明天，传2表示23:00-23:59日干支为当天。'),
  },
  async (data) => {
    const result = await getBaziDetail(data);
    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(result),
        },
      ],
    };
  },
);

server.tool(
  'getConsultationProtocol',
  'Trả về bộ preset tư vấn Bazi tiếng Việt cho session mới, gồm văn phong kể chuyện và chính sách chống suy diễn.',
  {},
  async () => {
    const result = await getConsultationProtocol();
    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(result),
        },
      ],
    };
  },
);

server.tool(
  'getInferenceDecision',
  'Bộ máy quyết định chống suy diễn: tự suy ra các cung liên quan từ câu hỏi, liên kết chéo toàn cục và trả khung kể chuyện.',
  {
    round: z.number().int().min(1).describe('Vòng xác minh hiện tại, bắt đầu từ 1.'),
    totalQuestionsAsked: z.number().int().min(0).describe('Tổng số câu hỏi đã hỏi qua các vòng.'),
    userQuestion: z.string().optional().describe('Câu hỏi gốc của user để suy ra cung trọng tâm và mạch kể chuyện.'),
    askedPastQuestions: z.number().int().min(0).optional().describe('Số câu hỏi đã hỏi về quá khứ.'),
    askedPresentQuestions: z
      .number()
      .int()
      .min(0)
      .optional()
      .describe('Số câu hỏi đã hỏi về hiện tại.'),
    pastValidationScore: z
      .number()
      .min(0)
      .max(1)
      .optional()
      .describe('Mức xác minh giả thuyết quá khứ, từ 0 đến 1.'),
    presentStateClarity: z
      .number()
      .min(0)
      .max(1)
      .optional()
      .describe('Độ rõ bối cảnh hiện tại, từ 0 đến 1.'),
    claims: z
      .array(
        z.object({
          claimId: z.string(),
          confidence: z.number().min(0).max(1),
          evidenceFromChart: z.boolean().describe('Chỉ true khi giả thuyết có bằng chứng rõ từ lá số.'),
          domains: z.array(domainEnum).optional().describe('Mảng chủ đề của giả thuyết để liên kết chéo.'),
        }),
      )
      .min(1)
      .describe('Danh sách giả thuyết hiện tại kèm độ tin cậy và cờ bằng chứng.'),
    targetClaimIds: z.array(z.string()).optional().describe('Những giả thuyết mục tiêu phải đạt ngưỡng để được kết luận.'),
    crossLinks: z
      .array(
        z.object({
          sourceDomain: domainEnum.describe('Mảng gốc tạo ảnh hưởng, ví dụ: phu_the.'),
          targetDomain: domainEnum.describe('Mảng liên quan bị ảnh hưởng, ví dụ: phu_mau.'),
          weight: z.number().min(0).max(1).describe('Mức ảnh hưởng liên kết chéo từ 0 đến 1.'),
          reason: z.string().optional().describe('Giải thích ngắn cho liên kết này.'),
        }),
      )
      .optional()
      .describe('Bảng liên kết chéo giữa các mảng để tăng độ chính xác khi hỏi và kết luận.'),
    candidateQuestions: z
      .array(
        z.object({
          questionId: z.string(),
          questionText: z.string(),
          claimIds: z.array(z.string()).min(1).describe('Các giả thuyết mà câu hỏi này có thể xác minh.'),
          expectedConfidenceGain: z.number().min(0).max(1).describe('Mức tăng tin cậy ước tính sau khi hỏi.'),
          scope: z.enum(['past', 'present']).optional().describe('Phạm vi câu hỏi: quá khứ hoặc hiện tại.'),
          domains: z.array(domainEnum).optional().describe('Mảng mà câu hỏi đang chạm tới để tính liên kết chéo.'),
        }),
      )
      .optional()
      .describe('Danh sách câu hỏi ứng viên để chọn theo độ tăng tin cậy.'),
  },
  async (data) => {
    const result = await getInferenceDecision(data);
    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(result),
        },
      ],
    };
  },
);

server.tool(
  'renderNarrative',
  'Tu dong viet cau tra loi theo mach truyen tu du lieu da suy luan va lien ket cheo 12 cung.',
  {
    userQuestion: z.string().describe('Cau hoi goc cua user.'),
    chartHighlights: z.array(z.string()).optional().describe('Diem nhan la so dung de dan truyện.'),
    validatedPast: z.array(z.string()).optional().describe('Su kien qua khu da xac thuc.'),
    currentContext: z.array(z.string()).optional().describe('Boi canh hien tai da xac thuc.'),
    futureOutlook: z
      .array(
        z.object({
          scenario: z.string().describe('Ten kich ban.'),
          condition: z.string().describe('Dieu kien de kich ban xay ra.'),
          outlook: z.string().describe('Dien bien du kien.'),
          confidence: z.number().min(0).max(1).describe('Do tin cay 0-1.'),
          action: z.string().describe('Hanh dong thuc te de ap dung.'),
        }),
      )
      .optional()
      .describe('Danh sach kich ban tuong lai gan.'),
    crossDomainInsights: z
      .object({
        focusDomains: z.array(domainEnum),
        relatedDomains: z.array(
          z.object({
            domain: domainEnum,
            score: z.number().min(0),
          }),
        ),
        note: z.string().optional(),
      })
      .optional(),
    storyBlueprint: z
      .object({
        question: z.string(),
        seedDomains: z.array(domainEnum),
        linkedDomains: z.array(domainEnum),
        narrativeOrder: z.array(domainEnum),
        guidance: z.array(z.string()),
      })
      .optional()
      .describe('Khung cau chuyen tu getInferenceDecision.'),
  },
  async (data) => {
    const result = await getRenderedNarrative(data);
    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(result),
        },
      ],
    };
  },
);

server.tool(
  'getSolarTimes',
  '根据八字获取公历时间列表。返回的时间格式为：YYYY-MM-DD hh:mm:ss。例如时间1998年7月31日下午2点整表示为：1998-07-31 14:00:00',
  {
    bazi: z.string().describe('八字，按年柱、月柱、日柱、时柱顺序，用空格隔开。例如：戊寅 己未 己卯 辛未'),
  },
  async (data) => {
    const result = await getSolarTimes(data);
    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(result),
        },
      ],
    };
  },
);

server.tool(
  'getChineseCalendar',
  '获取指定公历时间（默认今天）的黄历信息。',
  {
    solarDatetime: z.string().optional().describe('用ISO时间格式表示的公历时间. 例如：`2008-03-01T13:00:00+08:00`。'),
  },
  async ({ solarDatetime }) => {
    const result = getChineseCalendar(solarDatetime);
    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(result),
        },
      ],
    };
  },
);

export { server };
