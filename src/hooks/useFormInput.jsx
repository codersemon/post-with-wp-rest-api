import { useState } from "react"

const useFormInput = (init) => {
    // const input state 
    const [input, setInput] = useState(init);

    // change action 
    const handleInputChange = (e) => {
        setInput((prevState) => ({
            ...prevState,
            [e.target.name]: e.target.value
        }))
    }

    // reset action 
    const handleResetForm = () => {
        setInput(init);
    }

  return {input, handleInputChange, handleResetForm, setInput}
}

export default useFormInput