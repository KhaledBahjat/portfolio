import { useState } from 'react'
import './Hedear.css'
export default function Header() {
  const [showModal, setShowModal] = useState(false);
  return (
    <header className='flex'>
      <button className='menu icon-menu' onClick={() => {
        setShowModal(true);
      }} />
      <div />
      <nav>
        <ul className='flex'>
          <li><a href="#about">About</a></li>
          <li><a href="#articles">Articles</a></li>
          <li><a href="#projects">Projects</a></li>
          <li><a href="#speaking">Speaking</a></li>
        </ul>
      </nav>
      <button className='mood flex'>
        <span className='icon-moon-o'></span>
      </ button>
      {showModal &&
        <div className="fixed">
          <ul className="model">
            <li><button className='icon-cancel' onClick={() => {
              setShowModal(false);
            }} /></li>
            <li ><a href="#about">About</a></li>
            <li><a href="#articles">Articles</a></li>
            <li><a href="#projects">Projects</a></li>
            <li><a href="#speaking">Speaking</a></li>
          </ul>
        </div>
      }
    </header>
  )
}
