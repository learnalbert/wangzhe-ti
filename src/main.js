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

    const shareModal = document.getElementById('share-modal')
    document.getElementById('btn-share').addEventListener('click', async () => {
      const btn = document.getElementById('btn-share')
      const label = btn.querySelector('span')
      const originalText = label.textContent
      label.textContent = '生成中...'
      btn.disabled = true
      try {
        const heroName = document.getElementById('hero-name').textContent
        const heroDesc = document.getElementById('hero-description').textContent
        const heroSrc = document.getElementById('hero-image').src
        document.getElementById('share-hero-name').textContent = heroName
        document.getElementById('share-hero-desc').textContent = heroDesc
        const shareImg = document.getElementById('share-hero-image')
        shareImg.src = heroSrc
        await new Promise((resolve) => {
          if (shareImg.complete && shareImg.naturalWidth) resolve()
          else { shareImg.onload = resolve; shareImg.onerror = resolve }
        })
        const card = document.getElementById('share-card')
        const canvas = await window.html2canvas(card, {
          backgroundColor: null,
          scale: 2,
          useCORS: true,
        })
        document.getElementById('share-image').src = canvas.toDataURL('image/png')
        shareModal.hidden = false
      } catch (e) {
        console.error('生成分享图失败:', e)
        alert('生成失败，请重试')
      } finally {
        label.textContent = originalText
        btn.disabled = false
      }
    })

    document.getElementById('btn-share-close').addEventListener('click', () => {
      shareModal.hidden = true
    })
    shareModal.querySelector('.share-modal-mask').addEventListener('click', () => {
      shareModal.hidden = true
    })

    console.log('王者TI初始化成功！')
  } catch (error) {
    console.error('初始化失败:', error)
  }
}

init()
