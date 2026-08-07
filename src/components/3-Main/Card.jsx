import React from 'react'

export default function Card() {
    return (
        <article className='card'>

            <img width={266} src="/public/project.jpg" alt="project logo" />


            <div style={{ width: "266px" }} className="box">
                <h1 className="project-title">Project Title</h1>
                <p className="project-description">Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quod.</p>

                <div className="flex details">
                    <div className="icons flex">
                        <div className="icon icon-link"></div>
                        <div className="icon icon-github"></div>
                    </div>
                    <a className='btn-more-info' href="">
                        More Info
                    </a>
                </div>
            </div>
        </article>
    )
}
