import Post from "../components/Post"
import { collection, onSnapshot, orderBy, query } from "firebase/firestore"
import { useEffect, useState } from "react"
import { db } from "../firebase"

export default function Home({ user }) {
	const [posts, setPosts] = useState([])

	const postCollectionRef = collection(db, "posts")
	const q = query(postCollectionRef, orderBy("timestamp", "desc"))

	useEffect(() => {
		onSnapshot(q, (snapshot) => {
			setPosts(snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id })))
		})
	}, [])

	return (
		<div className="home__posts">
			{posts.map((post) => (
				<Post
					key={post.id}
					image={post.image}
					username={post.username}
					caption={post.caption}
					postId={post.id}
					user={user}
					userId={post.userId}
                    likes={post.likes}
				/>
			))}
		</div>
	)
}
