import { useState, useEffect } from 'react';
import './App.css';
import Post from './Post';
import ImageUpload from './ImageUpload'
import { db, auth } from './firebase.js'
import { collection, onSnapshot, orderBy, query, serverTimestamp, addDoc } from 'firebase/firestore'
import { onAuthStateChanged, createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile } from "firebase/auth";
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
import Input from '@mui/material/Input';
import React from 'react'

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '200px',
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

function App() {
  const [posts, setPosts] = useState([])
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [currentUser, setCurrentUser] = useState('')
  const [user, setUser] = useState(null)
  const [open, setOpen] = useState(false);
  const [openSignIn, setOpenSignIn] = useState(false)
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const handleOpenSignIn = () => setOpenSignIn(true)
  const handleCloseSignIn = () => setOpenSignIn(false);

  useEffect(() => {
    onAuthStateChanged(auth, (authUser) => {
      if (authUser) {
//        console.log(authUser)
        setUser(authUser)
        setCurrentUser(authUser.displayName)
      } else {
        setUser(null)
        setCurrentUser(null)
      }
    });
  }, [])

  useEffect(() => {
    const datadb = collection(db, 'posts')
    const q = query(datadb, orderBy("timestamp", "desc"))
    onSnapshot(q, (snapshot) => {
      setPosts(snapshot.docs.map(doc => ({
        id: doc.id,
        post: doc.data()
      })))
    })
  }, [])

  //console.log(posts)

  function SignUp(event){
    event.preventDefault()
    createUserWithEmailAndPassword(auth, email, password)
      .then((authUser) => {
        updateProfile(auth.currentUser, {
          displayName: username
        })
        setCurrentUser(username)
      })
      .catch((error) => {
        alert(error.message);
      });
      
      setEmail('')
      setPassword('')
      setUsername('')
      setOpen(false)
  }

  function SignIn(event){
    event.preventDefault()
    signInWithEmailAndPassword(auth, email, password)
    .then((authUser) => {
      setCurrentUser(authUser.user.displayName)
      console.log(authUser)
    })
    .catch((error) => {
      alert(error.message);
    });
    setEmail('')
    setPassword('')
    setOpenSignIn(false)
  }

  return (
    <div className="app">
      <div>
      
        <Modal
          open={open}
          onClose={handleClose}
        >
          <Box sx={style}>
            <div>
              <center>
                <img
                  className="app__headerImage"
                  src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Instagram_logo.svg/100px-Instagram_logo.svg.png"
                  alt=""
                />
              </center>
              <form className='app__signup'>
                <Input
                  type="text"
                  placeholder="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
                <Input
                  type="text"
                  placeholder='email'
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <Input
                  type="password"
                  placeholder="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <Button type='submit' onClick={SignUp}>Criar Conta</Button>
                </form>           
            </div>
          </Box>
        </Modal>

        <Modal
          open={openSignIn}
          onClose={handleCloseSignIn}
        >
          <Box sx={style}>
            <div>
              <center>
                <img
                  className="app__headerImage"
                  src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Instagram_logo.svg/100px-Instagram_logo.svg.png"
                  alt=""
                />
              </center>
              <form className='app__signin'>
                <Input
                  type="text"
                  placeholder='email'
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <Input
                  type="password"
                  placeholder="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <Button type='submit' onClick={SignIn}>Entrar</Button>
                </form>           
            </div>
          </Box>
        </Modal>
      </div>

      <div className="app__header">
        <img
          className="app__headerImage"
          src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Instagram_logo.svg/100px-Instagram_logo.svg.png"
          alt=""
        />

        {user ? (
          <div>
            <span>Olá {currentUser}</span>
            <Button onClick={() => auth.signOut()}>Sair</Button>
          </div>
        ) : (
          <div>
            <Button onClick={handleOpenSignIn}>Entrar</Button>
            <Button onClick={handleOpen}>Criar Conta</Button>
          </div>
        )}
      </div>

      {
        currentUser && (
          <ImageUpload username={currentUser} />
        )
      }

      <div className='app__posts'>
        {
          posts.map(({post, id}) => (
            <Post
              postId={id}
              username={post.username}
              caption={post.caption}
              imageURL={post.imageURL}
              key={id}
              user={currentUser}
            />
          ))
        }
      </div>
    </div>
  );
}

export default App;
