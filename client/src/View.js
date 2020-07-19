import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom'
import axios from 'axios'
import { v4 as uuidv4 } from 'uuid';

function View({ match }) {

    const [data, setData] = useState([])
    const [loading, setLoading] = useState(true)
    const [updating, setUpdating] = useState(false)

    const [siblings, setSiblings] = useState([])
    const [sibFirstName, setSibFirstName] = useState("")
    const [sibLastName, setSibLastName] = useState("")
    const [sibDob, setSibDob] = useState("")

    const [searchFirst, setSearchFirst] = useState("")
    const [searchData, setSearchData] = useState([])

    let history = useHistory()

    async function loadData() {
        
        const url = `http://localhost:5000/api/${match.params.id}`
  
        try {
            const response = await axios.get(url);

            console.log(response)

            setData(response.data);
            setSiblings(response.data[0].siblings)
            setLoading(false);  //make sure to set loading = false last, because your array will be undefined if you call it before setting your array.
  
        } catch (err) {
            console.log("fetch failed", err);
            // history.push(`/error`)
        }
      }

    useEffect(() => {
        loadData()
    }, []) 

    const handleEmptyValue = (data) => {
        if(data.length === 0) {
            return "Empty"
        }

        return data
    }

    const handleAddSibling = () => {
        if(sibFirstName.length === 0 || sibLastName.length === 0 || sibDob.length === 0) {
            return console.log("must fill out all fields")
        }

        setSiblings(prevSiblings => [...prevSiblings, {
            first_name: sibFirstName,
            last_name: sibLastName,
            dob: sibDob,
            id: uuidv4()
        }])

    }

    const handleUpdateInformation = async () => {

        setUpdating(true)
        const url = `http://localhost:5000/api/update/${match.params.id}`
        await axios.post(url, {
            data: data,
            siblings: siblings
        })

        setSibFirstName("")
        setSibLastName("")
        setSibDob("")

        setUpdating(false)

    }

    const searchCollection = async () => {
        
        const url = `http://localhost:5000/api/search/${searchFirst}/:last/:dob`
        let response = await axios.get(url)

        if(response.status === 200) {
            setSearchData(response.data)
        }

    }

  return (

    <div className="View">

        {
            loading ? "" :

            <div>
                <div>
                    <h1>Personal Information</h1>

                    <div>
                        <h3>{data[0].first_name} {data[0].last_name} {data[0].dob}</h3>
                    </div>
                </div>
                <hr/>
                <div>
                    <h1>Parental Information</h1>

                    <div>
                        <h3>Father {handleEmptyValue(data[0].father.first_name)} {handleEmptyValue(data[0].father.last_name)} {handleEmptyValue(data[0].father.dob)}</h3>
                        <button>Edit</button>
                    </div>

                    <div>
                        <h3>Mother {handleEmptyValue(data[0].mother.first_name)} {handleEmptyValue(data[0].mother.last_name)} {handleEmptyValue(data[0].mother.dob)}</h3>
                        <button>Edit</button>
                    </div>
                </div>
                <hr/>
                <div>
                    <h1>Sibling Information</h1>

                    <div>
                        
                        {siblings.map(sib => (
                            <div key={sib.id}>
                                <span>{sib.first_name} </span>
                                <span>{sib.last_name} </span>
                                <span>{sib.dob} </span>
                            </div>
                        ))}

                        <input onChange={(e) => setSibFirstName(e.target.value)} value={sibFirstName} placeholder="first name"></input>
                        <input onChange={(e) => setSibLastName(e.target.value)} value={sibLastName} placeholder="last name"></input>
                        <input onChange={(e) => setSibDob(e.target.value)} value={sibDob} placeholder="date of birth"></input>
                        <button onClick={ handleAddSibling }>Add</button>
                    </div>
                </div>
                <hr/>

                <button onClick={ handleUpdateInformation } disabled={updating}>Update</button>

                <hr/>
                <div>
                    <h1>Search</h1>
                    <input onChange={(e) => setSearchFirst(e.target.value)} value={searchFirst} placeholder="first name"></input>
                    <button onClick={ searchCollection } >Search</button>
                  
                    {
                        searchData.map(d => (
                            <div key={d.id}>
                                <span>{d.first_name} {d.last_name} {d.dob}</span>
                            </div>
                        ))
                    }
                  
                </div>


                
            </div>  

        }
    </div>

  );
}

export default View;
