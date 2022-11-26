import { faSave, faTrashCan } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { ROLES } from '../../config/roles'
import { useUpdateUserMutation, useDeleteUserMutation } from './usersApiSlice'

const USER_REGEX = /^[A-z]{3,20}$/
const PWD_REGEX = /^[A-z0-9!@#$%]{4,12}/

const EditUserForm = ({ user }) => {
    const navigate = useNavigate()

    const [updateUser, {
        isLoading,
        isSuccess,
        isError,
        error
    }] = useUpdateUserMutation()

    const [deleteUser, {
        isSuccess: isDelSuccess,
        isError: isDelError,
        error: delerror
    }] = useDeleteUserMutation()

    const [formData, setFormData] = useState({
        username: user.username,
        password: user.password,
    })
    const [roles, setRoles] = useState(user.roles)
    const [active, setActive] = useState(user.active)
    const [validUsername, setValidUsername] = useState(false)
    const [validPassword, setValidPassword] = useState(false)

    const handleFormChange = (event) => {
        const { name, value } = event.target
        setFormData(prevFormData => {
            return {
                ...prevFormData,
                [name]: value
            }
        })
    
    }

    useEffect(() => {
        setValidUsername(USER_REGEX.test(formData.username))
    }, [formData.username])

    useEffect(() => {
        setValidPassword(PWD_REGEX.test(formData.password))
    }, [formData.password])

    useEffect(() => {
        if (isSuccess || isDelSuccess) {
            setFormData({
                username: '',
                password: '',
            })
            setRoles([])
            navigate('/dash/users')
        }
    }, [isSuccess, isDelSuccess, navigate])

    const onRolesChanged = event => {
        const values = Array.from(
            event.target.selectedOptions,
            (option) => option.value
        )
        setRoles(values)
    }

    const onActiveChanged = () => setActive(prevActive => !prevActive)

    const onSaveUserClicked = async (event) => {
        event.preventDefault()
        if (formData.password) {
            await updateUser({ id: user.id, username: formData.username, password: formData.password, roles, active})
        } else {
            await updateUser({ id: user.id, username: formData.username, roles, active})
        }
    }

    const onDeleteUserClicked = async () => {
        await deleteUser({ id: user.id })
    }

    let canSave
    if (formData.password) {
        canSave = [roles.length, validUsername, validPassword].every(Boolean) && !isLoading
    } else {
        canSave = [roles.length, validUsername].every(Boolean) && !isLoading
    }

    const errClass = (!isError || !isDelError) ? "errmsg" : "offscreen"
    const validUserClass = !validUsername ? 'form__input--incomplete' : ''
    const validPwdClass = formData.password && !validUsername ? 'form__input--incomplete' : ''
    const validRolesClass = !Boolean(roles.length) ? 'form__input--incomplete' : ''

    const errContent = (error?.data?.message || delerror?.data?.message) ?? ''

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

    const content = (
        <>
            <p className={errClass}>{errContent}</p>

            <form className='form' onSubmit={e => e.preventDefault()}>
                <div className='form__title-row'>
                    <h2>Edit User</h2>
                    <div className='form__action-buttons'>
                        <button
                            className='icon-button'
                            title='Save'
                            onClick={onSaveUserClicked}
                            disabled={!canSave}
                        >
                            <FontAwesomeIcon icon={faSave} cursor='pointer' />
                        </button>
                        <button
                            className='icon-button'
                            title='Delete'
                            onClick={onDeleteUserClicked}
                        >
                            <FontAwesomeIcon icon={faTrashCan} cursor='pointer' />
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
                    className={`form__input ${validPwdClass}`}
                    id='password'
                    name='password'
                    type='password'
                    autoComplete='off'
                    value={formData.password}
                    onChange={handleFormChange}
                />

                <label className='form__label form__checkbox-container' htmlFor='user-active'>ACTIVE:</label>
                <input 
                    className='form__checkbox'
                    id='user-active'
                    name='user-active'
                    type='checkbox'
                    checked={active}
                    onChange={onActiveChanged}
                />

                <label className='form__label' htmlFor='roles'>ASSIGNED ROLES:</label>
                <select
                    id='roles'
                    name='roles'
                    className={`form__input ${validRolesClass}`}
                    multiple={true}
                    size='3'
                    value={roles}
                    onChange={onRolesChanged}
                >
                    {options}
                </select>
            </form>
        </>
    )

  return content
}
export default EditUserForm