import React, { useState } from "react";
import styled, { keyframes } from "styled-components";
import luxuryBackground from "../assets/luxury-hotel-suite.jpg";
// import roomTourImage from "../assets/room-tour-360.jpg";
import luxuryVideo from "../assets/luxury-hotel-video.mp4";
import { Link } from "react-router-dom";

// Fade-in animation
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const parallax = keyframes`
  0% { background-position: center 0; }
  100% { background-position: center -20px; }
`;

const LuxuryDivider = styled.div`
  width: 80px;
  height: 2px;
  background: #ffd700;
  margin: 20px auto;
  opacity: 0.8;
`;

const HeroSection = styled.section`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
  position: relative;
  color: #ffffff;
  text-align: center;
  padding: 20px;
  overflow: hidden;
  animation: ${parallax} 10s infinite alternate ease-in-out;

  /* Background Image for Mobile */
  background-image: url(${luxuryBackground});
  background-size: cover;
  background-position: center;

  video {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    z-index: 0;
  }

  /* Video is hidden on small screens */
  @media (max-width: 768px) {
    video {
      display: none;
    }
  }

  &:before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 15, 45, 0.5);
    z-index: 1;
  }

  background-color: #001f3f;
`;

// HeroContent remains the same
const HeroContent = styled.div`
  position: relative;
  z-index: 2;
  max-width: 900px;
  animation: ${fadeIn} 1.2s ease-in-out;

  h1 {
    font-size: 60px;
    font-weight: 900;
    margin-bottom: 25px;
    background: linear-gradient(45deg, #ffd700, #ffec8b);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    text-shadow: 3px 3px 6px rgba(0, 0, 0, 0.8);
    letter-spacing: 1px;
  }

  p {
    font-size: 24px;
    margin-bottom: 35px;
    color: #f5f5f5;
    font-weight: 300;
  }

  button {
    background: linear-gradient(90deg, #ffd700, #ffec8b);
    color: #001f3f;
    border: none;
    border-radius: 10px;
    padding: 18px 40px;
    font-size: 20px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.4s ease;

    a {
      text-decoration: none;
      color: inherit;
      font-weight: inherit;
      font-size: inherit;
      display: block;
      width: 100%;
      height: 100%;
    }

    &:hover {
      background: linear-gradient(90deg, #ffec8b, #ffd700);
      transform: scale(1.1);
      box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
    }
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  gap: 20px; /* Space between buttons */
  justify-content: center;
`;

const Button = styled.button`
  background: linear-gradient(90deg, #ffd700, #ffec8b);
  color: #001f3f;
  border: none;
  border-radius: 10px;
  padding: 18px 40px;
  font-size: 20px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.4s ease;

  a {
    text-decoration: none;
    color: inherit;
    font-weight: inherit;
    font-size: inherit;
    display: block;
    width: 100%;
    height: 100%;
  }

  &:hover {
    background: linear-gradient(90deg, #ffec8b, #ffd700);
    transform: scale(1.1);
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
  }
`;

const Modal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.9);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  opacity: ${(props) => (props.isOpen ? 1 : 0)};
  visibility: ${(props) => (props.isOpen ? "visible" : "hidden")};
  transition: opacity 0.3s ease;
`;

const ModalContent = styled.div`
  position: relative;
  width: 80%;
  max-width: 900px;
  height: 70vh;
  background: #fff;
  border-radius: 10px;
  overflow: hidden;
  animation: ${fadeIn} 0.5s ease-in-out;
  display: flex;
  align-items: center;
  justify-content: center;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  @media (max-width: 768px) {
    width: 90%;
    max-width: 400px;
    height: auto;
    max-height: 70vh;
    border-radius: 15px;

    img {
      width: 100%;
      height: auto;
      max-height: 60vh;
    }
  }
`;

const CloseButton = styled.button`
  position: absolute;
  top: 15px;
  right: 15px;
  background: #ffd700;
  color: #001f3f;
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  font-size: 20px;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: #ffec8b;
    transform: scale(1.1);
  }
`;

const TestimonialSection = styled.section`
  padding: 60px 20px;
  background: #ffffff;
  text-align: center;
`;

const TestimonialTitle = styled.h2`
  font-size: 36px;
  font-weight: 700;
  margin-bottom: 40px;
  color: #001f3f;
`;

const TestimonialContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  max-width: 800px;
  margin: 0 auto;
`;

const TestimonialCard = styled.div`
  background: #f9f9f9;
  border-radius: 10px;
  padding: 20px;
  margin: 10px 0;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s;

  &:hover {
    transform: translateY(-5px);
  }

  p {
    font-size: 18px;
    color: #333;
    font-weight: 300;
    margin: 0;
  }

  span {
    display: block;
    margin-top: 10px;
    font-weight: 600;
    color: #ffd700;
  }
`;

const NewsletterSection = styled.section`
  padding: 60px 20px;
  background: linear-gradient(135deg, #001f3f, #003366); /* Navy gradient */
  color: #f5f5f5;
  text-align: center;
`;

const NewsletterTitle = styled.h2`
  font-size: 36px;
  font-weight: 700;
  margin-bottom: 20px;
  color: #ffd700;
`;

const NewsletterText = styled.p`
  font-size: 18px;
  margin-bottom: 30px;
  color: #d3d3d3;
`;

