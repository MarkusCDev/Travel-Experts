import React, { useState, useEffect } from 'react'
import { storage, db } from '../firebase'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import { v4 } from 'uuid'
import { useUserAuth } from '../components/UserAuth'
import { collection, addDoc, updateDoc, doc, onSnapshot } from 'firebase/firestore'

const Blogs = () => {
  const [imgUpload, setImgUpload] = useState(null)
  const [imgUrl, setImgUrl] = useState("")
  const [blogMsg, setBlogMsg] = useState("")
  const [blogTitle, setBlogTitle] = useState("")
  const [blogs, setBlogs] = useState([])
  const { user } = useUserAuth()


const uploadImg = () => {
  return new Promise((resolve, reject) => {
    if (imgUpload == null) {
      reject("No image or video to upload")
      return
    }

    const fileRef = ref(storage, `BlogMedia/${imgUpload.name + v4()}`)
    uploadBytes(fileRef, imgUpload)
      .then(() => {
        return getDownloadURL(fileRef)
      })
      .then((url) => {
        console.log("Media URL:", url)
        setImgUrl(url)
        resolve(url)
      })
      .catch((error) => {
        console.error("Error uploading media:", error)
        reject(error)
      })
    })
  }

    const handleAddBlog = async (e) => {
      e.preventDefault()
      try {
        const imgUrl = await uploadImg()
        const docRef = await addDoc(collection(db, "Blogs"), {
          uid: "",
          title: blogTitle,
          mediaurl: imgUrl,
          email: user.email,
          msg: blogMsg,
        })
        console.log("Document Id:", docRef.id)
        const dref = doc(db, "Blogs", docRef.id)
        await updateDoc(dref, {
          uid: docRef.id,
        })
        alert('Added Post')
      } catch (error) {
        console.log("Error adding document:", error)
      }
    }

    useEffect(() => {
      const unsubscribe = onSnapshot(collection(db, "Blogs"), (snapshot) => {
        const blogList = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }))
        setBlogs(blogList)
      })

      return () => unsubscribe()
    }, [])

  return (
    <div>
      <h1>Blogs</h1>

      {/* From to add a new blog */}
      <form onSubmit={handleAddBlog}>
        <h3>Add Blog</h3>
        <input
          type="text"
          placeholder="title"
          value={blogTitle}
          onChange={(e) => setBlogTitle(e.target.value)}
        />
        <input
          type="file"
          onChange={(event) => {
            setImgUpload(event.target.files[0])
          }}
        />
        <input
          type="text"
          placeholder="description"
          value={blogMsg}
          onChange={(e) => setBlogMsg(e.target.value)}
        />
        <button type="submit">Upload</button>
      </form>

      {/* Display the blogs */}
      {blogs.map((blog) => (
        <div key={blog.id}>
          <h2>{blog.title}</h2>
          {blog.mediaurl.includes(".mp4") ? (
            <video controls style={{ width: "200px", height: "200px" }}>
              <source src={blog.mediaurl} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          ) : (
            <img
              src={blog.mediaurl}
              alt="Blog Media"
              style={{ width: "200px", height: "200px" }}
            />
          )}
          <p>{blog.msg}</p>
        </div>
      ))}
    </div>
  )
}

export default Blogs