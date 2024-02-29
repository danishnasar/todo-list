import React, { useEffect, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import TodoCompo from './TodoCompo';
import './Todo.css';
import { nanoid } from 'nanoid';
import { Modal, Button } from 'react-bootstrap';
import { motion } from "framer-motion";
import NotificationBar from "react-notification-bar";

function TodoList() {

    const [item, setItem] = useState("");
    const [add, setAdd] = useState([]);
    const [allItems, setAllItems] = useState([]);
    const [openModal, setOpenModal] = useState(false);
    const [editText, setEditText] = useState({});
    // for pagination 
    const [page, setPage] = useState(0);
    const nameChange = (query) => {
        setItem(query.target.value);
    }

    useEffect(() => {
        getData();
    }, [page]);



    async function getData() {
        try {
            const response = await fetch(`http://localhost:5000/data`);
            const responseJson = await response.json();
            if (responseJson.length > 0) {
                setAllItems(responseJson);
                setItemspage(responseJson);
            }  
        } catch(error) {
            console.log(error);
        }
        
    }

    const addItem = async (query) => {
        try {
        let id;
        const url = `http://localhost:5000/data`;
        const fecthedItem = await fetch(url);
        const responseFetchedJson = await fecthedItem.json();
        if (responseFetchedJson.length > 0) {
            const selectedId = responseFetchedJson.slice(-1)[0];
            id = selectedId.id + 1;
        } else {
            id = 1;
        }
        const payload = {
            id: id,
            title: item,
            guid: nanoid(5)
        };

        let newTask = [...allItems, payload];
        setAllItems(newTask);
        setItemspage(newTask);
        setItem('');
        saveItem(payload);
    } catch(error) {
            console.log(error);
        }
    }

    const sendEmail = async () => {
        const url = `http://localhost:5000/data`;
        const result = {data: allItems, method: 'Email'};
        showNotification();
        const response = await fetch(url, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body : JSON.stringify(result)
        });
        
          const responseJson = await response.json();
          console.log(responseJson);
    }

    const showNotification = () => {
        const text = "The Report has been successfully sent to your email";
        toast.info(text);
    }

    const saveItem = async (body) => {
        const url = `http://localhost:5000/data`;
        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body : JSON.stringify(body)
        })
        
          const responseJson = await response.json();
          console.log(responseJson);
    }

    const setItemspage = (allData) => {
        const limit = 4;
        let result = [];
        for (let i = 0; i < allData.length; i += limit) {
            let eachResult = allData.slice(i, i + limit);
            result.push(eachResult);
        }
        let newItems = result[page] === undefined ? result[page - 1] : result[page];
        let pageNum = result[page] === undefined ? page - 1 : page;
        setPage(pageNum);
        setAdd(newItems);
    }

    const remove = async (guid) => {
        let updatedItems = allItems.filter((item) => item.guid !== guid);
        let itemToDelete = allItems.filter((item) => item.guid === guid);
        setAllItems(updatedItems);
        if (updatedItems.length === 0) {
            setAdd([]);
            deleteItem(itemToDelete[0].id);
        } else {
            setItemspage(updatedItems);
            deleteItem(itemToDelete[0].id);
        }
    }

    const edit = async (guid) => {
        let editIndex = allItems.findIndex((item) => item.guid === guid);
        if (editIndex !== -1) {
            const editItems = {
                guid: allItems[editIndex].guid,
                title: allItems[editIndex].title,
                id: allItems[editIndex].id
            }
            setEditText(editItems);
            setOpenModal(true);
        } else {
            alert('Item does not exist');
        }
    }

    const deleteItem = async (id) => {
        const url = `http://localhost:5000/data`;
        const response = await fetch(url, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ id: id, method: "Delete"})
        });
        
          const responseJson = await response.json();
          console.log(responseJson);
    }

    const updatedItem = async (body) => {
        const url = `http://localhost:5000/data`;
        const response = await fetch(url, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(body)
        });
        
          const responseJson = await response.json();
          console.log(responseJson);
    }

    const nextItems = () => {
        const limit = 4;
        let result = [];
        for (let i = 0; i < allItems.length; i += limit) {
            let eachResult = allItems.slice(i, i + limit);
            result.push(eachResult);
        }
        let newItems = result[page + 1];
        setAdd(newItems);
        setPage(page + 1);
    }

    const prevItems = () => {
        const limit = 4;
        let result = [];
        for (let i = 0; i < allItems.length; i += limit) {
            let eachResult = allItems.slice(i, i + limit);
            result.push(eachResult);
        }
        let newItems = result[page - 1];
        setAdd(newItems);
        setPage(page - 1);
    }

    const closeModal = () => {
        setOpenModal(false);
    }

    const onConfirm = () => {
        let updatedItems = allItems;
        const newText = editText.title;
        const editIndex = updatedItems.findIndex((item) => item.guid === editText.guid);
        updatedItems[editIndex].title = newText;
        setAllItems(updatedItems);
        setItemspage(updatedItems);
        setOpenModal(false);
        updatedItem(editText);
    }

    const onChange = (e) => {
        const changedItem = {
            guid: editText.guid,
            title: e.target.value,
            id: editText.id
        }
        setEditText(changedItem);
    }


    return (
        <>
            <div className="card">
                <h1>Todo List</h1>
                <input className="form-control textBox" type="text" placeholder="please enter your tasks here..." onChange={nameChange} value={item} />
                <motion.div animate={{ opacity: item ? 1 : 0 }} />
                <button type="button" className="btn btn-dark addItem" disabled = {item === ''} onClick={addItem}>Add Item</button>
                <button type="button" className="btn btn-dark sendEmail" disabled = {allItems.length < 1} onClick={sendEmail}>Send Report</button>
                
                
                <table className="table">
                    <tbody>
                        {add.map((item) => {
                            return <TodoCompo item={item.title} guid={item.guid}
                            remove={remove} edit={edit} />;
                        })}

                    </tbody>
                </table>
                <button type="button" onClick={() => {prevItems()}} disabled = {page == 0}
                className="btn btn-success prevButton">Previous</button>
                <br />
                <button type="button" onClick={() => {nextItems()}} disabled = {Math.floor((allItems.length + 4 - 1)/4) == page + 1 || allItems.length < 5}
                className="btn btn-success nextButton">Next</button>
                <br />


            </div>
            <Modal show={openModal} onHide={closeModal}>
            <Modal.Header closeButton>
            <Modal.Title>Edit Task</Modal.Title>
            </Modal.Header>
            <Modal.Body>
             <input type="text" value={editText.title} onChange={onChange} />
             </Modal.Body>
             <Modal.Footer>
             <Button variant="secondary" onClick={() => setOpenModal(false)}>Cancel</Button>
             <Button variant="primary" onClick={onConfirm}>Ok</Button>
            </Modal.Footer>
            </Modal>
            <ToastContainer position="top-center"/>
        </>
    )
}

export default TodoList