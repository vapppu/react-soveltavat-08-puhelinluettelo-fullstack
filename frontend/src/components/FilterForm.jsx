const FilterForm = ({ filterPersons, searchTerm, updateSearchTerm }) => {

    const handleSearchChange = (event) => {
        updateSearchTerm(event.target.value)
        filterPersons(event.target.value)
      }

    return (
        <div>Filter shown with: <input onChange={handleSearchChange} value={searchTerm}/></div>
        )
}

export default FilterForm