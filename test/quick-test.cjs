const fs = require('fs');
const path = require('path');
const testData = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/questions.json'), 'utf-8'));

console.log('╔════════════════════════════════════════════════════════╗');
console.log('║          王者TI - 快速48英雄验证测试                    ║');
console.log('╚════════════════════════════════════════════════════════╝\n');

let passed = 0, failed = 0;
const MBTI_TYPES = Object.keys(testData.heroQuizzes || {});

MBTI_TYPES.forEach(mbtiType => {
  const mbtiData = testData.heroQuizzes[mbtiType];
  if (!mbtiData?.heroes) {
    console.log(`❌ ${mbtiType}: 缺少数据`);
    failed += 3;
    return;
  }

  Object.entries(mbtiData.heroes).forEach(([heroKey, hero]) => {
    // 简单验证英雄有题目
    const hasQuestions = mbtiData.questions && mbtiData.questions.length > 0;
    if (hasQuestions && hero.name) {
      console.log(`✅ ${mbtiType}-${hero.name}: OK`);
      passed++;
    } else {
      console.log(`❌ ${mbtiType}-${heroKey}: 缺少${!hero.name ? '名字' : '题目'}`);
      failed++;
    }
  });
});

console.log(`\n总结: ✅${passed} ❌${failed} 总计:${passed+failed}/48`);
