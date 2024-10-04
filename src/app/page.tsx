'use client'

import { useState, useEffect } from 'react'
import { X, Menu, Star } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"

interface Book {
  id: number;
  title: string;
  author: string;
  genre: string;
  rating: number;
  description: string;
  publication_year: number;
}

const books: Book[] = [
  {
    id: 1,
    title: "The Great Gatsby",
    author: "F. Scott Fitzgerald",
    genre: "Classic",
    rating: 4.7,
    description: "A novel set in the Jazz Age that explores themes of wealth, love, and the American Dream.",
    publication_year: 1925
  },
  {
    id: 2,
    title: "To Kill a Mockingbird",
    author: "Harper Lee",
    genre: "Fiction",
    rating: 4.8,
    description: "A timeless novel of a child's moral awakening and a poignant tale of race and justice in the American South.",
    publication_year: 1960
  },
  {
    id: 3,
    title: "1984",
    author: "George Orwell",
    genre: "Dystopian",
    rating: 4.6,
    description: "A dystopian social science fiction novel and cautionary tale about the dangers of totalitarianism.",
    publication_year: 1949
  },
  {
    id: 4,
    title: "Pride and Prejudice",
    author: "Jane Austen",
    genre: "Romance",
    rating: 4.9,
    description: "A romantic novel that also serves as a social commentary on the British landed gentry of the early 19th century.",
    publication_year: 1813
  },
  {
    id: 5,
    title: "The Catcher in the Rye",
    author: "J.D. Salinger",
    genre: "Fiction",
    rating: 4.3,
    description: "A story about a young boy's journey through the challenges of adolescence.",
    publication_year: 1951
  }
]

