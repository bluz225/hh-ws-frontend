import React from 'react'
import { useNavigate } from "react-router-dom"
import { Dropdown } from 'flowbite-react'
import jwt_decode from 'jwt-decode'

export default function EditDeleteRestComp({id}) {
    const navigate = useNavigate()
    return (
    <>
    {
        localStorage.getItem('jwt') && jwt_decode(localStorage.getItem('jwt')).auth === "Admin" &&
        <div
            className="absolute top-0 right-0"
        >
            <Dropdown
                label="..."
                size="sm"
                arrowIcon={false}
                color=""
            >
                <Dropdown.Item onClick={() => navigate(`/editrestaurant/${id}`)}>
                    Edit
                </Dropdown.Item>
                <Dropdown.Item onClick={() => {
                    // ARE YOU SURE MODAL -> API call to server to set rest as inActive
                }}>
                    Delete
                </Dropdown.Item>
            </Dropdown>
        </div>
    }
    </>
  )
}