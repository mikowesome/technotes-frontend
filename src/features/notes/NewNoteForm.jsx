import { faSave } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { useAddNewNoteMutation } from './notesApiSlice'

const NewNoteForm = ({ users }) => {
    const navigate = useNavigate()

    const [addNewNote, {
        isLoading,
        isSuccess,
        isError,
        error
    }] = useAddNewNoteMutation()

    const [title, setTitle] = useState('')
    const [text, setText] = useState('')
    const [userId, setUserId] = useState(users[0].id)

    useEffect(() => {
        if (isSuccess) {
            setTitle('')
            setText('')
            setUserId('')
            navigate('/dash/notes')
        }
    }, [isSuccess, navigate])

    const onTitleChanged = (event) => setTitle(event.target.value)
    const onTextChanged = (event) => setText(event.target.value)
    const onUserIdChanged = (event) => setUserId(event.target.value)

    const canSave = [title, text, userId].every(Boolean) && !isLoading

    const onSaveNoteClicked = async (event) => {
        event.preventDefault()
        if (canSave) {
            await addNewNote({ user: userId, title, text })
        }
    }

    const options = users.map(user => {
        return (
            <option
                key={user.id}
                value={user.id}
            >
                {user.username}
            </option>
        )
    })

    const errClass = isError ? 'errmsg' : 'offscreen'
    const validTitleClass = !title ? 'form__input--incomplete' : ''
    const validTextClass = !text ? 'form__input--incomplete' : ''

    const content = (
        <>
            <p className={errClass}>{error?.data?.message}</p>

            <form className='form' onSubmit={onSaveNoteClicked}>
                <div className='form__title-row'>
                    <h2>New Note</h2>
                    <div className='form__action--buttons'>
                        <button
                            className='icon-button'
                            title='Save'
                            disabled={!canSave}
                        >
                            <FontAwesomeIcon icon={faSave} />
                        </button>
                    </div>
                </div>

                <label className='form__label' htmlFor='title'>Title:</label>
                <input 
                    className={`form__input ${validTitleClass}`}
                    type='text'
                    id='title'
                    name='title'
                    autoComplete='off'
                    value={title}
                    onChange={onTitleChanged}
                />

                <label className='form__label' htmlFor='text'>Text:</label>
                <textarea 
                    className={`form__input form__input--text ${validTextClass}`}
                    type='text'
                    id='text'
                    name='text'
                    value={text}
                    onChange={onTextChanged}
                />

                <label className='form__label form__checkbox-container' htmlFor='username'>ASSIGNED TO:</label>
                <select
                    id='username'
                    name='username'
                    className='form__select'
                    value={userId}
                    onChange={onUserIdChanged}
                >   
                    {options}
                </select>
            </form>
        </>
    )

  return content
}
export default NewNoteForm