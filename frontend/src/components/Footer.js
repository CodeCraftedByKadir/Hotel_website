import React from "react";
import styled from "styled-components";
import {
  FaPhone,
  FaEnvelope,
  FaMapMarkerAlt,
  FaFacebook,
  FaInstagram,
} from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";

const FooterContainer = styled.footer`
  background-color: #001f3f; /* Navy blue background */
  color: #ffffff; /* White text */
  padding: 40px 20px;
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  text-align: left;
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.2); /* Subtle shadow for depth */

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: center;
    text-align: center;
  }
`;

const FooterSection = styled.div`
  flex: 1;
  min-width: 250px; /* Minimum width for each section */
  margin: 20px;

  h3 {
    font-size: 24px;
    margin-bottom: 15px;
    color: #ffd700; /* Gold color for headings */
    border-bottom: 2px solid #ffd700; /* Underline for headings */
    padding-bottom: 5px; /* Space between heading and underline */
  }

  p {
    margin: 5px 0;
    font-size: 16px;
    display: flex;
    align-items: center;

    svg {
      margin-right: 10px; /* Space between icon and text */
      color: #ffd700; /* Gold color for icons */
      font-size: 20px; /* Icon size */
    }
  }

  a {
    color: #ffffff; /* White color for links */
    margin-right: 15px;
    font-size: 24px;
    transition: color 0.3s;

    &:hover {
      color: #ffd700; /* Gold color on hover */
    }
  }
`;

const SocialMediaContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 15px;

  a {
    margin: 0 10px; /* Space between social icons */
    font-size: 28px; /* Larger icon size */
    transition: transform 0.3s;

    &:hover {
      transform: scale(1.1); /* Scale effect on hover */
    }
  }
`;

const Footer = () => {
  return (
    <FooterContainer>
      <FooterSection>
        <h3>Contact Us</h3>
        <p>
          <FaPhone /> +234 801 234 5678
        </p>
        <p>
          <FaEnvelope /> info@luxuryhotel.com
        </p>
        <p>
          <FaMapMarkerAlt /> Victoria Island, Lagos, Nigeria
        </p>
      </FooterSection>

      <FooterSection>
        <h3>Follow Us</h3>
        <SocialMediaContainer>
          <a href="https://www.facebook.com" aria-label="Facebook">
            <FaFacebook />
          </a>
          <a href="https://www.instagram.com" aria-label="Instagram">
            <FaInstagram />
          </a>
          <a href="https://www.x.com" aria-label="X">
            <FaXTwitter />
          </a>
        </SocialMediaContainer>
      </FooterSection>

      <FooterSection>
        <h3>Luxury Hotel</h3>
        <p>&copy; {new Date().getFullYear()} All Rights Reserved</p>
      </FooterSection>
    </FooterContainer>
  );
};

export default Footer;
