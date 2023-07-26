import React, { useState, useEffect } from "react";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { faComment } from "@fortawesome/free-solid-svg-icons";
import bubble from "../icons/message.png"
import hide from "../icons/hide.png"
import dotarrow from "../icons/dotarrow.png"
import { storage, db } from "../firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { v4 } from "uuid";
import { useUserAuth } from "../components/UserAuth";
import {
  collection,
  addDoc,
  updateDoc,
  doc,
  onSnapshot,
  arrayUnion,
  serverTimestamp,
  query,
  orderBy,
} from "firebase/firestore";

const Blogs = () => {
  const [imgUpload, setImgUpload] = useState(null);
  const [imgUrl, setImgUrl] = useState("");
  const [blogMsg, setBlogMsg] = useState("");
  const [blogTitle, setBlogTitle] = useState("");
  const [blogs, setBlogs] = useState([]);
  const { user } = useUserAuth();
  const [comments, setComments] = useState({});
  const [commentVisibility, setCommentVisibility] = useState({});
  const [modalVisible, setModalVisible] = useState(false);

  const toggleModal = () => {
    setModalVisible((prev) => !prev);
  };

  const uploadImg = () => {
    return new Promise((resolve, reject) => {
      if (imgUpload == null) {
        reject("No image or video to upload");
        return;
      }

      const fileRef = ref(storage, `BlogMedia/${imgUpload.name + v4()}`);
      uploadBytes(fileRef, imgUpload)
        .then(() => {
          return getDownloadURL(fileRef);
        })
        .then((url) => {
          console.log("Media URL:", url);
          setImgUrl(url);
          resolve(url);
        })
        .catch((error) => {
          console.error("Error uploading media:", error);
          reject(error);
        });
    });
  };

  const handleAddBlog = async (e) => {
    e.preventDefault();
    try {
      const imgUrl = await uploadImg();
      const docRef = await addDoc(collection(db, "Blogs"), {
        uid: "",
        title: blogTitle,
        mediaurl: imgUrl,
        email: user.email,
        msg: blogMsg,
      });
      console.log("Document Id:", docRef.id);
      const dref = doc(db, "Blogs", docRef.id);
      await updateDoc(dref, {
        uid: docRef.id,
        timestamp: serverTimestamp(),
      });

        const prodata = {
          uid: docRef.id,
          title: blogTitle,
          mediaurl: imgUrl,
          email: user.email,
          msg: blogMsg,
        };

      const userRef = doc(db, "Users", user.email);
      await updateDoc(userRef, {
        blogs: arrayUnion(prodata),
      });
      toggleModal();
      // alert("Added Post");
    } catch (error) {
      console.log("Error adding document:", error);
    }
  };

  const handleAddComment = async (blogId, comment) => {
    try {
      const docRef = doc(db, "Blogs", blogId);
      await updateDoc(docRef, {
        comments: arrayUnion(comment),
      });
      setCommentVisibility((prevVisibility) => ({
        ...prevVisibility,
        [blogId]: true,
      }));
    } catch (error) {
      console.log("Error adding comment:", error);
    }
  };

  useEffect(() => {
    const unsubscribe = onSnapshot(
      query(collection(db, "Blogs"), orderBy("timestamp", "desc")), // Order by createdAt in descending order
      (snapshot) => {
        const blogList = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setBlogs(blogList);

        const commentsData = {};
        blogList.forEach((blog) => {
          commentsData[blog.id] = blog.comments || [];
        });
        setComments(commentsData);
      }
    );

    return () => unsubscribe();
  }, []);

  return (
    <section className="section">
      <div className="container">
        <h1 className="title has-text-centered">Check Out the Newest Blogs!</h1>
        <div className="has-text-centered">
          <button className="button is-primary mb-4" onClick={toggleModal}>
            Add Blog
          </button>
        </div>

        <div className={`modal ${modalVisible ? "is-active" : ""}`}>
          <div className="modal-background" onClick={toggleModal}></div>
          <div className="modal-card">
            <header className="modal-card-head">
              <p className="modal-card-title has-text-centered">Add Blog</p>
              <button
                className="delete"
                aria-label="close"
                onClick={toggleModal}
              ></button>
            </header>
            <section className="modal-card-body">
              <form onSubmit={handleAddBlog} id="add-blog-form">
                <div className="field">
                  <label className="label">Title</label>
                  <div className="control">
                    <input
                      className="input"
                      type="text"
                      placeholder="Enter blog title"
                      value={blogTitle}
                      onChange={(e) => setBlogTitle(e.target.value)}
                    />
                  </div>
                </div>
                <div className="field">
                  <label className="label">Media</label>
                  <div className="control">
                    <input
                      className="input"
                      type="file"
                      onChange={(event) => {
                        setImgUpload(event.target.files[0]);
                      }}
                    />
                  </div>
                </div>
                <div className="field">
                  <label className="label">Description</label>
                  <div className="control">
                    <textarea
                      className="textarea"
                      placeholder="Enter blog description"
                      value={blogMsg}
                      onChange={(e) => setBlogMsg(e.target.value)}
                    />
                  </div>
                </div>
              </form>
            </section>
            <footer className="modal-card-foot"></footer>
              <button
                className="button is-primary"
                type="submit"
                form="add-blog-form"
              >
                Upload
              </button>
              <button className="button" onClick={toggleModal}>
                Cancel
              </button>
            </footer>
          </div>
        </div>
            <div className="columns is-centered">
             <div className="column is-half">
              {blogs.map((blog) => (
                <div key={blog.id} className="card mb-5">
                  <div className="card-image">
                    <figure className="image is-4by3">
                      {blog.mediaurl.includes(".mp4") ? (
                        <video controls style={{ width: "100%", height: "auto" }}>
                          <source src={blog.mediaurl} type="video/mp4" />
                          Your browser does not support the video tag.
                        </video>
                      ) : (
                        <img
                          src={blog.mediaurl}
                          alt="Blog Media"
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                          }}
                        />
                      )}
                    </figure>
                  </div>
                  <div className="card-content">
                    <div className="media">
                      <div className="media-content has-text-centered">
                        <p className="title is-3">{blog.title}</p>
                        <p className="subtitle is-6">@{blog.email}</p>
                      </div>
                    </div>

                    <div className="content is-size-4">
                      {blog.msg}
                      <br />
                    </div>
                    <div>
                      <div className="control">
                        <button
                          className="is-link no-background underline-on-hover is-primary"
                          onClick={() =>
                            setCommentVisibility((prevVisibility) => ({
                              ...prevVisibility,
                              [blog.id]: !prevVisibility[blog.id],
                            }))
                          }
                        >
                          {commentVisibility[blog.id] ? (
                            <img src={hide} height="30px" width="30px" alt="Hide" />
                          ) : (
                            <img
                              src={bubble}
                              height="30px"
                              width="30px"
                              alt="Comment"
                            />
                          )}
                        </button>
                      </div>
                    </div>

                    {commentVisibility[blog.id] && (
                      <form
                        onSubmit={(e) => {
                          e.preventDefault();
                          handleAddComment(blog.id, e.target.comment.value);
                          e.target.comment.value = "";
                        }}
                      >
                        <div className="field has-addons">
                          <div className="control is-expanded">
                            <input
                              className="input"
                              type="text"
                              name="comment"
                              placeholder="Add a comment"
                              required
                            />
                          </div>
                          <div className="control">
                            <button className="button is-primary" type="submit">
                              Add Comment
                            </button>
                          </div>
                        </div>
                      </form>
                    )}

                    {commentVisibility[blog.id] && (
                      <ul>
                        {comments[blog.id] &&
                          comments[blog.id].map((comment, index) => (
                            <li className="ml-1 mt-1" key={index}>
                              <img src={dotarrow} width="10px" height="10px" />
                              {comment}
                            </li>
                          ))}
                      </ul>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

        {/* <div className="columns is-centered is-multiline has-shadow has-border">
          {blogs.map((blog) => (
            <div key={blog.id} className="column is-8">
              <div className="box has-shadow has-border-cyan">
                <h2 className="title is-4 has-text-centered">{blog.title}</h2>
                <div className="image-container">
                  {blog.mediaurl.includes(".mp4") ? (
                    <video controls style={{ width: "100%", height: "auto" }}>
                      <source src={blog.mediaurl} type="video/mp4" />
                      Your browser does not support the video tag.
                    </video>
                  ) : (
                    <img
                      src={blog.mediaurl}
                      alt="Blog Media"
                      style={{
                        width: "100%",
                        height: "auto",
                        objectFit: "cover",
                      }}
                    />
                  )}
                </div>
                <div className="centered-text">
                  <p className="centered">{blog.msg}</p>
                </div>
                <div>
                  <div className="control">
                    <button
                      className="is-link no-background underline-on-hover is-primary"
                      onClick={() =>
                        setCommentVisibility((prevVisibility) => ({
                          ...prevVisibility,
                          [blog.id]: !prevVisibility[blog.id],
                        }))
                      }
                    >
                      {commentVisibility[blog.id] ? <img src={hide} height="30px" width="30px" alt="Hide" /> : <img src={bubble} height="30px" width="30px" alt="Comment" />}
                    </button>
                  </div>
                </div>

                {commentVisibility[blog.id] && (
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      handleAddComment(blog.id, e.target.comment.value);
                      e.target.comment.value = "";
                    }}
                  >
                    <div className="field has-addons">
                      <div className="control is-expanded">
                        <input
                          className="input"
                          type="text"
                          name="comment"
                          placeholder="Add a comment"
                        />
                      </div>
                      <div className="control">
                        <button className="button is-primary" type="submit">
                          Add Comment
                        </button>
                      </div>
                    </div>
                  </form>
                )}

                {commentVisibility[blog.id] && (
                  <ul>
                    {comments[blog.id] &&
                      comments[blog.id].map((comment, index) => (
                        <li className="ml-1 mt-1" key={index}><img src={dotarrow} width="10px" height="10px"/>
                        {comment}</li>
                      ))}
                  </ul>
                )}
              </div>
            </div>
          ))}
        </div> */}
      </div>
    </section>
  );

};

export default Blogs;
