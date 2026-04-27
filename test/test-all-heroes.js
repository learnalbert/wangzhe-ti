/**
 * 王者TI - 完整48英雄测试套件
 * 16种MBTI类型 × 3个英雄 = 48个测试案例
 */

// 实际的测试数据
import testData from '../data/questions.json' assert { type: 'json' }

const ALL_MBTI_TYPES = [
  'INTJ', 'INTP', 'ENTJ', 'ENTP',
  'INFJ', 'INFP', 'ENFJ', 'ENFP',
  'ISTJ', 'ISFJ', 'ESTJ', 'ESFJ',
  'ISTP', 'ISFP', 'ESTP', 'ESFP'
]

// MBTI维度得分策略
const MBTI_STRATEGIES = {
  'INTJ': { EI: 'I', SN: 'N', TF: 'T', JP: 'J' },
  'INTP': { EI: 'I', SN: 'N', TF: 'T', JP: 'P' },
  'ENTJ': { EI: 'E', SN: 'N', TF: 'T', JP: 'J' },
  'ENTP': { EI: 'E', SN: 'N', TF: 'T', JP: 'P' },
  'INFJ': { EI: 'I', SN: 'N', TF: 'F', JP: 'J' },
  'INFP': { EI: 'I', SN: 'N', TF: 'F', JP: 'P' },
  'ENFJ': { EI: 'E', SN: 'N', TF: 'F', JP: 'J' },
  'ENFP': { EI: 'E', SN: 'N', TF: 'F', JP: 'P' },
  'ISTJ': { EI: 'I', SN: 'S', TF: 'T', JP: 'J' },
  'ISFJ': { EI: 'I', SN: 'S', TF: 'F', JP: 'J' },
  'ESTJ': { EI: 'E', SN: 'S', TF: 'T', JP: 'J' },
  'ESFJ': { EI: 'E', SN: 'S', TF: 'F', JP: 'J' },
  'ISTP': { EI: 'I', SN: 'S', TF: 'T', JP: 'P' },
  'ISFP': { EI: 'I', SN: 'S', TF: 'F', JP: 'P' },
  'ESTP': { EI: 'E', SN: 'S', TF: 'T', JP: 'P' },
  'ESFP': { EI: 'E', SN: 'S', TF: 'F', JP: 'P' },
}

// 根据维度选择选项
function selectByDimension(question, dimension, preference) {
  const option = question.options.find(o => o.score?.[preference])
  if (option) return option

  // 如果找不到精确匹配，根据维度选择
  if (dimension === 'EI') return preference === 'E' ? question.options[0] : question.options[1]
  if (dimension === 'SN') return preference === 'S' ? question.options[0] : question.options[1]
  if (dimension === 'TF') return preference === 'T' ? question.options[0] : question.options[1]
  if (dimension === 'JP') return preference === 'J' ? question.options[0] : question.options[1]

  return question.options[0]
}

// 模拟答题
function simulateQuiz(mbtiType, targetHeroKey) {
  const strategy = MBTI_STRATEGIES[mbtiType]
  if (!strategy) throw new Error(`未知的MBTI类型: ${mbtiType}`)

  const mbtiData = testData.heroQuizzes?.[mbtiType]
  if (!mbtiData?.heroes) {
    return {
      success: false,
      error: `缺少MBTI数据: ${mbtiType}`,
      mbtiType,
      targetHeroKey
    }
  }

  const heroes = mbtiData.heroes
  const heroNameMap = {}
  Object.entries(heroes).forEach(([key, h]) => {
    heroNameMap[key] = h.name
  })

  const targetHeroName = heroNameMap[targetHeroKey]
  if (!targetHeroName) {
    return {
      success: false,
      error: `找不到英雄key: ${targetHeroKey}`,
      mbtiType,
      targetHeroKey,
      availableKeys: Object.keys(heroes)
    }
  }

  // 阶段1: MBTI测试
  let mbtiScores = { E: 0, I: 0, S: 0, N: 0, T: 0, F: 0, J: 0, P: 0 }

  testData.mainQuiz.questions.forEach(q => {
    const pref = strategy[q.dimension]
    const option = selectByDimension(q, q.dimension, pref)

    if (option.score) {
      Object.entries(option.score).forEach(([key, val]) => {
        if (mbtiScores[key] !== undefined) mbtiScores[key] += val
      })
    }
  })

  // 计算MBTI
  const calculatedMBTI = [
    mbtiScores.E >= mbtiScores.I ? 'E' : 'I',
    mbtiScores.S >= mbtiScores.N ? 'S' : 'N',
    mbtiScores.T >= mbtiScores.F ? 'T' : 'F',
    mbtiScores.J >= mbtiScores.P ? 'J' : 'P',
  ].join('')

  if (calculatedMBTI !== mbtiType) {
    return {
      success: false,
      error: `MBTI计算不匹配: 期望${mbtiType}, 实际${calculatedMBTI}`,
      mbtiType,
      calculatedMBTI,
      mbtiScores
    }
  }

  // 阶段2: 英雄匹配测试
  const heroScores = {}
  Object.values(heroes).forEach(h => heroScores[h.name] = 0)

  if (!mbtiData.questions || mbtiData.questions.length === 0) {
    return {
      success: false,
      error: `缺少英雄匹配题目: ${mbtiType}`,
      mbtiType
    }
  }

  mbtiData.questions.forEach(q => {
    // 选择目标英雄对应的选项
    const option = q.options.find(o => o.match_hero === targetHeroKey) || q.options[0]
    const heroName = heroNameMap[option.match_hero]
    if (heroName) {
      heroScores[heroName] = (heroScores[heroName] || 0) + 1
    }
  })

  // 找出最佳英雄
  let bestHero = null
  let maxScore = -Infinity
  Object.entries(heroScores).forEach(([name, score]) => {
    if (score > maxScore) {
      maxScore = score
      bestHero = name
    }
  })

  const success = bestHero === targetHeroName

  return {
    success,
    mbtiType,
    targetHeroKey,
    targetHeroName,
    matchedHero: bestHero,
    heroScores,
    mbtiScores,
    error: success ? null : `期望匹配${targetHeroName}, 实际匹配${bestHero}`
  }
}

