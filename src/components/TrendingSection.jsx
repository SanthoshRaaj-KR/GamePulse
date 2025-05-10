import React, { useEffect, useState, useCallback, useRef } from "react";

const TrendingSection = () => {
  const [movies, setMovies] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showDetails, setShowDetails] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [myList, setMyList] = useState([]);
  const [movieCredits, setMovieCredits] = useState(null);
  const autoPlayRef = useRef(null);

  useEffect(() => {
    // Using the provided API key to fetch trending movies
    fetch(`https://api.themoviedb.org/3/trending/movie/week?api_key=d45363c36e123ec0c0fa1cd734dd66b1`)
      .then(res => res.json())
      .then(data => {
        // Get top 6 movies
        setMovies(data.results.slice(0, 6));
      })
      .catch(err => console.error("Error fetching movies:", err));
  }, []);

  // Function to fetch movie credits (cast & crew)
  const fetchMovieCredits = (movieId) => {
    fetch(`https://api.themoviedb.org/3/movie/${movieId}/credits?api_key=d45363c36e123ec0c0fa1cd734dd66b1`)
      .then(res => res.json())
      .then(data => {
        setMovieCredits(data);
      })
      .catch(err => console.error("Error fetching movie credits:", err));
  };

  // Function to advance to the next slide
  const handleNext = useCallback(() => {
    setCurrentIndex(prevIndex => (prevIndex === movies.length - 1 ? 0 : prevIndex + 1));
  }, [movies.length]);

  const handlePrev = () => {
    setCurrentIndex(prevIndex => (prevIndex === 0 ? movies.length - 1 : prevIndex - 1));
  };

  // Setup auto-rotation carousel
  useEffect(() => {
    if (movies.length === 0) return;
    
    // Clear any existing interval
    if (autoPlayRef.current) {
      clearInterval(autoPlayRef.current);
    }
    
    // Set up a new interval
    autoPlayRef.current = setInterval(() => {
      handleNext();
    }, 6000); // Change slide every 6 seconds
    
    // Cleanup on unmount
    return () => {
      if (autoPlayRef.current) {
        clearInterval(autoPlayRef.current);
      }
    };
  }, [handleNext, movies.length]);

  const toggleDetails = (movie) => {
    // Only fetch credits if opening modal
    if (!showDetails) {
      fetchMovieCredits(movie.id);
    }
    setSelectedMovie(movie);
    setShowDetails(!showDetails);
  };

  const closeDetails = () => {
    setShowDetails(false);
    setSelectedMovie(null);
    setMovieCredits(null);
  };

  const toggleMyList = (movie) => {
    if (myList.some(item => item.id === movie.id)) {
      setMyList(myList.filter(item => item.id !== movie.id));
    } else {
      setMyList([...myList, movie]);
    }
  };

  const isInMyList = (movie) => {
    return myList.some(item => item.id === movie.id);
  };

  const featuredMovie = movies[currentIndex];

  return (
    <div className="relative w-full">
      {/* Main Featured Movie */}
      {featuredMovie ? (
        <div className="relative w-full h-screen">
          {/* Background Image */}
          <div className="absolute inset-0">
            <img
              src={`https://image.tmdb.org/t/p/original${featuredMovie.backdrop_path || featuredMovie.poster_path}`}
              alt={featuredMovie.title}
              className="w-full h-full object-cover"
            />
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent" />
          </div>

          {/* Content */}
          <div className="absolute bottom-0 left-0 right-0 p-12 flex flex-col">
            <h1 className="text-white text-6xl font-bold mb-4">{featuredMovie.title}</h1>
            <div className="flex gap-4 mb-6">
              <p className="text-green-500 font-bold">
                {Math.round(featuredMovie.vote_average * 10)}% Match
              </p>
              <p className="text-gray-400">{featuredMovie.release_date?.substring(0, 4)}</p>
            </div>
            <p className="text-white text-lg mb-6 max-w-2xl line-clamp-3">
              {featuredMovie.overview}
            </p>
            <div className="flex gap-4">
              <button className="bg-white/90 text-black px-8 py-3 rounded-md flex items-center
                font-bold shadow-xl hover:bg-white transition duration-300 transform hover:translate-y-px">
                <span className="mr-2">▶</span> Play
              </button>

              <button 
                onClick={() => toggleMyList(featuredMovie)}
                className="bg-black/40 backdrop-blur-sm text-white px-8 py-3 rounded-md flex items-center 
                font-bold shadow-xl border border-white/20 hover:bg-black/60 transition duration-300 transform hover:translate-y-px"
              >
                {isInMyList(featuredMovie) ? '✓' : '+'} My List
              </button>
              <button 
                onClick={() => toggleDetails(featuredMovie)}
                className="bg-black/40 backdrop-blur-sm text-white px-8 py-3 rounded-md flex items-center 
                font-bold shadow-xl border border-white/20 hover:bg-black/60 transition duration-300 transform hover:translate-y-px"
              >
                ℹ More Info
              </button>
            </div>
          </div>
          
          {/* Carousel Navigation */}
          <button 
            onClick={handlePrev} 
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 text-white w-12 h-12 rounded-full flex items-center justify-center text-2xl hover:bg-black/80 transition"
          >
            ←
          </button>
          <button 
            onClick={handleNext} 
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 text-white w-12 h-12 rounded-full flex items-center justify-center text-2xl hover:bg-black/80 transition"
          >
            →
          </button>
          
          {/* Movie carousel indicators */}
          <div className="absolute bottom-8 left-0 right-0 flex justify-center">
            <div className="flex gap-2">
              {movies.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`w-3 h-3 rounded-full ${
                    index === currentIndex ? "bg-white" : "bg-white/40"
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="w-full h-screen flex items-center justify-center bg-black">
          <div className="text-gray-300 text-2xl font-light tracking-wider">.... Loading ....</div>
        </div>
      )}

      {/* Movie Details Modal */}
      {showDetails && selectedMovie && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-8">
          <div className="bg-gray-900 rounded-lg max-w-5xl w-full max-h-screen overflow-y-auto shadow-2xl border border-gray-800">
            <div className="relative w-full h-96">
              <img
                src={`https://image.tmdb.org/t/p/original${selectedMovie.backdrop_path || selectedMovie.poster_path}`}
                alt={selectedMovie.title}
                className="w-full h-full object-cover"
              />
              <button 
                onClick={closeDetails}
                className="absolute top-4 right-4 bg-black/50 text-white w-10 h-10 rounded-full flex items-center justify-center hover:bg-black transition border border-white/20"
              >
                ✕
              </button>
              <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent" />
            </div>
            
            <div className="p-8">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-white text-4xl font-bold mb-2">{selectedMovie.title}</h2>
                  <div className="flex gap-4 mb-2">
                    <p className="text-green-500 font-bold">
                      {Math.round(selectedMovie.vote_average * 10)}% Match
                    </p>
                    <p className="text-gray-400">{selectedMovie.release_date?.substring(0, 4)}</p>
                  </div>
                </div>
                <button 
                  onClick={() => toggleMyList(selectedMovie)}
                  className="bg-black/40 backdrop-blur-sm text-white px-4 py-2 rounded-md flex items-center 
                  font-bold shadow-lg border border-white/20 hover:bg-black/60 transition duration-300"
                >
                  {isInMyList(selectedMovie) ? 'Remove from List' : 'Add to My List'}
                </button>
              </div>
              
              <p className="text-white text-lg mb-8 leading-relaxed">{selectedMovie.overview}</p>
              
              {/* Cast Section */}
              <div className="mb-8">
                <h3 className="text-white text-2xl font-bold mb-4">Cast</h3>
                {movieCredits ? (
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {movieCredits.cast?.slice(0, 8).map(actor => (
                      <div key={actor.id} className="flex items-center">
                        <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-700 flex-shrink-0 mr-3">
                          {actor.profile_path ? (
                            <img 
                              src={`https://image.tmdb.org/t/p/w200${actor.profile_path}`} 
                              alt={actor.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-500">?</div>
                          )}
                        </div>
                        <div>
                          <p className="text-white font-medium">{actor.name}</p>
                          <p className="text-gray-400 text-sm">{actor.character}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-400">Loading cast information...</p>
                )}
              </div>
              
              {/* Details Section */}
              <div className="grid grid-cols-2 gap-6 text-sm">
                <div>
                  <p className="text-gray-400 mb-1">Original Language</p>
                  <p className="text-white capitalize">{selectedMovie.original_language}</p>
                </div>
                <div>
                  <p className="text-gray-400 mb-1">Vote Count</p>
                  <p className="text-white">{selectedMovie.vote_count.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-gray-400 mb-1">Popularity</p>
                  <p className="text-white">{Math.round(selectedMovie.popularity).toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-gray-400 mb-1">Adult Content</p>
                  <p className="text-white">{selectedMovie.adult ? 'Yes' : 'No'}</p>
                </div>
                {movieCredits && movieCredits.crew && (
                  <>
                    <div>
                      <p className="text-gray-400 mb-1">Director</p>
                      <p className="text-white">
                        {movieCredits.crew.find(person => person.job === "Director")?.name || "Unknown"}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-400 mb-1">Producers</p>
                      <p className="text-white">
                        {movieCredits.crew
                          .filter(person => person.job === "Producer")
                          .slice(0, 2)
                          .map(producer => producer.name)
                          .join(", ") || "Unknown"}
                      </p>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TrendingSection;