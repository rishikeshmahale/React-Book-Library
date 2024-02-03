import React, {useState , useEffect , useContext , useCallback, createContext} from "react";
import axios from "axios";

const URL = "http://openlibrary.org/search.json?title=";

const AppContext = createContext();

const AppProvider = ({children}) => {

    const [searchTerm, setSearchTerm] = useState("The Lost World");

    const [books, setBooks] = useState([]);

    const [loading, setLoading] = useState(true);

    const [resultTitle, setResultTitle] = useState("");


    const fetchBooks = useCallback(async () => {
        setLoading(true);

        try {
          const {data} = await axios.get(`${URL}${searchTerm}`);
          const { docs } = data;
          console.log(docs)
         
          if (docs) {

            const newBooks = docs.slice(0, 20).map((singleBook) => {
              const { key, author_name, cover_i, edition_count, first_publish_year, title } = singleBook;
              
              return {
                id: key,
                author: author_name,
                cover_id: cover_i,
                edition_count : edition_count,
                first_publish_year: first_publish_year,
                title : title
              }
              
            })
            
            setBooks(newBooks);

            if (newBooks.length > 1) {
              setResultTitle("Your Search result");
            } else {
              setResultTitle("No Search Result Found !");
            }


          } else {
            setBooks([]);
            setResultTitle("No Search result Found");
          }

          setLoading(false);

        } catch (err) {
            console.log(err);
            setLoading(false)
        }
    }, [searchTerm]);

    useEffect(() => {
        fetchBooks();
    }, [searchTerm, fetchBooks]);
    

    return (
        <AppContext.Provider value={{loading, books , setSearchTerm , resultTitle, setResultTitle}}>
            {children}
        </AppContext.Provider>
    )
}

export const useGlobalContext = () => {
    return useContext(AppContext);
}

export { AppContext , AppProvider}


