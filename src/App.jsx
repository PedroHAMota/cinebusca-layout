import { useState, useEffect, useRef } from 'react'
import { Search, Play, Plus, Star, ChevronLeft, ChevronRight, User } from 'lucide-react'
import { Button } from '@/components/ui/button.jsx'
import { Input } from '@/components/ui/input.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import './App.css'

function App() {
  const [movies, setMovies] = useState([])
  const [tvShows, setTvShows] = useState([])
  const [people, setPeople] = useState([])
  const [featuredMovie, setFeaturedMovie] = useState(null)
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const [activeCategory, setActiveCategory] = useState('trending')
  const moviesSectionRef = useRef(null)
  const seriesSectionRef = useRef(null)
  const cartoonsSectionRef = useRef(null)
  const [selectedMovie, setSelectedMovie] = useState(null)


  const scrollToMovies = () => {
    moviesSectionRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const scrollToSeries = () => {
    seriesSectionRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const scrollToCartoons = () => {
    cartoonsSectionRef.current?.scrollIntoView({ behavior: 'smooth' })
  }




  // const API_BASE_URL = 'https://5002-i88wcu8rpy0mjvew67fjr-3bf6aee5.manusvm.computer/api'
  const API_BASE_URL = 'http://localhost:5002/api'

  useEffect(() => {
    loadInitialData()
  }, [])

  const loadInitialData = async () => {
    try {
      setLoading(true)
      const [moviesRes, tvRes, peopleRes] = await Promise.all([
        fetch(`${API_BASE_URL}/popular/movies?page=1`),
        fetch(`${API_BASE_URL}/popular/tv?page=1`),
        fetch(`${API_BASE_URL}/popular/people?page=1`)
      ])

      const [moviesData, tvData, peopleData] = await Promise.all([
        moviesRes.json(),
        tvRes.json(),
        peopleRes.json()
      ])

      setMovies(moviesData.results || [])
      setTvShows(tvData.results || [])
      setPeople(peopleData.results || [])

      // Set featured movie (first popular movie)
      if (moviesData.results && moviesData.results.length > 0) {
        setFeaturedMovie(moviesData.results[0])
      }
    } catch (error) {
      console.error('Erro ao carregar dados:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = async (e) => {
    e.preventDefault()
    if (!searchQuery.trim()) return

    try {
      const response = await fetch(`${API_BASE_URL}/search/movies?query=${encodeURIComponent(searchQuery)}&page=1`)
      const data = await response.json()
      setSearchResults(data.results || [])
    } catch (error) {
      console.error('Erro na pesquisa:', error)
    }
  }

  const MovieCard = ({ movie, size = 'normal' }) => (
    <div className={`group relative cursor-pointer transition-all duration-300 hover:scale-105 ${size === 'large' ? 'w-48 ' : 'w-40 '
      }`}>
      <div className={`relative overflow-hidden rounded-lg bg-gray-800 ${size === 'large' ? 'h-72' : 'h-60'}`}>

        {movie.poster_path ? (
          <img
            src={movie.poster_path}
            alt={movie.title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
          />
        ) : (
          <div className="w-full h-full bg-gray-700 flex items-center justify-center">
            <Play className="w-8 h-8 text-gray-400" />
          </div>
        )}
        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <Button size="sm" className="bg-white/20 hover:bg-white/30 text-white border-white/30">
            <Play className="w-4 h-4 mr-2" />
            Assistir
          </Button>
        </div>
        {movie.vote_average && (
          <div className="absolute top-2 right-2 bg-black/70 rounded-full px-2 py-1 text-xs text-white flex items-center">
            <Star className="w-3 h-3 mr-1 fill-yellow-400 text-yellow-400" />
            {movie.vote_average.toFixed(1)}
          </div>
        )}
      </div>
      <div className="mt-2">
        <h3 className={`font-medium text-white text-xs line-clamp-2 leading-snug`}>
          {movie.title}
        </h3>
        <p className="text-gray-400 text-xs truncate">
          {movie.release_date ? new Date(movie.release_date).getFullYear() : 'N/A'}
        </p>
      </div>
    </div>
  )

  const PersonCard = ({ person }) => (
    <div className="group relative cursor-pointer transition-all duration-300 hover:scale-105 w-32 h-48">
      <div className="relative overflow-hidden rounded-lg bg-gray-800">
        {person.profile_path ? (
          <img
            src={person.profile_path}
            alt={person.name}
            className="w-full h-32 object-cover transition-transform duration-300 group-hover:scale-110"
          />
        ) : (
          <div className="w-full h-32 bg-gray-700 flex items-center justify-center">
            <User className="w-8 h-8 text-gray-400" />
          </div>
        )}
      </div>
      <div className="mt-2">
        <h3 className="font-medium text-white text-xs truncate">{person.name}</h3>
        <p className="text-gray-400 text-xs truncate">{person.known_for_department}</p>
      </div>
    </div>
  )

  const ScrollableSection = ({ title, items, type = 'movie' }) => (
    <div className="mb-8">
      <h2 className="text-xl font-bold text-white mb-4">{title}</h2>
      <div className="flex space-x-4 overflow-x-auto scrollbar-hide pb-4">
        {items.map((item, index) => (
          <div key={index} className="flex-shrink-0">
            {type === 'person' ? (
              <PersonCard person={item} />
            ) : (
              <MovieCard movie={item} />
            )}
          </div>
        ))}
      </div>
    </div>
  )

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-xl">Carregando...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-sm border-b border-gray-800">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-8">
              <h1 className="text-2xl font-bold text-white"><a href="#">CINEBUSCA</a></h1>
              <nav className="hidden md:flex space-x-6">
                <button
                  className={`text-sm transition-colors ${activeCategory === 'movies' ? 'text-white' : 'text-gray-400 hover:text-white'}`}
                  onClick={() => {
                    setActiveCategory('movies')
                    scrollToMovies()
                  }}
                >
                  Filmes em alta
                </button>

                <button
                  className={`text-sm transition-colors ${activeCategory === 'series' ? 'text-white' : 'text-gray-400 hover:text-white'}`}
                  onClick={() => {
                    setActiveCategory('series')
                    scrollToSeries()
                  }}
                >
                  Progamas Populares de TV
                </button>

                <button
                  className={`text-sm transition-colors ${activeCategory === 'cartoons' ? 'text-white' : 'text-gray-400 hover:text-white'}`}
                  onClick={() => {
                    setActiveCategory('cartoons')
                    scrollToCartoons()
                  }}
                >
                  Cartoons
                </button>
              </nav>
            </div>

            <div className="flex items-center space-x-4">
              <form onSubmit={handleSearch} className="flex items-center">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    type="text"
                    placeholder="Search"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 bg-gray-800/50 border-gray-700 text-white placeholder-gray-400 w-64"
                  />
                </div>
              </form>
              <div className="flex items-center space-x-2">
                <User className="w-6 h-6 text-white" />
                <span className="text-sm text-white">João M</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Featured Movie Hero Section */}
      {featuredMovie && (
        <section className="relative h-screen flex items-center">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: featuredMovie.backdrop_path ? `url(${featuredMovie.backdrop_path})` : 'none',
              backgroundColor: featuredMovie.backdrop_path ? 'transparent' : '#1a1a1a'
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-black via-black/70 to-transparent"></div>
          </div>

          <div className="relative container mx-auto px-4 z-10">
            <div className="max-w-2xl">
              <h1 className="text-6xl font-bold text-white mb-4 leading-tight">
                {featuredMovie.title}
              </h1>
              <p className="text-lg text-gray-300 mb-6 leading-relaxed">
                {featuredMovie.overview}
              </p>
              <div className="flex items-center space-x-4 mb-8">
                {featuredMovie.vote_average && (
                  <div className="flex items-center space-x-2">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-5 h-5 ${i < Math.floor(featuredMovie.vote_average / 2) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-600'}`}
                      />
                    ))}
                  </div>
                )}
              </div>
              <div className="flex space-x-4">
                <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white px-8">
                  <Play className="w-5 h-5 mr-2" />
                  Watch Now
                </Button>
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-black px-8">
                  Trailer
                </Button>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Search Results */}
      {searchResults.length > 0 && (
        <section className="container mx-auto px-4 py-8">
          <ScrollableSection title={`Resultados para "${searchQuery}"`} items={searchResults} />
        </section>
      )}

      {/* Popular Movies */}
      <section ref={moviesSectionRef} className="container mx-auto px-4 py-8">
        <ScrollableSection title="Popular Movies" items={movies.slice(0, 10)} />
      </section>

      <section ref={seriesSectionRef} className="container mx-auto px-4 py-8">
        <ScrollableSection title="Popular TV Shows" items={tvShows.slice(0, 10)} />
      </section>


      {/* Category Sections */}
      <section className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex space-x-8 mb-6">
            <button className="flex items-center space-x-2 text-white">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span className="text-sm">Trending</span>
            </button>
            <button className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors">
              <div className="w-2 h-2 bg-gray-600 rounded-full"></div>
              <span className="text-sm">Popular</span>
            </button>
            <button className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors">
              <div className="w-2 h-2 bg-gray-600 rounded-full"></div>
              <span className="text-sm">Recently added</span>
            </button>
            <button className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors">
              <div className="w-2 h-2 bg-gray-600 rounded-full"></div>
              <span className="text-sm">Premium</span>
            </button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {movies.slice(0, 12).map((movie, index) => (
              <MovieCard key={index} movie={movie} />
            ))}
          </div>
        </div>
      </section>

      {/* TV Shows Section */}
      <section className="container mx-auto px-4 py-8">
        <ScrollableSection title="Popular TV Shows" items={tvShows.slice(0, 10)} />
      </section>

      {/* People Section */}
      <section className="container mx-auto px-4 py-8">
        <ScrollableSection title="Popular People" items={people.slice(0, 10)} type="person" />
      </section>

      {/* Featured Content at Bottom */}
      {movies.length > 10 && (
        <section className="container mx-auto px-4 py-8">
          <div className="relative bg-gradient-to-r from-gray-900 to-gray-800 rounded-lg p-8">
            <div className="flex items-center space-x-6">
              {movies[10].poster_path && (
                <img
                  src={movies[10].poster_path}
                  alt={movies[10].title}
                  className="w-32 h-48 object-cover rounded-lg"
                />
              )}
              <div className="flex-1">
                <h3 className="text-2xl font-bold text-white mb-2">{movies[10].title}</h3>
                <p className="text-gray-300 mb-4 line-clamp-3">{movies[10].overview}</p>
                <div className="flex items-center space-x-4 mb-4">
                  <Badge variant="secondary" className="bg-red-600 text-white">
                    18+ {new Date().getFullYear()}
                  </Badge>
                  <span className="text-sm text-gray-400">2 Seasons</span>
                  <div className="flex items-center space-x-1">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm text-white">{movies[10].vote_average?.toFixed(1)}</span>
                  </div>
                </div>
                <div className="flex space-x-4">
                  <Button className="bg-blue-600 hover:bg-blue-700">
                    <Play className="w-4 h-4 mr-2" />
                    Watch
                  </Button>
                  <Button variant="outline" className="border-gray-600 text-white hover:bg-gray-700">
                    <Plus className="w-4 h-4 mr-2" />
                    MY LIST
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Bottom Grid */}
      <section className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {movies.slice(12, 18).map((movie, index) => (
            <MovieCard key={index} movie={movie} />
          ))}
        </div>
      </section>

      {/* Show More Button */}
      <section className="container mx-auto px-4 py-8 text-center">
        <Button variant="outline" className="border-gray-600 text-white hover:bg-gray-800">
          Show More
        </Button>
      </section>

      {/* Footer */}
      <footer className="bg-black border-t border-gray-800 py-8">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-white mb-4">CINEBUSCA</h2>
            <div className="flex justify-center space-x-8 text-sm text-gray-400">
              <a href="#" className="hover:text-white transition-colors">About us</a>
              <a href="#" className="hover:text-white transition-colors">Vlog</a>
              <a href="#" className="hover:text-white transition-colors">Contact</a>
              <a href="#" className="hover:text-white transition-colors">Report broken links</a>
              <a href="#" className="hover:text-white transition-colors">Disclaimer</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default App

