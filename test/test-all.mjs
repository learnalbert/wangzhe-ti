import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const testData = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/questions.json'), 'utf-8'));

console.log('╔════════════════════════════════════════════════════════╗');
console.log('║          王者TI - 快速48英雄验证测试                    ║');
console.log('╚════════════════════════════════════════════════════════╝\n');

let passed = 0, failed = 0;
const MBTI_TYPES = Object.keys(testData.heroQuizzes || {});

console.log(`找到 ${MBTI_TYPES.length} 种MBTI类型\n`);

MBTI_TYPES.forEach(mbtiType => {
  const mbtiData = testData.heroQuizzes[mbtiType];
  if (!mbtiData?.heroes) {
    console.log(`❌ ${mbtiType}: 缺少数据`);
    failed += 3;
    return;
  }

  const heroKeys = Object.keys(mbtiData.heroes);
  if (heroKeys.length !== 3) {
    console.log(`⚠️  ${mbtiType}: 英雄数量 ${heroKeys.length} (期望3)`);
  }

  heroKeys.forEach(heroKey => {
    const hero = mbtiData.heroes[heroKey];
    const hasQuestions = mbtiData.questions && mbtiData.questions.length >= 5;

    if (hero.name && hasQuestions) {
      console.log(`✅ ${mbtiType} - ${hero.name}`);
      passed++;
    } else {
      console.log(`❌ ${mbtiType} - ${heroKey}: 缺少${!hero.name ? '名字' : '题目(仅' + (mbtiData.questions?.length || 0) + '道)'}`);
      failed++;
    }
  });
});

console.log(`\n╔════════════════════════════════════════════════════════╗`);
console.log('║                      测试总结                          ║');
console.log('╚════════════════════════════════════════════════════════╝');
console.log(`✅ 通过: ${passed}`);
console.log(`❌ 失败: ${failed}`);
console.log(`📊 总计: ${passed + failed}/48 英雄`);
console.log(`📊 通过率: ${(passed/(passed+failed)*100).toFixed(1)}%`);
