import React, { useState, useEffect } from "react"
import Comment from "./Comment"
import FavoriteIcon from "@mui/icons-material/Favorite"
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder"
import {
	collection,
	onSnapshot,
	addDoc,
	Timestamp,
	query,
	orderBy,
	doc,
	deleteDoc,
	updateDoc,
	arrayUnion,
	arrayRemove,
	getDoc,
	deleteField
} from "firebase/firestore"
import { db } from "../firebase"
import { Link } from "react-router-dom"

export default function Post({
	image,
	username,
	caption,
	postId,
	user,
	userId,
	likes,
}) {
	const [comments, setComments] = useState([])
	const [comment, setComment] = useState("")
	const [liked, setLiked] = useState(false)
	const [author, setAuthor] = useState(null)

	const likePost = async (id) => {
		if (!user) return alert("Please log in first")
		const postDoc = doc(db, "posts", id)

		await updateDoc(postDoc, {
			likes: arrayUnion(user.uid),
		})
		setLiked(true)
	}

	const unlikePost = async (id) => {
		if (!user) return alert("Please log in first")
		const postDoc = doc(db, "posts", id)

		await updateDoc(postDoc, {
			likes: arrayRemove(user.uid),
		})
		setLiked(false)
	}

	useEffect(() => {
		const handleSearch = async (id) => {
			const postDoc = doc(db, "posts", id)
			const docSnap = await getDoc(postDoc)
			const likeArray =
				docSnap._document.data.value.mapValue.fields.likes.arrayValue.values
			if (!likeArray) return
			const isLiked = likeArray.filter((like) => like.stringValue == user?.uid)
			if (isLiked.length > 0) {
				setLiked(true)
			}
		}

		handleSearch(postId)
	}, [])

	const postComment = (e) => {
		e.preventDefault()
		const postCollectionRef = collection(db, "posts", postId, "comments")
		addDoc(postCollectionRef, {
			username: user.displayName,
			text: comment,
			timestamp: Timestamp.now(),
			userId: user.uid,
		})
		setComment("")
	}

	const deletePost = async () => {
		const postDoc = doc(db, "posts", postId)
		await updateDoc(postDoc, {
			comments: deleteField()
		})
		await deleteDoc(postDoc)
	}

	useEffect(() => {
		let unsubscribe

		if (postId) {
			const commentCollectionRef = collection(db, "posts", postId, "comments")
			const q = query(commentCollectionRef, orderBy("timestamp", "desc"))
			unsubscribe = onSnapshot(q, (snapshot) => {
				setComments(snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id })))
			})
		}

		return () => {
			unsubscribe()
		}
	}, [postId])

	useEffect(() => {
		const getProfile = async () => {
			const docRef = doc(db, "users", userId)
			const docSnap = await getDoc(docRef)
			setAuthor(docSnap.data())
		}

		getProfile()
	}, [author])

	return (
		<div className="post">
			<div className="post__header">
				<Link to={`/user/${userId}`}>
					<div className="post__userContainer">

						<img
							src={
								author?.photoURL
									? author.photoURL
									: "https://t4.ftcdn.net/jpg/03/32/59/65/240_F_332596535_lAdLhf6KzbW6PWXBWeIFTovTii1drkbT.jpg"
							}
							className="post__profilePicture"
						/>
						<h3>{username}</h3>
					</div>
				</Link>
				{userId === user?.uid && (
					<h1
						className="post__delete"
						onClick={deletePost}
					>
						X
					</h1>
				)}
			</div>
			<img
				className="post__image"
				src={image}
			/>
			<div className="post__likeDiv">
				{liked ? (
					<FavoriteIcon onClick={() => unlikePost(postId)} />
				) : (
					<FavoriteBorderIcon onClick={() => likePost(postId)} />
				)}
				<h4 className="post__likes">{likes?.length} likes</h4>
			</div>

			<h4 className="post__text">
				<Link to={`/user/${userId}`}>
					<strong>@{username}</strong>
				</Link>{" "}
				{caption}
			</h4>
			<div className="post__comments">
				{comments?.map((comment) => (
					<Comment
						key={comment.id}
						comment={comment}
						postId={postId}
						user={user}
					/>
				))}
			</div>
			{user && (
				<form className="post__commentBox">
					<input
						className="post__input"
						type="text"
						value={comment}
						onChange={(e) => setComment(e.target.value)}
						placeholder="Write a comment..."
					/>
					<button
						disabled={!comment}
						className="post__button"
						type="submit"
						onClick={postComment}
					>
						Post
					</button>
				</form>
			)}
		</div>
	)
}
