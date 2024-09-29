import Card from "../components/card/card";
import PaginationCustom from "../components/pagination/pagination";
import { useNavigate } from 'react-router-dom';
import DropdownFilter from "../components/filter/dropdownfilter";


const searchResult = () => {

    const [filters, setFilters] = useState({
        years: [],
        genres: [],
        awards: [],
        countries: [],
      });

      useEffect(() => {
        const fetchFilters = async () => {
          try {
            const response = await fetch("http://localhost:8001/filters");
            const data = await response.json();
    
            // Transform years into ranges
            const decadeOptions = data.years.map(
              (yearRange) => `${yearRange.start}-${yearRange.end - 1}`
            );
    
            setFilters({
              years: decadeOptions,
              genres: data.genres.map((genre) => genre.name),
              awards: data.awards.map((award) => award.name),
              countries: data.countries.map((country) => country.name),
            });
          } catch (error) {
            console.error("Error fetching filters:", error);
          }
        };
    
        fetchFilters();
      }, []);
    

  return (
    <div>

      
    </div>
  )
}

export default searchResult
