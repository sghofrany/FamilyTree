import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom'
import axios from 'axios'

function Person() {

    const [firstName, setFirstName] = useState("")
    const [lastName, setLastName] = useState("")
    const [dob, setDob] = useState("")
    const [loading, setLoading] = useState(false)

    const handleFirstChange = (e) => setFirstName(e.target.value)
    const handleLastChange = (e) => setLastName(e.target.value)
    const handleDobChange = (e) => setDob(e.target.value)

    let history = useHistory()

    const handleAddButton = (e) => {
        e.preventDefault()

        if(firstName.length === 0 || lastName.length === 0 || dob.length === 0) {
            /**
             * Send notification here
             */

             return console.log("Fill out all of the input fields!")
        }

        setLoading(true)

        axios.post(`http://localhost:5000/api/create/`, {
            firstName: firstName,
            lastName: lastName,
            dob: dob
        })
        .then(response => {

            setLoading(false)

            if(response.status === 200) {
                history.push(`/${response.data.id}`)
            }
        })
        .catch((error) => {
            console.log(error);
            setLoading(false)
        });
    }

    return (
        <div>
            <h1>Create a New Leaf</h1>

            <input onChange = { handleFirstChange } value={firstName} placeholder="first name"></input>
            <input onChange = { handleLastChange } value={lastName} placeholder="last name"></input>
            <input onChange = { handleDobChange } value={dob} placeholder="mm/dd/yyyy"></input>
            <button onClick = { handleAddButton } disabled={loading}>Add</button>

        </div>
    );
}

export default Person;
