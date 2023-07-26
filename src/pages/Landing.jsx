import React from "react";

const Landing = () => {
  return (
    <section className="hero is-fullheight is-primary hero-section">
      <div className="hero-video">
        <video autoPlay loop muted className="video-background">
          <source src={require("../assets/video.mp4")} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>
      <div className="hero-body">
        <div className="container has-text-centered">
          <h1 className="title is-size-1">Welcome to Travel Experts</h1>
          <h2 className="subtitle is-size-4">
            Unleash the Power of AI to Discover Your Dream Destination! Travel
            Expert is your ultimate travel companion, harnessing the
            cutting-edge capabilities of artificial intelligence to curate
            personalized travel recommendations just for you.
          </h2>
        </div>
      </div>
    </section>
  );
};

export default Landing;
