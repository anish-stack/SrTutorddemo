import React, { useState } from "react";
import './faq.css'
import axios from "axios";
import toast from "react-hot-toast";
const Faq = () => {
    const [formData,setFormData] = useState({
        Name:'',
        Email:'',
        Phone:'',
        Subject:'',
        Message:''
    })

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault(); // Prevent the default form submission
        try {
            const response = await axios.post('https://api.srtutorsbureau.com/api/v1/uni/create-contact', formData);
            if (response.data.success) {
                toast.success("Your message has been sent successfully! We will get back to you shortly.");
                setFormData({ Name: '', Email: '', Phone: '', Subject: '', Message: '' }); // Reset form fields
            } else {
                toast.error("Failed to send the message.");
            }
        } catch (error) {
            console.error("Error sending message:", error);
            toast.error("An error occurred. Please try again later.");
        }
    };

    const questionBank = [
        {
            id: 1,
            ques: "How does SR Tutor work to help you achieve your goals?",
            ans: "SR Tutor is a brand name providing a platform for students and home tutors to connect quickly and reliably.",
        },
        {
            id: 2,
            ques: "What benefits will you get by this new method of learning?",
            ans: "This innovative method uses the latest technology, enabling students to find the best tutors in their locality.",
        },
        {
            id: 3,
            ques: "How would it help teachers?",
            ans: "It eliminates costly agents, connects teachers directly with parents, and helps them manage time effectively.",
        },
        {
            id: 4,
            link:'https://srtutorsbureau.com/teacher-register?source=home',
            ques: "How are teachers authenticated on this website?",
            ans: (
                <>
                    Teachers register through our  <a href="https://srtutorsbureau.com/teacher-register?source=home" target="_blank" rel="noopener noreferrer">
                    registration page
                    </a>  , providing essential details for verification. 
                    They receive free credits and can submit additional inquiries if needed. 
                    This ensures their profiles are trusted and reliable, offering a secure platform for both students and parents.
                    <br />
                   
                </>
            ),
        },
        {
            id: 5,
            ques: "What are the payment methods?",
            ans: "Payments can be made via cheque, internet banking, demand draft, or cash.",
        },
        {
            id: 6,
            ques: "Do students have to pay anything?",
            ans: "No, the registration is free for students.",
        },
        {
            id: 7,
            ques: "Can individuals know the contact details of the teacher?",
            ans: "Yes, they can easily access the contact details of the teacher.",
        },
        {
            id: 8,
            ques: "What are the contact details of SR Tutors?",
            ans: (
                <>
                    SR Tutors can be reached at the following address and contact information:
                    <ul>
                        <li><strong>Address:</strong> G-55, 1st Floor Near Walia Nursing Home, Vikas Marg, Laxmi Nagar, Delhi - 110092</li>
                        <li><strong>Phone:</strong> +91 9811382915, +91 9899247916</li>
                        <li><strong>Email:</strong> <a href="mailto:sachinkumarsrtb@yahoo.in">sachinkumarsrtb@yahoo.in</a>, <a href="mailto:info@srtutorsbureau.com">info@srtutorsbureau.com</a></li>
                    </ul>
                </>
            ),
        }
    ];

    return (
        <>
          <section
                    className="breadcrumb-area breadcrumb-bg"
                    data-background="https://i.ibb.co/bdJC3Wx/482.jpg"
                    style={{ backgroundImage: 'url("https://i.ibb.co/bdJC3Wx/482.jpg")',width:'100%', backgroundSize:'cover' }}
                >
                    <div className="container">
                        <div className="row">
                            <div className="col-12">
                                <div className="breadcrumb-content">
                                    <h3 className="title">Frequently Asked Questions</h3>
                                    <nav className="breadcrumb">
                                        <span property="itemListElement" typeof="ListItem">
                                            <a href="#">Home</a>
                                        </span>
                                        <span className="breadcrumb-separator">
                                            <i className="fas fa-angle-right" />
                                        </span>
                                        <span property="itemListElement" typeof="ListItem">
                                        Frequently Asked Questions
                                        </span>
                                    </nav>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
                <div className="container my-5">
            {/* Breadcrumbs */}
          


            <div className="row">
                {/* FAQ Section */}
                <div className="col-md-8">
                    <h2 className="mb-4">Frequently Asked Questions</h2>
                    <div className="accordion" id="faqAccordion">
                        {questionBank.map((item) => (
                            <div className="accordion-item" key={item.id}>
                                <h2 className="accordion-header" id={`heading${item.id}`}>
                                    <button
                                        className="accordion-button"
                                        type="button"
                                        data-bs-toggle="collapse"
                                        data-bs-target={`#collapse${item.id}`}
                                        aria-expanded="true"
                                        aria-controls={`collapse${item.id}`}
                                    >
                                        {item.ques}
                                    </button>
                                </h2>
                                <div
                                    id={`collapse${item.id}`}
                                    className="accordion-collapse collapse"
                                    aria-labelledby={`heading${item.id}`}
                                    data-bs-parent="#faqAccordion"
                                >
                                    <div className="accordion-body">{item.ans}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Inquiry Form */}
                <div className="col-md-4">
                    <h2 className="mb-4">Contact us</h2>
                    <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <label htmlFor="name" className="form-label">Name</label>
                            <input type="text" required onChange={handleChange} value={formData.Name} name="Name" className="form-control" id="name" placeholder="Enter your name" />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="Email" className="form-label">Email</label>
                            <input type="email" onChange={handleChange} value={formData.Email} name="Email" className="form-control" id="Email" placeholder="Enter your email" />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="contactNumber" className="form-label">Contact Number</label>
                            <input type="text" required className="form-control"  onChange={handleChange} value={formData.Phone} name="Phone" id="Phone" placeholder="Enter your Contact Number" />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="Message" className="form-label">Message</label>
                            <textarea required className="form-control" id="Message" rows="3" onChange={handleChange} value={formData.Message} name="Message" placeholder="Enter your message"></textarea>
                        </div>
                        <button type="submit" className="btn btn-primary w-100">Submit</button>
                    </form>
                </div>
            </div>
        </div>
        </>
       
    );
};

export default Faq;
