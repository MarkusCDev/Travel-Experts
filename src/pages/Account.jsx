import React, { useState, useEffect, useCallback } from "react";
import { useUserAuth } from "../components/UserAuth";
import { db } from "../firebase";
import { doc, getDoc, deleteDoc, updateDoc } from "firebase/firestore";

const Account = () => {
  const { user } = useUserAuth();
  const [blogs, setBlogs] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  const retdata = useCallback(async () => {
    if (user && user.email) {
      const docRef = doc(db, "Users", user.email);
      const docSnap = await getDoc(docRef);
      setBlogs(docSnap.data()?.blogs ?? []);
      setReviews(docSnap.data()?.reviews ?? []);
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    retdata();
  }, [user, retdata]);

  async function deleteBlog(blogId) {
    await deleteDoc(doc(db, "Blogs", blogId));
    const userBlogRef = doc(db, "Users", user.email);
    const userBlogSnapshot = await getDoc(userBlogRef);

    if (userBlogSnapshot.exists()) {
      const userBlogData = userBlogSnapshot.data();
      const updatedBlogs = userBlogData.blogs.filter(
        (blog) => blog.uid !== blogId
      );

      await updateDoc(userBlogRef, {
        blogs: updatedBlogs,
      });
    }
    retdata();
  }

  async function deleteReview(reviewId) {
    await deleteDoc(doc(db, "Reviews", reviewId));

    const userReviewRef = doc(db, "Users", user.email);
    const userReviewSnapshot = await getDoc(userReviewRef);

    if (userReviewSnapshot.exists()) {
      const userReviewData = userReviewSnapshot.data();
      const updatedReviews = userReviewData.reviews.filter(
        (review) => review.uid !== reviewId
      );

      await updateDoc(userReviewRef, {
        reviews: updatedReviews,
      });
    }
    retdata();
  }

  return (
    <div>
      <div>
        <h1>Hello {user?.email}!</h1>
      </div>
      {loading ? (<div>Loading blog and review data...</div>) : (
        <div>
          <div>Blog Data</div>
          <table className="table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Image</th>
                <th>Descrip.</th>
                <th>Delete</th>
              </tr>
            </thead>
            <tbody>
              {blogs.map((blog) => (
                <tr key={blog.id}>
                  <td>{blog?.title}</td>
                  <td><img src={blog?.mediaurl} height="100" width="100" alt="Blog"/></td>
                  <td>{blog?.msg}</td>
                  <td><button onClick={() => deleteBlog(blog?.uid)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div>Review Data</div>
          <table className="table">
            <thead>
              <tr>
                <th>Location</th>
                <th>content</th>
                <th>Rating</th>
                <th>Delete</th>
              </tr>
            </thead>
            <tbody>
              {reviews.map((review) => (
                <tr key={review.id}>
                  <td>{review?.location}</td>
                  <td>{review?.content}</td>
                  <td>{review?.rating}</td>
                  <td><button onClick={() => deleteReview(review?.uid)}>Delete</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Account;
