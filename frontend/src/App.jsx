import { useState, useEffect } from "react";

import './index.css'

import AddPerson from "./components/AddPerson";
import ListPersons from "./components/ListPersons";
import FilterForm from "./components/FilterForm";
import Notification from "./components/Notification"
import personService from "./services/persons";

const App = () => {
  const [persons, setPersons] = useState([]);
  const [filteredPersons, setFilteredPersons] = useState(persons);
  const [searchTerm, setSearchTerm] = useState("");
  const [message, setMessage] = useState(null)

  useEffect(() => {
    personService.getAll().then((initialPersons) => {
      setPersons(initialPersons);
    });
  }, []);

  useEffect(() => {
    setFilteredPersons(persons);
    setSearchTerm("")
  }, [persons]);

  const filterPersons = (substring) => {
    const filtered = persons.filter((person) =>
      person.name.toLowerCase().includes(substring.toLowerCase())
    );
    setFilteredPersons(filtered);
  };

  const showMessage = (message, isError) => {
    setMessage({text: message, isError: isError})
    setTimeout(() => {setMessage(null)}, [5000])
  }

  const addPerson = (person) => {
    const personInBook = persons.find(
      (personInList) =>
        personInList.name.toLowerCase() === person.name.toLowerCase()
    );

    if (!personInBook) {
      personService.create(person)
      .then((returnedPerson) => {
        const newPersons = persons.concat(returnedPerson);
        setPersons(newPersons);
        showMessage(`${person.name} added to phonebook.`, false)
      });
    } else if (personInBook.number === person.number) {
      showMessage(`${personInBook.name} is already added in the phone book`, true);
    } else if (
      window.confirm(
        `Person ${person.name} is already added in the phone book. Replace old number with new one?`
      )
    ) {
      personService.update(personInBook.id, person).then((response) => {
        const newPersons = persons.map((person) =>
          person.id !== response.id ? person : response
        );
        setPersons(newPersons);
        showMessage(`Number updated for ${person.name}.`, false)
      });
    }
  };

  const removePerson = (person) => {
    const personToRemove = persons.find(
      (personInList) => personInList.id === person.id
    );
    if (
      personToRemove &&
      window.confirm(`Do you really want to delete ${personToRemove.name}?`)
    ) {
      personService
        .remove(personToRemove.id)
        .then((response) => {
          const newPersons = persons.filter(
            (person) => person.id !== personToRemove.id
          );
          setPersons(newPersons);
          showMessage(`${personToRemove.name} removed from phonebook.`, false)
        })
        .catch((error) => {
          showMessage(`${person.name} was already deleted from server`, true);
          setPersons(
            persons.filter((person) => person.id !== personToRemove.id)
          );
        });
    }
  };

  const updateSearchTerm = (string) => {
    setSearchTerm(string);
  };

  return (
    <div>
      <h1>Phonebook</h1>
      <Notification message={message}/>
      <FilterForm
        filterPersons={filterPersons}
        searchTerm={searchTerm}
        updateSearchTerm={updateSearchTerm}
      />
      <AddPerson addPerson={addPerson} />
      <ListPersons
        filteredPersons={filteredPersons}
        removePerson={removePerson}
      />
    </div>
  );
};

export default App;
