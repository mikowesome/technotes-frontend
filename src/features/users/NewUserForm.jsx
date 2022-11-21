import { faSave } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { ROLES } from "../../config/roles"
import { useAddNewUserMutation } from "./usersApiSlice"

const USER_REGEX = /^[A-z]{3,20}$/
const PWD_REGEX = /^[A-z0-9!@#$%]{4,12}/

const NewUserForm = () => {
    const navigate = useNavigate()

    const [addNewUser, {
        isLoading,
        isSuccess,
        isError,
        error
    }] = useAddNewUserMutation()

    const [formData, setFormData] = useState({
        username: '',
        password: '',
    })
    const [validUsername, setValidUsername] = useState(false)
    const [validPassword, setValidPassword] = useState(false)
    const [roles, setRoles] = useState(['Employee'])

    const handleFormChange = (event) => {
        const { name, value } = event.target
        setFormData(prevFormData => {
            return {
                ...prevFormData,
                [name]: value
            }
        })
    
    }

    const handleRolesChanged = (event) => {
        const values = Array.from(
            event.target.selectionOptions,
            (option) => option.value
        )
        setRoles(values)
    }

    useEffect(() => {
        setValidUsername(USER_REGEX.test(formData.username))
    }, [formData.username])
    
    useEffect(() => {
        setValidPassword(PWD_REGEX.test(formData.password))
    }, [formData.password])

    useEffect(() => {
        if (isSuccess) {
            setFormData({
                username: '',
                password: '',
            })
            navigate('/dash/users')
        }
    }, [isSuccess, navigate])

    const canSave = [roles.length, validUsername, validPassword].every(Boolean) && !isLoading

    const onSaveUserClicked = async (event) => {
        event.preventDefault()
        if (canSave) {
            await addNewUser({ username: formData.username, password: formData.password, roles })
        }
    }

    const options = Object.values(ROLES).map(role => {
        return (
            <option
                key={role}
                value={role}
            >
                {role}
            </option>
        )
    })

    const errClass = isError ? 'errmsg' : 'offscreen'
    const validUserClass = !validUsername ? 'form__input--incomplete' : ''
    const validPasswordClass = !validPassword ? 'form__input--incomplete' : ''
    const validRolesClass = !Boolean(roles.length) ? 'form__input--incomplete' : ''

    const content = (
        <>
            <p className={errClass}>{error?.data?.message}</p>

            <form className='form' onSubmit={onSaveUserClicked}>
                <div className='form__title-row'>
                    <h2>New User</h2>
                    <div className='form__action-buttons'>
                        <button
                            className='icon-button'
                            title='save'
                            disabled={!canSave}
                        >
                            <FontAwesomeIcon icon={faSave} cursor='pointer' />
                        </button>
                    </div>
                </div>
                <label className='form__label' htmlFor='username'>
                    Username: <span className='nowrap'>[3-20 letters]</span>
                </label>
                <input 
                    className={`form__input ${validUserClass}`}
                    id='username'
                    name='username'
                    type='text'
                    autoComplete='off'
                    value={formData.username}
                    onChange={handleFormChange}
                />

                <label className='form__label' htmlFor='password'>
                    Password: <span className='nowrap'>[4-12 chars incl. !@#$%]</span>
                </label>
                <input 
                    className={`form__input ${validPasswordClass}`}
                    id='password'
                    name='password'
                    type='text'
                    autoComplete='off'
                    value={formData.password}
                    onChange={handleFormChange}
                />

                <label className='form__label' htmlFor='roles'>ASSIGNED ROLES:</label>
                <select
                    id='roles'
                    name='roles'
                    className={`form__input ${validRolesClass}`}
                    multiple={true}
                    size='3'
                    value={roles}
                    onChange={handleRolesChanged}
                >
                    {options}
                </select>
            </form>
        </>
    )



    return content
}
export default NewUserForm