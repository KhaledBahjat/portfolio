import Card from './Card'
import './Main.css'
export default function Main() {
  return (
    <main className='main flex'>
      <section className="left-sec flex ">
        <button className='active'>All Projects</button>
        <button>Web Development</button>
        <button>Mobile Development</button>
      </section>


      <section className="right-sec  flex">
        {[<Card/>, <Card/>, <Card/>, <Card/>, <Card/>, <Card/>].map((card, index) => (
          <div key={index} className="card">
            {card}
          </div>
        ))}
      </section>
    </main>
  )
}
