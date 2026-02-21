import './style.css'

document.addEventListener('DOMContentLoaded', () => {
  const navbar = document.getElementById('navbar')
  const hamburger = document.getElementById('hamburger')
  const mobileMenu = document.getElementById('mobile-menu')
  const mobileLinks = document.querySelectorAll('.mobile-nav-link')
  const allNavLinks = document.querySelectorAll('.nav-link, .nav-contact')

  // Navbar scroll effect
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled')
    } else {
      navbar.classList.remove('scrolled')
    }
  })

  // Hamburger toggle
  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active')
    mobileMenu.classList.toggle('open')
    document.body.style.overflow = mobileMenu.classList.contains('open') ? 'hidden' : ''
  })

  // Close mobile menu on link click
  mobileLinks.forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('active')
      mobileMenu.classList.remove('open')
      document.body.style.overflow = ''
    })
  })

  // Smooth scroll for all nav links
  allNavLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault()
      const targetId = link.getAttribute('href')
      const target = document.querySelector(targetId)
      if (target) {
        const offset = 64
        const top = target.getBoundingClientRect().top + window.scrollY - offset
        window.scrollTo({ top, behavior: 'smooth' })
      }
    })
  })

  // Intersection Observer for scroll animations
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animate-in')
        observer.unobserve(entry.target)
      }
    })
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' })

  document.querySelectorAll('.animate-on-scroll').forEach(el => {
    observer.observe(el)
  })

  // Close mobile menu on resize to desktop (lg: 1024px)
  window.addEventListener('resize', () => {
    if (window.innerWidth >= 1024) {
      hamburger.classList.remove('active')
      mobileMenu.classList.remove('open')
      document.body.style.overflow = ''
    }
  })

  // Sound toggle with 3-click sequence
  const soundToggle = document.getElementById('sound-toggle')
  const iconOn = document.getElementById('sound-icon-on')
  const iconOff = document.getElementById('sound-icon-off')
  const bgMusic = document.getElementById('bg-music')
  bgMusic.volume = 0.4

  let isPlaying = false
  let isAnimating = false
  let clickStage = 0

  const GESTURE_EVENTS = ['click', 'scroll', 'keydown', 'keyup', 'touchstart', 'touchend', 'mousedown', 'mouseup', 'mousemove', 'pointerdown', 'wheel']

  function markPlaying() {
    isPlaying = true
    localStorage.setItem('music-playing', '1')
    soundToggle.classList.add('playing')
    iconOff.classList.add('hidden')
    iconOn.classList.remove('hidden')
  }

  function markStopped() {
    isPlaying = false
    localStorage.setItem('music-playing', '0')
    soundToggle.classList.remove('playing')
    iconOn.classList.add('hidden')
    iconOff.classList.remove('hidden')
  }

  function startOnGesture() {
    if (isPlaying) return
    bgMusic.play().then(() => {
      markPlaying()
      GESTURE_EVENTS.forEach(ev => document.removeEventListener(ev, startOnGesture))
    }).catch(() => {})
  }

  function attemptAutoplay() {
    bgMusic.play().then(() => {
      markPlaying()
    }).catch(() => {
      GESTURE_EVENTS.forEach(ev => document.addEventListener(ev, startOnGesture))
    })
  }

  // If music was playing before reload, try to resume immediately
  if (localStorage.getItem('music-playing') === '1') {
    attemptAutoplay()
  } else {
    // First visit — start on any interaction
    GESTURE_EVENTS.forEach(ev => document.addEventListener(ev, startOnGesture))
  }

  function clearPositions() {
    soundToggle.classList.remove('pos-top-right', 'pos-top-left', 'pos-bottom-right')
  }

  function toggleSound() {
    if (isPlaying) {
      bgMusic.pause()
      markStopped()
    } else {
      bgMusic.play()
      markPlaying()
    }
  }

  soundToggle.addEventListener('click', () => {
    if (isAnimating) return

    clickStage++

    if (clickStage === 1) {
      isAnimating = true
      soundToggle.classList.add('shaking')
      soundToggle.addEventListener('animationend', () => {
        soundToggle.classList.remove('shaking')
        clearPositions()
        soundToggle.classList.add('pos-top-right')
        isAnimating = false
      }, { once: true })

    } else if (clickStage === 2) {
      isAnimating = true
      soundToggle.classList.add('shaking')
      soundToggle.addEventListener('animationend', () => {
        soundToggle.classList.remove('shaking')
        clearPositions()
        soundToggle.classList.add('pos-top-left')
        isAnimating = false
      }, { once: true })

    } else {
      isAnimating = true
      soundToggle.classList.add('shaking')
      soundToggle.addEventListener('animationend', () => {
        soundToggle.classList.remove('shaking')
        clearPositions()
        soundToggle.classList.add('pos-bottom-right')
        toggleSound()
        clickStage = 0
        isAnimating = false
      }, { once: true })
    }
  })
})
