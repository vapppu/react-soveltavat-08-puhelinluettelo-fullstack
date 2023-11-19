import Person from './Person'

const ListPersons = ({filteredPersons, removePerson}) => {
    return (
        <>
        <h2>Numbers</h2>
        <ul style={{ listStyle: "none"}}>
        {filteredPersons.map((person) => (
          <li key={person.name}>
            <Person person = {person} removePerson = {removePerson}/>
          </li>

        ))}
      </ul>
      </>
    )
}

export default ListPersons;