import React, { useState } from 'react'
import { auth, googleAuthProvider } from '../config/firebase'
import {createUserWithEmailAndPassword ,signInWithPopup } from 'firebase/auth'
const Auth = (onHandleConnection) => {
  const [email , setEmail] = useState('')
  const [password , setPassword] = useState('')

  console.log(auth?.currentUser?.email)
  console.log(auth?.currentUser?.photoURL)
  const signIn = async ()=> {
    try {
      //what this function do 
      await createUserWithEmailAndPassword(auth,email, password)
    } catch (error) {
      console.error(error)
    }finally {
      onHandleConnection()
    }
  }

  const signInWithGoogle = async ()=> {
    try {
      //what this function do 
      await signInWithPopup(auth ,googleAuthProvider)
    } catch (error) {
      console.error(error)
    } finally {
      onHandleConnection()
    }
  }
 
  return (

    
    <div style={{display:"flex" , flexDirection:"column" ,gap:5 , }}>
    <input placeholder="Email..."  onChange={(e)=>setEmail(e.target.value)}/>
    <input placeholder="Password..." onChange={(e)=>setPassword(e.target.value)} type='password'/>
    <button onClick={signIn}>Sign In</button>
    <button onClick={signInWithGoogle}>Sign In With google</button>
  
</div>
  )
}

export default Auth