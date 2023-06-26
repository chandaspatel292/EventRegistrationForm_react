import { useState } from "react";
import "./App.css";
import Firebase from "firebase/compat/app";
import "firebase/compat/database";
import firebaseConfig from "./config";
import { getStorage, ref, uploadBytes } from "firebase/storage";

Firebase.initializeApp(firebaseConfig);
const database = Firebase.database();

function EventForm() {
  let [name, setEventName] = useState("");
  let [description, setEventDescription] = useState("");
  let [venue, setEventVenue] = useState("");
  let [eventLimit, setEventLimit] = useState("");
  let [poster, setEventPoster] = useState(null);
  let [cover, setEventCover] = useState(null);
  let [url, setEventLink] = useState("");
  let [eventDate, setEventDate] = useState("");
  let [category, setEventCategory] = useState("Sports");
  const options = new Set([
    "Sports",
    "Seminar",
    "concert",
    "Festival",
    "Art",
    "Fashion",
    "Education",
  ]);

  async function handleSubmit(e) {
    e.preventDefault();

    const eventDateObject = new Date(eventDate);
    const day = eventDateObject.getDate().toString().padStart(2, "0");
    const month = (eventDateObject.getMonth() + 1).toString().padStart(2, "0");
    const year = eventDateObject.getFullYear().toString();
    const date = `d${day}${month}${year}`;

    const limit = `n${eventLimit}`;

    const storage = getStorage();
    const posterRef = ref(storage, `event_poster/${name}`);
    await uploadBytes(posterRef, poster[0]);
    console.log("Uploaded a poster photo");

    const coverRef = ref(storage, `event_cover_photo/${name}`);
    await uploadBytes(coverRef, cover[0]);
    console.log("Uploaded a cover photo");

    const eventDetails = {
      name,
      description,
      venue,
      limit,
      url,
      date,
      category,
    };
    try {
      const eventRef = database.ref(`Event_details/${name}`);
      await eventRef.set(eventDetails);
      console.log("Event data saved successfully.");
      alert("Event has been successfully registered!!");

      function resetFrom() {
        // reset the form
        setEventName("");
        setEventDescription("");
        setEventVenue("");
        setEventLimit("");
        setEventPoster(null);
        setEventCover(null);
        setEventLink("");
        setEventDate("");
        setEventCategory("Sports");
      }
      resetFrom();
    } catch (error) {
      console.error("Error saving event data:", error);
    }
    console.log(eventDetails);
  }

  return (
    <div className="event-form">
      <form onSubmit={handleSubmit}>
        <div className="event-category">
          <label>
            Event Category:
            <br />
            <select
              value={category}
              onChange={(e) => setEventCategory(e.target.value)}
            >
              {[...options].map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className="event-name">
          <label>
            Event name:
            <br />
            <input
              type="text"
              value={name}
              onChange={(e) => setEventName(e.target.value)}
              required
            />
            <p>
              <i>Please enter a unique name!!</i>
            </p>
          </label>
        </div>

        <div className="event-description">
          <label>
            Event Description:
            <br />
            <textarea
              value={description}
              onChange={(e) => setEventDescription(e.target.value)}
              required
            />
          </label>
        </div>

        <div className="event-venue">
          <label>
            Event Venue:
            <br />
            <input
              type="text"
              value={venue}
              onChange={(e) => setEventVenue(e.target.value)}
              required
            />
          </label>
        </div>

        <div className="event-limit">
          <label>
            Maximum number of participants:
            <input
              type="number"
              value={eventLimit}
              min="1"
              onChange={(e) => setEventLimit(e.target.value)}
              required
            />
          </label>
        </div>

        <div className="event-poster">
          <label>
            Event Poster Photo:
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setEventPoster(e.target.files)}
            />
          </label>
          <div className="poster-preview">
            {poster && (
              <img src={URL.createObjectURL(poster[0])} alt="selected-poster" />
            )}
          </div>
        </div>

        <div className="event-cover">
          <label>
            Event Cover Photo:
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setEventCover(e.target.files)}
            />
          </label>
          <div className="cover-preview">
            {cover && (
              <img src={URL.createObjectURL(cover[0])} alt="selected-cover" />
            )}
          </div>
        </div>

        <div className="event-link">
          <label>
            Event Payment Link:
            <br />
            <input
              type="text"
              value={url}
              onChange={(e) => setEventLink(e.target.value)}
              required
            />
            <p>
              <i>If there are no payments, type "no payment"</i>
            </p>
          </label>
        </div>

        <div className="event-date">
          <label>
            Event Date:
            <br />
            <input
              type="date"
              value={eventDate}
              onChange={(e) => setEventDate(e.target.value)}
              required
            />
          </label>
        </div>

        <div className="submit-button">
          <button type="submit">Submit</button>
        </div>
      </form>
    </div>
  );
}

function App() {
  return (
    <div className="landing-page">
      <div className="header-bar">
        <h1 id="header">Event Registration form</h1>
      </div>
      <EventForm />
    </div>
  );
}

export default App;
