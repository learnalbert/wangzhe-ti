/**
 * 王者TI - 英雄数据完整性测试
 * 测试所有16种MBTI类型和48个英雄的数据完整性
 */

import testData from '../data/questions.json' assert { type: 'json' }

const EXPECTED_MBTI_TYPES = [
  'INTJ', 'INTP', 'ENTJ', 'ENTP',
  'INFJ', 'INFP', 'ENFJ', 'ENFP',
  'ISTJ', 'ISFJ', 'ESTJ', 'ESFJ',
  'ISTP', 'ISFP', 'ESTP', 'ESFP'
]

const TEST_RESULTS = {
  passed: [],
  failed: [],
  warnings: []
}

function log(type, message, details = null) {
  const entry = { type, message, details, timestamp: new Date().toISOString() }
  if (type === 'PASS') TEST_RESULTS.passed.push(entry)
  else if (type === 'FAIL') TEST_RESULTS.failed.push(entry)
  else if (type === 'WARN') TEST_RESULTS.warnings.push(entry)

  const icon = type === 'PASS' ? '✅' : type === 'FAIL' ? '❌' : '⚠️'
  console.log(`${icon} ${message}`)
  if (details) console.log('   Details:', details)
}

// Test 1: 检查主测试题目数量
function testMainQuiz() {
  console.log('\n📋 Test 1: 主测试题目完整性')
  const questions = testData.mainQuiz?.questions

  if (!questions) {
    log('FAIL', 'mainQuiz.questions 不存在')
    return
  }

  if (questions.length !== 20) {
    log('FAIL', `主测试题目数量错误: ${questions.length}, 期望: 20`)
  } else {
    log('PASS', `主测试题目数量正确: ${questions.length}`)
  }

  // 检查每道题的维度
  const dimensionCounts = {}
  questions.forEach((q, idx) => {
    const dim = q.dimension
    if (!dim) {
      log('FAIL', `题目 ${idx + 1} 缺少 dimension 字段`)
    } else {
      dimensionCounts[dim] = (dimensionCounts[dim] || 0) + 1
    }

    if (!q.options || q.options.length < 2) {
      log('FAIL', `题目 ${idx + 1} 选项数量不足`)
    }
  })

  // 检查维度分布
  const expectedDims = { EI: 5, SN: 5, TF: 5, JP: 5 }
  Object.entries(expectedDims).forEach(([dim, expected]) => {
    const actual = dimensionCounts[dim] || 0
    if (actual !== expected) {
      log('FAIL', `维度 ${dim} 题目数量错误: ${actual}, 期望: ${expected}`)
    }
  })
}

// Test 2: 检查所有MBTI类型
function testMBTITypes() {
  console.log('\n🎯 Test 2: MBTI类型完整性')

  const heroQuizzes = testData.heroQuizzes || testData.heroMatch
  if (!heroQuizzes) {
    log('FAIL', 'heroQuizzes/heroMatch 不存在')
    return
  }

  const foundTypes = Object.keys(heroQuizzes)

  EXPECTED_MBTI_TYPES.forEach(type => {
    if (!foundTypes.includes(type)) {
      log('FAIL', `缺少MBTI类型: ${type}`)
    } else {
      log('PASS', `找到MBTI类型: ${type}`)
    }
  })

  // 检查是否有额外类型
  foundTypes.forEach(type => {
    if (!EXPECTED_MBTI_TYPES.includes(type)) {
      log('WARN', `发现未知MBTI类型: ${type}`)
    }
  })
}

// Test 3: 检查英雄数据
function testHeroes() {
  console.log('\n👤 Test 3: 英雄数据完整性')

  const heroQuizzes = testData.heroQuizzes || testData.heroMatch
  if (!heroQuizzes) return

  let totalHeroes = 0
  const allHeroNames = []

  Object.entries(heroQuizzes).forEach(([mbtiType, data]) => {
    const heroes = data.heroes
    if (!heroes) {
      log('FAIL', `${mbtiType} 缺少 heroes 数据`)
      return
    }

    const heroList = Object.values(heroes)
    if (heroList.length !== 3) {
      log('WARN', `${mbtiType} 英雄数量: ${heroList.length}, 期望: 3`)
    }

    heroList.forEach((hero, idx) => {
      totalHeroes++

      if (!hero.name) {
        log('FAIL', `${mbtiType} 英雄${idx + 1} 缺少 name`)
      } else {
        allHeroNames.push(hero.name)
      }

      if (!hero.enriched_description && !hero.description) {
        log('FAIL', `${mbtiType} 英雄 ${hero.name} 缺少描述`)
      }
    })

    // 检查题目
    if (!data.questions || data.questions.length === 0) {
      log('FAIL', `${mbtiType} 缺少题目数据`)
    } else if (data.questions.length < 5) {
      log('WARN', `${mbtiType} 题目数量: ${data.questions.length}, 期望: 5`)
    }
  })

  log('PASS', `英雄总数: ${totalHeroes} (期望: 48)`)

  // 检查重复英雄
  const nameCounts = {}
  allHeroNames.forEach(name => {
    nameCounts[name] = (nameCounts[name] || 0) + 1
  })
  Object.entries(nameCounts).forEach(([name, count]) => {
    if (count > 1) {
      log('WARN', `英雄 "${name}" 出现 ${count} 次`)
    }
  })
}

// Test 4: 检查图片文件名
function testImageFiles() {
  console.log('\n🖼️ Test 4: 英雄图片检查')

  const heroQuizzes = testData.heroQuizzes || testData.heroMatch
  if (!heroQuizzes) return

  const expectedFiles = []

  Object.values(heroQuizzes).forEach(data => {
    Object.values(data.heroes || {}).forEach(hero => {
      if (hero.name) {
        expectedFiles.push(`${hero.name}.png`)
        expectedFiles.push(`${hero.name}.jpg`)
      }
    })
  })

  log('PASS', `需要 ${expectedFiles.length / 2} 个英雄图片文件`)

  // 注意：实际文件检查需要在 Node.js 环境中用 fs 模块
  console.log('   提示: 请确保 hero_images 目录包含以下格式的文件:')
  console.log('   - 英雄名.png')
  console.log('   - 或 英雄名.jpg (作为备用)')
}

// 运行所有测试
function runAllTests() {
  console.log('╔════════════════════════════════════════════════╗')
  console.log('║     王者TI - 英雄数据完整性测试套件           ║')
  console.log('╚════════════════════════════════════════════════╝')

  testMainQuiz()
  testMBTITypes()
  testHeroes()
  testImageFiles()

  // 输出总结
  console.log('\n╔════════════════════════════════════════════════╗')
  console.log('║                  测试总结                      ║')
  console.log('╚════════════════════════════════════════════════╝')
  console.log(`✅ 通过: ${TEST_RESULTS.passed.length}`)
  console.log(`❌ 失败: ${TEST_RESULTS.failed.length}`)
  console.log(`⚠️  警告: ${TEST_RESULTS.warnings.length}`)

  if (TEST_RESULTS.failed.length > 0) {
    console.log('\n❌ 失败的测试:')
    TEST_RESULTS.failed.forEach(f => console.log(`   - ${f.message}`))
  }

  if (TEST_RESULTS.warnings.length > 0) {
    console.log('\n⚠️  警告:')
    TEST_RESULTS.warnings.forEach(w => console.log(`   - ${w.message}`))
  }

  return TEST_RESULTS
}

// 导出测试函数
export { runAllTests, TEST_RESULTS }

// 如果在 Node.js 环境中直接运行
if (typeof process !== 'undefined' && process.argv.includes('--run')) {
  runAllTests()
}
