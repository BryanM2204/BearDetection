import React, { useState } from "react";
import useSound from "use-sound";
import unchecked from "../resources/unchecked.svg";
import checked from "../resources/checked.svg";
import leftarrow from "../resources/leftarrow.svg";
import rightarrow from "../resources/rightarrow.svg";
import playbutton from "../resources/playbutton.svg";
import airhornSound from "../resources/airhorn.mp3";
import glassSound from "../resources/glass.wav";
import whistleSound from "../resources/whistle.wav";
import potsnpansSound from "../resources/potsnpans.mp3";
import laserSound from "../resources/laser.mp3";
import './Config.css';

const Config = () => {
  const [sidebarState, setSidebarState] = useState("sidebar-open");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [genInterval, setGenInterval] = useState(20);
  const [detInterval, setDetInterval] = useState(60);
  const [imgLimit, setImgLimit] = useState(10);
  const [sounds, setSounds] = useState([]);
  const [triggerAlarm, setTriggerAlarm] = useState([]);
  const [detect, setDetect] = useState([]);
  const [currentTab, setCurrentTab] = useState("Detectable Entities");
  const [alarmLen, setAlarmLen] = useState(10)
  const [airhorn] = useSound(airhornSound);
  const [glass] = useSound(glassSound);
  const [whistle] = useSound(whistleSound);
  const [potsnpans] = useSound(potsnpansSound);
  const [laser] = useSound(laserSound);

  const PlayButton = (props) => {

    const PlaySound = (sound) => {
      sound()
    }

    return (
      <div className="checkbox" onContextMenu={(e)=> e.preventDefault()}>
        <img src={playbutton} alt={props.value} onClick={() => PlaySound(props.sound)}></img>
      </div>
  );
  }

  const Checkbox = (props) => {

    var defaultCheck = false;

    switch(props.setting) {
      case "sounds":
        defaultCheck = sounds.includes(props.value) ? true : false;
        break;
      case "triggerAlarm":
        defaultCheck = triggerAlarm.includes(props.value) ? true : false;
        break;
      case "detect":
        defaultCheck = detect.includes(props.value) ? true : false;
        break;
      default:
    }

    const [isChecked, setIsChecked] = useState(defaultCheck)
    const [icon, setIcon] = useState(defaultCheck ? checked : unchecked)
    const [altText, setAltText] = useState(defaultCheck ? "checked" : "unchecked")
  

    const SwitchCheck = (setting, value) => {
      

      console.debug("Checked")
      if (isChecked) {
        setIsChecked(false);
        setIcon(unchecked)
        setAltText("unchecked")
        var ind;

        switch(setting) {
          case "sounds":
            ind = sounds.indexOf(value)
            sounds.splice(ind, 1)
            break;
          case "triggerAlarm":
            ind = triggerAlarm.indexOf(value)
            triggerAlarm.splice(ind, 1)
            break;
          case "detect":
            ind = detect.indexOf(value)
            detect.splice(ind, 1)
            break;
          default:
            
        }
      }
      else {
        setIsChecked(true);
        setIcon(checked)
        setAltText("checked");

        switch(setting) {
          case "sounds":
            var curSounds = sounds;
            curSounds.push(value);
            setSounds(curSounds)
            break;
          case "triggerAlarm":
            var triggers = triggerAlarm;
            triggers.push(value);
            setTriggerAlarm(triggers);
            break;
          case "detect":
            var detectables = detect;
            detectables.push(value);
            setDetect(detectables);
            break;
          default:
        }
      }
    }

    return (
        <div className="checkbox" onContextMenu={(e)=> e.preventDefault()}>
          <img src={icon} alt={altText} onClick={() => SwitchCheck(props.setting, props.value)}></img>
        </div>
    );
  }

  const SwitchTab = (name) => {
    console.log(name); 
    setCurrentTab(name);
    
    switch(name) {
      case "Detectable Entities":
        document.getElementById('tab1').className = "selected-tab";
        document.getElementById('tab2').className = "sidebar-tab";
        document.getElementById('tab3').className = "sidebar-tab";
        document.getElementById('detect').style.display = "table";
        document.getElementById('alarm').style.display = "none";
        document.getElementById('misc').style.display = "none";
        break;
      case "Customize Alarm":
        document.getElementById('tab1').className = "sidebar-tab";
        document.getElementById('tab2').className = "selected-tab";
        document.getElementById('tab3').className = "sidebar-tab";
        document.getElementById('detect').style.display = "none";
        document.getElementById('alarm').style.display = "table";
        document.getElementById('misc').style.display = "none";
        break;
      case "Misc. Settings":
        document.getElementById('tab1').className = "sidebar-tab";
        document.getElementById('tab2').className = "sidebar-tab";
        document.getElementById('tab3').className = "selected-tab";
        document.getElementById('detect').style.display = "none";
        document.getElementById('alarm').style.display = "none";
        document.getElementById('misc').style.display = "table";
        break;
      default:
    }
        
  }

  const Tab = (props) => {

    const state = currentTab === props.name ? "selected-tab" : "sidebar-tab";

    return (
        <div className={state} onContextMenu={(e)=> e.preventDefault()}>
          <button id={props.id} className={state} onClick={() => SwitchTab(props.name)}>{props.name}</button>
        </div>
    );
  }

  const SwitchSidebar = () => {
    console.log(sidebarState)
    if (sidebarOpen) {
      setSidebarState("sidebar-closed");
      setSidebarOpen(false)
      document.getElementById('open').style.display = 'none';
      document.getElementById('closed').style.display = 'block';
    }
    else {
      setSidebarState("sidebar-open");
      setSidebarOpen(true)
      document.getElementById('open').style.display = 'block';
      document.getElementById('closed').style.display = 'none';
    }    
  }

  const Collapse = (props) => {

    return (
      <div className={props.state} onContextMenu={(e)=> e.preventDefault()}>
        <img display="hidden" src={props.state === "sidebar-open" ? leftarrow : rightarrow} alt={props.state} onClick={SwitchSidebar}></img>
      </div>
  );
  }

  const Submit = (props) => {

    const SendConfig = async () => {
      var config = {
        "sounds": sounds,
        "triggerAlarm": triggerAlarm,
        "detect": detect,
        "genInterval": Number(genInterval),
        "detInterval": Number(detInterval),
        "alarmLen": Number(alarmLen),
        "imgLimit": Number(imgLimit),
      }

      console.log(JSON.stringify(config));

      const response = await fetch('http://127.0.0.1:5000/setconfig', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(config)
      });


    }

    return (
      <div className="submitBtn" onContextMenu={(e)=> e.preventDefault()}>
        <button className="submitBtn" onClick={SendConfig}>Send</button>
      </div>
    );
  }

  return (
    <div className="content">
      <div id="open" className="sidebar">
        <Collapse state={sidebarState}></Collapse>
        <Tab id="tab1" name="Detectable Entities"></Tab>
        <Tab id="tab2" name="Customize Alarm"></Tab>
        <Tab id="tab3" name="Misc. Settings"></Tab>
        <Submit></Submit>
      </div>
      <div id="closed" style={{display: "none"}} className="open-sidebar">
        <Collapse state={sidebarState}></Collapse>
      </div>
      <div id="page" className="page">
        <table id="detect" className="settings">
          <tr className="column-names">
            <th>Entity</th>
            <th className="select">Detect</th>
            <th className="select">Trigger Alarm</th>
          </tr>
          <tr>
            <td className="table-text">Bear</td>
            <td><Checkbox setting="detect" value={21}></Checkbox></td>
            <td><Checkbox setting="triggerAlarm" value={21}></Checkbox></td>
          </tr>
          <tr>
            <td className="table-text">Cat</td>
            <td><Checkbox setting="detect" value={15}></Checkbox></td>
            <td><Checkbox setting="triggerAlarm" value={15}></Checkbox></td>
          </tr>
          <tr>
            <td className="table-text">Dog</td>
            <td><Checkbox setting="detect" value={16}></Checkbox></td>
            <td><Checkbox setting="triggerAlarm" value={16}></Checkbox></td>
          </tr>
          <tr>
            <td className="table-text">Person</td>
            <td><Checkbox setting="detect" value={0}></Checkbox></td>
            <td><Checkbox setting="triggerAlarm" value={0}></Checkbox></td>
          </tr>
        </table>
        <table style={{display: "none"}} id="alarm" className="settings">
          <tr className="column-names">
            <th>Sound</th>
            <th className="select">Include</th>
            <th className="select">Play</th>
          </tr>
          <tr>
            <td className="table-text">Airhorn</td>
            <td><Checkbox setting="sounds" value={"airhorn"}></Checkbox></td>
            <td><PlayButton value="airhorn" sound={airhorn}></PlayButton></td>
          </tr>
          <tr>
            <td className="table-text">Glass</td>
            <td><Checkbox setting="sounds" value={"glass"}></Checkbox></td>
            <td><PlayButton value="glass" sound={glass}></PlayButton></td>
          </tr>
          <tr>
            <td className="table-text">Whistle</td>
            <td><Checkbox setting="sounds" value={"whistle"}></Checkbox></td>
            <td><PlayButton value="whistle" sound={whistle}></PlayButton></td>
          </tr>
          <tr>
            <td className="table-text">Laser</td>
            <td><Checkbox setting="sounds" value={"laser"}></Checkbox></td>
            <td><PlayButton value="laser" sound={laser}></PlayButton></td>
          </tr>
          <tr>
            <td className="table-text">Pots and Pans</td>
            <td><Checkbox setting="sounds" value={"potsnpans"}></Checkbox></td>
            <td><PlayButton value="potsnpans" sound={potsnpans}></PlayButton></td>
          </tr>
        </table>
        <table style={{display: "none"}} id="misc" className="settings">
          <tr className="column-names">
            <th>Option</th>
            <th className="select">Value</th>
          </tr>
          <tr>
            <td className="table-text">General Capture Interval</td>
            <td className="select"><input
              type="number"
              id="genCap"
              value={genInterval}
              onChange={e => setGenInterval(e.target.value)}
              onWheel={(e) => e.target.blur()}
            /></td>
          </tr>
          <tr>
            <td className="table-text">Detection Interval</td>
            <td className="select"><input
              type="number"
              id="detCap"
              value={detInterval}
              onChange={e => setDetInterval(e.target.value)}
              onWheel={(e) => e.target.blur()}
            /></td>
          </tr>
          <tr>
            <td className="table-text">Alarm Length</td>
            <td className="select"><input
              type="number"
              id="alrmLen"
              value={alarmLen}
              onChange={e => setAlarmLen(e.target.value)}
              onWheel={(e) => e.target.blur()}
            /></td>
          </tr>
          <tr>
            <td className="table-text">Image Limit</td>
            <td className="select"><input
              type="number"
              id="imgLim"
              value={imgLimit}
              onChange={e => setImgLimit(e.target.value)}
              onWheel={(e) => e.target.blur()}
            /></td>
          </tr>
        </table>
      </div>
    </div>
  );
};

export default Config;
