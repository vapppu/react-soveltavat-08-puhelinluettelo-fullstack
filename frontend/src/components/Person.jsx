const Person = ({person, removePerson}) => {
    return (
        <>
            {person.name}: {person.number}
          <button onClick = {() => removePerson(person)}>Delete</button>
        </>
    )
}

export default Person;