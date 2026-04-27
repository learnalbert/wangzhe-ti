export function renderResult(result, data) {
  const { mbtiType, hero, heroScores } = result

  if (!hero) {
    renderFallbackResult(mbtiType)
    return
  }

  const heroImagePath = `./hero_images/${hero.name}.png`

  document.getElementById('hero-name').textContent = hero.name
  document.getElementById('hero-title').style.display = 'none'
  document.getElementById('mbti-tag').style.display = 'none'
  document.getElementById('hero-description').textContent = hero.enriched_description || hero.description || ''
  document.querySelector('.hero-stats').style.display = 'none'

  const heroImage = document.getElementById('hero-image')
  heroImage.src = heroImagePath
  heroImage.alt = hero.name

  heroImage.onerror = () => {
    heroImage.src = `./hero_images/${hero.name}.jpg`
    heroImage.onerror = () => {
      heroImage.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="600" viewBox="0 0 400 600"%3E%3Crect width="400" height="600" fill="%2314141f"/%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" font-family="Microsoft YaHei" font-size="32" fill="%23d4a84b"%3E' + encodeURIComponent(hero.name) + '%3C/text%3E%3C/svg%3E'
    }
  }

  animateResultEntry()
  console.log('结果渲染完成:', { mbtiType, hero: hero.name, heroScores })
}

function renderFallbackResult(mbtiType) {
  document.getElementById('hero-name').textContent = '神秘英雄'
  // document.getElementById('hero-title').textContent = '等待召唤'
  // document.getElementById('mbti-tag').textContent = mbtiType || '????'
  document.getElementById('hero-description').textContent = '你的性格特质非常独特，暂时还没有找到完全匹配的英雄。但这正是你与众不同的地方！'
  // document.getElementById('hero-role').textContent = '未知'
  // document.getElementById('hero-difficulty').textContent = '???'

  const heroImage = document.getElementById('hero-image')
  heroImage.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="600" viewBox="0 0 400 600"%3E%3Crect width="400" height="600" fill="%2314141f"/%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" font-family="Microsoft YaHei" font-size="48" fill="%23d4a84b"%3E%3F%3C/text%3E%3C/svg%3E'
}

function animateResultEntry() {
  const elements = [
    document.querySelector('.result-header'),
    document.querySelector('.hero-showcase'),
    document.querySelector('.hero-info'),
    document.querySelector('.result-actions'),
  ]

  elements.forEach((el, idx) => {
    if (!el) return
    el.style.opacity = '0'
    el.style.transform = 'translateY(30px)'

    setTimeout(() => {
      el.style.transition = 'all 0.6s ease'
      el.style.opacity = '1'
      el.style.transform = 'translateY(0)'
    }, idx * 150)
  })
}
