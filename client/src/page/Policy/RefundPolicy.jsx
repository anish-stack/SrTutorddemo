import React from 'react';

const RefundPolicy = () => {
  return (
    <div className="container mt-5">
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
