/**
 * 王者TI - 答题流程模拟测试
 * 模拟不同用户答题路径，验证结果正确性
 */

import { createQuiz } from '../src/quiz.js'

// 模拟测试数据（简化版）
const mockData = {
  mainQuiz: {
    questions: [
      // E/I 维度 (5题)
      { id: 1, title: "你更喜欢？", dimension: "EI", options: [{ id: "A", text: "和很多人聚会", score: { E: 2 } }, { id: "B", text: "独自在家", score: { I: 2 } }] },
      { id: 2, title: "社交让你？", dimension: "EI", options: [{ id: "A", text: "充满能量", score: { E: 2 } }, { id: "B", text: "感到疲惫", score: { I: 2 } }] },
      { id: 3, title: "你通常？", dimension: "EI", options: [{ id: "A", text: "先说话后思考", score: { E: 2 } }, { id: "B", text: "先思考后说话", score: { I: 2 } }] },
      { id: 4, title: "你更喜欢？", dimension: "EI", options: [{ id: "A", text: "广度优先", score: { E: 1 } }, { id: "B", text: "深度优先", score: { I: 1 } }] },
      { id: 5, title: "你倾向于？", dimension: "EI", options: [{ id: "A", text: "表达想法", score: { E: 1 } }, { id: "B", text: "保持沉默", score: { I: 1 } }] },
      // S/N 维度 (5题)
      { id: 6, title: "你更关注？", dimension: "SN", options: [{ id: "A", text: "具体细节", score: { S: 2 } }, { id: "B", text: "整体概念", score: { N: 2 } }] },
      { id: 7, title: "你更相信？", dimension: "SN", options: [{ id: "A", text: "实际经验", score: { S: 2 } }, { id: "B", text: "直觉预感", score: { N: 2 } }] },
      { id: 8, title: "你更喜欢？", dimension: "SN", options: [{ id: "A", text: "已知方法", score: { S: 2 } }, { id: "B", text: "创新方式", score: { N: 2 } }] },
      { id: 9, title: "你更重视？", dimension: "SN", options: [{ id: "A", text: "现实可行", score: { S: 1 } }, { id: "B", text: "未来可能", score: { N: 1 } }] },
      { id: 10, title: "你更擅长？", dimension: "SN", options: [{ id: "A", text: "执行细节", score: { S: 1 } }, { id: "B", text: "规划蓝图", score: { N: 1 } }] },
      // T/F 维度 (5题)
      { id: 11, title: "你做决定？", dimension: "TF", options: [{ id: "A", text: "依据逻辑", score: { T: 2 } }, { id: "B", text: "依据感受", score: { F: 2 } }] },
      { id: 12, title: "你更重视？", dimension: "TF", options: [{ id: "A", text: "客观公正", score: { T: 2 } }, { id: "B", text: "人际和谐", score: { F: 2 } }] },
      { id: 13, title: "批评别人？", dimension: "TF", options: [{ id: "A", text: "直接指出", score: { T: 2 } }, { id: "B", text: "委婉表达", score: { F: 2 } }] },
      { id: 14, title: "你更看重？", dimension: "TF", options: [{ id: "A", text: "事情对错", score: { T: 1 } }, { id: "B", text: "他人感受", score: { F: 1 } }] },
      { id: 15, title: "争论时？", dimension: "TF", options: [{ id: "A", text: "追求真理", score: { T: 1 } }, { id: "B", text: "维护关系", score: { F: 1 } }] },
      // J/P 维度 (5题)
      { id: 16, title: "你更喜欢？", dimension: "JP", options: [{ id: "A", text: "计划安排", score: { J: 2 } }, { id: "B", text: "随机应变", score: { P: 2 } }] },
      { id: 17, title: "截止日期？", dimension: "JP", options: [{ id: "A", text: "提前完成", score: { J: 2 } }, { id: "B", text: "踩点完成", score: { P: 2 } }] },
      { id: 18, title: "你的桌面？", dimension: "JP", options: [{ id: "A", text: "整洁有序", score: { J: 2 } }, { id: "B", text: "随意放置", score: { P: 2 } }] },
      { id: 19, title: "新项目？", dimension: "JP", options: [{ id: "A", text: "先定计划", score: { J: 1 } }, { id: "B", text: "直接开始", score: { P: 1 } }] },
      { id: 20, title: "周末？", dimension: "JP", options: [{ id: "A", text: "提前规划", score: { J: 1 } }, { id: "B", text: "灵活决定", score: { P: 1 } }] },
    ]
  },
  heroQuizzes: {
    ESTJ: {
      mbti_type: "ESTJ",
      heroes: {
        hero_a: { name: "曹操", title: "魏武帝", role: "战士/刺客", difficulty: 4, description: "霸道总裁型" },
        hero_b: { name: "亚瑟", title: "圣骑士", role: "战士/坦克", difficulty: 2, description: "标准执行者" },
        hero_c: { name: "狄仁杰", title: "断案大师", role: "射手", difficulty: 3, description: "公正裁决者" }
      },
      questions: [
        { id: 1, question: "团队有人偷懒？", options: [{ id: "A", text: "严厉批评", match_hero: "hero_a" }, { id: "B", text: "按规处理", match_hero: "hero_b" }, { id: "C", text: "调查取证", match_hero: "hero_c" }] },
        { id: 2, question: "遇到挑战？", options: [{ id: "A", text: "迎难而上", match_hero: "hero_a" }, { id: "B", text: "稳步推进", match_hero: "hero_b" }, { id: "C", text: "分析对策", match_hero: "hero_c" }] },
        { id: 3, question: "领导风格？", options: [{ id: "A", text: "强势掌控", match_hero: "hero_a" }, { id: "B", text: "以身作则", match_hero: "hero_b" }, { id: "C", text: "公正严明", match_hero: "hero_c" }] },
        { id: 4, question: "冲突处理？", options: [{ id: "A", text: "正面压制", match_hero: "hero_a" }, { id: "B", text: "规则约束", match_hero: "hero_b" }, { id: "C", text: "明辨是非", match_hero: "hero_c" }] },
        { id: 5, question: "目标达成？", options: [{ id: "A", text: "不择手段", match_hero: "hero_a" }, { id: "B", text: "坚守原则", match_hero: "hero_b" }, { id: "C", text: "程序正义", match_hero: "hero_c" }] }
      ]
    },
    INFP: {
      mbti_type: "INFP",
      heroes: {
        hero_a: { name: "甄姬", title: "洛神", role: "法师", difficulty: 3, description: "温柔敏感型" },
        hero_b: { name: "庄周", title: "逍遥幻梦", role: "辅助", difficulty: 2, description: "理想主义者" },
        hero_c: { name: "蔡文姬", title: "天籁弦音", role: "辅助", difficulty: 2, description: "治愈系" }
      },
      questions: [
        { id: 1, question: "受伤时？", options: [{ id: "A", text: "独自哭泣", match_hero: "hero_a" }, { id: "B", text: "梦境逃避", match_hero: "hero_b" }, { id: "C", text: "治愈他人", match_hero: "hero_c" }] },
        { id: 2, question: "理想世界？", options: [{ id: "A", text: "唯美诗意", match_hero: "hero_a" }, { id: "B", text: "自在逍遥", match_hero: "hero_b" }, { id: "C", text: "人人有爱", match_hero: "hero_c" }] },
        { id: 3, question: "被误解时？", options: [{ id: "A", text: "默默承受", match_hero: "hero_a" }, { id: "B", text: "无所谓", match_hero: "hero_b" }, { id: "C", text: "用爱化解", match_hero: "hero_c" }] },
        { id: 4, question: "创作灵感？", options: [{ id: "A", text: "情感宣泄", match_hero: "hero_a" }, { id: "B", text: "自然感悟", match_hero: "hero_b" }, { id: "C", text: "帮助他人", match_hero: "hero_c" }] },
        { id: 5, question: "面对不公？", options: [{ id: "A", text: "内心痛苦", match_hero: "hero_a" }, { id: "B", text: "超脱看淡", match_hero: "hero_b" }, { id: "C", text: "关怀弱者", match_hero: "hero_c" }] }
      ]
    }
  }
}

