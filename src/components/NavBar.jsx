import { useEffect } from 'react'
import { Link, useNavigate } from "react-router-dom"
import { Navbar, Dropdown, Avatar, TextInput } from 'flowbite-react'
import jwt_decode from 'jwt-decode'
import { useImmer } from 'use-immer'
import { useState } from 'react'
import Alpha2BannerComp from './Alpha2BannerComp'
import { RxMagnifyingGlass } from 'react-icons/rx'
import { BsInstagram } from 'react-icons/bs'

const emptyUserInfo = {
    "firstName": "",
    "lastName": "",
    "email": "",
    "id": "",
}

export default function NavBar({ searchParams, setSearchParams, handleSearchFormSubmit, geoLocAvail }) {
    const navigate = useNavigate()
    const [alpha2, setAlpha2] = useState(true)
    const [userInfo, setUserInfo] = useImmer(emptyUserInfo)

    // function to remove token for logging out here
    const handleLogOut = () => {
        console.log("log out")
        // check to see if a token exists in local storage
        if (localStorage.getItem('jwt')) {
            // if so, delete it 
            localStorage.removeItem('jwt')
            navigate('/')
        }
        setUserInfo(emptyUserInfo)
    }




    // set user Info for NavBar use from jwt token
    useEffect(() => {
        // console.log("navbar useEffect")
        if (localStorage.getItem('jwt')) {
            const token = localStorage.getItem('jwt')
            const decoded = jwt_decode(token)
            // console.log("decoded",decoded)
            setUserInfo((draft) => {
                draft.firstName = decoded.firstName
                draft.lastName = decoded.lastName
                draft.email = decoded.email
                draft.id = decoded.id
            })
            // renderAddRest = checkAdmin(decoded)

        }
    })

    useEffect(() => {
        // console.log("searchParams:",searchParams)
        if (searchParams.address.length === 0) {
            setSearchParams((draft) => { draft.address = "Current Location" })
        }
    }, [])

    // create / update search history
    const appendSearchHistory = (searchParam) => {
        const now = new Date()
        const newEntry = {
            searchTerm: searchParam.searchTerm,
            address: searchParam.address,
            date_UTC_ISO: now.toUTCString()
        }
        if (localStorage.getItem('sh')) {
            const getHistoryArr = JSON.parse(localStorage.getItem('sh'))
            getHistoryArr.push(newEntry)
            if (getHistoryArr.length > 3) {
                getHistoryArr.shift()
            }
            localStorage.setItem('sh', JSON.stringify(getHistoryArr))
            console.log("getHistoryArr:", localStorage.getItem('sh'))
        } else {
            const newHistoryArr = [newEntry]
            localStorage.setItem('sh', JSON.stringify(newHistoryArr))
            // console.log("newHistoryArr:",localStorage.getItem('sh'))
        }
    }

    const getMostRecentSearchHistory = () => {
        if (localStorage.getItem('sh')) {
            const getHistoryArr = JSON.parse(localStorage.getItem('sh'))
            const mostRecent = getHistoryArr[getHistoryArr.length - 1]
            return mostRecent
        }
    }

    return (
        <>
            <div
                className='fixed flex flex-col w-full top-0 bg-white z-50'
            >
                <Navbar
                    className="flex justify-between"
                // fluid={true}
                // rounded={true}
                >
                    <Navbar.Brand
                        href="/">
                        {/* <Link to="/"> */}
                        <p>
                            hhqueen
                        </p>
                        {/* </Link> */}
                    </Navbar.Brand>

                    {/* Search Inputs */}
                    <div>
                        <form
                        onSubmit={(e)=>{
                            e.preventDefault()
                            appendSearchHistory(searchParams)
                            handleSearchFormSubmit()
                        }}
                        >
                            {/* search Term Input */}
                            <input
                                className='border w-[50vw] rounded-t p-0 m-0'
                                value={searchParams.searchTerm}
                                onChange={(e) => {
                                    setSearchParams((draft) => { draft.searchTerm = e.target.value }
                                    )
                                }}
                            />

                            <div>
                                {/* Location Input */}
                                <input
                                    className='border w-[45vw] rounded-bl p-0 m-0'
                                    value={searchParams.address}
                                    list="searchLocationList"
                                    onChange={(e) => {
                                        setSearchParams((draft) => { draft.address = e.target.value }
                                        )
                                    }}
                                />

                                <datalist id="searchLocationList">
                                    <option className="font-['Roboto']" value="Current Location">Current Location</option>
                                </datalist>

                                {/* Submit Button */}
                                <button
                                    className='border w-[5vw] rounded-br h-[26px] bg-gray-100'
                                    type='submit'
                                    // onClick={() => {
                                    //     appendSearchHistory(searchParams)
                                    //     handleSearchFormSubmit()
                                    // }}
                                ><RxMagnifyingGlass /></button>
                            </div>
                        </form>
                    </div>
                <div className="flex md:order-2">
                    {/* IG Icon */}
                    <a href='https://www.instagram.com/hhqueen.official/' target="_blank">
                        <div
                            className='px-3'
                            
                        >
                            <BsInstagram
                                size={40}
                            />
                        </div>
                    </a>
                    <Dropdown
                        arrowIcon={false}
                        inline={true}
                        label={
                            <Avatar
                                placeholderInitials={localStorage.getItem('jwt') && `${userInfo.firstName[0]}${userInfo.lastName[0]}`}
                                rounded={true}
                            />}
                    >


                        {
                            localStorage.getItem('jwt') &&
                            <>
                                <Dropdown.Header>
                                    <span className="block text-sm">
                                        {`${userInfo.firstName} ${userInfo.lastName}`}
                                    </span>
                                    <span className="block truncate text-sm font-medium">
                                        {userInfo.email}
                                    </span>
                                </Dropdown.Header>
                            </>
                        }


                        {
                            !localStorage.getItem('jwt') &&
                            <>
                                <Link
                                    to="/login"
                                >
                                    <Dropdown.Item>
                                        Log In
                                    </Dropdown.Item>
                                </Link>


                                <Link
                                    to="/signup"
                                >
                                    <Dropdown.Item>
                                        Sign Up
                                    </Dropdown.Item>
                                </Link>
                            </>
                        }
                        {
                            localStorage.getItem('jwt') && jwt_decode(localStorage.getItem('jwt')).auth === "Admin" &&
                            <>
                                <Link
                                    to="/addnewrestaurant"
                                >
                                    <Dropdown.Item>
                                        Add New Restaurant
                                    </Dropdown.Item>
                                </Link>
                            </>
                        }
                        {/* <Dropdown.Item>
                                Dashboard
                            </Dropdown.Item>
                            <Dropdown.Item>
                                Settings
                            </Dropdown.Item>
                            <Dropdown.Item>
                                Earnings
                            </Dropdown.Item>
                            <Dropdown.Divider /> */}

                        {
                            localStorage.getItem('jwt') &&
                            // <div
                            //     className='flex'
                            // >
                            //     <p
                            //         onClick={handleLogOut}
                            //     >
                            //         Log Out
                            //     </p>
                            <Dropdown.Item
                                onClick={handleLogOut}
                            >
                                Sign out
                            </Dropdown.Item>
                            // </div>
                        }



                    </Dropdown>

                </div>
            </Navbar>

            {alpha2 &&
                <Alpha2BannerComp />
            }

        </div>
        </>
    )
}
