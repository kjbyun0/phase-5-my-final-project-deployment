import { useState } from 'react';
import { useOutletContext, useNavigate } from  'react-router-dom';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { Form, FormField, Input, FormButton, Button, Divider, } from 'semantic-ui-react';


function Signin() {
    const { onSetUser } = useOutletContext();
    const [ signinFail, setSigninFail ] = useState(false);
    const navigate = useNavigate();

    const formSchema = yup.object().shape({
        username: yup.string().min(6, 'Username must be at least 6 characters long.'),
        password: yup.string().min(6, 'Password must be at least 6 characters long.'),
    });

    const formik = useFormik({
        initialValues: {
            username: '',
            password: '',
        },
        validationSchema: formSchema,
        onSubmit: (values) => {
            console.log('In Signin, OnSubmit Called!!!!');
            fetch('/authenticate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json,'
                },
                body: JSON.stringify(values),
            })
            .then(r => 
                r.json().then(data => {
                    if (r.ok) {
                        console.log('In Signin, data: ', data);
                        onSetUser(data);
                        navigate('/');
                    } else {
                        console.log('in Signin, error: ', data.message);
                        setSigninFail(true);
                    }
                })
            );
        },
    });

    return (
        <div style={{width: '100%', height: '100%', }}>
            <div style={{width: '400px', height: 'auto', padding: '20px 30px', margin: '100px auto 0',
                border: '1px solid lightgrey', borderRadius: '5px'}}>
                <h1>Sign in</h1>
                <Form onSubmit={formik.handleSubmit}>
                    <FormField>
                        <label>Username</label>
                        <Input id='username' name='username' type='text' 
                            value={formik.values.username} 
                            onChange={formik.handleChange} onBlur={formik.handleBlur} />
                        {formik.errors.username && formik.touched.username && <div style={{color: 'red',}}>{formik.errors.username}</div>}
                    </FormField>
                    <FormField>
                        <label>Password</label>
                        <Input id='password' name='password' type='password' 
                            value={formik.values.password}
                            onChange={formik.handleChange} onBlur={formik.handleBlur} />
                        {formik.errors.password && formik.touched.password && <div style={{color: 'red',}}>{formik.errors.password}</div>}
                    </FormField>
                    <div style={{color: 'red',}}>{signinFail ? 'Invalid username or password. Please, try again.' : null}</div>
                    <Button type='submit' color='yellow' style={{width: '100%',}}>Continue</Button>
                </Form>
                <Divider horizontal>New to Flatzone</Divider>
                {/* <hr style={{margin: '20px 0', color: 'red', }}/> */}
                <Button type='button' onClick={()=> console.log('Click')} 
                    basic style={{width: '100%',}}>Create your account</Button>
            </div>
        </div>
    );

}

export default Signin;