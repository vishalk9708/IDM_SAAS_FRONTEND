import React, { useEffect } from "react";
import { useHistory } from "react-router-dom";
//import { Icon, Card } from 'react-materialize';
import getSessionData from "../utils/getSessionData";
//import setSessionData from '../utils/setSessionData';
//import Loader from './Loader';
//import Address from '../utils/Address'
//import { useStateValue } from '../StateProvider';

function Home() {
  let history = useHistory();
  let userData = getSessionData();
  //let [state, dispatch] = useStateValue();
  //let [LoaderState, setLoaderState] = useState();
  const redirect = (path) => history.push({ pathname: path });

  // eslint-disable-next-line
  useEffect(() => {
    //setLoaderState(true);
    console.log("USER ================", userData);

    if (!userData.isLoggedIn) redirect("/Login");
    else {
      if (userData.isAdmin) redirect("/AccessControl");
      else if (!userData.isAdmin) {
        if (userData.accountStatus === "PreActivation")
          redirect("/AccessDenied");
        else redirect("/AccessRequest");
        //else redirect('/Error404');
      } else redirect("/Error404");
    }
    // eslint-disable-next-line
  }, []);

  return <div className="card-container card-container-home"></div>;
}
export default Home;
