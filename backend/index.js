//Exercices 3.15-3.18 done

const express = require("express");
const app = express();
const cors = require("cors");
const morgan = require("morgan");

require("dotenv").config();

const Person = require("./models/person");

morgan.token("body", (req) => JSON.stringify(req.body));


const errorHandler = (error, request, response, next) => {
  console.error(error.message);

  if (error.name === "CastError") {
    return response.status(400).send({ error: "malformatted id" });
  }

  next(error);
};

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: "unknown endpoint" });
};

app.use(cors());
app.use(express.json());

app.use(
  morgan(function (tokens, req, res) {
    const loggingString = [
      tokens.method(req, res),
      tokens.url(req, res),
      tokens.status(req, res),
      tokens.res(req, res, "content-length"),
      "-",
      tokens["response-time"](req, res),
      "ms",
    ].join(" ");

    if (req.method === "POST") {
      return [loggingString, tokens["body"](req)].join(" ");
    }
    return loggingString;
  })
);

app.use(express.static("dist"));


app.get("/", (req, res) => {
  res.send("<h1>Puhelinluettelo</h1>");
});

app.get("/info", (req, res) => {
  const date = Date.now();
  Person.find({})
    .then(persons => {
      res.send(
        `<p>Phonebook has info for ${persons.length} people.<p><p>${new Date(
          date
        ).toString()}</p>`
      )
    })
});

app.get("/api/persons", (req, res) => {
  Person.find({}).then((persons) => {
    res.json(persons);
  });
});

app.get("/api/persons/:id", (req, res, next) => {
  Person.findById(req.params.id)
    .then((person) => {
      if (person) {
        res.json(person)
      } else {
        res.status(404).end();
      }
  })
  .catch(error => next(error))
});

app.delete("/api/persons/:id", (req, res, next) => {
  Person.findByIdAndDelete(req.params.id)
    .then(result => {
      res.status(204).end()
    })
    .catch(error => next(error))
});

app.post("/api/persons", (request, response) => {
  const body = request.body;

  if (!(body.name && body.number)) {
    return response.status(400).json({ error: "content missing" });
  }

  const person = new Person({
    name: body.name,
    number: body.number,
  });

  person.save().then((savedPerson) => {
    response.json(savedPerson);
  });
});

app.put("/api/persons/:id", (request, response, next) => {
  const body = request.body
  const person = {
    name: body.name,
    number: body.number,
  }

  Person.findByIdAndUpdate(request.params.id, person, {new:true})
    .then(updatedPerson => {
      response.json(updatedPerson)
    })
    .catch(error => next(error))
})

app.use(unknownEndpoint)
app.use(errorHandler);


const PORT = process.env.PORT;
app.listen(PORT);
console.log(`Server running on port ${PORT}`);
