import { useEffect, useState } from 'react'
import './App.css'
import Auth from './components/auth'
import { db, auth } from './config/firebase'

import { getDocs ,collection ,addDoc , deleteDoc,updateDoc,getDoc, doc } from 'firebase/firestore'
import { signOut } from 'firebase/auth'
const styles = {
  center : {
    display:"flex", justifyContent:"center" , alignItems:"center",
  }
}
function App() {
const [movieList , setMovieList] = useState([])

//New Movie States

const [newMovieTitle , setNewMovieTitle] = useState('')
const [isModal , setIsModal] = useState(false)
const [newMovieRealeate , setNewMovieRealeseate] = useState('')

const [newMovieAnOscar , setNewMovieAnOscar] = useState(true)
const moviesCollectionRef = collection(db , "movies")
const [isLoading , setIsLoading] = useState(false);
const [updatedMovie , setUpdatedMovie] = useState(null);
const [isConneted , setIsConnected] = useState(auth?.currentUser?.email)
console.log(isConneted ,)

const getMovieList = async ()=> {
  
  try {

    //READ THE DATA
  //SET THE MOVIE LIST
  const data = await getDocs(moviesCollectionRef)
  const filteredData = data.docs.map(doc=> ({...doc.data() , id:doc.id}))
  setMovieList(filteredData)
  } catch (error) {
    console.error(error)
  } 
}

useEffect(() => {
  // Check if there is a user currently authenticated
  const unsubscribe = auth.onAuthStateChanged((user) => {
    if (user) {
      // User is authenticated
      setIsConnected(user.email);
    } else {
      // No user is authenticated
      setIsConnected(false);
    }
  });

  // Clean up subscription
  return () => unsubscribe();
}, []);
useEffect(()=> {
  //we can, make useEffect as an asynchrounious function but , it can use async function 

    getMovieList()

    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        // User is authenticated
        setIsConnected(user.email);
      } else {
        // No user is authenticated
        setIsConnected(false);
      }
    });
  
    // Clean up subscription
    return () => unsubscribe();

} ,[])
// Explanation:

// We initialize isConnected state as false.
// We use the useEffect hook to perform side effects when the component mounts.
// Inside useEffect, we subscribe to authentication state changes using onAuthStateChanged. This method is called whenever the user's authentication state changes.
// If a user is authenticated (user is not null), we set isConnected to the user's email. If no user is authenticated (user is null), we set isConnected to false.
// We return the <Auth /> component if isConnected is false, otherwise, we return <h1>Firebase course</h1>.
// We clean up the subscription by returning a function from useEffect that unsubscribes from the listener. This ensures that the listener is removed when the component unmounts, preventing memory leaks.
// This way, isConnected will be set before rendering the component, ensuring that the correct UI is displayed based on the user's authentication status.

const onSubmitMovie = async() => {
  setIsLoading(true)
  try {
    await addDoc(moviesCollectionRef , {title:newMovieTitle , releaseate:newMovieRealeate , receivedAnOscar:newMovieAnOscar,userId:auth?.currentUser?.uid})
    getMovieList();
  } catch (error) {
    console.error(error)
  } finally {
    setIsLoading(false)
    setIsModal(false)
  }
}

const deleteMovie = async (id)=> {
  setIsLoading(true)
try {
  const data = doc(db , "movies" ,id)
  await deleteDoc(data)
  getMovieList()
} catch (error) {
  console.error(error)
}finally {
  setIsLoading(false)
}
}

const updateMovie = async (id , data)=> {
  setIsLoading(true)
try {
  const movieDocRef = doc(db , "movies" ,id)
  await updateDoc(movieDocRef ,data)
  getMovieList()
} catch (error) {
  console.error(error)
}finally {
  setIsLoading(false)
  setUpdatedMovie(null)
  setIsModal(false)
}
}
const onUpdate = async (id)=> {
  setUpdatedMovie(id)
  const movieDocRef = doc(db , "movies" ,id)
  const docSnapshot = await getDoc(movieDocRef);

// Check if the document exists
  if (docSnapshot.exists()) {
      // Access the data using the data() method
      const movieData = docSnapshot.data();
      console.log("Movie data:", movieData);
      
      setNewMovieAnOscar(movieData.receivedAnOscar)
      setNewMovieTitle(movieData.title)
      setNewMovieRealeseate(movieData.releaseate)


      setUpdatedMovie({...movieData, id})
  } else {
      console.log("No such document!");
  }

  setIsModal(true)

}
const onCreateNewMovie = ()=> {
  setNewMovieAnOscar('')
      setNewMovieTitle('')
      setNewMovieRealeseate('')
      setIsModal(true)
}
const logOut = async ()=> {
  try {
    //what this function do 
    await signOut(auth )
  } catch (error) {
    console.error(error)
  }finally{
    setIsConnected(null)
  }
}
 return (
   <>
    {!isConneted? <Auth onHandleConnection={()=>setIsConnected(auth?.currentUser?.email)}/> :<> <h1>Firebase course</h1>
      <button onClick={logOut}>Log Out</button>
     
      
    <button onClick={onCreateNewMovie}>Create Movie</button>
      

    {isModal&&  <div className={`modal ${isModal ? 'animated': ''}`} style={{position: "absolute",zIndex:100, display:"flex", justifyContent:"center" , alignItems:"center", top:0 , bottom: 0 , left:0 , right:0 ,height:"100%", width:"100%",background:"rgba(248, 247, 216, 0.7)"}}>
        <div style={{...styles.center, position:"relative" ,borderRadius:10,flexDirection :"column",gap: 10 ,color:"black",background:"#fff" , height:"60%", width:"70%"}}>
        <span onClick={()=>{setIsModal(false); setUpdatedMovie(null)}} style={{position: "absolute" , top: 10 , right:15}}>X</span>
          <input placeholder='Movie title ...' value={newMovieTitle} onChange={(e)=>setNewMovieTitle(e.target.value)} />
          <input placeholder='release Date ...' value={ newMovieRealeate} type='number' onChange={(e)=>setNewMovieRealeseate(+e.target.value)} />
          <input type='checkbox' checked={newMovieAnOscar} onChange={(e)=>setNewMovieAnOscar(e.target.checked)} />
          <label>Received An Oscar</label>
          {
            !updatedMovie ?<button onClick={onSubmitMovie}>Submit Movie</button>
            :<button onClick={()=>updateMovie(updatedMovie.id , {title:newMovieTitle ,releaseate:newMovieRealeate, receivedAnOscar:newMovieAnOscar})}>Update Movie</button>
          }
        </div>
      </div>}

      <div style={{position:"relative"}}>
        {movieList?.length ?
          movieList.map(
            movie=> (
              <div key={movie.id}>
                <h1  style={{color:movie.receivedAnOscar ? "green" : "red"}}> {movie.title}</h1>
                 <p>  Date: {movie.releaseate} </p>
                 <button onClick={()=>deleteMovie(movie.id)}>Delete</button>
                 <button onClick={()=>onUpdate(movie.id)}>update</button>
              </div>
            )
          ):
        <span>
          data vide
        </span>
          
        }
        {
          isLoading && <div style={{position: "absolute", display:"flex", justifyContent:"center" , alignItems:"center", top:0 , bottom: 0 ,height:"100%", width:"100%",background:"rgba(248, 247, 216, 0.7)"}}>
        <span>Loading ...</span>
        </div>
        }
      </div></>}
     

      
    </>
 )
}

export default App
