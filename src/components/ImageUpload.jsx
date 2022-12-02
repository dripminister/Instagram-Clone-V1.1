import { collection, Timestamp, addDoc, updateDoc } from "firebase/firestore"
import React, { useState } from "react"
import { storage, db } from "../firebase"
import { ref, getDownloadURL, uploadBytesResumable } from "firebase/storage"

export default function ImageUpload({ user, setShowUpload }) {
	const [caption, setCaption] = useState("")
	const [progress, setProgress] = useState(0)
	const [file, setFile] = useState(null)
	const postRef = collection(db, "posts")

	const handleChange = (e) => {
		if (e.target.files[0]) {
			setFile(e.target.files[0])
		}
	}

	const metadata = {
		contentType: "image/jpeg",
	}

	const storageRef = ref(storage, "images/" + file?.name)
	const uploadTask = uploadBytesResumable(storageRef, file, metadata)

	const handleUpload = () => {
        if(!file || !caption) return alert("Please provide a caption and file")
		uploadTask.on(
			"state_changed",
			(snapshot) => {
				const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
				setProgress(progress)
				switch (snapshot.state) {
					case "paused":
						console.log("Upload is paused")
						break
					case "running":
						console.log("Upload is running")
						break
				}
			},
			(error) => {
				switch (error.code) {
					case "storage/unauthorized":
						// User doesn't have permission to access the object
						break
					case "storage/canceled":
						// User canceled the upload
						break

					// ...

					case "storage/unknown":
						// Unknown error occurred, inspect error.serverResponse
						break
				}
			},
			() => {
				getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
					addDoc(postRef, {
						timestamp: Timestamp.now(),
						caption,
						image: downloadURL,
						username: user.displayName,
						userId: user.uid,
                        likes: []
					})

					setProgress(0)
					setCaption("")
					setFile(null)
				})
			}
		)
	}

	return (
		<div className="imageUpload">
			<div className="imageUpload__container">
				<label
					htmlFor="imageUpload__fileInput"
					className="imageUpload__label"
				>
					{file ? file.name : <h1 className="imageUpload__add">+</h1>}
				</label>
				<input
					type="file"
					onChange={handleChange}
					className="imageUpload__fileInput"
					id="imageUpload__fileInput"
					accept="image/png, image/gif, image/jpeg, image/avif"
				/>
				<div className="imageUpload__flex">
					<progress
						value={progress}
						max="100"
						className="imageUpload__progress"
					/>

					<input
						type="text"
						onChange={(e) => setCaption(e.target.value)}
						value={caption}
						placeholder="Caption"
					/>
					<button onClick={handleUpload}>Post</button>
				</div>
			</div>
			<h1
				className="imageUpload__close"
				onClick={() => setShowUpload(false)}
			>
				X
			</h1>
		</div>
	)
}
