import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom'
import Modal from 'react-modal'
import axios from 'axios'
import {Link} from 'react-router-dom'

Modal.setAppElement('#root')

function View(props) {

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
   
    const [editArray, setEditArray] = useState([])

    const [spouse, setSpouse] = useState({first_name: "", last_name: "", dob: "", id: ""})
    const [father, setFather] = useState({first_name: "", last_name: "", dob: "", id: ""})
    const [mother, setMother] = useState({first_name: "", last_name: "", dob: "", id: ""})

    let history = useHistory()

    async function loadData() {
        
        const url = `http://localhost:5000/api/${props.match.params.id}`
  
        try {
            const response = await axios.get(url);

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

            if(editArray.length === 0) {
                return console.log("There is no information to update")
            }

            setSpouse({
                first_name: editArray[0].first_name,
                last_name: editArray[0].last_name,
                dob: editArray[0].dob,
                id: editArray[0].id
            })

            console.log("Spouse", spouse)

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

            console.log("Mother", mother)

        } else if(modalEdit === "CHILDREN") {
            
            let arr = combinedArray(editArray, children)

            setChildren(arr)

            console.log("Children", children)

        }

        setEditArray([])

    }

    const combinedArray = (arr1, arr2) => {

        let val = arr2.slice()


        //if editArray is length 0 return children

        if(arr1.length === 0) return arr2

        //if children is length 0 return editArray

        if(arr2.length === 0) return arr1

        for(var i = 0; i < arr1.length; i++) {

            let curr = arr1[i]

            for(var j = 0; j < arr2.length; j++) {

                let add = arr2[j]
    
                if(curr.id !== add.id) {
                    val.push(curr)
                }
    
                
            }

        }

        return val

    }

    const doesArrayContain = (arr, element) => {

        for(var i = 0; i < arr.length; i++) {
            if(arr[i].id === element.id) {
                return true
            }
        }

        return false
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

            if(modalEdit === "CHILDREN") {

                if(doesArrayContain(editArray, {id: data.id})) {
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
        
        let copy = children.slice()

        for(var i = 0; i < copy.length; i++) {
            if(copy[i].id === id) {
                copy.splice(i, 1)
            }
        }

        setChildren(copy)

    }

    useEffect(() => {
        loadData()
    }, []) 

    useEffect(() => {

        console.log("called")

        const update = async () => {
            
            setUpdating(true)

            console.log("Updating", {
                spouse: spouse,
                father: father,
                mother: mother,
                children: children
            })

            const url = `http://localhost:5000/api/update/${props.match.params.id}`
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
                                    <button onClick={ () => deleteChild(child.id) } >Delete</button>
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
                    <button onClick={ closeModal }>Close</button>
                    <Link  to="/">Create</Link>

                    <div>
                        <h1>Selected</h1>
                        {
                           editArray.map(d => (
                            <div key={d.id}>
                                <span>{d.first_name} {d.last_name} {d.dob}</span>
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
