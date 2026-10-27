import aboutImage from "../assets/about-ai.png";

function About() {
  return (
    <section className="about">

      <div className="about-image">
        <img src={aboutImage} alt="Code Mentor AI" />
      </div>

      <div className="about-content">

        <h2>About Code Mentor AI</h2>

        <p>
          Code Mentor AI is an AI-powered learning platform designed
          to help students improve their programming skills. It offers
          AI-based code explanations, personalized learning roadmaps,
          coding practice, bug detection, progress tracking, and
          interview preparation in one place.
        </p>

        <button>Learn More</button>

      </div>

    </section>
  );
}

export default About;