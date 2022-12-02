import React from "react"
import { doc, deleteDoc } from "firebase/firestore"
import { db } from "../firebase"
import { Link } from "react-router-dom"

export default function Comment({ comment, postId, user }) {
	const deleteComment = async () => {
		const commentDoc = doc(db, "posts", postId, "comments", comment.id)
		await deleteDoc(commentDoc)
	}

	return (
		<div className="comment">
			<p>
				<Link to={`/user/${comment.userId}`}>
					<b>@{comment.username}</b>
				</Link>{" "}
				{comment.text}{" "}
			</p>
			{comment.userId === user?.uid && (
				<p
					className="comment__delete"
					onClick={deleteComment}
				>
					X
				</p>
			)}
		</div>
	)
}
