import { useState } from 'react';
import { useOutletContext, useNavigate } from  'react-router-dom';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { setUserInfo } from '../components/common';
import { Form, FormField, Input, Button, Divider, Icon, } from 'semantic-ui-react';


function Signin() {
    const { onSetUser, onSetCartItems, onSetOrders, onSetReviews, onSetSellerItems } = useOutletContext();
    const [ isSigninFail, setIsSigninFail ] = useState(false);
    const navigate = useNavigate();

    const formSchema = yup.object().shape({
        username: yup.string().min(5, 'Must be between 5 and 20 characters')
            .max(20, 'Must be between 5 and 20 characters'),
        password: yup.string().min(5, 'Must be at least 5 characters long'),
    });

    const formik = useFormik({
        initialValues: {
            username: '',
            password: '',
        },
        validationSchema: formSchema,
        onSubmit: (values) => {
            // console.log('In Signin, OnSubmit Called!!!!');
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
                        // console.log('In Signin, data: ', data);
                        // onSetUser(data);
                        setUserInfo(data, onSetUser, onSetCartItems, onSetOrders, onSetReviews, onSetSellerItems);
                        navigate('/');
                    } else {
                        console.log('in Signin, error: ', data.message);
                        setIsSigninFail(true);
                    }
                })
            );
        },
    });

    return (
        <div style={{display: 'grid', gridTemplateColumns: '1fr max-content 1fr', alignItems: 'center', 
            minWidth: '815px', }} >
            <div />
            <div style={{width: '400px', height: 'auto', padding: '20px 30px', margin: '100px 20px', 
                border: '1px solid lightgrey', borderRadius: '5px'}}>
                <h1>Sign in</h1>
                <Form onSubmit={formik.handleSubmit}>
                    <FormField>
                        <label>Username</label>
                        <Input id='username' name='username' type='text' 
                            value={formik.values.username} 
                            onChange={formik.handleChange} onBlur={formik.handleBlur} />
                        {formik.errors.username && formik.touched.username && 
                            <div className='formik-warning'>
                                <Icon name='warning circle' />
                                {formik.errors.username}
                            </div>
                        }
                    </FormField>
                    <FormField>
                        <label>Password</label>
                        <Input id='password' name='password' type='password' 
                            value={formik.values.password}
                            onChange={formik.handleChange} onBlur={formik.handleBlur} />
                        {formik.errors.password && formik.touched.password && 
                            <div className='formik-warning'>
                                <Icon name='warning circle' />
                                {formik.errors.password}
                            </div>
                        }
                    </FormField>
                    {
                        isSigninFail ? 
                        <div className='formik-warning'>
                            <Icon name='warning circle' />
                            Invalid username or password. Please, try again.
                        </div> : 
                        null
                    }
                    
                    <Button type='submit' color='yellow' style={{width: '100%',}}>Continue</Button>
                </Form>
                <Divider />
                {/* <hr style={{margin: '20px 0', color: 'red', }}/> */}
                <Button type='button' onClick={()=> navigate('/signup')} 
                    basic style={{width: '100%',}}>Create your account</Button>
            </div>
            <div />
        </div>
    );

}

export default Signin;