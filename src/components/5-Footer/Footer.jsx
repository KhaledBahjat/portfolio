import React from 'react'
import './Footer.css'
export default function Footer() {
  return (
    <footer className='flex'>
      <ul className='flex'>
        <li><a href="#about"> About</a></li>
        <li><a href="#projects">Projects</a></li>
      </ul>
      <p>&copy; 2026 Khaled. All rights reserved.</p>
    </footer>
  )
}
