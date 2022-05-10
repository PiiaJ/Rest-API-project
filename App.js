import React , { useState , useEffect } from react
import './index.css'

const App = ()=>{
const [artist , setArtist ] = useState() 
const [albums , setAlbums ] = useState()
const [variable,setVariable ] = useState()

useEffect(() =>{
    fetch('theaudiodb.com/api/v1/json/2/discography.php?s=coldplay')
    .then((result) =>{
        console.log(result)
        return result.json()
    }).then((data) => {
        console.log(data.albums)
        return (data.albums)
    })
}, [])


const albumPrint = (props) => {
    return(
        <>
        <h1>props.artist</h1>
        <p>props.album</p>
        </>
    )
}


const handleChange = (props)=>{
    console.log(props.target.value)
    setVariable(props.target.value)
}

useEffect(() => {
    let albumsCopy = [...albums]
    albumsCopy= albumsCopy.filter(data => data.albums.includes(variable))
    setAlbums(albumsCopy)
},[variable])

return(<>
<div>
    <h1>Album list</h1>
    <form>
        <label>Search: </label>
        <input value={variable} type="text" onChange={handleChange} />
    </form>
    {
        albums ? albums.map(data => <albumPrint artist={data.artist} album={data.album} /> ) : <div>Nothing here. Fetching data...</div>
    }
</div>
</>)

}
export default App