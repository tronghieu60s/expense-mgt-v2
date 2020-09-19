import { objectJarsToArray } from 'common/jars';
import LayoutMainJars from 'components/Layout/Layout-Main-Jars';
import LayoutMainJarsItem from 'components/Layout/Layout-Main-JarsItem';
import { JARS } from 'constant/common';
import * as TEXT from 'constant/text';
import { delayLoading, toastCustom } from 'helpers/common';
import { objectTotalValues } from 'helpers/object';
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { hideLoadingUi, showLoadingUi } from 'redux/actions/ui.action';
import { setUser } from 'redux/actions/user.action';
import { updateUser } from 'utils/firebase';
import * as Yup from 'yup';

const arrJarsName = objectJarsToArray(JARS);
const jarsName = arrJarsName.map((jar) => jar.name);
const jarsColor = arrJarsName.map((jar) => jar.color);

const LayoutMainJarsContainer = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  const { balance } = user;
  const { percent } = balance;

  const [initialInputValues, setInitialInputValues] = useState(percent);
  const totalPercent = objectTotalValues(initialInputValues);
  const jarsValues = arrJarsName.map((jar) => percent[jar.nameCode]);

  const initialValues = { ...percent };
  const validationSchema = () => {
    const schema = {};
    for (const key in percent)
      if (percent.hasOwnProperty(key))
        schema[key] = Yup.number()
          .typeError(TEXT.FIELD_NOT_MATCHES)
          .required(TEXT.FIELD_IS_REQUIRED);
    return Yup.object().shape(schema);
  };

  const handleChange = (name, value) => {
    setInitialInputValues({
      ...initialInputValues,
      [name]: value || 0,
    });
  };

  const renderInputJarsItem = () => {
    let result = null;
    result = arrJarsName.map((jar) => {
      return <LayoutMainJarsItem key={jar.nameCode} jar={jar} handleChange={handleChange} />;
    });
    return result;
  };

  const onSubmit = async (values) => {
    dispatch(showLoadingUi());

    if (totalPercent === 100) {
      await updateUser(user._id, {
        balance: {
          ...balance,
          percent: values,
        },
      }).then((res) => {
        if (res) {
          toastCustom('success', TEXT.UPDATE_DATA_SUCCESS);
          dispatch(setUser(res));
        }
      });
    } else toastCustom('error', TEXT.JARS_PERCENT_OVER);

    await delayLoading();
    dispatch(hideLoadingUi());
  };

  return (
    <LayoutMainJars
      initialValues={initialValues}
      validationSchema={validationSchema()}
      onSubmit={onSubmit}
      jarsName={jarsName}
      jarsColor={jarsColor}
      jarsValues={jarsValues}
      totalPercent={totalPercent}
    >
      {renderInputJarsItem()}
    </LayoutMainJars>
  );
};

LayoutMainJarsContainer.propTypes = {};

export default React.memo(LayoutMainJarsContainer);
