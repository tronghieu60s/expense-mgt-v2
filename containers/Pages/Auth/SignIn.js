import SignIn from 'components/Auth/SignIn';
import * as TEXT from 'constant/text';
import { Formik } from 'formik';
import { delay } from 'helpers/common';
import { useRouter } from 'next/router';
import React from 'react';
import { useDispatch } from 'react-redux';
import { hideLoadingUi, showLoadingUi } from 'redux/actions/ui.action';
import * as Yup from 'yup';
import Auth from 'containers/Pages/Auth/Auth';

const SignInContainer = (props) => {
  const router = useRouter();
  const dispatch = useDispatch();

  const initialValues = {
    username: '',
    password: '',
    remember: true,
  };

  const validationSchema = Yup.object().shape({
    username: Yup.string().required(TEXT.FIELD_IS_REQUIRED),
    password: Yup.string().required(TEXT.FIELD_IS_REQUIRED),
  });

  const onSubmit = async (values) => {
    dispatch(showLoadingUi());
    console.log(values);
    await delay(1000);
    dispatch(hideLoadingUi());
  };

  return (
    <Auth title={TEXT.LOGIN_TITLE} slogan={TEXT.LOGIN_SLOGAN}>
      <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={onSubmit}>
        <SignIn />
      </Formik>
    </Auth>
  );
};

SignInContainer.propTypes = {};

export default SignInContainer;
