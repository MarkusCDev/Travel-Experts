import React, { useState, useEffect } from "react";
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
      });
      const userRef = doc(db, "Users", user.email);
      await updateDoc(userRef, {
        blogs: arrayUnion(docRef.id),
      });
      alert("Added Post");
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
    const unsubscribe = onSnapshot(collection(db, "Blogs"), (snapshot) => {
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
    });

    return () => unsubscribe();
  }, []);

  return (
    <section className="section">
      <div className="container">
        <h1 className="title">Blogs</h1>

        {/* Form to add a new blog */}
        <form onSubmit={handleAddBlog}>
          <h3 className="subtitle">Add Blog</h3>
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
          <div className="field">
            <div className="control">
              <button className="button is-primary" type="submit">
                Upload
              </button>
            </div>
          </div>
        </form>

        {/* Display the blogs */}
        {blogs.map((blog) => (
          <div key={blog.id} className="box">
            <h2 className="title is-4">{blog.title}</h2>
            {blog.mediaurl.includes(".mp4") ? (
              <video controls style={{ width: "100%" }}>
                <source src={blog.mediaurl} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            ) : (
              <img
                src={blog.mediaurl}
                alt="Blog Media"
                style={{ width: "100%", maxHeight: "200px", objectFit: "cover" }}
              />
            )}
            <p>{blog.msg}</p>
            <button
              className="button is-link"
              onClick={() =>
                setCommentVisibility((prevVisibility) => ({
                  ...prevVisibility,
                  [blog.id]: !prevVisibility[blog.id],
                }))
              }
            >
              {commentVisibility[blog.id] ? "Hide Comments" : "Show Comments"}
            </button>
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
                    <li key={index}>{comment}</li>
                  ))}
              </ul>
            )}
          </div>
        ))}
      </div>
    </section>
  );
};

export default Blogs;