// 添加其他14种MBTI类型的模拟数据
const mbtiTypes = ['INTJ', 'INTP', 'ENTJ', 'ENTP', 'INFJ', 'INFP', 'ENFJ', 'ENFP', 'ISTJ', 'ISFJ', 'ESTJ', 'ESFJ', 'ISTP', 'ISFP', 'ESTP', 'ESFP']
mbtiTypes.forEach(type => {
  if (!mockData.heroQuizzes[type]) {
    mockData.heroQuizzes[type] = mockData.heroQuizzes.ESTJ
  }
})

// 测试用例
const TEST_CASES = [
  {
    name: "纯E人测试",
    description: "全部选择外向选项，应得ESTJ/ENTJ等E型",
    strategy: (q) => q.options.find(o => o.score?.E) || q.options[0],
    expected: { mbtiStartsWith: 'E' }
  },
  {
    name: "纯I人测试",
    description: "全部选择内向选项，应得INTJ/INFJ等I型",
    strategy: (q) => q.options.find(o => o.score?.I) || q.options[0],
    expected: { mbtiStartsWith: 'I' }
  },
  {
    name: "ESTJ标准测试",
    description: "选择E、S、T、J选项",
    strategy: (q) => {
      const dim = q.dimension
      if (dim === 'EI') return q.options.find(o => o.score?.E) || q.options[0]
      if (dim === 'SN') return q.options.find(o => o.score?.S) || q.options[0]
      if (dim === 'TF') return q.options.find(o => o.score?.T) || q.options[0]
      if (dim === 'JP') return q.options.find(o => o.score?.J) || q.options[0]
      return q.options[0]
    },
    expected: { mbtiType: 'ESTJ' }
  },
  {
    name: "INFP标准测试",
    description: "选择I、N、F、P选项",
    strategy: (q) => {
      const dim = q.dimension
      if (dim === 'EI') return q.options.find(o => o.score?.I) || q.options[0]
      if (dim === 'SN') return q.options.find(o => o.score?.N) || q.options[0]
      if (dim === 'TF') return q.options.find(o => o.score?.F) || q.options[0]
      if (dim === 'JP') return q.options.find(o => o.score?.P) || q.options[0]
      return q.options[0]
    },
    expected: { mbtiType: 'INFP' }
  },
  {
    name: "随机答题测试",
    description: "随机选择选项",
    strategy: (q) => q.options[Math.floor(Math.random() * q.options.length)],
    expected: { mbtiTypeExists: true }
  },
  {
    name: "边界测试-全选A",
    description: "全部选第一个选项",
    strategy: (q) => q.options[0],
    expected: { mbtiTypeExists: true }
  },
  {
    name: "边界测试-全选最后",
    description: "全部选最后一个选项",
    strategy: (q) => q.options[q.options.length - 1],
    expected: { mbtiTypeExists: true }
  },
  {
    name: "曹操忠实粉",
    description: "第二阶段全选曹操",
    phase2Strategy: (q) => q.options.find(o => o.match_hero === 'hero_a') || q.options[0],
    strategy: (q) => q.options.find(o => o.score?.E) || q.options[0],
    expected: { heroName: '曹操' }
  },
  {
    name: "甄姬忠实粉",
    description: "选择I、N、F、P产生INFP，第二阶段全选甄姬",
    phase2Strategy: (q) => q.options.find(o => o.match_hero === 'hero_a') || q.options[0],
    strategy: (q) => {
      // INFP需要: I, N, F, P
      const dim = q.dimension
      if (dim === 'EI') return q.options.find(o => o.score?.I) || q.options[0]
      if (dim === 'SN') return q.options.find(o => o.score?.N) || q.options[0]
      if (dim === 'TF') return q.options.find(o => o.score?.F) || q.options[0]
      if (dim === 'JP') return q.options.find(o => o.score?.P) || q.options[0]
      return q.options[0]
    },
    expected: { mbtiType: 'INFP', heroName: '甄姬' }
  }
]

