import React from 'react'

export default function Alpha2BannerComp() {
  return (
    <div
    className='flex flex-col items-center'
    >
        <h1
        className='py-2'
        >Welcome to hhQueen Alpha 2.0!!</h1>
        {/* feedback a tag */}
        <a 
        className='text-sky-600 underline pb-2'
        href="https://docs.google.com/forms/d/e/1FAIpQLSfVTC5A4W9LeuPXbR70ROILcFwTKneThVzZTh9ATTw0DHWgrQ/viewform" target="_blank">
            Give Us Feedback!
        </a>
        {/* bug a tag */}
        <a 
        className='text-sky-600 underline pb-2'
        href="" target="_blank">
            BUGS?!?!! Bunny.
        </a>
    </div>
  )
}
