import Button from '@mui/material/Button';
import './ImageUpload.css'
import { useState } from 'react';
import { db, storage} from './firebase'
import { collection, addDoc, serverTimestamp } from 'firebase/firestore'
import { ref, getDownloadURL, uploadBytesResumable } from "firebase/storage";

function ImageUpload({username}){
    const [image, setImage] = useState(null)
    const [progress, setProgress] = useState(0)
    const [caption, setCaption] = useState('')
    

    const handleChange =(e) => {
        if(e.target.files[0]){
            setImage(e.target.files[0])
        }
    }

    const handleUpload = () => {
        const storageRef = ref(storage, `images/${image.name}`)
        const uploadTask = uploadBytesResumable(storageRef, image)
        uploadTask.on('state_changed',
            (snapshot) => {
                setProgress(Math.round(
                    (snapshot.bytesTransferred / snapshot.totalBytes) * 100
                ))
            },
            (error) => {
                alert(error.message)
            },
            () => {
                getDownloadURL(uploadTask.snapshot.ref).then((url) => {
                    addDoc(collection(db, 'posts'), {
                    timestamp: serverTimestamp(),
                    caption: caption,
                    imageURL: url,
                    username: username
                    })
                })
                setProgress(0)
                setCaption('')
                document.getElementById('input').value=""
            }
        )
    }

    return(
        <div className='upload'>
            <div className="imageupload">
                <progress
                    className='imageupload__progress'
                    value={progress}
                    max='100'
                />
                <input
                    type="text"
                    placeholder='Entre com uma descrição'
                    onChange={event => setCaption(event.target.value)}
                    value={caption}
                />
                <input
                    type="file"
                    id="input"
                    onChange={handleChange}
                />
                <Button onClick={handleUpload}>
                    Upload
                </Button>
            </div>
        </div>
    )
}

export default ImageUpload