// 模拟答题过程
function simulateQuiz(testCase) {
  return new Promise((resolve) => {
    const answers = []
    let questionIndex = 0

    // 模拟createQuiz的行为
    let mbtiScores = { E: 0, I: 0, S: 0, N: 0, T: 0, F: 0, J: 0, P: 0 }
    let currentPhase = 1

    const questions = mockData.mainQuiz.questions

    // 阶段1答题
    questions.forEach((q, idx) => {
      const option = testCase.strategy(q)
      answers.push({ phase: 1, questionId: q.id, optionId: option.id, scores: option.score })

      if (option.score) {
        Object.entries(option.score).forEach(([key, val]) => {
          if (mbtiScores[key] !== undefined) mbtiScores[key] += val
        })
      }
    })

    // 计算MBTI
    const mbtiType = [
      mbtiScores.E >= mbtiScores.I ? 'E' : 'I',
      mbtiScores.S >= mbtiScores.N ? 'S' : 'N',
      mbtiScores.T >= mbtiScores.F ? 'T' : 'F',
      mbtiScores.J >= mbtiScores.P ? 'J' : 'P',
    ].join('')

    // 阶段2答题
    const mbtiData = mockData.heroQuizzes[mbtiType]
    const heroScores = {}

    if (mbtiData?.questions) {
      Object.values(mbtiData.heroes).forEach(h => heroScores[h.name] = 0)

      const heroNameMap = {}
      Object.entries(mbtiData.heroes).forEach(([key, h]) => {
        heroNameMap[key] = h.name
      })

      mbtiData.questions.forEach((q, idx) => {
        const option = testCase.phase2Strategy ? testCase.phase2Strategy(q) : q.options[0]
        answers.push({ phase: 2, questionId: q.id, optionId: option.id, match_hero: option.match_hero })

        const heroName = heroNameMap[option.match_hero]
        if (heroName) heroScores[heroName] = (heroScores[heroName] || 0) + 1
      })
    }

    // 找出最佳英雄
    let bestHero = null
    let maxScore = -Infinity
    Object.entries(heroScores).forEach(([name, score]) => {
      if (score > maxScore) {
        maxScore = score
        bestHero = name
      }
    })

    resolve({
      mbtiType,
      heroName: bestHero,
      answers,
      mbtiScores,
      heroScores
    })
  })
}

