import { useSearchParams } from 'react-router-dom';


function SearchResult() {
    const [ searchParams, setSearchParams ] = useSearchParams();

    console.log('searchParams: ', searchParams.get('query'));

    return (
        <h1>Search Result Page</h1>
    );
}

export default SearchResult;