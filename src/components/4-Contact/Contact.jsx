import React from 'react'
import "./Contact.css"
export default function Contact() {
    return (
        <section className='contact ' id='contact'>
            <h2 className='title'>
                <span className='icon-envelope'></span>
                Contact Us</h2>
            <p className='sub-title'>Contact us for any inquiries or support you may need.</p>
            <div className="flex ">
                <form action="" className=''>
                    <div className='flex'>
                        <label htmlFor="email">Email Adress</label>
                        <input type="email" id='email' required/>
                    </div>
                    <div className='flex' style={{ marginTop: '24px' }}>
                        <label htmlFor="message">your message</label>
                        <textarea name="" id="message" required></textarea>
                    </div>
                    <button>Submit</button>
                </form>
                <div className="anim ">anim</div>
            </div>
        </section>
    )
}
