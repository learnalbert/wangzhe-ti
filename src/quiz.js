export function createQuiz(data, onComplete) {
  let currentPhase = 1
  let currentQuestion = 0
  let answers = []
  let mbtiScores = { E: 0, I: 0, S: 0, N: 0, T: 0, F: 0, J: 0, P: 0 }
  let mbtiType = ''
  let heroQuestions = []
  let heroScores = {}

  const els = {
    fill: document.getElementById('progress-fill'),
    text: document.getElementById('progress-text'),
    qCurrent: document.getElementById('q-current'),
    qText: document.getElementById('question-text'),
    options: document.getElementById('options'),
    btnPrev: document.getElementById('btn-prev'),
  }

  function updateProgress() {
    const pct = ((currentQuestion + 1) / 25) * 100
    els.fill.style.width = pct + '%'
    els.text.textContent = `${currentQuestion + 1} / 25`
    els.qCurrent.textContent = currentQuestion + 1
    els.btnPrev.disabled = currentQuestion === 0
  }

  function calculateMBTI() {
    return [
      mbtiScores.E >= mbtiScores.I ? 'E' : 'I',
      mbtiScores.S >= mbtiScores.N ? 'S' : 'N',
      mbtiScores.T >= mbtiScores.F ? 'T' : 'F',
      mbtiScores.J >= mbtiScores.P ? 'J' : 'P',
    ].join('')
  }

  function getCurrentQuestion() {
    if (currentPhase === 1) {
      return data.mainQuiz.questions[currentQuestion]
    } else {
      return heroQuestions[currentQuestion - 20]
    }
  }

  function renderQuestion() {
    const q = getCurrentQuestion()
    if (!q) {
      console.error('题目未找到:', currentQuestion)
      return
    }

    els.qText.textContent = q.title || q.question || q.text
    els.options.innerHTML = ''

    const opts = q.options || []
    opts.forEach((opt, idx) => {
      const btn = document.createElement('button')
      btn.className = 'option-btn'

      const label = document.createElement('span')
      label.className = 'option-label'
      label.textContent = opt.id || String.fromCharCode(65 + idx)

      const text = document.createElement('span')
      text.className = 'option-text'
      text.textContent = opt.text || opt.label || opt.content

      btn.appendChild(label)
      btn.appendChild(text)
      btn.addEventListener('click', () => selectOption(q, opt))
      els.options.appendChild(btn)
    })

    updateProgress()
  }

  function goToPrevQuestion() {
    if (currentQuestion === 0) return

    currentQuestion--

    const lastAnswer = answers.pop()

    if (currentPhase === 2 && currentQuestion === 19) {
      currentPhase = 1
      mbtiType = ''
      heroQuestions = []
      heroScores = {}
    }

    if (lastAnswer) {
      if (currentPhase === 1) {
        if (lastAnswer.scores) {
          Object.entries(lastAnswer.scores).forEach(([key, val]) => {
            if (mbtiScores[key] !== undefined) {
              mbtiScores[key] -= val
              if (mbtiScores[key] < 0) mbtiScores[key] = 0
            }
          })
        }
      } else {
        const heroMatch = lastAnswer.match_hero || lastAnswer.scores?.hero
        if (heroMatch) {
          const heroName = heroNameMap[heroMatch] || heroMatch
          if (heroScores[heroName] !== undefined) {
            heroScores[heroName] = Math.max(0, heroScores[heroName] - 1)
          }
        }
      }
    }

    renderQuestion()
  }

  function selectOption(question, option) {
    answers.push({
      phase: currentPhase,
      questionId: question.id,
      optionId: option.id,
      scores: option.score,
      match_hero: option.match_hero,
    })

    if (currentPhase === 1) {
      if (option.score) {
        Object.entries(option.score).forEach(([key, val]) => {
          if (mbtiScores[key] !== undefined) {
            mbtiScores[key] += val
          }
        })
      }
    } else {
      const heroMatch = option.match_hero || option.score?.hero
      if (heroMatch) {
        const heroName = heroNameMap[heroMatch] || heroMatch
        heroScores[heroName] = (heroScores[heroName] || 0) + 1
      }
    }

    currentQuestion++

    if (currentPhase === 1 && currentQuestion >= 20) {
      mbtiType = calculateMBTI()
      console.log('MBTI类型:', mbtiType)

      const mbtiData = data.heroQuizzes?.[mbtiType] || data.heroMatch?.[mbtiType]

      if (mbtiData?.heroes) {
        const heroes = Object.values(mbtiData.heroes)
        console.log('找到英雄:', heroes.map(h => h.name))

        Object.entries(mbtiData.heroes).forEach(([key, h]) => {
          heroNameMap[key] = h.name
        })

        if (mbtiData.questions && mbtiData.questions.length > 0) {
          heroQuestions = mbtiData.questions.slice(0, 5)
        } else {
          heroQuestions = generateHeroQuestions(heroes)
        }

        if (heroQuestions.length === 0) {
          onComplete({ mbtiType, hero: null, answers })
          return
        }

        heroScores = {}
        heroes.forEach(h => {
          heroScores[h.name] = 0
        })

        currentPhase = 2
        console.log('进入第二阶段，题目数:', heroQuestions.length)
        renderQuestion()
      } else {
        console.error('无英雄数据:', mbtiType)
        onComplete({ mbtiType, hero: null, answers })
      }
    } else if (currentPhase === 2 && currentQuestion >= 25) {
      let bestHero = null
      let maxScore = -Infinity
      Object.entries(heroScores).forEach(([name, score]) => {
        if (score > maxScore) {
          maxScore = score
          bestHero = name
        }
      })

      const mbtiData = data.heroQuizzes?.[mbtiType] || data.heroMatch?.[mbtiType]
      let heroData = null
      if (mbtiData?.heroes) {
        Object.values(mbtiData.heroes).forEach(h => {
          if (h.name === bestHero) {
            heroData = h
          }
        })
      }

      onComplete({ mbtiType, hero: heroData, heroScores, answers })
    } else {
      renderQuestion()
    }
  }

  const heroNameMap = {}

  function generateHeroQuestions(heroes) {
    const questions = []
    heroes.forEach((hero) => {
      if (hero.questions?.length > 0) {
        const q = hero.questions[0]
        questions.push({
          ...q,
          title: q.question || q.title
        })
      }
    })
    return questions.slice(0, 5)
  }

  function start() {
    currentPhase = 1
    currentQuestion = 0
    answers = []
    mbtiScores = { E: 0, I: 0, S: 0, N: 0, T: 0, F: 0, J: 0, P: 0 }
    mbtiType = ''
    heroQuestions = []
    heroScores = {}

    els.btnPrev?.addEventListener('click', goToPrevQuestion)

    renderQuestion()
  }

  return { start }
}
