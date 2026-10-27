function Features() {

  const features = [
    {
      icon: "🤖",
      title: "AI Code Explanation",
      desc: "Understand any code with AI-powered explanations."
    },

    {
      icon: "📚",
      title: "Learning Roadmap",
      desc: "Follow a personalized programming roadmap."
    },

    {
      icon: "💻",
      title: "Coding Practice",
      desc: "Solve coding questions and improve your skills."
    },

    {
      icon: "🐞",
      title: "Bug Detection",
      desc: "Find and fix coding errors instantly."
    },

    {
      icon: "📊",
      title: "Progress Tracking",
      desc: "Track your learning journey."
    },

    {
      icon: "🎯",
      title: "Interview Preparation",
      desc: "Practice AI-generated interview questions."
    }
  ];

  return (

    <section className="features">

      <h2>Why Choose Code Mentor AI?</h2>

      <div className="feature-container">

        {features.map((item,index)=>(

          <div className="card" key={index}>

            <div className="icon">
              {item.icon}
            </div>

            <h3>{item.title}</h3>

            <p>{item.desc}</p>

          </div>

        ))}

      </div>

    </section>

  );

}

export default Features;