import React from 'react'
import { Modal } from 'flowbite-react'
import YelpCard from '../YelpCard'

export default function YelpResponseModal({yelpList = [], onClose,modalOpen,handlePickOneYelpRestaurant}) {
  // console.log("yelpList",yelpList)
  const mapYelpBusinesses = yelpList.map((business,idx)=>{
    return(
      <>
      <div
      className=''
        onClick={()=>{
          handlePickOneYelpRestaurant(business)
          onClose()
        }}
      >
        <YelpCard
          business={business}
        />
      </div>
      </>
    )
  })
  
  return (
    <>
      <Modal
        show={modalOpen}
        onClose={onClose}
      >
        <Modal.Header>
        Yelp Responses - WIP - ADD PAGINATION
        </Modal.Header>
        <Modal.Body>
          <div
          className='h-[70vh] overflow-y-auto'
          >
            {mapYelpBusinesses}
          </div>

        </Modal.Body>
        <Modal.Footer>

        </Modal.Footer>
      </Modal>
    </>
  )
}
