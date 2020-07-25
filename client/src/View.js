import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom'
import Modal from 'react-modal'
import axios from 'axios'
import { v4 as uuidv4 } from 'uuid'
import {Link} from 'react-router-dom'

Modal.setAppElement('#root')

function View({ match }) {

    const [modalIsOpen, setIsOpen] = useState(false)
    const [modalEdit, setModalEdit] = useState("")

    const [shouldUpdate, setShouldUpdate] = useState(false)

    const [data, setData] = useState([])
    const [loading, setLoading] = useState(true)
    const [updating, setUpdating] = useState(false)

    const [children, setChildren] = useState([])
    const [childFirstName, setChildFirstName] = useState("")
    const [childLastName, setChildLastName] = useState("")
    const [childDob, setChildDob] = useState("")
    const [childId, setChildId] = useState("")

    const [searchFirst, setSearchFirst] = useState("")
    const [searchData, setSearchData] = useState([])
   
    const [editFirst, setEditFirst] = useState("")
    const [editLast, setEditLast] = useState("")
    const [editDob, setEditDob] = useState("")
    const [editId, setEditId] = useState("")

    const [spouse, setSpouse] = useState({first_name: "", last_name: "", dob: "", id: ""})
    const [father, setFather] = useState({first_name: "", last_name: "", dob: "", id: ""})
    const [mother, setMother] = useState({first_name: "", last_name: "", dob: "", id: ""})

    let history = useHistory()

    async function loadData() {
        
        const url = `http://localhost:5000/api/${match.params.id}`
  
        try {
            const response = await axios.get(url);

            if(response.data.length === 0) {
                console.log("data length is 0")
                history.push('/')
                return
            }

            console.log(response)

            setData(response.data);
            setChildren(response.data[0].children)
            setSpouse({
                first_name: response.data[0].spouse.first_name, 
                last_name: response.data[0].spouse.last_name, 
                dob: response.data[0].spouse.dob, 
                id: response.data[0].spouse.id
            })

            setFather({
                first_name: response.data[0].father.first_name, 
                last_name: response.data[0].father.last_name, 
                dob: response.data[0].father.dob, 
                id: response.data[0].father.id
            })

            setMother({
                first_name: response.data[0].mother.first_name, 
                last_name: response.data[0].mother.last_name, 
                dob: response.data[0].mother.dob, 
                id: response.data[0].mother.id
            })

            setLoading(false);  //make sure to set loading = false last, because your array will be undefined if you call it before setting your array.
  
        } catch (err) {
            console.log("fetch failed", err);
            // history.push(`/error`)
        }
      }

    const handleAddChildren = () => {
        if(childFirstName.length === 0 || childLastName.length === 0 || childDob.length === 0) {
            return console.log("must fill out all fields")
        }

        setChildren(prevChildren => [...prevChildren, {
            first_name: childFirstName,
            last_name: childLastName,
            dob: childDob,
            id: childId
        }])

    }

    const handleUpdateInformation = async () => {

        setShouldUpdate(true)

        if(modalEdit === "SPOUSE") {
            setSpouse({
                first_name: editFirst,
                last_name: editLast,
                dob: editDob,
                id: editId
            })

            console.log("Spouse", spouse)

        } else if(modalEdit === "FATHER") {
            setFather({
                first_name: editFirst,
                last_name: editLast,
                dob: editDob,
                id: editId
            })

            console.log("Father", father)

        } else if(modalEdit === "MOTHER") {
            setMother({
                first_name: editFirst,
                last_name: editLast,
                dob: editDob,
                id: editId
            })

            console.log("Mother", mother)

        }

        let copy = children.slice()
        setChildren(copy)

        setChildFirstName("")
        setChildLastName("")
        setChildDob("")

    }

    const searchCollection = async () => {
        
        const url = `http://localhost:5000/api/search/${searchFirst}/:last/:dob`
        let response = await axios.get(url)

        if(response.status === 200) {
            setSearchData(response.data)
        }

    }

    const handleSearchSelect = (data) => {

        console.log(data)

        if(modalIsOpen) {

            setEditFirst(data.first_name)
            setEditLast(data.last_name)
            setEditDob(data.dob)
            setEditId(data.id)

        } else {
            setChildFirstName(data.first_name)
            setChildLastName(data.last_name)
            setChildDob(data.dob)
            setChildId(data.id)
        }

    }

    const openModal = (value) => {
        setIsOpen(true)
        setModalEdit(value)
    }

    const closeModal = () => {
        setIsOpen(false)
    }

    useEffect(() => {
        loadData()
    }, []) 

    useEffect(() => {

        const update = async () => {
            
            setUpdating(true)

            console.log("Updating", {
                spouse: spouse,
                father: father,
                mother: mother,
                children: children
            })

            const url = `http://localhost:5000/api/update/${match.params.id}`
            await axios.post(url, {
                data: data,
                spouse: spouse,
                father: father,
                mother: mother,
                children: children
            })
            
            setUpdating(false)
        }

        if(shouldUpdate) {
            update()
            setShouldUpdate(false)
        }
        

    }, [spouse, father, mother, children])

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

                    <div>
                        <h3>Spouse</h3>
                        <span>{spouse.first_name} {spouse.last_name} {spouse.dob}</span>
                        <Link  to={`/${spouse.id}`}><p>Visit</p></Link>
                        <button onClick={() => openModal("SPOUSE") } >Edit</button>
                    </div>

                </div>
                <hr/>
                <div>
                    <h1>Parental Information</h1>

                    <div>
                        <span>{father.first_name} {father.last_name} {father.dob} {father.id}</span>
                        <button onClick={() => openModal("FATHER") } >Edit</button>
                    </div>

                    <div>
                        <span>{mother.first_name} {mother.last_name} {mother.dob} {mother.id}</span>
                        <button onClick={() => openModal("MOTHER") } >Edit</button>
                    </div>
                </div>
                <hr/>
                <div>
                    <h1>Children</h1>

                    <div>
                        
                        {children.map(child => (
                            <div key={child.id}>
                                <span>{child.first_name} </span>
                                <span>{child.last_name} </span>
                                <span>{child.dob} </span>
                                <span>{child.id} </span>
                            </div>
                        ))} 

                        <input onChange={(e) => setChildFirstName(e.target.value)} value={childFirstName} placeholder="first name"></input>
                        <input onChange={(e) => setChildLastName(e.target.value)} value={childLastName} placeholder="last name"></input>
                        <input onChange={(e) => setChildDob(e.target.value)} value={childDob} placeholder="date of birth"></input>
                        <button onClick={ handleAddChildren }>Add</button>
                        
                        <div>
                            <input onChange={(e) => setSearchFirst(e.target.value)} value={searchFirst} placeholder="first name"></input>
                            <button onClick={ searchCollection } >Search</button>
                        
                            {
                                searchData.map(d => (
                                    <div key={d.id}>
                                        <span>{d.first_name} {d.last_name} {d.dob}</span>
                                        <button onClick={ () => handleSearchSelect(d) }>Select</button>
                                    </div>
                                ))
                            }
                  
                        </div>
                    </div>
                </div>
           
                <button onClick={ handleUpdateInformation } disabled={updating}>Update</button>

                <hr/>
                

                <Modal
                isOpen={modalIsOpen}
                onRequestClose={closeModal}
                contentLabel={modalEdit}
                >
                    <h1>Modal Edit {modalEdit}</h1>

                    <div>
                        <input onChange={(e) => {setEditFirst(e.target.value)}} placeholder="first name" value={editFirst}></input>
                        <input onChange={(e) => {setEditLast(e.target.value)}} placeholder="last name" value={editLast}></input>
                        <input onChange={(e) => {setEditDob(e.target.value)}} placeholder="date of birth" value={editDob}></input>
                    </div>

                    <hr/>

                    <h3>Or</h3>

                    <hr/>

                    <div>
                        <input onChange={(e) => setSearchFirst(e.target.value)} value={searchFirst} placeholder="first name"></input>
                        <button onClick={ searchCollection } >Search</button>
                    
                        {
                            searchData.map(d => (
                                <div key={d.id}>
                                    <span>{d.first_name} {d.last_name} {d.dob}</span>
                                    <button onClick={ () => handleSearchSelect({first_name: d.first_name, last_name: d.last_name, dob: d.dob, id: d.id}) }>Select</button>
                                </div>
                            ))
                        }
                  
                    </div>

                    <button onClick={ handleUpdateInformation } disabled={updating}>Update</button>
                    <button onClick={closeModal}>Close</button>
                </Modal>
                
            </div>  

        }
    </div>

  );
}

export default View;
