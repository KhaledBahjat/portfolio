// @ts-ignore
import './Hero.css'
export default function Hero() {
    return (
        <section className="hero">
            <div className="left">
                <div className="paernt-avatar">
                    <img className='avatar' src="/public/logo.png" alt="logo" />
                    <span className='icon-verified'></span>
                </div>
                <h1 className='title'>
                    Hello, I am <span className='name'>Khaled Bahjat</span> flutter developer and MERN stack developer.
                </h1>
                <p className='description'>
                    I am a passionate developer with experience in both frontend and backend technologies.
                </p>
                <div className="icons flex">
                    <div className="icon icon-linkedin-square"></div>
                    <div className="icon icon-github"></div>
                    <div className="icon icon-code"></div>
                    <div className="icon icon-envelope"></div>
                </div>
            </div>
            <div className="right border">right</div>
        </section>
    )
}
