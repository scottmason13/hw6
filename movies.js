// First, sign up for an account at https://themoviedb.org
// Once verified and signed-in, go to Settings and create a new
// API key; in the form, indicate that you'll be using this API
// key for educational or personal use, and you should receive
// your new key right away.

// For this exercise, we'll be using the "now playing" API endpoint
// https://api.themoviedb.org/3/movie/now_playing?api_key=${apiKey}&language=en-US

// API Key: c9bfec6cd0454dadc50e389e26026887

// Note: image data returned by the API will only give you the filename;
// prepend with `https://image.tmdb.org/t/p/w500/` to get the 
// complete image URL

window.addEventListener('DOMContentLoaded', async function(event) {
    // Step 1: Construct a URL to get movies playing now from TMDB, fetch
    // data and put the Array of movie Objects in a variable called
    // movies. Write the contents of this array to the JavaScript
    // console to ensure you've got good data
    // ⬇️ ⬇️ ⬇️

    let db = firebase.firestore()

    let response = await fetch(`https://api.themoviedb.org/3/movie/now_playing?api_key=c9bfec6cd0454dadc50e389e26026887&language=en-US`)
  
    let movies = await response.json()

    let querySnapshot = await db.collection('watched').get() 

    let docRef = querySnapshot.docs

    for (let i = 0; i < docRef.length; i++) {
        
        let moviesWatchedID = docRef[i].id

        for (let i = 0; i < movies.results.length; i++){

            let movie = movies.results[i]
            let moviePoster = movie.poster_path
            let movieID = movie.id 

            let opaque 

            if (movie.id == moviesWatchedID) {
                opaque = 'opacity-20'
            } else {
                opaque = ''
            }

            document.querySelector('.movies').insertAdjacentHTML('beforeend', `

                <div class="w-1/5 p-4 ${opaque} movie-${movieID}">
                    <img src="https://image.tmdb.org/t/p/w500${moviePoster}" class="w-full">
                    <a href="#" class="watched-button block text-center text-white bg-green-500 mt-4 px-4 py-2 rounded">I've watched this!</a>
                </div>
            
            `)
     
            let movieWatchedLink = document.querySelector(`.movie-${movieID}`)
            movieWatchedLink.addEventListener('click', async function(event){

                event.preventDefault()

                console.log(`${movieID} was clicked`)

                document.querySelector(`.movie-${movieID}`).classList.add('opacity-20')

                await db.collection('watched').doc(`${movieID}`).set({})

            })

        }
    
    }

})