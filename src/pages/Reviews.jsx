import React, { useState, useEffect } from 'react';
import { useSearchParams } from "react-router-dom";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { addDoc, collection, getDocs,  query, where, limit, orderBy, doc, updateDoc, arrayUnion } from "firebase/firestore";
import { db } from "../firebase";
import GeoPoint from 'geopoint';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from '@fortawesome/free-solid-svg-icons'

const Reviews = () => {
  const auth = getAuth();
  const [user, setUser] = useState(auth.currentUser);
  const [searchParams, setSearchParams] = useSearchParams();
  const reviewsRef = collection(db, 'Reviews');
  const [reviews, setReviews] = useState([]);
  const [starHover, setStarHover] = useState(0);
  const [modalVisible, setModalVisible] = useState(false);

  const toggleModal = () => {
    setModalVisible((prev) => !prev);
  };

  function formatDate(timestamp) {
    const date = new Date(timestamp);

    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear().toString().slice(-2);

    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    const seconds = date.getSeconds().toString().padStart(2, "0");

    const formattedDate = `${month}-${day}-${year}`;
    const formattedTime = `${hours}:${minutes}:${seconds}`;

    return `${formattedDate} ${formattedTime}`;
  }

  const blankNewReview = () => ({
    location: {
      latitude: searchParams.get("latitude") || 0,
      longitude: searchParams.get("longitude") || 0,
      name: searchParams.get("name") || ''
    },
    rating: 0,
    content: ''
  });

  const [newReview, setNewReview] = useState(blankNewReview());

  const validateReviewIsComplete = () => !(
    newReview.content !== '' &&
    newReview.location.latitude !== 0 &&
    newReview.location.longitude !== 0 &&
    newReview.location.name !== ''
  );

  const getReviews = async () => {
    const querySnapshot = await getDocs(reviewsRef);

    return querySnapshot;
  };

  const getReviewsByQuery = async (query) => {
    const querySnapshot = await getDocs(query);

    return querySnapshot;
  };

  const getReviewsByUserId = async (userId) => await getReviewsByQuery(query(reviewsRef, where('userId', '==', userId)));

  const getReviewsCurrentUser = async () => {
    return await getReviewsByUserId(user.email);
  };

  const getReviewsByLocationName = async (name) => await getReviewsByQuery(query(reviewsRef, where('location.name', '==', name)));

  const getReviewsByLocationDistance = async (location, distance = 1) => {
    const point1 = new GeoPoint(location.latitude, location.longitude);
    const querySnapshot = await getDocs(reviewsRef);

    let reviews = querySnapshot.docs.filter(review => {
      const point2 = new GeoPoint(review.data().location.latitude, review.data().location.longitude);

      return (point1.distanceTo(point2) <= distance);
    });

    return reviews;
  };

  const getReviewsRecent = async (maxNumber = 5) => await getReviewsByQuery(query(reviewsRef, limit(maxNumber), orderBy('createdAt', 'desc')));

  const createReview = async (data) => {
    console.log(data);
    try {
      const docRef = await addDoc(collection(db, "Reviews"), {
        userId: user.email,
        location: data.location,
        rating: data.rating,
        content: data.content,
        createdAt: Date.now()
      });
      console.log("Document Id:", docRef.id);
      const dref = doc(db, "Reviews", docRef.id);
      await updateDoc(dref, {
        uid: docRef.id,
      });

       const prodata = {
         uid: docRef.id,
         location: data.location.name,
         rating: data.rating,
         content: data.content,
        };

      const userRef = doc(db, "Users", user.email);
      await updateDoc(userRef, {
        reviews: arrayUnion(prodata),
      });
    } catch (error) {
      console.log("An error occured when creating a new review:", error);
    };
  };

  const onStarHover = (newValue) => {
    setStarHover(newValue);
  };

  const onStarClick = (newValue) => {
    if (newReview.rating !== newValue) {
      newReview.rating = newValue;
    } else {
      newReview.rating = 0;
    };

    setNewReview(newReview);
  };

  const starClass = value => {
    let className = "fa fa-star rating";

    if (starHover >= (value)) className += ' selection';
    if (newReview.rating >= (value)) className += ' checked';

    return className;
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    createReview(newReview).then(() => {
      getReviewsRecent().then(reviews => {
        setReviews(reviews.docs);
      });

      setNewReview(blankNewReview());

      setSearchParams();
    });
    toggleModal();
  };

  useEffect(() => {
    onAuthStateChanged(auth, (authUser) => {
      setUser(authUser);
    });

    getReviewsByQuery(query(reviewsRef, limit(5), orderBy('createdAt', 'desc'))).then(reviews => {
      setReviews(reviews.docs);
    });

    const testData1 = {
      location: {
        latitude: 21.2768,
        longitude: -157.8236,
        name: "Waikiki Beach, Hawaii"
      },
      rating: 2,
      content: 'Test content0'
    };
    const testData2 = {
      location: {
        latitude: 40.689249,
        longitude: -74.044500,
        name: "Statue of Liberty, NY"
      },
      rating: 3,
      content: 'Test content1'
    };
  }, [user]);

  return (
    <section className="section">
      <h1 className="title has-text-centered">Destination Reviews</h1>
      <div className="has-text-centered">
        <button className="button is-primary mb-4" onClick={toggleModal}>
          Add Review
        </button>
      </div>

      <div className={`modal ${modalVisible ? "is-active" : ""}`}>
        <div className="modal-background" onClick={toggleModal}></div>
        <div className="modal-card">
          <header className="modal-card-head">
            <p className="modal-card-title has-text-centered">Add Review</p>
            <button
              className="delete"
              aria-label="close"
              onClick={toggleModal}
            ></button>
          </header>
          <section className="modal-card-body">
            <form id="add-review-form" onSubmit={handleSubmit}>
              <div className="container">
                <h1 className="title">New Review</h1>
                <div className="field">
                  <label className="label">Location name</label>
                  <div className="control">
                    <input
                      className="input"
                      type="text"
                      placeholder="Enter location name"
                      value={newReview.location.name}
                      onChange={(e) =>
                        setNewReview({
                          ...newReview,
                          location: {
                            ...newReview.location,
                            name: e.target.value,
                          },
                        })
                      }
                      disabled={searchParams.get("name")}
                    />
                  </div>
                </div>
                <div className="field">
                  <label className="label">Latitude</label>
                  <div className="control">
                    <input
                      className="input"
                      type="number"
                      placeholder="Enter Latitude"
                      value={newReview.location.latitude || ""}
                      onChange={(e) =>
                        setNewReview({
                          ...newReview,
                          location: {
                            ...newReview.location,
                            latitude: e.target.value,
                          },
                        })
                      }
                      disabled={searchParams.get("latitude")}
                    />
                  </div>
                </div>
                <div className="field">
                  <label className="label">Longitude</label>
                  <div className="control">
                    <input
                      className="input"
                      type="number"
                      placeholder="Enter Longitude"
                      value={newReview.location.longitude || ""}
                      onChange={(e) =>
                        setNewReview({
                          ...newReview,
                          location: {
                            ...newReview.location,
                            longitude: e.target.value,
                          },
                        })
                      }
                      disabled={searchParams.get("longitude")}
                    />
                  </div>
                </div>
                <div className="field">
                  <label className="label">Content</label>
                  <div className="control">
                    <textarea
                      className="textarea"
                      placeholder="Enter review"
                      value={newReview.content}
                      onChange={(e) =>
                        setNewReview({ ...newReview, content: e.target.value })
                      }
                    />
                  </div>
                </div>
                <div className="field">
                  <label className="label">Score</label>
                  <div className="control">
                    {Array.apply(null, Array(5)).map((ele, i) => (
                      <FontAwesomeIcon
                        key={i + 1}
                        icon={faStar}
                        className={starClass(i + 1)}
                        onMouseOver={() => onStarHover(i + 1)}
                        onMouseOut={() => onStarHover(0)}
                        onClick={() => onStarClick(i + 1)}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </form>
          </section>
          <footer className="modal-card-foot">
            <button
              className="button is-primary"
              type="submit"
              form="add-review-form"
            >
              Upload
            </button>
            <button className="button" onClick={toggleModal}>
              Cancel
            </button>
          </footer>
        </div>
      </div>

      <div className="container">
        {reviews.map((review) => {
          const data = review.data();

          return (
            <div key={review.id} className="box">
              <h2 className="title is-4">
                {data.location.name}
                <span style={{ float: "right" }}>
                  {Array.apply(null, Array(5)).map((ele, i) => (
                    <FontAwesomeIcon
                      key={i + 1}
                      icon={faStar}
                      className={
                        i + 1 <= data.rating
                          ? "fa fa-star checked"
                          : "fa fa-star"
                      }
                    />
                  ))}
                </span>
              </h2>
              <div className='is-size-6'>User: {data.userId}</div>
              <div className='is-size-6'>Created: {formatDate(data.createdAt)}</div>
              <div className="mt-3 is-size-5" style={{ color: "#032633" }}>
                {data.content}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default Reviews;


