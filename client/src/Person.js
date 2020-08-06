import React, { useState } from 'react';
import { useHistory, Link } from 'react-router-dom'
import axios from 'axios'
import moment from 'moment'

function Person() {

    const [firstName, setFirstName] = useState("")
    const [lastName, setLastName] = useState("")
    const [dob, setDob] = useState("")

    const [searchDob, setSearchDob] = useState("")
    const [searchData, setSearchData] = useState([])

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

        if(!moment(dob, 'MM/DD/YYYY',true).isValid()) {
            return console.log("date of birth is not valid")
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

    const searchCollection = async () => {
        
        if(searchDob.length === 0) {
            return console.log("Search input is empty")
        }

        if(!moment(searchDob, 'MM/DD/YYYY',true).isValid()) {
            return console.log("date of birth is not valid")
        }

        let fixedDate = searchDob.split('/').join('-')

        const url = `http://localhost:5000/api/search/${fixedDate}`
        let response = await axios.get(url)

        if(response.status === 200) {
            setSearchData(response.data)
        }

    }

    return (
        <div>
            <h1>Create a New Leaf</h1>

            <input onChange = { handleFirstChange } value={firstName} placeholder="first name"></input>
            <input onChange = { handleLastChange } value={lastName} placeholder="last name"></input>
            <input onChange = { handleDobChange } value={dob} placeholder="mm/dd/yyyy"></input>
            <button onClick = { handleAddButton } disabled={loading}>Add</button>

            <div>
                <input onChange={(e) => setSearchDob(e.target.value)} value={searchDob} placeholder="MM/DD/YYYY"></input>
                <button onClick={ searchCollection } >Search</button>
            
                {
                    searchData.map(d => (
                        <div key={d.id}>
                            <span>{d.first_name} {d.last_name} {d.dob}</span>
                            <Link  to={`/${d.id}`}>Visit</Link>
                        </div>
                    ))
                }
            </div>

        </div>
    );
}

export default Person;