// 生成所有测试案例
function generateAllTestCases() {
  const cases = []

  ALL_MBTI_TYPES.forEach(mbtiType => {
    const mbtiData = testData.heroQuizzes?.[mbtiType]
    if (!mbtiData?.heroes) {
      cases.push({
        name: `${mbtiType}-数据缺失`,
        mbtiType,
        targetHeroKey: null,
        skip: true,
        reason: '缺少heroQuizzes数据'
      })
      return
    }

    Object.keys(mbtiData.heroes).forEach(heroKey => {
      const hero = mbtiData.heroes[heroKey]
      cases.push({
        name: `${mbtiType}-${hero.name}`,
        mbtiType,
        targetHeroKey: heroKey,
        targetHeroName: hero.name,
        skip: false
      })
    })
  })

  return cases
}

// 运行所有测试
async function runAllTests() {
  console.log('╔════════════════════════════════════════════════════════╗')
  console.log('║          王者TI - 48英雄完整测试套件                  ║')
  console.log('║     16种MBTI类型 × 3个英雄 = 48个测试案例            ║')
  console.log('╚════════════════════════════════════════════════════════╝\n')

  const testCases = generateAllTestCases()

  console.log(`📋 生成测试案例: ${testCases.length}个`)
  console.log(`   - 有效测试: ${testCases.filter(c => !c.skip).length}个`)
  console.log(`   - 跳过测试: ${testCases.filter(c => c.skip).length}个\n`)

  let passed = 0
  let failed = 0
  let skipped = 0
  const failures = []

  for (const testCase of testCases) {
    if (testCase.skip) {
      console.log(`⏭️  ${testCase.name}: ${testCase.reason}`)
      skipped++
      continue
    }

    const result = simulateQuiz(testCase.mbtiType, testCase.targetHeroKey)

    if (result.success) {
      console.log(`✅ ${testCase.name}: 通过`)
      passed++
    } else {
      console.log(`❌ ${testCase.name}: 失败`)
      console.log(`   ${result.error}`)
      failed++
      failures.push({ testCase, result })
    }
  }

  // 总结
  console.log('\n╔════════════════════════════════════════════════════════╗')
  console.log('║                      测试总结                          ║')
  console.log('╚════════════════════════════════════════════════════════╝')
  console.log(`✅ 通过: ${passed}/${testCases.length}`)
  console.log(`❌ 失败: ${failed}/${testCases.length}`)
  console.log(`⏭️  跳过: ${skipped}/${testCases.length}`)
  console.log(`📊 通过率: ${(passed/testCases.length*100).toFixed(1)}%`)

  if (failures.length > 0) {
    console.log('\n❌ 失败的测试详情:')
    failures.forEach(({ testCase, result }) => {
      console.log(`\n   ${testCase.name}:`)
      console.log(`   - ${result.error}`)
      if (result.heroScores) {
        console.log(`   - 英雄得分:`, result.heroScores)
      }
    })
  }

  // 按MBTI类型统计
  console.log('\n📊 按MBTI类型统计:')
  ALL_MBTI_TYPES.forEach(type => {
    const typeCases = testCases.filter(c => c.mbtiType === type && !c.skip)
    const typePassed = typeCases.filter(c => {
      const result = simulateQuiz(c.mbtiType, c.targetHeroKey)
      return result.success
    }).length
    const status = typePassed === typeCases.length ? '✅' : typePassed === 0 ? '❌' : '⚠️'
    console.log(`   ${status} ${type}: ${typePassed}/${typeCases.length}`)
  })
}

// 运行测试
runAllTests()
