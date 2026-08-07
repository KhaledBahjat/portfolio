import React from 'react'
import "./Contact"
export default function Contact() {
    return (
        <div className='contact' id='contact'>
            <h2 className='title'>
                <span className='icon-envelope'></span>
                Contact
            </h2>
            <p className='sub-title'>

            </p>

            <section className="left-sec flex">
                <form action="" className='flex'>
                    <label htmlFor="email">Email</label>
                    <input type="email" id='email' />
                    <label htmlFor="message">Message</label>
                    <textarea name="" id="message"></textarea>
                </form>
            </section>
        </div>
    )
}
