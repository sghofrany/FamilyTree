import React, { useState } from 'react';
import { useHistory, Link } from 'react-router-dom'
import axios from 'axios'
import moment from 'moment'
import './styles/style.css'
import logo from './logos/logo_transparent.png'

function FrontPage() {

    const [firstName, setFirstName] = useState("")
    const [lastName, setLastName] = useState("")
    const [dob, setDob] = useState("")

    const [searchFirst, setSearchFirst] = useState("")
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
        
        if(searchFirst.length === 0) {
            return console.log("Search input is empty")
        }

        const url = `http://localhost:5000/api/search/${searchFirst}`
        let response = await axios.get(url)

        if(response.status === 200) {
            setSearchData(response.data)
        }

    }

    return (
        <div className="wrapper">
            <h1 className="title">Family Tree</h1>

            <div className="create-wrapper">

                <p className="subtitle">Add a Family Member</p>

                <div>
                    <p>First Name</p>
                    <input onChange = { handleFirstChange } value={firstName} placeholder="first name"></input>
                </div>
                
                <div>
                    <p>Last Name</p>
                    <input onChange = { handleLastChange } value={lastName} placeholder="last name"></input>
                </div>

                <div>
                    <p>Birthday</p>
                    <input onChange = { handleDobChange } value={dob} placeholder="mm/dd/yyyy"></input>
                </div>

                <button className="button" onClick = { handleAddButton } disabled={loading}>Add</button>
            </div>
            
            <hr/>

            <div className="search-wrapper">

                <p className="subtitle">Search for a Family Member</p>

                <div>
                    <p>First Name</p>
                    <input onChange={(e) => setSearchFirst(e.target.value)} value={searchFirst} placeholder="first name"></input>
                </div>

                <button className="button" onClick={ searchCollection } >Search</button>
                
                {
                    searchData.map(d => (
                        <div className="search-item" key={d.id}>
                            <span>{d.first_name} {d.last_name} {d.dob}</span>
                            <Link  to={`/${d.id}`}>Visit</Link>
                        </div>
                    ))
                }
            </div>

        </div>
    );
}

export default FrontPage;
