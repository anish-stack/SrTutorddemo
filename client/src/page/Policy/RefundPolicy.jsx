import React from 'react';
import { Helmet } from 'react-helmet-async';

const RefundPolicy = () => {
  return (
    <div className="container mt-5">
      <Helmet>
  <title>Refund & Cancellation Policy - SR Tutors Bureau</title>

  <meta
    name="description"
    content="Learn about SR Tutors Bureau's Refund and Cancellation Policy. Understand our guidelines for requesting refunds, cancellations, and other related services."
  />

  <meta
    name="keywords"
    content="refund policy, cancellation policy, SR Tutors Bureau, refund request, tutoring services, terms, cancellation guidelines"
  />

  <link rel="canonical" href="https://www.srtutorsbureau.com/refund-and-cancellation-policy" />
  <meta name="robots" content="index, follow" />
  <meta name="author" content="SR Tutors Bureau" />
  <meta name="publisher" content="SR Tutors Bureau" />
</Helmet>

      <h1 className="text-center mb-4">Refund and Cancellation Policy</h1>

      <section className="mb-5">
        <h3 className="text-danger">Refund Policy</h3>
        <p>
          Tutor, kindly clarify your doubts before you make a payment for any of our membership plans. Once a payment is made, it cannot be refunded.
        </p>
        <p>
          In case you have any doubt or query, please drop an email at <a href="mailto:info@srtutorsbureau.com">info@srtutorsbureau.com</a>. We'll get back to you within 24 hours.
        </p>
      </section>

      <section className="mb-5">
        <h3 className="text-danger">Cancellation Policy</h3>
        <p>
          After making a payment for any membership, if you wish to cancel your membership with us, please contact our Customer Support team at <a href="mailto:info@srtutorsbureau.com">info@srtutorsbureau.com</a>. We will deactivate your account within 24 hours, but no refund will be granted in this case.
        </p>
      </section>
    </div>
  );
};

export default RefundPolicy;
