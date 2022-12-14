import {useState, useEffect} from "react"
import axios from "axios"

export default function FileUploader({imgFile, setImgFile}) {
	const [selectedFile, setSelectedFile] = useState(undefined)
    const [preview, setPreview] = useState(undefined)

	// useEffect to render image preview
	useEffect(()=>{
		// resets preview to undefined if there is no file selected
		if (imgFile === null ) {
			setSelectedFile(undefined)
			setPreview(undefined)
			return
		}
		
		if (!selectedFile) {
            setPreview(undefined)
            return
        }
		// creates object URL to be set using selected file
		const objURL = URL.createObjectURL(selectedFile)
		// sets preview with object URL for image
		setPreview(objURL)
		//revokes URL on unmount
		return () => URL.revokeObjectURL(objURL)
	},[selectedFile, imgFile])

	// handles file input / image selection
	const handleFileInput = async (e) => {
		// if there is no file in e or if the target file length is 0, set selected file to undefined and return
			if (!e.target.files || e.target.files.length === 0) {
				setSelectedFile(undefined)
				return
			}
			// console.log(e.target.files[0])
			//sets selected file with the file selected
			setSelectedFile(e.target.files[0])
			const fd = new FormData()
			fd.set("image", e.target.files[0])
			setImgFile(fd)
			// console.log("input completed?")
		}

	return (
		<div
		className="max-h-[200px] font-press-start text-[8px] text-black dark:font-sans dark:text-[14px] dark:text-white dark:font-bold"
		>
			FileUploader
			{/* image preview */}
			<div
			className="flex justify-center"
			>
				{selectedFile 
				&& 
				<img src={preview} className="object-fill max-h-[100px] font-press-start text-[12px] text-black"/>
				// <img src={preview} className={`object-contain h-[10px] w-[10px]`}/>
				}
			</div>
				{/* file upload input */}
				<label htmlFor='image' hidden>Upload an Image</label>
                <input
                    // no value on this controlled form
                    type="file"
                    id="image"
					className="max-h-[50px]"
					required
					onInput={e => {
						handleFileInput(e)
					}}
                />
		</div>
	)
}
