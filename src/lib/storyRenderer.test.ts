import assert from 'node:assert/strict';
import test from 'node:test';
import { renderNarrative } from './storyRenderer.js';

test('render narrative with required sections', () => {
  const output = renderNarrative({
    userQuestion: 'Em muon biet tinh cam va cong viec 6 thang toi.',
    chartHighlights: ['Phu the dang xung voi Quan loc'],
    validatedPast: ['Da co xung dot do lich lam viec'],
    currentContext: ['Dang can doi quyet dinh cuoi'],
    crossDomainInsights: {
      focusDomains: ['phu_the', 'quan_loc'],
      relatedDomains: [{ domain: 'phu_mau', score: 1.2 }],
      note: 'Uu tien lien ket cheo',
    },
    storyBlueprint: {
      question: 'Em muon biet tinh cam va cong viec 6 thang toi.',
      seedDomains: ['phu_the', 'quan_loc'],
      linkedDomains: ['phu_mau'],
      narrativeOrder: ['phu_the', 'quan_loc', 'phu_mau'],
      guidance: ['Mo boi canh', 'Noi nut that'],
    },
    futureOutlook: [
      {
        scenario: 'Kich ban on dinh',
        condition: 'giu duoc giao tiep ro rang',
        outlook: 'moi quan he va cong viec deu giam ap luc',
        confidence: 0.72,
        action: 'duy tri lich trao doi co dinh moi tuan',
      },
    ],
  });

  assert.equal(output.title, 'Ban giai dap theo mach truyen');
  assert.ok(output.narrative.includes('Em muon biet tinh cam va cong viec 6 thang toi.'));
  assert.ok(output.sections.bucTranhHienTai.length > 20);
  assert.ok(output.sections.nutThatChinh.length > 20);
  assert.ok(output.sections.dienTienSapToi.includes('Kich ban on dinh'));
  assert.ok(output.sections.huongMoThucTe.includes('buoc thuc te'));
});
