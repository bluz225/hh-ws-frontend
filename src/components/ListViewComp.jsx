import React from 'react'
import RestListDetailCard from './RestListDetailCard'

export default function ListViewComp({ dow, allRestaurants }) {

  // console.log(allRestaurants)

  const listRestaurants = allRestaurants.map((restaurant) => {
    return (
        <RestListDetailCard
          key={`restCard-${restaurant._id}`}
          restaurantInfo={restaurant}
          dow={dow}
        />
    )
  })
  return (
    <>
      <div
        className='w-full'
      >
        <ul>
          {listRestaurants}
        </ul>
      </div>
    </>
  )
}