const NewsletterForm = styled.form`
  display: flex;
  justify-content: center;
  gap: 10px;
  max-width: 600px;
  margin: 0 auto;

  input {
    padding: 15px;
    font-size: 16px;
    border: none;
    border-radius: 8px;
    width: 70%;
    background: #f5f5f5;
    color: #001f3f;
    outline: none;

    &::placeholder {
      color: #666;
    }
  }

  button {
    padding: 15px 30px;
    font-size: 16px;
    background: linear-gradient(90deg, #ffd700, #ffec8b);
    color: #001f3f;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.3s ease;

    &:hover {
      background: linear-gradient(90deg, #ffec8b, #ffd700);
      transform: scale(1.05);
    }
  }
`;

const MapSection = styled.section`
  padding: 60px 20px;
  background: #f5f5f5;
  text-align: center;
`;

const MapTitle = styled.h2`
  font-size: 36px;
  font-weight: 700;
  margin-bottom: 40px;
  color: #001f3f;
`;

const MapContainer = styled.div`
  width: 100%;
  max-width: 1200px;
  height: 400px;
  margin: 0 auto;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
`;

const SocialSection = styled.section`
  padding: 60px 20px;
  background: #fff;
  text-align: center;
`;

const SocialTitle = styled.h2`
  font-size: 36px;
  font-weight: 700;
  margin-bottom: 40px;
  color: #001f3f;
`;

const SocialGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  max-width: 1200px;
  margin: 0 auto;

  img {
    width: 100%;
    height: 250px;
    object-fit: cover;
    border-radius: 10px;
    transition: transform 0.3s ease;

    &:hover {
      transform: scale(1.05);
    }
  }
`;

const Home = () => {
  const [isTourOpen, setIsTourOpen] = useState(false);
  const [email, setEmail] = useState("");

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email) {
      alert(`Subscribed with: ${email}`); // Replace with actual API call later
      setEmail("");
    }
  };

  return (
    <div>
      <HeroSection>
        <video autoPlay loop muted playsInline>
          <source src={luxuryVideo} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        <HeroContent>
          <h1>Indulge in Timeless Luxury</h1>
          <LuxuryDivider />
          <p>Discover unparalleled elegance at our world-class hotel.</p>
          <ButtonContainer>
            <Button>
              <Link to="/rooms">Explore Rooms</Link>
            </Button>
            <Button onClick={() => setIsTourOpen(true)}>Take a Tour</Button>
          </ButtonContainer>
        </HeroContent>
      </HeroSection>

      <Modal isOpen={isTourOpen}>
        <ModalContent>
          <img
            src="https://cache.marriott.com/content/dam/marriott-renditions/dm-static-renditions/wh/emea/hws/r/romwv/en_us/photo/unlimited/assets/wh-romwv-wow-suite20483-37679-classic-hor.jpg"
            alt="360° Room Tour"
          />
          <CloseButton onClick={() => setIsTourOpen(false)}>✕</CloseButton>
        </ModalContent>
      </Modal>

      {/* Testimonial Section */}
      <TestimonialSection>
        <TestimonialTitle>What Our Guests Say</TestimonialTitle>
        <TestimonialContainer>
          <TestimonialCard>
            <p>
              "The best hotel experience I've ever had! The service was
              impeccable and the rooms were stunning."
            </p>
            <span>- John Doe</span>
          </TestimonialCard>
          <TestimonialCard>
            <p>
              "A true luxury experience! I felt pampered from the moment I
              arrived. Highly recommend!"
            </p>
            <span>- Jane Smith</span>
          </TestimonialCard>
          <TestimonialCard>
            <p>
              "Absolutely beautiful! The attention to detail is remarkable. I
              can't wait to come back!"
            </p>
            <span>- Emily Johnson</span>
          </TestimonialCard>
        </TestimonialContainer>
      </TestimonialSection>

      {/* Google Maps Section */}
      <MapSection>
        <MapTitle>Find Us</MapTitle>
        <MapContainer>
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3151.835434509536!2d144.9537363153167!3d-37.8162799797515!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6ad642af0f11fd81%3A0xf577d9c8e5b9b8e0!2sMelbourne%20VIC%2C%20Australia!5e0!3m2!1sen!2sus!4v1631234567890"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen=""
            loading="lazy"
            title="Hotel Location"
          ></iframe>
        </MapContainer>
      </MapSection>

      {/* Newsletter Section */}
      <NewsletterSection>
        <NewsletterTitle>Stay in the Loop</NewsletterTitle>
        <NewsletterText>
          Subscribe for exclusive offers and hotel updates.
        </NewsletterText>
        <NewsletterForm onSubmit={handleSubscribe}>
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <button type="submit">Subscribe</button>
        </NewsletterForm>
      </NewsletterSection>

      {/* Social Media Section */}
      <SocialSection>
        <SocialTitle>Follow Our Journey</SocialTitle>
        <SocialGrid>
          <img
            src="https://images.pexels.com/photos/2873951/pexels-photo-2873951.jpeg?auto=compress&cs=tinysrgb&w=600"
            alt="Room View"
          />
          <img
            src="https://images.pexels.com/photos/261101/pexels-photo-261101.jpeg?auto=compress&cs=tinysrgb&w=600"
            alt="Pool"
          />
          <img
            src="https://images.pexels.com/photos/31222661/pexels-photo-31222661/free-photo-of-luxurious-breakfast-setup-in-hotel-room.jpeg?auto=compress&cs=tinysrgb&w=600"
            alt="Dining"
          />
          <img
            src="https://images.pexels.com/photos/31234758/pexels-photo-31234758/free-photo-of-relaxing-massage-at-luxury-hotel-spa.jpeg?auto=compress&cs=tinysrgb&w=600"
            alt="Spa"
          />
        </SocialGrid>
      </SocialSection>
    </div>
  );
};

export default Home;
