import { useState } from "react";

const AddPerson = ({ addPerson}) => {
  const [newName, setNewName] = useState("");
  const [newNumber, setNewNumber] = useState("");

  const handleNameChange = (event) => {
    setNewName(event.target.value);
  };

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value);
  };

  const clearInputFields = () => {
    setNewName("")
    setNewNumber("")
  }

  const addNewPerson = (event) => {
    event.preventDefault();
    addPerson({name: newName, number: newNumber})
    clearInputFields();
  };

  return (
    <div>
    <h2>Add a new</h2>
    <form onSubmit={addNewPerson}>
      <div>
        name: <input onChange={handleNameChange} value={newName}/>
      </div>
      <div>
        number: <input onChange={handleNumberChange} value={newNumber}/>
      </div>
      <div>
        <button type="submit">add</button>
      </div>
    </form>
    </div>
  );
};

export default AddPerson;
