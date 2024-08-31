import './home.scss'
import Navbar from '../components/navbar/navbar';
// import Filter from '../components/filter/filter';
import DropdownFilter from '../components/filter/dropdownfilter';
import Featured from '../components/featured/featured';
import List from '../components/list/list';
import Card from '../components/card/card';
import Button from '../components/button/button';
// import Button from 'react-bootstrap/Button';
import 'react-bootstrap/dist/react-bootstrap.min.js';
// import Button from '../components/button/button';


const home = () => {
  const genres = ["Action", "Comedy", "Drama", "Horror"];
  const status = ["Ongoing", "Completed"];
  const availability = ["Available", "Not Available"];
  const awards = ["Best Picture", "Best Actor", "Best Actress", "Best Director"];

  return (
    <div>
      <div className="home">
        <Navbar />
        <Featured type="movie" />
        <List />
        <List />
        <div className="dropdown-container">
          <span className='label-filter'>Filter by: </span>
          <DropdownFilter
            label="Year"
            options={["2020-2025", "2015-2020", "2010-2015", "2005-2010"]}
            onSelect={(option) => console.log(option)}
          />
          <DropdownFilter
            label="Type"
            options={["Series", "Movies"]}
            onSelect={(option) => console.log(option)}
          />
          <DropdownFilter
            label="Sort By"
            options={["Latest", "Oldest"]}
            onSelect={(option) => console.log(option)}
          />

          <DropdownFilter
            label="Genre"
            options={genres}
            onSelect={(option) => console.log(option)}
          />
          <DropdownFilter
            label="Status"
            options={status}
            onSelect={(option) => console.log(option)}
          />
          <DropdownFilter
            label="Availability"
            options={availability}
            onSelect={(option) => console.log(option)}
          />
          <DropdownFilter
            label="Award"
            options={awards}
            onSelect={(option) => console.log(option)}
          />


<Button className={"mt-3"} variant="primary" onClick={() => alert('Primary Button')}>
        Primary
      </Button>



        </div>

        <div className="card-container">
        <Card
            src={"https://image.tmdb.org/t/p/w1280/6PCnxKZZIVRanWb710pNpYVkCSw.jpg"}
            title="Title of the drama 1 that makes two lines"
            year="2024"
            genres={['Genre 1', 'Genre 2', 'Genre 3']}
            rating={3.5}
            views={19}/>

        <Card
            src={"https://image.tmdb.org/t/p/w1280/mmdBbXCs85JxxKyG664KI46rdC3.jpg"}
            title="Title of the drama 1 that makes two lines
            Title of the drama 1 that makes two lines"
            year="2024"
            genres={['Genre 1', 'Genre 2']}
            rating={3.5}
            views={19}/>

<Card
            src={"https://image.tmdb.org/t/p/w1280/6PCnxKZZIVRanWb710pNpYVkCSw.jpg"}
            title="Title of the drama 1 that makes two lines"
            year="2024"
            genres={['Genre 1', 'Genre 2', 'Genre 3']}
            rating={3.5}
            views={19}/>

        <Card
            src={"https://image.tmdb.org/t/p/w1280/mmdBbXCs85JxxKyG664KI46rdC3.jpg"}
            title="Title of the drama 1 that makes two lines
            Title of the drama 1 that makes two lines"
            year="2024"
            genres={['Genre 1', 'Genre 2']}
            rating={3.5}
            views={19}/>
                 <Card
            src={"https://image.tmdb.org/t/p/w1280/6PCnxKZZIVRanWb710pNpYVkCSw.jpg"}
            title="Title of the drama 1 that makes two lines"
            year="2024"
            genres={['Genre 1', 'Genre 2', 'Genre 3']}
            rating={3.5}
            views={19}/>

        <Card
            src={"https://image.tmdb.org/t/p/w1280/mmdBbXCs85JxxKyG664KI46rdC3.jpg"}
            title="Title of the drama 1 that makes two lines
            Title of the drama 1 that makes two lines"
            year="2024"
            genres={['Genre 1', 'Genre 2']}
            rating={3.5}
            views={19}/>
                 <Card
            src={"https://image.tmdb.org/t/p/w1280/6PCnxKZZIVRanWb710pNpYVkCSw.jpg"}
            title="Title of the drama 1 that makes two lines"
            year="2024"
            genres={['Genre 1', 'Genre 2', 'Genre 3']}
            rating={3.5}
            views={19}/>

        <Card
            src={"https://image.tmdb.org/t/p/w1280/mmdBbXCs85JxxKyG664KI46rdC3.jpg"}
            title="Title of the drama 1 that makes two lines
            Title of the drama 1 that makes two lines"
            year="2024"
            genres={['Genre 1', 'Genre 2']}
            rating={3.5}
            views={19}/>
                 <Card
            src={"https://image.tmdb.org/t/p/w1280/6PCnxKZZIVRanWb710pNpYVkCSw.jpg"}
            title="Title of the drama 1 that makes two lines"
            year="2024"
            genres={['Genre 1', 'Genre 2', 'Genre 3']}
            rating={3.5}
            views={19}/>

        <Card
            src={"https://image.tmdb.org/t/p/w1280/mmdBbXCs85JxxKyG664KI46rdC3.jpg"}
            title="Title of the drama 1 that makes two lines
            Title of the drama 1 that makes two lines"
            year="2024"
            genres={['Genre 1', 'Genre 2']}
            rating={3.5}
            views={19}/>
                 <Card
            src={"https://image.tmdb.org/t/p/w1280/6PCnxKZZIVRanWb710pNpYVkCSw.jpg"}
            title="Title of the drama 1 that makes two lines"
            year="2024"
            genres={['Genre 1', 'Genre 2', 'Genre 3']}
            rating={3.5}
            views={19}/>

        <Card
            src={"https://image.tmdb.org/t/p/w1280/mmdBbXCs85JxxKyG664KI46rdC3.jpg"}
            title="Title of the drama 1 that makes two lines
            Title of the drama 1 that makes two lines"
            year="2024"
            genres={['Genre 1', 'Genre 2']}
            rating={3.5}
            views={19}/>
        
        </div>
        
      </div>
    </div>
  );
}

export default home
