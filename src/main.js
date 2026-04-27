import { createQuiz } from './quiz.js'
import { renderResult } from './result.js'

async function loadJSON(path) {
  const res = await fetch(path)
  return res.json()
}

async function init() {
  try {
    const data = await loadJSON('./data/questions.json')

    const pages = {
      intro: document.getElementById('page-intro'),
      quiz: document.getElementById('page-quiz'),
      result: document.getElementById('page-result'),
    }

    function showPage(name) {
      Object.values(pages).forEach((p) => p.classList.remove('active'))
      pages[name].classList.add('active')
      window.scrollTo(0, 0)
    }

    function onQuizComplete(result) {
      renderResult(result, data)
      showPage('result')
    }

    const quiz = createQuiz(data, onQuizComplete)

    document.getElementById('btn-start').addEventListener('click', () => {
      quiz.start()
      showPage('quiz')
    })

    document.getElementById('btn-restart').addEventListener('click', () => {
      quiz.start()
      showPage('quiz')
    })

    document.getElementById('btn-share').addEventListener('click', () => {
      const btn = document.getElementById('btn-share')
      const text = `我的本命英雄是${document.getElementById('hero-name').textContent}！快来测测你的王者TI吧~`
      navigator.clipboard.writeText(text).then(() => {
        btn.querySelector('span').textContent = '已复制!'
        setTimeout(() => {
          btn.querySelector('span').textContent = '分享结果'
        }, 2000)
      })
    })

    console.log('王者TI初始化成功！')
  } catch (error) {
    console.error('初始化失败:', error)
  }
}

init()
