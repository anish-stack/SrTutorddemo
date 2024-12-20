import React, { useState } from "react";
import './faq.css'
import axios from "axios";
import toast from "react-hot-toast";
import { Helmet } from "react-helmet-async";
const Faq = () => {

    const [formData, setFormData] = useState({
        Name: '',
        Email: '',
        Phone: '',
        Subject: '',
        Message: ''

    })

    const handleChange = (e) => {
        const { name, value } = e.target;  
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log(formData)
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
            ques: "How do I book a tutor with S.R. Tutors Bureau in East Delhi?",
            ans: "Booking a tutor with us is simple! You can call us at 9811382915 or 9899247916 or fill out the online registration form on our website https://srtutorsbureau.com. We’ll match you with the best home tutor near me based on your requirements",
        },
        {
            id: 2,
            ques: "What subjects do you offer home tuition for in East Delhi?",
            ans: "We offer expert tutoring for a wide range of subjects including math, science, English, accounts, business studies, and more. Whether your child is preparing for Class 10 exams or needs help with Class 12 subjects, we have a tutor for every need.",
        },
        {
            id: 3,
            ques: "Can I find female tutors near me in East Delhi?",
            ans: "Yes! S.R. Tutors Bureau offers female home tutors near me for a comfortable and supportive learning experience. We understand the importance of a safe learning environment, and our experienced female tutors are available for all subjects.",
        },
        {
            id: 4,
            link: 'https://srtutorsbureau.com/teacher-register?source=home',
            ques: "Is home tuition available in areas like Laxmi Nagar and Preet Vihar?",
            ans: 'Yes, we provide home tuition services in East Delhi, including localities like Laxmi Nagar, Preet Vihar, Karkardooma, Shahdara, and surrounding areas. Our tutors are available in these neighborhoods for personalized home tutoring at your convenience.',
        },
        {
            id: 5,
            ques: "Are your tutors experienced and qualified?",
            ans: "Absolutely! All our tutors are highly qualified and have years of teaching experience in their respective subjects. We hand-pick tutors based on their expertise and ability to communicate complex concepts in an easy-to-understand manner.",
        },
        {
            id: 6,
            ques: "How flexible are the tuition schedules?",
            ans: "Our tutors provide flexible scheduling to suit your family’s needs. Whether you need evening or weekend sessions, we will arrange a time that works best for you and your child.",
        },
        {
            id: 7,
            ques: "Do you offer affordable home tuition in East Delhi?",
            ans: "Yes! We offer affordable home tuition services without compromising on quality. Our tutors provide value-driven education tailored to your child’s academic goals.",
        },
        {
            id: 8,
            ques: "What are the contact details of SR Tutors?",
            ans: 'You can contact us by calling 9811382915 or 9899247916 or by visiting our website, https://srtutorsbureau.com. Feel free to send us a message on our website or via email at info@srtutorsbureau.com.'
        }
    ];

    return (
        <>
            <Helmet>
                <title>Frequently Asked Questions - SR Tutors Bureau</title>

                <meta
                    name="description"
                    content="Find answers to commonly asked questions about SR Tutors Bureau's tutoring services. Get insights on tutoring process, fees, registration, and more."
                />

                <meta
                    name="keywords"
                    content="frequently asked questions, FAQ, SR Tutors Bureau, tutoring services, tuition queries, tutor registration, tutoring fees, common questions"
                />

                <link rel="canonical" href="https://www.srtutorsbureau.com/frequently-asked-questions" />
                <meta name="robots" content="index, follow" />
                <meta name="author" content="SR Tutors Bureau" />
                <meta name="publisher" content="SR Tutors Bureau" />
            </Helmet>

            <section
                className="breadcrumb-area breadcrumb-bg"
                data-background="https://i.ibb.co/bdJC3Wx/482.jpg"
                style={{ backgroundImage: 'url("https://i.ibb.co/bdJC3Wx/482.jpg")', width: '100%', backgroundSize: 'cover' }}
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
                                <input type="text" required className="form-control" onChange={handleChange} value={formData.Phone} name="Phone" id="Phone" placeholder="Enter your Contact Number" />
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
