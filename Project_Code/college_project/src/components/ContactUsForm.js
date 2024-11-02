import React, { useRef } from "react";
import emailjs from "emailjs-com";
import "./ContactUsForm.css";

const ContactUsForm = ({ onClose }) => {
  const form = useRef();

  const sendEmail = (e) => {
    e.preventDefault();

    // Send the user's message to your email
    emailjs
      .sendForm(
        "service_6ftpuxm", // Your Service ID
        "template_p06uddn", // Template ID for sending to your email
        form.current,
        "CgB5WhTSFJl5RwHX7" // Your User ID
      )
      .then(
        () => {
          // Send the auto-reply to the sender
          emailjs
            .sendForm(
              "service_6ftpuxm", // Your Service ID
              "template_ywvruik", // Template ID for auto-reply
              form.current,
              "CgB5WhTSFJl5RwHX7" // Your User ID
            )
            .then(
              () => {
                alert(
                  "Message sent successfully, and an auto-reply has been sent!"
                );
                onClose();
              },
              () => {
                alert("Message sent, but failed to send auto-reply.");
              }
            );
        },
        () => {
          alert("An error occurred, please try again.");
        }
      );
  };

  return (
    <div className="contact-us-form-overlay">
      <div className="contact-us-form-container">
        <button className="close-button" onClick={onClose}>
          &times;
        </button>
        <h2>Contact Us</h2>
        <form ref={form} onSubmit={sendEmail}>
          <label>Name</label>
          <input type="text" name="user_name" required />

          <label>Email</label>
          <input type="email" name="user_email" required />

          <label>Message</label>
          <textarea name="message" required></textarea>

          <button type="submit">Send</button>
        </form>
      </div>
    </div>
  );
};

export default ContactUsForm;
