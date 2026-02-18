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
})
