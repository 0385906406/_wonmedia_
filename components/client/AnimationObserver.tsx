'use client'

import { useEffect } from 'react'

export function AnimationObserver() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('wm-visible')
          }
        })
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    )

    const targets = document.querySelectorAll('.wm-animate')
    targets.forEach((el) => observer.observe(el))

    const mutation = new MutationObserver(() => {
      document.querySelectorAll('.wm-animate:not(.wm-observed)').forEach((el) => {
        el.classList.add('wm-observed')
        observer.observe(el)
      })
    })
    mutation.observe(document.body, { childList: true, subtree: true })

    return () => {
      observer.disconnect()
      mutation.disconnect()
    }
  }, [])

  return null
}
