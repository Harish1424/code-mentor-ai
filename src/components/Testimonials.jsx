function Testimonials() {

  const reviews = [
    {
      name: "Harish",
      review: "Code Mentor AI helped me understand Java and React concepts much faster.",
      rating: "⭐⭐⭐⭐⭐"
    },
    {
      name: "Rahul",
      review: "The personalized learning roadmap kept me focused throughout my learning journey.",
      rating: "⭐⭐⭐⭐⭐"
    },
    {
      name: "Priya",
      review: "The interview preparation module improved my confidence for coding interviews.",
      rating: "⭐⭐⭐⭐⭐"
    }
  ];

  return (
    <section className="testimonials">

      <h2>What Our Students Say</h2>

      <div className="testimonial-container">

        {reviews.map((item, index) => (

          <div className="testimonial-card" key={index}>

            <h3>{item.rating}</h3>

            <p>"{item.review}"</p>

            <h4>- {item.name}</h4>

          </div>

        ))}

      </div>

    </section>
  );
}

export default Testimonials;