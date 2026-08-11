import { useEffect, useState } from "react"
import Header from "./components/1-Hedear/Header"
import Hero from "./components/2-Hero/Hero"
import Main from "./components/3-Main/Main"
import Contact from "./components/4-Contact/Contact"
import Footer from "./components/5-Footer/Footer"

function App() {
  const [showScrollTop, setShowScrollTop] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 350)
    }

    handleScroll()
    window.addEventListener("scroll", handleScroll)

    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  return (
    <>
      <div className="container">
        <Header />
        <Hero />
        <div className="dvider"></div>
        <Main />
        <div className="dvider"></div>
        <Contact />
        <div className="dvider"></div>
        <Footer />
      </div>

      <button
        type="button"
        className={`scroll-top-btn ${showScrollTop ? "visible" : ""}`}
        onClick={scrollToTop}
        aria-label="Scroll to top"
      >
        ↑
      </button>
    </>
  )
}

export default App