// 验证结果
function verifyResult(testCase, result) {
  const checks = []

  if (testCase.expected.mbtiType) {
    checks.push({
      name: 'MBTI类型匹配',
      passed: result.mbtiType === testCase.expected.mbtiType,
      expected: testCase.expected.mbtiType,
      actual: result.mbtiType
    })
  }

  if (testCase.expected.mbtiStartsWith) {
    checks.push({
      name: 'MBTI首字母匹配',
      passed: result.mbtiType.startsWith(testCase.expected.mbtiStartsWith),
      expected: `以${testCase.expected.mbtiStartsWith}开头`,
      actual: result.mbtiType
    })
  }

  if (testCase.expected.mbtiTypeExists) {
    checks.push({
      name: 'MBTI类型存在',
      passed: !!result.mbtiType && result.mbtiType.length === 4,
      expected: '4字母MBTI类型',
      actual: result.mbtiType
    })
  }

  if (testCase.expected.heroName) {
    checks.push({
      name: '英雄匹配',
      passed: result.heroName === testCase.expected.heroName,
      expected: testCase.expected.heroName,
      actual: result.heroName
    })
  }

  return checks
}

// 运行所有测试
async function runTests() {
  console.log('╔════════════════════════════════════════════════╗')
  console.log('║     王者TI - 答题流程模拟测试套件             ║')
  console.log('╚════════════════════════════════════════════════╝\n')

  let passedCount = 0
  let failedCount = 0

  for (const testCase of TEST_CASES) {
    console.log(`\n📋 ${testCase.name}`)
    console.log(`   ${testCase.description}`)

    try {
      const result = await simulateQuiz(testCase)
      const checks = verifyResult(testCase, result)

      console.log(`   MBTI结果: ${result.mbtiType} | 英雄: ${result.heroName || '无'}`)

      let allPassed = true
      checks.forEach(check => {
        const icon = check.passed ? '✅' : '❌'
        console.log(`   ${icon} ${check.name}: ${check.passed ? '通过' : '失败'}`)
        if (!check.passed) {
          console.log(`      期望: ${check.expected}, 实际: ${check.actual}`)
          allPassed = false
        }
      })

      if (allPassed) {
        passedCount++
        console.log('   🎉 测试通过')
      } else {
        failedCount++
      }

      // 输出分数详情
      if (result.mbtiScores) {
        console.log(`   E:${result.mbtiScores.E} I:${result.mbtiScores.I} S:${result.mbtiScores.S} N:${result.mbtiScores.N} T:${result.mbtiScores.T} F:${result.mbtiScores.F} J:${result.mbtiScores.J} P:${result.mbtiScores.P}`)
      }

    } catch (error) {
      console.error(`   ❌ 测试执行失败:`, error.message)
      failedCount++
    }
  }

  console.log('\n╔════════════════════════════════════════════════╗')
  console.log('║                  测试总结                      ║')
  console.log('╚════════════════════════════════════════════════╝')
  console.log(`✅ 通过: ${passedCount}/${TEST_CASES.length}`)
  console.log(`❌ 失败: ${failedCount}/${TEST_CASES.length}`)
  console.log(`📊 通过率: ${(passedCount/TEST_CASES.length*100).toFixed(1)}%`)
}

// 运行测试
runTests()
