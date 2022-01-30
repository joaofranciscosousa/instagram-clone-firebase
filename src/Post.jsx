import './Post.css'
import Avatar from '@mui/material/Avatar';
import { useEffect, useState } from 'react';
import { db } from './firebase'
import { collection, orderBy, query, onSnapshot, serverTimestamp, addDoc } from 'firebase/firestore'

function Post({postId, username, caption, imageURL, user}){
    const [comments, setComments] = useState([])
    const [comment, setComment] = useState('')
    useEffect(() => {
        let unsubscribe
        if(postId){
            unsubscribe = collection(db, `posts/${postId}/comments`)
            const q = query(unsubscribe, orderBy("timestamp", "asc"))
            onSnapshot(q, (snapshot) => {
                setComments(snapshot.docs.map(doc => (doc.data()) ))
            })
        }
    }, [postId])

    const postComment = (event) => {
        event.preventDefault()

        addDoc(collection(db, `posts/${postId}/comments`), {
            timestamp: serverTimestamp(),
            text: comment,
            username: user,
        });
        setComment('')
    }

    return(
        <div className='post'>
            <div className='post__header'>
                <Avatar
                    className='post__avatar'
                    alt={username}
                    src="/static/images/avatar/1.png"
                />
                <h3>{username}</h3>
            </div>
            <img
                className='post__image'
                src={imageURL}
                alt=""
            />
            <h4 className='post__text'><strong>{username}</strong> {caption}</h4>

            {
                <div className='post__comments'>
                    {comments.map((comment, key) => (
                        <p key={key}>
                            <strong>{comment.username}</strong> {comment.text}
                        </p>
                    ))}
                </div>
            }

            {user && (
                    <form className='post__commentBox'>
                        <input
                            className='post__input'
                            type='text'
                            placeholder="Adicione um comentário"
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                        />
                        <button
                            className='post__button'
                            type='submit'
                            onClick={postComment}
                        >
                            Postar
                        </button>
                    </form>
                )
            }
        </div>
    )
}

export default Post