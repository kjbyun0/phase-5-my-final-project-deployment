import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';


function SearchResult() {
    const [ searchParams, setSearchParams ] = useSearchParams();
    console.log('searchParams: ', searchParams.get('query'));

    useEffect(() => {
        console.log('searchParams: ', searchParams.get('query'));
        fetch(`/search/${searchParams.get('query')}`)
        .then(r => r.json())
        .then(data => console.log(data));
    }, []);

    return (
        <h1>Search Result Page</h1>
    );
}

export default SearchResult;