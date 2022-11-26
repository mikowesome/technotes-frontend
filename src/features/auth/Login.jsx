import { useRef, useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { setCredentials } from './authSlice'
import { useLoginMutation } from './authApiSlice'
import usePersist from '../../hooks/usePersist'
import PulseLoader from 'react-spinners/PulseLoader'

const Login = () => {
	const navigate = useNavigate()
	const dispatch = useDispatch()
	const [login, { isLoading }] = useLoginMutation()

	const userRef = useRef()
	const errRef = useRef()
	const [username, setUsername] = useState('')
	const [password, setPassword] = useState('')
	const [errMsg, setErrMsg] = useState('')
	const [persist, setPersist] = usePersist()

	useEffect(() => {
		userRef.current.focus()
	}, [])

	useEffect(() => {
		setErrMsg('')
	}, [username, password])

	const handleUserInput = (event) => setUsername(event.target.value)
	const handlePasswordInput = (event) => setPassword(event.target.value)
	const handleToggle = () => setPersist(prev => !prev)

	const handleSubmit = async (event) => {
		event.preventDefault()
		try {
			const { accessToken } = await login({ username, password }).unwrap()
			dispatch(setCredentials({ accessToken }))
			setUsername('')
			setPassword('')
			navigate('/dash')
		} catch (error) {
			if (!error.status) {
				setErrMsg('No Server Response')
			} else if (error.status === 400) {
				setErrMsg('Missing Username or Password')
			} else if (error.status === 401) {
				setErrMsg('Unauthorized')
			} else {
				setErrMsg(error?.data?.message)
			}
		}
	}

	const errClass = errMsg ? 'errmsg' : 'offscreen'

	if (isLoading) return <PulseLoader color={ '#FFF' } />

	const content = (
		<section className='public'>
			<header>
				<h1>Employee Login</h1>
			</header>
			<main className='login'>
				<p ref={errRef} className={errClass} aria-live='assertive'>
					{errMsg}
				</p>
				<form className='form' onSubmit={handleSubmit}>
					<label htmlFor='username'>User:</label>
					<input 
						className='form__input' 
						type='text' 
						id='username' 
						name='username' 
						ref={userRef} 
						value={username} onChange={handleUserInput} 
						autoComplete='off' 
						required />
					<label htmlFor='password'>Password:</label>
					<input 
						className='form__input' 
						type='password' 
						id='password' 
						name='password' 
						value={password} 
						onChange={handlePasswordInput} 
						required />
					<button className='form__submit-button'>Sign In</button>

					<label htmlFor='persist' className='form__persist'>
						<input 
							type='checkbox'
							className='form__checkbox'
							id='persist'
							onChange={handleToggle}
							checked={persist}
						/>
						Trust This Device
					</label>
				</form>
			</main>
			<footer>
				<Link to='/'>Back to Home</Link>
			</footer>
		</section>
	)

	return content
}

export default Login
