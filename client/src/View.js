import React, { useState, useEffect } from 'react';
import { useHistory, Link } from 'react-router-dom'
import Modal from 'react-modal'
import axios from 'axios'

Modal.setAppElement('#root')

function View(props) {

    const [modalIsOpen, setIsOpen] = useState(false)
    const [modalEdit, setModalEdit] = useState("")

    const [shouldUpdate, setShouldUpdate] = useState(false)

    const [data, setData] = useState([])
    const [loading, setLoading] = useState(true)
    const [updating, setUpdating] = useState(false)

    const [children, setChildren] = useState([])

    const [searchFirst, setSearchFirst] = useState("")
    const [searchData, setSearchData] = useState([])
   
    const [editArray, setEditArray] = useState([])

    const [spouse, setSpouse] = useState({first_name: "", last_name: "", dob: "", id: ""})
    const [father, setFather] = useState({first_name: "", last_name: "", dob: "", id: ""})
    const [mother, setMother] = useState({first_name: "", last_name: "", dob: "", id: ""})

    let history = useHistory()

    const handleUpdateInformation = async () => {

        setShouldUpdate(true)

        if(modalEdit === "SPOUSE") {

            if(editArray.length === 0) {
                return console.log("There is no information to update")
            }

            setSpouse({
                first_name: editArray[0].first_name,
                last_name: editArray[0].last_name,
                dob: editArray[0].dob,
                id: editArray[0].id
            })

        } else if(modalEdit === "FATHER") {

            if(editArray.length === 0) {
                return console.log("There is no information to update")
            }

            setFather({
                first_name: editArray[0].first_name,
                last_name: editArray[0].last_name,
                dob: editArray[0].dob,
                id: editArray[0].id
            })

            console.log("Father", father)

        } else if(modalEdit === "MOTHER") {

            if(editArray.length === 0) {
                return console.log("There is no information to update")
            }

            setMother({
                first_name: editArray[0].first_name,
                last_name: editArray[0].last_name,
                dob: editArray[0].dob,
                id: editArray[0].id
            })

        } else if(modalEdit === "CHILDREN") {
            setChildren(editArray)
        }

        setEditArray([])

    }

    const doesArrayContain = (arr, id) => {

        for(var i = 0; i < arr.length; i++) {
            if(arr[i].id === id) {
                return true
            }
        }

        return false
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

    const handleSearchSelect = (data) => {

        if(modalIsOpen) {

            if(modalEdit === "CHILDREN") {

                if(doesArrayContain(editArray, data.id)) {
                    return console.log("already contains this element")
                }

                setEditArray((prev) => [...prev, {first_name: data.first_name, last_name: data.last_name, dob: data.dob, id: data.id}])
            } else if(modalEdit === "FATHER") {
                setEditArray([{first_name: data.first_name, last_name: data.last_name, dob: data.dob, id: data.id}])
            } else if(modalEdit === "MOTHER") {
                setEditArray([{first_name: data.first_name, last_name: data.last_name, dob: data.dob, id: data.id}])
            } else if(modalEdit === "SPOUSE") {
                setEditArray([{first_name: data.first_name, last_name: data.last_name, dob: data.dob, id: data.id}])
            }

        }

    }

    const openModal = (value) => {
        setIsOpen(true)
        setModalEdit(value)
    }

    const closeModal = () => {
        setEditArray([])
        setIsOpen(false)
    }

    const deleteChild = (id) => {
        
        let copy = editArray.slice()

        for(var i = 0; i < copy.length; i++) {
            if(copy[i].id === id) {
                copy.splice(i, 1)
            }
        }

        setEditArray(copy)

    }

    useEffect(() => {

        async function loadData(id) {
        
            const url = `http://localhost:5000/api/${id}`
      
            try {
                const response = await axios.get(url);

                console.log('children1', children, response.data[0].children)

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

        loadData(props.match.params.id)

        return function() {
            console.log("unmount")
        }

    }, [props.match.params.id]) 

    useEffect(() => {

        const update = async () => {
            
            console.log("Sending update request")

            setUpdating(true)

            const url = `http://localhost:5000/api/update/${props.match.params.id}`
            await axios.post(url, {
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
        

    }, [spouse, father, mother, children, shouldUpdate])

    useEffect(() => {

        if(modalIsOpen) {
            if(modalEdit === "CHILDREN") {

                setEditArray(children)
    
            }
        }

    }, [modalIsOpen, modalEdit])

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
                        <span>{father.first_name} </span>
                        <span>{father.last_name} </span>
                        <span>{father.dob} </span>
                        <span><Link  to={`/${father.id}`}>Visit</Link></span>
                        <button onClick={() => openModal("FATHER") } >Edit</button>
                    </div>

                    <div>
                        <span>{mother.first_name} </span>
                        <span>{mother.last_name} </span>
                        <span>{mother.dob} </span>
                        <span><Link  to={`/${mother.id}`}>Visit</Link></span>
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
                                <span><Link  to={`/${child.id}`}>Visit</Link></span>
                            </div>
                        ))} 

                        <button onClick={() => openModal("CHILDREN") } >Edit</button>

                    </div>
                </div>
        
                <hr/>
                

                <Modal
                isOpen={modalIsOpen}
                onRequestClose={closeModal}
                contentLabel={modalEdit}
                >
                    <h1>Modal Edit {modalEdit}</h1>

                    <div>
                        {
                            modalEdit === "CHILDREN" ? children.map(child => (
                                <div key={child.id}>
                                    <span>{child.first_name} {child.last_name} {child.dob}</span>
                                </div>
                            )) 
                            : modalEdit === "FATHER" ?
                                <div>
                                    <span>{father.first_name} {father.last_name} {father.dob}</span>
                                </div>
                            : modalEdit === "MOTHER" ?
                            <div>
                                <span>{mother.first_name} {mother.last_name} {mother.dob}</span>
                            </div>
                            :
                            <div>
                                <span>{spouse.first_name} {spouse.last_name} {spouse.dob}</span>
                            </div>
                        }
                    </div>

                    <div>
                        <input onChange={(e) => setSearchFirst(e.target.value)} value={searchFirst} placeholder="DOB: MM/DD/YYYY"></input>
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
                    <button onClick={ closeModal }>Close</button>
                    <Link  to="/">Create</Link>

                    <div>
                        <h1>Selected</h1>
                        {
                           editArray.map(d => (
                            <div key={d.id}>
                                <span>{d.first_name} {d.last_name} {d.dob}</span>
                                <button onClick={ () => deleteChild(d.id) } >Delete</button>
                            </div>
                        )) 
                        }
                    </div>


                </Modal>
                
            </div>  

        }
    </div>

  );
}

export default View;