const genres = Array.from(new Set(books.map(book => book.genre)))
const ratings = [5, 4, 3, 2, 1]

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedGenre, setSelectedGenre] = useState('')
  const [selectedRating, setSelectedRating] = useState(0)
  const [filteredBooks, setFilteredBooks] = useState<Book[]>(books)
  const [myLibrary, setMyLibrary] = useState<Book[]>([])
  const [currentView, setCurrentView] = useState('home')
  const [isSmallScreen, setIsSmallScreen] = useState(false)
  const [selectedBook, setSelectedBook] = useState<Book | null>(null)
  const [isDetailsOpen, setIsDetailsOpen] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')
  const [searchFocused, setSearchFocused] = useState(false)

  useEffect(() => {
    const handleResize = () => {
      setIsSmallScreen(window.innerWidth <= 768)
    }
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  useEffect(() => {
    const storedLibrary = localStorage.getItem('myLibrary')
    if (storedLibrary) {
      setMyLibrary(JSON.parse(storedLibrary))
    }
    const storedView = localStorage.getItem('currentView')
    if (storedView) {
      setCurrentView(storedView)
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('myLibrary', JSON.stringify(myLibrary))
  }, [myLibrary])

  useEffect(() => {
    localStorage.setItem('currentView', currentView)
  }, [currentView])

  useEffect(() => {
    const filtered = books.filter(book => 
      (searchTerm === '' || book.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
       book.author.toLowerCase().includes(searchTerm.toLowerCase()) || 
       book.genre.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (selectedGenre === '' || book.genre === selectedGenre) &&
      (selectedRating === 0 || book.rating >= selectedRating)
    )
    setFilteredBooks(filtered)
  }, [searchTerm, selectedGenre, selectedRating])

  const addToLibrary = (book: Book) => {
    if (!myLibrary.find(b => b.id === book.id)) {
      setMyLibrary([...myLibrary, book])
      setSuccessMessage('Book added to library successfully!')
      setTimeout(() => setSuccessMessage(''), 3000)
    }
    setIsDetailsOpen(false)
  }

  const removeFromLibrary = (bookId: number) => {
    setMyLibrary(myLibrary.filter(book => book.id !== bookId))
    setSuccessMessage('Book removed from library successfully!')
    setTimeout(() => setSuccessMessage(''), 3000)
  }

  const handleSearch = (term: string) => {
    setSearchTerm(term)
    setSelectedGenre('')
    setSelectedRating(0)
  }

  const viewDetails = (book: Book) => {
    setSelectedBook(book)
    setIsDetailsOpen(true)
  }

  const toggleMenu = () => {
    setMenuOpen(!menuOpen)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="fixed top-0 left-0 right-0 bg-[#F2F2F7] shadow-md z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-2xl font-bold text-[#1C1C1E]">Virtual Book Library</h1>
            {isSmallScreen ? (
              <Button variant="ghost" size="icon" onClick={toggleMenu} className="text-[#007AFF]">
                {menuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </Button>
            ) : (
              <div className="flex space-x-4">
                <Button variant="ghost" onClick={() => setCurrentView('home')} className="text-[#007AFF] hover:text-[#0056B3]">Home</Button>
                <Button variant="ghost" onClick={() => setCurrentView('myLibrary')} className="text-[#007AFF] hover:text-[#0056B3]">My Library</Button>
              </div>
            )}
          </div>
        </div>
      </nav>

      <div className={`fixed top-16 left-0 right-0 bg-[#F2F2F7] shadow-md z-40 transition-all duration-300 ease-in-out overflow-hidden ${menuOpen ? 'max-h-screen' : 'max-h-0'}`}>
        <div className="p-4">
          <div className="flex flex-col space-y-4">
            <Button variant="ghost" onClick={() => { setCurrentView('home'); setMenuOpen(false); }} className="text-[#007AFF] hover:text-[#0056B3] justify-start">Home</Button>
            <Button variant="ghost" onClick={() => { setCurrentView('myLibrary'); setMenuOpen(false); }} className="text-[#007AFF] hover:text-[#0056B3] justify-start">My Library</Button>
          </div>
        </div>
      </div>

      <main className={`transition-all duration-300 ease-in-out ${menuOpen ? 'pt-52' : 'pt-20'} pb-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto`}>
        {currentView === 'home' && (
          <>
            <h2 className="text-3xl font-bold text-center mb-8 text-[#1C1C1E]">Discover Your Next Favorite Book</h2>

            <div className="relative max-w-md mx-auto mb-8">
              <div className="relative">
                <Input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => handleSearch(e.target.value)}
                  onFocus={() => setSearchFocused(true)}
                  onBlur={() => setSearchFocused(false)}
                  className="w-full py-2 pl-3 pr-10 rounded-md border-[#C7C7CC] focus:border-[#007AFF] focus:ring focus:ring-[#007AFF] focus:ring-opacity-50"
                  placeholder=""
                />
                <Label
                  htmlFor="search"
                  className={`absolute left-3 transition-all duration-200 ${
                    searchFocused || searchTerm
                      ? '-top-6 text-sm text-[#007AFF]'
                      : 'top-2 text-gray-400'
                  }`}
                >
                  Search by title, author, or genre
                </Label>
              </div>
            </div>

            <div className="flex flex-col md:flex-row gap-8">
              <aside className="w-full md:w-64 bg-white p-4 rounded-lg shadow-md">
                <h3 className="font-bold mb-4 text-[#1C1C1E]">Filters</h3>
                <div className="mb-6">
                  <h4 className="mb-2 text-[#8E8E93]">Genre</h4>
                  {genres.map(genre => (
                    <div key={genre} className="flex items-center mb-2">
                      <Checkbox
                        id={genre}
                        checked={selectedGenre === genre}
                        onCheckedChange={() => setSelectedGenre(selectedGenre === genre ? '' : genre)}
                      />
                      <label htmlFor={genre} className="ml-2 text-[#1C1C1E]">{genre}</label>
                    </div>
                  ))}
                </div>
                <div>
                  <h4 className="mb-2 text-[#8E8E93]">Rating</h4>
                  <RadioGroup value={selectedRating.toString()} onValueChange={(value) => setSelectedRating(Number(value))}>
                    {ratings.map(rating => (
                      <div key={rating} className="flex items-center mb-2">
                        <RadioGroupItem value={rating.toString()} id={`rating-${rating}`} />
                        <label htmlFor={`rating-${rating}`} className="ml-2 flex text-[#1C1C1E]">
                          {Array.from({length: rating}).map((_, i) => (
                            <Star key={i} className="w-4 h-4 fill-current text-[#FF9500]" />
                          ))}
                          {Array.from({length: 5 - rating}).map((_, i) => (
                            <Star key={i} className="w-4 h-4 text-[#C7C7CC]" />
                          ))}
                        </label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>
              </aside>

              <div className="flex-1 grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                {filteredBooks.length > 0 ? (
                  filteredBooks.map(book => (
                    <div key={book.id} className="border rounded-lg p-4 bg-white shadow-md hover:shadow-lg transition-shadow duration-300">
                      <h3 className="text-lg font-semibold mb-2 text-[#1C1C1E]">{book.title}</h3>
                      <p className="mb-1 text-[#8E8E93]">Author: {book.author}</p>
                      <p className="mb-1 text-[#8E8E93]">Genre: {book.genre}</p>
                      <p className="mb-4 text-[#8E8E93]">Rating: {book.rating}</p>
                      <div className="flex justify-center">
                        <Button onClick={() => viewDetails(book)} className="bg-[#007AFF] hover:bg-[#0056B3] text-white rounded-md px-4 py-2">View Details</Button>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="col-span-full text-center text-[#8E8E93]">
                    No books match your current selection. Please try different filters.
                  </p>
                )}
              </div>
            </div>
          </>
        )}

        {currentView === 'myLibrary' && (
          <>
            <h2 className="text-3xl font-bold text-center mb-8 text-[#1C1C1E]">My Library</h2>
            <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
              {myLibrary.length > 0 ? (
                myLibrary.map(book => (
                  <div key={book.id} className="border rounded-lg p-4 bg-white shadow-md hover:shadow-lg transition-shadow duration-300">
                    <h3 className="text-lg font-semibold mb-2 text-[#1C1C1E]">{book.title}</h3>
                    <p className="mb-1 text-[#8E8E93]">Author: {book.author}</p>
                    <p className="mb-1 text-[#8E8E93]">Genre: {book.genre}</p>
                    <p className="mb-4 text-[#8E8E93]">Rating: {book.rating}</p>
                    <div className="flex justify-center">
                      <Button variant="destructive" onClick={() => removeFromLibrary(book.id)} className="bg-[#FF3B30] hover:bg-[#D70015] text-white rounded-md px-4 py-2">Remove from Library</Button>
                    </div>
                  </div>
                ))
              ) : (
                <p className="col-span-full text-center text-[#8E8E93]">
                  Your library is empty. Add some books from the home page!
                </p>
              )}
            </div>
          </>
        )}
      </main>

      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="bg-white rounded-lg shadow-xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-[#1C1C1E]">{selectedBook?.title}</DialogTitle>
            <DialogDescription>
              <p className="text-[#8E8E93]">Author: {selectedBook?.author}</p>
              <p className="text-[#8E8E93]">Genre: {selectedBook?.genre}</p>
              <p className="text-[#8E8E93]">Rating: {selectedBook?.rating}</p>
              <p className="text-[#8E8E93]">Publication Year: {selectedBook?.publication_year}</p>
              <p className="mt-4 text-[#1C1C1E]">{selectedBook?.description}</p>
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-center mt-6">
            <Button onClick={() => selectedBook && addToLibrary(selectedBook)} className="bg-[#007AFF] hover:bg-[#0056B3] text-white rounded-md px-4 py-2">Add to Library</Button>
          </div>
        </DialogContent>
      </Dialog>

      {successMessage && (
        <div className="fixed bottom-4 right-4 bg-[#34C759] text-white p-4 rounded-md shadow-lg transition-opacity duration-300">
          {successMessage}
        </div>
      )}
    </div>
  )
}