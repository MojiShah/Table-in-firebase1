import React, { useEffect, useState } from 'react';
import { Table, Button, Modal, Form } from 'react-bootstrap';
import { MdDelete } from "react-icons/md";
import { CiEdit } from "react-icons/ci";
import './TableData.css';

function TableData() {

    const [users, setUsers] = useState([]);
    const [userId, setUserId] = useState('');
    const [getData, setGetData] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);

    const [userName, setUserName] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');

    useEffect(() => {
        (
            async () => {
                await fetch('https://moji-react-table-form-default-rtdb.firebaseio.com/users.json')
                    .then(res => res.json())
                    .then(x => {
                        console.log(Object.entries(x))
                        setUsers(Object.entries(x))
                    }).catch(err => console.log(err))
            }
        )();
    }, [getData]);

    useEffect(() => {

        let mainUserInfo = users.find(user => user[0] == userId)
        console.log(mainUserInfo);

        if(mainUserInfo){
            setUserName(mainUserInfo[1].userName);
            setPassword(mainUserInfo[1].password);
            setEmail(mainUserInfo[1].email);
        }

    }, [userId])

    const clickHandler = async () => {
        await fetch(`https://moji-react-table-form-default-rtdb.firebaseio.com/users/${userId}.json`, {
            method: 'DELETE'
        })
            .then(res => console.log(res));

        setGetData(Prev => !Prev);
        setShowDeleteModal(false);
    }

    const EditHandler = async () => {
        let newEditedInfos = {
            userName,
            password,
            email
        };

        await fetch(`https://moji-react-table-form-default-rtdb.firebaseio.com/users/${userId}.json`, {
            method: 'PUT',
            body: JSON.stringify(newEditedInfos)
        }).then(res => console.log(res));

        setShowEditModal(false);
        setGetData(prev => !prev);
    }


    return (
        <>
            <Table striped bordered hover responsive variant="dark">
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Username</th>
                        <th>Password</th>
                        <th>Email</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map((user, index) => (
                        <tr key={user[0]}>
                            <td>{index + 1}</td>
                            <td>{user[1].userName}</td>
                            <td>{user[1].password}</td>
                            <td>{user[1].email}</td>
                            <td className='actions'>
                                <MdDelete onClick={() => {
                                    setShowDeleteModal(true);
                                    setUserId(user[0]);
                                }
                                } />
                                <CiEdit onClick={() => {
                                    setShowEditModal(true);
                                    setUserId(user[0]);
                                }} />
                            </td>
                        </tr>
                    ))}

                </tbody>
            </Table>

            {/* Delete Modal */}
            <Modal
                show={showDeleteModal}
                size="lg"
                aria-labelledby="contained-modal-title-vcenter"
                centered
            >

                <Modal.Header closeButton
                    onClick={() => setShowDeleteModal(false)}>
                    <Modal.Title id="contained-modal-title-vcenter">
                        Remove User
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p style={{ fontSize: '28px', textAlign: 'center' }}>
                        Are you sure to remove this user?
                    </p>
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={() => clickHandler()}>Yes</Button>
                    <Button onClick={() => setShowDeleteModal(false)}>NO</Button>
                </Modal.Footer>
            </Modal>

            {/* Edit Modal */}\

            <Modal
                show={showEditModal}
                size="lg"
                aria-labelledby="contained-modal-title-vcenter"
                centered
            >

                <Modal.Header closeButton
                    onClick={() => setShowEditModal(false)}>
                    <Modal.Title id="contained-modal-title-vcenter">
                        Remove User
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>

                        <Form.Group className="mb-3" controlId="formBasicUsername">
                            <Form.Label>Username</Form.Label>
                            <Form.Control type="text"
                                placeholder="Edit your name"
                                value={userName}
                                onChange={e => setUserName(e.target.value)} />
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="formBasicPassword">
                            <Form.Label>Password</Form.Label>
                            <Form.Control type="password"
                                placeholder="Edit your password"
                                value={password}
                                onChange={e => setPassword(e.target.value)} />
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="formBasicEmail">
                            <Form.Label>Email address</Form.Label>
                            <Form.Control type="email"
                                placeholder="Edit your email"
                                value={email}
                                onChange={e => setEmail(e.target.value)} />
                        </Form.Group>

                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={() => EditHandler()}>Edit</Button>
                    <Button onClick={() => setShowEditModal(false)}>Close</Button>
                </Modal.Footer>
            </Modal>

        </>

    )
}

export default TableData